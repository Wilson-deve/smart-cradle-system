<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    protected $casts = [
        'is_default'=> 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->permissions()
            ->where('slug', $permission)
            ->exists();
    }

    public function givePermissionTo($permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }
        if (!$this->hasPermission($permission->slug)) {
            $this->permissions()->attach($permission->id);
        }
    }

    public function revokePermissionTo($permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }
        $this->permissions()->detach($permission->id);
    }
}
