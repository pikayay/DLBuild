import { getHeroes, Hero } from '@/lib/deadlock-api'

export default async function HeroesPage() {
  const heroes = await getHeroes()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Heroes
        </h1>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heroes.map((hero: Hero) => (
            <li key={hero.id} className="p-4 border rounded-lg">
              <h2 className="text-xl font-bold">{hero.name}</h2>
              <p>{hero.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
