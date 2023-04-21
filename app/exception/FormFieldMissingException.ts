export class FormFieldMissingException extends Error {
    constructor(field: string) {
        const message = `${field} is required`;
        super(message);
    }
}
