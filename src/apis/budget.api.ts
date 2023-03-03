import HttpService from '@/helper/HttpService'
class BudgetApi extends HttpService {
  importCostCode = (data) => {
    return this.post('budgets/import', data)
  }

  getInitDataForImport = (userJob: number) => this.get('init_data', { comp_name: 'import_budget', job_id_pk: userJob })
}

const budgetApi = new BudgetApi('budgets')

export default budgetApi
