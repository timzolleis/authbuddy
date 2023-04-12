export class EnvRequiredException extends Error {
    constructor(missing: string) {
        super(`ENV variable ${missing} is not configured! Please check your .env file.`);
    }
}
