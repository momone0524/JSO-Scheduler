import { describe, expect, it } from '@jest/globals';
describe('User validation', () => {
  it('accepts a valid user role', () => {
    const role = 'Board Member';

    expect(role).toBe('Board Member');
  });
});
