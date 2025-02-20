import mongoose, { Document, Schema, Model, modelNames } from "mongoose";
import { MODEL_NAME } from "./manifest";

// Define the interface for the Media document
export interface IMedia extends Document {
  key:string;
  original_name: string;
  bucket: string;
  mimetype: string;
  size: number;
  etag: string;
  user: mongoose.Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
  slot: number;
}

// Define the schema for Media
const MediaSchema: Schema<IMedia> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: MODEL_NAME.USER, required: true },
    original_name:{type: String,required: true},
    bucket:{type: String,required: true},
    mimetype:{type: String,required: true},
    etag:{type: String,required: true},
    size:{type: Number,required: true},
    key:{type: String,required: true,unique: true},
    slot:{type: Number,default:0}
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Create and export the Media model
const Media: Model<IMedia> = mongoose.model<IMedia>(MODEL_NAME.MEDIA, MediaSchema);
export default Media;
