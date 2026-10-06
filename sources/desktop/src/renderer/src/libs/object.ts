export type ObjectRecord = Record<string, unknown>

export function getDisplayValue(source: ObjectRecord | null, keys: string[]): string {
  if (!source) {
    return ''
  }

  for (const key of keys) {
    const value = key.split('.').reduce<unknown>((current, part) => {
      if (current && typeof current === 'object' && part in current) {
        return (current as ObjectRecord)[part]
      }
      return undefined
    }, source)

    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
    if (typeof value === 'number') {
      return String(value)
    }
  }

  return ''
}
