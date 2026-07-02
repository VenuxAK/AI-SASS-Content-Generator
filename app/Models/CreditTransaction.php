<?php

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $generation_id
 * @property int|null $stripe_payment_id
 * @property TransactionType $type
 * @property int $amount
 * @property int $balance_before
 * @property int $balance_after
 * @property string $description
 * @property Carbon|null $created_at
 */
#[Fillable([
    'user_id',
    'generation_id',
    'stripe_payment_id',
    'type',
    'amount',
    'balance_before',
    'balance_after',
    'description',
])]
class CreditTransaction extends Model
{
    use HasFactory;

    /**
     * The name of the "updated at" column.
     *
     * @var string|null
     */
    const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => TransactionType::class,
            'amount' => 'integer',
            'balance_before' => 'integer',
            'balance_after' => 'integer',
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
     * @return BelongsTo<Generation, $this>
     */
    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }

    /**
     * @return BelongsTo<StripePayment, $this>
     */
    public function stripePayment(): BelongsTo
    {
        return $this->belongsTo(StripePayment::class);
    }
}
