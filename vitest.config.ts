import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// `*.test-d.ts` is handled by `typecheck.include`, not here:
		// listing it in both runs the file twice, once per pool.
		include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		typecheck: {
			enabled: true,
		},
		fileParallelism: false,
	},
});
