<?php

namespace App\Services;

use App\Enums\TransactionType;
use App\Models\CreditTransaction;
use App\Models\Generation;
use App\Models\StripePayment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreditService
{
    /**
     * Get the current credit balance of the user.
     */
    public function getBalance(User $user): int
    {
        return DB::transaction(function () use ($user) {
            $lockedUser = User::where('id', $user->id)->lockForUpdate()->first();

            return $lockedUser ? $lockedUser->credit_balance : 0;
        });
    }

    /**
     * Check if the user has a minimum number of credits.
     */
    public function hasCredits(User $user, int $amount = 1): bool
    {
        return $this->getBalance($user) >= $amount;
    }

    /**
     * Deduct credits from user for content generation.
     */
    public function deduct(User $user, int $amount, string $description, ?Generation $generation = null): CreditTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description, $generation) {
            $lockedUser = User::where('id', $user->id)->lockForUpdate()->first();

            if (! $lockedUser) {
                throw new \RuntimeException('User not found.');
            }

            if ($lockedUser->credit_balance < $amount) {
                throw new \RuntimeException('Insufficient credits.');
            }

            $balanceBefore = $lockedUser->credit_balance;
            $lockedUser->credit_balance -= $amount;
            $lockedUser->save();

            return CreditTransaction::create([
                'user_id' => $lockedUser->id,
                'generation_id' => $generation?->id,
                'stripe_payment_id' => null,
                'type' => TransactionType::Consumption,
                'amount' => -$amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $lockedUser->credit_balance,
                'description' => $description,
            ]);
        });
    }

    /**
     * Add credits to user from stripe checkout purchase.
     */
    public function add(User $user, int $amount, string $description, ?StripePayment $payment = null): CreditTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description, $payment) {
            $lockedUser = User::where('id', $user->id)->lockForUpdate()->first();

            if (! $lockedUser) {
                throw new \RuntimeException('User not found.');
            }

            $balanceBefore = $lockedUser->credit_balance;
            $lockedUser->credit_balance += $amount;
            $lockedUser->save();

            // Set type. If it's linked to payment, it's purchase, else refund/adjustment
            $type = $payment ? TransactionType::Purchase : TransactionType::Refund;

            return CreditTransaction::create([
                'user_id' => $lockedUser->id,
                'generation_id' => null,
                'stripe_payment_id' => $payment?->id,
                'type' => $type,
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $lockedUser->credit_balance,
                'description' => $description,
            ]);
        });
    }

    /**
     * Adjust credits (by admin).
     */
    public function adjust(User $user, int $amount, string $description): CreditTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            $lockedUser = User::where('id', $user->id)->lockForUpdate()->first();

            if (! $lockedUser) {
                throw new \RuntimeException('User not found.');
            }

            $balanceBefore = $lockedUser->credit_balance;

            // Adjust balance (can be positive or negative)
            $newBalance = $lockedUser->credit_balance + $amount;
            if ($newBalance < 0) {
                throw new \RuntimeException('Adjustment would result in negative credit balance.');
            }

            $lockedUser->credit_balance = $newBalance;
            $lockedUser->save();

            return CreditTransaction::create([
                'user_id' => $lockedUser->id,
                'generation_id' => null,
                'stripe_payment_id' => null,
                'type' => TransactionType::Adjustment,
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $lockedUser->credit_balance,
                'description' => $description,
            ]);
        });
    }
}
