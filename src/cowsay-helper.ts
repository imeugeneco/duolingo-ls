const cowsayAnimals = [
  'cow',
  'sheep',
  'cheese',
  'kitty',
  'tux',
  'moose',
  'small',
  'ghostbusters',
  'three-eyes',
];

export function getRandomAnimal(): string {
  const randomIndex = Math.floor(Math.random() * cowsayAnimals.length);
  return cowsayAnimals[randomIndex];
}
