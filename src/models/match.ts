import mongoose, { Schema, Document, model } from "mongoose";
import { MODEL_NAME } from "./manifest";







export interface IMatch extends Document {
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
  createdAt?: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Ensure a unique match between two users
MatchSchema.index({ user1: 1, user2: 1 }, { unique: true });

export default model<IMatch>(MODEL_NAME.MATCH, MatchSchema);
