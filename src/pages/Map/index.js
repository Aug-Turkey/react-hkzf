import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavHeader from "../../components/NavHeader/index";
import { getCityHouse, getHouses } from "../../api/request";
import "./index.scss";
const Map = () => {
	const navigate = useNavigate();
	const BMapGL = window.BMapGL;
	// 小区房源
	const [housesList, setHouseList] = useState([]);
	const [isShow, setIsShow] = useState(false);

	useEffect(() => {
		initMap();
	}, []);
	// 初始化地图
	const initMap = () => {
		// 获取当前定位城市
		const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
		// 创建地图实例
		const map = new BMapGL.Map("container");
		//创建地址解析器实例
		var myGeo = new BMapGL.Geocoder();
		// 将地址解析结果显示在地图上，并调整地图视野
		myGeo.getPoint(
			label,
			point => {
				if (point) {
					// 初始化地图
					map.centerAndZoom(point, 11);
					React.map = map;
					// 添加比例尺控件
					var scaleCtrl = new BMapGL.ScaleControl();
					map.addControl(scaleCtrl);
					// 添加缩放控件
					var zoomCtrl = new BMapGL.ZoomControl();
					map.addControl(zoomCtrl);

					// 获取该区域下的房源数据
					renderOverlays(value);
					// 添加覆盖物到地图中
					map.addOverlay(label);
				} else {
					alert("您选择的地址没有解析到结果！");
				}
			},
			label
		);
		// 给地图绑定移动事件
		map.addEventListener("movestart", () => {
			// 隐藏房源列表
			if (isShow === true) {
				setIsShow(false);
			}
		});
	};

	// 渲染覆盖物入口
	// 接受区域 id 参数，获取该区域下的房源数据
	// 获取房源类型以及下级地图缩放级别
	const renderOverlays = async id => {
		// 首次获取城市列表数据
		const res = await getCityHouse({ id });
		// 获取当前覆盖物类型和缩放级别
		const { nextZoom, type } = getTypeAndZoom();
		// 遍历区房源数据
		res.data.body.forEach(item => {
			// 创建覆盖物
			createOverlays(item, nextZoom, type);
		});
	};

	// 计算要绘制的覆盖物类型和下一个缩放级别
	// 区 -> 11，范围：>=10 <12
	// 镇 -> 13，范围：>=12 <14
	// 小区 -> 15，范围：>=14 <16
	const getTypeAndZoom = () => {
		// 调用地图的 getZoom() 方法，获取当前缩放级别
		const zoom = React.map.getZoom();
		// 下一个缩放级别和类型
		let nextZoom, type;
		if (zoom >= 10 && zoom < 12) {
			// 区
			nextZoom = 13;
			type = "circle";
		} else if (zoom >= 12 && zoom < 14) {
			// 镇
			nextZoom = 15;
			type = "circle";
		} else if (zoom >= 14 && zoom < 16) {
			type = "rect";
		}
		return {
			nextZoom,
			type,
		};
	};

	// 创建覆盖物
	const createOverlays = (data, zoom, type) => {
		const {
			coord: { longitude, latitude },
			label: areaName,
			count,
			value,
		} = data;
		// 创建坐标对象
		const areaPoint = new BMapGL.Point(longitude, latitude);
		// 判断覆盖物类型是圆形还是方形
		if (type === "circle") {
			// 区或镇
			createCircle(areaPoint, areaName, count, value, zoom);
		} else {
			// 小区
			createRect(areaPoint, areaName, count, value);
		}
	};

	// 创建区，镇覆盖物
	const createCircle = (point, name, count, id, zoom) => {
		// 创建文本覆盖物在地图上展示房源
		const opts = {
			position: point, // 指定文本标注所在的地理位置
			offset: new BMapGL.Size(-35, -35), // 设置文本偏移量
		};

		// 创建覆盖物
		const label = new BMapGL.Label("", opts);
		// 添加唯一标识
		label.id = id;
		// 房源覆盖物内容
		label.setContent(`
			<div style="
        width: 70px;
				height: 70px;
				line-height: 1;
				display: inline-block;
				position: absolute;
				border-radius: 100%;
				background-color: rgba(100,200,100,.8);
				text-align: center;
				cursor: pointer;">
			<p style="padding: 18px 0 6px 0;">${name}</p>
			<p>${count}套</p>
		 </div>
		`);
		// 自定义文本标注样式
		label.setStyle({
			color: "rgb(255,255,255)",
			border: "0px solid rgb(255,0,0)",
			fontSize: "12px",
			padding: "0",
			whiteSpace: "nowrap",
			textAlign: "center",
		});
		// 添加单击事件
		label.addEventListener("click", () => {
			// 获取该区域下的房源数据
			renderOverlays(id);
			// 以当前点击的覆盖物放大地图
			React.map.centerAndZoom(point, zoom);
			setTimeout(() => {
				// 清除当前覆盖物信息
				React.map.clearOverlays();
			}, 0);
		});
		// 添加覆盖物到地图中
		React.map.addOverlay(label);
	};

	// 创建小区覆盖物
	const createRect = (point, name, count, id) => {
		// 创建文本覆盖物在地图上展示房源
		const opts = {
			position: point, // 指定文本标注所在的地理位置
			offset: new BMapGL.Size(-50, -28), // 设置文本偏移量
		};
		// 创建覆盖物
		const label = new BMapGL.Label("", opts);
		// 添加唯一标识
		label.id = id;
		// 房源覆盖物内容
		label.setContent(`
    <div style="
      height:20px;
      line-height: 19px;
      width: 160px;
      padding: 0 3px;
      border-radius: 3px;
      position: absolute;
      background: rgba(12,181,106,0.9);
      cursor: pointer;
      white-space: nowrap;
    "
      <span style="
        display: inline-block;
        width: 70px;
        overflow: hidden;
        text-overflow: ellipsis';
        white-space: nowrap;
        vertical-align: middle;
      ">${name}</span>
      <span style="
      display:inline-block;
      width: 20px;
      ">${count}</span>
      <i style="
        display: block;
        width: 0;
        height: 0;
        margin: 0 auto;
        border: 4px solid transparent;
        border-top-width: 4px;
        border-top-color: #00a75b;
      "></i>
    </div>
  `);
		// 自定义文本标注样式
		label.setStyle({
			color: "rgb(255,255,255)",
			border: "0px solid rgb(255,0,0)",
			fontSize: "12px",
			padding: "0",
			whiteSpace: "nowrap",
			textAlign: "center",
		});
		// 添加单击事件
		label.addEventListener("click", e => {
			getHousesList(label.id);
			const target = e.domEvent.changedTouches[0];
			// 移动到中心位置
			React.map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY);
		});
		// 添加覆盖物到地图中
		React.map.addOverlay(label);
	};

	// 获取小区房源数据
	const getHousesList = async id => {
		const res = await getHouses({ cityId: id });
		setHouseList(res.data.body.list);
		setIsShow(true);
	};

	// 查看房源具体信息
	const goDetail = id => {
		navigate("/detail/" + id);
	};

	// 渲染小区房源
	const houseData = housesList.map(item => {
		return (
			<div
				className="house_item"
				key={item.houseCode}
				onClick={() => {
					goDetail(item.houseCode);
				}}
			>
				<div className="house_img">
					<img src={`http://localhost:8080${item.houseImg}`} alt=""></img>
				</div>
				<div className="house_info">
					<div className="title">
						<p>{item.title}</p>
					</div>
					<div className="desc">
						<p>{item.desc}</p>
					</div>
					<div className="Traffic">
						{item.tags.map(tag => {
							return <span key={tag}>{tag}</span>;
						})}
					</div>
					<div className="price">{item.price}元/月</div>
				</div>
			</div>
		);
	});
	return (
		<div className="map">
			{/* 顶部导航栏 */}
			<div className="nav-header">
				<NavHeader>地图找房</NavHeader>
			</div>
			{/* 地图容器 */}
			<div id="container"></div>
			{/* 房屋列表 */}
			<div className={`houseList ${isShow ? "show" : ""}`}>
				<div className="house_header">
					<div className="house_title">房屋列表</div>
					<div className="house_more">更多房源</div>
				</div>
				{/* 小区房源 */}
				<div className="house_content">{houseData}</div>
			</div>
		</div>
	);
};

export default Map;
