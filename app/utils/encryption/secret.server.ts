import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function generateSecret() {
    return crypto.randomBytes(32).toString('hex');
}

export async function hashSecret(secret: string) {
    return await bcrypt.hash(secret, 10);
}
