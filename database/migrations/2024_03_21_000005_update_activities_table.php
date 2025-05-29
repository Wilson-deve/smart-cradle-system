<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (!Schema::hasColumn('activities', 'device_id')) {
                $table->foreignId('device_id')->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('activities', 'user_id')) {
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('activities', 'type')) {
                $table->string('type');
            }
            if (!Schema::hasColumn('activities', 'description')) {
                $table->text('description');
            }
            if (!Schema::hasColumn('activities', 'metadata')) {
                $table->json('metadata')->nullable();
            }
            if (!Schema::hasColumn('activities', 'performed_at')) {
                $table->timestamp('performed_at');
            }

            // Add indexes if they don't exist
            if (!Schema::hasIndex('activities', ['device_id', 'performed_at'])) {
                $table->index(['device_id', 'performed_at']);
            }
            if (!Schema::hasIndex('activities', ['user_id', 'performed_at'])) {
                $table->index(['user_id', 'performed_at']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropIndex(['device_id', 'performed_at']);
            $table->dropIndex(['user_id', 'performed_at']);
            $table->dropColumn([
                'device_id',
                'user_id',
                'type',
                'description',
                'metadata',
                'performed_at'
            ]);
        });
    }
} 