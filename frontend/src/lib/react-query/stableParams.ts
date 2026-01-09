/**
 * Helper to create stable query params object
 * Removes undefined fields and sorts keys shallowly for consistent query keys
 */
export function stableParams<T extends Record<string, any>>(
  params: T
): Partial<T> {
  const stable: Partial<T> = {};
  const sortedKeys = Object.keys(params).sort();
  
  for (const key of sortedKeys) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      stable[key as keyof T] = value;
    }
  }
  
  return stable;
}

