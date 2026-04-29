import { add } from './math.js';

test('add returns the sum of two numbers', (): void => {
  expect(add(2, 3)).toBe(5);
});
