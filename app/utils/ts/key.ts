export function hasKey<O extends object, K extends PropertyKey>(
    obj: O,
    key: K
): obj is O & Record<K, O> {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
