import { Tooltip, Typography, LinearProgress } from '@material-ui/core'
import { AppTextField } from '@/components/index'

import { useEffect, useState } from 'react'
import { useController } from 'react-hook-form'
import useStyles from './styles'

import _ from 'lodash'
import clsx from 'clsx'
import { regexes, regexSpecCharacters } from '@/utils/getPasswordYup'

const FormControllerPasswordField = (props) => {
  const classes = useStyles()

  const { control, name, rules, ...textFieldProps } = props

  const [levelPw, setLevelPw] = useState<string[]>([])

  const {
    field: { onChange: onChangeController, value: valueController, ...inputProps },
    meta: { invalid }
  } = useController({
    name,
    control
  })

  useEffect(() => {
    const passedRegexes = [] as string[]
    if (valueController.length > 0) {
      regexes.forEach((regex) => {
        const isMatch = new RegExp(regex).test(valueController)
        isMatch && passedRegexes.push(regex)
      })
    }
    setLevelPw(passedRegexes)
  }, [valueController])

  const handleChangeValue = (event) => {
    const { value } = event.target
    onChangeController(value)
  }

  return (
    <>
      <Tooltip
        title={
          <>
            <p>Password must have:</p>
            <ul>
              <li
                className={clsx(classes.tooltipItem, {
                  active: valueController.length >= 8 && valueController.length <= 30
                })}
              >
                8 - 30 characters
              </li>
              <li
                className={clsx(classes.tooltipItem, {
                  active: levelPw.includes('[A-Z]')
                })}
              >
                At least one uppercase letter
              </li>
              <li
                className={clsx(classes.tooltipItem, {
                  active: levelPw.includes('[a-z]')
                })}
              >
                At least one lowercase letter
              </li>
              <li
                className={clsx(classes.tooltipItem, {
                  active: levelPw.includes('[0-9]')
                })}
              >
                At least one number
              </li>
              <li
                className={clsx(classes.tooltipItem, {
                  active: levelPw.includes(regexSpecCharacters)
                })}
              >
                At least one special character
              </li>
            </ul>
          </>
        }
      >
        <AppTextField
          {...inputProps}
          {...(textFieldProps as any)}
          onChange={handleChangeValue}
          error={Boolean(invalid)}
          helperText={(invalid as any)?.message}
          value={_.isNil(valueController) ? '' : valueController}
        />
      </Tooltip>
      <Typography variant="body2" color="textSecondary" style={{ margin: '8px 0' }}>
        Password Strength:{' '}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={levelPw.length * 25}
        color={levelPw.length > 2 ? 'primary' : 'secondary'}
      />
    </>
  )
}

export default FormControllerPasswordField
