import { useState, useMemo } from 'react'

import { TextField, makeStyles, Checkbox } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { FormControllerErrorMessage } from '@/components/index'

import _ from 'lodash'

import type { AppAutocompleteProps } from './type'

const useStyles = makeStyles({
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 !important'
  },
  chipRoot: {
    height: 18,
    fontSize: 13
  },
  chipIcon: {
    width: 14,
    heigt: 14
  }
})

const AppAutocomplete: React.FC<AppAutocompleteProps<any>> = (props) => {
  const {
    error,
    helperText,
    label,
    required,
    textFieldProps,
    primaryKeyOption,
    options,
    value,
    getOptionSelected,
    renderOption,
    multiple,
    ...autocompleteProps
  } = props

  const classes = useStyles()

  const [isFocusing, setIsFocusing] = useState(false)

  const openTooltip = useMemo(() => isFocusing && error, [error, isFocusing])

  const formatValue = useMemo(() => {
    try {
      if (_.isInteger(value) || _.isString(value)) {
        return _.find(options, (item) => item[primaryKeyOption] === value)
      }
      return value
    } catch (error) {
      return _.toString(value)
    }
  }, [options, value])

  const filteredOptions = useMemo(() => {
    if (_.every(options, (op) => _.has(op, 'status'))) {
      return _.filter(options, { status: true })
    }
    return options
  }, [options])

  const getOptionSelectedState = (option, value) => {
    try {
      if (_.isInteger(option) || _.isString(option)) {
        return option[primaryKeyOption] === value
      }
      return option[primaryKeyOption] === value[primaryKeyOption]
    } catch {
      return false
    }
  }

  const renderOptionMultiple = (option, { selected }) => {
    const label = renderOption(option, null)
    return (
      <>
        <Checkbox checked={selected} style={{ padding: 0, paddingRight: 8 }} color="primary" />
        <span>{label}</span>
      </>
    )
  }

  const getRenderOption = () => {
    if (multiple) {
      return renderOptionMultiple
    }
    return renderOption
  }

  const getOptionSelectedProps = getOptionSelected || getOptionSelectedState

  const onHoverField = () => {
    setIsFocusing(true)
  }

  const onLeavingField = () => {
    setIsFocusing(false)
  }

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      error={error}
      label={label}
      required={required}
      {...textFieldProps}
      InputProps={{
        ...params.InputProps,
        ...textFieldProps.InputProps
      }}
    />
  )

  return (
    <FormControllerErrorMessage title={helperText} open={openTooltip}>
      <Autocomplete
        value={formatValue}
        onMouseOver={onHoverField}
        onMouseLeave={onLeavingField}
        ChipProps={{
          classes: {
            root: classes.chipRoot,
            deleteIcon: classes.chipIcon
          }
        }}
        getOptionSelected={getOptionSelectedProps}
        // filterOptions={filterOptions}
        getOptionLabel={renderOption as any}
        multiple={multiple}
        renderInput={renderInput}
        renderOption={getRenderOption()}
        options={filteredOptions}
        {...autocompleteProps}
      />
    </FormControllerErrorMessage>
  )
}

AppAutocomplete.defaultProps = {
  primaryKeyOption: 'id',
  textFieldProps: {},
  disableClearable: true,
  renderOption(option) {
    return option.description
  }
}

export default AppAutocomplete
