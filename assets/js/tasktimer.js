(function($) {

	var Task = function() {

		//Private constants
		var MAX_TASK_NAME_LENGTH = 100;

		//Private properties
		
		/**
		 * Time spent on this task so far, in seconds 
		 * @type Number
		 */
		var timeSpent = 0;

		/**
		 * Name/label for this task, to identify it to the user
		 * @type String
		 */
		var taskName = '';

		/**
		 * Flag to set to true when public method delete() is ran		 *
		 * Marks that the task is to be deleted from outside lists
		 * @type Boolean
		 */
		var flushable = false;

		/**
		 * If anything goes wrong within a Task object, this can be thrown.
		 * 
		 * @param string message Descriptive error message
		 */
		var TaskException = function(message) {
			return {
				"name": "TaskException",
				"message": message,
				"toString": function() {
					return this.name + ": " + message;
				}
			};
		}

		//Public interface of Task object
		
		return {

			/**
			 * Adds a second to the time spent on this task
			 * 
			 * @return Task This instance
			 */
			"increment": function() {
				timeSpent += 1;
				return this;
			},

			/**
			 * Sets the time spent on this task back to 0 seconds
			 * 
			 * @return Task This instance
			 */
			"reset": function() {
				timeSpent = 0;
				return this;
			},

			/**
			 * Retrieve the time spent on this task so far
			 * 
			 * @return int Time spent in seconds
			 */
			"getTimeSpent": function() {
				return timeSpent;
			},

			/**
			 * Retrieve the name of this task
			 * 
			 * @return string
			 */
			"getName": function() {
				return taskName;
			},

			/**
			 * Updates the name of this task
			 *
			 * @param string newName
			 * @return Task This instance
			 */
			"setName": function(newName) {
				if (typeof newName === 'string') {
					//check length. If exceeded, trim and add "..."
					if (newName.length > MAX_TASK_NAME_LENGTH) {
						taskName = newName.substr(0, MAX_TASK_NAME_LENGTH - 3) + '...';
					} else {
						taskName = newName;
					}
				} else {
					throw new TaskException(
						"setName: type mismatch. newName should be of type string, " 
						+ typeof(newName) + " given."
					);
				}

				return this;
			},

			/**
			 * Marks the task to be removed on the next iteration(increment)
			 * 
			 * @return null
			 */
			"delete": function() {
				flushable = true;
				return null;
			},

			/**
			 * Retrieve whether the task was set to be removed with delete()
			 * 
			 * @return boolean true if delete() has ran
			 */
			"isFlushable": function() {
				return flushable;
			}

		};
	};

	var TaskGroup = function() {

		//Public interface of TaskGroup object
		return {

			/**
			 * Adds a task to this group.
			 * 
			 * Its time spent will be added to the total of this group
			 * Will not add the task if it is already part of this group.
			 * 
			 * @param Task taskObject
			 * @return TaskGroup This instance
			 */
			"addTask": function(taskObject) {

			},

			/**
			 * If the task is found in this group, removes it
			 * 
			 * @param  Task taskObject 
			 * @return TaskGroup This instance
			 */
			"removeTask": function(taskObject) {

			},

			/**
			 * Retrieve the total time spent on all tasks in this group combined
			 * 
			 * @return int Time spent in seconds
			 */
			"getTimeSpent": function() {

			},

			/**
			 * Retrieve the name of this group
			 * 
			 * @return string
			 */
			"getName": function() {

			},

			/**
			 * Updates the name of this Task group
			 * 
			 * @return TaskGroup This instance
			 */
			"setName": function() {

			},

			/**
			 * Marks the group to be removed on the next iteration
			 * 
			 * @return null
			 */
			"delete": function() { 

			},

			/**
			 * Retrieve whether the group was set to be removed with delete()
			 * 
			 * @return boolean true if delete() has ran
			 */
			"isFlushable": function() {

			}

		};
	};

	var TaskTimer = function() {
		
		// Public interface of TaskTimer object
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