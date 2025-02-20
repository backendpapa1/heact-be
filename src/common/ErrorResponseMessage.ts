class ErrorResponseMessage {
  // 	Payload Errors

  public PAYLOAD_INCORRECT = (payload: string) => {
    return {
      response_code: 10,
      message: `${payload} is incorrect, check and try again!`,
    };
  };
  public ACTION_ERROR = (payload: string) => {
    return { response_code: 11, message: `${payload}!` };
  };

  public RESOURCE_ERROR = () => {
    return {
      response_code: 12,
      message: `resource could not be found! try again!`,
    };
  };

  public AUTH_ERROR = (name: string) => {
    return { response_code: 13, message: `${name}` };
  };

  public NOT_AUTHORIZED = {
    response_code: 1,
    message: `not authorized!`,
  };
  public INVALID_TOKEN = {
    response_code: 2,
    message: `invalid token!`,
  };

  public badRequestError(message: string) {
    return {
      response_code: 3,
      message: message,
    };
  }

  public UNABLE_TO_COMPLETE_REQUEST = {
    response_code: 4,
    message: "Unable to complete request",
  };

  public NOT_FOUND = {
    response_code: 5,
    message: "Resource not found.",
  };

  public ALREADY_EXISTS_ERROR = (resource: string) => {
    return {
      response_code: 101,
      message: `${resource} is already in use by a user`,
    };
  };

  public INTERACTION_LIMIT_EXCEEDED = {
    response_code: 712,
    message: `You exceeded your interaction limit`,
  };

  public INSUFFICIENT_COIN_BALANCE = {
    response_code: 714,
    message: `You have insufficient coin`,
  };
}

export default ErrorResponseMessage;
