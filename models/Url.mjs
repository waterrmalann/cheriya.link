import { Schema, model } from "mongoose";

/**
 * URL schema definition
 */
const urlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * URL model based on the URL schema.
 */
const urlModel = model("URL", urlSchema);

export { urlSchema, urlModel };