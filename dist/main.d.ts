//#region src/main.d.ts
type ExtractEvent<EL extends Record<string, Event> | undefined, T extends string, E extends Event | undefined> = E extends undefined ? EL extends undefined ? unknown : T extends keyof EL ? EL[T] : unknown : E;
declare class NeoEvent<D = unknown> extends Event {
  detail: D;
  constructor(type: string, detail: D);
}
declare class NeoEventTarget<EL extends Record<string, Event> | undefined = undefined> extends EventTarget {
  private listeners;
  private addListener;
  /**
  * Adds an event listener.
  * @param type - The event type to listen for.
  * @param listener - The event listener.
  * @returns A function that removes the event listener when called.
  */
  on<T extends string, E extends Event | undefined = undefined>(type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL, listener: (event: ExtractEvent<EL, T, E>) => void): () => void;
  /**
  * Adds an event listener that will be automatically removed once it is called.
  * @param type - The event type to listen for.
  * @param listener - The event listener.
  * @returns A function that removes the event listener when called.
  */
  once<T extends string, E extends Event | undefined = undefined>(type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL, listener: (event: E extends undefined ? EL extends undefined ? unknown : T extends keyof EL ? EL[T] : unknown : E) => void): () => void;
  /**
  * Waits for an event like `once` but returns a promise.
  * @param type - The event type to listen for.
  * @returns Promise that resolves with the event.
  */
  wait<T extends string, E extends Event | undefined = undefined>(type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL): Promise<ExtractEvent<EL, T, E>>;
  /**
  * Creates an instance of `NeoEvent` and dispatches it.
  * @param type - The event type to emit.
  * @param detail - Data to be set as event `detail` property.
  * @returns `true` if either event's cancelable attribute value is `false` or its preventDefault() method was not invoked, and `false` otherwise.
  */
  emit<T extends string, D extends unknown | undefined = undefined>(type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL, detail?: EL extends undefined ? D : T extends keyof EL ? NeoEvent<any> extends EL[T] ? EL[T] extends NeoEvent<infer E> ? E : never : never : never): boolean;
  /**
  * Destroys an event target, removing all listeners.
  */
  destroy(): void;
}

//#endregion
export { NeoEvent, NeoEventTarget };