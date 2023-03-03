import { useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import { Grid } from '@material-ui/core'
import { Unless } from 'react-if'
import { FormControllerTextField, DialogMain, SectionTimezone, BtnHelp, FormControllerNumberField } from '@/components'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import _ from 'lodash'

import type { ManufacturerItem, ManufacturerPermissions } from '@/types/Manufacturer'

export type DialogManufacturerProps = {
  open: boolean
  loading: boolean
  detail: ManufacturerItem
  permissions: ManufacturerPermissions
  wikiPage: string
  onClose: () => void
  onSubmit: (id: number, formData: ManufacturerItem) => void
  onGetNextCode: (formData: ManufacturerItem) => void
}

const DialogManufacturer: React.FC<DialogManufacturerProps> = (props) => {
  const { open, loading, detail, permissions, wikiPage, onClose, onSubmit, onGetNextCode } = props
  const { t } = useTranslation('manufacturer')

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      manufacturer_id: yup
        .number()
        .nullable()
        .required(t('form.message_validation.manufacturer_id_required'))
        .min(0, t('form.message_validation.manufacturer_id_range'))
        .max(100000, t('form.message_validation.manufacturer_id_range')),
      name: yup
        .string()
        .required(t('form.message_validation.name_required'))
        .max(50, t('form.message_validation.name_max'))
    })
  }, [t])

  const manufacturerForm = useForm<ManufacturerItem>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  const isCreating = _.isNil(detail?.id)

  useEffect(() => {
    manufacturerForm.reset(detail)
  }, [detail])

  const onSubmitForm = manufacturerForm.handleSubmit((data) => {
    const formData = _.pick(data, ['manufacturer_id', 'name'])
    onSubmit(data.id, formData as any)
  })

  const handleGetNextCode = () => {
    const formData = manufacturerForm.getValues()
    onGetNextCode(formData)
  }

  return (
    <DialogMain
      title={<BtnHelp title={isCreating ? t('form.title.create') : t('form.title.update')} href={wikiPage} />}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      loading={loading}
      open={open}
      onOk={onSubmitForm}
      onClose={onClose}
      okButtonProps={{
        disabled: loading || (!permissions?.edit && !isCreating)
      }}
    >
      <Grid container spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={12}>
          <FormControllerNumberField
            control={manufacturerForm.control}
            name="manufacturer_id"
            required
            label="Manufacturer #"
            thousandSeparator=""
            decimalScale={0}
            fixedDecimalScale={false}
            generateCode
            disabled={!isCreating}
            onGenerateCode={handleGetNextCode}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField control={manufacturerForm.control} name="name" required label="Name" />
        </Grid>
        <Unless condition={isCreating}>
          <SectionTimezone value={detail} />
        </Unless>
      </Grid>
    </DialogMain>
  )
}

export default DialogManufacturer
