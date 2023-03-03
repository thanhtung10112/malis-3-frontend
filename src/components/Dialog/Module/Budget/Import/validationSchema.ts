import * as yup from 'yup'
import _ from 'lodash'

import type { TFunction } from 'next-i18next'

const importFileType = [
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

function getValidationSchema(t: TFunction) {
  const schema = yup.object().shape({
    importFile: yup
      .mixed()
      .test('required_file', t('form.message_validation.import_file_required'), (value) => {
        return !_.isNil(value)
      })
      .test('file_type', t('form.message_validation.import_file_check_type'), async (value) => {
        return importFileType.includes(value?.type || '')
      })
      .test('file_size', t('form.message_validation.import_file_check_size'), (value) => {
        const fileSize = value?.size / 1024 / 1024 || 0
        return fileSize <= 1
      }),
    mode: yup.number().transform((value) => parseInt(value))
  })
  return schema
}

export default getValidationSchema
