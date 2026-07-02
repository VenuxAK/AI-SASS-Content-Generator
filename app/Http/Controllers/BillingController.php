<?php

namespace App\Http\Controllers;

use App\Actions\Payment\CreateCheckoutSessionAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    /**
     * Display the packages and user credits.
     */
    public function index(Request $request): Response
    {
        $packages = array_values(config('packages'));

        return Inertia::render('Billing/Index', [
            'creditBalance' => $request->user()->credit_balance,
            'packages' => $packages,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Create a Stripe checkout session.
     */
    public function checkout(Request $request, CreateCheckoutSessionAction $action)
    {
        $validated = $request->validate([
            'package_key' => ['required', 'string'],
        ]);

        try {
            $checkoutUrl = $action->execute($request->user(), $validated['package_key']);

            // Redirect external to Stripe Checkout
            return Inertia::location($checkoutUrl);
        } catch (\Throwable $e) {
            return back()->withErrors(['stripe' => 'Could not initiate Stripe checkout. '.$e->getMessage()]);
        }
    }

    /**
     * Stripe success redirect landing.
     */
    public function success(Request $request): Response
    {
        // Stripe webhook will asynchronously process credit updates.
        return Inertia::render('Billing/Index', [
            'creditBalance' => $request->user()->credit_balance,
            'packages' => array_values(config('packages')),
            'status' => 'success',
            'message' => 'Payment initiated! Your credits will be added in a few moments.',
        ]);
    }

    /**
     * Stripe cancel redirect landing.
     */
    public function cancel(Request $request): Response
    {
        return Inertia::render('Billing/Index', [
            'creditBalance' => $request->user()->credit_balance,
            'packages' => array_values(config('packages')),
            'status' => 'cancelled',
            'message' => 'Payment cancelled. No charges were made.',
        ]);
    }
}
