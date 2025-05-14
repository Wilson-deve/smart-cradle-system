<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'log_type',
        'action',
        'data',
        'user_id',
        'device_id',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    // Accessor to maintain compatibility with the frontend
    public function getTypeAttribute()
    {
        return $this->log_type;
    }

    public function getMessageAttribute()
    {
        return $this->action;
    }

    public function getMetadataAttribute()
    {
        return $this->data;
    }
}
