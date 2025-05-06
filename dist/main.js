//#region src/main.ts
var NeoEvent = class extends Event {
	constructor(type, detail) {
		super(type);
		this.detail = detail;
	}
};
var NeoEventTarget = class extends EventTarget {
	listeners = new Set();
	addListener(type, listener, options) {
		this.addEventListener(type, listener, options);
		const off = () => {
			this.removeEventListener(type, listener, options);
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
	on(type, listener) {
		return this.addListener(type, listener);
	}
	/**
	* Adds an event listener that will be automatically removed once it is called.
	* @param type - The event type to listen for.
	* @param listener - The event listener.
	* @returns A function that removes the event listener when called.
	*/
	once(type, listener) {
		return this.addListener(type, listener, { once: true });
	}
	/**
	* Waits for an event like `once` but returns a promise.
	* @param type - The event type to listen for.
	* @returns Promise that resolves with the event.
	*/
	wait(type) {
		return new Promise((resolve) => {
			this.once(type, (event) => {
				resolve(event);
			});
		});
	}
	/**
	* Creates an instance of `NeoEvent` and dispatches it.
	* @param type - The event type to emit.
	* @param detail - Data to be set as event `detail` property.
	* @returns `true` if either event's cancelable attribute value is `false` or its preventDefault() method was not invoked, and `false` otherwise.
	*/
	emit(type, detail) {
		return super.dispatchEvent(new NeoEvent(type, detail));
	}
	/**
	* Destroys an event target, removing all listeners.
	*/
	destroy() {
		for (const off of this.listeners) off();
		this.listeners.clear();
	}
};

//#endregion
export { NeoEvent, NeoEventTarget };