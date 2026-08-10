import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // This is intentionally empty for the request side
          },
          remove(name: string, options: CookieOptions) {
            // This is intentionally empty for the request side
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully exchanged code for session
      // Create response that redirects to dashboard
      const response = NextResponse.redirect(`${origin}${next}`)
      
      // We need to set the cookies on the response
      // Re-create the client with cookie setting capabilities
      const supabaseWithCookies = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              response.cookies.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
              response.cookies.set({ name, value: '', ...options })
            },
          },
        }
      )

      // Re-exchange to set cookies on the response
      await supabaseWithCookies.auth.exchangeCodeForSession(code)

      return response
    }
  }

  // If there's an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
