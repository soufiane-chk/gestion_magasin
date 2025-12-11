<?php

namespace Database\Seeders;

use App\Models\Produit;
use App\Models\Categorie;
use App\Models\Fournisseur;
use Illuminate\Database\Seeder;

class ProduitSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Categorie::all();
        $fournisseurs = Fournisseur::all();

        $produits = [
            [
                'Ref_Produit' => 'PROD-ELEC-001',
                'Designation' => 'Ordinateur Portable HP Pavilion',
                'Prix_Achat' => 4500,
                'Prix_Vente' => 5500,
                'Qt_Stock' => 15,
                'Seuil_Alerte' => 5,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Informatique')->first()->Id_Categorie,
            ],
            [
                'Ref_Produit' => 'PROD-ELEC-002',
                'Designation' => 'Clavier Mécanique RGB',
                'Prix_Achat' => 300,
                'Prix_Vente' => 450,
                'Qt_Stock' => 4,
                'Seuil_Alerte' => 5,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Accessoires')->first()->Id_Categorie,
            ],
            [
                'Ref_Produit' => 'PROD-MOB-001',
                'Designation' => 'Chaise de Bureau Ergonomique',
                'Prix_Achat' => 800,
                'Prix_Vente' => 1200,
                'Qt_Stock' => 8,
                'Seuil_Alerte' => 3,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Mobilier')->first()->Id_Categorie,
            ],
            [
                'Ref_Produit' => 'PROD-ELEC-003',
                'Designation' => 'Écran Samsung 24 pouces',
                'Prix_Achat' => 1200,
                'Prix_Vente' => 1800,
                'Qt_Stock' => 12,
                'Seuil_Alerte' => 4,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Électronique')->first()->Id_Categorie,
            ],
            [
                'Ref_Produit' => 'PROD-ACC-001',
                'Designation' => 'Souris Sans Fil Logitech',
                'Prix_Achat' => 80,
                'Prix_Vente' => 120,
                'Qt_Stock' => 20,
                'Seuil_Alerte' => 10,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Accessoires')->first()->Id_Categorie,
            ],
            [
                'Ref_Produit' => 'PROD-VET-001',
                'Designation' => 'T-Shirt Coton Premium',
                'Prix_Achat' => 50,
                'Prix_Vente' => 90,
                'Qt_Stock' => 30,
                'Seuil_Alerte' => 10,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Vêtements')->first()->Id_Categorie,
            ],
            [
                'Ref_Produit' => 'PROD-ALIM-001',
                'Designation' => 'Café Premium 500g',
                'Prix_Achat' => 60,
                'Prix_Vente' => 95,
                'Qt_Stock' => 25,
                'Seuil_Alerte' => 8,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Alimentaire')->first()->Id_Categorie,
            ],
            [
                'Ref_Produit' => 'PROD-BEAU-001',
                'Designation' => 'Parfum Eau de Toilette 100ml',
                'Prix_Achat' => 200,
                'Prix_Vente' => 350,
                'Qt_Stock' => 18,
                'Seuil_Alerte' => 5,
                'Taux_TVA' => 20,
                'Id_Categorie' => $categories->where('Libelle_Cat', 'Beauté & Santé')->first()->Id_Categorie,
            ],
        ];

        foreach ($produits as $produit) {
            $prod = Produit::create($produit);
            
            // Associer des fournisseurs aléatoires
            $randomFournisseurs = $fournisseurs->random(rand(1, 2));
            $prod->fournisseurs()->attach($randomFournisseurs->pluck('Id_Fournisseur')->toArray());
        }
    }
}
