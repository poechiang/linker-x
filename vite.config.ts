import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import electron from 'vite-electron-plugin'
import { customStart, loadViteEnv } from 'vite-electron-plugin/plugin'
import renderer from 'vite-plugin-electron-renderer'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ command }) => {
  const sourcemap = command === 'serve' || !!process.env.VSCODE_DEBUG
  return {
    build: {
      outDir: 'dist-electron/renderer',
    },
    resolve: {
      alias: {
        '~': resolve(__dirname),
        '@': resolve(__dirname, 'src'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@components': resolve(__dirname, 'src/components'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@layout': resolve(__dirname, 'src/layout'),
        '@libs': resolve(__dirname, 'src/libs'),
        '@routers': resolve(__dirname, 'src/routers'),
      },
    },
    plugins: [
      react(),
      svgr({
        // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
        include: ['**/*.svg?react'],
      }),
      electron({
        include: ['electron'],
        transformOptions: {
          sourcemap,
        },
        plugins: [
          ...(process.env.VSCODE_DEBUG
            ? [
                // Will start Electron via VSCode Debug
                customStart(() =>
                  console.log(
                    /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
                  )
                ),
              ]
            : []),
          // Allow use `import.meta.env.VITE_SOME_KEY` in Electron-Main
          loadViteEnv(),
        ],
      }),
      // Use Node.js API in the Renderer-process
      renderer({
        nodeIntegration: false,
      }),
    ],
  }
})
