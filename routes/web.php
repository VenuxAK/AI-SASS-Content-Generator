<?php

use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenerationController;
use App\Http\Controllers\GenerationStreamController;
use App\Http\Controllers\ToneController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Stripe webhook (no auth or csrf)
Route::post('webhooks/stripe', [WebhookController::class, 'handle'])->name('webhooks.stripe');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Generations
    Route::post('generate', [GenerationController::class, 'store'])->middleware('credits')->name('generate.store');
    Route::get('generate/{generation}/stream', [GenerationStreamController::class, 'stream'])->name('generate.stream');

    Route::get('history', [GenerationController::class, 'index'])->name('history.index');
    Route::get('history/{generation}', [GenerationController::class, 'show'])->name('history.show');
    Route::put('history/{generation}', [GenerationController::class, 'update'])->name('history.update');
    Route::delete('history/{generation}', [GenerationController::class, 'destroy'])->name('history.destroy');

    // Tones
    Route::get('tones', [ToneController::class, 'index'])->name('tones.index');
    Route::post('tones', [ToneController::class, 'store'])->name('tones.store');
    Route::put('tones/{tone}', [ToneController::class, 'update'])->name('tones.update');
    Route::delete('tones/{tone}', [ToneController::class, 'destroy'])->name('tones.destroy');

    // Billing
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('billing/checkout', [BillingController::class, 'checkout'])->name('billing.checkout');
    Route::get('billing/success', [BillingController::class, 'success'])->name('billing.success');
    Route::get('billing/cancel', [BillingController::class, 'cancel'])->name('billing.cancel');
    Route::get('billing/transactions', [TransactionController::class, 'index'])->name('billing.transactions');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::post('users/{user}/credits', [AdminUserController::class, 'adjustCredits'])->name('users.adjust-credits');
    Route::get('transactions', [AdminTransactionController::class, 'index'])->name('transactions.index');
});

require __DIR__.'/settings.php';
