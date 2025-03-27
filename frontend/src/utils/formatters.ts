/**
 * Converts a string from snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

/**
 * Converts a string from camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, (group) => '_' + group.toLowerCase());
}

/**
 * Deep transforms all keys in an object from snake_case to camelCase
 */
export function transformKeysToCamelCase<T>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformKeysToCamelCase) as unknown as T;
  }

  const camelCaseObj: Record<string, any> = {};
  
  Object.keys(obj).forEach((key) => {
    const camelKey = snakeToCamel(key);
    camelCaseObj[camelKey] = transformKeysToCamelCase(obj[key]);
  });
  
  return camelCaseObj as T;
}

/**
 * Deep transforms all keys in an object from camelCase to snake_case
 */
export function transformKeysToSnakeCase<T>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformKeysToSnakeCase) as unknown as T;
  }

  const snakeCaseObj: Record<string, any> = {};
  
  Object.keys(obj).forEach((key) => {
    const snakeKey = camelToSnake(key);
    snakeCaseObj[snakeKey] = transformKeysToSnakeCase(obj[key]);
  });
  
  return snakeCaseObj as T;
} 