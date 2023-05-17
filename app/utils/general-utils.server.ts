import { EntityNotFoundException } from '~/exception/EntityNotFoundException';
import { Params } from '@remix-run/react';
import { AuthorizationRequest } from '~/routes/authorize';
import { User } from '~/utils/auth/user.server';
import { getSearchParamsFromAuthorizationRequest } from '~/utils/auth/authorization-request.server';
import { redirect } from '@remix-run/node';

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

export function getUrlWithSearchParams(
    currentRoute: string,
    pathName: string,
    searchParams: { key: string; value: string }[]
) {
    const url = new URL(currentRoute);
    url.pathname = pathName;
    searchParams.forEach((param) => {
        url.searchParams.append(param.key, param.value);
    });
    return url.toString();
}

export function redirectToAuthorizationPage(
    currentRoute: string,
    authorizationRequest: AuthorizationRequest,
    init?: ResponseInit
) {
    const searchParams = getSearchParamsFromAuthorizationRequest(authorizationRequest);
    const redirectionUrl = getUrlWithSearchParams(currentRoute, '/authorize', searchParams);
    return redirect(redirectionUrl, init);
}
