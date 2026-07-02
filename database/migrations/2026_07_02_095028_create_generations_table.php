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
        Schema::create('generations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tone_id')->nullable()->constrained('user_tones')->nullOnDelete();
            $table->string('content_type', 50)->index();
            $table->string('output_language', 10);
            $table->text('user_prompt');
            $table->text('tone_snapshot')->nullable();
            $table->text('full_prompt');
            $table->longText('ai_content')->nullable();
            $table->longText('edited_content')->nullable();
            $table->unsignedTinyInteger('credits_used')->default(1);
            $table->string('status', 20)->default('pending')->index();
            $table->timestamps();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generations');
    }
};
