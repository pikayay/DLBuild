import type { UpgradeItemV2 } from '@/lib/deadlock-api'

/** Primary slot group order for the catalog UI. */
export const SLOT_ORDER = ['spirit', 'weapon', 'vitality'] as const

/** In-game upgrade price tiers (souls). */
export const COST_TIERS = [800, 1600, 3200, 6400, 9999] as const

type CatalogSlot = (typeof SLOT_ORDER)[number] | string

export interface CostGroup {
  cost: number
  items: UpgradeItemV2[]
}

export interface SlotGroup {
  slot: string
  displayName: string
  costGroups: CostGroup[]
  totalCount: number
}

function isCatalogSlot(s: string): s is CatalogSlot {
  return (SLOT_ORDER as readonly string[]).includes(s)
}

/**
 * Groups shop upgrades by slot type, then by exact cost tier.
 * Slots follow spirit → weapon → vitality; unknown slots are appended alphabetically.
 * Costs follow the standard tier ladder; any other price appears last per slot.
 */
export function buildSlotCostCatalog(items: UpgradeItemV2[]): SlotGroup[] {
  const bucket = new Map<string, Map<number, UpgradeItemV2[]>>()

  for (const item of items) {
    const slot = item.item_slot_type
    const cost = item.cost
    if (cost == null) continue

    if (!bucket.has(slot)) bucket.set(slot, new Map())
    const costMap = bucket.get(slot)!
    if (!costMap.has(cost)) costMap.set(cost, [])
    costMap.get(cost)!.push(item)
  }

  const presentSlots = [...bucket.keys()]
  const unknownSlots = presentSlots.filter((s) => !isCatalogSlot(s)).sort()
  const orderedSlots: string[] = [
    ...SLOT_ORDER.filter((s) => bucket.has(s)),
    ...unknownSlots,
  ]

  return orderedSlots.map((slot) => {
    const costMap = bucket.get(slot)!
    const presentCosts = [...costMap.keys()].sort((a, b) => a - b)
    const tierSet = new Set<number>(COST_TIERS)
    const orderedCosts = [
      ...COST_TIERS.filter((t) => costMap.has(t)),
      ...presentCosts.filter((c) => !tierSet.has(c)),
    ]

    const costGroups: CostGroup[] = orderedCosts.map((cost) => ({
      cost,
      items: [...costMap.get(cost)!].sort((a, b) => a.name.localeCompare(b.name)),
    }))

    const totalCount = costGroups.reduce((n, g) => n + g.items.length, 0)

    return {
      slot,
      displayName: slot.charAt(0).toUpperCase() + slot.slice(1),
      costGroups,
      totalCount,
    }
  })
}
