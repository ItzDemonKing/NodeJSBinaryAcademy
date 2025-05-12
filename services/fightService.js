import { MESSAGES } from "../constants/response.messages.js";
import { castValuesToNumber } from "../helpers/services.helper.js";
import { fightRepository } from "../repositories/fightRepository.js";
import { CustomError } from "../types/CustomError.js";
import { fighterService } from "./fighterService.js";

class FightsService {
  // OPTIONAL TODO: Implement methods to work with fights

  searchById(id) {
    const item = fightRepository.getOne(id);
    if (!item) {
      throw new CustomError(
        `${MESSAGES.FIGHT_MESSAGES.ERROR_FIGHT_NOT_FOUND} Id:${id}`,
        404
      );
    }
    return item;
  }

  checkFighterExistence(fighterId) {
    try {
      const foundFighter = fighterService.searchById({ id: fighterId });
      if (!foundFighter) {
        //we shouldnt see this error. Response middleware would handle anyways
        throw new Error("No fighter found with id", fighterId);
      }
    } catch (error) {
      // expected custom error from fighterService
      throw new CustomError(
        `${MESSAGES.FIGHT_MESSAGES.ERROR_FIGHTER_NOT_FOUND} ${fighterId}`,
        404
      );
    }
  }

  createFight(fighter1, fighter2) {
    try {
      this.checkFighterExistence(fighter1);
      this.checkFighterExistence(fighter2);
    } catch (error) {
      //handled by response middleware
      throw error;
    }
    try {
      const newFight = fightRepository.create({
        fighter1,
        fighter2,
        log: [],
      });
      return newFight;
    } catch (error) {
      throw new CustomError(
        MESSAGES.FIGHTER_MESSAGES.UNEXPECTED_FIGHTER_CREATING,
        500
      );
    }
  }

  updateFight(id, data) {
    let { fighter1Shot, fighter2Shot, fighter1Health, fighter2Health } = data;
    try {
      const currentFight = this.searchById({ id });
      fighter1Shot = castValuesToNumber(fighter1Shot);
      fighter2Shot = castValuesToNumber(fighter2Shot);
      fighter1Health = castValuesToNumber(fighter1Health);
      fighter2Health = castValuesToNumber(fighter2Health);

      const newLog = [
        { fighter1Shot, fighter2Shot, fighter1Health, fighter2Health },
      ];

      const updatedFight = fightRepository.update(id, {
        ...currentFight,
        log: [...currentFight.log.concat(newLog)],
      });

      return updatedFight;
    } catch (error) {
      //handled by response middleware
      throw error;
    }
  }
}

const fightsService = new FightsService();

export { fightsService };
