import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginBundleObfuscator({
      autoExcludeNodeModules: true, // Keeps third-party libraries like React fast and intact
      options: {
        compact: true,
        identifierNamesGenerator: 'hexadecimal', // Renames variables to _0x1a2b
        stringArray: true,
        stringArrayEncoding: ['base64'], // Lightly encodes strings
        stringArrayThreshold: 0.5, // Only encodes 50% of strings to keep bundle small
        controlFlowFlattening: false, // Keep false for light obfuscation
        deadCodeInjection: false, // Keep false to prevent bloat
        selfDefending: false,
      },
    }),
  ],
  base: "/deploy-test",
  build: {
    sourcemap: false,
  },
})
