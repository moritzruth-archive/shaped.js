export function randomBetween(min: number, max: number, round = true): number {
  const number = (Math.random() * (max - min)) + min
  if (round) return Math.round(number)
  return number
}
