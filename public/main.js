'use strict';
let $list = $("#todoList");
const render = function(data) {
	$list.html(' ');
	data.forEach(function (currElm) {
		let li = $('<li class="list-group-item">' + currElm.message + '<input  type="checkbox" class="checkbox" id="' + currElm.id + '"><input type="button" class = "delete" value="Delete" id="' + currElm.id + '"></input></li>');
		const checkbox = li.find('.checkbox');
        checkbox.prop('checked', currElm.completed);
		$list.append(li);
	})
};

const refreshList = function () {
	$.ajax({
		url: "/inittodos",
		type: 'get',
		dataType: 'json',
		success: function (todos) {
			render(todos);
		},
		error: function (data) {
			alert('Error searching');
		}
	})

};
refreshList();

$("#searchBtn").on("click", function () {
	let searchtext = $('#searchBox').val();
	$.ajax({
		url: "/searchtodo",
		type: 'get',
		dataType: 'json',
		success: function (data) {
			$list.html("");
			let localTodos = data.filter(function (obj) {
				if (obj.message.indexOf(searchtext) >= 0) {
					return obj;
				}
			});
			render(localTodos);
		},
		error: function (data) {
			alert('Error searching');
		}
	});
});

$("#save").on("click", function () {
	let savetext = $('#savebox').val();
	$.ajax({
		url: "/savetodo",
		type: 'post',
		dataType: 'json',
		data: JSON.stringify({
			message: savetext,
			completed: false,
		}),
		success: function (data) {
			refreshList();
		},
		error: function (data) {
			alert('Error saving');
		}
	})
})

$(document).on('click','.delete', function(e){
	$.ajax({
		url: "/todos/" + e.target.id,
		type: 'delete',
		success: function (data) {
			refreshList();
		},
		error: function (data) {
			alert('Error deleting the item');
		}

	});
})

$(document).on('change', '.checkbox', function(e){
	const isChecked = e.target.checked;
	console.log(isChecked);
	$.ajax({
		url: "/todos/" + e.target.id,
		type: 'put',
		dataType: 'json',
		data: JSON.stringify({
			completed: isChecked
		}),
		success: function(data) {
			refreshList();
		},
		// error: function() {
		// 	alert('$$$$');
		// }
	})
})



