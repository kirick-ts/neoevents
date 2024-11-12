# neoevents

Tiny extension of the standard `EventTarget` written in TypeScript.

## Installation

Use package manager of your choice to install `neoevents`.

```bash
bun i neoevents
pnpm i neoevents
npm i neoevents
```

## API

### Class `NeoEventTarget`

Class `NeoEventTarget` extends the standard `EventTarget`. You are still able to use all the standard methods of `EventTarget` like `addEventListener`, `removeEventListener` and `dispatchEvent`.

But `NeoEventTarget` also provides some additional methods.

#### Method `on`

Method `on` acts like `addEventListener`, but it returns a function that removes the event listener.

```typescript
const target = new NeoEventTarget();
const off = target.on('my-event', (event) => {
  console.log('got event:', event);
});

off(); // Removes the event listener
```

#### Method `once`

Method `once` acts like `addEventListener` with `{ once: true }` options. Also, like `on` method, it returns a function that removes the event listener.

```typescript
const target = new NeoEventTarget();
const off = target.once('my-event', (event) => {
  // This listener will be called only once
  console.log('got event:', event);
});

off(); // Removes the event listener
```

#### Method `wait`

Method `wait` returns a promise that resolves when the event is dispatched.

```typescript
const target = new NeoEventTarget();
const event = await target.wait('my-event');
console.log('got event:', event);
```

#### Method `emit`

Method `emit` simplifies event dispatching. Instead of creating an event object and calling `dispatchEvent`...

```typescript
const target = new EventTarget();

target.addEventListener('my-event', (event) => {
  console.log('got event:', event);
  console.log('event detail:', event.detail);
});

const event = ;
target.dispatchEvent(
  new CustomEvent(
    'my-event',
    { detail: 'some data' },
  ),
);
```

...you can just call `emit`:

```typescript
const target = new NeoEventTarget();

target.on<NeoEvent<string>>('my-event', (event) => {
  console.log('got event:', event);
  console.log('event detail:', event.detail);
});

target.emit('my-event', 'some data');
```

By calling `emit` method, an event object of type `NeoEvent` is created.

### Class `NeoEvent`

Class `NeoEvent` extends the standard `Event`. It provides a `detail` property that is initialized with the second argument of the constructor — like standard `CustomEvent` class.

```typescript
const event = new NeoEvent('my-event', 'some data');
console.log(event.detail); // 'some data'
```

To use `NeoEvent` as type, pass the type of the `detail` property as a generic argument:

```typescript
const target = new NeoEventTarget();
target.on<NeoEvent<string>>('my-event', (event) => {
  console.log('got event:', event);
  console.log('event detail:', event.detail); // string type
});
```
