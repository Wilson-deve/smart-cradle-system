<?php

namespace App\Traits;

use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasRoles
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    public function hasRole(string $role): bool
    {
        return $this->roles->contains('slug', $role);
    }

    public function hasPermission(string $permission): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('slug', $permission);
            })
            ->exists();
    }

    public function assignRole($role): void
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        if (!$this->hasRole($role->slug)) {
            $this->roles()->attach($role->id);
        }
    }

    public function removeRole($role): void
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        $this->roles()->detach($role->id);
    }

    public function getPermissions(): array
    {
        return $this->roles()
            ->with('permissions')
            ->get()
            ->pluck('permissions.*.slug')
            ->flatten()
            ->unique()
            ->toArray();
    }
} 