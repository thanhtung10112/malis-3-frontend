import React from 'react'

import { Paper, Checkbox, Tooltip } from '@material-ui/core'

import { DataTable, DataTableTextField, DataTableAutocomplete } from '@/components'

import { Switch, Case, If, Then, Else } from 'react-if'

import { useController } from 'react-hook-form'
import useStyles from './styles'

import _ from 'lodash'
import immer from 'immer'
import * as yup from 'yup'
import clsx from 'clsx'

import * as columnProperties from '@/utils/columnProperties'

import type { TableExtendedPropertiesProps } from './type'

const TableExtendedProperties: React.FC<TableExtendedPropertiesProps> = (props) => {
  const classes = useStyles()
  const { propertiesList, name, control, tableHeight, editMode, parameterName } = props

  const {
    field: { value: propertiesValue, onChange }
  } = useController({
    name,
    control
  })

  const getStylesRowDisabled = (params) => {
    const language = _.find(propertiesList, { id: params.id })
    return clsx({
      [classes.disable]: language?.status === false
    })
  }

  const onChangeValue = (id, value: string | boolean) => {
    const newPropertiesValue = immer(propertiesValue, (draft) => {
      const { parameter_id } = _.find(propertiesList, { id })
      if (value === '' || value === false) {
        delete draft[parameter_id]
      } else {
        draft[parameter_id] = value
      }
    })
    onChange(newPropertiesValue)
  }

  const handleChangeValueDropdown = (id) => (event, optionValue, reason) => {
    const newPropertiesValue = immer(propertiesValue, (draft) => {
      const { parameter_id } = _.find(propertiesList, { id })
      if (reason === 'clear') {
        delete draft[parameter_id]
      } else {
        draft[parameter_id] = optionValue.properties.value
      }
    })
    onChange(newPropertiesValue)
  }

  const filteredProperties = React.useMemo(() => {
    const types = ['boolean', 'string', 'dropdown']
    const propertiesWithTypes = propertiesList.filter((property) => types.includes(property.properties.type))
    if (editMode) {
      const filterList = propertiesWithTypes.filter((property) => {
        return property.status === true || _.has(propertiesValue, property.parameter_id)
      })
      return filterList
    } else {
      return propertiesWithTypes.filter((property) => property.status === true)
    }
  }, [propertiesList, propertiesValue])

  const getValueDropdown = (value, list) => {
    if (list.length === 0) {
      return value
    }
    const optionValue = _.find(list, (item) => item.properties?.value === value)
    return optionValue?.description || value
  }

  const renderDropdownField = (params) => {
    const { properties } = params.row
    let value: any = ''
    if (params.value) {
      value = _.find(properties.valid_value_list, (option) => option.properties?.value === params.value)
    }
    return (
      <DataTableAutocomplete
        value={value}
        params={params}
        options={properties?.valid_value_list || []}
        onChange={handleChangeValueDropdown(params.id)}
      />
    )
  }

  return (
    <Paper elevation={1}>
      <DataTable
        tableHeight={tableHeight}
        disableColumnMenu
        disableSelectionOnClick
        rows={filteredProperties}
        hideFooter
        getRowClassName={getStylesRowDisabled}
        onCellDoubleClick={(params, event) => {
          const { properties, status } = params.row
          if (properties.type === 'boolean' || !status) {
            event.stopPropagation()
          }
        }}
        columns={[
          {
            ...columnProperties.defaultProperties,
            field: 'description',
            headerName: 'Properties',
            width: 180
          },
          {
            ...columnProperties.defaultProperties,
            ...columnProperties.editCell('Value'),
            field: 'value',
            flex: 0.6,
            valueGetter(params) {
              const { parameter_id } = params.row
              return propertiesValue[parameter_id] || ''
            },
            renderEditCell(params) {
              const { properties } = params.row
              return (
                <Switch>
                  <Case condition={properties.type === 'string'}>
                    <DataTableTextField
                      rules={yup.string().matches(properties.regex, {
                        message: `Key's value is invalid! please refer to the "code of ${parameterName} parameter" regex.`,
                        excludeEmptyString: true
                      })}
                      params={params}
                      onChangeValue={onChangeValue}
                      placeholder={properties.placeholder}
                    />
                  </Case>
                  <Case condition={properties.type === 'dropdown'}>{renderDropdownField(params)}</Case>
                </Switch>
              )
            },
            renderCell(params) {
              const { properties, parameter_id, status, id } = params.row
              const value = propertiesValue[parameter_id]
              return (
                <Switch>
                  <Case condition={properties.type === 'boolean'}>
                    <Tooltip title={properties.placeholder}>
                      <Checkbox
                        color="primary"
                        className={classes.checkbox}
                        disabled={!status}
                        checked={Boolean(value)}
                        onChange={(event, checked) => onChangeValue(id, checked)}
                      />
                    </Tooltip>
                  </Case>
                  <Case condition={properties.type === 'string'}>
                    <If condition={Boolean(value)}>
                      <Then>
                        <div className={classes.textValue}>{value}</div>
                      </Then>
                      <Else>
                        <div className={classes.placeholder}>{properties.placeholder}</div>
                      </Else>
                    </If>
                  </Case>
                  <Case condition={properties.type === 'dropdown'}>
                    <If condition={Boolean(value)}>
                      <Then>
                        <div className={classes.textValue}>
                          {getValueDropdown(value, properties.valid_value_list || [])}
                        </div>
                      </Then>
                      <Else>
                        <div className={classes.placeholder}>{properties.placeholder}</div>
                      </Else>
                    </If>
                  </Case>
                </Switch>
              )
            }
          }
        ]}
      />
    </Paper>
  )
}

TableExtendedProperties.defaultProps = {
  tableHeight: 360,
  editMode: false
}

export default TableExtendedProperties
