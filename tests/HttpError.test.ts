import { describe, test, expect } from 'vitest';
import { HttpError } from '../src/logic/HttpError';

describe('HttpError', () => {
  test('extends Error', () => {
    expect(new HttpError(500)).toBeInstanceOf(Error);
  });

  test('is instanceof HttpError', () => {
    expect(new HttpError(500)).toBeInstanceOf(HttpError);
  });

  test('stores the response status', () => {
    expect(new HttpError(503).status).toBe(503);
  });

  test('has name HttpError', () => {
    expect(new HttpError(500).name).toBe('HttpError');
  });
});