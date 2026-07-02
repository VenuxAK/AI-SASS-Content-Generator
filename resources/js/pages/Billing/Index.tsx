import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { CreditCard, Check, ShieldCheck, Zap, Activity } from 'lucide-react';
import { index as billingIndex, checkout as billingCheckout, transactions as billingTransactions } from '@/routes/billing';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface Package {
    key: string;
    name: string;
    credits: number;
    price_cents: number;
    currency: string;
    description: string;
}

interface BillingIndexProps {
    creditBalance: number;
    packages: Package[];
    status?: 'success' | 'cancelled' | null;
    message?: string | null;
}

export default function BillingIndex({
    creditBalance,
    packages,
    status,
    message,
}: BillingIndexProps) {
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = (packageKey: string) => {
        setIsPurchasing(true);
        router.post(billingCheckout.url(), { package_key: packageKey }, {
            onFinish: () => setIsPurchasing(false)
        });
    };

    return (
        <>
            <Head title="Billing & Credits" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                            <CreditCard className="size-6 text-indigo-600" />
                            Billing & Credits
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Purchase pre-paid credit packages to generate premium social media copy and scripts.
                        </p>
                    </div>
                    <Link
                        href={billingTransactions.url()}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 px-4 py-2 text-sm font-semibold flex items-center gap-2 transition"
                    >
                        <Activity className="size-4" />
                        Billing Ledger
                    </Link>
                </div>

                {/* Status Banners */}
                {status === 'success' && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm border border-emerald-100 dark:border-emerald-950/50 flex items-center gap-3">
                        <ShieldCheck className="size-5 shrink-0" />
                        <div>
                            <span className="font-bold">Success! </span>
                            {message || 'Payment initiated successfully. Credits will be loaded shortly.'}
                        </div>
                    </div>
                )}

                {status === 'cancelled' && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-2xl text-sm border border-amber-100 dark:border-amber-950/50 flex items-center gap-3">
                        <Activity className="size-5 shrink-0" />
                        <div>
                            <span className="font-bold">Cancelled. </span>
                            {message || 'Payment session closed. No charge was made.'}
                        </div>
                    </div>
                )}

                {/* Balance Summary Card */}
                <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:shadow-md">
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Current Balance</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Each generated post or script consumes exactly 1 credit.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-neutral-400">Your Wallet</span>
                            <div className="text-3xl font-black text-neutral-950 dark:text-neutral-50">{creditBalance} credits</div>
                        </div>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            <CreditCard className="size-8" />
                        </div>
                    </div>
                </div>

                {/* Package Grids */}
                <div>
                    <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-6">Available Packages</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {packages.map((pkg) => {
                            const isPro = pkg.key === 'pro';
                            const price = (pkg.price_cents / 100).toFixed(2);

                            return (
                                <Card
                                    key={pkg.key}
                                    className={`rounded-2xl border flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-md transition duration-200 ${
                                        isPro
                                            ? 'border-indigo-500 dark:border-indigo-600 ring-2 ring-indigo-500/10'
                                            : 'border-neutral-200 dark:border-neutral-800'
                                    }`}
                                >
                                    {isPro && (
                                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                                            <Zap className="size-3" />
                                            Best Value
                                        </div>
                                    )}

                                    <CardHeader className={`pb-6 ${isPro ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''}`}>
                                        <CardTitle className="text-md font-extrabold text-neutral-950 dark:text-neutral-50">{pkg.name}</CardTitle>
                                        <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 min-h-[32px]">{pkg.description}</CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-4xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">${price}</span>
                                            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">USD</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-6 pb-6 flex-1 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300">
                                                <Check className="size-3.5" />
                                            </div>
                                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                <span className="font-bold text-neutral-950 dark:text-neutral-50">{pkg.credits}</span> Generation Credits
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300">
                                                <Check className="size-3.5" />
                                            </div>
                                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                Atomic Transaction Logs
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300">
                                                <Check className="size-3.5" />
                                            </div>
                                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                Real-time SSE Streaming
                                            </span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-2 pb-6 px-6">
                                        <Button
                                            onClick={() => handlePurchase(pkg.key)}
                                            disabled={isPurchasing}
                                            className={`w-full h-11 rounded-xl text-sm font-bold shadow-sm cursor-pointer transition ${
                                                isPro
                                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                                                    : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 shadow-neutral-900/10'
                                            }`}
                                        >
                                            {isPurchasing ? 'Loading Stripe...' : `Buy ${pkg.credits} Credits`}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>

            </div>
        </>
    );
}

BillingIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Billing',
            href: billingIndex.url(),
        },
    ],
};
