<?php

namespace App\Models;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $tone_id
 * @property ContentType $content_type
 * @property OutputLanguage $output_language
 * @property string $user_prompt
 * @property string|null $tone_snapshot
 * @property string $full_prompt
 * @property string|null $ai_content
 * @property string|null $edited_content
 * @property int $credits_used
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'tone_id',
    'content_type',
    'output_language',
    'user_prompt',
    'tone_snapshot',
    'full_prompt',
    'ai_content',
    'edited_content',
    'credits_used',
    'status',
])]
class Generation extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'content_type' => ContentType::class,
            'output_language' => OutputLanguage::class,
            'credits_used' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<UserTone, $this>
     */
    public function tone(): BelongsTo
    {
        return $this->belongsTo(UserTone::class);
    }

    /**
     * @return HasOne<CreditTransaction, $this>
     */
    public function creditTransaction(): HasOne
    {
        return $this->hasOne(CreditTransaction::class);
    }
}
