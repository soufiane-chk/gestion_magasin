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
        Schema::create('produits', function (Blueprint $table) {
            $table->string('Ref_Produit')->primary();
            $table->string('Designation');
            $table->decimal('Prix_Achat', 10, 2);
            $table->decimal('Prix_Vente', 10, 2);
            $table->integer('Qt_Stock')->default(0);
            $table->integer('Seuil_Alerte')->default(0);
            $table->decimal('Taux_TVA', 5, 2)->default(0);
            $table->foreignId('Id_Categorie')->constrained('categories', 'Id_Categorie')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
