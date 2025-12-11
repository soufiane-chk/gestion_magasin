<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id('Id_Commande');
            $table->string('Nom_Commande')->unique();
            $table->date('date_Commande');
            $table->time('Heure_Cmd');
            $table->decimal('Total_TTC', 10, 2);
            $table->string('Mode_Paiement');
            $table->foreignId('Id_Client')->nullable()->constrained('clients', 'Id_Client')->onDelete('set null');
            $table->foreignId('Id_Utilisateur')->constrained('users', 'id')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
