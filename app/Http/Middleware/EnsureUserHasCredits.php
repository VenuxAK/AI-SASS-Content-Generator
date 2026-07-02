<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasCredits
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->credit_balance < 1) {
            if ($request->expectsJson()) {
                return response()->json([
                    'errors' => ['credits' => 'You do not have enough credits. Please purchase a package.'],
                ], 422);
            }

            return back()->withErrors([
                'credits' => 'You do not have enough credits. Please purchase a package.',
            ]);
        }

        return $next($request);
    }
}
