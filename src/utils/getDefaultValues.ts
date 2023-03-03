import _ from 'lodash'

export const getDefaultValue = (items, isGetFirstItem) => {
  const findObj = _.find(items, { is_default: true, status: true })
  if (items.length === 0) {
    return null
  }
  if (_.isNil(findObj) && isGetFirstItem) {
    return items[0]
  }
  return findObj || null
}

export function getDefaultValues(params, obj, defaultValue = {} as any, isGetFirstItem = false, pKey = 'id') {
  const mapValue = {}
  _.forIn(obj, (value, key) => {
    const getValuesByPath = _.get(params, value)
    const defaultValue = getDefaultValue(getValuesByPath, isGetFirstItem)
    mapValue[key] = _.isNil(defaultValue) ? null : defaultValue[pKey]
  })
  return { ...defaultValue, ...mapValue }
}
