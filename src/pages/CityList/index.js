import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "antd-mobile";
import { getCityList, getHotCity } from "../../api/request";
import { getCurrentCity } from "../../utils/index";
// 长列表组件
import { AutoSizer, List } from "react-virtualized";
import NavHeader from "../../components/NavHeader/index";
import "./index.scss";

const CityList = () => {
	const navigate = useNavigate();
	// 城市列表
	const [cityList, setCityList] = useState({});
	// 城市索引
	const [cityIndex, setCityIndex] = useState([]);
	// 城市索引高度
	const TITLE_HEIGHT = 36;
	// 城市名称高度
	const NAME_HEIGHT = 50;
	// 当前高亮索引
	const [activeIndex, setActiveIndex] = useState(0);
	// 城市列表 List 组件
	const cityListComponent = useRef();
	// 有房源的城市
	const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];

	useEffect(() => {
		getCityLists();

		// 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
		// 调用这个方法要保证 List 组件中已有数据
		// setTimeout(() => {
		// 	cityListComponent.current.measureAllRows();
		// }, 1000);
	}, []);

	// 获取城市列表数据
	const getCityLists = async () => {
		const res = await getCityList({ level: 1 });
		const { cityList, cityIndex } = formatCityData(res.data.body);

		// 获取热门城市数据
		const hotRes = await getHotCity();
		// 将热门城市添加到城市列表中
		cityList["hot"] = hotRes.data.body;
		// 将索引添加到数组中
		cityIndex.unshift("hot");
		// 获取当前定位城市
		const curCity = await getCurrentCity();
		const currentCity = JSON.parse(curCity);
		cityList["#"] = [currentCity];
		cityIndex.unshift("#");
		setCityList(cityList);
		setCityIndex(cityIndex);
	};

	// 数据格式化方法
	const formatCityData = list => {
		// 城市列表
		const cityList = {};

		list.forEach(item => {
			// 获取每个城市的首字母
			const first = item.short.substr(0, 1);
			// 判断列表中是否有该字母
			if (cityList[first]) {
				// 如果有则直接push
				cityList[first].push(item);
			} else {
				// 没有则创建新数组，在push
				cityList[first] = [item];
			}
		});

		// 获取索引数据
		const cityIndex = Object.keys(cityList).sort();

		return {
			cityList,
			cityIndex,
		};
	};

	// 处理字母索引的方法
	const formatCityIndex = letter => {
		switch (letter) {
			case "#":
				return "当前定位";
			case "hot":
				return "热门城市";
			default:
				return letter.toUpperCase();
		}
	};

	// 动态计算每行高度的方法
	const getRowHeight = ({ index }) => {
		// 索引标题高度 + 城市数量 * 城市名称的高度
		return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
	};

	// 点击切换城市
	const changeCity = curCity => {
		const { label, value } = curCity;
		// 判断点击的城市是否有房源数据
		if (HOUSE_CITY.indexOf(label) > -1) {
			// 有
			localStorage.setItem("hkzf_city", JSON.stringify({ label, value }));
			navigate(-1);
		} else {
			Toast.show({
				content: "该城市暂无房源",
				duration: 1000,
			});
		}
	};

	// 渲染城市列表每一行数据
	const rowRenderer = ({
		key, // Unique key within array of rows
		index, // Index of row within collection
		isScrolling, // 当前项是否在滚动中
		isVisible, // 当前项在 List 中是可见的
		style, // 指定每一行的位置，给每行数据添加样式
	}) => {
		// 获取每一行的字母索引
		const letter = cityIndex[index];
		// 渲染指定字母索引下的城市列表数据
		const cityItems = cityList[letter].map(item => {
			return (
				<div
					className="name"
					key={item.value}
					onClick={() => {
						changeCity(item);
					}}
				>
					{item.label}
				</div>
			);
		});

		return (
			<div key={key} style={style} className="city">
				<div className="title">{formatCityIndex(letter)}</div>
				{cityItems}
			</div>
		);
	};

	// 获取每行的信息   startIndex:拿到顶部一行的索引号动态设置索引高亮
	const onRowsRendered = ({ startIndex }) => {
		if (activeIndex !== startIndex) {
			setActiveIndex(startIndex);
		}
	};

	// 点击右侧索引滚动到对应的城市
	const goScrollToRow = index => {
		// 列表滚动到 index 行
		cityListComponent.current.scrollToRow(index);
	};

	// 渲染城市索引列表
	const renderCityIndex = cityIndex.map((item, index) => {
		return (
			<li
				className="city-index-item"
				key={item}
				onClick={() => {
					goScrollToRow(index);
				}}
			>
				<span className={activeIndex === index ? "index-active" : ""}>{item === "hot" ? "热" : item.toUpperCase()}</span>
			</li>
		);
	});

	return (
		<div className="cityList">
			{/* 顶部导航栏 */}
			<div className="nav-header">
				<NavHeader>城市列表</NavHeader>
			</div>
			{/* 城市列表 */}
			<AutoSizer>
				{({ height, width }) => (
					<List
						height={height}
						rowCount={cityIndex.length}
						rowHeight={getRowHeight}
						rowRenderer={rowRenderer}
						width={width}
						onRowsRendered={onRowsRendered}
						ref={cityListComponent}
						scrollToAlignment="start"
					/>
				)}
			</AutoSizer>

			{/* 右侧索引列表 */}
			<ul className="city-index">{renderCityIndex}</ul>
		</div>
	);
};

export default CityList;
