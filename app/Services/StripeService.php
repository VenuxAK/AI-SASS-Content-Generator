<?php

namespace App\Services;

use App\Models\User;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Event as StripeEvent;
use Stripe\StripeClient;
use Stripe\Webhook as StripeWebhook;

class StripeService
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $secret = config('services.stripe.secret');
        if (empty($secret)) {
            // Provide a dummy key for testing/scaffolding if not defined yet
            $secret = 'sk_test_dummy';
        }
        $this->stripe = new StripeClient($secret);
    }

    /**
     * Create a Stripe Checkout Session for a specific package purchase.
     */
    public function createCheckoutSession(User $user, array $package): StripeSession
    {
        return $this->stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'customer_email' => $user->email,
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => $package['currency'],
                        'product_data' => [
                            'name' => $package['name'],
                            'description' => $package['description'] ?? "Purchase of {$package['credits']} credits.",
                        ],
                        'unit_amount' => $package['price_cents'],
                    ],
                    'quantity' => 1,
                ],
            ],
            'mode' => 'payment',
            'success_url' => route('billing.success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('billing.cancel'),
            'metadata' => [
                'user_id' => (string) $user->id,
                'package_key' => $package['key'],
                'credits' => (string) $package['credits'],
            ],
        ]);
    }

    /**
     * Construct and verify Stripe Event from Webhook request.
     */
    public function constructWebhookEvent(string $payload, string $signature): StripeEvent
    {
        $secret = config('services.stripe.webhook_secret');

        return StripeWebhook::constructEvent(
            $payload,
            $signature,
            $secret
        );
    }

    /**
     * Retrieve a Checkout Session by its ID.
     */
    public function getCheckoutSession(string $sessionId): StripeSession
    {
        return $this->stripe->checkout->sessions->retrieve($sessionId);
    }
}
