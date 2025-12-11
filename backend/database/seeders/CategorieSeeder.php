<?php

namespace Database\Seeders;

use App\Models\Categorie;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['Libelle_Cat' => 'Électronique'],
            ['Libelle_Cat' => 'Informatique'],
            ['Libelle_Cat' => 'Mobilier'],
            ['Libelle_Cat' => 'Vêtements'],
            ['Libelle_Cat' => 'Accessoires'],
            ['Libelle_Cat' => 'Alimentaire'],
            ['Libelle_Cat' => 'Beauté & Santé'],
            ['Libelle_Cat' => 'Sport & Loisirs'],
        ];

        foreach ($categories as $categorie) {
            Categorie::create($categorie);
        }
    }
}
