<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectorContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'file_path',
        'type',
        'format',
        'size',
        'uploaded_by',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function devices()
    {
        return $this->hasManyThrough(
            Device::class,
            DeviceSetting::class,
            'current_content_id',
            'id',
            'id',
            'device_id'
        );
    }
} 