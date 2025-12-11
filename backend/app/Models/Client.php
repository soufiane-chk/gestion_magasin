<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Client extends Model
{
    protected $table = 'clients';
    protected $primaryKey = 'Id_Client';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'Nom',
        'Prenom',
        'Telephone',
        'Email',
        'Adresse',
    ];

    /**
     * Relation: Un client peut passer plusieurs commandes
     */
    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class, 'Id_Client', 'Id_Client');
    }

    /**
     * Relation: Un client peut posséder plusieurs cartes de fidélité
     */
    public function cartesFidelite(): HasMany
    {
        return $this->hasMany(CarteFidelite::class, 'Id_Client', 'Id_Client');
    }
}
