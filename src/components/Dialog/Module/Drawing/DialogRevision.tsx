import { Grid } from '@material-ui/core'
import { DialogMain, FormControllerTextField } from '@/components'

import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { drawingStore } from '@/store/reducers'

import type { RevisionDetail } from '@/types/Drawing'

const DialogRevision: React.FC = () => {
  const { t } = useTranslation('drawing')

  const validationSchema = useMemo(
    () =>
      yup.object({
        new_revision: yup
          .string()
          .required(t('validation_message.new_revision_required'))
          .matches(/^[A-Z0-9]{1,8}$/, t('validation_message.new_revision_matches')),
        description: yup.string().required(t('validation_message.description_required'))
      }),
    []
  )

  const revisionForm = useForm<RevisionDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()
  const { open, loading, detail: revisionDetail } = useSelector(drawingStore.selectRevisionDialog)
  const drawingDetail = useSelector(drawingStore.selectDetail)

  useEffect(() => {
    if (!open) {
      dispatch(drawingStore.actions.resetRevisionDialogDetail())
    }
  }, [open])

  useEffect(() => {
    revisionForm.reset(revisionDetail)
  }, [revisionDetail])

  const handleSaveRevision = revisionForm.handleSubmit((formData) => {
    dispatch(
      drawingStore.sagaSaveNewRev({
        revision: formData,
        drawingId: drawingDetail.id
      })
    )
  })

  const handleClose = () => {
    dispatch(drawingStore.actions.setRevisionDialogOpen(false))
  }

  return (
    <DialogMain
      open={open}
      loading={loading}
      fullWidth
      title={t('form.title.save_as_revision')}
      maxWidth="sm"
      okText={t('common:button.save')}
      onOk={handleSaveRevision}
      onClose={handleClose}
    >
      <Grid container spacing={2} style={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <FormControllerTextField name="new_revision" label="New revision" required control={revisionForm.control} />
        </Grid>
        <Grid item xs={12}>
          <FormControllerTextField
            name="reason"
            label="Reason of Change(internal)"
            control={revisionForm.control}
            multiline
            rows={10}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            name="description"
            label="Description(external)"
            required
            control={revisionForm.control}
          />
        </Grid>
      </Grid>
    </DialogMain>
  )
}

export default DialogRevision
