export class UserNotFoundException extends Error {
    constructor() {
        super(`There was no user found.`);
    }
}
