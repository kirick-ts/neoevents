import {
	describe,
	expect,
	expectTypeOf,
	test,
} from 'vitest';
import {
	NeoEvent,
	NeoEventTarget,
} from '../src/main.js';

test('untyped target', async () => {
	const target = new NeoEventTarget();

	setTimeout(() => target.emit('foo', 123));

	target.on('foo', (event) => {
		expectTypeOf(event).toEqualTypeOf<Event>();
	});

	target.once('foo', (event) => {
		expectTypeOf(event).toEqualTypeOf<Event>();
	});

	const promise = target.wait('foo');
	expectTypeOf(promise).toEqualTypeOf<Promise<Event>>();

	{
		const event = await target.wait('foo');
		expectTypeOf(event).toEqualTypeOf<Event>();
		// @ts-expect-error We sent a NeoEvent with detail '123'
		expect(event.detail).toBe(123);
	}

	target.on('foo', (event: NeoEvent<number>) => {
		expectTypeOf(event).toEqualTypeOf<NeoEvent<number>>();
	});

	target.once('foo', (event: NeoEvent<number>) => {
		expectTypeOf(event).toEqualTypeOf<NeoEvent<number>>();
	});
});

class TestEvent extends Event {
	altKey = 100;

	constructor(type: string, public detail: number) {
		super(type);
	}
}

describe('typed target', () => {
	type TargetEvents = {
		foo: NeoEvent<'value'>,
		bar: NeoEvent<number>,
		undefined: NeoEvent<undefined>,
		void: NeoEvent<void>,
		click: TestEvent,
	};

	const target = new NeoEventTarget<TargetEvents>();

	test('emit', () => {
		// Can omit data if NeoEvent is with undefined data type
		target.emit('void');

		// Can not omit data if NeoEvent is with defined data type
		// @ts-expect-error - Argument of type '"foo"' is not assignable to parameter of type 'FilterNeoEventWithVoid<TargetEvents>'.
		target.emit('foo');

		// @ts-expect-error - Type 'number' is not assignable to type '"foo"'.
		target.emit('foo', 123);

		target.emit('foo', 'value');

		// `emit` cannot be used with events that are not subclasses of `NeoEvent`
		// @ts-expect-error - Argument of type '123' is not assignable to parameter of type 'undefined'.
		target.emit('click', 123);

		// @ts-expect-error - Argument of type 'undefined' is not assignable to parameter of type 'never'.
		target.emit('click', undefined);

		// @ts-expect-error - Argument of type '"baz"' is not assignable to parameter of type 'keyof TargetEvents'.
		target.emit('baz', 123);
	});

	test('existing neo event', async () => {
		setTimeout(() => target.emit('foo', 'value'));

		target.on('foo', (event) => {
			expectTypeOf(event).toEqualTypeOf<NeoEvent<'value'>>();
			expectTypeOf(event.detail).toEqualTypeOf<'value'>();
			expect(event.detail).toBe('value');
		});

		target.once('foo', (event) => {
			expectTypeOf(event).toEqualTypeOf<NeoEvent<'value'>>();
			expectTypeOf(event.detail).toEqualTypeOf<'value'>();
			expect(event.detail).toBe('value');
		});

		{
			const event = await target.wait('foo');
			expectTypeOf(event).toEqualTypeOf<NeoEvent<'value'>>();
			expectTypeOf(event.detail).toEqualTypeOf<'value'>();
			expect(event.detail).toBe('value');
		}

		// Can NOT redeclare type of listener if type map provided on NeoEventTarget
		// @ts-expect-error - Argument of type '(_event: NeoEvent<boolean>) => void' is not assignable to parameter of type '(event: NeoEvent<"value">) => void
		// eslint-disable-next-line no-empty-function
		target.on('foo', (_event: NeoEvent<boolean>) => {});
	});

	test('existing not-neo event', async () => {
		setTimeout(() => target.dispatchEvent(new TestEvent('click', 0)));

		target.on('click', (event) => {
			expectTypeOf(event).toEqualTypeOf<TestEvent>();
			// expectTypeOf(event.detail).toEqualTypeOf<number>();
			// expect(event.detail).toBe(0);
		});

		target.once('click', (event) => {
			expectTypeOf(event).toEqualTypeOf<TestEvent>();
			// expectTypeOf(event.detail).toEqualTypeOf<number>();
			// expect(event.detail).toBe(0);
		});

		{
			const event = await target.wait('click');
			expectTypeOf(event).toEqualTypeOf<TestEvent>();
			// expectTypeOf(event.detail).toEqualTypeOf<number>();
			// expect(event.detail).toBe(0);
		}
	});

	test('not existing event', async () => {
		// @ts-expect-error - Argument of type '"baz"' is not assignable to parameter of type 'keyof TargetEvents'.
		setTimeout(() => target.emit('baz'));

		// @ts-expect-error - Argument of type '"baz"' is not assignable to parameter of type 'keyof TargetEvents'.
		target.on('baz', (event) => {
			expectTypeOf(event).toEqualTypeOf<never>();
		});

		// @ts-expect-error - Argument of type '"baz"' is not assignable to parameter of type 'keyof TargetEvents'.
		target.once('baz', (event) => {
			expectTypeOf(event).toEqualTypeOf<never>();
		});

		{
			// @ts-expect-error - Argument of type '"baz"' is not assignable to parameter of type 'keyof TargetEvents'.
			const event = await target.wait('baz');
			expectTypeOf(event).toEqualTypeOf<never>();
		}
	});
});
