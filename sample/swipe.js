function Swipe(obj) {
	this.id = obj.id,
	this.cas = document.getElementById(this.id),
	this.context = this.cas.getContext("2d");
	this._w = obj._w,
	this._h = obj._h,
	this.coverType = obj.coverType, //覆盖类型
	this.mask = obj.mask,
	this.radius = obj.radius;
	this.posX = 0; //保存鼠标点击时的x坐标
	this.posY = 0; //保存鼠标点击时的y坐标
	this.isMouseDown = false; //鼠标状态，没按下为false，按下为true
	this.percent = obj.percent;
	this.callback = obj.callback;//用户自定义的函数名
	this.py = getAllOffsetLeft(this.cas);
 // 先调用初始化方法
	
	this.init();
	this.addEvent();
};
// 初始化方法
// 设置canvas的图形组合方式，并填充指定的颜色
Swipe.prototype.init = function() {
 // 判断 覆盖类型（coverType）是颜色
	if (this.coverType === "color") {
		this.context.fillStyle = this.mask;
		this.context.fillRect(0, 0, this._w, this._h);
		this.context.globalCompositeOperation = "destination-out";
	}
 // 如果覆盖类型（coverType）是图片
	if (this.coverType === "img") {
		console.log("ok")
		var img01 = new Image();
		console.log(img01)
		img01.src = this.mask;
		var that = this; 
		img01.onload = function() {
		that.context.drawImage(img01, 0, 0, img01.width, img01.height, 0, 0, that._w, that._h)
		that.context.globalCompositeOperation = "destination-out";
		};
	};

};
//添加自定义监听事件，PC端为mousedown,mousedown移动端为touchstart,touchmove
Swipe.prototype.addEvent = function() {
	//判断是移动端还是pc端
	console.log(window.navigator.userAgent);
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	this.clickEvent = this.device ? "touchstart" : "mousedown";
	this.moveEvent = this.device ? "touchmove" : "mousemove";
	this.endEvent = this.device ? "touchend" : "mouseup";
	// console.log(clickEvent,moveEvent,endEvent);
	//添加鼠标点击或手机点击事件
	var that =this;
	this.cas.addEventListener(this.clickEvent,function(evt){
		that.scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
		that.scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
		var event = evt || window.event;
		//获取鼠标点击或手指点击式的视口坐标
		that.posX = that.device? event.touches[0].clientX-that.py.allLeft+that.scrollLeft : event.clientX-that.py.allLeft+that.scrollLeft;
		that.posY = that.device? event.touches[0].clientY-that.py.allTop+that.scrollTop : event.clientY-that.py.allTop+that.scrollTop;
		//点击时调用画圆的方法
		that.drawArc(that.posX,that.posY);
		that.isMouseDown = true; //鼠标按下
	});
	this.cas.addEventListener(this.moveEvent,function(evt){
		// var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
		// var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
		if( !that.isMouseDown ){
			return false;
		}else{
			
			var event = evt || window.event;
			// 调用canvas画线，将鼠标移动时坐标作为lineTo()参数传入。注意上一次点击时的坐标点作为画线的起始坐标
			var x2 = that.device? event.touches[0].clientX-that.py.allLeft+that.scrollLeft : event.clientX-that.py.allLeft+that.scrollLeft;
			var y2 = that.device? event.touches[0].clientY-that.py.allTop+that.scrollTop : event.clientY-that.py.allTop+that.scrollTop;
			that.drawLine(that.posX,that.posY,x2,y2);
			//鼠标边移动边画线，因此需要把上一次移动的点作为下一次画线的起始点
			that.posX = x2;
			that.posY = y2;		
		}
	})
	//监听鼠标或手指离开
	this.cas.addEventListener(this.endEvent,function(evt){
		that.isMouseDown = false; //鼠标未按下
		//检测透明点的个数
		var n = that.getPercent();
		//调用同名的全局函数
		that.callback.call(window,n);
		if( n > that.percent ){
			// alert("擦除完成");
			that.context.clearRect(0,0,that._w,that._h);
		}
	})
}
Swipe.prototype.drawArc = function(x1,y1){
	
	this.context.save();
	this.context.beginPath();
	this.context.arc(x1,y1,this.radius,0,2*Math.PI);
	this.context.fillStyle = "red";
	this.context.fill();
	this.context.stroke();
	this.context.restore();
}
Swipe.prototype.drawLine = function(x1,y1,x2,y2){
	this.context.save();
	this.context.beginPath();
	this.context.moveTo(x1,y1);
	this.context.lineTo(x2,y2);
	this.context.lineWidth = this.radius*2;
	this.context.lineCap = "round";
	// this.context.arc(x1,y1,20,0,2*Math.PI);
	this.context.fillStyle = "red";
	// this.context.fill();
	this.context.stroke();
	this.context.restore();
}
//获取透明点占总像素点的百分比
Swipe.prototype.getPercent = function(){
	this.num=0;
	this.imgData = this.context.getImageData(0,0,this._w,this._h);
	for (var i = 0; i < this.imgData.data.length; i+=4) {
		if( this.imgData.data[i+3] == 0){
			this.num++;
		}
	}
	this.transpercent = (this.num/(this._w*this._h))*100;
	console.log( "透明点占总面积的百分比："+ this.transpercent.toFixed(2) + "%" );
	return this.transpercent;
}

function getAllOffsetLeft(obj){
	var Top = 0;
	var Left = 0;
	while(obj){//隐式转换规则：null,nudefined,NaN,0,"",返回false；非0数字，非空字符串，对象返回true
	Top += obj.offsetTop+obj.clientTop; 
	Left += obj.offsetLeft+obj.clientLeft;
	obj = obj.offsetParent;
	}
	return {"allTop":Top,"allLeft":Left};
}