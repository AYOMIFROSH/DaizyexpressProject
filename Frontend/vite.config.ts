import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Ensure this is '/' for root deployment. Change if deploying to a subpath.
  plugins: [react()],
})
