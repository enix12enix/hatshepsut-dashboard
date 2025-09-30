import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	
	vitePlugin: {
		inspector: true
	},
	
	// Add server configuration with proxy to bypass CORS
	compilerOptions: {
		// No specific compiler options needed for proxy
	},
	
	// Vite configuration
	viteNode: {
		// For Svelte 5 compatibility if needed
	},
	
	// Add the proxy configuration within the vite configuration
	// This will be merged with the default Vite configuration
	// The proxy configuration needs to be added in the vite.config.ts file, not in svelte.config.js
	// So we'll need a separate vite.config.ts file for the proxy
};

export default config;
