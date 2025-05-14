<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->string('type');
            $table->string('severity');
            $table->text('message');
            $table->string('status')->default('active');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['device_id', 'status', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('alerts');
    }
}; 