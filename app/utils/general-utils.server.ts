import { EntityNotFoundException } from '~/exception/EntityNotFoundException';

export function requireResult<T>(value: T | undefined | null): T {
    if (!value) {
        throw new EntityNotFoundException('Result');
    }
    return value;
}
