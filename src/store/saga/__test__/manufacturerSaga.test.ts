import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import immer from 'immer'

import { manufacturerStore, commonStore, advancedFilterActions } from '@/store/reducers'
import {
  fetchInitDataForList,
  fetchList,
  fetchInitDataForCE,
  fetchDetail,
  getManufacturerList,
  openManuCreateDialog,
  openManuUpdateDialog,
  createManu,
  updateManu,
  generateManuId,
  closeManuDialog
} from '@/store/saga/manufacturer.saga'
import manufacturerApi from '@/apis/manufacturer.api'
import { StatusCode } from '@/utils/StatusCode'

import type { ManufacturerInitDataForList, ManufacturerItem } from '@/types/Manufacturer'

const FAKE_INIT_DATA_FOR_LIST = {
  permissions: {
    manufacturer: {
      view: true,
      edit: true,
      disable_enable: true,
      delete: true
    }
  },
  wiki_page: 'wiki_page/manufacturer',
  column_tooltips: {}
} as ManufacturerInitDataForList

const FAKE_DATA_LIST = {
  manufacturers: [
    {
      manufacturer_id: 1,
      name: 'data 1'
    },
    {
      manufacturer_id: 2,
      name: 'data 2'
    }
  ] as ManufacturerItem[],
  total_items: 2
}

const FAKE_INIT_DATA_FOR_CE = {
  next_code: 42,
  permissions: { create: true, delete: true, disable_enable: true, edit: true, view: true },
  wiki_page: 'wiki_page/create'
}

const FAKE_DETAIL = {
  id: 1,
  manufacturer_id: 1,
  name: 'Data test 1'
}

const PROVIDE_FETCH_LIST = [
  [matchers.call.fn(manufacturerApi.getList), FAKE_DATA_LIST],
  [matchers.select.selector(commonStore.selectTableState), 1],
  [matchers.select.selector(commonStore.selectSearchQuery), ''],
  [matchers.select.selector(advancedFilterActions.selectFilterData), {}]
] as any

const PROVIDE_FETCH_INIT_DATA_FOR_LIST = [
  [matchers.call.fn(manufacturerApi.getInitDataForList), FAKE_INIT_DATA_FOR_LIST]
] as any

const PROVIDE_FETCH_INIT_DATA_FOR_CE = [
  [matchers.call.fn(manufacturerApi.getInitDataForCE), FAKE_INIT_DATA_FOR_CE]
] as any

const PROVIDE_FETCH_DETAIL = [[matchers.call.fn(manufacturerApi.getDetail), { manufacturer: FAKE_DETAIL }]] as any

const PROVIDE_GET_LIST = [
  ...PROVIDE_FETCH_INIT_DATA_FOR_LIST,
  [matchers.select.selector(manufacturerStore.selectPermissions), FAKE_INIT_DATA_FOR_LIST.permissions.manufacturer],
  ...PROVIDE_FETCH_LIST
] as any

