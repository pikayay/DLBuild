import { getItems, Item } from '@/lib/deadlock-api'

export default async function ItemsPage() {
  const items = await getItems()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Items
        </h1>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: Item) => (
            <li key={item.id} className="p-4 border rounded-lg">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
