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
        Schema::create('contient', function (Blueprint $table) {
            $table->id();
            $table->foreignId('Id_Commande')->constrained('commandes', 'Id_Commande')->onDelete('cascade');
            $table->string('Ref_Produit');
            $table->integer('Quantite');
            $table->decimal('Prix_Unitaire', 10, 2);
            $table->timestamps();
            
            $table->foreign('Ref_Produit')->references('Ref_Produit')->on('produits')->onDelete('restrict');
            $table->unique(['Id_Commande', 'Ref_Produit']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contient');
    }
};
