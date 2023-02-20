import {resolve} from 'path'
import dts from 'vite-plugin-dts';

export default {
  server: {
    port: 3000
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'xpell-core',
      // the proper extensions will be added
      fileName: format => `xpell-core.${format}.js`
    },
    target: "modules",
    minify: true,
    // outDir:"dist",
    // root: "",
    // base:"",
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["public/"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
        }
      }
    }
  },
  plugins: [dts({
    outputDir: ['dist'],
    // include: ['src/index.ts'],
    exclude: ['src/ignore'],
    // aliasesExclude: [/^@components/],
    staticImport: true,
    skipDiagnostics: false,
    logDiagnostics: true,
    rollupTypes: true,
    insertTypesEntry: true
  })],
};


