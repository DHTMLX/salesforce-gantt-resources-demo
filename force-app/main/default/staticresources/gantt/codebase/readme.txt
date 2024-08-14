DHTMLX Gantt
============

Version 8.0.9, Professional Edition


License
------------

Evaluation License, check license.txt for more details

How to install using npm/yarn
------------

Professional Evaluation version:

- npm config set @dhx:registry https://npm.dhtmlx.com
- npm install @dhx/trial-gantt

Professional version:

Send your license number on the contact@dhtmlx.com email to receive login and password for private npm.

- npm config set @dhx:registry https://npm.dhtmlx.com
- npm login --registry=https://npm.dhtmlx.com --scope=@dhx --auth-type=legacy
- npm install @dhx/gantt

How to start
------------

- check our how-to-start tutorials https://docs.dhtmlx.com/gantt/desktop__howtostart_guides.html
- explore code samples https://docs.dhtmlx.com/gantt/samples/


How to run samples
------------

All the samples except for a few that explicitly require a REST backend api can be opened as static files.

Running the backend:

- `npm install` or `yarn install`
- `npm start` or `yarn start`
- go to `http://localhost:9200`

or

- copy `codebase` and `samples` folders of the package to your Apache/nginx directory and open samples as static html pages. Demos that require RESTful backend will not work in that case.

Package structure
------------

- ./codebase - css and javascript files of the library
- ./samples - code samples
- ./backend - a simple node backend to run samples

Useful links
-------------

- Product information
	https://dhtmlx.com/docs/products/dhtmlxGantt/

- Online documentation
	https://docs.dhtmlx.com/gantt/

- Support forum
	https://forum.dhtmlx.com/c/gantt