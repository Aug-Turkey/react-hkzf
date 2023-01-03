import React, { useState, useEffect } from "react";
import { getHouseInfo } from "../../api/request";
import { useParams } from "react-router-dom";
import { Swiper } from "antd-mobile";
import "./index.scss";

const Detail = () => {
	const params = useParams();
	// 房源数据
	const [houseInfo, setHouseInfo] = useState([]);
	useEffect(() => {
		getHouseInfos(params.id);
	}, []);

	// 获取房屋详情
	const getHouseInfos = async id => {
		const res = await getHouseInfo(id);
		setHouseInfo(res.data.body);
	};

	// 轮播图渲染
	const items = houseInfo.houseImg
		? houseInfo.houseImg.map(item => (
				<Swiper.Item key={item}>
					<div className="content">
						<img className="swiper-img" src={`http://localhost:8080${item}`} alt=""></img>
					</div>
				</Swiper.Item>
		  ))
		: "";

	// tag渲染
	const houseTags = houseInfo.tags
		? houseInfo.tags.map(item => {
				return <span key={item}>{item}</span>;
		  })
		: "";

	// 朝向渲染
	const houseOriented = houseInfo.oriented
		? houseInfo.oriented.map(item => {
				return (
					<span className="toward" key={item}>
						{item}
					</span>
				);
		  })
		: "";

	return (
		<div className="detail">
			{/* 轮播图 */}
			<Swiper loop autoplay>
				{items}
			</Swiper>
			<div className="detail_content">
				<div className="detail_title">
					<p className="title">{houseInfo.title}</p>
					<div className="Traffic">{houseTags}</div>
				</div>
				<div className="detail_info">
					<div className="detail_price">
						<p>{houseInfo.price}/月</p>
						<span>租金</span>
					</div>
					<div className="detail_room">
						<p>{houseInfo.roomType}</p>
						<span>房型</span>
					</div>
					<div className="detail_area">
						<p>{houseInfo.size}平米</p>
						<span>面积</span>
					</div>
				</div>
				<div className="detail_desc">
					<div className="desc_left">
						<p>
							装修：<span>精装</span>
						</p>
						<p>
							楼层：<span>{houseInfo.floor}</span>
						</p>
					</div>
					<div className="desc_right">
						<p>朝向：{houseOriented}</p>
						<p>
							类型：<span>住宅</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Detail;
