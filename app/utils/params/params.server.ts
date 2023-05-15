import { Params } from '@remix-run/react';

export function requireParameter(requiredParam: string, params: Params) {
    const param = params[requiredParam];
    if (!param) {
        throw new Error(`Parameter ${requiredParam} missing!`);
    }
    return param;
}
