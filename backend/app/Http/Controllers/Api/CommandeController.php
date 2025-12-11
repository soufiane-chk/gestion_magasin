<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Contient;
use App\Models\AppNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $commandes = Commande::with(['client', 'utilisateur', 'produits'])->get();
        return response()->json($commandes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'Nom_Commande' => 'required|string|unique:commandes,Nom_Commande',
            'date_Commande' => 'required|date',
            'Heure_Cmd' => 'required|date_format:H:i:s',
            'Total_TTC' => 'required|numeric|min:0',
            'Mode_Paiement' => 'required|string|max:255',
            'Id_Client' => 'nullable|exists:clients,Id_Client',
            'Id_Utilisateur' => 'required|exists:users,id',
            'produits' => 'required|array|min:1',
            'produits.*.Ref_Produit' => 'required|exists:produits,Ref_Produit',
            'produits.*.Quantite' => 'required|integer|min:1',
            'produits.*.Prix_Unitaire' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $commande = Commande::create($validated);

            foreach ($validated['produits'] as $produit) {
                // Vérifier stock et décrémenter
                $prodModel = \App\Models\Produit::lockForUpdate()->findOrFail($produit['Ref_Produit']);
                if ($prodModel->Qt_Stock < $produit['Quantite']) {
                    throw new \Exception("Stock insuffisant pour {$prodModel->Designation} ({$prodModel->Ref_Produit})");
                }
                $prodModel->Qt_Stock = $prodModel->Qt_Stock - $produit['Quantite'];
                $prodModel->save();

                // Notification rupture de stock si le stock atteint 0
                if ((int)$prodModel->Qt_Stock === 0) {
                    AppNotification::create([
                        'user_id' => optional($request->user())->id,
                        'title' => 'Rupture de stock',
                        'message' => "Le produit {$prodModel->Designation} ({$prodModel->Ref_Produit}) est en rupture de stock.",
                        'type' => 'stock_out',
                        'metadata' => [
                            'Ref_Produit' => $prodModel->Ref_Produit,
                            'Designation' => $prodModel->Designation,
                            'Qt_Stock' => $prodModel->Qt_Stock,
                        ],
                    ]);
                }

                // Enregistrer la ligne de commande
                Contient::create([
                    'Id_Commande' => $commande->Id_Commande,
                    'Ref_Produit' => $produit['Ref_Produit'],
                    'Quantite' => $produit['Quantite'],
                    'Prix_Unitaire' => $produit['Prix_Unitaire'],
                ]);
            }

            DB::commit();
            $commande->load(['client', 'utilisateur', 'produits']);

            // Notification: commande créée
            AppNotification::create([
                'user_id' => optional($request->user())->id,
                'title' => 'Nouvelle commande',
                'message' => "Commande {$commande->Nom_Commande} créée (Total: {$commande->Total_TTC})",
                'type' => 'order_created',
                'metadata' => [
                    'Id_Commande' => $commande->Id_Commande,
                    'Id_Client' => $commande->Id_Client,
                    'Id_Utilisateur' => $commande->Id_Utilisateur,
                ],
            ]);
            return response()->json($commande, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $commande = Commande::with(['client', 'utilisateur', 'produits'])->findOrFail($id);
        return response()->json($commande);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $commande = Commande::findOrFail($id);
        
        $validated = $request->validate([
            'Nom_Commande' => 'sometimes|required|string|unique:commandes,Nom_Commande,' . $id . ',Id_Commande',
            'date_Commande' => 'sometimes|required|date',
            'Heure_Cmd' => 'sometimes|required|date_format:H:i:s',
            'Total_TTC' => 'sometimes|required|numeric|min:0',
            'Mode_Paiement' => 'sometimes|required|string|max:255',
            'Id_Client' => 'nullable|exists:clients,Id_Client',
            'Id_Utilisateur' => 'sometimes|required|exists:users,id',
            'produits' => 'sometimes|required|array|min:1',
            'produits.*.Ref_Produit' => 'required|exists:produits,Ref_Produit',
            'produits.*.Quantite' => 'required|integer|min:1',
            'produits.*.Prix_Unitaire' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $commande->update($validated);

            if (isset($validated['produits'])) {
                $commande->contient()->delete();
                foreach ($validated['produits'] as $produit) {
                    Contient::create([
                        'Id_Commande' => $commande->Id_Commande,
                        'Ref_Produit' => $produit['Ref_Produit'],
                        'Quantite' => $produit['Quantite'],
                        'Prix_Unitaire' => $produit['Prix_Unitaire'],
                    ]);
                }
            }

            DB::commit();
            $commande->load(['client', 'utilisateur', 'produits']);
            return response()->json($commande);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $commande = Commande::findOrFail($id);
        $commande->delete();
        return response()->json(null, 204);
    }
}
