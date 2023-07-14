import { Schema, model } from "mongoose";
import pass from '../utils/password.mjs';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    urls: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.comparePassword = function (password) {
    return pass.compare(password, this.password);
}

const userModel = model("User", userSchema);

function getUserByEmail(email) {
    const user = userModel.findOne({email: email});
    return user;
}

// Return an user by their username.
function getUserByUsername(username) {
    const user = userModel.findOne({username: username});
    return user;
}


export { userModel, getUserByEmail, getUserByUsername };