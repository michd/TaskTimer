TaskTimer
=========

TaskTimer is a little tool that helps you keep track of how much time you've spent on various tasks. It's really simple, designed to do just that.

[View the live demo](http://tasktimer.tapo.me)

Current state
-------------

Currently, the interface lets you:

* Add new tasks
* Name and rename tasks
* Start/pause/resume the timer
* Select which task is active
* Delete tasks

Upon exploring the code however, you'll find there are also provisions for groups of tasks, enabling you to see an overview of time spent on a selection of your tasks. This still needs figuring out to implement it in the interface.

When you close the page, it will **lose all data** as no saving is in place yet.

The design is pretty rudimentary at the moment, but that can also be worked on when more functionality is in place.

Planned features
----------------

* Total timer which keeps counting even if there is no active task, above the table
* Task groups on the interface
* Use localStorage to store the data for later use

Vague future ideas
------------------

* Keep track of when which tasks where running, use this data to generate a diagram of task distribution over time using `<canvas>`
* Use `<canvas>` for displaying time spent distribution

