<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    protected $table = 'produits';
    protected $primaryKey = 'Ref_Produit';
    public $incrementing = false;
    public $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'Ref_Produit',
        'Designation',
        'Prix_Achat',
        'Prix_Vente',
        'Qt_Stock',
        'Seuil_Alerte',
        'Taux_TVA',
        'Id_Categorie',
    ];

    protected $casts = [
        'Prix_Achat' => 'decimal:2',
        'Prix_Vente' => 'decimal:2',
        'Taux_TVA' => 'decimal:2',
        'Qt_Stock' => 'integer',
        'Seuil_Alerte' => 'integer',
    ];

    /**
     * Relation: Un produit appartient à une catégorie
     */
    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class, 'Id_Categorie', 'Id_Categorie');
    }

    /**
     * Relation: Un produit peut être fourni par plusieurs fournisseurs
     */
    public function fournisseurs(): BelongsToMany
    {
        return $this->belongsToMany(
            Fournisseur::class,
            'produit_fournisseur',
            'Ref_Produit',
            'Id_Fournisseur'
        );
    }

    /**
     * Relation: Un produit peut être dans plusieurs commandes (via Contient)
     */
    public function contient(): HasMany
    {
        return $this->hasMany(Contient::class, 'Ref_Produit', 'Ref_Produit');
    }

    /**
     * Relation: Un produit peut être dans plusieurs commandes
     */
    public function commandes(): BelongsToMany
    {
        return $this->belongsToMany(
            Commande::class,
            'contient',
            'Ref_Produit',
            'Id_Commande'
        )->withPivot('Quantite', 'Prix_Unitaire');
    }
}
