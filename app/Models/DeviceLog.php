<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'action',
        'duration',
        'data',
        'created_at'
    ];

    protected $casts = [
        'data' => 'array',
        'duration' => 'integer',
        'created_at' => 'datetime'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
} 