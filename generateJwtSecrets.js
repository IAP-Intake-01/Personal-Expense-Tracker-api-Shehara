import crypto from 'crypto';

const generateSecret = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

const jwtSecret = generateSecret(32); // 32 bytes => 64 hex characters
const jwtRefreshSecret = generateSecret(64); // 64 bytes => 128 hex characters

console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
