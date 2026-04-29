import { describe, expect, it } from '@jest/globals';

describe('Attendance validation', () => {
  it('accepts valid attendance options', () => {
    const attend = 'Joining Midway';

    const validOptions = ['Yes', 'No', 'Joining Midway'];

    expect(validOptions).toContain(attend);
  });
});
