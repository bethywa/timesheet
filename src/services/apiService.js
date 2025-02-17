import baseApi from "./baseApi.js";

export default {
  // Fetch all data (supports query parameters)
  all(END_POINT, params = {}) {
    return baseApi.get(END_POINT, { params });
  },

  // Fetch KPI data
  fetchKPIData(params = {}) {
    return this.all("kpi-reports", params);
  },

  // Fetch chart data
  fetchChartData(chartType, params = {}) {
    return this.all(`charts/${chartType}`, params);
  },

  // Store new data
  store(END_POINT, data) {
    return baseApi.post(END_POINT, data);
  },

  // Update existing data
  update(END_POINT, data) {
    return baseApi.put(END_POINT, data);
  },

  // Delete data
  delete(END_POINT, data) {
    return baseApi.delete(END_POINT, data);
  },
};