<?php

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Enums\TransactionType;
use App\Models\StripePayment;
use App\Models\User;
use App\Models\UserTone;
use App\Services\CreditService;
use App\Services\PromptBuilderService;
use App\Services\StripeService;
use Stripe\Checkout\Session;
use Stripe\Event;

test('users can manage writing tones', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create tone
    $response = $this->post(route('tones.store'), [
        'name' => 'Witty Emojis',
        'description' => 'Sarcastic, full of tech slang and emoji markers.',
    ]);
    $response->assertRedirect(route('tones.index'));
    $this->assertDatabaseHas('user_tones', [
        'user_id' => $user->id,
        'name' => 'Witty Emojis',
    ]);

    $tone = UserTone::where('user_id', $user->id)->first();

    // Update tone
    $response = $this->put(route('tones.update', $tone->id), [
        'name' => 'Professional Pitch',
        'description' => 'Clear, concise, and focused on business value.',
    ]);
    $response->assertRedirect(route('tones.index'));
    $this->assertDatabaseHas('user_tones', [
        'id' => $tone->id,
        'name' => 'Professional Pitch',
    ]);

    // Delete tone
    $response = $this->delete(route('tones.destroy', $tone->id));
    $response->assertRedirect(route('tones.index'));
    $this->assertDatabaseMissing('user_tones', ['id' => $tone->id]);
});

test('prompt builder service correctly builds full prompts', function () {
    $builder = new PromptBuilderService;
    $prompt = $builder->build(
        ContentType::FacebookPost,
        'New SaaS product release',
        'Excited and casual',
        OutputLanguage::English
    );

    expect($prompt)->toContain('New SaaS product release')
        ->toContain('Excited and casual')
        ->toContain('Write the entire content in English.');
});

test('credit service handles deposits, deductions, and locks atomically', function () {
    $user = User::factory()->create(['credit_balance' => 10]);
    $service = new CreditService;

    // Deduct 1 credit
    $tx = $service->deduct($user, 1, 'Test consumption');
    expect($tx->type)->toBe(TransactionType::Consumption)
        ->and($tx->amount)->toBe(-1)
        ->and($tx->balance_before)->toBe(10)
        ->and($tx->balance_after)->toBe(9);

    $user->refresh();
    expect($user->credit_balance)->toBe(9);

    // Add 5 credits
    $tx2 = $service->add($user, 5, 'Stripe deposit');
    expect($tx2->type)->toBe(TransactionType::Refund) // Add without payment triggers refund type
        ->and($tx2->amount)->toBe(5)
        ->and($tx2->balance_before)->toBe(9)
        ->and($tx2->balance_after)->toBe(14);

    $user->refresh();
    expect($user->credit_balance)->toBe(14);

    // Admin adjust credits
    $tx3 = $service->adjust($user, -4, 'Admin correction');
    expect($tx3->type)->toBe(TransactionType::Adjustment)
        ->and($tx3->amount)->toBe(-4)
        ->and($tx3->balance_before)->toBe(14)
        ->and($tx3->balance_after)->toBe(10);

    $user->refresh();
    expect($user->credit_balance)->toBe(10);
});

test('users cannot generate content without credits', function () {
    $user = User::factory()->create(['credit_balance' => 0]);
    $this->actingAs($user);

    $response = $this->post(route('generate.store'), [
        'content_type' => ContentType::FacebookPost->value,
        'output_language' => OutputLanguage::English->value,
        'user_prompt' => 'Cool content topic',
    ]);

    // Triggers EnsureUserHasCredits middleware redirect
    $response->assertSessionHasErrors('credits');
});

test('stripe checkout creates session and records payment', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Mock StripeService
    $mockSession = Session::constructFrom([
        'id' => 'cs_test_123',
        'url' => 'https://checkout.stripe.com/pay/cs_test_123',
    ]);
    $mockStripeService = Mockery::mock(StripeService::class);
    $mockStripeService->shouldReceive('createCheckoutSession')
        ->once()
        ->andReturn($mockSession);
    app()->instance(StripeService::class, $mockStripeService);

    $response = $this->post(route('billing.checkout'), [
        'package_key' => 'pro',
    ], [
        'X-Inertia' => 'true',
    ]);

    $response->assertStatus(409); // Inertia redirects to external URL using 409 conflict header
    $this->assertDatabaseHas('stripe_payments', [
        'user_id' => $user->id,
        'stripe_session_id' => 'cs_test_123',
        'package_key' => 'pro',
        'status' => 'pending',
    ]);
});

test('stripe webhook handles payment completion idempotently', function () {
    $user = User::factory()->create(['credit_balance' => 5]);
    $payment = StripePayment::create([
        'user_id' => $user->id,
        'stripe_session_id' => 'cs_test_abc',
        'package_key' => 'pro',
        'credits_purchased' => 50,
        'amount_paid' => 2000,
        'currency' => 'usd',
        'status' => 'pending',
    ]);

    // Mock Stripe webhook signature constructor
    $mockEvent = Event::constructFrom([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => 'cs_test_abc',
                'payment_intent' => 'pi_test_xyz',
            ],
        ],
    ]);

    $mockStripeService = Mockery::mock(StripeService::class);
    $mockStripeService->shouldReceive('constructWebhookEvent')
        ->twice()
        ->andReturn($mockEvent);
    app()->instance(StripeService::class, $mockStripeService);

    $response = $this->post(route('webhooks.stripe'), [], [
        'Stripe-Signature' => 'dummy_sig',
    ]);

    $response->assertStatus(200);

    $payment->refresh();
    expect($payment->status)->toBe('completed')
        ->and($payment->stripe_payment_intent)->toBe('pi_test_xyz');

    $user->refresh();
    expect($user->credit_balance)->toBe(55); // 5 + 50

    // Double webhook test (idempotency)
    $response2 = $this->post(route('webhooks.stripe'), [], [
        'Stripe-Signature' => 'dummy_sig2',
    ]);
    $response2->assertStatus(200);

    $user->refresh();
    expect($user->credit_balance)->toBe(55); // No double-crediting
});

test('users can view content generation form', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('generate.create'));
    $response->assertStatus(200);
});
