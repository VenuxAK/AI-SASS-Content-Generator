<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Credit\AdjustCreditAction;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(Request $request): Response
    {
        $users = User::orderBy('name')
            ->paginate(15);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Display details for a specific user, including their history.
     */
    public function show(Request $request, User $user): Response
    {
        $generations = $user->generations()
            ->with('tone')
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'generations_page');

        $transactions = $user->creditTransactions()
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'transactions_page');

        return Inertia::render('Admin/UserShow', [
            'subjectUser' => $user,
            'generations' => $generations,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Adjust credits manually for a user.
     */
    public function adjustCredits(Request $request, User $user, AdjustCreditAction $action): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        try {
            $action->execute($user, $validated['amount'], $validated['reason']);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => "User credits adjusted by {$validated['amount']}.",
            ]);
        } catch (\Throwable $e) {
            return back()->withErrors(['credits' => $e->getMessage()]);
        }

        return back();
    }
}
