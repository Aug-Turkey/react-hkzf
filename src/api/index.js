import axios from "axios";

const request = axios.create({
	baseURL: "http://localhost:8080/",
	timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
	config => {
		// 	config.data = JSON.stringify(config.data);
		// 	config.headers = {
		// 		"Content-Type": "application/json",
		// 	};
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 响应拦截器
request.interceptors.response.use(
	response => {
		// if (response.data.errCode === 2) {
		// 	console.log("过期");
		// }
		return response;
	},
	error => {
		console.log("请求出错：", error);
	}
);

export default request;
