<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\AppNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $produits = Produit::with(['categorie', 'fournisseurs'])->get();
        return response()->json($produits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'Ref_Produit' => 'required|string|unique:produits,Ref_Produit',
            'Designation' => 'required|string|max:255',
            'Prix_Achat' => 'required|numeric|min:0',
            'Prix_Vente' => 'required|numeric|min:0',
            'Qt_Stock' => 'required|integer|min:0',
            'Seuil_Alerte' => 'required|integer|min:0',
            'Taux_TVA' => 'required|numeric|min:0|max:100',
            'Id_Categorie' => 'required|exists:categories,Id_Categorie',
            'fournisseurs' => 'nullable|array',
            'fournisseurs.*' => 'exists:fournisseurs,Id_Fournisseur',
        ]);

        $produit = Produit::create($validated);

        if (isset($validated['fournisseurs'])) {
            $produit->fournisseurs()->attach($validated['fournisseurs']);
        }

        $produit->load(['categorie', 'fournisseurs']);

        // Notification: produit créé
        AppNotification::create([
            'user_id' => optional($request->user())->id,
            'title' => 'Produit créé',
            'message' => "{$produit->Designation} ({$produit->Ref_Produit}) a été ajouté",
            'type' => 'product_created',
            'metadata' => [
                'Ref_Produit' => $produit->Ref_Produit,
                'Id_Categorie' => $produit->Id_Categorie,
            ],
        ]);
        return response()->json($produit, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $produit = Produit::with(['categorie', 'fournisseurs', 'commandes'])->findOrFail($id);
        return response()->json($produit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $produit = Produit::findOrFail($id);
        
        $validated = $request->validate([
            'Designation' => 'sometimes|required|string|max:255',
            'Prix_Achat' => 'sometimes|required|numeric|min:0',
            'Prix_Vente' => 'sometimes|required|numeric|min:0',
            'Qt_Stock' => 'sometimes|required|integer|min:0',
            'Seuil_Alerte' => 'sometimes|required|integer|min:0',
            'Taux_TVA' => 'sometimes|required|numeric|min:0|max:100',
            'Id_Categorie' => 'sometimes|required|exists:categories,Id_Categorie',
            'fournisseurs' => 'nullable|array',
            'fournisseurs.*' => 'exists:fournisseurs,Id_Fournisseur',
        ]);

        $produit->update($validated);

        if (isset($validated['fournisseurs'])) {
            $produit->fournisseurs()->sync($validated['fournisseurs']);
        }

        $produit->load(['categorie', 'fournisseurs']);
        return response()->json($produit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();
        return response()->json(null, 204);
    }
}
