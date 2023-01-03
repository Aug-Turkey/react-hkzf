import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
// 引入组件库
import { TabBar } from "antd-mobile";
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from "antd-mobile-icons";
import "./index.scss";

const TarBar = props => {
	const location = useLocation();
	// 当前所在的路由/tab
	const { pathname } = location;
	const path = pathname.slice(6);
	// tab高亮
	const [activeKey, setActiveKey] = useState(path);
	const tabs = [
		{
			key: "index",
			title: "首页",
			icon: <AppOutline />,
		},
		{
			key: "houselist",
			title: "找房",
			icon: <UnorderedListOutline />,
		},
		{
			key: "news",
			title: "资讯",
			icon: active => (active ? <MessageFill /> : <MessageOutline />),
		},
		{
			key: "profile",
			title: "我的",
			icon: <UserOutline />,
		},
	];

	useEffect(() => {
		// 判断路由地址是否发生变化,设置tabBar高亮
		setActiveKey(path);
	}, [path]);

	// 切换TarBar
	const TarBarChange = key => {
		props.handleTarBarChange(key);
		setActiveKey(key);
	};
	return (
		<TabBar onChange={key => TarBarChange(key)} activeKey={activeKey}>
			{tabs.map(item => (
				<TabBar.Item key={item.key} icon={item.icon} title={item.title} />
			))}
		</TabBar>
	);
};

const Home = () => {
	const navigate = useNavigate();

	// 接受子组件传过来的key
	const TarBarChange = key => {
		// 跳转到对应的子组件
		navigate(key);
	};
	return (
		<div className="app">
			<div className="body">
				{/* 子路由出口 */}
				<Outlet></Outlet>
			</div>
			{/* TarBar */}
			<div className="bottom">
				<TarBar handleTarBarChange={TarBarChange}></TarBar>
			</div>
		</div>
	);
};

export default Home;
