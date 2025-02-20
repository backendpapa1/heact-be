import DBService from "../utils/DBService";
import { HydratedDocument } from "mongoose";
import User, { IUser } from "../models/user";

class UserService extends DBService<IUser> {
  constructor(populatedFields: string[] = []) {
    super(User, populatedFields);
  }

  public findByEmail(
    email: string,
    session = null,
  ): Promise<HydratedDocument<IUser>> {
    return new Promise((resolve, reject) => {
      User.findOne({ email: email })
        .session(session)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  getSafeUserData(user: IUser) {
    // @ts-ignore
    const { password, salt, google_id, ...rest } = user.toJSON();
    return rest;
  }
}

export default UserService;
