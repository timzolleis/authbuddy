import { EntityNotFoundException } from '~/exception/EntityNotFoundException';
import { Params } from '@remix-run/react';

export function requireResult<T>(value: T | undefined | null): T {
    if (!value) {
        throw new EntityNotFoundException('Result');
    }
    return value;
}

export function requireParameter(requiredParam: string, params: Params) {
    const param = params[requiredParam];
    if (!param) {
        throw new Error(`Parameter ${requiredParam} missing!`);
    }
    return param;
}
