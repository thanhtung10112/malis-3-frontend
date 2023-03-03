import frisby, { Joi } from 'frisby'

import { endpoint, authenticate, logout } from './_utils'

const FAKE_DATA_CREATE = { manufacturer_id: 99955, name: 'Data unit test' }

describe('[Manufacturer API]', () => {
  beforeEach(() => {
    return authenticate()
  })

  afterEach(() => {
    return logout()
  })

  describe('GET - Get init data for list', () => {
    it('should get data correctly', () => {
      return frisby
        .get(`${endpoint.init_data}?comp_name=list_manufacturer`)
        .expect('status', 200)
        .expect('jsonTypes', 'wiki_page', Joi.string().required())
        .expect('jsonTypes', 'column_tooltips', {
          edit: Joi.string().required(),
          manufacturer_id: Joi.string().required(),
          name: Joi.string().required(),
          status: Joi.string().required()
        })
        .expect('jsonTypes', 'permissions.manufacturer', {
          create: Joi.bool().required(),
          delete: Joi.bool().required(),
          disable_enable: Joi.bool().required(),
          edit: Joi.bool().required(),
          view: Joi.bool().required()
        })
    })
  })

  describe('GET - Get init data for create edit', () => {
    it('should get data correctly', () => {
      return frisby
        .get(`${endpoint.init_data}?comp_name=create_edit_manufacturer`)
        .expect('status', 200)
        .expect('jsonTypes', 'next_code', Joi.number().required())
        .expect('jsonTypes', 'wiki_page', Joi.string().required())
        .expect('jsonTypes', 'permissions', {
          create: Joi.bool().required(),
          delete: Joi.bool().required(),
          disable_enable: Joi.bool().required(),
          edit: Joi.bool().required(),
          view: Joi.bool().required()
        })
    })
  })

  describe('GET - Get Manufacturer List', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.manufacturer, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.manufacturer, { manufacturers: [id] }).expect('status', 200)
    })

    it('should return a list of feed manufacturers', () => {
      return frisby
        .get(endpoint.manufacturer)
        .expect('status', 200)
        .expect('jsonTypes', 'manufacturers.*', {
          id: Joi.number().required(),
          manufacturer_id: Joi.number().required(),
          name: Joi.string().required(),
          status: Joi.bool().required()
        })
        .expect('jsonTypes', 'page', Joi.number().required())
        .expect('jsonTypes', 'per_page', Joi.number().required())
        .expect('jsonTypes', 'total_items', Joi.number().required())
    })

    it('should return manufacturer correctly after searching', () => {
      return frisby
        .get(`${endpoint.manufacturer}?s=${FAKE_DATA_CREATE.manufacturer_id}`)
        .expect('status', 200)
        .expect('json', 'manufacturers[0]', {
          id,
          manufacturer_id: FAKE_DATA_CREATE.manufacturer_id
        })
        .expect('json', 'total_items', 1)
        .then((result) => {
          const data = JSON.parse(result._body)
          expect(data.manufacturers).toHaveLength(1)
        })
    })

    it('should return per_page correctly', () => {
      const per_page = 10
      return frisby
        .get(`${endpoint.manufacturer}?per_page=${per_page}`)
        .expect('status', 200)
        .expect('json', 'per_page', per_page)
    })

    it('should return page correctly', () => {
      const page = 20
      return frisby.get(`${endpoint.manufacturer}?page=${page}`).expect('status', 200).expect('json', 'page', page)
    })
  })

  describe('GET - Get a Manufacturer', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.manufacturer, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.manufacturer, { manufacturers: [id] }).expect('status', 200)
    })

    it('should return a manufacturer', () => {
      return frisby
        .get(`${endpoint.manufacturer}/${id}`)
        .expect('status', 200)
        .expect('json', 'manufacturer', {
          ...FAKE_DATA_CREATE,
          id,
          status: true
        })
        .expect('jsonTypes', 'manufacturer', {
          id: Joi.number().required(),
          manufacturer_id: Joi.number().required(),
          name: Joi.string().required(),
          status: Joi.bool().required(),
          created_by: Joi.string().required(),
          created_at: Joi.string().required(),
          updated_at: Joi.string().required(),
          updated_by: Joi.string().required()
        })
    })

    it('should return a status of 404', () => {
      return frisby.get(`${endpoint.manufacturer}/99999999`).expect('status', 404)
    })
  })

  describe('POST - Create a Manufacturer', () => {
    it('should return a status of 201 if creating successfully', () => {
      return frisby
        .post(endpoint.manufacturer, FAKE_DATA_CREATE)
        .expect('status', 201)
        .expect('json', 'success', true)
        .then((response) => {
          const { id } = JSON.parse(response._body)
          return frisby.del(endpoint.manufacturer, { manufacturers: [id] })
        })
    })
  })

  describe('PUT - Update a Manufacturer', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.manufacturer, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.manufacturer, { manufacturers: [id] }).expect('status', 200)
    })

    it("should update 'name' property successfully", () => {
      const nameUpdated = 'Data unit test update'
      return frisby
        .put(`${endpoint.manufacturer}/${id}`, { name: nameUpdated })
        .expect('status', 200)
        .then(() => {
          return frisby
            .get(`${endpoint.manufacturer}/${id}`)
            .expect('status', 200)
            .expect('json', 'manufacturer', {
              ...FAKE_DATA_CREATE,
              id,
              name: nameUpdated
            })
        })
    })
  })

  describe('DELETE - Delete a Manufacturer', () => {
    it('should delete a manufacturer successfully', () => {
      return frisby
        .post(endpoint.manufacturer, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          return frisby
            .del(endpoint.manufacturer, { manufacturers: [data.id] })
            .expect('status', 200)
            .expect('json', 'success', true)
            .then(() => {
              return frisby.get(`${endpoint.manufacturer}/${data.id}`).expect('status', 404)
            })
        })
    })
  })

  describe('PUT - Enable/Disable a Manufacturer', () => {
    let id: number
    beforeEach(() => {
      return frisby
        .post(endpoint.manufacturer, FAKE_DATA_CREATE)
        .expect('status', 201)
        .then((response) => {
          const data = JSON.parse(response._body)
          id = data.id
        })
    })

    afterEach(() => {
      return frisby.del(endpoint.manufacturer, { manufacturers: [id] }).expect('status', 200)
    })

    it('should enable a manufacturer successfully', () => {
      return frisby
        .put(`${endpoint.manufacturer}/disable`, { manufacturers: [id] })
        .expect('status', 200)
        .then(() => {
          return frisby
            .put(`${endpoint.manufacturer}/enable`, { manufacturers: [id] })
            .expect('status', 200)
            .expect('json', 'failed_count', 0)
            .expect('json', 'success_count', 1)
            .then(() => {
              return frisby
                .get(`${endpoint.manufacturer}/${id}`)
                .expect('status', 200)
                .expect('json', 'manufacturer.status', true)
            })
        })
    })

    it('should disable a manufacturer successfully', () => {
      return frisby
        .put(`${endpoint.manufacturer}/disable`, { manufacturers: [id] })
        .expect('status', 200)
        .expect('json', 'failed_count', 0)
        .expect('json', 'success_count', 1)
        .then(() => {
          return frisby
            .get(`${endpoint.manufacturer}/${id}`)
            .expect('status', 200)
            .expect('json', 'manufacturer.status', false)
        })
    })

    it('should show summary report when enable a enabled manufacturer', () => {
      return frisby
        .put(`${endpoint.manufacturer}/enable`, { manufacturers: [id] })
        .expect('status', 200)
        .expect('json', 'failed_count', 1)
        .expect('json', 'failed_reasons[0]', {
          id: FAKE_DATA_CREATE.manufacturer_id
        })
        .expect('jsonTypes', 'failed_reasons.*', {
          id: Joi.number().required(),
          reason: Joi.string().required()
        })
    })

    it('should show summary report when disable a disabled manufacturer', () => {
      return frisby.put(`${endpoint.manufacturer}/disable`, { manufacturers: [id] }).then(() => {
        return frisby
          .put(`${endpoint.manufacturer}/disable`, { manufacturers: [id] })
          .expect('status', 200)
          .expect('json', 'failed_count', 1)
          .expect('json', 'failed_reasons[0]', {
            id: FAKE_DATA_CREATE.manufacturer_id
          })
          .expect('jsonTypes', 'failed_reasons.*', {
            id: Joi.number().required(),
            reason: Joi.string().required()
          })
      })
    })
  })

  describe('GET - Get Next Manufacturer ID', () => {
    it('should get data correctly', () => {
      return frisby
        .get(`${endpoint.manufacturer}/get_next_code?current_code=1`)
        .expect('status', 200)
        .expect('jsonTypes', 'generated_code', Joi.number().required())
    })
  })
})
