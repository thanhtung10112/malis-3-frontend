import HttpService from '@/helper/HttpService'

class JobApi extends HttpService {
  getUserGroupMapping = (group_mapping: string) => {
    return this.get(`${this._entity}/get_users_for_job`, {
      group_mapping
    })
  }
}

const jobApi = new JobApi('jobs')

export default jobApi
