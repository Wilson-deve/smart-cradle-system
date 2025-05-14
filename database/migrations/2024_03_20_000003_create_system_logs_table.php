<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('system_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('log_type'); // error, warning, info, debug
            $table->string('action');
            $table->json('data')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_logs');
    }
}; 