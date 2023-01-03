import request from "./index";

// 获取首页轮播图数据
export const getSwiper = () => {
	return request({ url: "home/swiper", method: "get" });
};

// 获取首页租房小组数据  area:地区的id
export const getGroup = () => {
	return request({ url: "home/groups", params: { area: "AREA%7C88cff55c-aaa4-e2e0" }, method: "get" });
};

// 获取首页资讯数据  area:地区的id
export const getNew = () => {
	return request({ url: "home/news", params: { area: "AREA|88cff55c-aaa4-e2e0" }, method: "get" });
};

// 根据城市名称查询该城市信息   params:城市名称
export const getCityInfo = params => {
	return request({ url: "area/info", params, method: "get" });
};

// 获取城市列表数据   level:获取哪一级的城市，1 表示获取所有城市数据 2 表示城市下区的数据
export const getCityList = params => {
	return request({ url: "area/city", params, method: "get" });
};

// 热门城市
export const getHotCity = () => {
	return request({ url: "area/hot", method: "get" });
};

// 房源数据
export const getCityHouse = params => {
	return request({ url: "area/map", params, method: "get" });
};

// 获取小区房源数据
export const getHouses = params => {
	return request({ url: "houses", params, method: "get" });
};

// 查询房屋具体信息
export const getHouseInfo = id => {
	return request({ url: `/houses/${id}`, method: "get" });
};
