# neoevents

Tiny extension of the standard `EventTarget` written in TypeScript, providing convenient methods for event handling and type safety.

## Installation

Use package manager of your choice to install `neoevents`.

```sh
bun i neoevents
# or
pnpm i neoevents
# or
npm i neoevents
```

## API

### Class `NeoEventTarget`

Class `NeoEventTarget` extends the standard `EventTarget`, so you are still able to use all the standard methods of `EventTarget` like `addEventListener`, `removeEventListener` and `dispatchEvent`. But `NeoEventTarget` also provides some additional methods.

Method `on` works like `addEventListener` but returns a function that removes the event listener when called.

```javascript
const target = new NeoEventTarget();
const off = target.on('test', (event) => {
  console.log(event);
});

off(); // Removes the event listener
```

Method `once` acts like `addEventListener` with `{ once: true }` option. Also, like `on` method, it returns a function that removes the event listener when called.

```javascript
const target = new NeoEventTarget();
const off = target.once('my-event', (event) => {
  // This listener will be called only once
  console.log('got event:', event);
});

off(); // Removes the event listener
```

Method `wait` returns a promise that resolves when the event is dispatched.

```typescript
const target = new NeoEventTarget();
const event = await target.wait('my-event');
console.log('got event:', event);
```

Method `emit` simplifies event dispatching. Instead of creating an event object and calling `dispatchEvent`...

```typescript
target.dispatchEvent(
  new NeoEvent(
    'my-event',
    'some data',
  ),
);
```

...you can just call `emit`:

```typescript
target.emit('my-event', 'some data');
```

### Class `NeoEvent`

Class `NeoEvent` extends the standard `Event`. It provides a `detail` property that is initialized with the second argument of the constructor. After dropping Node 16 support, this class will be replaced with `CustomEvent`.

```typescript
const event = new NeoEvent('my-event', 'some data');
console.log(event.detail); // 'some data'
```

## Using with TypeScript

If you are using TypeScript, you can type event listeners like this (if not typed, `event` will be `unknown`):

```typescript
const target = new NeoEventTarget();

// add type to the event listener
target.on('click', (event: MouseEvent) => {
  console.log(event);
});

// works with `once` as well
target.once('click', (event: MouseEvent) => {
  console.log(event);
});
```

To achieve more type safety, you can limit event types that are allowed on the event target:

```typescript
type EventMap = {
  click: MouseEvent,
  foo: NeoEvent<string>,
};

const target_typed = new NeoEventTarget<EventMap>();

target_typed.on('click', (event) => {
  console.log(event); // event is MouseEvent automatically
});

// error: Argument of type '"foobar"' is not assignable to parameter of type 'keyof EventMap'.
target_typed.on('foobar', (event) => {
  console.log(event); // event is unknown, but who cares?
});
```

Please note that `emit` method dispatches an instance of `NeoEvent`. So, if your event type is not a subclass of `NeoEvent`, you will not be able to use `emit` method:

```typescript
target.emit('click', 123); // error: Argument of type '123' is not assignable to parameter of type 'MouseEvent'.
```

Unlike `emit`, `dispatchEvent` maintains the standard TypeScript typing and accepts any event object that extends `Event`.
