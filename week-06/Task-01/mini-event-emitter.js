class MiniEventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    const listeners = this.events.get(eventName) ?? [];
    listeners.push(listener);
    this.events.set(eventName, listeners);

    return this;
  }

  off(eventName, listener) {
    const listeners = this.events.get(eventName);

    if (!listeners) {
      return this;
    }

    const remaining = listeners.filter(
      (registeredListener) => registeredListener !== listener,
    );

    if (remaining.length === 0) {
      this.events.delete(eventName);
    } else {
      this.events.set(eventName, remaining);
    }

    return this;
  }

  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);

    if (!listeners) {
      return false;
    }

    [...listeners].forEach((listener) => listener(...args));
    return true;
  }

  once(eventName, listener) {
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      listener(...args);
    };

    return this.on(eventName, wrapper);
  }
}

module.exports = MiniEventEmitter;
