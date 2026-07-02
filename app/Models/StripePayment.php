<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $stripe_session_id
 * @property string|null $stripe_payment_intent
 * @property string $package_key
 * @property int $credits_purchased
 * @property int $amount_paid
 * @property string $currency
 * @property string $status
 * @property array|null $stripe_payload
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'stripe_session_id',
    'stripe_payment_intent',
    'package_key',
    'credits_purchased',
    'amount_paid',
    'currency',
    'status',
    'stripe_payload',
])]
class StripePayment extends Model
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
            'credits_purchased' => 'integer',
            'amount_paid' => 'integer',
            'stripe_payload' => 'array',
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
     * @return HasOne<CreditTransaction, $this>
     */
    public function creditTransaction(): HasOne
    {
        return $this->hasOne(CreditTransaction::class);
    }
}
