import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import { User } from '~/utils/auth/user.server';

export function useMatchesData(id: string): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches();
    const route = useMemo(
        () => matchingRoutes.find((route) => route.id === id),
        [matchingRoutes, id]
    );
    return route?.data;
}

export function useOptionalUser(): User | undefined {
    const data = useMatchesData('root');
    if (data?.user) {
        return data.user as User;
    }
    if (data?.player) {
        return data.player as User;
    }
    return undefined;
}

export function getRedactedString() {
    return '*'.repeat(16);
}
