import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			// Proxy API calls to the Cleopatra backend to bypass CORS
			'/api': {
				target: 'http://127.0.0.1:3000',
				changeOrigin: true,
				secure: false,
			}
		}
	}
});
