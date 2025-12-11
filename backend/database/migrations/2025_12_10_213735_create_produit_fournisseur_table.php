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
        Schema::create('produit_fournisseur', function (Blueprint $table) {
            $table->id();
            $table->string('Ref_Produit');
            $table->foreignId('Id_Fournisseur')->constrained('fournisseurs', 'Id_Fournisseur')->onDelete('cascade');
            $table->timestamps();
            
            $table->foreign('Ref_Produit')->references('Ref_Produit')->on('produits')->onDelete('cascade');
            $table->unique(['Ref_Produit', 'Id_Fournisseur']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produit_fournisseur');
    }
};
