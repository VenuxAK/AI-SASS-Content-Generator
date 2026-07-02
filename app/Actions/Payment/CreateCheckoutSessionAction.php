<?php

namespace App\Actions\Payment;

use App\Models\StripePayment;
use App\Models\User;
use App\Services\StripeService;

class CreateCheckoutSessionAction
{
    public function __construct(protected StripeService $stripeService) {}

    /**
     * Create checkout session and record details in database.
     */
    public function execute(User $user, string $packageKey): string
    {
        $packages = config('packages');

        if (! isset($packages[$packageKey])) {
            throw new \InvalidArgumentException('Invalid package selection.');
        }

        $package = $packages[$packageKey];
        $session = $this->stripeService->createCheckoutSession($user, $package);

        $payment = new StripePayment;
        $payment->user_id = $user->id;
        $payment->stripe_session_id = $session->id;
        $payment->package_key = $package['key'];
        $payment->credits_purchased = $package['credits'];
        $payment->amount_paid = $package['price_cents'];
        $payment->currency = $package['currency'];
        $payment->status = 'pending';
        $payment->save();

        return $session->url;
    }
}
