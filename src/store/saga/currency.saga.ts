import { takeEvery, takeLatest, put } from 'redux-saga/effects'

import { call, select, all } from 'typed-redux-saga'

import { advancedFilterActions, commonStore, currencyStore } from '@/store/reducers'

import _ from 'lodash'
import currencyApi from '@/apis/currency.api'
import * as constant from '@/utils/constant'
import AppNumber from '@/helper/AppNumber'

function* fetchInitDataForList() {
  const userBaseCurrency = yield* select(currencyStore.selectUserBaseCurrency)
  const data = yield call(currencyApi.getInitDataForList)
  if (!_.isNull(userBaseCurrency.id)) {
    data.user_base_currency = userBaseCurrency
  }
  yield put(currencyStore.actions.setInitDataForList(data))
}

function* fetchList() {
  const { tableState, searchQuery, filterData, baseCurrency } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData),
    baseCurrency: select(currencyStore.selectUserBaseCurrency)
  })
  const { page, per_page } = tableState
  const data = yield call(currencyApi.getList, {
    base_currency_id: baseCurrency.id,
    page,
    per_page,
    s: searchQuery,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(currencyStore.actions.setDataList(data.currency_list))
}

function* fetchInitDataForCE() {
  const { id: base_currency_id } = yield* select(currencyStore.selectUserBaseCurrency)
  const data = yield call(currencyApi.getInitDataForCE, {
    base_currency_id
  })
  yield put(currencyStore.actions.setInitDataForCE(data))
}

function* fetchDetail(id: number) {
  const { currency } = yield call(currencyApi.getDetail, id)
  currency.rate = AppNumber.format(currency.rate, constant.currencyRateFormat)
  yield put(currencyStore.actions.setDetail(currency))
}

export function* getCurrencyList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(currencyStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* changeUserCurrency({ payload }: ReturnType<typeof currencyStore.sagaChangeUserCurrency>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield put(currencyStore.actions.setUserBaseCurrency(payload))
    yield call(fetchList)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openCurrencyCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield put(currencyStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

export function* createCurrency({ payload }: ReturnType<typeof currencyStore.sagaCreate>) {
  yield put(currencyStore.actions.setDialogStateLoading(true))

  try {
    const { message } = yield call(currencyApi.create, payload)
    yield all([put(commonStore.actions.setSuccessMessage(message)), put(currencyStore.actions.resetDetail())])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(currencyStore.actions.setDialogStateLoading(false))
}

export function* openCurrencyUpdateDialog({ payload: id }: ReturnType<typeof currencyStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCE)
    yield call(fetchDetail, id)
    yield put(currencyStore.actions.setDialogState({ open: true, editMode: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* updateCurrency({ payload }: ReturnType<typeof currencyStore.sagaUpdate>) {
  yield put(currencyStore.actions.setDialogStateLoading(true))

  try {
    const { id, formData } = payload
    const { message } = yield call(currencyApi.update, id, formData)
    yield call(closeCurrencyDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(currencyStore.actions.setDialogStateLoading(false))
}

export function* closeCurrencyDialog() {
  try {
    yield put(currencyStore.actions.setDialogStateOpen(false))
    yield call(getCurrencyList)
    yield put(currencyStore.actions.resetDetail())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* currencySaga() {
  yield takeEvery(currencyStore.sagaGetList, getCurrencyList)
  yield takeEvery(currencyStore.sagaCreate, createCurrency)
  yield takeLatest(currencyStore.sagaOpenCreateDialog, openCurrencyCreateDialog)
  yield takeEvery(currencyStore.sagaOpenUpdateDialog, openCurrencyUpdateDialog)
  yield takeEvery(currencyStore.sagaUpdate, updateCurrency)
  yield takeEvery(currencyStore.sagaCloseDialog, closeCurrencyDialog)
  yield takeEvery(currencyStore.sagaChangeUserCurrency, changeUserCurrency)
}

export default currencySaga
