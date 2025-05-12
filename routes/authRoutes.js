import { Router } from "express";
import { authService } from "../services/authService.js";
import { authCredentialsValidate } from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/login", authCredentialsValidate, (req, res, next) => {
  try {
    // TODO: Implement login action (get the user if it exist with entered credentials)
    const { email, password } = req.body;
    const { user, token } = authService.login({ email, password });
    res.set("x-access-token", token);
    res.set("x-user-id", user.id);
    res.body = user;
    next(res);
  } catch (error) {
    //handled by response middleware
    throw error;
  }
});

export { router };
