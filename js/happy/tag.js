var insert_id='';
var site_url = 'http://localhost:2017/L_base/';

// 添加标签			
function add_tags(t){	
	// 处理 input（分割多标签，去两端空格）
	var inputArr = t.value.split(/[,，;；、\s\n]+/);

	$.ajaxSetup({async: false});
	
	for(var m in inputArr){
		if(inputArr[m]){
			// Get 标签ID
			$.get(site_url +"Happy/base/insertTag/"+ inputArr[m], function(d){
				if(d>-1){
					insert_id = d;
				}
			});

			// 贴标签 & 改颜色
			$.get(site_url +"Happy/base/addTag/"+ $('#id').val() +"/"+ insert_id, function(d){
				if(d==1){
					flushtag(insert_id, inputArr[m])
					$(t).addClass('act')
				}
			});
		}
	}
}
// 快速添加标签			
function quickAddTags(t){	
	// 处理 input（分割多标签，去两端空格）
	var input = $(t).text();

	$.ajaxSetup({async: false});
	
	// Get 标签ID
	$.get(site_url +"Happy/base/insertTag/"+ input, function(d){
		if(d>-1){
			insert_id = d;
		}
	});

	// 贴标签 & 改颜色
	$.get(site_url +"Happy/base/addTag/"+ $('#id').val() +"/"+ insert_id, function(d){
		if(d==1){
			flushtag(insert_id, input);
			$(t).addClass('act')
		}
	});
}
function flushtag(insert_id, input_c){
	$('#tags_area2').append('<button class="btn btn-primary btn-sm span_tag_'+ insert_id +'" type="submit">'+ input_c +'</button>');
}
// 删除标签
function del_tags(t){
	console.log(site_url +"Happy/base/delTag/"+ $('#id').val() +'/'+ $(t).attr('data-tagid'))
	$.get(site_url +"Happy/base/delTag/"+ $('#id').val() +'/'+ $(t).attr('data-tagid'), function(d){
		if(d==1){
			$('.span_tag_'+ $(t).attr('data-tagid')).remove();
			$(t).removeClass('act')
		}
	});
}



// 重命名 title
function rename(tit) {
	$('body').overhang({
		type: 'prompt',
		message: '请输入新标题',
		callback: function () {
			var obj = {};
			obj.id = $('#id').val();
			obj.title = $('body').data('overhangPrompt');
			$.post(site_url +"Happy/handle/rename", obj, function(d){
				if(d.update_status == 1){
					$('.title').text(obj.title)
					location.reload();
				}
			},'json');
		}
	});
	$('.prompt-field').val(tit)
}