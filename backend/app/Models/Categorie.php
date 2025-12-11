<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorie extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'Id_Categorie';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'Libelle_Cat',
    ];

    /**
     * Relation: Une catégorie a plusieurs produits
     */
    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class, 'Id_Categorie', 'Id_Categorie');
    }
}
