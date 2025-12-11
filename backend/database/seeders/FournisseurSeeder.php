<?php

namespace Database\Seeders;

use App\Models\Fournisseur;
use Illuminate\Database\Seeder;

class FournisseurSeeder extends Seeder
{
    public function run(): void
    {
        $fournisseurs = [
            [
                'Nom_Societe' => 'TechSupply Maroc',
                'Telephone' => '0522123456',
                'Email' => 'contact@techsupply.ma',
            ],
            [
                'Nom_Societe' => 'Global Electronics',
                'Telephone' => '0522987654',
                'Email' => 'info@globalelec.ma',
            ],
            [
                'Nom_Societe' => 'Furniture Pro',
                'Telephone' => '0522554433',
                'Email' => 'sales@furniturepro.ma',
            ],
            [
                'Nom_Societe' => 'Fashion Distributors',
                'Telephone' => '0522112233',
                'Email' => 'contact@fashiondist.ma',
            ],
            [
                'Nom_Societe' => 'Food & More',
                'Telephone' => '0522445566',
                'Email' => 'info@foodmore.ma',
            ],
        ];

        foreach ($fournisseurs as $fournisseur) {
            Fournisseur::create($fournisseur);
        }
    }
}
