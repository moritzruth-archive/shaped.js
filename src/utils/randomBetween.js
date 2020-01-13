export function randomBetween (min, max, round = true) {
  const number = (Math.random() * (max - min)) + min;

  if (round) {
    return Math.round(number);
  }

  return number;
}
