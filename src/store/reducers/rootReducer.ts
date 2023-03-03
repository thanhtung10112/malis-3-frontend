import { combineReducers } from 'redux'

import advancedFilter from './advancedFilter'
import makeAList from './makeAList'
import exportProcessDialog from './exportProcessDialog'
import summaryReport from './summaryReport'
import budget from './budget'

import parameter from './parameter.reducer'
import parameterType from './parameterType.reducer'
import manufacturer from './manufacturer.reducer'
import drawing from './drawing.reducer'
import auth from './auth.reducer'
import item from './item.reducer'
import group from './group.reducer'
import user from './user.reducer'
import location from './location.reducer'
import currency from './currency.reducer'
import equivalence from './equivalence.reducer'
import job from './job.reducer'
import assembly from './assembly.reducer'
import common from './common.reducer'
import specification from './specification.reducer'
import part from './part.reducer'
import tag from './tag.reducer'

const rootReducers = combineReducers({
  summaryReport,
  advancedFilter,
  makeAList,
  exportProcessDialog,
  budget,
  [common.name]: common.reducer,
  [parameterType.name]: parameterType.reducer,
  [parameter.name]: parameter.reducer,
  [manufacturer.name]: manufacturer.reducer,
  [drawing.name]: drawing.reducer,
  [auth.name]: auth.reducer,
  [item.name]: item.reducer,
  [group.name]: group.reducer,
  [user.name]: user.reducer,
  [location.name]: location.reducer,
  [currency.name]: currency.reducer,
  [equivalence.name]: equivalence.reducer,
  [job.name]: job.reducer,
  [assembly.name]: assembly.reducer,
  [specification.name]: specification.reducer,
  [part.name]: part.reducer,
  [tag.name]: tag.reducer
})

export type RootReducerType = ReturnType<typeof rootReducers>

export default rootReducers
