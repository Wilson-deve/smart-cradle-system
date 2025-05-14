<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sensor_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->string('type');
            $table->decimal('value', 8, 2);
            $table->string('unit');
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->index(['device_id', 'type', 'recorded_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('sensor_readings');
    }
}; 