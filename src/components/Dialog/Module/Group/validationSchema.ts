import * as yup from 'yup'
import * as constants from '@/utils/constant'

import { TFunction } from 'next-i18next'

function getValidationSchema(t: TFunction, isCreating: boolean) {
  const schema = yup.object({
    group_id: yup.lazy(() => {
      if (isCreating) {
        return yup
          .string()
          .required(t('validation_message.group_id_required'))
          .matches(constants.REGEX_GROUP_ID, t('validation_message.group_id_regex'))
          .max(4, t('validation_message.group_id_max'))
      }
      return yup.string()
    }),
    name: yup.string().trim().required(t('validation_message.name_required')).max(80, t('validation_message.name_max')),
    description: yup.string().max(60, t('validation_message.description_max'))
  })
  return schema
}

export default getValidationSchema
