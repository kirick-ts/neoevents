/* eslint-disable n/no-unpublished-import */

import {
	expectType,
	expectError,
} from 'tsd';
import {
	NeoEvent,
	NeoEventTarget,
} from '../src/main.js';

const target = new NeoEventTarget();

target.on('foo', (event) => {
	expectType<unknown>(event);
	expectError(event.detail);
});

target.once('foo', (event) => {
	expectType<unknown>(event);
	expectError(event.detail);
});

{
	const event = await target.wait('foo');
	expectType<unknown>(event);
	expectError(event.detail);
}

target.on('foo', (event: NeoEvent<number>) => {
	expectType<NeoEvent<number>>(event);
});

target.once('foo', (event: NeoEvent<number>) => {
	expectType<NeoEvent<number>>(event);
});

target.emit('foo', 123);

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

type TargetEvents = {
	foo: NeoEvent<'foo'>,
	click: MouseEvent,
};
const target_typed = new NeoEventTarget<TargetEvents>();

target_typed.on('foo', (event) => {
	expectType<NeoEvent<'foo'>>(event);
});

target_typed.once('foo', (event) => {
	expectType<NeoEvent<'foo'>>(event);
});

{
	const event = await target_typed.wait('foo');
	expectType<NeoEvent<'foo'>>(event);
}

// detail for event `foo` should be `"foo"`
expectError(
	target_typed.emit('foo', 123),
);
target_typed.emit('foo', 'foo');

// `emit` cannot be used with events that are not subclasses of `NeoEvent`
expectError(
	target_typed.emit('click', 123),
);

expectError(
	target_typed.on('baz', () => {
		// do nothing
	}),
);
target_typed.on(
	// @ts-expect-error - Undeclared event type
	'baz',
	(event) => {
		expectType<unknown>(event);
	},
);

expectError(
	target_typed.once('baz', () => {
		// do nothing
	}),
);
target_typed.once(
	// @ts-expect-error - Undeclared event type
	'baz',
	(event) => {
		expectType<unknown>(event);
	},
);

expectError(
	target_typed.wait('baz'),
);
expectType<unknown>(
	await target_typed.wait(
		// @ts-expect-error - Undeclared event type
		'baz',
	),
);

// baz cannot be emitted
expectError(
	target_typed.emit('baz', 123),
);
