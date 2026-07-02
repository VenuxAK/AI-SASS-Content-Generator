<?php

namespace App\Http\Controllers;

use App\Actions\Payment\HandleStripeWebhookAction;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;

class WebhookController extends Controller
{
    /**
     * Handle incoming Stripe webhook events.
     */
    public function handle(Request $request, HandleStripeWebhookAction $action): Response
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature') ?? '';

        try {
            $action->execute($payload, $signature);

            return response('Webhook Handled', 200);
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe Webhook signature verification failed: '.$e->getMessage());

            return response('Invalid Signature', 400);
        } catch (\Throwable $e) {
            Log::error('Stripe Webhook processing error: '.$e->getMessage());

            return response('Webhook Error: '.$e->getMessage(), 500);
        }
    }
}
