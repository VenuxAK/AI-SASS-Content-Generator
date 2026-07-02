<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of user credit transactions.
     */
    public function index(Request $request): Response
    {
        $transactions = $request->user()->creditTransactions()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Billing/Transactions', [
            'transactions' => $transactions,
        ]);
    }
}
