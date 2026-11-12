import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../src/logic/debounce';

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('returns a function', () => {
    expect(typeof debounce(() => {}, 100)).toBe('function');
  });

  test('does not call fn immediately', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d();
    expect(fn).not.toHaveBeenCalled();
  });

  test('calls fn after delay', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('resets the timer on repeated calls', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d();
    vi.advanceTimersByTime(200);
    d();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('does not call fn multiple times on a series of rapid calls', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d(); d(); d(); d(); d();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('passes the latest arguments', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d('a'); d('b'); d('c');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('c');
  });

  test('calls fn again after a pause', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d('a');
    vi.advanceTimersByTime(300);
    d('b');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'a');
    expect(fn).toHaveBeenNthCalledWith(2, 'b');
  });

  test('still calls asynchronously when delay=0', () => {
    const fn = vi.fn();
    const d = debounce(fn, 0);
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});