/*
 * 通过前端快速调试数据库记录
 */

var isql_setting = {};
var isql_items;
var isql_div = $('<div class="fixbox"></div>');
isql_div.css({
	"position":"fixed", 
	"right":"0",
	"width":"300px", 
	"background":"#eee", 
	"padding":"10px 0", 
	"box-shadow":"-4px 4px 10px #999", 
	"z-index":"999"
});

function isql_ini(items){
	isql_items = items;

	// 修改 响应函数
	$('.isql_li').click(function() {
		$.get(isql_setting.getUrl + '/' + $(this).attr('data-id'), function(d){
			if(1){
				for(var i=0; i<isql_items.length; i++){
					$('#isql_'+ isql_items[i].k).val(d[isql_items[i].k]);
				}
			}
	    })
	})

	// 渲染UI
	for(var i=0; i<isql_items.length; i++){
		if(isql_items[i].t=='textarea'){
			$("<span>"+ isql_items[i].v +"：</span><textarea id='isql_"+ isql_items[i].k +"' class='isql_textarea' style='width:150px'></textarea><br>").appendTo(isql_div);
		}else{
			$("<span>"+ isql_items[i].v +"：</span><input id='isql_"+ isql_items[i].k +"' style='width:150px'><br>").appendTo(isql_div);
		}
	}
	$('<button onclick="isql_edit()" style="padding: 5px 20px; margin-right:5px;">修改</button>').appendTo(isql_div);
	$('<button onclick="isql_add()" style="padding: 5px 10px; margin-right:5px;">添加</button>').appendTo(isql_div);
	$('<button onclick="isql_del()" style="padding: 5px 3px; margin-right:5px;">删除</button>').appendTo(isql_div);
	$("body").prepend(isql_div);
}

function isql_add() {
	var isql_obj = {};

	for(var i=0; i<isql_items.length; i++){
		isql_obj[isql_items[i].k] = $('#isql_'+ isql_items[i].k).val();
	}
	$.post(isql_setting.addUrl, isql_obj, function(d){
		if(d==1){
	        location.reload(); 
		}
    })
}
function isql_del() {
	var id = $('#isql_'+ isql_items[0].k).val();

	$.get(isql_setting.delUrl + '/' + id, function(d){
		if(d==1){
	        location.reload(); 
		}
    })
}
function isql_edit() {
	var isql_obj = {};
	isql_obj.update = {};
	isql_obj.id = $('#isql_'+ isql_items[0].k).val();

	for(var i=1; i<isql_items.length; i++){
		isql_obj.update[isql_items[i].k] = $('#isql_'+ isql_items[i].k).val();
	}
	$.post(isql_setting.editUrl, isql_obj, function(d){
		if(d==1){
	        location.reload(); 
		}
    })
}





$(document).ready(function() {
	isql_setting.addUrl = 'http://localhost:2017/L_base/They/test_add'
	isql_setting.getUrl = 'http://localhost:2017/L_base/They/test_get'
	isql_setting.delUrl = 'http://localhost:2017/L_base/They/test_del'
	isql_setting.editUrl = 'http://localhost:2017/L_base/They/test_edit'
	isql_ini(new Array(
			{'v':'ID', 'k':'person_id', 't':'text'},
			{'v':'姓名', 'k':'realname', 't':'text'},
			{'v':'Headimg', 'k':'headimg', 't':'text'},
			{'v':'Rank', 'k':'listorder', 't':'text'},
			{'v':'备注', 'k':'description', 't':'textarea'}
		)
	)
})



    // 名称：<input id="name" type="text">
    // 根网址：<input id="root_url" type="text" class="g300">
    // 搜索网址：<input id="search_url" type="text" class="g300">
    // icon：<input id="icon" type="text" class="g300">
    // 备注：<input id="descript" type="text" class="g300">
    // <button onclick="addsite()" style="padding: 0 50px;">添加</button><br>
    // 网站ID：<input id="site_id" type="text" class="g50">
    // 频道ID：<input id="tag_id" type="text" class="g50">
    // <button onclick="setCategory()" style="padding: 0 50px;">设置分类</button><br>
