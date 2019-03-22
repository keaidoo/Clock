var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var MARGIN_LEFT = 30;
var MARGIN_TOP = 60;
var RADIUS = 8;

//限制： 小时二位数 不超过4天
//var endTime = new Date(); // 注意！！！：data中的参数第二个表示月份，是由0-11表示的。0 - 一月；11- 十二月
//endTime.setTime(endTime.getTime() + 3600 * 1000) //距离 1小时倒计时
var curShowTimeSecond = 0; // 现在倒计时需要多少毫秒

var balls = [];
const colors = ["#FFFF00", "#FF69B4", '#FF4500', '#EE82EE', '#B3EE3A', '#BFEFFF', '#A020F0', '#8470FF', '#7A67EE', '#00FFFF', '#EE7AE9'] //设置颜色

window.onload = function() {
	var canvas = document.getElementById("canvas")
	var context = canvas.getContext("2d")
	canvas.width = WINDOW_WIDTH
	canvas.height = WINDOW_HEIGHT
	curShowTimeSecond = getCurShowTimeSecond(); //curShowTimeSecond：当前总共的毫秒数

	// 动画效果

	curShowTimeSecond = getCurShowTimeSecond()
	setInterval(
		function() {
			render(context);
			update(); //负责数据改变
		},
		50 //单位ms，每50ms变化一次
	);
}

function getCurShowTimeSecond() {
	var curTime = new Date(); // 获取当前的时间是多少
	var ret =curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();//今天一共走了多少秒
	return ret ; // 判断 ret，倒计时结束，函数返回0.
}

function update() {
	var nextShowTimeSeconds = getCurShowTimeSecond();
	var nextHours = parseInt(nextShowTimeSeconds / 3600); // 一共需要多少个小时
	var nextMinute = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
	var nextSecond = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSecond / 3600); // 一共需要多少个小时
	var curMinute = parseInt((curShowTimeSecond - curHours * 3600) / 60);
	var curSecond = curShowTimeSecond % 60;

	if (nextSecond != curSecond) {
		if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
			addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10))
		}
		if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
			addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10))
		}
		if (parseInt(curMinute / 10) != parseInt(nextMinute / 10)) {
			addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinute / 10))
		}
		if (parseInt(curMinute % 10) != parseInt(nextMinute % 10)) {
			addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinute % 10))
		}
		if (parseInt(curSecond / 10) != parseInt(nextSecond / 10)) {
			addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSecond / 10))
		}
		if (parseInt(curSecond % 10) != parseInt(nextSecond % 10)) {
			addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSecond % 10))
		}
		curShowTimeSecond = nextShowTimeSeconds
	}

	updateBalls()
}

function updateBalls() {
	for (var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx
		balls[i].y += balls[i].vy
		balls[i].vy += balls[i].g

		if (balls[i].y >= WINDOW_HEIGHT + RADIUS) {
			balls[i].y = WINDOW_HEIGHT + RADIUS
			balls[i].vy = -balls[i].vy * 0.75
		}
	}
	//让弹出屏幕的小球消失，以免内存过大
	var cnt = 0
	for (var i = 0; i < balls.length; i++)
		if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH)
			balls[cnt++] = balls[i]
	while (balls.length > cnt) {
		balls.pop()

	}
}

function addBalls(x, y, num) {
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				var aBall = {
					x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
					y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
					g: 1.5 + Math.random(), //加速度
					vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, //使初始速度随机化，小球变化更加灵活
					vy: -6, //小球初始y速度
					color: colors[Math.floor(Math.random() * colors.length)]
				}
				balls.push(aBall)
			}
		}
	}

}
// 时间更新函数

function render(cxt) {
	cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
	var hours = parseInt(curShowTimeSecond / 3600); // 一共需要多少个小时
	var minute = parseInt((curShowTimeSecond - hours * 3600) / 60);
	var second = curShowTimeSecond % 60;
	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt); // 小时   
	renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt); // 每个字水平位置直径7,7*2 = 14半径+1 = 15          
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt); // 冒号 （4*2+1）= 9  digit.js中 10代表 ：    
	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minute / 10), cxt); // 分钟 
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minute % 10), cxt);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt); // 冒号 （4*2+1）= 9  digit.js中 10代表 ：
	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(second / 10), cxt); // 秒
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(second % 10), cxt);

	for (var i = 0; i < balls.length; i++) {
		cxt.fillStyle = balls[i].color
		cxt.beginPath()
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true)
		cxt.closePath()
		cxt.fill()
	}
}

function renderDigit(x, y, num, cxt) {
	cxt.fillStyle = "#005588";
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				cxt.beginPath();
				// 圆心位置公式
				cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
				cxt.closePath();
				cxt.fill();
			}
		}
	}
}