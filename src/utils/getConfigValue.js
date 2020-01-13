import { randomBetween } from "./randomBetween";

export function getConfigValue(value, round = true) {
  if (Array.isArray(value)) {
    return randomBetween(value[0], value[1], round);
  }

  return value;
}
