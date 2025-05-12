import { MESSAGES } from "../constants/response.messages.js";
import { CustomError } from "../types/CustomError.js";
import {
  checkAtLeastOneParamExist,
  checkEveryParamExistence,
  emailToLowerCased,
} from "../helpers/middlewares.helper.js";

const createUserValid = (req, res, next) => {
  // TODO: Implement validatior for USER entity during creation
  let { firstName, lastName, email, phoneNumber, password } = req.body;
  if (
    checkEveryParamExistence(firstName, lastName, email, phoneNumber, password)
  ) {
    req.body.email = emailToLowerCased(req.body.email);
    return next();
  }
  const paramsEroor = new CustomError(
    MESSAGES.USER_MESSAGES.ERROR_USER_VALIDATION_MIDDLEWARE,
    400
  );
  return next(paramsEroor);
};

const updateUserValid = (req, res, next) => {
  // TODO: Implement validatior for user entity during update
  let { firstName, lastName, email, phoneNumber, password } = req.body;
  if (
    checkAtLeastOneParamExist(firstName, lastName, email, phoneNumber, password)
  ) {
    return next();
  } else {
    const requestedDataError = new CustomError(
      `${MESSAGES.GENERIC_EMPTY_REQUEST_ERROR} ${MESSAGES.USER_MESSAGES.ERROR_USER_UPDATE_EMPTY_PARAMS}`,
      400
    );
    return next(requestedDataError);
  }
};

export { createUserValid, updateUserValid };
