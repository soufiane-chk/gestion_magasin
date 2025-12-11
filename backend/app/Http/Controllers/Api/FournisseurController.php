<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FournisseurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $fournisseurs = Fournisseur::with('produits')->get();
        return response()->json($fournisseurs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'Nom_Societe' => 'required|string|max:255',
            'Telephone' => 'nullable|string|max:20',
            'Email' => 'nullable|email|max:255',
        ]);

        $fournisseur = Fournisseur::create($validated);
        return response()->json($fournisseur, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $fournisseur = Fournisseur::with('produits')->findOrFail($id);
        return response()->json($fournisseur);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $fournisseur = Fournisseur::findOrFail($id);
        
        $validated = $request->validate([
            'Nom_Societe' => 'sometimes|required|string|max:255',
            'Telephone' => 'nullable|string|max:20',
            'Email' => 'nullable|email|max:255',
        ]);

        $fournisseur->update($validated);
        return response()->json($fournisseur);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $fournisseur = Fournisseur::findOrFail($id);
        $fournisseur->delete();
        return response()->json(null, 204);
    }
}
