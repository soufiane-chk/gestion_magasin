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
        Schema::create('carte_fidelites', function (Blueprint $table) {
            $table->string('Num_Carte')->primary();
            $table->integer('Points_Cumules')->default(0);
            $table->date('Date_Creation');
            $table->foreignId('Id_Client')->constrained('clients', 'Id_Client')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carte_fidelites');
    }
};
