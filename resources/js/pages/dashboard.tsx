import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Sparkles, MessageSquare, History, Languages, Wallet, Compass } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as tonesIndex } from '@/routes/tones';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { index as billingIndex } from '@/routes/billing';
import { store as generateStore } from '@/routes/generate';
import { Button } from '@/components/ui/button';

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
    contentTypes,
    outputLanguages,
    recentGenerations,
}: DashboardProps) {
    const { data, setData, post, processing, errors } = useForm({
        content_type: contentTypes[0]?.value || 'facebook_post',
        output_language: 'en',
        tone_id: tones[0]?.id || '',
        user_prompt: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(generateStore.url());
    };

    return (
        <>
            <Head title="AI Writer Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-between transition hover:shadow-md">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Available Credits</p>
                            <h3 className="text-3xl font-extrabold tracking-tight mt-1 text-neutral-950 dark:text-neutral-50">{creditBalance}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Wallet className="size-6" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-between transition hover:shadow-md">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Custom Tones</p>
                            <h3 className="text-3xl font-extrabold tracking-tight mt-1 text-neutral-950 dark:text-neutral-50">{tones.length}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <Sparkles className="size-6" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-between transition hover:shadow-md">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Buy Credits</p>
                            <Link href={billingIndex.url()} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block">
                                View Package Options →
                            </Link>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
                            <Compass className="size-6" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Generator Form */}
                    <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6">
                            <Sparkles className="size-5 text-indigo-600" />
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Generate AI Copy</h2>
                        </div>

                        {usePage().props.errors?.credits && (
                            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm border border-rose-100 dark:border-rose-950/50">
                                {usePage().props.errors.credits} <Link href={billingIndex.url()} className="font-bold underline ml-1">Buy credits here.</Link>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="content_type" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Content Type
                                    </label>
                                    <select
                                        id="content_type"
                                        value={data.content_type}
                                        onChange={(e) => setData('content_type', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {contentTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.content_type && <span className="text-xs text-rose-500 mt-1 block">{errors.content_type}</span>}
                                </div>

                                <div>
                                    <label htmlFor="output_language" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Language
                                    </label>
                                    <select
                                        id="output_language"
                                        value={data.output_language}
                                        onChange={(e) => setData('output_language', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {outputLanguages.map((lang) => (
                                            <option key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.output_language && <span className="text-xs text-rose-500 mt-1 block">{errors.output_language}</span>}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="tone_id" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                        Writing Tone
                                    </label>
                                    <Link href={tonesIndex.url()} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                        Manage Tones →
                                    </Link>
                                </div>
                                {tones.length > 0 ? (
                                    <select
                                        id="tone_id"
                                        value={data.tone_id}
                                        onChange={(e) => setData('tone_id', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">None (Standard Default)</option>
                                        {tones.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-900 flex justify-between items-center">
                                        <span>No custom tones defined. Standard tone will be used.</span>
                                        <Link href={tonesIndex.url()} className="underline font-bold text-indigo-600 dark:text-indigo-400">
                                            Create Tone
                                        </Link>
                                    </div>
                                )}
                                {errors.tone_id && <span className="text-xs text-rose-500 mt-1 block">{errors.tone_id}</span>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="user_prompt" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                        What should we write about?
                                    </label>
                                    <span className="text-xs text-neutral-400">{data.user_prompt.length} / 2000</span>
                                </div>
                                <textarea
                                    id="user_prompt"
                                    rows={5}
                                    placeholder="Describe your product, offer, target audience, or topic in detail. The more context you provide, the better the copy!"
                                    value={data.user_prompt}
                                    onChange={(e) => setData('user_prompt', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    maxLength={2000}
                                    required
                                />
                                {errors.user_prompt && <span className="text-xs text-rose-500 mt-1 block">{errors.user_prompt}</span>}
                            </div>

                            <Button type="submit" disabled={processing || creditBalance < 1} className="w-full h-12 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/10 cursor-pointer">
                                <Sparkles className="size-4" />
                                {processing ? 'Initializing Stream...' : 'Deduct 1 Credit & Write Copy'}
                            </Button>
                        </form>
                    </div>

                    {/* Recent History Sidebar */}
                    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                            <div className="flex items-center gap-2">
                                <History className="size-4 text-indigo-600" />
                                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">Recent History</h2>
                            </div>
                            <Link href={historyIndex.url()} className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 hover:underline">
                                View All
                            </Link>
                        </div>

                        {recentGenerations.length > 0 ? (
                            <div className="space-y-4 flex-1 overflow-y-auto max-h-[360px] pr-1">
                                {recentGenerations.map((gen) => (
                                    <Link
                                        key={gen.id}
                                        href={historyShow.url(gen.id)}
                                        className="block p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                                                {gen.content_type.replace('_', ' ')}
                                            </span>
                                            <span className="text-[10px] text-neutral-400">
                                                {new Date(gen.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-2 group-hover:text-neutral-950 dark:group-hover:text-neutral-200 transition">
                                            {gen.user_prompt}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                                            <span className="flex items-center gap-1">
                                                <Languages className="size-3" />
                                                {gen.output_language.toUpperCase()}
                                            </span>
                                            {gen.tone && (
                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full font-medium">
                                                    {gen.tone.name}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <MessageSquare className="size-8 text-neutral-300 mb-2" />
                                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-50">No copy generated yet</h3>
                                <p className="text-[10px] text-neutral-400 max-w-[200px] mt-1">Your generated posts and scripts will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
