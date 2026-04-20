'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { toggleLike, postComment } from '@/app/(main)/deadlock/builds/actions'

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface BuildSocialsProps {
  buildId: string
  initialLikes: number
  initialHasLiked: boolean
  initialComments: Comment[]
  isLoggedIn: boolean
}

export function BuildSocials({ buildId, initialLikes, initialHasLiked, initialComments: comments, isLoggedIn }: BuildSocialsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(initialHasLiked)
  const [commentText, setCommentText] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleToggleLike = async () => {
    if (!isLoggedIn) return
    const newLiked = !hasLiked
    setHasLiked(newLiked)
    setLikes(l => newLiked ? l + 1 : l - 1)
    
    startTransition(async () => {
      const result = await toggleLike(buildId, hasLiked)
      if (result.error) {
        setHasLiked(!newLiked)
        setLikes(l => !newLiked ? l + 1 : l - 1)
      }
    })
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !isLoggedIn) return
    
    const text = commentText
    setCommentText('')
    
    startTransition(async () => {
      const result = await postComment(buildId, text)
      if (result.error) {
        setCommentText(text)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 mt-8 p-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          onClick={handleToggleLike}
          disabled={!isLoggedIn || isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
            hasLiked 
              ? 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:hover:bg-violet-900/50' 
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
          } disabled:opacity-50`}
        >
          <svg className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likes} {likes === 1 ? 'Like' : 'Likes'}
        </button>
        {!isLoggedIn && <span className="text-sm text-zinc-500">Sign in to like or comment</span>}
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Comments ({comments.length})</h3>
        
        {isLoggedIn && (
          <form onSubmit={handlePostComment} className="flex flex-col gap-2 items-end">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isPending}
              className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="flex flex-col gap-4 mt-2">
          {comments.map((comment) => {
            const authorName = comment.author?.username || comment.author?.full_name || 'Anonymous'
            return (
              <div key={comment.id} className="flex gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  {comment.author?.avatar_url ? (
                    <Image src={comment.author.avatar_url} alt={authorName} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{authorName}</span>
                    <span className="text-xs text-zinc-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap mt-1">
                    {comment.content}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
