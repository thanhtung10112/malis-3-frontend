import frisby, { Joi } from 'frisby'
import _ from 'lodash'

import { endpoint, authenticate, logout } from './_utils'

const FAKE_DATA_CREATE = {
  location_id: '99955',
  language: 271,
  location_type: 346,
  name: 'Data unit test',
  comment: '',
  office_address1: '',
  office_address2: '',
  office_city: '',
  office_country: null,
  office_email: '',
  office_fax: '',
  office_phone: '',
  office_state: '',
  office_zip: '',
  remark: '',
  specialties: '',
  workshop_address1: '',
  workshop_address2: '',
  workshop_city: '',
  workshop_email: '',
  workshop_fax: '',
  workshop_phone: ''
}

describe('[Location API]', () => {
  beforeEach(() => {
    return authenticate()
  })

  afterEach(() => {
    return logout()
  })

  describe('GET - Get init data for list', () => {
    it('should get data correctly', () => {
      return frisby
        .get(`${endpoint.init_data}?comp_name=list_location`)
        .expect('status', 200)
        .expect('jsonTypes', 'wiki_page', Joi.string().required())
        .expect('jsonTypes', 'column_tooltips', {
          edit: Joi.string().required(),
          location_id: Joi.string().required(),
          location_type_raw: Joi.string().required(),
          name: Joi.string().required(),
          office: Joi.string().required(),
          orders: Joi.string().required(),
          specialties: Joi.string().required(),
          status: Joi.string().required()
        })
        .expect('jsonTypes', 'permissions.location', {
          change_type: Joi.bool().required(),
          create: Joi.bool().required(),
          delete: Joi.bool().required(),
          disable_enable: Joi.bool().required(),
          edit: Joi.bool().required(),
          make_a_list: Joi.bool().required(),
          view: Joi.bool().required()
        })
    })
  })

  describe('GET - Get init data for create edit', () => {
    it('should get data correctly', () => {
      const parameterSchema = Joi.array()
        .required()
        .items(
          Joi.object({
            description: Joi.string().required(),
            id: Joi.number().required(),
            status: Joi.bool().required(),
            parameter_id: Joi.string().required()
          })
        )
      return (
        frisby
          .get(`${endpoint.init_data}?comp_name=create_edit_location`)
          .expect('status', 200)
          .expect('jsonTypes', 'next_code', Joi.string().required())
          .expect('jsonTypes', 'wiki_page', Joi.string().required())
          // .expect('jsonTypes', 'permissions.locations', {
          //   change_type: Joi.bool().required(),
          //   create: Joi.bool().required(),
          //   delete: Joi.bool().required(),
          //   disable_enable: Joi.bool().required(),
          //   edit: Joi.bool().required(),
          //   make_a_list: Joi.bool().required(),
          //   view: Joi.bool().required()
          // })
          .expect('jsonTypes', 'parameters', {
            CTRY: parameterSchema,
            PLLA: parameterSchema,
            PUCO: parameterSchema,
            SSPE: parameterSchema,
            TYLO: parameterSchema,
            LOAT: Joi.array()
              .required()
              .items(
                Joi.object({
                  description: Joi.string().required(),
                  id: Joi.number().required(),
                  status: Joi.bool().required(),
                  parameter_id: Joi.string().required(),
                  properties: Joi.object({
                    placeholder: Joi.string().allow(''),
                    type: Joi.string().allow(''),
                    regex: Joi.string().allow('')
                  })
                })
              )
          })
      )
    })
  })

  describe('GET - Get Location List', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.location, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.location, { locations: [id] }).expect('status', 200)
    })

    it('should return a list of feed locations', () => {
      return frisby
        .get(endpoint.location)
        .expect('status', 200)
        .expect('jsonTypes', 'locations.*', {
          id: Joi.number().required(),
          location_id: Joi.string().required(),
          name: Joi.string().required(),
          location_type_raw: Joi.string().required(),
          office_address1: Joi.string().required().allow(''),
          office_address2: Joi.string().required().allow(''),
          office_email: Joi.string().required().allow(''),
          office_city: Joi.string().required().allow(''),
          office_zip: Joi.string().required().allow(''),
          office_phone: Joi.string().required().allow(''),
          specialties: Joi.string().required().allow(''),
          status: Joi.bool().required()
        })
        .expect('jsonTypes', 'page', Joi.number().required())
        .expect('jsonTypes', 'per_page', Joi.number().required())
        .expect('jsonTypes', 'total_items', Joi.number().required())
    })

    it('should return location correctly after searching', () => {
      return frisby
        .get(`${endpoint.location}?s=${FAKE_DATA_CREATE.location_id}`)
        .expect('status', 200)
        .expect('json', 'locations[0]', {
          id,
          location_id: FAKE_DATA_CREATE.location_id
        })
        .expect('json', 'total_items', 1)
        .then((result) => {
          const data = JSON.parse(result._body)
          expect(data.locations).toHaveLength(1)
        })
    })

    it('should return per_page correctly', () => {
      const per_page = 10
      return frisby
        .get(`${endpoint.location}?per_page=${per_page}`)
        .expect('status', 200)
        .expect('json', 'per_page', per_page)
    })

    it('should return page correctly', () => {
      const page = 20
      return frisby.get(`${endpoint.location}?page=${page}`).expect('status', 200).expect('json', 'page', page)
    })
  })

  describe('GET - Get a Location', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.location, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.location, { locations: [id] }).expect('status', 200)
    })

    it('should return a location', () => {
      const dataCompare = _.pick(FAKE_DATA_CREATE, [
        'location_id',
        'language',
        'location_type',
        'name',
        'comment',
        'office_address1',
        'office_address2',
        'office_city',
        'office_country',
        'remark',
        'specialties'
      ])
      return frisby
        .get(`${endpoint.location}/${id}`)
        .expect('status', 200)
        .expect('json', 'location', { id, ...dataCompare })
        .expect('jsonTypes', 'location', {
          id: Joi.number().required(),
          location_id: Joi.number().required(),
          name: Joi.string().required(),
          location_type: Joi.number().required(),
          language: Joi.number().required(),
          comment: Joi.string().required().allow(''),
          office_address1: Joi.string().required().allow(''),
          office_address2: Joi.string().required().allow(''),
          office_city: Joi.string().required().allow(''),
          office_country: Joi.number().required().allow(null),
          office_email: Joi.string().required().allow(''),
          office_fax: Joi.string().required().allow(''),
          office_phone: Joi.string().required().allow(''),
          office_state: Joi.string().required().allow(''),
          office_zip: Joi.string().required().allow(''),
          workshop_address1: Joi.string().required().allow(''),
          workshop_address2: Joi.string().required().allow(''),
          workshop_city: Joi.string().required().allow(''),
          workshop_email: Joi.string().required().allow(''),
          workshop_fax: Joi.string().required().allow(''),
          workshop_phone: Joi.string().required().allow(''),
          remark: Joi.string().required().allow(''),
          created_by: Joi.string().required(),
          created_at: Joi.string().required(),
          updated_at: Joi.string().required(),
          updated_by: Joi.string().required()
        })
    })

    it('should return a status of 404', () => {
      return frisby.get(`${endpoint.location}/99999999`).expect('status', 404)
    })
  })

  describe('POST - Create a Location', () => {
    it('should return a status of 201 if creating successfully', () => {
      return frisby
        .post(endpoint.location, FAKE_DATA_CREATE)
        .expect('status', 201)
        .expect('json', 'success', true)
        .then((response) => {
          const { id } = JSON.parse(response._body)
          return frisby.del(endpoint.location, { locations: [id] })
        })
    })
  })

  describe('PUT - Update a Location', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.location, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.location, { locations: [id] }).expect('status', 200)
    })

    it('should update successfully', () => {
      const fakeDataUpdate = {
        location_id: FAKE_DATA_CREATE.location_id,
        language: 272,
        location_type: 6494,
        name: 'Data update name',
        comment: 'Data update comment',
        office_address1: 'Data update office add1',
        office_address2: 'Data update office add2',
        office_city: 'Data update office city',
        office_country: 5947,
        remark: 'Data update remark',
        specialties: '0;00'
      }
      const dataCompare = _.pick(fakeDataUpdate, [
        'language',
        'location_type',
        'name',
        'comment',
        'office_address1',
        'office_address2',
        'office_city',
        'office_country',
        'remark',
        'specialties'
      ])
      return frisby
        .put(`${endpoint.location}/${id}`, fakeDataUpdate)
        .expect('status', 200)
        .then(() => {
          return frisby.get(`${endpoint.location}/${id}`).expect('status', 200).expect('json', 'location', dataCompare)
        })
    })
  })

  describe('DELETE - Delete a Location', () => {
    it('should delete a location successfully', () => {
      return frisby
        .post(endpoint.location, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          return frisby
            .del(endpoint.location, { locations: [data.id] })
            .expect('status', 200)
            .expect('json', 'success', true)
            .then(() => {
              return frisby.get(`${endpoint.location}/${data.id}`).expect('status', 404)
            })
        })
    })
  })

  describe('PUT - Enable/Disable a Location', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.location, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.location, { locations: [id] }).expect('status', 200)
    })

    it('should enable a location successfully', () => {
      return frisby
        .put(`${endpoint.location}/disable`, { locations: [id] })
        .expect('status', 200)
        .then(() => {
          return frisby
            .put(`${endpoint.location}/enable`, { locations: [id] })
            .expect('status', 200)
            .expect('json', 'failed_count', 0)
            .expect('json', 'success_count', 1)
            .then(() => {
              return frisby
                .get(`${endpoint.location}/${id}`)
                .expect('status', 200)
                .expect('json', 'location.status', true)
            })
        })
    })

    it('should disable a location successfully', () => {
      return frisby
        .put(`${endpoint.location}/disable`, { locations: [id] })
        .expect('status', 200)
        .expect('json', 'failed_count', 0)
        .expect('json', 'success_count', 1)
        .then(() => {
          return frisby.get(`${endpoint.location}/${id}`).expect('status', 200).expect('json', 'location.status', false)
        })
    })

    it('should show summary report when enable a enabled location', () => {
      return frisby
        .put(`${endpoint.location}/enable`, { locations: [id] })
        .expect('status', 200)
        .expect('json', 'failed_count', 1)
        .expect('json', 'failed_reasons[0]', {
          id: FAKE_DATA_CREATE.location_id
        })
        .expect('jsonTypes', 'failed_reasons.*', {
          id: Joi.number().required(),
          reason: Joi.string().required()
        })
    })

    it('should show summary report when disable a disabled location', () => {
      return frisby.put(`${endpoint.location}/disable`, { locations: [id] }).then(() => {
        return frisby
          .put(`${endpoint.location}/disable`, { locations: [id] })
          .expect('status', 200)
          .expect('json', 'failed_count', 1)
          .expect('json', 'failed_reasons[0]', {
            id: FAKE_DATA_CREATE.location_id
          })
          .expect('jsonTypes', 'failed_reasons.*', {
            id: Joi.number().required(),
            reason: Joi.string().required()
          })
      })
    })
  })

  describe('GET - Get Next Location ID', () => {
    it('should get data correctly', () => {
      return frisby
        .get(`${endpoint.location}/generate_code?current_code=1`)
        .expect('status', 200)
        .expect('jsonTypes', 'generated_code', Joi.number().required())
    })
  })
})
