import { AuthorizationRequest } from '~/routes/authorize';

export function getSearchParamsFromAuthorizationRequest(
    authorizationRequest: AuthorizationRequest
) {
    const keys = Object.keys(authorizationRequest).filter((key) => key !== 'request_start');
    const searchParams = keys.map((key) => {
        return {
            key: key,
            value: authorizationRequest[key as keyof typeof authorizationRequest]?.toString(),
        };
    });
    //Typescript not smart enough to infer filtered type, have to typecast here
    return searchParams.filter((searchParam) => searchParam.value) as {
        key: string;
        value: string;
    }[];
}
