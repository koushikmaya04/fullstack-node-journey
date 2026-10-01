export type EventMap = Record<string, unknown[]>;
export type EventListener<Args extends unknown[]> = (...args: Args) => void;

export class MiniEventEmitter<Events extends EventMap> {
  private readonly events = new Map<keyof Events, Set<EventListener<never>>>();

  on<K extends keyof Events>(eventName: K, listener: EventListener<Events[K]>): this {
    if (typeof listener !== "function") {
      throw new TypeError("listener must be a function");
    }

    const listeners = this.events.get(eventName) ?? new Set<EventListener<never>>();
    listeners.add(listener as EventListener<never>);
    this.events.set(eventName, listeners);
    return this;
  }

  off<K extends keyof Events>(eventName: K, listener: EventListener<Events[K]>): this {
    const listeners = this.events.get(eventName);
    if (!listeners) return this;

    listeners.delete(listener as EventListener<never>);
    if (listeners.size === 0) this.events.delete(eventName);
    return this;
  }

  emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean {
    const listeners = this.events.get(eventName);
    if (!listeners) return false;

    [...listeners].forEach((listener) => listener(...(args as never)));
    return true;
  }

  once<K extends keyof Events>(eventName: K, listener: EventListener<Events[K]>): this {
    const wrapper: EventListener<Events[K]> = (...args) => {
      this.off(eventName, wrapper);
      listener(...args);
    };

    return this.on(eventName, wrapper);
  }
}
