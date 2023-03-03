import { useEffect } from 'react'

import { Tabs, Tab } from '@material-ui/core'
import { FormProvider } from 'react-hook-form'
import { MalisPanel } from '@/components/index'

import _ from 'lodash'

import type { FormControllerTabProps } from './type'

function FormControllerTabs<T>(props: FormControllerTabProps<T>) {
  const { tabs, value, onChange, form, resetTabValue } = props

  useEffect(() => {
    const { errors } = form
    const keysError = _.keys(errors)
    if (keysError.length === 0) {
      return
    }
    const keyError = keysError[0]
    const errorKey = tabs.map(({ errorKey }) => errorKey || [])
    for (let i = 0; i < errorKey.length; i++) {
      if (errorKey[i].includes(keyError)) {
        onChange(null, i)
        break
      }
    }
  }, [form.errors])

  useEffect(() => {
    return () => {
      if (resetTabValue) {
        onChange(null, 0)
      }
    }
  }, [])

  const renderTab = () =>
    tabs
      .filter((tab) => !tab.hide)
      .map(({ panel, panelProps, errorKey, hide, ...tabProps }, index) => (
        <Tab key={index} value={index} {...tabProps} />
      ))

  const renderTabPanel = () =>
    tabs
      .filter((tab) => !tab.hide)
      .map(({ panel, panelProps }, index) => (
        <MalisPanel key={`tabPanel - ${index}`} value={value} index={index} {...panelProps}>
          {panel}
        </MalisPanel>
      ))

  return (
    <FormProvider {...form}>
      <Tabs value={value} onChange={onChange}>
        {renderTab()}
      </Tabs>
      {renderTabPanel()}
    </FormProvider>
  )
}

FormControllerTabs.defaultProps = {
  resetTabValue: true
}

export default FormControllerTabs
