export function getMultifactorCookies(cookies: string[] | undefined) {
    if (!cookies) {
        throw new Error('Expected cookies are missing');
    }
    const cookieMap = new Map<string, string>();
    cookies.forEach((c) => {
        if (c.startsWith('asid')) {
            cookieMap.set('asid', c);
        }
        if (c.startsWith('clid')) {
            cookieMap.set('clid', c);
        }
    });

    return cookieMap;
}
