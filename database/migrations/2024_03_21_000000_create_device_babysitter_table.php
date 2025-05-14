<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('device_babysitter', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->foreignId('babysitter_id')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['device_id', 'babysitter_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('device_babysitter');
    }
}; 