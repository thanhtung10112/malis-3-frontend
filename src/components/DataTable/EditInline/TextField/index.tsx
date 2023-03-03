import React from 'react'

import { TextField, StandardTextFieldProps } from '@material-ui/core'

import { GridCellParams, GRID_CELL_EDIT_EXIT } from '@material-ui/data-grid'

import { FormControllerErrorMessage } from '@/components/index'

import clsx from 'clsx'
import * as yup from 'yup'
import _ from 'lodash'

import useStyles from '../styles'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export interface DataTableTextFieldProps extends StandardTextFieldProps {
  params: GridCellParams
  onChangeValue(id: any, value: any, field?: any): void
  rules?: any
}

function DataTableTextField(props: DataTableTextFieldProps) {
  const classes = useStyles()

  const { className, onChangeValue, params, rules, type, ...rest } = props
  const { api, id, field, value, error }: any = params

  const [oldValue, setOldValue] = React.useState('')

  const validationSchema = React.useMemo(() => {
    if (_.isNil(rules)) {
      return yup.object({ name: yup.string().nullable() })
    }
    return yup.object({ name: rules })
  }, [rules])

  const form = useForm({
    defaultValues: {
      name: value
    },
    mode: 'onChange',
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })
  const watchValue = form.watch('name', '')

  const { errors } = form.formState

  React.useEffect(() => {
    setOldValue(value)
  }, [])

  React.useEffect(() => {
    api.setEditCellProps({
      id,
      field,
      props: { value: watchValue, error: Boolean(errors.name) }
    })
  }, [watchValue, errors, api, field, id, error])

  React.useEffect(() => {
    return api.subscribeEvent(GRID_CELL_EDIT_EXIT, () => {
      if (!error && String(oldValue) !== String(watchValue)) {
        onChangeValue(id, watchValue, field)
      }
    })
  }, [api, watchValue, error])

  return (
    <FormControllerErrorMessage open={Boolean(form.errors.name)} title={form.errors.name?.message}>
      <TextField
        {...rest}
        autoFocus
        className={clsx(className, classes.root, form.errors.name && classes.textFieldError)}
        name="name"
        inputRef={form.register}
      />
    </FormControllerErrorMessage>
  )
}

DataTableTextField.defaultProps = {
  type: 'string'
}

export default DataTableTextField
