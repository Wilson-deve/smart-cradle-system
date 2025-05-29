<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('device_settings')) {
            Schema::table('device_settings', function (Blueprint $table) {
                // Add columns only if they don't exist
                if (!Schema::hasColumn('device_settings', 'swing_enabled')) {
                    $table->boolean('swing_enabled')->default(false);
                }
                if (!Schema::hasColumn('device_settings', 'swing_speed')) {
                    $table->integer('swing_speed')->default(1);
                }
                if (!Schema::hasColumn('device_settings', 'music_enabled')) {
                    $table->boolean('music_enabled')->default(false);
                }
                if (!Schema::hasColumn('device_settings', 'music_volume')) {
                    $table->integer('music_volume')->default(50);
                }
                if (!Schema::hasColumn('device_settings', 'projector_enabled')) {
                    $table->boolean('projector_enabled')->default(false);
                }
                if (!Schema::hasColumn('device_settings', 'projector_brightness')) {
                    $table->integer('projector_brightness')->default(50);
                }
                if (!Schema::hasColumn('device_settings', 'current_lullaby_id')) {
                    $table->foreignId('current_lullaby_id')->nullable()->constrained('lullabies')->nullOnDelete();
                }
                if (!Schema::hasColumn('device_settings', 'current_content_id')) {
                    $table->foreignId('current_content_id')->nullable()->constrained('projector_contents')->nullOnDelete();
                }
                if (!Schema::hasColumn('device_settings', 'auto_shutoff_time')) {
                    $table->integer('auto_shutoff_time')->default(30);
                }
                if (!Schema::hasColumn('device_settings', 'night_mode_enabled')) {
                    $table->boolean('night_mode_enabled')->default(false);
                }
                if (!Schema::hasColumn('device_settings', 'night_mode_start')) {
                    $table->time('night_mode_start')->default('22:00:00');
                }
                if (!Schema::hasColumn('device_settings', 'night_mode_end')) {
                    $table->time('night_mode_end')->default('06:00:00');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to drop columns in down() as they are part of the core functionality
    }
}; 