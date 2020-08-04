import { randomBetween } from "./random-between"

export type NumberValueOrRange = number | [number, number]

export function getValueOrRange(value: number[] | number, round = true): number {
  if (Array.isArray(value)) return randomBetween(value[0], value[1], round)
  return value
}
