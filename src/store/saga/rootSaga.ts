import { fork } from 'redux-saga/effects'

import advancedFilterSaga from './advancedFilter.saga'
import makeAListSaga from './makeAListSaga'
import budgetSaga from './budgetSaga'

import manufacturerSaga from './manufacturer.saga'
import parameterTypeSaga from './parameterType.saga'
import drawingSaga from './drawing.saga'
import itemSaga from './item.saga'
import authSaga from './auth.saga'
import groupSaga from './group.saga'
import userSaga from './user.saga'
import parameterSaga from './parameter.saga'
import locationsSaga from './location.saga'
import currencySaga from './currency.saga'
import equivalenceSaga from './equivalence.saga'
import jobSaga from './job.saga'
import assemblySaga from './assembly.saga'
import commonSaga from './common.saga'
import specificationSaga from './specification.saga'
import partSaga from './part.saga'
import tagSaga from './tag.saga'

function* rootSaga() {
  yield fork(locationsSaga)
  yield fork(parameterTypeSaga)
  yield fork(parameterSaga)
  yield fork(userSaga)
  yield fork(authSaga)
  yield fork(groupSaga)
  yield fork(advancedFilterSaga)
  yield fork(makeAListSaga)
  yield fork(currencySaga)
  yield fork(jobSaga)
  yield fork(equivalenceSaga)
  yield fork(budgetSaga)
  yield fork(commonSaga)
  yield fork(manufacturerSaga)
  yield fork(drawingSaga)
  yield fork(itemSaga)
  yield fork(assemblySaga)
  yield fork(specificationSaga)
  yield fork(partSaga)
  yield fork(tagSaga)
}

export default rootSaga
