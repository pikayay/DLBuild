'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button onClick={handleSignOut} className="p-2 bg-red-500 text-white rounded">
      Sign Out
    </button>
  )
}
