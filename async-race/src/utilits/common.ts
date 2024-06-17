export function isNotNullable<T>(value: unknown): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export function isHTMLElement(value: unknown): value is HTMLElement {
    if (value === null || value === undefined) {
        return false;
    }
    return value instanceof HTMLElement;
}

export type ConstructorOf<T> = { new (...args: never[]): T; prototype: T };

export function isInstanceOf<T>(
    elemType: ConstructorOf<T>,
    value: unknown
): value is T {
    return value instanceof elemType;
}
