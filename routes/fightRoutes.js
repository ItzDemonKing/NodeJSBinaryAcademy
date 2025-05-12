import { Router } from "express";
import { tokenValidation } from "../middlewares/auth.tokenValidation.middleware.js";
import { fightsService } from "../services/fightService.js";
import {
  createFightValid,
  updateFightValid,
} from "../middlewares/fight.validation.middleware.js";

const router = Router();

// OPTIONAL TODO: Implement route controller for fights
router.post("/", tokenValidation, createFightValid, (req, res, next) => {
  const { fighter1, fighter2 } = req.body;
  try {
    const fightCreated = fightsService.createFight(fighter1, fighter2);
    res.body = fightCreated;
    return next(req.body);
  } catch (error) {
    return next(error);
  }
});

router.patch(
  "/:id/log",
  tokenValidation,
  updateFightValid,
  (req, res, next) => {
    const id = req.params.id;
    try {
      const fightUpdated = fightsService.updateFight(id, {
        ...req.body,
      });
      res.body = fightUpdated;
      return next(req.body);
    } catch (error) {
      return next(error);
    }
  }
);

export { router };
