import { defineConfig } from 'vitest/config';

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
	test: {
		include: [
			'**/*.{test,spec}.?(c|m)[jt]s?(x)',
			'**/*.test-d.ts',
		],
	},
});
