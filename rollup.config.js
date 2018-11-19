import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
const pkg = require('./package.json')

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, name: pkg.name, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  external: ['fs', ...pkg.dependencies || []],
  watch: { include: 'src/**' },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
  ],
}