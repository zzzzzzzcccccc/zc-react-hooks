export enum TimerType {
  interval = 'interval',
  timeout = 'timeout',
}

export type CallBack = () => void;

export interface Queue {
  timerType: TimerType;
  interval: number;
  rafId: number;
}

class RafTimer {
  private _queue: Map<Symbol, Queue> = new Map();

  private static getCurrentTime() {
    return Date.now();
  }

  private run(timerType: TimerType, cb: CallBack, interval: number) {
    if (interval <= 0) {
      throw new Error('RafTimer interval < 0');
    }
    let st = RafTimer.getCurrentTime(),
      et = st;
    const symbolId = Symbol(timerType);
    const loop = () => {
      this.setQueue(symbolId, timerType, loop, interval);

      et = RafTimer.getCurrentTime();

      if (et - st >= interval) {
        if (timerType === TimerType.interval) {
          st = RafTimer.getCurrentTime();
          et = st;
        }

        cb();

        if (timerType === TimerType.timeout) {
          this.clearRun(symbolId);
        }
      }
    };
    this.setQueue(symbolId, timerType, loop, interval);
    return symbolId;
  }

  private setQueue(timerSymbol: Symbol, timerType: TimerType, loop: CallBack, interval: number) {
    const rafId = requestAnimationFrame(loop);
    this._queue.set(timerSymbol, {
      timerType,
      interval,
      rafId,
    });
  }

  private clearRun(timerSymbol: Symbol) {
    const queueRecord = this._queue.get(timerSymbol);
    if (queueRecord) {
      cancelAnimationFrame(queueRecord.rafId);
      this._queue.delete(timerSymbol);
    }
  }

  setTimeout(cb: CallBack, delay: number) {
    return this.run(TimerType.timeout, cb, delay);
  }

  setInterval(cb: CallBack, interval: number) {
    return this.run(TimerType.interval, cb, interval);
  }

  clearTimeout(timerSymbol: Symbol) {
    this.clearRun(timerSymbol);
  }

  clearInterval(timerSymbol: Symbol) {
    this.clearRun(timerSymbol);
  }
}

const rafTimer = new RafTimer();

export default rafTimer;
