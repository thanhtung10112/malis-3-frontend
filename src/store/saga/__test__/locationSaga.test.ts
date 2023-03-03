import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import immer from 'immer'

import locationApi from '@/apis/location.api'
import { locationStore, commonStore, advancedFilterActions } from '@/store/reducers'
import {
  fetchInitDataForList,
  fetchInitDataForCE,
  fetchList,
  fetchDetail,
  getLocationList,
  openLocationCreateDialog,
  openLocationUpdateDialog,
  createLocation,
  updateLocation,
  getLocationNextCode,
  closeLocationDialog
} from '@/store/saga/location.saga'

import type { LocationInitDataForList } from '@/types/Location'
import { StatusCode } from '@/utils/StatusCode'

const FAKE_PERMISSIONS = {
  view: true,
  edit: true,
  disable_enable: true,
  delete: true,
  change_type: true,
  make_a_list: true,
  create: true
}

const FAKE_INIT_DATA_FOR_LIST = {
  permissions: {
    location: FAKE_PERMISSIONS
  },
  wiki_page: 'wiki_page/location',
  column_tooltips: {}
} as LocationInitDataForList

const FAKE_INIT_DATA_FOR_CE = {
  next_code: '00095',
  permissions: FAKE_PERMISSIONS,
  wiki_page: 'wiki_page/create',
  parameters: {
    CTRY: [],
    LOAT: [],
    PLLA: [],
    PUCO: [],
    SSPE: [],
    TYLO: []
  }
}

const FAKE_DATA_LIST = {
  locations: [
    {
      id: 1,
      location_id: '00001',
      name: 'Data unit test 1',
      location_type: 99988
    },
    {
      id: 2,
      location_id: '00002',
      name: 'Data unit test 2',
      location_type: 99989
    }
  ]
}

const FAKE_DETAIL = FAKE_DATA_LIST.locations[0]

const PROVIDE_FETCH_INIT_DATA_FOR_LIST = [
  [matchers.call.fn(locationApi.getInitDataForList), FAKE_INIT_DATA_FOR_LIST]
] as any

const PROVIDE_FETCH_INIT_DATA_FOR_CE = [[matchers.call.fn(locationApi.getInitDataForCE), FAKE_INIT_DATA_FOR_CE]] as any

const PROVIDE_FETCH_LIST = [
  [matchers.call.fn(locationApi.getList), FAKE_DATA_LIST],
  [matchers.select.selector(commonStore.selectTableState), 1],
  [matchers.select.selector(commonStore.selectSearchQuery), ''],
  [matchers.select.selector(advancedFilterActions.selectFilterData), {}]
] as any

const PROVIDE_FETCH_DETAIL = [[matchers.call.fn(locationApi.getDetail), { location: FAKE_DETAIL }]] as any

const PROVIDE_GET_LIST = [
  ...PROVIDE_FETCH_INIT_DATA_FOR_LIST,
  [matchers.select.selector(locationStore.selectPermissions), FAKE_INIT_DATA_FOR_LIST.permissions.location],
  ...PROVIDE_FETCH_LIST
] as any

