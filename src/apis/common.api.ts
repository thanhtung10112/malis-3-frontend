import HttpService from '@/helper/HttpService'

class CommonApi extends HttpService {
  startBackgroundJob = (type: string, operation_data: any, file: File) => {
    const formData = new FormData()
    const background_operation_data = JSON.stringify({ type, operation_data })
    formData.append('background_operation_data', background_operation_data)
    formData.append('background_operation_file', file)
    return this.post('background_operation/start', formData)
  }

  stopBackgroundJob(operation_id: string) {
    return this.put('background_operation/stop', { operation_id })
  }

  sendReportMail(data) {
    return this.post('send_report_mail', data)
  }
}

const commonApi = new CommonApi('')

export default commonApi
