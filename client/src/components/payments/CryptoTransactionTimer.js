// src/components/CryptoTransactionTimer.js

import EventEmitter from 'events';

export class CryptoTransactionTimer extends EventEmitter {
  constructor({ duration, warningThreshold, tickInterval }) {
    super();
    this.duration = duration;
    this.warningThreshold = warningThreshold;
    this.tickInterval = tickInterval;
    this.remaining = duration;
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.remaining -= this.tickInterval;
      this.emit('tick', this.remaining);

      if (this.remaining <= this.duration * (this.warningThreshold / 100)) {
        this.emit('warning');
      }

      if (this.remaining <= 0) {
        this.emit('timeout');
        this.stop();
      }
    }, this.tickInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
