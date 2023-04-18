import { Params } from '@remix-run/react';

export function requireParam(requiredParam: string, params: Params) {
    const param = params[requiredParam];
    if (!param) {
        throw new Error(`Parameter ${requiredParam} missing!`);
    }
    return param;
}
