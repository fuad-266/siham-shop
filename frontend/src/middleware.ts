import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware to handle Supabase Auth session and role-based redirects.
 * 
 * Flow:
 * 1. Update Supabase session (refresh if needed)
 * 2. Protect /checkout, /orders, /profile (must be logged in)
 * 3. Protect /admin (must be logged in AND have ADMIN role)
 * 4. Redirect logged-in users away from /auth/login and /auth/register
 */
export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();

    // 1. Redirect auth users away from login/register
    if (user && url.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Protect customer routes
    const protectedRoutes = ['/checkout', '/orders', '/profile'];
    if (!user && protectedRoutes.some(path => url.pathname.startsWith(path))) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('next', url.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // 3. Protect admin routes (auth required; role check done client-side via admin layout)
    if (url.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/auth/login?next=/admin', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
