"use client";

import { useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Hook to optimize route transitions with loading states
 */
export function useOptimizedNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const navigate = (href: string) => {
        if (href === pathname) return;

        startTransition(() => {
            router.push(href);
        });
    };

    return { navigate, isPending };
}

/**
 * Component to prefetch important routes on mount
 */
export function RoutePrefetcher({ routes }: { routes: string[] }) {
    const router = useRouter();

    useEffect(() => {
        // Prefetch all important routes
        routes.forEach((route) => {
            router.prefetch(route);
        });
    }, [router, routes]);

    return null;
}
