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

type ExtractEvent<
	EL extends Record<string, Event> | undefined,
	T extends string,
	E extends Event | undefined,
> = E extends undefined
	? EL extends undefined
		? unknown
		: T extends keyof EL
			? EL[T]
			: unknown
	: E;

export class NeoEvent<D = unknown> extends Event {
	constructor(
		type: string,
		public detail: D,
	) {
		super(type);
	}
}

export class NeoEventTarget<EL extends Record<string, Event> | undefined = undefined> extends EventTarget {
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
	on<
		T extends string,
		E extends Event | undefined = undefined,
	>(
		type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL,
		listener: (
			event: ExtractEvent<EL, T, E>
		) => void,
	): () => void {
		return this.addListener(
			type,
			listener as (event: unknown) => void,
		);
	}

	/**
	 * Adds an event listener that will be automatically removed once it is called.
	 * @param type - The event type to listen for.
	 * @param listener - The event listener.
	 * @returns A function that removes the event listener when called.
	 */
	once<
		T extends string,
		E extends Event | undefined = undefined,
	>(
		type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL,
		listener: (
			event: E extends undefined
				? EL extends undefined
					? unknown
					: T extends keyof EL
						? EL[T]
						: unknown
				: E
		) => void,
	): () => void {
		return this.addListener(
			type,
			listener as (event: unknown) => void,
			{ once: true },
		);
	}

	/**
	 * Waits for an event like `once` but returns a promise.
	 * @param type - The event type to listen for.
	 * @returns Promise that resolves with the event.
	 */
	wait<
		T extends string,
		E extends Event | undefined = undefined,
	>(
		type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL,
	): Promise<ExtractEvent<EL, T, E>> {
		return new Promise((resolve) => {
			this.once(
				type,
				(event) => {
					resolve(event as ExtractEvent<EL, T, E>);
				},
			);
		});
	}

	/**
	 * Creates an instance of `NeoEvent` and dispatches it.
	 * @param type - The event type to emit.
	 * @param detail - Data to be set as event `detail` property.
	 * @returns `true` if either event's cancelable attribute value is `false` or its preventDefault() method was not invoked, and `false` otherwise.
	 */
	emit<
		T extends string,
		D extends unknown | undefined = undefined,
	>(
		type: EL extends undefined ? T : T extends keyof EL ? T : keyof EL,
		detail?: EL extends undefined
			? D
			: T extends keyof EL
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				? NeoEvent<any> extends EL[T]
					? EL[T] extends NeoEvent<infer E>
						? E
						: never
					: never
				: never,
	): boolean {
		return super.dispatchEvent(
			new NeoEvent(type, detail),
		);
	}

	/**
	 * Destroys an event target, removing all listeners.
	 */
	destroy(): void {
		for (const off of this.listeners) {
			off();
		}

		this.listeners.clear();
	}
}
