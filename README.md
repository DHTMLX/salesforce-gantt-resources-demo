# Gantt with Resource Management for SalesForce

[![dhtmlx.com](https://img.shields.io/badge/made%20by-DHTMLX-blue)](https://dhtmlx.com/)

This repository contains a code example of a Gantt chart with a resource panel implemented in Lightning Web Components (LWC) on the Salesforce platform.

The component manages four Salesforce objects: Task, Link, Resource, and ResourceAssignment. It features an editable Gantt chart that not only schedules tasks but also visualizes resource allocation effectively.

The sample is implemented with the help of JavaScript Gantt chart library - [DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/).

[![salesforce-demo](https://dhtmlx.com/docs/products/demoApps/salesforce-gantt-chart/imgs/salesforce-gantt-chart.png)](https://dhtmlx.com/docs/products/demoApps/salesforce-gantt-chart/)

## Prerequisites

- Enable the [Developer Hub](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_enable_devhub.htm) in your organization
- Install the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)

## How to start

- [Change login url](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_web_flow.htm) (sfdcLoginUrl) in sfdx-project.json to url of your SalesForce organization

- Create [scratch org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_scratch_orgs.htm#!)

```sh
sfdx org login web -d
sfdx org create scratch -f project-scratch-def.json -d
```

- Publish code

```sh
sfdx project deploy start
sfdx data import tree  -f ./data/GanttTask__c.json
sfdx data import tree  -f ./data/GanttResource__c.json
```

- Open scratch org in browser

```
sfdx org open
```

The scratch org already has Gantt app which you can check, or go to "Setup : Lighting Apps", create a new Lighting App and drop the Gantt from the list of available components.

## How to configure / modify

### Backend

getTasks in force-app/main/default/classes/GanttData.cls returns list of tasks and links, adjust this query as necessary.

### Frontend

force-app/main/default/lwc/gantt/gantt.js contains code of web component

```js
function unwrap(fromSF){
    const data = fromSF.tasks.map(a => ({
```

**unwrap** functions controls how data from SalesForce is converted to Gantt compatible objects. You will need to modify this code if you will want to provide some additional data properties from SalesForce to the Gantt

```js
initializeUI(){
        const root = this.template.querySelector('.thegantt');
        root.style.height = this.height + "px";

        const gantt = window.Gantt.getGanttInstance();
```

**initializeUI** creates an instance of gantt. This is the perfect place to configure gantt by using its [API](https://docs.dhtmlx.com/gantt)


```js
gantt.createDataProcessor({
            task: {
```

**createDataProcessor** defines data saving rules, they need to be adjusted if you will want to save some extra fields along with the default Task's data.

### Version of the Gantt


`force-app/main/default/staticresources/gantt/` contains a trial version of the Gantt which comes under the Evaluation license of DHTMLX Gantt. The Gantt chart will show a warning message about a 30-day trial period from time to time. For production usage, you will need to replace the js and css files in this archive with the ones from the DHTMLX Gantt package under the Enterprise or Ultimate licenses.

## Related resources

- Documentation: [https://docs.dhtmlx.com/gantt/](https://docs.dhtmlx.com/gantt/)
- DHTMLX Gantt product page: [https://dhtmlx.com/docs/products/dhtmlxGantt/](https://dhtmlx.com/docs/products/dhtmlxGantt/)
- Video tutorial: [https://www.youtube.com/watch?v=cCvULTQxPfg&ab_channel=dhtmlx](https://www.youtube.com/watch?v=cCvULTQxPfg&ab_channel=dhtmlx)
- About DHTMLX Gantt in Salesforce: [https://dhtmlx.com/docs/products/demoApps/salesforce-gantt-chart/](https://dhtmlx.com/docs/products/demoApps/salesforce-gantt-chart/)
- Basic demo of DHTMLX Gantt for SalesForce LWC: [https://github.com/DHTMLX/salesforce-gantt-demo](https://github.com/DHTMLX/salesforce-gantt-demo)

## Support Us

Star our GitHub repo :star:

Check our [roadmap](https://trello.com/b/fhOySHPj/gantt-roadmap) for future updates :wrench:

Read us on [Medium](https://medium.com/@dhtmlx) :newspaper:

Follow us on [Twitter](https://twitter.com/dhtmlx) :bird:

Like our page on [Facebook](https://www.facebook.com/dhtmlx/) :thumbsup:
