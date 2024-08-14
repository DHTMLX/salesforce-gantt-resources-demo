/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { createRecord, updateRecord, deleteRecord } from "lightning/uiRecordApi";

// Static resources
import GanttFiles from "@salesforce/resourceUrl/gantt";

// Controllers
import getTasks from "@salesforce/apex/GanttData.getTasks";

function unwrap(fromSF) {
	const data = fromSF.tasks.map((a) => ({
		id: a.Id,
		text: a.Name,
		start_date: a.Start_Date__c,
		duration: a.Duration__c,
		parent: a.Parent__c,
		progress: a.Progress__c,
		planned_start: a.Planned_start__c,
		planned_end: a.Planned_finish__c,
		type: a.Task_Type__c,
		source_name: a.Source_name__c,
		source_id: a.Source_id__c
	}));
	const links = fromSF.links.map((a) => ({
		id: a.Id,
		source: a.Source__c,
		target: a.Target__c,
		type: a.Type__c
	}));
	const assignments = fromSF.assignments.map((a) => ({
		id: a.Id,
		task_id: a.Task__c,
		resource_id: a.Resource__c,
		value: a.Value__c,
		delay: a.Delay__c,
		duration: a.Duration__c,
		mode: a.Mode__c,
		start_date: a.Start_Date__c,
		end_date: a.End_Date__c
	}));
	const resources = fromSF.resources.map((a) => ({
		id: a.Id,
		text: a.Name
	}));
	return { data, links, resources, assignments };
}

export default class GanttView extends LightningElement {
	static delegatesFocus = true;

	@api height;
	ganttInitialized = false;

