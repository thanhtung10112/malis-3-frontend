import type { TFunction } from 'next-i18next'

const getMessageConfirm = (t: TFunction, entity: string, items: number[], operation) => {
  const translateKey = 'confirmation'
  if (items.length > 1) {
    return t(`${entity}:${translateKey}.${operation}_many`, {
      length: items.length
    })
  }
  return t(`${entity}:${translateKey}.${operation}`, { length: items.length })
}

export default getMessageConfirm
