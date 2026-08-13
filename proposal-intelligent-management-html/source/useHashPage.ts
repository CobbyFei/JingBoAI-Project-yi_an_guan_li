Exit code: 0
Wall time: 0.2 seconds
Output:
/**
 * 澶氶〉闈㈠師鍨嬬殑杞婚噺 hash 璺敱 hook銆? *
 * URL 鏍煎紡: #page=<pageId>
 * pageId 浠呭厑璁稿皬鍐欏瓧姣嶃€佹暟瀛椼€佽繛瀛楃锛坅-z 0-9 -锛夈€? *
 * 鐢ㄦ硶锛? *   const { page, setPage } = useHashPage('home');
 *   const route = defineHashPageRoute([
 *     { id: 'dashboard', title: '宸ヤ綔鍙? },
 *   ], { defaultPageId: 'dashboard' });
 *   const { page, setPage, pages } = useHashPage(route);
 */
import { useCallback, useEffect, useState } from 'react';

export interface HashPageRoutePage {
    id: string;
    title: string;
    group?: string;
}

export interface HashPageRoute {
    pages: HashPageRoutePage[];
    defaultPageId: string;
}

const PAGE_ID_RE = /^[a-z0-9-]+$/u;

function normalizePageId(value: unknown): string {
    const id = typeof value === 'string' ? value.trim() : '';
    return PAGE_ID_RE.test(id) ? id : '';
}

function normalizeRoutePages(pages: HashPageRoutePage[]): HashPageRoutePage[] {
    if (!Array.isArray(pages)) {
        return [];
    }
    return pages
        .map((page) => {
            const id = normalizePageId(page?.id);
            const title = typeof page?.title === 'string' ? page.title.trim() : '';
            const group = typeof page?.group === 'string' ? page.group.trim() : '';
            return id && title ? { id, title, ...(group ? { group } : {}) } : null;
        })
        .filter((page): page is HashPageRoutePage => Boolean(page));
}

export function parseHashPage(hash: string): string | null {
    const rawHash = String(hash || '').replace(/^#/, '');
    const pageId = new URLSearchParams(rawHash).get('page');
    return normalizePageId(pageId) || null;
}

export function parseSearchPage(search: string): string | null {
    const rawSearch = String(search || '').replace(/^\?/, '');
    const pageId = new URLSearchParams(rawSearch).get('page');
    return normalizePageId(pageId) || null;
}

export function defineHashPageRoute(
    pages: HashPageRoutePage[],
    options?: { defaultPageId?: string },
): HashPageRoute {
    const normalizedPages = normalizeRoutePages(pages);
    const defaultPageId = normalizePageId(options?.defaultPageId);
    return {
        pages: normalizedPages,
        defaultPageId: normalizedPages.some((page) => page.id === defaultPageId)
            ? defaultPageId
            : normalizedPages[0]?.id || 'home',
    };
}

function normalizeRouteInput(routeOrDefault?: HashPageRoute | string): HashPageRoute {
    if (routeOrDefault && typeof routeOrDefault === 'object') {
        return defineHashPageRoute(routeOrDefault.pages, { defaultPageId: routeOrDefault.defaultPageId });
    }
    const defaultPageId = normalizePageId(routeOrDefault) || 'home';
    return {
        pages: [],
        defaultPageId,
    };
}

function notifyHostPrototypePageChange(pageId: string) {
    if (typeof window === 'undefined' || window.parent === window) {
        return;
    }
    window.parent.postMessage({
        type: 'AXHUB_PROTOTYPE_PAGE_CHANGE',
        pageId,
    }, '*');
}

function notifyHostPrototypeRouteInfo(
    pages: HashPageRoutePage[],
    defaultPageId: string,
    activePageId: string,
) {
    if (
        pages.length === 0
        || typeof window === 'undefined'
        || window.parent === window
    ) {
        return;
    }
    window.parent.postMessage({
        type: 'AXHUB_PROTOTYPE_ROUTE_INFO',
        pages,
        defaultPageId,
        activePageId,
    }, '*');
}

export function useHashPage(routeOrDefault: HashPageRoute | string = 'home') {
    const route = normalizeRouteInput(routeOrDefault);
    const { pages, defaultPageId } = route;
    const routeSignature = `${defaultPageId}:${pages.map((routePage) => `${routePage.id}=${routePage.title}@${routePage.group || ''}`).join('|')}`;
    const [page, setPageState] = useState<string>(() => {
        if (typeof window === 'undefined') {
            return defaultPageId;
        }
        return parseHashPage(window.location.hash) ?? parseSearchPage(window.location.search) ?? defaultPageId;
    });

    useEffect(() => {
        notifyHostPrototypeRouteInfo(pages, defaultPageId, page);
    }, [routeSignature]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const onHashChange = () => {
            const next = parseHashPage(window.location.hash) ?? parseSearchPage(window.location.search);
            const nextPageId = next ?? defaultPageId;
            setPageState(nextPageId);
            notifyHostPrototypePageChange(nextPageId);
        };

        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [defaultPageId]);

    const setPage = useCallback((pageId: string) => {
        const nextPageId = normalizePageId(pageId);
        if (!nextPageId || typeof window === 'undefined') {
            return;
        }
        window.location.hash = `page=${nextPageId}`;
    }, []);

    return { page, setPage, pages, defaultPageId };
}

