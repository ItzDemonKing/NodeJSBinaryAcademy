import crypto from "crypto";
import dotenv from "dotenv";
import { MESSAGES } from "../constants/response.messages.js";
import { UserEntity } from "../types/BaseEntity.js";
import { CustomError } from "../types/CustomError.js";
import { userService } from "./userService.js";

dotenv.config();

class AuthService {
  generateToken(userId) {
    const secret = process.env.DB_KEY_GENERATOR;
    return crypto.createHmac("sha256", secret).update(userId).digest("hex");
  }

  login(userData) {
    const user = userService.search(userData);
    if (!user) {
      throw new CustomError(
        MESSAGES.USER_MESSAGES.ERROR_USER_CREDENTIAL_LOGIN,
        401
      );
    }
    const token = this.generateToken(user.id);
    return { user: new UserEntity(user).returnUnidentified(), token };
  }
}

const authService = new AuthService();

export { authService };
