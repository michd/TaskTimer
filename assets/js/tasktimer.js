(function($) {

	var TaskTimer = function() {
		
		// Public interface of tasktimer object
		return {

			/**
			 * Retrieves a task object by its HTML id attribute. 
			 * 
			 * Used to connect the HTML element that envelopes the task's interface
			 * to the JS object. 
			 * This uses a dictionary to map ids to task. The dictionary gets 
			 * updated whenever a task is flushed and whenever a task is added.
			 * 
			 * @param string taskId identifier of the task to be looked up
			 * @return Task|null The task object requested or null if not found
			 */
			"getTaskById": function(taskId) {

			},

			/**
			 * Creates a new task object and returns it. 
			 * 
			 * The task object will be nameless and unactivated.
			 * 
			 * @return Task new empty task Object
			 */
			"createTask": function() {

			},

			/**
			 * Sets the given task object as the active task.
			 
			 * This will add time to it every second.
			 * 
			 * @param  Task taskObject
			 * @return null
			 */
			"activateTask": function(taskObject) {

			},

			/**
			 * Creates a new TaskGroup. 
			 * 
			 * @return Taskgroup New nameless, empty TaskGroup object
			 */
			"createGroup": function() {

			},

			/**
			 * Starts the timer, adding time to the activated task
			 * 
			 * @return null
			 */
			"startTimer": function() {

			},

			/**
			 * Alias for startTimer
			 * 
			 * @return null
			 */
			"resumeTimer": function() {

			},

			/**
			 * Pauses the timer, not adding any time to any tasks.
			 * 
			 * @return null
			 */
			"pauseTimer": function() {

			}
		};
	};











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