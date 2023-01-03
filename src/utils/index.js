import { getCityInfo } from "../api/request";

export const getCurrentCity = () => {
	// 判断本地是否有定位城市
	const localCity = localStorage.getItem("hkzf_city");
	if (!localCity) {
		// 如果没有则获取定位城市
		return new Promise((resolve, reject) => {
			// 通过 IP 定位获取到当前城市
			const myCity = new window.BMapGL.LocalCity();
			myCity.get(async res => {
				try {
					const result = await getCityInfo({ params: { name: res.name } });
					// result.data.body.label ==> 定位城市数据
					// 存储到本地
					localStorage.setItem("hkzf_city", JSON.stringify(result.data.body));
					resolve(result.data.body);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
	// 如果有，则直接返回本地城市数据
	return Promise.resolve(localCity);
};
