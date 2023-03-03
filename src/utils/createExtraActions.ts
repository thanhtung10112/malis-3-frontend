import { createAction, ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'

import _ from 'lodash'

function createExtraActions<Name extends string, ActionName extends string, ActionType extends string>(
  name: Name,
  actions: Record<ActionName, ActionType>
) {
  const extraActions = {} as Record<ActionName, ActionCreatorWithOptionalPayload<any>>
  _.forIn(actions, (value, key) => {
    extraActions[key] = createAction(`${name}/${value}`)
  })
  return extraActions
}

export default createExtraActions
