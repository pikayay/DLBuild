import { BuildCreator } from '@/app/components/deadlock/BuildCreator'
import { getItems, getHeroes } from '@/lib/deadlock-api'
import { getBuild } from '@/app/(main)/deadlock/builds/actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const build = await getBuild(id)

  if (!build) {
    return {
      title: 'Build Not Found - Deadlock',
    }
  }

  return {
    title: `${build.name} - Deadlock`,
  }
}

export default async function ViewBuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { items, error: itemsError },
    { heroes, error: heroesError },
    build
  ] = await Promise.all([getItems(), getHeroes(), getBuild(id)])

  const error = itemsError || heroesError

  if (!build) {
    notFound()
  }

  const isOwner = user?.id === build.user_id

  return (
    <div className="mx-auto max-w-5xl w-full">
      <div className="mb-4">
        <Link
          href="/deadlock/builds"
          className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          &larr; Back to Builds
        </Link>
      </div>

      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          {isOwner ? 'Edit Build' : 'View Build'}
        </h1>
        {isOwner && (
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            You can modify your build and save changes.
          </p>
        )}
      </header>

      {error ? (
        <div
          className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          <p className="font-medium">Could not load items or heroes</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-zinc-500">No items returned.</p>
      ) : (
        <BuildCreator items={items} heroes={heroes} initialBuild={build} isOwner={isOwner} />
      )}
    </div>
  )
}