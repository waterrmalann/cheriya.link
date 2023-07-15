import bcrypt from 'bcrypt';

function hash(password) {
    return bcrypt.hash(password, 10);
}

function compare(password, hash) {
    return bcrypt.compare(password, hash);
}

export default {hash, compare};
