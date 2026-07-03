import { Head, Link } from '@inertiajs/react';
import { Sparkles, History, Languages, Wallet, Compass, PenTool, LayoutGrid, Clock, ArrowRight } from 'lucide-react';
import { index as tonesIndex } from '@/routes/tones';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { index as billingIndex } from '@/routes/billing';
import { create as generateCreate } from '@/routes/generate';
import type { BreadcrumbItem } from '@/types';

interface Tone {
    id: number;
    name: string;
}

interface Option {
    value: string;
    label: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    ai_content: string | null;
    status: string;
    created_at: string;
    tone?: Tone | null;
}

interface DashboardProps {
    creditBalance: number;
    tones: Tone[];
    contentTypes: Option[];
    outputLanguages: Option[];
    recentGenerations: Generation[];
}

export default function Dashboard({
    creditBalance,
    tones,
    recentGenerations,
}: DashboardProps) {

    return (
        <>
            <Head title="Dashboard Overview" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-black tracking-tight text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                            <LayoutGrid className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Monitor your credits, manage your voice personas, and browse your recent copywriting history.
                        </p>
                    </div>
                    <Link
                        href={generateCreate.url()}
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 text-sm font-bold shadow-sm shadow-indigo-600/10 transition cursor-pointer"
                    >
                        <PenTool className="size-4" />
                        Create New Copy
                    </Link>
                </div>

                {/* Header Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex items-center justify-between transition hover:shadow-sm">
                        <div>
                            <p className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">Available Credits</p>
                            <h3 className="text-3xl font-black tracking-tight mt-1 text-neutral-950 dark:text-neutral-50">{creditBalance}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Wallet className="size-6" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex items-center justify-between transition hover:shadow-sm">
                        <div>
                            <p className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">Custom Personas</p>
                            <h3 className="text-3xl font-black tracking-tight mt-1 text-neutral-950 dark:text-neutral-50">{tones.length}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <Sparkles className="size-6" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex items-center justify-between transition hover:shadow-sm">
                        <div>
                            <p className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">Buy Credits</p>
                            <Link href={billingIndex.url()} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block">
                                Top-up wallet balance →
                            </Link>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
                            <Compass className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href={generateCreate.url()}
                        className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:shadow-md transition flex flex-col justify-between min-h-[120px] group"
                    >
                        <PenTool className="size-5 text-indigo-600 dark:text-indigo-400" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Write Copy</h4>
                            <p className="text-xs text-neutral-550 dark:text-neutral-400 mt-1">Start a new AI content stream</p>
                        </div>
                    </Link>

                    <Link
                        href={tonesIndex.url()}
                        className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-md transition flex flex-col justify-between min-h-[120px] group"
                    >
                        <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">Tone Personas</h4>
                            <p className="text-xs text-neutral-555 dark:text-neutral-400 mt-1">Define customized voice personals</p>
                        </div>
                    </Link>

                    <Link
                        href={historyIndex.url()}
                        className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-amber-500/40 dark:hover:border-amber-500/40 hover:shadow-md transition flex flex-col justify-between min-h-[120px] group"
                    >
                        <History className="size-5 text-amber-650 dark:text-amber-450" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-amber-650 dark:group-hover:text-amber-450 transition">History log</h4>
                            <p className="text-xs text-neutral-555 dark:text-neutral-400 mt-1">Browse all copywriting history</p>
                        </div>
                    </Link>

                    <Link
                        href={billingIndex.url()}
                        className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-purple-500/40 dark:hover:border-purple-500/40 hover:shadow-md transition flex flex-col justify-between min-h-[120px] group"
                    >
                        <Wallet className="size-5 text-purple-650 dark:text-purple-450" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-purple-650 dark:group-hover:text-purple-450 transition">Billing Info</h4>
                            <p className="text-xs text-neutral-555 dark:text-neutral-400 mt-1">Buy credits or view billing details</p>
                        </div>
                    </Link>
                </div>

                {/* Detailed Recent History Grid */}
                <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="size-5 text-indigo-650" />
                            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Recent Activity Logs</h2>
                        </div>
                        <Link href={historyIndex.url()} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                            View All History →
                        </Link>
                    </div>

                    {recentGenerations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-100 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400">
                                        <th className="py-3 px-4">Content Type</th>
                                        <th className="py-3 px-4">Prompt Prompt</th>
                                        <th className="py-3 px-4">Language</th>
                                        <th className="py-3 px-4">Writing Tone</th>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentGenerations.map((gen) => (
                                        <tr key={gen.id} className="border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20 text-sm transition">
                                            <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                                                {gen.content_type.replace('_', ' ')}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-neutral-500 dark:text-neutral-400 max-w-[280px] truncate">
                                                {gen.user_prompt}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs font-semibold uppercase text-neutral-750 dark:text-neutral-350">
                                                {gen.output_language}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-neutral-550 dark:text-neutral-400">
                                                {gen.tone ? gen.tone.name : 'Standard Default'}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-neutral-400">
                                                {new Date(gen.created_at).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                    gen.status === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950/30'
                                                        : gen.status === 'failed'
                                                        ? 'bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-950/30'
                                                        : 'bg-indigo-50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-950/30 animate-pulse'
                                                }`}>
                                                    {gen.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={historyShow.url(gen.id)}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-350 group/btn"
                                                >
                                                    View Details
                                                    <ArrowRight className="size-3.5 transition group-hover/btn:translate-x-0.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-neutral-450 dark:text-neutral-500 text-sm">
                            <Clock className="size-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                            <span>No generations made yet. Click "Create New Copy" to get started!</span>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
