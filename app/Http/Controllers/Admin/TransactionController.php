<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a global list of all credit transactions.
     */
    public function index(Request $request): Response
    {
        $transactions = CreditTransaction::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Transactions', [
            'transactions' => $transactions,
        ]);
    }
}
