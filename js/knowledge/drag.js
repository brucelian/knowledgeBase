var global_update = false;
var queueArr = [];		// 队列数组
var draggers = [];		// 可拖动对象数组
var draggers_clone = [];// 可拖动对象数组（克隆，用作对比）
var dragger = null;		// 被拖动的对象
var clone = null;		// 当前拖动对象的一个克隆，跟着鼠标移到

var isDragging = false;		// 是否在被拖动
var isMouseDown = false;	// 鼠标是否在某个拖动上按下

var mouseX;			// 刚开始拖动时的鼠标横坐标
var mouseY;			// 刚开始拖动时的鼠标纵坐标
var draggerLeft;	// 刚开始拖动时的拖动对象横坐标
var draggerTop;		// 刚开始拖动时的拖动对象纵坐标
var DRAG_THRESHOLD = 0;		// 拖动到灵敏度
var queueContainer;			// 容器
var queueContainer_clone;	// 克隆容器

var queueActive = {'border': '1px dashed #e85032'};		// 队列选中时的border
var queueUnActive = {'border': '1px solid #FFF'};		// 队列取消选中时的border

var registerDrag = function(container){	
	queueContainer = container;
	$.each(container.find('.queue'), function(index, value){
		queueArr[index] = $(value);
		draggers[index] = [];
		draggers_clone[index] = [];
		elements = $(value).find('.dragger');
		$.each(elements, function(_index, _value){
			draggers[index][_index] = $(_value); 
			draggers_clone[index][_index] = $(_value); 
		});
	});
	for(var i=0;i<draggers.length;i++)
		for(var j=0;j<draggers[i].length;j++){
			draggers[i][j].on('mousedown', dragStart);
		}
	$(container).on('mousemove', dragMove);
	$(container).on('mouseup', dragEnd);
}

var dragStart = function(e){
	e.stopPropagation();
	
	$('#actTagid').val($(this).attr('data-tagid'));
	$('#input-tagname').val( $(this).text().substr(0,$(this).text().length-4) );

	isMouseDown = true;
	mouseX = e.clientX;
	mouseY = e.clientY;
	dragger = $(this);
}

var dragMove = function(e){
	e.stopPropagation();
	
	if(!isMouseDown) return;
	
	var dx = e.clientX - mouseX;
	var dy = e.clientY - mouseY;
	if(isDragging){
		clone.css({left: draggerLeft + dx, top: draggerTop + dy});
		arrangeDragger();
	}else if(Math.abs(dx)>DRAG_THRESHOLD || Math.abs(dy)>DRAG_THRESHOLD){
		clone = makeClone(dragger);
		draggerLeft = dragger.offset().left - parseInt(dragger.css('margin-left')) - parseInt(dragger.css('padding-left'));
		draggerTop = dragger.offset().top - parseInt(dragger.css('margin-top')) - parseInt(dragger.css('padding-top'));
		clone.css({left: draggerLeft, top: draggerTop});
		queueContainer.append(clone);
		dragger.css('visibility', 'hidden');
		isDragging = true;
	}
}

var dragEnd = function(e){
	e.stopPropagation();
	if(isDragging){
		isDragging = false;
		clone.remove();
		dragger.css('visibility', 'visible');
	}
	for(var i=0;i<queueArr.length;i++)
		queueArr[i].css(queueUnActive);
	isMouseDown = false;

	var k=0;
	$.each(queueContainer.find('.queue'), function(index, value){
		elements = $(value).find('.dragger');
		$.each(elements, function(_index, _value){
			if(draggers_clone[index][_index]){
				if( global_update || draggers_clone[index][_index].attr('data-tagid') != $(_value).attr('data-tagid') ){
					console.log('变！',$(_value).text(),'['+index+','+_index+']')
					k++;
					sortTag($(_value).attr('data-tagid'), index, _index)
				}
			}else{
				console.log("新增！",$(_value).text(),'['+index+','+_index+']')
				k++;
				sortTag($(_value).attr('data-tagid'), index, _index)
			}
		});
	});
	
	if(k>0){
		console.log('更新('+ k +')成功！');
		location.reload();
	}
}

