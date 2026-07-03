import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';

export default function AppLogo() {
    const { state } = useSidebar();
    const { resolvedAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoTheme = mounted ? resolvedAppearance : 'light';

    return (
        <div className="flex items-center gap-2 w-full transition-all duration-200">
            <img 
                src={`/images/logo/icon-only-${logoTheme}.png`} 
                alt="Nexus AI" 
                className="size-7 object-contain shrink-0" 
            />
            {state !== 'collapsed' && (
                <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-neutral-50 truncate">
                    Nexus AI
                </span>
            )}
        </div>
    );
}
