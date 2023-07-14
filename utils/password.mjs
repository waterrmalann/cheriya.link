import bcrypt from 'bcrypt';

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function compare(password, hash) {
    return bcrypt.compareSync(password, hash);
}

export default {hash, compare};
