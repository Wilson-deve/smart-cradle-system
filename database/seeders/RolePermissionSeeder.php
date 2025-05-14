<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Get all permissions
        $permissions = DB::table('permissions')->get();
        
        // Get admin role
        $adminRole = DB::table('roles')->where('slug', 'admin')->first();
        
        if ($adminRole) {
            // Admin permissions
            $adminPermissions = [
                'user.view',
                'user.create',
                'user.update',
                'user.delete',
                'device.view',
                'device.create',
                'device.update',
                'device.delete',
                'device.control',
                'device.monitor',
                'device.health',
                'monitoring.view',
                'monitoring.control',
                'monitoring.alerts',
                'alerts.view',
                'alerts.update',
                'system.settings',
                'system.logs',
                'system.backup',
                'manage_alerts'
            ];
            
            foreach ($permissions as $permission) {
                if (in_array($permission->slug, $adminPermissions)) {
                    DB::table('role_permission')->updateOrInsert(
                        [
                            'role_id' => $adminRole->id,
                            'permission_id' => $permission->id,
                        ],
                        [
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }
        
        // Get parent role
        $parentRole = DB::table('roles')->where('slug', 'parent')->first();
        
        if ($parentRole) {
            // Parent permissions
            $parentPermissions = [
                'device.view',
                'device.control',
                'device.monitor',
                'device.health',
                'monitoring.view',
                'monitoring.control',
                'monitoring.alerts',
                'alerts.view',
                'alerts.update',
                'user.view',  // To manage babysitters
                'view_alerts',
                'view.dashboard'
            ];
            
            foreach ($permissions as $permission) {
                if (in_array($permission->slug, $parentPermissions)) {
                    DB::table('role_permission')->updateOrInsert(
                        [
                            'role_id' => $parentRole->id,
                            'permission_id' => $permission->id,
                        ],
                        [
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }
        
        // Get babysitter role
        $babysitterRole = DB::table('roles')->where('slug', 'babysitter')->first();
        
        if ($babysitterRole) {
            // Babysitter permissions
            $babysitterPermissions = [
                'device.view',
                'device.monitor',
                'device.health',
                'monitoring.view',
                'monitoring.alerts',
                'alerts.view',
                'alerts.update'
            ];
            
            foreach ($permissions as $permission) {
                if (in_array($permission->slug, $babysitterPermissions)) {
                    DB::table('role_permission')->updateOrInsert(
                        [
                            'role_id' => $babysitterRole->id,
                            'permission_id' => $permission->id,
                        ],
                        [
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }
    }
}
