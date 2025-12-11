<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarteFidelite extends Model
{
    protected $table = 'carte_fidelites';
    protected $primaryKey = 'Num_Carte';
    public $incrementing = false;
    public $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'Num_Carte',
        'Points_Cumules',
        'Date_Creation',
        'Id_Client',
    ];

    protected $casts = [
        'Points_Cumules' => 'integer',
        'Date_Creation' => 'date',
    ];

    /**
     * Relation: Une carte de fidélité appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'Id_Client', 'Id_Client');
    }
}
