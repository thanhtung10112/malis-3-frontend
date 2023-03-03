import { DialogMain, FormControllerTextField } from '@/components/index'

import { useTranslation } from 'next-i18next'

import type { DialogSaveAsPresetProps } from './type'

function DialogSaveAsPreset(props: DialogSaveAsPresetProps) {
  const { t } = useTranslation()
  const { onSubmit, name, control, defaultValue, rules, ...dialogProps } = props
  return (
    <DialogMain
      {...dialogProps}
      title="Save this preset"
      maxWidth="sm"
      onOk={onSubmit}
      onClose={dialogProps.onClose}
      okText={t('common:button.save')}
      closeText={t('common:button.cancel')}
    >
      <FormControllerTextField
        style={{ marginTop: 8 }}
        name={name}
        label="Name"
        autoFocus
        required
        control={control}
        defaultValue={defaultValue}
        rules={rules}
      />
    </DialogMain>
  )
}

DialogSaveAsPreset.defaultProps = {
  name: 'save_as_name',
  defaultValue: {},
  rules: {}
}

export default DialogSaveAsPreset
