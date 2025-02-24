import DBService from "../utils/DBService";
import { HydratedDocument } from "mongoose";
import Interaction, { IInteraction } from "../models/interaction";


class InteractionService extends DBService<IInteraction> {
  constructor(populatedFields: string[] = []) {
    super(Interaction, populatedFields);
  }


}

export default InteractionService;
