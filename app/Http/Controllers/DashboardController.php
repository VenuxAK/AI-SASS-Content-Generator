<?php

namespace App\Http\Controllers;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Models\Generation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the application dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Map content types and output languages to label-value arrays for the frontend dropdowns
        $contentTypes = collect(ContentType::cases())->map(fn ($type) => [
            'value' => $type->value,
            'label' => $type->label(),
        ]);

        $outputLanguages = collect(OutputLanguage::cases())->map(fn ($lang) => [
            'value' => $lang->value,
            'label' => $lang->label(),
        ]);

        $recentGenerations = Generation::where('user_id', $user->id)
            ->with('tone')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'creditBalance' => $user->credit_balance,
            'tones' => $user->tones()->select('id', 'name')->get(),
            'contentTypes' => $contentTypes,
            'outputLanguages' => $outputLanguages,
            'recentGenerations' => $recentGenerations,
        ]);
    }
}
