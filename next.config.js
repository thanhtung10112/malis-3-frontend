/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./next-i18next.config')
const withImages = require('next-images')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([
  withImages(),
  {
    i18n
  }
])
