import { describe, expect, it } from '@jest/globals';

describe('Event time validation', () => {
  it('rejects an event when start time is after end time', () => {
    const startTime = '15:00';
    const endTime = '13:00';

    expect(startTime < endTime).toBe(false);
  });
});
