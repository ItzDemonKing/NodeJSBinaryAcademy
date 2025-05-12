import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { tokenValidation } from "../middlewares/auth.tokenValidation.middleware.js";
import { authService } from "../services/authService.js";

const router = Router();

// TODO: Implement route controllers for user

router.get("/", async (req, res, next) => {
  const storedUsers = userService.getAllUsers();
  res.body = storedUsers;
  return next(res);
});

router.get("/:id", tokenValidation, async (req, res, next) => {
  const id = req.params.id;
  const requestedUser = userService.searchById({ id });
  res.body = requestedUser;
  return next(res);
});

router.post("/", createUserValid, async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    // db should do this logic, but since it doesn't, we only take expected model values
    const unidentifiedUserResponse = userService.createUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    const token = authService.generateToken(unidentifiedUserResponse.id);
    res.set("x-access-token", token);
    res.set("x-user-id", unidentifiedUserResponse.id);
    res.body = unidentifiedUserResponse;
    return next(req.body);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", tokenValidation, async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = userService.deleteUserById(id);
    res.body = deletedUser;
    return next(res);
  } catch (error) {
    return next(error);
  }
});

router.patch(
  "/:id",
  tokenValidation,
  updateUserValid,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedUser = userService.updateUser(id, req.body);
      res.body = updatedUser;
      return next(res);
    } catch (error) {
      return next(error);
    }
  }
);

export { router };
