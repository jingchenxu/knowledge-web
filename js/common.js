//下拉菜单使用js
$(document).ready(function() {
	$('#shopping')
		.dropdown({
			on: 'hover'
		});
});
//页签切换使用的js
$(document).ready(function() {
	$('.item').click(function() {
		console.log("item点击事件被监听!");
		$('.menu .item') //选择的是menu下的item!!!!!
			.tab();
	});
});
//时间轴插件
$(document).ready(function() {
				$(function() {
				var data = [{
					"Data": [{
						"UserName": "整地",
						"UserAction": "&nbsp;",
						"IsEdit": false
					}],
					"NodeTitle": "适用月份",
					"NodeTime": "3月、4月",
					"Status": 1
				}, {
					"Data": [{
						"UserName": "定植",
						"UserAction": "&nbsp;",
						"IsEdit": false
					}],
					"NodeTitle": "适用月份",
					"NodeTime": "4月",
					"Status": 1
				}, {
					"Data": [{
						"UserName": "浇水",
						"UserAction": "&nbsp;",
						"IsEdit": true
					}],
					"NodeTitle": "适用月份",
					"NodeTime": "5月",
					"Status": 1
				}, {
					"Data": [{
						"UserName": "出土上架",
						"UserAction": "&nbsp;",
						"IsEdit": true
					}],
					"NodeTitle": "适用月份",
					"NodeTime": "4月",
					"Status": 1
				}, {
					"Data": [{
						"UserName": "追催芽肥",
						"UserAction": "&nbsp;",
						"IsEdit": true
					}],
					"NodeTitle": "适用月份",
					"NodeTime": "4月",
					"Status": 1
				}];
				$("#container").JTimeline({
					dataSource: data
				});
			});
});

//图片轮播使用的js
$(document).ready(function() {
	//滚动广告
	var len = $(".num > li").length;
	var index = 0; //图片序号
	var adTimer;
	$(".num li").mouseover(function() {
		index = $(".num li").index(this); //获取鼠标悬浮 li 的index
		showImg(index);
	}).eq(0).mouseover();
	//滑入停止动画，滑出开始动画.
	$('#scrollPics').hover(function() {
		clearInterval(adTimer);
	}, function() {
		adTimer = setInterval(function() {
			showImg(index)
			index++;
			if (index == len) { //最后一张图片之后，转到第一张
				index = 0;
			}
		}, 3000);
	}).trigger("mouseleave");

	function showImg(index) {
		var adHeight = $("#scrollPics>ul>li:first").height();
		$(".slider").stop(true, false).animate({
			"marginTop": -adHeight * index + "px" //改变 marginTop 属性的值达到轮播的效果
		}, 1000);
		$(".num li").removeClass("on")
			.eq(index).addClass("on");
	}
});