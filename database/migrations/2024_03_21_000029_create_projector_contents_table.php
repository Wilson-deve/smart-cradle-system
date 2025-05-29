<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('projector_contents')) {
            Schema::create('projector_contents', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('file_path');
                $table->string('type')->default('image'); // image or video
                $table->string('format')->nullable();
                $table->integer('size')->nullable(); // in bytes
                $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('projector_contents');
    }
}; 