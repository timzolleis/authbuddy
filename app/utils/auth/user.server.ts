import { ROLE } from '.prisma/client';

export class User {
    id: string;
    displayName: string;
    avatarUrl: string;
    role: ROLE;
    constructor(id: string, displayName: string, avatarUrl: string, role: ROLE) {
        this.id = id;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.role = role;
    }
}
