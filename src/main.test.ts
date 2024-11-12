import {
	test,
	expect,
	mock,
} from 'bun:test';
import {
	NeoEventTarget,
} from './main.js';

test('on', () => {
	const target = new NeoEventTarget();

	const listener = mock();
	target.on('test', listener);

	target.dispatchEvent(
		new Event('test'),
	);

	expect(listener).toHaveBeenCalled();
	expect(listener).toHaveBeenCalledTimes(1);

	target.dispatchEvent(
		new Event('test'),
	);

	expect(listener).toHaveBeenCalledTimes(2);
});

test('off', () => {
	const target = new NeoEventTarget();

	const listener = mock();
	const off = target.on('test', listener);

	target.dispatchEvent(
		new Event('test'),
	);

	expect(listener).toHaveBeenCalled();
	expect(listener).toHaveBeenCalledTimes(1);

	off();

	target.dispatchEvent(
		new Event('test'),
	);

	expect(listener).toHaveBeenCalledTimes(1);
});

test('once', () => {
	const target = new NeoEventTarget();

	const listener = mock();
	target.once('test', listener);

	target.dispatchEvent(
		new Event('test'),
	);

	expect(listener).toHaveBeenCalled();
	expect(listener).toHaveBeenCalledTimes(1);

	target.dispatchEvent(
		new Event('test'),
	);

	expect(listener).toHaveBeenCalledTimes(1);
});

test('wait', async () => {
	const target = new NeoEventTarget();

	const promise = target.wait('test');

	target.dispatchEvent(
		new Event('test'),
	);

	const event = await promise;

	expect(event).toBeInstanceOf(Event);
}, 10);

test('emit', () => {
	const target = new NeoEventTarget();

	const listener = mock();
	target.on('test', listener);

	target.emit('test');

	expect(listener).toHaveBeenCalled();
	expect(listener).toHaveBeenCalledTimes(1);
});

test('destroy', () => {
	const target = new NeoEventTarget();

	const listener = mock();
	target.on('test', listener);

	target.destroy();

	target.dispatchEvent(
		new Event('test'),
	);

	expect(listener).not.toHaveBeenCalled();
});
