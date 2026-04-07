import Image from 'next/image'
import {
  getItems,
  getItemDescriptionSnippet,
  getItemImageUrl,
  type UpgradeItemV2,
} from '@/lib/deadlock-api'

function UpgradeMeta({ item }: { item: UpgradeItemV2 }) {
  return (
    <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-left text-xs text-zinc-600 dark:text-zinc-400">
      {item.cost != null && (
        <>
          <dt className="font-medium text-zinc-500">Cost</dt>
          <dd>{item.cost.toLocaleString()}</dd>
        </>
      )}
      <dt className="font-medium text-zinc-500">Slot</dt>
      <dd className="truncate">{item.item_slot_type}</dd>
      <dt className="font-medium text-zinc-500">Tier</dt>
      <dd>{item.item_tier}</dd>
    </dl>
  )
}

function ItemCard({ item }: { item: UpgradeItemV2 }) {
  const img = getItemImageUrl(item)
  const snippet = getItemDescriptionSnippet(item)

  return (
    <li className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
        {img ? (
          <Image
            src={img}
            alt=""
            fill
            className="object-contain p-1"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
            No art
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {item.name}
        </h2>
        <p className="truncate font-mono text-xs text-zinc-500">{item.class_name}</p>
        {snippet && (
          <p className="mt-1 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
            {snippet}
          </p>
        )}
        <UpgradeMeta item={item} />
      </div>
    </li>
  )
}

export default async function ItemsPage() {
  const { items, error } = await getItems()

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Items</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Shop upgrades from the Deadlock Assets API (abilities and weapons are not listed here).
        </p>
        {!error && (
          <p className="mt-1 text-sm text-zinc-500">
            {items.length} upgrade{items.length === 1 ? '' : 's'} loaded.
          </p>
        )}
      </header>

      {error && (
        <div
          className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          <p className="font-medium">Could not load items</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!error && items.length === 0 && (
        <p className="text-center text-zinc-500">No upgrades returned.</p>
      )}

      {items.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  )
}
