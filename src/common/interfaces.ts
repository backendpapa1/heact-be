export interface IResponseMessage {
  response_code: number;
  message: string;
}

export interface ISignupByBasic {
  email: string;
  password: string;
  displayName: string;
  username: string;
  salt?: string | number;
}


export interface ILoginByBasic {
  email: string;
  password: string;
}
