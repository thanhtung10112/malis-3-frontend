import { takeEvery, put, putResolve } from 'redux-saga/effects'
import { select, call, all } from 'typed-redux-saga'

import { itemStore, commonStore, advancedFilterActions } from '@/store/reducers'

import _ from 'lodash'

import itemApi from '@/apis/item.api'

/**
 * This function is used to get init data for list of item entity
 */
export function* fetchItemInitDataForList() {
  const userJob = yield* select(commonStore.selectUserValueJob)
  const data = yield call(itemApi.getInitDataForList, {
    job_id_pk: userJob.value
  })
  // when logged in as the fresh user, the API will not send the selected_job attribute
  // then we will set selected_job as an empty object
  if (_.isNull(data.selected_job)) {
    data.selected_job = {}
  }
  // the API will not send the selected_job attribute if you are in the all_job or all_standard mode,
  // then we will set selected_job = current selected user job
  if (userJob.value === -1 || userJob.value === -2) {
    data.selected_job = userJob
  }
  yield put(commonStore.actions.setUserValueJob(data.selected_job))
  yield put(itemStore.actions.setInitDataForList(data))
}

/**
 * this function is used to get item list based on user_job, user_drawing and common search attributes
 */
export function* fetchItemList() {
  const { tableState, searchQuery, filterData, userJob, userDrawing } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData),
    userJob: select(commonStore.selectUserValueJob),
    userDrawing: select(commonStore.selectUserValueDrawing)
  })
  if (!userJob.value) {
    return
  }
  const { page, per_page } = tableState
  const data = yield call(itemApi.getList, {
    per_page,
    page,
    s: searchQuery,
    job_id: userJob.value,
    drawing_id: userDrawing.value,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(itemStore.actions.setDataList(data.items))
}

/**
 * this function is used to get the list of the item
 * if current user has the view item permission
 */
export function* getItemList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchItemInitDataForList)
    const permissions = yield* select(itemStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchItemList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

/**
 * this function is used change the userjob, then set user_drawing = all_drawing
 * and then get list item
 * @param {ParameterOption} userJob option from job_option on the top of the item page
 */
export function* changeUserJob({ payload }: ReturnType<typeof itemStore.sagaChangeUserJob>) {
  const { optionValue, confirm } = payload
  if (confirm === 'save') {
    yield put(
      commonStore.sagaUpdateMultiple({
        entity: 'item',
        action: itemStore.sagaChangeUserJob,
        payloadAction: { optionValue }
      })
    )
  } else {
    yield all([
      put(commonStore.actions.setUserValueJob(optionValue)),
      put(commonStore.actions.setUserValueDrawing(commonStore.initialState.userValue.drawing))
    ])
    yield call(getItemList)
  }
}

/**
 * this function is used change the user drawing
 * if userDrawing = -1 (all_drawing), then set selected_drawing = init data
 * @param {DataForDropdown} userDrawing option from drawing_option on the top of the item page
 */
export function* changeUserDrawing({ payload }: ReturnType<typeof itemStore.sagaChangeUserDrawing>) {
  const { optionValue, confirm } = payload
  if (confirm === 'save') {
    yield put(
      commonStore.sagaUpdateMultiple({
        entity: 'item',
        action: itemStore.sagaChangeUserDrawing,
        payloadAction: { optionValue }
      })
    )
  } else {
    yield putResolve(commonStore.actions.setUserValueDrawing(optionValue))
    yield call(getItemList)
  }
}

function* itemSaga() {
  yield takeEvery(itemStore.sagaGetList, getItemList)
  yield takeEvery(itemStore.sagaChangeUserJob, changeUserJob)
  yield takeEvery(itemStore.sagaChangeUserDrawing, changeUserDrawing)
}

export default itemSaga
