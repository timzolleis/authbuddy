export class EntityNotFoundException extends Error {
    constructor(entity: string) {
        const message = `${entity.toLowerCase()}.missing`;
        super(message);
    }
}
