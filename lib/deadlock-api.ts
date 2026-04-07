/**
 * Deadlock Assets API — static game data (items, etc.).
 * @see https://assets.deadlock-api.com/scalar
 */

const ASSETS_API_BASE = 'https://assets.deadlock-api.com'

/** Query param accepted by the API for English strings. */
const DEFAULT_LANGUAGE = 'english' as const

export type DeadlockItemType = 'ability' | 'weapon' | 'upgrade'

export interface AbilityDescriptionV2 {
  desc?: string | null
  quip?: string | null
  t1_desc?: string | null
  t2_desc?: string | null
  t3_desc?: string | null
  active?: string | null
  passive?: string | null
}

export interface UpgradeDescriptionV2 {
  desc?: string | null
  desc2?: string | null
  active?: string | null
  passive?: string | null
}

/** Shared fields across v2 item shapes from GET /v2/items */
export interface DeadlockItemBase {
  id: number
  class_name: string
  name: string
  start_trained?: boolean | null
  image?: string | null
  image_webp?: string | null
  hero?: number | null
  heroes?: number[] | null
  update_time?: number | null
}

export interface AbilityItemV2 extends DeadlockItemBase {
  type: 'ability'
  description: AbilityDescriptionV2
}

export interface WeaponItemV2 extends DeadlockItemBase {
  type: 'weapon'
}

export interface UpgradeItemV2 extends DeadlockItemBase {
  type: 'upgrade'
  item_slot_type: string
  item_tier: string
  is_active_item: boolean
  shopable: boolean
  cost: number | null
  description?: UpgradeDescriptionV2 | null
  shop_image?: string | null
  shop_image_webp?: string | null
  shop_image_small?: string | null
  shop_image_small_webp?: string | null
}

export type DeadlockItem = AbilityItemV2 | WeaponItemV2 | UpgradeItemV2

export interface ItemsFetchResult {
  /** Shop upgrade items only (abilities and weapons excluded). */
  items: UpgradeItemV2[]
  error: string | null
}

export interface Build {
  id: string
  name: string
  description: string
}

export interface Hero {
  id: string
  name: string
  description: string
}

function stripTags(html: string): string {
  return html.replace(/<[\s\S]*?>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

function firstNonEmpty(values: (string | null | undefined)[]): string | null {
  for (const v of values) {
    if (v && v.trim()) return v
  }
  return null
}

/** Plain-text preview for list views (API strings often include HTML/SVG). */
export function getItemDescriptionSnippet(item: DeadlockItem, maxLen = 160): string | null {
  let raw: string | null = null
  if (item.type === 'ability') {
    const d = item.description ?? {}
    raw = firstNonEmpty([
      d.desc,
      d.passive,
      d.active,
      d.quip,
      d.t1_desc,
      d.t2_desc,
      d.t3_desc,
    ])
  } else if (item.type === 'upgrade') {
    const d = item.description
    if (d) {
      raw = firstNonEmpty([d.desc, d.desc2, d.passive, d.active])
    }
  }
  if (!raw) return null
  return truncate(stripTags(raw), maxLen)
}

export function getItemImageUrl(item: DeadlockItem): string | null {
  if (item.type === 'upgrade') {
    return (
      item.shop_image_webp ||
      item.shop_image ||
      item.image_webp ||
      item.image ||
      null
    )
  }
  return item.image_webp || item.image || null
}

const typeLabel: Record<DeadlockItemType, string> = {
  ability: 'Ability',
  weapon: 'Weapon',
  upgrade: 'Upgrade',
}

export function getItemTypeLabel(type: DeadlockItemType): string {
  return typeLabel[type]
}

/** Fetches shop upgrade items only (`GET /v2/items/by-type/upgrade`). */
export async function getItems(): Promise<ItemsFetchResult> {
  const url = new URL(`${ASSETS_API_BASE}/v2/items/by-type/upgrade`)
  url.searchParams.set('language', DEFAULT_LANGUAGE)

  try {
    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
      return {
        items: [],
        error: `Deadlock API returned ${res.status} ${res.statusText}`,
      }
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      return { items: [], error: 'Unexpected response from Deadlock API' }
    }

    const items = data
      .filter(
        (row): row is UpgradeItemV2 =>
          typeof row === 'object' &&
          row !== null &&
          (row as UpgradeItemV2).type === 'upgrade',
      )
      .filter((item) => item.shopable)
    items.sort((a, b) => a.name.localeCompare(b.name))

    return { items, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return {
      items: [],
      error: `Could not load items: ${message}`,
    }
  }
}

export async function getBuilds(): Promise<Build[]> {
  return [
    { id: '1', name: 'Build 1', description: 'This is the first build.' },
    { id: '2', name: 'Build 2', description: 'This is the second build.' },
    { id: '3', name: 'Build 3', description: 'This is the third build.' },
  ]
}

export async function getHeroes(): Promise<Hero[]> {
  return [
    { id: '1', name: 'Hero 1', description: 'This is the first hero.' },
    { id: '2', name: 'Hero 2', description: 'This is the second hero.' },
    { id: '3', name: 'Hero 3', description: 'This is the third hero.' },
  ]
}
