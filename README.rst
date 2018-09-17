=============
HA - Hardware
=============

HA - Hardware is an extension to HackAssistant that enables the backend to handle a Hardware Lab for your hackathon.

Features:

* **Hacker view**: Hackers can browse the list of hardware available and *Request* an item.

* **Admin view**: An admin view to formalize the hacker's *Requests* into *Lendings*.

* **Logs**: Keep track of every piece of hardware, who have had it and who has it right now.

* **Intuitive and self-explanatory basic interface**: UI broken down in steps. Users will know what to do in both ends of the app.

Quick Start
-----------

1. Install the plugin::

	pip install django-ha-hadrware-0.1.tar.gz
	
2. Enable it by changing the corresponding variable in `hackathon_variables.py`::

	HARDWARE_ENABLED = True
	
3. Migrate the database to create the new models::

	python manage.py migrate
	
That's it! Now you can add items in the 'hardware' section of the admin.
