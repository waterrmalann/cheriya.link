import { Schema, model } from "mongoose";

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

const tokenModel = model("Token", tokenSchema);

export { tokenSchema, tokenModel };