	renderedCallback() {
		if (this.ganttInitialized) {
			return;
		}
		this.ganttInitialized = true;

		Promise.all([
			loadScript(this, GanttFiles + "/codebase/dhtmlxgantt.js"),
			loadStyle(this, GanttFiles + "/codebase/dhtmlxgantt.css"),
			loadStyle(this, GanttFiles + "/custom_styles.css")
		])
			.then(() => {
				this.initializeUI();
			})
			.catch((error) => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: "Error loading Gantt",
						message: error.message,
						variant: "error"
					})
				);
			});
	}

	initializeUI() {
		const root = this.template.querySelector(".thegantt");
		root.style.height = this.height + "px";

		//uncomment the following line if you use the Enterprise or Ultimate version
		//const gantt = window.Gantt.getGanttInstance();
		gantt.templates.parse_date = (date) => new Date(date);
		gantt.templates.format_date = (date) => date.toISOString();
		gantt.config.columns = [
			{ name: "text", tree: true, width: 200, resize: true },
			{ name: "start_date", align: "center", width: 80, resize: true },
			{
				name: "owner",
				align: "center",
				width: 75,
				label: "Owner",
				template: function (task) {
					if (task.type === gantt.config.types.project) {
						return "";
					}
					const resources = gantt.getTaskResources(task.id);
					if (!resources.length) {
						return "Unassigned";
					} else if (resources.length === 1) {
						return resources[0].text;
					}
					return resources
						.map(function (resource) {
							return (
								"<div class='owner-label' title='" +
								resource.text +
								"'>" +
								resource.text.substr(0, 1) +
								"</div>"
							);
						})
						.join("");
				},
				resize: true
			},
			{ name: "duration", width: 60, align: "center" },
			{ name: "add", width: 44 }
		];

		gantt.locale.labels.section_resources = "Owners";
		gantt.config.lightbox = {
			sections: [
				{ name: "description", height: 38, map_to: "text", type: "textarea", focus: true },
				{ name: "resources", type: "resources", map_to: "auto", default_value: 8 },
				{ name: "time", type: "duration", map_to: "auto" }
			]
		};

		gantt.config.resource_property = "owner";
		gantt.config.open_tree_initially = true;
		gantt.config.resource_panel = {
			editable_assignments: true,
			assignment_save_mode: "dataProcessor" //"taskProperty"
		};

		gantt.config.resource_panel.lightbox_resources = function selectResourceControlOptions(resources) {
			const lightboxOptions = [];
			resources.forEach(function (res) {
				if (res.$level === 0) {
					let copy = gantt.copy(res);
					copy.key = res.id;
					copy.label = res.text;
					lightboxOptions.push(copy);
				}
			});
			return lightboxOptions;
		};

		gantt.config.layout = {
			css: "gantt_container",
			rows: [
				{
					cols: [
						{ view: "grid", group: "grids", scrollY: "scrollVer" },
						{ resizer: true, width: 1 },
						{ view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
						{ view: "scrollbar", id: "scrollVer", group: "vertical" }
					],
					gravity: 1
				},
				{ resizer: true, width: 1 },
				{
					config: {
						columns: [
							{
								name: "name",
								label: "Name",
								tree: true,
								template: function (resource) {
									return resource.text;
								}
							},
							{
								name: "workload",
								label: "Workload",
								template: function (resource) {
									let totalDuration = 0;
									if (resource.$role === "task") {
										gantt
											.getResourceAssignments(resource.$resource_id, resource.$task_id)
											.forEach(function (a) {
												totalDuration += a.value * a.duration;
											});
									} else {
										gantt.ext.resources
											.getSummaryResourceAssignments(resource.id)
											.forEach(function (assignment) {
												totalDuration += Number(assignment.value) * assignment.duration;
											});
									}
									return (totalDuration || 0) + "h";
								}
							}
						]
					},
					cols: [
						{ view: "resourceGrid", group: "grids", width: 435, scrollY: "resourceVScroll" },
						{ resizer: true, width: 1 },
						{ view: "resourceTimeline", scrollX: "scrollHor", scrollY: "resourceVScroll" },
						{ view: "scrollbar", id: "resourceVScroll", group: "vertical" }
					],
					gravity: 1
				},
				{ view: "scrollbar", id: "scrollHor" }
			]
		};

		gantt.init(root);
		getTasks().then((d) => {
			const chartData = unwrap(d);
			gantt.parse({
				tasks: chartData.data,
				links: chartData.links,
				resources: chartData.resources,
				assignments: chartData.assignments
			});
		});

		///↓↓↓ saving changes back to SF backend ↓↓↓
		gantt.createDataProcessor({
			task: {
				create: (data) => {
					console.log("createTask",data);
					const insert = {
						apiName: "GanttTask__c",
						fields: {
							Name: data.text,
							Start_Date__c: data.start_date,
							Duration__c: data.duration,
							Parent__c: String(data.parent),
							Progress__c: data.progress
						}
					};
					gantt.config.readonly = true; // suppress changes until saving is complete
					return createRecord(insert).then((res) => {
						gantt.config.readonly = false;
						return { tid: res.id, ...res };
					});
				},
				update: (data, id) => {
					console.log("updateTask",data);
					const update = {
						fields: {
							Id: id,
							Name: data.text,
							Start_Date__c: data.start_date,
							Duration__c: data.duration,
							Parent__c: String(data.parent),
							Progress__c: data.progress
						}
					};
					return updateRecord(update).then(() => ({}));
				},
				delete: (id) => {
					return deleteRecord(id).then(() => ({}));
				}
			},
			link: {
				create: (data) => {
					const insert = {
						apiName: "GanttLink__c",
						fields: {
							Source__c: data.source,
							Target__c: data.target,
							Type__c: data.type
						}
					};
					return createRecord(insert).then((res) => {
						return { tid: res.id };
					});
				},
				update: (data, id) => {
					const update = {
						apiName: "GanttLink__c",
						fields: {
							Id: id,
							Source__c: data.source,
							Target__c: data.target,
							Type__c: data.type
						}
					};
					return updateRecord(update).then(() => ({}));
				},
				delete: (id) => {
					return deleteRecord(id).then(() => ({}));
				}
			},
			assignment: {
				create: (data) => {
					const insert = {
						apiName: "GanttResourceAssignment__c",
						fields: {
							Delay__c: data.delay,
							Duration__c: data.duration,
							Value__c: data.value,
							Resource__c: data.resource_id,
							End_Date__c: data.end_date,
							Start_Date__c: data.start_date,
							Mode__c: data.mode,
							Task__c: data.task_id
						}
					};
					return createRecord(insert).then((res) => {
						return { tid: res.id };
					});
				},
				update: (data, id) => {
					const update = {
						fields: {
							Id: id,
							Delay__c: data.delay,
							Duration__c: data.duration,
							Value__c: data.value,
							Resource__c: data.resource_id,
							End_Date__c: data.end_date,
							Start_Date__c: data.start_date,
							Mode__c: data.mode,
							Task__c: data.task_id
						}
					};
					return updateRecord(update).then(() => ({}));
				},
				delete: (id) => {
					return deleteRecord(id).then(() => ({}));
				}
			}
		});
	}
}
