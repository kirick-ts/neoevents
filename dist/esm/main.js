// src/main.ts
class NeoEvent extends Event {
  detail;
  constructor(type, detail) {
    super(type);
    this.detail = detail;
  }
}

class NeoEventTarget extends EventTarget {
  listeners = new Set;
  addListener(type, listener, options) {
    this.addEventListener(type, listener, options);
    const off = () => {
      this.removeEventListener(type, listener, options);
      this.listeners.delete(off);
    };
    this.listeners.add(off);
    return off;
  }
  on(type, listener) {
    return this.addListener(type, listener);
  }
  once(type, listener) {
    return this.addListener(type, listener, { once: true });
  }
  wait(type) {
    return new Promise((resolve) => {
      this.once(type, (event) => {
        resolve(event);
      });
    });
  }
  emit(type, detail) {
    return super.dispatchEvent(new NeoEvent(type, detail));
  }
  destroy() {
    for (const off of this.listeners) {
      off();
    }
    this.listeners.clear();
  }
}
export {
  NeoEventTarget,
  NeoEvent
};
