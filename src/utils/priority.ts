export type Priority = 'low' | 'medium' | 'high';

export function priorityRank(p: Priority): number {
  if (p === 'low') return 1;
  if (p === 'medium') return 2;
  if (p === 'high') return 3;
  throw new Error(`Unknown priority: ${p}`);
}

export function isHigherPriority(a: Priority, b: Priority): boolean {
  return priorityRank(a) > priorityRank(b);
}
