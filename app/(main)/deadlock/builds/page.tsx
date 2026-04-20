import { fetchBuilds } from './actions'
import { Build, getHeroes } from '@/lib/deadlock-api'
import { resolveSlotTheme } from '@/lib/deadlock-item-groups'
import Link from 'next/link'
import Image from 'next/image'

export default async function BuildsPage() {
  const [builds, { heroes }] = await Promise.all([
    fetchBuilds(),
    getHeroes(),
  ])

  const heroMap = new Map(heroes.map(h => [h.id, h.name]))

  const themeStyles = {
    spirit: 'border-violet-500/50 bg-violet-950/20 hover:border-violet-400 hover:bg-violet-950/40',
    weapon: 'border-amber-500/50 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/40',
    vitality: 'border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-950/40',
    default: 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-800/60',
  }

  const themeBanner = {
    spirit: 'bg-violet-500/20 text-violet-200 border-b border-violet-500/30',
    weapon: 'bg-amber-500/20 text-amber-200 border-b border-amber-500/30',
    vitality: 'bg-emerald-500/20 text-emerald-200 border-b border-emerald-500/30',
    default: 'bg-zinc-800 text-zinc-300 border-b border-zinc-700',
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <main className="flex flex-col items-center w-full flex-1 px-4 sm:px-8 text-center">
        <div className="flex items-center justify-between w-full max-w-6xl mb-8">
          <h1 className="text-4xl font-bold text-zinc-100">
            Builds
          </h1>
          <Link
            href="/deadlock/builds/new"
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Create New Build
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full text-left">
          {builds.map((build: Build) => {
            const heroName = heroMap.get(build.hero_id) || 'Unknown Hero'
            const lateItems = build.items['late'] || []
            
            let dominantTheme: 'spirit' | 'weapon' | 'vitality' | 'default' = 'default'
            
            if (lateItems.length > 0) {
              const counts = { spirit: 0, weapon: 0, vitality: 0, default: 0 }
              lateItems.forEach(item => {
                counts[resolveSlotTheme(item.item_slot_type)]++
              })
              dominantTheme = Object.keys(counts).reduce((a, b) => counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b) as 'spirit' | 'weapon' | 'vitality' | 'default'
            }

            const authorName = build.author?.username || build.author?.full_name || 'Anonymous'

            return (
              <li key={build.id}>
                <Link href={`/deadlock/builds/${build.id}`} className={`block overflow-hidden border rounded-xl transition-all shadow-sm ${themeStyles[dominantTheme]}`}>
                  <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider flex justify-between items-center ${themeBanner[dominantTheme]}`}>
                    <span>{heroName}</span>
                  </div>
                  <div className="p-4 flex flex-col h-full">
                    <h2 className="text-xl font-bold text-zinc-100 mb-1">{build.name}</h2>
                    <p className="text-sm text-zinc-400 line-clamp-2 h-10 mb-4">{build.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 overflow-hidden rounded-full bg-zinc-800">
                          {build.author?.avatar_url ? (
                            <Image src={build.author.avatar_url} alt={authorName} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-500">
                              {authorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-zinc-300 font-medium">{authorName}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${build.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                        {build.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
