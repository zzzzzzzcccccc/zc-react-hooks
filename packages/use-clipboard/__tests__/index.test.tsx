import React from 'react';
import { cleanup, render, screen, fireEvent, act } from '@testing-library/react';
import useClipboard from '../index';

function Template({ interval, text }: { interval: number; text: string }) {
  const [run, state] = useClipboard(interval);

  return (
    <>
      <button onClick={() => run(text)} data-testid="btn-run">
        run
      </button>
      <div data-testid="text-copied">{state.isCopied ? 'Yes' : 'No'}</div>
      <div data-testid="text-success">{state.success ? 'Yes' : 'No'}</div>
    </>
  );
}

describe('test useClipboard', () => {
  afterEach(cleanup);

  it('when interval <= 0', () => {
    render(<Template interval={0} text="copy" />);

    expect(screen.getByTestId('text-copied').textContent).toEqual('No');

    fireEvent.click(screen.getByTestId('btn-run'));

    expect(screen.getByTestId('text-copied').textContent).toEqual('Yes');
  });

  it('when interval > 0', () => {
    jest.useFakeTimers();
    const interval = 1000;
    render(<Template interval={interval} text="copy" />);

    expect(screen.getByTestId('text-copied').textContent).toEqual('No');

    fireEvent.click(screen.getByTestId('btn-run'));

    expect(screen.getByTestId('text-copied').textContent).toEqual('Yes');
    jest.advanceTimersByTime(interval / 2);
    expect(screen.getByTestId('text-copied').textContent).toEqual('Yes');

    act(() => {
      jest.advanceTimersByTime(interval / 2);
    });

    expect(screen.getByTestId('text-copied').textContent).toEqual('No');
  });
});
