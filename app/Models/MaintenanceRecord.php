<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'type',
        'description',
        'performed_at',
        'performed_by',
        'next_maintenance_due',
        'status',
        'notes'
    ];

    protected $casts = [
        'performed_at' => 'datetime',
        'next_maintenance_due' => 'datetime'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
} 