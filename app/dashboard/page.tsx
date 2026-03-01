import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SignOutButton from '@/app/components/SignOutButton'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>
        <p className="mb-4">Welcome, {session.user.email}</p>
        <div className="flex gap-4">
          <Link href="/profile" className="text-blue-500 hover:underline">
            Go to Profile
          </Link>
          <SignOutButton />
        </div>
      </main>
    </div>
  )
}
