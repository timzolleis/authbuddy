export class InternalUser {
    id: string;
    displayName: string;
    avatarUrl: string;
    constructor(id: string, displayName: string, avatarUrl: string) {
        this.id = id;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
    }
}