<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'temperature',
        'humidity',
        'noise_level',
        'movement_detected',
        'wetness_detected',
        'light_level',
        'battery_level',
        'additional_data',
        'recorded_at',
    ];

    protected $casts = [
        'temperature' => 'float',
        'humidity' => 'float',
        'noise_level' => 'float',
        'movement_detected' => 'boolean',
        'wetness_detected' => 'boolean',
        'light_level' => 'float',
        'battery_level' => 'float',
        'additional_data' => 'array',
        'recorded_at' => 'datetime',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
} 