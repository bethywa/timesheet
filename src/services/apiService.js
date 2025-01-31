import baseApi from "./baseApi.js";

export default {
	all(END_POINT) {
		return baseApi.get(END_POINT);
	},
	// getOne(END_POINT) {
	// 	return baseApi.get(END_POINT);
	// },
	store(END_POINT, data) {
		return baseApi.post(END_POINT, data);
	},
	update(END_POINT, data) {
		return baseApi.put(END_POINT, data);
	},
	delete(END_POINT, data) {
		return baseApi.delete(END_POINT, data);
	},
};
