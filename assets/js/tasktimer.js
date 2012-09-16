(function ($) {
	var global = (function(){ return this; })(); 

	//Helper functions

	/**
	 * Confirms whether taskObject has all the interface methods required 
	 * 
	 * @param  Object taskObject Supposed Task instance to be checked
	 * @return {Boolean}
	 */
	var isTask = function (taskObject) {
		var i;

		if (typeof taskObject === "object" && taskObject !== null) {
			var requiredTaskMethods = [
				"increment",
				"reset",
				"getTimeSpent",
				"getName",
				"getId",
				"setName",
				"delete",
				"isFlushable"
			];
			for (i = 0; i < requiredTaskMethods.length; i += 1) {
				if ( ! taskObject.hasOwnProperty(requiredTaskMethods[i])) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	};

	var Task = function (uniqueId) {

		//Private constants
		var MAX_TASK_NAME_LENGTH = 100;

		//Private properties
		
		/**
		 * Unique identifier for the task, set at creation time
		 * @type String
		 */
		var id = "";

		/**
		 * Time spent on this task so far, in seconds 
		 * @type Number
		 */
		var timeSpent = 0;

		/**
		 * Name/label for this task, to identify it to the user
		 * @type String
		 */
		var taskName = "";

		/**
		 * Flag to set to true when public method delete() is ran
		 * Marks that the task is to be deleted from outside lists
		 * @type Boolean
		 */
		var flushable = false;

		/**
		 * If anything goes wrong within a Task object, this can be thrown.
		 * 
		 * @param string message Descriptive error message
		 */
		var TaskException = function (message) {
			return {
				"name": "TaskException",
				"message": message,
				"toString": function() {
					return this.name + ": " + this.message;
				}
			};
		};

		if (typeof uniqueId !== 'object' && typeof uniqueId !== 'undefined') {
			if (typeof uniqueId.toString === 'function') {
				id = uniqueId.toString();
			} else {
				throw new TaskException(
					"Constructor: uniqueId is not stringifyable."
				);
			}
		} else {
			throw new TaskException(
				"Constructor: uniqueId is not stringifyable, is " + typeof uniqueId
			);
		}

		//Public interface of Task object
		
		return {

			/**
			 * Adds a second to the time spent on this task
			 * 
			 * @return Task This instance
			 */
			"increment": function () {
				timeSpent += 1;
				return this;
			},

			/**
			 * Sets the time spent on this task back to 0 seconds
			 * 
			 * @return Task This instance
			 */
			"reset": function () {
				timeSpent = 0;
				return this;
			},

			/**
			 * Retrieve the time spent on this task so far
			 * 
			 * @return int Time spent in seconds
			 */
			"getTimeSpent": function () {
				return timeSpent;
			},

			/**
			 * Retrieve the name of this task
			 * 
			 * @return string
			 */
			"getName": function () {
				return taskName;
			},

			/**
			 * Retrieve the unique identifier for this task
			 * @return string [description]
			 */
			"getId": function () {
				return id;
			},

			/**
			 * Updates the name of this task
			 *
			 * @param string newName
			 * @return Task This instance
			 */
			"setName": function (newName) {
				if (typeof newName === 'string') {
					//check length. If exceeded, trim and add "..."
					if (newName.length > MAX_TASK_NAME_LENGTH) {
						taskName = newName.substr(0, MAX_TASK_NAME_LENGTH - 3) 
							+ '...';
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
			"delete": function () {
				flushable = true;
				return null;
			},

			/**
			 * Retrieve whether the task was set to be removed with delete()
			 * 
			 * @return boolean true if delete() has ran
			 */
			"isFlushable": function () {
				return flushable;
			}

		};
	};

	var TaskGroup = function () {

		//Private constants
		var MAX_GROUP_NAME_LENGTH = 50;

		//Private properties
		
		/**
		 * Unique identifier for the task group, set at creation time
		 * @type String
		 */
		var id = "";
		
		/**
		 * Holds the list of Task instances that are part of the group
		 * @type Array Task instances
		 */
		var tasks = [ ];

		/**
		 * Name/label of this Task group, to identify it to the user
		 * @type String
		 */
		var groupName = '';

		/**
		 * Flag to set to true when public method delete() is ran	
		 * Marks that the task group is to be deleted from interface and whatnot
		 * @type Boolean
		 */
		var flushable = false;

		/**
		 * If anything goes wrong within a TaskGroup object, this can be thrown.
		 * 
		 * @param string message Descriptive error message
		 */
		var TaskGroupException = function (message) {
			return {
				"name": "TaskGroupException",
				"message": message,
				"toString": function() {
					return this.name + ": " + this.message;
				}
			};
		}
		

		/**
		 * Confirms this group houses the given taskObject
		 * 
		 * @param  Task Task object to look for
		 * @return Boolean True if found in the group
		 */
		var hasTask = function (taskObject) {
			var i;

			for (i = 0; i < tasks.length; i += 1) {
				if (tasks[i] == taskObject) {
					return true;
				}
			}
			return false;
		}

		//Set the ID
		if (typeof uniqueId !== 'object' && typeof uniqueId !== 'undefined') {
			if (typeof uniqueId.toString === 'function') {
				id = uniqueId.toString();
			} else {
				throw new TaskGroupException(
					"Constructor: uniqueId is not stringifyable."
				);
			}
		} else {
			throw new TaskGroupException(
				"Constructor: uniqueId is not stringifyable, is " + typeof uniqueId
			);
		}


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
			"addTask": function (taskObject) {
				if (isTask(taskObject)) {
					if ( ! hasTask(taskObject)) {
						tasks.push(taskObject);
					}					
				} else {
					throw new TaskGroupException(
						"addTask: taskObject does not have a valid Task interface."
					);
				}

				return this;			
			},

			/**
			 * If the task is found in this group, removes it
			 * 
			 * @param  Task taskObject 
			 * @return TaskGroup This instance
			 */
			"removeTask": function (taskObject) {
				var i;

				for (i = 0; i < tasks.length; i += 1) {
					if(tasks[i] == taskObject) { //task located
						tasks.splice(i, 1); //remove from array
						break; //terminate looping through tasks
					}
				}

				return this;
			},

			/**
			 * Retrieve the total time spent on all tasks in this group combined
			 * 
			 * @return int Time spent in seconds
			 */
			"getTimeSpent": function () {
				var i;
				var timeSpent = 0;

				for (i = 0; i < tasks.length; i += 1) {
					timeSpent +=  tasks[i].getTimeSpent();
				}

				return timeSpent;
			},

			/**
			 * Retrieve the name of this group
			 * 
			 * @return string
			 */
			"getName": function () {
				return groupName;
			},

			/**
			 * Updates the name of this Task group
			 *
			 * @param String newName
			 * @return TaskGroup This instance
			 */
			"setName": function (newName) {
				if (typeof newName === 'string') {
					//check length. If exceeded, trim and add "..."
					if (newName.length > MAX_GROUP_NAME_LENGTH) {
						groupName = newName.substr(0, MAX_GROUP_NAME_LENGTH - 3) 
							+ '...';
					} else {
						groupName = newName;
					}
				} else {
					throw new TaskGroupException(
						"setName: type mismatch. newName should be of type string, " 
						+ typeof(newName) + " given."
					);
				}

				return this;
			},

			/**
			 * Iterates over the tasks in the group and removes the flushables
			 * @return TaskGroup This instance
			 */
			"flushDeletedTasks": function () {
				var i;
				var tasksToRemove = [];

				for (i = 0; i < tasks.length; i += 1) {
					if (tasks[i].isFlushable()) {
						tasksToRemove.push(tasks[i]);
					}
				}
				//Doing this in two loops because removing them while in the above
				//for loop would cause it to break (array length would break)
				for (i = 0; i < tasksToRemove.length; i += 1) {
					this.removeTask(tasksToRemove[i]);
				}

				return this;
			},

			/**
			 * Marks the group to be removed on the next iteration
			 * 
			 * @return null
			 */
			"delete": function () { 
				flushable = true;
			},

			/**
			 * Retrieve whether the group was set to be removed with delete()
			 * 
			 * @return boolean true if delete() has ran
			 */
			"isFlushable": function () {
				return flushable;
			}

		};
	};

	var TaskTimer = function () {

		//Private properties
		
		/**
		 * Dictionary to quickly look up tasks based on their id string
		 * @type Object
		 */
		var taskIndex = { };

		/**
		 * Disctionary to quickly look up task groups based on their id string
		 * @type Object
		 */
		var taskGroupIndex = { };

		/**
		 * Used to make sure tasks get a unique identifier
		 * @type Number
		 */
		var uniqueTaskCounter = 0;

		/**
		 * Used to make sure task groups get a unique identifier
		 * @type Number
		 */
		var uniqueTaskGroupCounter = 0;

		/**
		 * Task the user is currently working on, to be incemented every second
		 * @type Task
		 */
		var activeTask = null;

		/**
		 * Variable to which the interval timer is to be assigned
		 * @type Number
		 */
		var timer = 0;

		/**
		 * [timerRunning description]
		 * @type {Boolean}
		 */
		var timerRunning = false;

		

		var TaskTimerException = function (message) {
			return {
				"name": "TaskTimerException",
				"message": message,
				"toString": function() {
					return this.name + ": " + this.message;
				}
			};
		};

		/**
		 * Iterates over all Tasks and removes those that are flushable
		 *
		 * Also iterates over groups and commands the groups to flush flushable
		 * tasks from there. 
		 *
		 * The main goal of this function is removing any exisint reference to
		 * tasks that have been deleted, so the environment can garbage-collect 
		 * them.
		 * 
		 * @return null
		 */
		var flushDeletedTasks = function () {
			var index;

			//Flush them from the main task index
			for (index in taskIndex) {
				if (taskIndex.hasOwnProperty(index)) { 
					//only check actual Task objects
					if (taskIndex[index].isFlushable()) {
						delete taskIndex[index];
					}
				}
			}

			//Flush them from the existing groups
			for (index in taskGroupIndex) {
				if (taskGroupIndex.hasOwnProperty(index)) {
					taskGroupIndex[index].flushDeletedTasks();
				}
			}

			//check activeTask for flushableness
			if (isTask(activeTask) && activeTask.isFlushable()) {
				activeTask = null;
			}

			return null;
		};

		/**
		 * Iterates over all TaskGroups and removes those that are flushable.
		 *
		 * The main goal of this function is removing any reference to deleted
		 * task groups, so the environment can garbage collect them.
		 * 
		 * @return null
		 */
		var flushDeletedTaskGroups = function () {
			var index;

			for (index in taskGroupIndex) {
				if (taskGroupIndex.hasOwnProperty(index)) {
					if (taskGroupIndex[index].isFlushable()) {
						delete taskGroupIndex[index];
					}
				}
			}

			return null;
		};

		/**
		 * Flushes deleted tasks, deleted groups and increments the active task
		 * 
		 * @return null
		 */
		var iteration = function () {
			flushDeletedTasks();
			flushDeletedTaskGroups();

			if (isTask(activeTask)) {
				activeTask.increment();
			}
		};

		var initiateInterval = function () {
			//ensure stopping a running timer to avoid duplicate timers
			clearInterval(timer);

			timer = global.setInterval(iteration, 1000);
			timerRunning = true;
		}

		var stopInterval = function () {
			global.clearInterval(timer);
			timerRunning = false;
		};
		
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
			"getTaskById": function (taskId) {
				if (typeof taskId === 'string') {
					if (typeof taskIndex[taskId] !== 'undefined') {
						return taskIndex[taskId];
					} 
				} else {
					throw new TaskTimerException(
						"getTaskById: type mismatch. taskId should be of type string, "
						+ typeof(taskId) + " given."
					);
				}
				return null;
			},

			/**
			 * Creates a new task object and returns it. 
			 * 
			 * The task object will be nameless and unactivated.
			 * 
			 * @return Task new empty task Object
			 */
			"createTask": function () {
				var taskIdentifier = "task_" + (++uniqueTaskCounter).toString();
				var newTask = new Task(taskIdentifier);
				
				taskIndex[taskIdentifier] = newTask;
				return newTask;
			},

			/**
			 * Sets the given task object as the active task.
			 
			 * This will add time to it every second.
			 * 
			 * @param  Task taskObject
			 * @return null
			 */
			"activateTask": function (taskObject) {
				if (isTask(taskObject)) {
					activeTask = taskObject;
				} else {
					throw new TaskTimerException(
						"activateTask: taskObject does not have a valid Task interface"
					);
				}

				return null;
			},

			/**
			 * Adds up the time spent on all available tasks
			 * 
			 * @return int Time in seconds
			 */
			"getTotalTimeSpent": function () {
				var totalTime = 0, index;

				for (index in taskIndex) {
					if (taskIndex.hasOwnProperty(index)) { //only get actual tasks
						totalTime += taskIndex[index].getTimeSpent();
					}
				}

				return totalTime;
			},

			/**
			 * Creates a new TaskGroup. 
			 * 
			 * @return Taskgroup New nameless, empty TaskGroup object
			 */
			"createGroup": function () {
				var groupIdentifier = "group_" 
					+ (++uniqueTaskGroupCounter).toString();
				var newTaskGroup = new TaskGroup(groupIdentifier);

				taskGroupIndex[groupIdentifier] = newTaskGroup;
				return newTaskGroup;
			},

			/**
			 * Starts the timer, adding time to the activated task
			 * 
			 * @return null
			 */
			"startTimer": function () {
				initiateInterval();
				return null;
			},

			/**
			 * Alias for startTimer
			 * 
			 * @return null
			 */
			"resumeTimer": function () {
				initiateInterval();
				return null;
			},

			/**
			 * Pauses the timer, not adding any time to any tasks.
			 * 
			 * @return null
			 */
			"pauseTimer": function () {
				stopInterval();
				return null;
			},

			/**
			 * Retrieves whether or not the timer is currently running
			 * 
			 * @return Boolean True if the interval is on, false otherwise
			 */
			"isRunning": function () {
				return timerRunning;
			}

		};
	};


	var TaskTimerInterface = function ($container) {
		
		//Set up a TaskTimer object
		var taskTimer = new TaskTimer();
		
		//initalise some HTML elements	
		var $newTaskButton = $('<button>').html('New task')
		.click(function (event) {
			event.preventDefault();
			createTask();
		});

		var $toggleTimerButton = $('<button>').html('Start timer')
		.click(function(event) {
			event.preventDefault();

			if (taskTimer.isRunning()) {
				taskTimer.pauseTimer();
				$(this).html('Resume timer');
			} else {
				taskTimer.resumeTimer();
				$(this).html('Pause timer');
			}
		});

		var $taskList = $('<table>').append(
			$('<thead>').append(
				$('<tr>').append(
					$('<th>', {"class": "active-column"}).html('Active'),
					$('<th>').html('Task name'),
					$('<th>', {"class": "timespent-column"}).html('Time spent'),
					$('<th>', {"class": "delete-column"}).html('Delete?')
				)
			),
			$('<tbody>'),
			$('<tfoot>').append(
				$('<tr>').append(
					$('<td>', {"colspan": 2}).html('Total time spent'),
					$('<td>', {"class": "timespent-column"}).html('0s'),
					$('<td>').html('')
				)
			)
		);

		//Clicking labels turns them into an editor
		$($taskList).on("click", "td label", function (event) {
			$td = $(this).closest('td');
			$(this).replaceWith(
				$('<input>', {
					"type": "text",
					"placeholder": "Add task name",
					"value": $(this).html()
				})
			);
			$td.find('input').focus();
		});

		//Hitting enter in task name edit fields saves them and turns to label
		$($taskList).on("keydown", "td input[type=text]", function (event) {			
			if (event.which === 13) {
				var task = taskTimer.getTaskById(
					$(this).closest('tr').attr('id')
				);									
				task.setName($(this).val());
				$(this).replaceWith($('<label>').html($(this).val()));
			}
		})
		.on("blur", "td input[type=text]", function (event) { 
			//So does losing focus from the field
			var task = taskTimer.getTaskById(
				$(this).closest('tr').attr('id')
			);									
			task.setName($(this).val());
			$(this).replaceWith($('<label>').html($(this).val()));
		})
		.on("focus", "td input[type=text]", function (event) {
			this.select();
		})

		
		

		//add them to the $container
		$container.append(
			$('<menu>').append($newTaskButton, $toggleTimerButton),
			$taskList
		);

		//start updateInterval
		setInterval(updateInterface, 500);

		//Set up a new task
		function createTask () {
			var newTask = taskTimer.createTask();
			
			$taskList.find('tbody').append(
				$('<tr>', {"id": newTask.getId()}).append(
					
					$('<td>', {"class": "active-column"}).html(
						$('<input>', {"type": "radio", "name": "taskselect"})
						.click(function () {
							taskTimer.activateTask(
								taskTimer.getTaskById($(this).closest('tr').attr('id'))
							);
						})
					),

					$('<td>').html(
						$('<input>', {
							"type": "text", 
							"placeholder": "Add task name",
							"value": newTask.getId()
						})
					),

					$('<td>', {"class": "timespent-column"}).html('0s'),

					$('<td>', {"class": "delete-column"}).html(
						$('<button>').html('Delete')
						.click(function (event) {
							var task = taskTimer.getTaskById(
								$(this).closest('tr').attr('id')
							);

							event.preventDefault();							

							if (confirm(
								"Are you sure you want to delete the task named '" 
								+ task.getName() + "'? You cannot undo this."
							)) {
								task.delete();
								$(this).closest('tr').remove();
							}
						})
					)
				)
			).find('tr').last().find('input[type=text]').focus();
		}


		function updateInterface () {
			$taskList.find('tbody tr').removeClass('active');
			$taskList.find('tbody tr input[type=radio]:checked').closest('tr')
				.addClass('active');
			
			//update individual time
			$taskList.find('tbody tr').each(function (index, elem) {
				var task = taskTimer.getTaskById($(elem).attr('id'));

				$('.timespent-column', elem).html(styleTime(task.getTimeSpent())); //format better

			});

			//update total time
			$taskList.find('tfoot td.timespent-column').html(
				styleTime(taskTimer.getTotalTimeSpent())
			);
		}

		function styleTime (rawTime) {
			var divisions = [
				{"name": "days", "seconds": 86400, "denoter": "d"},
				{"name": "hours", "seconds": 3600, "denoter": "h"},
				{"name": "minutes", "seconds": 60, "denoter": "m"},
				{"name": "seconds", "seconds": 1, "denoter": "s"}
			];
			var styledTime = [];
			var i;
			var curDiv = 0;

			for (i = 0; i < divisions.length; i += 1) {
				curDiv = Math.floor(rawTime / divisions[i].seconds);
				if (curDiv > 0) {
					styledTime.push(curDiv.toString() + divisions[i].denoter);
				}
				rawTime %= divisions[i].seconds;
			}

			if (styledTime.length === 0) {
				styledTime.push("0" + divisions[i-1].denoter);
			}

			return styledTime.join(' ');			
		}

	};

	

	$(function() {
		TaskTimerInterface($('#container'));
	});



})(jQuery);