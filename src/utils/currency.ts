import jsCurrency from 'currency.js'

const DEFAULT_OPTIONS = {
  separator: ' ',
  decimal: '.',
  symbol: ''
}

const buildOption = (options: jsCurrency.Options) => {
  return {
    ...DEFAULT_OPTIONS,
    ...options
  }
}

export const format = (value, options = {} as jsCurrency.Options) => jsCurrency(value, buildOption(options)).format()

export const convert = (value, options = {} as jsCurrency.Options) => jsCurrency(value, options)
