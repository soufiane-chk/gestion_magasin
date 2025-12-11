<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Fournisseur extends Model
{
    protected $table = 'fournisseurs';
    protected $primaryKey = 'Id_Fournisseur';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'Nom_Societe',
        'Telephone',
        'Email',
    ];

    /**
     * Relation: Un fournisseur peut fournir plusieurs produits
     */
    public function produits(): BelongsToMany
    {
        return $this->belongsToMany(
            Produit::class,
            'produit_fournisseur',
            'Id_Fournisseur',
            'Ref_Produit'
        );
    }
}
