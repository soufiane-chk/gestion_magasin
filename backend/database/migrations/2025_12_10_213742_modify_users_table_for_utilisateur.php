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
        Schema::table('users', function (Blueprint $table) {
            $table->string('Nom_Utilisateur')->unique()->after('email');
            $table->string('Type_Utilisateur')->default('utilisateur')->after('Nom_Utilisateur');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('Nom_Utilisateur');
            $table->dropColumn('Type_Utilisateur');
        });
    }
};
