import { defineConfig } from 'tsdown';

const entry = ['src/main.ts'];

export default defineConfig([
	// Package build: what `exports` points at.
	{
		name: 'dist',
		entry,
		format: ['esm', 'cjs'],
		dts: true,
		unused: true,
		// publint runs once, after every config of this package has finished,
		// so it sees `dist/main.min.mjs` too.
		publint: true,
	},
	// CDN build: what `unpkg` and `jsdelivr` point at.
	{
		name: 'min',
		entry,
		format: 'esm',
		minify: true,
		// No second .d.mts pass: `dts` would default to true because
		// `exports` declares types.
		dts: false,
		outExtensions: () => {
			return { js: '.min.mjs' };
		},
	},
]);
