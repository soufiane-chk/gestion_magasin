<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'Nom' => 'Benaddi',
                'Prenom' => 'Imane',
                'Telephone' => '0612345678',
                'Email' => 'imane.benaddi@example.com',
                'Adresse' => '123 Rue Mohammed V, Casablanca',
            ],
            [
                'Nom' => 'Alaoui',
                'Prenom' => 'Mohamed',
                'Telephone' => '0698765432',
                'Email' => 'mohamed.alaoui@example.com',
                'Adresse' => '45 Avenue Hassan II, Rabat',
            ],
            [
                'Nom' => 'Idrissi',
                'Prenom' => 'Fatima',
                'Telephone' => '0623456789',
                'Email' => 'fatima.idrissi@example.com',
                'Adresse' => '78 Boulevard Zerktouni, Casablanca',
            ],
            [
                'Nom' => 'Amrani',
                'Prenom' => 'Youssef',
                'Telephone' => '0634567890',
                'Email' => 'youssef.amrani@example.com',
                'Adresse' => '12 Rue Allal Ben Abdellah, Fès',
            ],
            [
                'Nom' => 'Bennani',
                'Prenom' => 'Sara',
                'Telephone' => '0645678901',
                'Email' => 'sara.bennani@example.com',
                'Adresse' => '56 Avenue Mohammed VI, Marrakech',
            ],
            [
                'Nom' => 'Tazi',
                'Prenom' => 'Ahmed',
                'Telephone' => '0656789012',
                'Email' => 'ahmed.tazi@example.com',
                'Adresse' => '89 Rue de la Liberté, Tanger',
            ],
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }
    }
}
