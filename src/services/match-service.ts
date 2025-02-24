

import DBService from "../utils/DBService";
import { HydratedDocument } from "mongoose";
import Match, { IMatch } from "../models/match";


class MatchService extends DBService<IMatch> {
  constructor(populatedFields: string[] = []) {
    super(Match, populatedFields);
  }


}

export default MatchService;
