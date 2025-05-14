<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'device_id',
        'type',
        'message',
        'data',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function device(): BelongsTo{
        return $this->belongsTo(Device::class);
    }
}
