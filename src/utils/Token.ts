import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../models/user";

dotenv.config();

interface IErr {
  state: number;
  data: any;
}

class Token {
  protected token;

  constructor(token?: any) {
    this.token = token;
  }

  createToken(user: IUser) {
    const data = {
      userId: user?._id,
      email: user?.email,
      // username: user?.username,
    };
    return Jwt.sign({ data: data }, process.env.TOKEN_SECRET as string, {
      expiresIn: "168h",
    });
  }

  verifyToken() {
    return new Promise((resolve, reject) => {
      Jwt.verify(
        this.token,
        process.env.TOKEN_SECRET as string,
        { ignoreExpiration: true },
        (err: any, decoded: any) => {
          if (err) {
            reject({ state: 2, data: err });
          } else {
            resolve(decoded);
          }
        },
      );
    });
  }
}

class TokenBuilder {
  protected token: any;

  setToken(token: any) {
    this.token = token;
    return this;
  }

  build() {
    return new Token(this.token);
  }
}

export default TokenBuilder;

//    create verify and create token
//    setup login session
//    login user after successful registration with loggin session
//    verify login session in token after parsing jwt token
