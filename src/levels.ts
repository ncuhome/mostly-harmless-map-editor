import { Vec2 } from "kaboom"

export const makeLevelLeft = (pos: Vec2) => {
  return addLevel([
    'qwwwwwe',
    'asssssd',
    'asssssd',
    'asssssd',
    'asssssd',
    'asssssd',
    'zxxxxxc',
  ], {
    width: 16,
    height: 16,
    pos,
    "q": () => [
      sprite("q"),
      area(),
    ],
    "w": () => [
      sprite("w"),
      area(),
    ],
    "e": () => [
      sprite("e"),
      area(),
    ],
    "a": () => [
      sprite("a"),
      area(),
    ],
    "s": () => [
      sprite("s"),
      area(),
    ],
    "d": () => [
      sprite("d"),
      area(),
    ],
    "z": () => [
      sprite("z"),
      area(),
    ],
    "x": () => [
      sprite("x"),
      area(),
    ],
    "c": () => [
      sprite("c"),
      area(),
    ],
  })
}

export const makeLevelRight = (pos: Vec2) => {
  return addLevel([
    'uiiio',
    'jkkkl',
    'jkkkl',
    'jkkkl',
    'm,,,.'
  ], {
    pos,
    width: 16,
    height: 16,
    "u": () => [
      sprite("u"),
      area(),
    ],
    "i": () => [
      sprite("i"),
      area(),
    ],
    "o": () => [
      sprite("o"),
      area(),
    ],
    "j": () => [
      sprite("j"),
      area(),
    ],
    "k": () => [
      sprite("k"),
      area(),
    ],
    "l": () => [
      sprite("l"),
      area(),
    ],
    "m": () => [
      sprite("m"),
      area(),
    ],
    ",": () => [
      sprite(","),
      area(),
    ],
    ".": () => [
      sprite("."),
      area(),
    ],
  })
}