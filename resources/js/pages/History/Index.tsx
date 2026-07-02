import { Head, Link } from '@inertiajs/react';
import { History, MessageSquare, Languages, Sparkles, AlertCircle, Compass } from 'lucide-react';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Tone {
    id: number;
    name: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    ai_content: string | null;
    status: 'pending' | 'streaming' | 'completed' | 'failed';
    created_at: string;
    tone?: Tone | null;
}

interface HistoryProps {
    history: {
        data: Generation[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function HistoryIndex({ history }: HistoryProps) {
    return (
        <>
            <Head title="Content Generation History" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                            <History className="size-6 text-indigo-600" />
                            Content History
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Review, edit, copy, or delete your previous AI generations.
                        </p>
                    </div>
                </div>

                {/* History Grid */}
                {history.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {history.data.map((gen) => {
                            const date = new Date(gen.created_at).toLocaleDateString();
                            
                            // Badges for status
                            const statusBadge = {
                                pending: <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-950/30 animate-pulse">Pending</Badge>,
                                streaming: <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/30 animate-pulse">Writing...</Badge>,
                                completed: <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/30">Completed</Badge>,
                                failed: <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-950/30">Refunded / Failed</Badge>,
                            }[gen.status];

                            return (
                                <Link 
                                    key={gen.id} 
                                    href={historyShow.url(gen.id)}
                                    className="block transition transform hover:-translate-y-0.5"
                                >
                                    <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition duration-200 h-48 flex flex-col justify-between overflow-hidden">
                                        <CardHeader className="pb-2 pt-4 px-4 border-b border-neutral-50 dark:border-neutral-950/20 flex flex-row items-center justify-between">
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                                                {gen.content_type.replace('_', ' ')}
                                            </span>
                                            {statusBadge}
                                        </CardHeader>
                                        <CardContent className="pt-3 pb-3 px-4 flex-1">
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                                                {gen.user_prompt}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="py-2.5 px-4 bg-neutral-50/20 dark:bg-neutral-950/10 border-t border-neutral-100 dark:border-neutral-850/40 text-[10px] text-neutral-400 flex items-center justify-between">
                                            <span className="flex items-center gap-1">
                                                <Languages className="size-3" />
                                                {gen.output_language.toUpperCase()}
                                            </span>
                                            <span>{date}</span>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center max-w-md mx-auto my-6 w-full bg-neutral-50/30 dark:bg-neutral-900/10">
                        <MessageSquare className="size-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">No history available</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-6">
                            You haven't generated any AI copy yet. Head over to the dashboard to write something.
                        </p>
                        <Link 
                            href="/dashboard"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold px-4 py-2.5 text-xs shadow-sm shadow-indigo-600/10 transition"
                        >
                            <Compass className="size-4" />
                            Go to Writer
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {history.last_page > 1 && (
                    <div className="flex justify-center gap-1.5 mt-2">
                        {history.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                    link.active
                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                        : link.url
                                        ? 'bg-white hover:bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                                        : 'text-neutral-400 border-neutral-100 dark:border-neutral-900 pointer-events-none'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

            </div>
        </>
    );
}

HistoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'History',
            href: historyIndex.url(),
        },
    ],
};
