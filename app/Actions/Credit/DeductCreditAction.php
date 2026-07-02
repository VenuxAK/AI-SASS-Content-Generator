<?php

namespace App\Actions\Credit;

use App\Models\CreditTransaction;
use App\Models\Generation;
use App\Models\User;
use App\Services\CreditService;

class DeductCreditAction
{
    public function __construct(protected CreditService $creditService) {}

    /**
     * Deduct one credit from user.
     */
    public function execute(User $user, string $description, ?Generation $generation = null, int $amount = 1): CreditTransaction
    {
        return $this->creditService->deduct($user, $amount, $description, $generation);
    }
}
