import mongoose, { Schema, Document, model } from "mongoose";
import { MODEL_NAME } from "./manifest";



export interface IInteraction extends Document {
  fromUser: mongoose.Types.ObjectId; // User who initiates the interaction
  toUser: mongoose.Types.ObjectId; // User receiving the interaction
  type: 'LIKE' |'DISLIKE' | 'SUPER_LIKE' | 'ROSES'; // Like or Dislike
  createdAt?: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ['LIKE','DISLIKE','SUPER_LIKE','ROSES'], required: true },
  },
  { timestamps: true }
);

// Ensure a user cannot like/dislike the same user multiple times
InteractionSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export default model<IInteraction>(MODEL_NAME.INTERACTION, InteractionSchema);
