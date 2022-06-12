import { hash, compare } from 'bcrypt';

export async function hashPassword(password) {
    const hashed = await hash(password, 12);
    return hashed;
}

export async function comparePassword(candidate, password) {
    const isValid = await compare(candidate, password);
    return isValid;
}
