System.config({
  baseUrl: './source/',
  transpiler: 'typescript',
  typescriptOptions: {
    resolveTypings: true,
    emitDecoratorMetadata: true,
    sourceMap: true,
    inlineSourceMap: false
  },
  packages: {
    'pow-core': {
      main: './all.ts',
      defaultExtension: 'ts'
    }
  },
  map: {
    typescript: './node_modules/typescript/lib/typescript.js'
  },
  defaultJSExtensions: true
});
