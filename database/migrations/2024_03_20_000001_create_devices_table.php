<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('serial_number')->unique();
            $table->string('mac_address')->unique();
            $table->string('ip_address')->nullable();
            $table->string('status')->default('offline');
            $table->json('settings')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('devices');
    }
}; 