import { MiniEventEmitter } from "./mini-event-emitter";

type AppEvents = {
  message: [string];
  login: [string, number];
};

describe("MiniEventEmitter", () => {
  it("registers and emits typed events", () => {
    const emitter = new MiniEventEmitter<AppEvents>();
    const received: string[] = [];
    emitter.on("message", (message) => received.push(message));

    expect(emitter.emit("message", "hello")).toBe(true);
    expect(received).toEqual(["hello"]);
  });

  it("removes listeners with off", () => {
    const emitter = new MiniEventEmitter<AppEvents>();
    const listener = jest.fn();
    emitter.on("message", listener);
    emitter.off("message", listener);

    expect(emitter.emit("message", "ignored")).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  it("runs once listeners only once", () => {
    const emitter = new MiniEventEmitter<AppEvents>();
    const listener = jest.fn();
    emitter.once("login", listener);

    emitter.emit("login", "Koushik", 20);
    emitter.emit("login", "Koushik", 21);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith("Koushik", 20);
  });

  it("returns false for an event without listeners", () => {
    const emitter = new MiniEventEmitter<AppEvents>();
    expect(emitter.emit("message", "nothing")).toBe(false);
  });
});