describe('[Location Saga]', () => {
  describe('fetchInitDataForList', () => {
    it('should have data after call API successfully', () => {
      return expectSaga(fetchInitDataForList)
        .provide(PROVIDE_FETCH_INIT_DATA_FOR_LIST)
        .withReducer(locationStore.default.reducer)
        .hasFinalState({ ...locationStore.initialState, initDataForList: FAKE_INIT_DATA_FOR_LIST })
        .run()
    })
  })

  describe('fectInitDataForCE', () => {
    it('should have data after call API successfully', () => {
      const finalState = immer(locationStore.initialState, (draft) => {
        // draft.initDataForList.permissions.location = FAKE_INIT_DATA_FOR_CE.permissions
        draft.initDataForCE.next_code = FAKE_INIT_DATA_FOR_CE.next_code
        draft.initDataForCE.wiki_page = FAKE_INIT_DATA_FOR_CE.wiki_page
        draft.initDataForCE.parameters = FAKE_INIT_DATA_FOR_CE.parameters
        draft.detail.location_id = FAKE_INIT_DATA_FOR_CE.next_code
      })
      return expectSaga(fetchInitDataForCE)
        .provide(PROVIDE_FETCH_INIT_DATA_FOR_CE)
        .withReducer(locationStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('fetchList', () => {
    it('should have data after call API successfully', () => {
      return expectSaga(fetchList)
        .provide(PROVIDE_FETCH_LIST)
        .withReducer(locationStore.default.reducer)
        .hasFinalState({ ...locationStore.initialState, dataList: FAKE_DATA_LIST.locations })
        .run()
    })
  })

  describe('fetchDetail', () => {
    it('should have data after call API successfully', () => {
      const finalState = immer(locationStore.initialState, (draft) => {
        draft.detail = { ...draft.detail, ...FAKE_DETAIL }
      })
      return expectSaga(fetchDetail, FAKE_DETAIL.id)
        .provide([...PROVIDE_FETCH_DETAIL])
        .withReducer(locationStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('getLocationList', () => {
    it('should call fetchList if user has view permission', async () => {
      const finalState = immer(locationStore.initialState, (draft) => {
        draft.dataList = FAKE_DATA_LIST.locations as any
        draft.initDataForList = FAKE_INIT_DATA_FOR_LIST
      })
      return expectSaga(getLocationList)
        .provide([...PROVIDE_GET_LIST])
        .withReducer(locationStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })

    it('should not call fetchList if user has no view permission', () => {
      const fakeData = immer(FAKE_INIT_DATA_FOR_LIST, (draft) => {
        draft.permissions.location.view = false
      })
      return expectSaga(getLocationList)
        .provide([
          ...PROVIDE_FETCH_INIT_DATA_FOR_LIST,
          [matchers.select.selector(locationStore.selectPermissions), fakeData.permissions.location],
          ...PROVIDE_FETCH_LIST
        ])
        .withReducer(locationStore.default.reducer)
        .hasFinalState({
          ...locationStore.initialState,
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
      return expectSaga(getLocationList)
        .provide([[matchers.call.fn(locationApi.getInitDataForList), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('openLocationCreateDialog', () => {
    it('should have data after call API successfully', () => {
      const finalState = immer(locationStore.initialState, (draft) => {
        // draft.initDataForList.permissions.location = FAKE_INIT_DATA_FOR_CE.permissions
        draft.initDataForCE.next_code = FAKE_INIT_DATA_FOR_CE.next_code
        draft.initDataForCE.wiki_page = FAKE_INIT_DATA_FOR_CE.wiki_page
        draft.initDataForCE.parameters = FAKE_INIT_DATA_FOR_CE.parameters
        draft.detail.location_id = FAKE_INIT_DATA_FOR_CE.next_code
        draft.dialogState.open = true
      })
      return expectSaga(openLocationCreateDialog)
        .provide([...PROVIDE_FETCH_INIT_DATA_FOR_CE])
        .withReducer(locationStore.default.reducer)
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
      return expectSaga(openLocationCreateDialog)
        .provide([[matchers.call.fn(locationApi.getInitDataForCE), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('openLocationUpdateDialog', () => {
    it('should have data after call API successfully', () => {
      const finalState = immer(locationStore.initialState, (draft) => {
        // draft.initDataForList.permissions.location = FAKE_INIT_DATA_FOR_CE.permissions
        draft.initDataForCE.next_code = FAKE_INIT_DATA_FOR_CE.next_code
        draft.initDataForCE.wiki_page = FAKE_INIT_DATA_FOR_CE.wiki_page
        draft.initDataForCE.parameters = FAKE_INIT_DATA_FOR_CE.parameters
        draft.detail.location_id = FAKE_INIT_DATA_FOR_CE.next_code
        draft.dialogState.open = true
        draft.dialogState.editMode = true
        draft.detail = { ...draft.detail, ...FAKE_DETAIL }
      })
      return expectSaga(openLocationUpdateDialog, { payload: FAKE_DETAIL.id, type: '' })
        .provide([...PROVIDE_FETCH_INIT_DATA_FOR_CE, ...PROVIDE_FETCH_DETAIL])
        .withReducer(locationStore.default.reducer)
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
      return expectSaga(openLocationUpdateDialog, { payload: FAKE_DETAIL.id, type: '' })
        .provide([[matchers.call.fn(locationApi.getInitDataForCE), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('createLocation', () => {
    it('should get next manufacturer_id and resetDetail after creating successfully', () => {
      const generated_code = '99999'
      const finalState = immer(locationStore.initialState, (draft) => {
        draft.detail.location_id = generated_code
        draft.initDataForCE.next_code = generated_code
      })
      expectSaga(createLocation, { payload: FAKE_DETAIL as any, type: '' })
        .provide([
          [matchers.call.fn(locationApi.create), { message: 'Create successfully' }],
          [matchers.call.fn(locationApi.getNextCode), { generated_code }]
        ])
        .withReducer(locationStore.default.reducer)
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
      return expectSaga(createLocation, { payload: FAKE_DETAIL as any, type: '' })
        .provide([[matchers.call.fn(locationApi.create), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('updateLocation', () => {
    const payload = {
      id: FAKE_DETAIL.id,
      location: FAKE_DETAIL
    } as any

    it('should close dialog and get list after updating successfully', () => {
      const finalState = immer(locationStore.initialState, (draft) => {
        draft.dataList = FAKE_DATA_LIST.locations as any
        draft.initDataForList = FAKE_INIT_DATA_FOR_LIST
      })
      expectSaga(updateLocation, { payload, type: '' })
        .provide([
          [matchers.select.selector(locationStore.selectPermissions), FAKE_PERMISSIONS],
          [matchers.call.fn(locationApi.update), { message: 'Update successfully' }],
          ...PROVIDE_GET_LIST
        ])
        .withReducer(locationStore.default.reducer)
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
      return expectSaga(updateLocation, { payload, type: '' })
        .provide([
          [matchers.select.selector(locationStore.selectPermissions), FAKE_PERMISSIONS],
          [matchers.call.fn(locationApi.update), throwError(error)]
        ])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('getLocationNextCode', () => {
    const payload = FAKE_DETAIL as any
    it('should have data after call API successfully', () => {
      const generated_code = '00094'
      const finalState = immer(locationStore.initialState, (draft) => {
        draft.detail = { ...draft.detail, ...FAKE_DETAIL, location_id: generated_code }
      })
      return expectSaga(getLocationNextCode, { payload, type: '' })
        .provide([[matchers.call.fn(locationApi.getNextCode), { message: 'Get next code', generated_code }]])
        .withReducer(locationStore.default.reducer)
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
      return expectSaga(getLocationNextCode, { payload, type: '' })
        .provide([[matchers.call.fn(locationApi.getNextCode), throwError(error)]])
        .withReducer(commonStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })

  describe('closeLocationDialog', () => {
    it('should close dialog and get list successfully', () => {
      const finalState = immer(locationStore.initialState, (draft) => {
        draft.dataList = FAKE_DATA_LIST.locations as any
        draft.initDataForList = FAKE_INIT_DATA_FOR_LIST
      })
      return expectSaga(closeLocationDialog)
        .provide([...PROVIDE_GET_LIST])
        .withReducer(locationStore.default.reducer)
        .hasFinalState(finalState)
        .run()
    })
  })
})
