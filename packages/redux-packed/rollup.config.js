import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'

let config = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourceMap: true,
  },
  plugins: [
    typescript({
      include: './**/*.ts(|x)',
    }),
    commonjs({
      include: './**/*',
      extensions: ['.js', '.ts', '.tsx'],
    }),
  ],
}

export default config
