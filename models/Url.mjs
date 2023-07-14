import { Schema, model } from "mongoose";

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

const urlModel = model("URL", urlSchema);

export { urlSchema, urlModel };