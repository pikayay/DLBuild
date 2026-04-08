/**
 * URL slug from the in-game display name (`item.name`), not `class_name` or numeric id.
 * Example: "Extended Magazine" → `extended_magazine`
 */
export function itemDisplayNameToSlug(displayName: string): string {
  return displayName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function itemDetailHref(displayName: string): string {
  return `/deadlock/items/${itemDisplayNameToSlug(displayName)}`
}
