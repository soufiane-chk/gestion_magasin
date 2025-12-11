<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commande extends Model
{
    protected $table = 'commandes';
    protected $primaryKey = 'Id_Commande';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'Nom_Commande',
        'date_Commande',
        'Heure_Cmd',
        'Total_TTC',
        'Mode_Paiement',
        'Id_Client',
        'Id_Utilisateur',
    ];

    protected $casts = [
        'date_Commande' => 'date',
        'Total_TTC' => 'decimal:2',
    ];

    /**
     * Relation: Une commande appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'Id_Client', 'Id_Client');
    }

    /**
     * Relation: Une commande est gérée par un utilisateur
     */
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'Id_Utilisateur', 'id');
    }

    /**
     * Relation: Une commande contient plusieurs produits (via Contient)
     */
    public function contient(): HasMany
    {
        return $this->hasMany(Contient::class, 'Id_Commande', 'Id_Commande');
    }

    /**
     * Relation: Une commande contient plusieurs produits
     */
    public function produits(): BelongsToMany
    {
        return $this->belongsToMany(
            Produit::class,
            'contient',
            'Id_Commande',
            'Ref_Produit'
        )->withPivot('Quantite', 'Prix_Unitaire');
    }
}
