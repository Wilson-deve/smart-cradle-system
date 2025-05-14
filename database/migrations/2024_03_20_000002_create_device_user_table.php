<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('device_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('relationship_type'); // owner, caretaker, viewer
            $table->json('permissions')->nullable();
            $table->timestamps();

            $table->unique(['device_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('device_user');
    }
}; 