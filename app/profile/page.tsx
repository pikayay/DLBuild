import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/app/components/ProfileForm'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  let { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', session.user.id)
    .single()

  // If no profile is found, create one for the user.
  // This handles the case for users created before the trigger was in place.
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: session.user.id, email: session.user.email })
      .select('full_name, avatar_url')
      .single()

    if (insertError) {
      console.error('Error creating profile:', insertError)
      return <div>Could not create or load profile. Please try again later.</div>
    }
    profile = newProfile
  }

  if (!profile) {
      return <div>Could not load profile.</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 md:px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Your Profile
        </h1>
        <ProfileForm user={session.user} profile={profile} />
        <div className="mt-8">
            <Link href="/dashboard" className="text-blue-500 hover:underline">
                Back to Dashboard
            </Link>
        </div>
      </main>
    </div>
  )
}
