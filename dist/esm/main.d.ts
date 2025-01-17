export declare class NeoEvent<D = unknown> extends Event {
    detail: D;
    constructor(type: string, detail: D);
}
export declare class NeoEventTarget extends EventTarget {
    private listeners;
    private addListener;
    /**
     * Adds an event listener.
     * @param type - The event type to listen for.
     * @param listener - The event listener.
     * @returns A function that removes the event listener when called.
     */
    on<E extends Event = NeoEvent>(type: string, listener: (event: E) => void): () => void;
    /**
     * Adds an event listener that will be automatically removed once it is called.
     * @param type - The event type to listen for.
     * @param listener - The event listener.
     * @returns A function that removes the event listener when called.
     */
    once<E extends Event = NeoEvent>(type: string, listener: (event: E) => void): () => void;
    /**
     * Waits for an event like `once` but returns a promise.
     * @param type - The event type to listen for.
     * @returns Promise that resolves with the event.
     */
    wait<E extends Event = NeoEvent>(type: string): Promise<E>;
    /**
     * Creates an instance of `NeoEvent` and dispatches it.
     * @param type - The event type to emit.
     * @param detail - Data to be set as event `detail` property.
     */
    emit(type: string, detail?: unknown): void;
    /**
     * Destroys an event target, removing all listeners.
     */
    destroy(): void;
}
