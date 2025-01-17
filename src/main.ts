/**
 * DOM-like Events
 * node_modules/@types/node/dom-events.d.ts
 */
interface EventListenerOptions {
	/** Not directly used by Node.js. Added for API completeness. Default: `false`. */
	capture?: boolean;
}
interface AddEventListenerOptions extends EventListenerOptions {
	/** When `true`, the listener is automatically removed when it is first invoked. Default: `false`. */
	once?: boolean;
	/** When `true`, serves as a hint that the listener will not call the `Event` object's `preventDefault()` method. Default: false. */
	passive?: boolean;
	/** The listener will be removed when the given AbortSignal object's `abort()` method is called. */
	signal?: AbortSignal;
}
interface EventListener {
	(evt: Event): void;
}

export class NeoEvent<D = unknown> extends Event {
	constructor(
		type: string,
		public detail: D,
	) {
		super(type);
	}
}

export class NeoEventTarget extends EventTarget {
	private listeners = new Set<() => void>();

	private addListener<const E extends Event>(
		type: string,
		listener: (event: E) => void,
		options?: AddEventListenerOptions | boolean,
	): () => void {
		this.addEventListener(
			type,
			listener as EventListener,
			options,
		);

		const off = () => {
			this.removeEventListener(
				type,
				listener as EventListener,
				options,
			);

			this.listeners.delete(off);
		};

		this.listeners.add(off);

		return off;
	}

	/**
	 * Adds an event listener.
	 * @param type - The event type to listen for.
	 * @param listener - The event listener.
	 * @returns A function that removes the event listener when called.
	 */
	on<E extends Event = NeoEvent>(
		type: string,
		listener: (event: E) => void,
	): () => void {
		return this.addListener(
			type,
			listener,
		);
	}

	/**
	 * Adds an event listener that will be automatically removed once it is called.
	 * @param type - The event type to listen for.
	 * @param listener - The event listener.
	 * @returns A function that removes the event listener when called.
	 */
	once<E extends Event = NeoEvent>(
		type: string,
		listener: (event: E) => void,
	): () => void {
		return this.addListener(
			type,
			listener,
			{ once: true },
		);
	}

	/**
	 * Waits for an event like `once` but returns a promise.
	 * @param type - The event type to listen for.
	 * @returns Promise that resolves with the event.
	 */
	wait<E extends Event = NeoEvent>(type: string) {
		return new Promise<E>((resolve) => {
			this.once<E>(
				type,
				(event) => {
					resolve(event);
				},
			);
		});
	}

	/**
	 * Creates an instance of `NeoEvent` and dispatches it.
	 * @param type - The event type to emit.
	 * @param detail - Data to be set as event `detail` property.
	 */
	emit(type: string, detail?: unknown) {
		this.dispatchEvent(
			new NeoEvent(type, detail),
		);
	}

	/**
	 * Destroys an event target, removing all listeners.
	 */
	destroy() {
		for (const off of this.listeners) {
			off();
		}

		this.listeners.clear();
	}
}