describe('[Manufacturer Saga]', () => {
  describe('fetchInitDataForList', () => {
    it('should have data after call API successfully', () => {
      return expectSaga(fetchInitDataForList)
        .provide(PROVIDE_FETCH_INIT_DATA_FOR_LIST)
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState({ ...manufacturerStore.initialState, initDataForList: FAKE_INIT_DATA_FOR_LIST })
        .run()
    })
  })

  describe('fetchList', () => {
    it('should have data after call API successfully', () => {
      return expectSaga(fetchList)
        .provide(PROVIDE_FETCH_LIST)
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState({ ...manufacturerStore.initialState, dataList: FAKE_DATA_LIST.manufacturers })
        .run()
    })
  })

  describe('fectInitDataForCE', () => {
    it('should have data after call API successfully', () => {
      const finalState = immer(manufacturerStore.initialState, (draft) => {
        draft.initDataForList.permissions.manufacturer = FAKE_INIT_DATA_FOR_CE.permissions
        draft.initDataForCE.next_code = FAKE_INIT_DATA_FOR_CE.next_code
        draft.initDataForCE.wiki_page = FAKE_INIT_DATA_FOR_CE.wiki_page
        draft.detail.manufacturer_id = FAKE_INIT_DATA_FOR_CE.next_code
      })
      return expectSaga(fetchInitDataForCE)
        .provide(PROVIDE_FETCH_INIT_DATA_FOR_CE)
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('fetchDetail', () => {
    it('should have data after call API successfully', () => {
      return expectSaga(fetchDetail, FAKE_DETAIL.id)
        .provide([...PROVIDE_FETCH_DETAIL])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState({
          ...manufacturerStore.initialState,
          detail: FAKE_DETAIL
        })
        .run()
    })
  })

  describe('getManufacturerList', () => {
    it('should call fetchList if user has view permission', async () => {
      const finalState = immer(manufacturerStore.initialState, (draft) => {
        draft.dataList = FAKE_DATA_LIST.manufacturers
        draft.initDataForList = FAKE_INIT_DATA_FOR_LIST
      })
      return expectSaga(getManufacturerList)
        .provide([...PROVIDE_GET_LIST])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })

    it('should not call fetchList if user has no view permission', () => {
      const fakeData = immer(FAKE_INIT_DATA_FOR_LIST, (draft) => {
        draft.permissions.manufacturer.view = false
      })
      return expectSaga(getManufacturerList)
        .provide([
          ...PROVIDE_FETCH_INIT_DATA_FOR_LIST,
          [matchers.select.selector(manufacturerStore.selectPermissions), fakeData.permissions.manufacturer],
          ...PROVIDE_FETCH_LIST
        ])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState({
          ...manufacturerStore.initialState,
          initDataForList: FAKE_INIT_DATA_FOR_LIST
        })
        .run()
    })

    it('should show error message if there is an error', () => {
      const error: any = new Error()
      const message = 'Bad request'
      error.response = {
        data: {
          message
        },
        status: StatusCode.BAD_REQUEST
      }
      const finalState = immer(commonStore.initialState, (draft) => {
        draft.messageState = {
          message,
          status: 'error',
          display: true
        }
      })
      return expectSaga(getManufacturerList)
        .provide([[matchers.call.fn(manufacturerApi.getInitDataForList), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('openManuCreateDialog', () => {
    it('should have data after call API successfully', () => {
      const finalState = immer(manufacturerStore.initialState, (draft) => {
        draft.initDataForList.permissions.manufacturer = FAKE_INIT_DATA_FOR_CE.permissions
        draft.initDataForCE.next_code = FAKE_INIT_DATA_FOR_CE.next_code
        draft.initDataForCE.wiki_page = FAKE_INIT_DATA_FOR_CE.wiki_page
        draft.detail.manufacturer_id = FAKE_INIT_DATA_FOR_CE.next_code
        draft.dialogState.open = true
      })
      return expectSaga(openManuCreateDialog)
        .provide([...PROVIDE_FETCH_INIT_DATA_FOR_CE])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })

    it('should show error message if there is an error', () => {
      const error: any = new Error()
      const message = 'Bad request'
      error.response = {
        data: {
          message
        },
        status: StatusCode.BAD_REQUEST
      }
      const finalState = immer(commonStore.initialState, (draft) => {
        draft.messageState = {
          message,
          status: 'error',
          display: true
        }
      })
      return expectSaga(openManuCreateDialog)
        .provide([[matchers.call.fn(manufacturerApi.getInitDataForCE), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('openManuUpdateDialog', () => {
    it('should have data after call API successfully', () => {
      const finalState = immer(manufacturerStore.initialState, (draft) => {
        draft.initDataForList.permissions.manufacturer = FAKE_INIT_DATA_FOR_CE.permissions
        draft.initDataForCE.next_code = FAKE_INIT_DATA_FOR_CE.next_code
        draft.initDataForCE.wiki_page = FAKE_INIT_DATA_FOR_CE.wiki_page
        draft.detail.manufacturer_id = FAKE_INIT_DATA_FOR_CE.next_code
        draft.dialogState.open = true
        draft.detail = FAKE_DETAIL
      })
      return expectSaga(openManuUpdateDialog, { payload: FAKE_DETAIL.id, type: '' })
        .provide([...PROVIDE_FETCH_INIT_DATA_FOR_CE, ...PROVIDE_FETCH_DETAIL])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })

    it('should show error message if there is an error', () => {
      const error: any = new Error()
      const message = 'Bad request'
      error.response = {
        data: {
          message
        },
        status: StatusCode.BAD_REQUEST
      }
      const finalState = immer(commonStore.initialState, (draft) => {
        draft.messageState = {
          message,
          status: 'error',
          display: true
        }
      })
      return expectSaga(openManuUpdateDialog, { payload: FAKE_DETAIL.id, type: '' })
        .provide([[matchers.call.fn(manufacturerApi.getInitDataForCE), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('createManu', () => {
    it('should get next manufacturer_id after creating successfully', async () => {
      const { storeState } = await expectSaga(createManu, { payload: FAKE_DETAIL, type: '' })
        .provide([
          [matchers.call.fn(manufacturerApi.create), { message: 'Create successfully' }],
          ...PROVIDE_FETCH_INIT_DATA_FOR_CE
        ])
        .withReducer(manufacturerStore.default.reducer)
        .run()

      expect(storeState.detail.manufacturer_id).toBe(FAKE_INIT_DATA_FOR_CE.next_code)
      expect(storeState.detail.name).toBe('')
    })

    it('should show error message if there is an error', () => {
      const error: any = new Error()
      const message = 'Bad request'
      error.response = {
        data: {
          message
        },
        status: StatusCode.BAD_REQUEST
      }
      const finalState = immer(commonStore.initialState, (draft) => {
        draft.messageState = {
          message,
          status: 'error',
          display: true
        }
      })
      return expectSaga(createManu, { payload: FAKE_DETAIL, type: '' })
        .provide([[matchers.call.fn(manufacturerApi.create), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('updateManu', () => {
    const payload = {
      id: FAKE_DETAIL.id,
      formData: FAKE_DETAIL
    }
    it('should close dialog and get list after updating successfully', () => {
      const finalState = immer(manufacturerStore.initialState, (draft) => {
        draft.dataList = FAKE_DATA_LIST.manufacturers as any
        draft.initDataForList = FAKE_INIT_DATA_FOR_LIST
      })
      expectSaga(updateManu, { payload, type: '' })
        .provide([[matchers.call.fn(manufacturerApi.update), { message: 'Update successfully' }], ...PROVIDE_GET_LIST])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })

    it('should show error message if there is an error', () => {
      const error: any = new Error()
      const message = 'Bad request'
      error.response = {
        data: {
          message
        },
        status: StatusCode.BAD_REQUEST
      }
      const finalState = immer(commonStore.initialState, (draft) => {
        draft.messageState = {
          message,
          status: 'error',
          display: true
        }
      })
      return expectSaga(updateManu, { payload, type: '' })
        .provide([[matchers.call.fn(manufacturerApi.update), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('generateManuId', () => {
    const payload = FAKE_DETAIL
    it('should have data after call API successfully', () => {
      const generated_code = 99
      const finalState = immer(manufacturerStore.initialState, (draft) => {
        draft.detail = { ...FAKE_DETAIL, manufacturer_id: 99 }
      })
      return expectSaga(generateManuId, { payload, type: '' })
        .provide([[matchers.call.fn(manufacturerApi.getNextCode), { message: 'Get next code', generated_code }]])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })

    it('should show error message if there is an error', () => {
      const error: any = new Error()
      const message = 'Bad request'
      error.response = {
        data: {
          message
        },
        status: StatusCode.BAD_REQUEST
      }
      const finalState = immer(commonStore.initialState, (draft) => {
        draft.messageState = {
          message,
          status: 'error',
          display: true
        }
      })
      return expectSaga(generateManuId, { payload, type: '' })
        .provide([[matchers.call.fn(manufacturerApi.getNextCode), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('closeManuDialog', () => {
    it('should close dialog and get list successfully', () => {
      const finalState = immer(manufacturerStore.initialState, (draft) => {
        draft.dataList = FAKE_DATA_LIST.manufacturers
        draft.initDataForList = FAKE_INIT_DATA_FOR_LIST
      })
      return expectSaga(closeManuDialog)
        .provide([...PROVIDE_GET_LIST])
        .withReducer(manufacturerStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })
})
