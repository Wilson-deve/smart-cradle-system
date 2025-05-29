<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Babysitter extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'email',
        'phone',
        'status',
        'last_active_at',
    ];

    protected $casts = [
        'last_active_at' => 'datetime',
    ];

    /**
     * Get the parent that owns the babysitter.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Get the devices that the babysitter can access.
     */
    public function devices(): BelongsToMany
    {
        return $this->belongsToMany(Device::class, 'babysitter_device')
            ->withPivot('permissions')
            ->withTimestamps();
    }
} 