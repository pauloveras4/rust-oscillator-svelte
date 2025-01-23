import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import wasm from '@rollup/plugin-wasm';

export default defineConfig({
	plugins: [sveltekit(), wasm()],
    assetsInclude: ['**/*.wasm'],

});
