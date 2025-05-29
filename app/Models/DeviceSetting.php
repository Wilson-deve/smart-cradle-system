<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'current_lullaby_id',
        'current_content_id',
        'is_swinging',
        'swing_speed',
        'is_playing_music',
        'volume',
        'is_projector_on',
        'additional_settings',
    ];

    protected $casts = [
        'is_swinging' => 'boolean',
        'swing_speed' => 'integer',
        'is_playing_music' => 'boolean',
        'volume' => 'integer',
        'is_projector_on' => 'boolean',
        'additional_settings' => 'array',
    ];

    /**
     * Get the device that owns these settings.
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    /**
     * Get the current lullaby.
     */
    public function currentLullaby(): BelongsTo
    {
        return $this->belongsTo(Lullaby::class, 'current_lullaby_id');
    }

    /**
     * Get the current projector content.
     */
    public function currentContent(): BelongsTo
    {
        return $this->belongsTo(ProjectorContent::class, 'current_content_id');
    }
} 