import { useMemo, useState, memo, useCallback } from 'react'
import useStyles from './styles'

import { TextField, Tooltip, InputAdornment } from '@material-ui/core'
import { FormControllerErrorMessage, GenerateCodeIcon } from '@/components'

import clsx from 'clsx'

import type { AppTextFieldProps } from './type'

const AppTextField: React.FC<AppTextFieldProps> = (props) => {
  const { helperText, error, InputProps, disabled, generateCode, tooltip, loading, onGenerateCode, ...textFieldProps } =
    props

  const classes = useStyles()

  const [isFocusing, setIsFocusing] = useState(false)

  const openTooltip = useMemo(() => isFocusing && error, [error, isFocusing])

  const onHoverField = () => {
    setIsFocusing(true)
  }

  const onLeavingField = () => {
    setIsFocusing(false)
  }

  const renderGenerateIcon = useCallback(() => {
    if (generateCode) {
      return (
        <InputAdornment position="end" disablePointerEvents={disabled || loading}>
          <Tooltip title={tooltip}>
            <GenerateCodeIcon
              fontSize="default"
              className={clsx(classes.appTextField__generateIcon, {
                [classes.appTextField__generateIcon__disabled]: disabled || loading
              })}
              onClick={onGenerateCode}
            />
          </Tooltip>
        </InputAdornment>
      )
    }
    return null
  }, [disabled, loading, generateCode, tooltip, onGenerateCode])

  return (
    <FormControllerErrorMessage title={helperText} open={openTooltip}>
      <TextField
        disabled={disabled}
        error={error}
        onMouseOver={onHoverField}
        onMouseLeave={onLeavingField}
        InputProps={{
          readOnly: disabled,
          className: clsx({ 'Mui-disabled': disabled }),
          endAdornment: renderGenerateIcon(),
          ...InputProps
        }}
        {...textFieldProps}
      />
    </FormControllerErrorMessage>
  )
}

AppTextField.defaultProps = {
  generateCode: false,
  tooltip: 'Generate code',
  loading: false
}

export default memo(AppTextField)
