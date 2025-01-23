import adapter from '@sveltejs/adapter-vercel';
import { defineConfig } from 'vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const wasmMimeTypePlugin = {
    name: 'wasm-mime-type',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url.endsWith('.wasm')) {
                res.setHeader('Content-Type', 'application/wasm');
            }
            next();
        });
    },
};

export default defineConfig({
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
	},

    plugins: [wasmMimeTypePlugin],
    assetsInclude: ['**/*.wasm'],

    preprocess: [vitePreprocess()],
    build: {
        sourcemap: true,
    },
});

