import * as esbuild from 'esbuild';
import shell from 'shelljs';

// setup & copy over css & html to public
shell.mkdir('-p', './public');
shell.cp('-fr', './src/static/*.css', './public/');
shell.cp('-fr', './src/static/*.html', './public');

// bundle minilogo.ts, and also copy to public
await esbuild.build({
  "alias": {
    "monaco-editor-wrapper/styles/index": "monaco-editor-wrapper/styles",
  },
  entryPoints: ['./src/static/aom.ts'],
  minify: true,
  sourcemap: true,
  bundle: true,
  outfile: './public/aom.js',
});