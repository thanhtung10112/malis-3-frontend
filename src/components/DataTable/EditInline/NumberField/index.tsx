import React from 'react'

import { GridCellParams, GRID_CELL_EDIT_EXIT } from '@material-ui/data-grid'

import { FormControllerErrorMessage, AppNumberField } from '@/components'

import clsx from 'clsx'
import * as yup from 'yup'
import _ from 'lodash'

import useStyles from '../styles'
import { useForm, useController } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import type { AppNumberFieldProps } from '@/components/App/NumberField/type'

export interface DataTableTextFieldProps extends Omit<AppNumberFieldProps, 'onChange'> {
  params: GridCellParams
  onChangeValue(id: any, value: any, field?: any): void
  rules?: any
}

const DataTableTextField: React.FC<DataTableTextFieldProps> = (props) => {
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
  const watchValue = form.watch('name', null)

  const {
    field: { onChange: onChangeControl, value: valueControl },
    meta: { invalid }
  } = useController({
    name: 'name',
    control: form.control
  })

  React.useEffect(() => {
    setOldValue(value)
  }, [])

  React.useEffect(() => {
    api.setEditCellProps({
      id,
      field,
      props: { value: valueControl, error: Boolean(invalid) }
    })
  }, [valueControl, invalid, api, field, id, error])

  React.useEffect(() => {
    return api.subscribeEvent(GRID_CELL_EDIT_EXIT, () => {
      if (!error && String(oldValue) !== String(watchValue)) {
        onChangeValue(id, watchValue, field)
      }
    })
  }, [api, watchValue, error])

  return (
    <FormControllerErrorMessage open={Boolean(invalid)} title={(invalid as any)?.message}>
      <AppNumberField
        {...rest}
        value={valueControl}
        autoFocus
        className={clsx(className, classes.root, invalid && classes.textFieldError)}
        name="name"
        onChange={({ floatValue }) => {
          onChangeControl(floatValue)
        }}
      />
    </FormControllerErrorMessage>
  )
}

DataTableTextField.defaultProps = {
  type: 'text'
}

export default DataTableTextField
