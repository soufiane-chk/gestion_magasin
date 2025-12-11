<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarteFidelite;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CarteFideliteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $cartes = CarteFidelite::with('client')->get();
        return response()->json($cartes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'Num_Carte' => 'required|string|unique:carte_fidelites,Num_Carte',
            'Points_Cumules' => 'nullable|integer|min:0|default:0',
            'Date_Creation' => 'required|date',
            'Id_Client' => 'required|exists:clients,Id_Client',
        ]);

        $carte = CarteFidelite::create($validated);
        $carte->load('client');
        return response()->json($carte, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $carte = CarteFidelite::with('client')->findOrFail($id);
        return response()->json($carte);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $carte = CarteFidelite::findOrFail($id);
        
        $validated = $request->validate([
            'Points_Cumules' => 'sometimes|required|integer|min:0',
            'Date_Creation' => 'sometimes|required|date',
            'Id_Client' => 'sometimes|required|exists:clients,Id_Client',
        ]);

        $carte->update($validated);
        $carte->load('client');
        return response()->json($carte);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $carte = CarteFidelite::findOrFail($id);
        $carte->delete();
        return response()->json(null, 204);
    }
}
