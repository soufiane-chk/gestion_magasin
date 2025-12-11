<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contient extends Model
{
    protected $table = 'contient';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'Id_Commande',
        'Ref_Produit',
        'Quantite',
        'Prix_Unitaire',
    ];

    protected $casts = [
        'Quantite' => 'integer',
        'Prix_Unitaire' => 'decimal:2',
    ];

    /**
     * Relation: Contient appartient à une commande
     */
    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class, 'Id_Commande', 'Id_Commande');
    }

    /**
     * Relation: Contient appartient à un produit
     */
    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'Ref_Produit', 'Ref_Produit');
    }
}
