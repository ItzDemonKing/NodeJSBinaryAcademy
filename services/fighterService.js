import { MESSAGES } from "../constants/response.messages.js";
import { filterOnlyExistingParams } from "../helpers/middlewares.helper.js";
import { castValuesToNumber } from "../helpers/services.helper.js";
import { fighterRepository } from "../repositories/fighterRepository.js";
import { CustomError } from "../types/CustomError.js";

function normalizeName(name) {
  const lowerCased = name.toLowerCase();
  const capitalized = lowerCased
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return capitalized;
}

class FighterService {
  // TODO: Implement methods to work with fighters
  constructor() {
    this._defenseValues = {
      min: 1,
      max: 10,
    };
    this._healthValues = {
      min: 80,
      max: 120,
      default: 85,
    };
    this._powerValues = {
      min: 1,
      max: 100,
    };
  }
  search(search) {
    const item = fighterRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }

  isNameUnique(name) {
    if (this.search({ name })) {
      throw new CustomError(MESSAGES.FIGHTER_MESSAGES.ERROR_NAME_UNIQUE, 400);
    }
  }

  isDefenseInRange(defense) {
    defense = castValuesToNumber(defense);
    if (
      !(
        this._defenseValues.min <= defense && defense <= this._defenseValues.max
      )
    ) {
      throw new CustomError(
        MESSAGES.FIGHTER_MESSAGES.ERROR_DEFENSE_RANGE_VALUE,
        400
      );
    }
  }

  isHealthInRange(health) {
    health = castValuesToNumber(health);
    if (
      !(this._healthValues.min <= health && health <= this._healthValues.max)
    ) {
      throw new CustomError(
        MESSAGES.FIGHTER_MESSAGES.ERROR_HEALTH_RANGE_VALUE,
        400
      );
    }
  }

  isPowerInRange(power) {
    power = castValuesToNumber(power);
    if (!(this._powerValues.min <= power && power <= this._powerValues.max)) {
      throw new CustomError(
        MESSAGES.FIGHTER_MESSAGES.ERROR_POWER_RANGE_VALUE,
        400
      );
    }
  }

  checkAllData(data) {
    data.name = normalizeName(data.name);
    data.health = data.health || this._healthValues.default;
    this.isNameUnique(data.name);
    this.isDefenseInRange(data.defense);
    this.isHealthInRange(data.health);
    this.isPowerInRange(data.power);
  }

  searchById(id) {
    const item = fighterRepository.getOne(id);
    if (!item) {
      throw new CustomError(
        MESSAGES.FIGHTER_MESSAGES.ERROR_FIGHTER_NOT_FOUND,
        404
      );
    }
    return item;
  }

  deleteFighterById(id) {
    const item = fighterRepository.delete(id);
    if (item.length === 0) {
      throw new CustomError(
        MESSAGES.FIGHTER_MESSAGES.ERROR_FIGHTER_NOT_FOUND,
        404
      );
    }
    return item;
  }

  getAllFighters() {
    return fighterRepository.getAll();
  }

  createFighter(data) {
    try {
      this.checkAllData(data);
    } catch (error) {
      //handled by response middleware
      throw error;
    }
    try {
      const newFighter = fighterRepository.create({ ...data });
      return newFighter;
    } catch (error) {
      throw new CustomError(
        MESSAGES.FIGHTER_MESSAGES.UNEXPECTED_FIGHTER_CREATING,
        500
      );
    }
  }

  updateFighter(id, data) {
    let { name, power, defense, health } = data;
    try {
      const currentFighter = this.searchById({ id });
      if (!currentFighter) {
        throw new CustomError(
          MESSAGES.FIGHTER_MESSAGES.ERROR_FIGHTER_NOT_FOUND,
          404
        );
      }
      if (name) {
        name = normalizeName(name);
        this.isNameUnique(name);
      }
      if (power) {
        this.isPowerInRange(power);
      }
      if (defense) {
        this.isDefenseInRange(defense);
      }
      if (health) {
        this.isHealthInRange(health);
      }
      const filteredParams = filterOnlyExistingParams(
        {
          name,
          power,
          defense,
          health,
        },
        currentFighter
      );
      const updatedFighter = fighterRepository.update(id, {
        ...filteredParams,
      });
      return updatedFighter;
    } catch (error) {
      //handled by response middleware
      throw error;
    }
  }
}

const fighterService = new FighterService();

export { fighterService };
