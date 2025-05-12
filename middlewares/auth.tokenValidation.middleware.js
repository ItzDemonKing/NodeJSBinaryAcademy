import { MESSAGES } from "../constants/response.messages.js";
import { authService } from "../services/authService.js";
import { CustomError } from "../types/CustomError.js";

export const tokenValidation = (req, res, next) => {
  // Validate token header where header = userId header (user.id) + secret key + hashed
  const token = req.headers["x-access-token"];
  const userId = req.headers["x-user-id"];

  if (!token || !userId) {
    const missingAuthParams = new CustomError(
      MESSAGES.ERROR_SECURITY_TOKEN_OR_ID_MISSING,
      401
    );
    return next(missingAuthParams);
  }

  const expectedToken = authService.generateToken(userId);

  if (token !== expectedToken) {
    const wrongToken = new CustomError(
      MESSAGES.ERROR_SECURITY_TOKEN_BAD_CREDENTIAL,
      401
    );
    return next(wrongToken);
  }

  res.set("x-access-token", token);
  res.set("x-user-id", userId);

  next();
};
