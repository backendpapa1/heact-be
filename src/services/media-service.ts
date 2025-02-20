import DBService from "../utils/DBService";
import { HydratedDocument } from "mongoose";
import Media, { IMedia } from "../models/media";

class MediaService extends DBService<IMedia> {
  constructor(populatedFields: string[] = []) {
    super(Media, populatedFields);
  }

  

  
}

export default MediaService;
