import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";
import { tokenValidation } from "../middlewares/auth.tokenValidation.middleware.js";

const router = Router();

// TODO: Implement route controllers for fighter
router.get("/", tokenValidation, async (req, res, next) => {
  const storedFighters = fighterService.getAllFighters();
  res.body = storedFighters;
  return next(res);
});

router.get("/:id", tokenValidation, async (req, res, next) => {
  const id = req.params.id;
  const requestedFighter = fighterService.searchById({ id });
  res.body = requestedFighter;
  return next(res);
});

router.post(
  "/",
  tokenValidation,
  createFighterValid,
  async (req, res, next) => {
    const { name, power, defense, health } = req.body;
    try {
      const unidentifiedUserResponse = fighterService.createFighter({
        name,
        power,
        defense,
        health,
      });
      res.body = unidentifiedUserResponse;
      return next(req.body);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete("/:id", tokenValidation, async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedFighter = fighterService.deleteFighterById(id);
    res.body = deletedFighter;
    return next(res);
  } catch (error) {
    return next(error);
  }
});

router.patch(
  "/:id",
  tokenValidation,
  updateFighterValid,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedFighter = fighterService.updateFighter(id, req.body);
      res.body = updatedFighter;
      return next(res);
    } catch (error) {
      return next(error);
    }
  }
);

export { router };
