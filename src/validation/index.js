import { validationResult } from "express-validator";
import { validationError } from "../utils/response.js";

const validate = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array()[0].msg);
    }
    next();
  };
};

export { validate };
