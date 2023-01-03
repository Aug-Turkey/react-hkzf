import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 组件
import { Swiper, Grid, SearchBar, Space } from "antd-mobile";
import { AppstoreOutline, DownOutline } from "antd-mobile-icons";
// 接口
import { getSwiper, getGroup, getNew } from "../../api/request";
import { getCurrentCity } from "../../utils/index";
import "./index.scss";
// 导航菜单图片
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";

// 首页
const Index = () => {
	// 轮播图数据
	const [swipers, setSwipers] = useState([]);

	useEffect(() => {
		getSwipers();
	}, []);

	// 获取轮播图数据
	const getSwipers = async () => {
		const res = await getSwiper();
		setSwipers(res.data.body);
	};

	// 轮播图渲染
	const items = swipers.map(item => (
		<Swiper.Item key={item.id}>
			<div className="content">
				<img className="swiper-img" src={`http://localhost:8080${item.imgSrc}`} alt={item.alt}></img>
			</div>
		</Swiper.Item>
	));

	return (
		<div className="container">
			{/* 搜索框 */}
			<Search></Search>

			{/* 轮播图 */}
			<Swiper loop autoplay>
				{items}
			</Swiper>

			{/* 导航菜单 */}
			<Flex></Flex>

			{/* 租房小组 */}
			<Groups></Groups>

			{/* 最新资讯 */}
			<News></News>
		</div>
	);
};

// 搜索框
const Search = () => {
	const navigate = useNavigate();
	// 当前城市名称
	const [curCityName, setCurCityName] = useState("上海");

	useEffect(() => {
		getCurCity();
	}, []);

	// 获取当前定位城市
	const getCurCity = async () => {
		const curCity = await getCurrentCity();
		const currentCity = JSON.parse(curCity);
		setCurCityName(currentCity.label);
	};

	return (
		<div className="search-box">
			{/* 城市选择 */}
			<div
				className="search-city"
				onClick={() => {
					navigate("/citylist");
				}}
			>
				<span className="city">{curCityName}</span>
				<DownOutline />
			</div>
			{/* 输入框 */}
			<div
				className="search-input"
				onClick={() => {
					navigate("/search");
				}}
			>
				<SearchBar placeholder="请输入小区或地址" style={{ "--background": "#ffffff" }} />
			</div>
			{/* 地图 */}
			<div
				className="search-icon"
				onClick={() => {
					navigate("/map");
				}}
			>
				<Space style={{ fontSize: 24 }}>
					<AppstoreOutline color="#fff" />
				</Space>
			</div>
		</div>
	);
};

// 导航菜单
const Flex = () => {
	const navs = [
		{
			id: 1,
			img: Nav1,
			title: "整租",
			path: "/home/houselist",
		},
		{
			id: 2,
			img: Nav2,
			title: "合租",
			path: "/home/shared",
		},
		{
			id: 3,
			img: Nav3,
			title: "地图找房",
			path: "/home/map",
		},
		{
			id: 4,
			img: Nav4,
			title: "去出租",
			path: "/home/rent",
		},
	];
	const navigate = useNavigate();

	// 渲染导航菜单数据
	const renderNavs = navs.map(item => {
		return (
			<div
				key={item.id}
				onClick={() => {
					navigate(item.path);
				}}
			>
				<img src={item.img} alt=""></img>
				<h2>{item.title}</h2>
			</div>
		);
	});

	return <div className="nav">{renderNavs}</div>;
};

// 租房小组
const Groups = () => {
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		getGroups();
	}, []);

	// 获取租房小组数据
	const getGroups = async () => {
		const res = await getGroup();
		setGroups(res.data.body);
	};

	// 渲染
	const groupItem = groups.map(item => {
		return (
			<Grid.Item key={item.id}>
				<div className="grid-demo-item-block">
					<div className="desc">
						<p className="title">{item.title}</p>
						<div className="info">{item.desc}</div>
					</div>
					<div className="desc-img">
						<img src={`http://localhost:8080${item.imgSrc}`} alt=""></img>
					</div>
				</div>
			</Grid.Item>
		);
	});
	return (
		<div>
			<div className="title">
				<h3>租房小组</h3>
				<span className="more">更多</span>
			</div>
			<div className="group">
				<Grid columns={2} gap={8}>
					{groupItem}
				</Grid>
			</div>
		</div>
	);
};

// 最新资讯
const News = () => {
	const [news, setNews] = useState([]);

	useEffect(() => {
		getNews();
	}, []);

	// 获取资讯数据
	const getNews = async () => {
		const res = await getNew();
		setNews(res.data.body);
	};

	// 渲染
	const newItems = news.map(item => {
		return (
			<div className="news-item" key={item.id}>
				<div className="news-left">
					<img className="news-img" src={`http://localhost:8080${item.imgSrc}`} alt=""></img>
				</div>
				<div className="news-right">
					<div className="news-title">
						<p>{item.title}</p>
					</div>
					<div className="news-source">
						<p>{item.from}</p>
						<p>{item.date}</p>
					</div>
				</div>
			</div>
		);
	});
	return (
		<div className="news">
			<div className="news-head">
				<p>最新资讯</p>
			</div>
			<div className="news-content">{newItems}</div>
		</div>
	);
};

export default Index;
