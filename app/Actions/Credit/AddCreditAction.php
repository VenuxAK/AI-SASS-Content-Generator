<?php

namespace App\Actions\Credit;

use App\Models\CreditTransaction;
use App\Models\StripePayment;
use App\Models\User;
use App\Services\CreditService;

class AddCreditAction
{
    public function __construct(protected CreditService $creditService) {}

    /**
     * Add credits to user.
     */
    public function execute(User $user, int $amount, string $description, ?StripePayment $payment = null): CreditTransaction
    {
        return $this->creditService->add($user, $amount, $description, $payment);
    }
}
