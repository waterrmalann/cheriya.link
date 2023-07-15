import { Schema, model } from "mongoose";

/**
 * Token schema definition
 */
const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    createdFor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Token model based on the token schema.
 */
const tokenModel = model("Token", tokenSchema);

export { tokenSchema, tokenModel };