<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lullaby extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'file_path',
        'duration',
        'format',
        'size',
        'uploaded_by',
    ];

    /**
     * Get the user who uploaded this lullaby.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the device settings that use this lullaby.
     */
    public function deviceSettings(): HasMany
    {
        return $this->hasMany(DeviceSetting::class, 'current_lullaby_id');
    }
} 