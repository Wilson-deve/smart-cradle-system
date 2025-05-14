<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'group',
        'parent_id',
        'is_system',
        'display_name',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }

    public function parent()
    {
        return $this->belongsTo(Permission::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Permission::class, 'parent_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_permission');
    }
}
