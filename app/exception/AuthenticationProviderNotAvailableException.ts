export class AuthenticationProviderNotAvailableException extends Error {
    constructor(providerName: string) {
        super(
            `The authentication provider ${providerName} is not available at the moment. Please try another one or open an issue on GitHub`
        );
    }
}