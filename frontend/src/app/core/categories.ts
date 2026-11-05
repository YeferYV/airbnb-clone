import { Category } from './models';

export const CATEGORIES: Category[] = [
  { label: 'Beach', icon: 'beach', description: 'This property is close to the beach!' },
  { label: 'Windmills', icon: 'windmill', description: 'This property has windmills!' },
  { label: 'Modern', icon: 'home', description: 'This property is modern!' },
  { label: 'Countryside', icon: 'mountain', description: 'This property is in the countryside!' },
  { label: 'Pools', icon: 'waves', description: 'This property has a beautiful pool!' },
  { label: 'Islands', icon: 'island', description: 'This property is on an island!' },
  { label: 'Lake', icon: 'boat', description: 'This property is near a lake!' },
  { label: 'Skiing', icon: 'ski', description: 'This property has skiing activities!' },
  { label: 'Castles', icon: 'castle', description: 'This property is an ancient castle!' },
  { label: 'Caves', icon: 'cave', description: 'This property is in a cave!' },
  { label: 'Camping', icon: 'tent', description: 'This property offers camping activities!' },
  { label: 'Arctic', icon: 'snow', description: 'This property is in an arctic environment!' },
  { label: 'Desert', icon: 'cactus', description: 'This property is in the desert!' },
  { label: 'Barns', icon: 'barn', description: 'This property is a barn!' },
  { label: 'Lux', icon: 'diamond', description: 'This property is brand new and luxurious!' },
];

export function findCategory(label: string | undefined | null): Category | undefined {
  return CATEGORIES.find((category) => category.label === label);
}
