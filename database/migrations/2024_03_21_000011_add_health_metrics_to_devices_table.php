<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->integer('battery_level')->default(100);
            $table->integer('signal_strength')->default(100);
            $table->timestamp('last_maintenance_at')->nullable();
            $table->timestamp('next_maintenance_at')->nullable();
            $table->json('sensor_readings')->nullable();
            $table->json('maintenance_history')->nullable();
            $table->json('usage_statistics')->nullable();
        });
    }

    public function down()
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->dropColumn([
                'battery_level',
                'signal_strength',
                'last_maintenance_at',
                'next_maintenance_at',
                'sensor_readings',
                'maintenance_history',
                'usage_statistics',
            ]);
        });
    }
}; 