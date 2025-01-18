var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/main.ts
var exports_main = {};
__export(exports_main, {
  NeoEventTarget: () => NeoEventTarget,
  NeoEvent: () => NeoEvent
});
module.exports = __toCommonJS(exports_main);

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
