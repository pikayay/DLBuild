import { BuildCreator } from '@/app/components/deadlock/BuildCreator'
import { BuildSocials } from '@/app/components/deadlock/BuildSocials'
import { getItems, getHeroes } from '@/lib/deadlock-api'
import { getBuild, getLikesCount, hasUserLiked, fetchComments } from '@/app/(main)/deadlock/builds/actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
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
    build,
    initialLikes,
    initialHasLiked,
    initialComments,
  ] = await Promise.all([
    getItems(), 
    getHeroes(), 
    getBuild(id),
    getLikesCount(id),
    hasUserLiked(id),
    fetchComments(id)
  ])

  const error = itemsError || heroesError

  if (!build) {
    notFound()
  }

  const isOwner = user?.id === build.user_id
  const authorName = build.author?.username || build.author?.full_name || 'Anonymous'

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

      <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            {isOwner ? 'Edit Build' : 'View Build'}
          </h1>
          {isOwner && (
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              You can modify your build and save changes.
            </p>
          )}
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            {build.author?.avatar_url ? (
              <Image src={build.author.avatar_url} alt={authorName} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs text-zinc-500">Created by</span>
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{authorName}</span>
          </div>
        </div>
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
        <>
          <BuildCreator items={items} heroes={heroes} initialBuild={build} isOwner={isOwner} />
          {!isOwner && (
            <BuildSocials 
              buildId={id} 
              initialLikes={initialLikes} 
              initialHasLiked={initialHasLiked} 
              initialComments={initialComments} 
              isLoggedIn={!!user} 
            />
          )}
          {isOwner && (
            <BuildSocials 
              buildId={id} 
              initialLikes={initialLikes} 
              initialHasLiked={initialHasLiked} 
              initialComments={initialComments} 
              isLoggedIn={!!user} 
            />
          )}
        </>
      )}
    </div>
  )
}