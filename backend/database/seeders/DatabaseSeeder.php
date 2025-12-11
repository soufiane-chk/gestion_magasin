<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un utilisateur admin par défaut
        // Email: admin@magasin.ma
        // Mot de passe: admin123
        User::updateOrCreate(
            ['email' => 'admin@magasin.ma'],
            [
                'name' => 'Administrateur',
                'email' => 'admin@magasin.ma',
                'password' => Hash::make('admin123'),
                'Nom_Utilisateur' => 'admin',
                'Type_Utilisateur' => 'admin',
            ]
        );

        // Exécuter les autres seeders
        $this->call([
            CategorieSeeder::class,
            FournisseurSeeder::class,
            ClientSeeder::class,
            ProduitSeeder::class,
        ]);
    }
}