var makeClone = function(source){
	var res = source.clone();
	res.css({position: 'absolute', 'z-index': 100000});
	return res;
}

var arrangeDragger = function(){
	for(var i=0;i<queueArr.length;i++)
		queueArr[i].css(queueUnActive);
	var queueIn = findQueue();
	if(queueIn != -1)
		queueArr[queueIn].css(queueActive);
	var hover = findHover(queueIn);
	if(hover == null)
		return;
	var _hover = hover.hover;
	var _insert = hover.insert;
	var queueIdOriginal, drggerIdOriginal;
	var queueIdHover, drggerIdHover;
	for(var i=0;i<draggers.length;i++)
		for(var j=0;j<draggers[i].length;j++){
			if(draggers[i][j][0] == dragger[0]){
				queueIdOriginal = i;
				drggerIdOriginal = j;
			}
		}
	draggers[queueIdOriginal].splice(drggerIdOriginal, 1);
	if(_hover){	
		for(var i=0;i<draggers.length;i++)
			for(var j=0;j<draggers[i].length;j++){
				if(_hover && draggers[i][j][0] == _hover[0]){
					queueIdHover = i;
					drggerIdHover = j;
				}
			}
		if(_insert == 'left'){
			_hover.before(dragger);
			draggers[queueIdHover].splice(drggerIdHover, 0, dragger);
		}
		else{
			_hover.after(dragger);
			draggers[queueIdHover].splice(drggerIdHover + 1, 0, dragger);
		}
	}else{
		draggers[queueIn].push(dragger);
		queueArr[queueIn].append(dragger);
	}
}

var findQueue = function(){
	var mx=-1,pos=-1;
	var cloneTop = clone.offset().top;
	var cloneHeight = clone.height();
	for(var i=0;i<queueArr.length;i++){
		var queueTop = queueArr[i].offset().top;
		var queueHeight = queueArr[i].height();
		var val = Math.min(queueTop + queueHeight, cloneTop + cloneHeight) - Math.max(queueTop, cloneTop);
		if(val > mx){
			mx = val;
			pos = i;
		}
	}
	return pos;
}

var findHover = function(queueIn){
	if(queueIn == -1)
		return null;
	var mx=-1,pos=null;
	var cloneTop = clone.offset().top;
	var cloneHeight = clone.height();
	var cloneLeft = clone.offset().left;
	var cloneWidth = clone.width();
	var isOwn = false;
	for(var i=0;i<draggers[queueIn].length;i++){
		
		var _draggerTop = draggers[queueIn][i].offset().top;
		var _draggerHeight = draggers[queueIn][i].height();
		var vertical = Math.min(_draggerTop + _draggerHeight, cloneTop + cloneHeight) - Math.max(_draggerTop, cloneTop);
		
		var _draggerLeft = draggers[queueIn][i].offset().left;
		var _draggerWidth = draggers[queueIn][i].width();
		var horizontal = Math.min(_draggerLeft + _draggerWidth, cloneLeft + cloneWidth) - Math.max(_draggerLeft, cloneLeft);
		
		if(vertical <= 0 || horizontal <=0) continue;
		var s = vertical * horizontal;
		if(s <= cloneHeight * cloneWidth /3)
			continue;
		if(draggers[queueIn][i][0] == dragger[0]){
			isOwn = true;
			continue;
		}
		if(s > mx){
			mx = s;
			pos = draggers[queueIn][i];
		}
	}
	if(mx < 0){
		if(isOwn) return null;
		if(draggers[queueIn].length == 0){
			return {'hover': null};
		}else{
			var last,index=draggers[queueIn].length - 1;
			while(index>=0 && draggers[queueIn][index][0] == dragger[0])
				index--;
			if(index >= 0)
				last = draggers[queueIn][index];
			else
				return {'hover': null};
			if(cloneLeft >= last.offset().left + last.width())
				return {'hover': last, 'insert': 'right'};
			else
				return null;
		}
	}
	else{
		var posMid = (2* pos.offset().left + pos.width())/2;
		var cloneMid = (2* clone.offset().left + clone.width())/2;
		if(posMid > cloneMid)
			return {'hover': pos, 'insert': 'left'};
		else
			return {'hover': pos, 'insert': 'right'};
	}
}