import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SignOutButton from '@/app/components/SignOutButton'

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Starter App
        </h1>

        <div className="mt-8">
          {session ? (
            <div className="flex flex-col items-center gap-4">
              <p>Welcome, {session.user.email}</p>
              <Link href="/dashboard" className="text-blue-500 hover:underline">
                Go to Dashboard
              </Link>
              <Link href="/items" className="text-blue-500 hover:underline">
                Items
              </Link>
              <Link href="/builds" className="text-blue-500 hover:underline">
                Builds
              </Link>
              <Link href="/heroes" className="text-blue-500 hover:underline">
                Heroes
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="p-2 bg-blue-500 text-white rounded">
                Sign In
              </Link>
              <Link href="/signup" className="p-2 bg-green-500 text-white rounded">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
