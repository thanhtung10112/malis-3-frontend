import jsCurrency, { Options } from 'currency.js'
import _ from 'lodash'

class AppNumber {
  private static _defaultOptions = {
    separator: ' ',
    decimal: '.',
    symbol: ''
  }

  private static buildOptions(options: Partial<Options>) {
    return {
      ...this._defaultOptions,
      ...options
    }
  }

  static format(value, options = {} as Options) {
    return jsCurrency(value, this.buildOptions(options)).format()
  }

  static convertToInstance(value, options = {} as Options) {
    return jsCurrency(value, options)
  }

  static convertToNumber(value, options = {} as Options) {
    return this.convertToInstance(value, options).value
  }

  static isNumber(value) {
    if (_.size(value) === 0) {
      return false
    }
    const formatValue = _.toNumber(value)
    return !_.isNaN(formatValue) && _.isNumber(formatValue)
  }

  static isNumberFormat(value) {
    const originValue = this.convertToNumber(value)
    return this.isNumber(originValue)
  }

  static isPositiveNumber(value) {
    const formatValue = this.convertToNumber(value)
    return formatValue > -1
  }

  static isNegativeNumber(value) {
    return !this.isPositiveNumber(value)
  }
}

export default AppNumber
