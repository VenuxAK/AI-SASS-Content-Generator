<?php

namespace App\Actions\Payment;

use App\Actions\Credit\AddCreditAction;
use App\Models\StripePayment;
use App\Services\StripeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;

class HandleStripeWebhookAction
{
    public function __construct(
        protected StripeService $stripeService,
        protected AddCreditAction $addCreditAction
    ) {}

    /**
     * Parse signature, verify Stripe event, and credit user accounts.
     */
    public function execute(string $payload, string $signature): void
    {
        try {
            $event = $this->stripeService->constructWebhookEvent($payload, $signature);
        } catch (\UnexpectedValueException $e) {
            Log::warning('Stripe Webhook: Invalid payload received.');
            throw $e;
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe Webhook: Signature verification failed.');
            throw $e;
        }

        Log::info('Stripe Webhook Event Received: '.$event->type);

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $sessionId = $session->id;
            $paymentIntent = $session->payment_intent ?? null;

            DB::transaction(function () use ($sessionId, $paymentIntent, $session) {
                $payment = StripePayment::where('stripe_session_id', $sessionId)
                    ->lockForUpdate()
                    ->first();

                if (! $payment) {
                    Log::warning("Stripe Webhook: Checkout Session not found in database: {$sessionId}");

                    return;
                }

                if ($payment->status === 'completed') {
                    Log::info("Stripe Webhook: Payment already processed for session: {$sessionId}");

                    return;
                }

                $payment->stripe_payment_intent = $paymentIntent;
                $payment->status = 'completed';
                $payment->stripe_payload = $session->toArray();
                $payment->save();

                $user = $payment->user;
                $description = "Purchase of {$payment->credits_purchased} credits via Stripe Checkout.";

                $this->addCreditAction->execute($user, $payment->credits_purchased, $description, $payment);

                Log::info("Stripe Webhook: Successfully credited {$payment->credits_purchased} credits to user {$user->id}.");
            });
        }
    }
}
