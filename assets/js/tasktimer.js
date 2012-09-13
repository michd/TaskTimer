(function($) {

	var initalizeList = function() {
		if ($('#tasklist ul').length == 0) {
			$('#tasklist').append($('<ul>'));
		}
	};

	var editTaskName = function($listItem) {
		var currentValue = $listItem.find('.form label.taskname').html();
		$listItem.find('.form label.taskname').replaceWith(
			$('<input>', {"type": "text", "class": "taskname","value": currentValue})
			.blur(function(event) {
				event.preventDefault();
				if($(this).val() != '') {
					setTaskName($listItem, $(this).val());
				}
			})
		);
		$listItem.find('.form input[type=text]').focus();
	};

	var setTaskName = function($listItem, newName) {
		$listItem.find('.form input[type=text]').replaceWith(
			$('<label>', {"class": "taskname"}).html(newName)
				.click(function(event) {
					event.preventDefault();
					editTaskName($listItem);
				})
		);

		if($listItem.find('.form input[type=radio]').length == 0) {
			$listItem.find('.form').prepend(
				$('<input>', {"type": "radio", "name":"active-task"})
			);
		}
	};

	$(function() {

		$('#newtask').click(function(event) {
			event.preventDefault();
			initalizeList();

			$('#tasklist ul').append(
				$('<li>', {"class": "editing"}).append(
					$('<div>', {"class": "form"}).append(
						$('<input>', {
							"type": "text", 
							"placeholder": "Task name", 
							"class": "taskname"
						}).blur(function() {
							if ($(this).val() != '') {
								setTaskName($(this).closest('li'), $(this).val());
							}
						})
					)
				)
			).find('li:last input[type=text]').focus();
		});		

		$('#tasklist').submit(function(event) {
			event.preventDefault();
		});
	});



})(jQuery);