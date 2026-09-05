import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';

beforeEach(() => cleanup());
import { ProgressProvider, useProgress } from '../lib/progressContext.jsx';

function Reader() {
  const { progress } = useProgress();
  return <div data-testid="p">{progress.toFixed(2)}</div>;
}

describe('ScrollRig (smoke via Provider)', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  });

  it('starts at 0', () => {
    render(<ProgressProvider><Reader /></ProgressProvider>);
    expect(screen.getByTestId('p').textContent).toBe('0.00');
  });

  it('updates when setProgress called', () => {
    function Writer() {
      const { setProgress } = useProgress();
      return <button onClick={() => setProgress(0.42)}>x</button>;
    }
    render(<ProgressProvider><Reader /><Writer /></ProgressProvider>);
    act(() => screen.getByText('x').click());
    expect(screen.getByTestId('p').textContent).toBe('0.42');
  });
});
