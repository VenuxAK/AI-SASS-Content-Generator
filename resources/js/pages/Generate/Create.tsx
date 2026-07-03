import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Sparkles, History, Languages, Wallet, Compass, PenTool } from 'lucide-react';
import { index as tonesIndex } from '@/routes/tones';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { index as billingIndex } from '@/routes/billing';
import { store as generateStore } from '@/routes/generate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

interface CreateProps {
    tones: Tone[];
    contentTypes: Option[];
    outputLanguages: Option[];
    recentGenerations?: Generation[];
}

export default function Create({
    tones,
    contentTypes,
    outputLanguages,
    recentGenerations = [],
}: CreateProps) {
    const { props } = usePage();
    const user = props.auth?.user;
    const creditBalance = Number(user?.credit_balance ?? 0);

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
            <Head title="Generate AI Copy" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Title */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-black tracking-tight text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                        <PenTool className="size-6 text-indigo-600 dark:text-indigo-400" />
                        Generate AI Copy
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Create high-converting copy, posts, and scripts in seconds using advanced AI models.
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="grid gap-6 lg:grid-cols-3">
                    
                    {/* Left Form Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {props.errors?.credits && (
                            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm border border-rose-100 dark:border-rose-950/50 flex flex-col gap-1">
                                <span className="font-bold">{props.errors.credits}</span>
                                <Link href={billingIndex.url()} className="text-xs underline font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                    Top up your credit balance here →
                                </Link>
                            </div>
                        )}

                        <Card className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="content_type" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Content Type
                                        </label>
                                        <Select value={data.content_type} onValueChange={(val) => setData('content_type', val)}>
                                            <SelectTrigger className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 h-11 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs hover:border-neutral-355 dark:hover:border-neutral-700">
                                                <SelectValue placeholder="Select content type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                                                {contentTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.content_type && <span className="text-xs text-rose-500 mt-1 block">{errors.content_type}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="output_language" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Language
                                        </label>
                                        <Select value={data.output_language} onValueChange={(val) => setData('output_language', val)}>
                                            <SelectTrigger className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 h-11 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs hover:border-neutral-355 dark:hover:border-neutral-700">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                                                {outputLanguages.map((lang) => (
                                                    <SelectItem key={lang.value} value={lang.value}>
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                        <Select value={data.tone_id ? String(data.tone_id) : 'none'} onValueChange={(val) => setData('tone_id', val === 'none' ? '' : val)}>
                                            <SelectTrigger className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 h-11 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs hover:border-neutral-355 dark:hover:border-neutral-700">
                                                <SelectValue placeholder="Select tone" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                                                <SelectItem value="none">None (Standard Default)</SelectItem>
                                                {tones.map((t) => (
                                                    <SelectItem key={t.id} value={String(t.id)}>
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                        rows={6}
                                        placeholder="Describe your product, offer, target audience, or topic in detail. The more context you provide, the better the copy!"
                                        value={data.user_prompt}
                                        onChange={(e) => setData('user_prompt', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
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
                        </Card>
                    </div>

                    {/* Right Side Info & Balance Column */}
                    <div className="space-y-6">
                        
                        {/* Credits Card */}
                        <Card className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Your Balance</p>
                                <h3 className="text-3xl font-black tracking-tight mt-1 text-neutral-950 dark:text-neutral-50">{creditBalance} Credits</h3>
                                <Link href={billingIndex.url()} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-2 block">
                                    Buy more credits →
                                </Link>
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <Wallet className="size-6" />
                            </div>
                        </Card>

                        {/* Recent History */}
                        <Card className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col">
                            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <History className="size-4 text-indigo-600" />
                                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">Recent Copies</h2>
                                </div>
                                <Link href={historyIndex.url()} className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 hover:underline">
                                    View All
                                </Link>
                            </div>

                            {recentGenerations.length > 0 ? (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                    {recentGenerations.map((gen) => (
                                        <Link
                                            key={gen.id}
                                            href={historyShow.url(gen.id)}
                                            className="block p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                                                    {gen.content_type.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] text-neutral-400">
                                                    {new Date(gen.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1 group-hover:text-neutral-850 dark:group-hover:text-neutral-300">
                                                {gen.user_prompt}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 text-xs">
                                    No copies generated yet.
                                </div>
                            )}
                        </Card>
                    </div>

                </div>

            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Generate Copy', href: '/generate' },
    ],
};
