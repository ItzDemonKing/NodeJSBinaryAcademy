import { MESSAGES } from "../constants/response.messages.js";
import { CustomError } from "../types/CustomError.js";
import {
  checkAtLeastOneParamExist,
  checkEveryParamExistence,
} from "../helpers/middlewares.helper.js";

/*
When creating a fighter — all fields are required, except for id and health
When updating a user or a fighter — at least one field from the model must be present
*/
const createFighterValid = (req, res, next) => {
  // TODO: Implement validatior for FIGHTER entity during creation
  const { name, power, defense } = req.body;
  if (checkEveryParamExistence(name, power, defense)) {
    return next();
  }
  const paramsEroor = new CustomError(
    MESSAGES.FIGHTER_MESSAGES.ERROR_FIGHTER_CREATE_PARAMS,
    400
  );
  return next(paramsEroor);
};

const updateFighterValid = (req, res, next) => {
  // TODO: Implement validatior for FIGHTER entity during update
  const { name, health, power, defense } = req.body;
  if (checkAtLeastOneParamExist(name, health, power, defense)) {
    return next();
  }
  const requestedDataError = new CustomError(
    `${MESSAGES.GENERIC_EMPTY_REQUEST_ERROR} ${MESSAGES.FIGHTER_MESSAGES.ERROR_FIGHTER_UPDATE_EMPTY_PARAMS}`,
    400
  );
  return next(requestedDataError);
};

export { createFighterValid, updateFighterValid };
