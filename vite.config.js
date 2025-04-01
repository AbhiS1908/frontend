import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Use polling to fix file watcher issues
      interval: 300, // Adjust polling interval (default: 100ms)
    },
    fs: {
      strict: false, // Allow watching files in long paths
    },
  },
});
