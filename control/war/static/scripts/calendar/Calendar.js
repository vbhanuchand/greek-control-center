define(
		[ 'dojo/_base/declare',
		  "dojo/_base/lang", 
		  "dojo/_base/array", 
		  "dojo/_base/fx",
		  'dojo/_base/event',
		  'dojo/_base/Deferred',
		  "dojo/on", 
		  "dojo/date/locale",
		  'dojo/date/stamp',
		  'dojo/text!./templates/Calendar.html',
		  "dojo/dom",
		  "dojo/dom-construct", 
		  "dojo/store/Memory",
		  "dojo/store/Observable",
		  'dojo/store/JsonRest',
		  'dojo/has',
		  'dojo/mouse',
		  
		  'dijit/_TemplatedMixin',
		  'dijit/_WidgetsInTemplateMixin',
		  'dijit/layout/BorderContainer',
		  'dijit/focus',
		  
		  "./ExtendedCalendar",
		  "./DatePicker",
		  "dijit/popup",
		  "dijit/registry",
		  "dijit/TitlePane",
		  "dijit/TooltipDialog",
		  "dijit/layout/BorderContainer", 
		  "dijit/layout/ContentPane",
		  "dijit/form/CheckBox", 
		  "dijit/form/TextBox",
		  "dijit/form/DateTextBox", 
		  "dijit/form/TimeTextBox",
		  "dijit/form/Button", 
		  "dijit/form/ComboBox", 
		  "dijit/Menu",
		  "dijit/MenuItem" ],

		function(declare, lang, arr, fx, dojoEvent, Deferred, on, locale, dojoStamp, template, dom, domConstruct, Memory, Observable, JsonRestStore, has, mouse, 
				TemplatedMixin, WidgetsInTemplateMixin, BorderContainer, focusUtil, ExtendedCalendar, DatePicker, Popup, registry) {
			
			return declare('widgets.Calendar', [BorderContainer, TemplatedMixin, WidgetsInTemplateMixin], {
				'templateString': template,
		        'class': 'application',
		        'design': 'sidebar',
		        'gutters': true,
		        'liveSplitters': true,
		        'baseClass': 'widgets.Calendar',
		        calendar: null,
		        dateChooser: null,
		        
		        /* Define the Stores here !!! */
		        calendarMasterStore: new JsonRestStore({
		        	target: '/service/meetings/',
					idProperty: 'id',
					sortParam: 'sort'
				}),
		        
		        constructor: function(options) {
		            declare.safeMixin(this, options);
		            console.log(this.baseClass + ' constructor() called !!!');
		        },

		        buildRendering: function() {
		            this.inherited(arguments);
		            this.buildCalendar();
		            this.buildDatePicker();
		            console.log(this.baseClass + ' buildRendering() called !!!');
		        },

		        postCreate: function(){
		        	var _this = this;
		            this.inherited(arguments);
		            this.calendar.addCalendarEntryDialog.resize();
		            Popup.moveOffScreen(_this.calendarAddEditEntryDialog);
		            _this.own(on(dom.byId(_this.calendar.id), (!has("mozilla") ? "mousewheel" : "DOMMouseScroll"), function(e){
		            	var scroll = e[(!has("mozilla") ? "wheelDelta" : "detail")] * (!has("mozilla") ? 1 : -1);
		            	_this.calendar.set("selectedItem", null);
		            	Popup.close(_this.calendarAddEditEntryDialog);
		            }));
		            this.calendar.addCalendarEntryDialog.resize();
		            console.log('Calendar Object --> ', _this.calendar);
		            console.log(this.baseClass + ' postCreate() called !!!');
		        },

		        startup: function() {
		        	var _this = this;
		            this.inherited(arguments);
		            this.calendarAddEditEntryDialog.startup();
		            this.calendar.startup();
		            this.dateChooser.startup();
		            this.calendar.addCalendarEntryDialog.startup();
		            console.log(this.baseClass + ' startup() called !!!');
		        },
		        
		        destroy: function(){
		        	this.inherited(arguments);
		        	console.log(this.baseClass + ' Destroyed');
		        },
		        
		        destroyRecursive: function(){
		        	this.inherited(arguments);
		        	console.log(this.baseClass + ' Destroyed Recursively');
		        },
		        
		        buildCalendar: function(){
		        	this.calendar = new ExtendedCalendar();
		        	this.calendar.placeAt(this.calendarPoint, 'only');
		        },
		        
		        buildDatePicker: function(){
		        	this.dateChooser = new DatePicker({'datePackage': ''});
		        	this.dateChooser.placeAt(this.dateChooserPoint, 'only');
		        },
		        
		        initHints: function(){
		        	var _this = this;
		        	var hints = [
		 						"Hint: Create an event by clicking and dragging on the grid while maintaining the control key",
		 						"Hint: Drill down the view by clicking row or column header cells",
		 						"Hint: Drill down the view by double-clicking a grid cell while maintaining the shift and control key",
		 						"Hint: Drill up by double-clicking the grid while maintaining the shift key",
		 						"Hint: Move an event by clicking on it and dragging it",
		 						"Hint: Resize an event by clicking on one of its ends and dragging it" 
		 						];
		        	var hintIdx = 0;
		        	_this.hint.innerHTML = hints[0];
		        	setInterval(function() {
		        		fx.fadeOut({ node : _this.hint,
		        			onEnd : function() {
		        				hintIdx = hintIdx + 1 > hints.length - 1 ? 0 : hintIdx + 1;
		        				_this.hint.innerHTML = hints[hintIdx];
		        				fx.fadeIn({ node : _this.hint }).play(500);
		        			}}).play(500);
		        	}, 5000);
		        },
		        
		        customizeCalendar: function(){
		        	var _this = this;
		        	var editedItem;
		        	var selectionChanged = function(evt, item) {
		        		Popup.close(_this.calendarAddEditEntryDialog);
						var itemNull = item == null;
						var widgetsInPopup = [ _this.itemSummaryEditor, _this.itemStartDateEditor, _this.itemStartTimeEditor, _this.itemEndDateEditor, 
						                _this.itemEndTimeEditor, _this.itemAgendaEditor, _this.itemEmailEditor, _this.itemEmailTextEditor, _this.deleteItemButton, _this.closeItemButton, _this.updateItemButton ];

						arr.forEach(widgetsInPopup, function(w) { w.set("disabled", itemNull); w.set("value", null, false); });
						editedItem = itemNull ? null : lang.mixin({}, item);

						if(!itemNull) {
							var allDay = item.allDay === true;
							_this.itemStartTimeEditor.set("disabled", allDay);
							_this.itemEndTimeEditor.set("disabled", allDay);
							_this.itemSummaryEditor.set("value", item.summary);
							_this.itemAgendaEditor.set("value", item.agenda);
							_this.itemEmailEditor.set("checked", item.email);
							_this.itemEmailTextEditor.set("value", item.emailText);
							_this.itemStartDateEditor.set("value", item.fromTime);
							_this.itemStartTimeEditor.set("value", item.fromTime);
							_this.itemEndDateEditor.set("value", item.toTime);
							_this.itemEndTimeEditor.set("value", item.toTime);
						}
						
						if((!itemNull && (typeof evt.triggerEvent != typeof undefined) && ((typeof evt.triggerEvent.button != typeof undefined) && (evt.triggerEvent.button === 0)) 
								&& (evt.renderer != null)) || (evt.completed)){
							
							if(evt.hasOwnProperty('renderer')){
								_this.lastKnownPopupPosition = evt.renderer.domNode;
							} else {
								_this.lastKnownPopupPosition = evt.source.itemToRenderer[item.id][0]['container'];
							}
							
							var orientation = ["above-alt", "below-alt"/*, "after-centered", "before-centered"*/];
							Popup.open({ parent: _this.calendar, 
								popup: _this.calendarAddEditEntryDialog, around: _this.lastKnownPopupPosition, 
								onExecute: function(){
									_this.calendar.set("selectedItem", null);
									Popup.close(_this.calendarAddEditEntryDialog);
								},
								onCancel: function(){
									_this.calendar.set("selectedItem", null);
									Popup.close(_this.calendarAddEditEntryDialog);
								},
								onClose: function(){
									var storeItems = _this.calendar.store.query({id: item.id});
									if(storeItems.length > 0){
										if((_this.calendar.get("selectedItem") == null) && storeItems[0].hasOwnProperty('newlyCreated') && (storeItems[0].newlyCreated === true)){
											_this.calendar.store.remove(item.id);
										}
									}
									/*var allStoreItems = _this.calendar.store.data;
									var selectedItem = _this.calendar.get('selectedItem');
									if(allStoreItems.length > 0){
										arr.forEach(allStoreItems, function(eachItem){
											if(((selectedItem!= null) && (selectedItem.id !== eachItem.id)) || (eachItem.hasOwnProperty('newlyCreated') && (eachItem.newlyCreated === true)))
												_this.calendar.store.remove(eachItem.id);
										});
									}*/
								}
							});
						}
					};
		        	
		        	_this.calendar.set('allDayAttr ', 'allDay');
		    		_this.calendar.set('startTimeAttr', 'fromTime');
		    		_this.calendar.set('endTimeAttr', 'toTime');
		    		_this.calendar.set('summaryAttr', 'summary');
		        	
		        	_this.calendar.columnView.set('columnHeaderDatePattern', 'MMM dd (EEEE)');
		        	_this.calendar.columnView.set('minHours', 0);
		        	_this.calendar.columnView.set('maxHours', 24);
		        	_this.calendar.columnView.set('timeSlotDuration', 30);
		        	_this.calendar.columnView.set('horizontalGap', 2);
		        	_this.calendar.columnView.set('percentOverlap', 70);
		        	_this.calendar.columnView.set('hourSize', 50);
		        	
		        	_this.calendar.set('selectionMode ', 'single');
		        	_this.calendar.set('moveEnabled', true);
		        	_this.calendar.set('resizeEnabled', true);
		        	
		        	_this.calendar.set('animateRange', true);
		        	_this.calendar.set('animationRangeDuration', 500);
		        	
		        	_this.calendar.set("cssClassFunc", function(item) {
						return "Calendar1";
					});
		        	
		        	var startOfWeek = _this.calendar.floorToWeek(new _this.calendar.dateClassObj());
		        	_this.calendar.set("date", startOfWeek);
		        	
		        	_this.calendar.on("itemContextMenu", function(e) {
						dojoEvent.stop(e.triggerEvent);
						_this.calendarContextMenu._openMyself({
							target : e.renderer.domNode,
							coords : {
								x : e.triggerEvent.pageX,
								y : e.triggerEvent.pageY
							}
						});
					});
					
					_this.contextMenuDelete.on("click", function() {
						arr.forEach(_this.calendar.selectedItems, function(item) {
							_this.calendar.store.remove(item.id);
						});
					});
		        	
		        	
					//Open the Popup when the selection is changed
					_this.calendar.on("change", function(e) {
						selectionChanged(e, e.newValue);
					});
					
					_this.calendar.on("itemEditEnd", function(e) {
						//console.log('Editing Ended ');
						selectionChanged(e, e.item);
					});
					
					
					// Synchronize date picker.
					_this.dateChooser.set("value", startOfWeek);
					_this.dateChooser.on("change", function(e) {
						var d = _this.dateChooser.get("value");
						_this.calendar.set("date", d);
					});
					
					// Configure the Calendar to fetch data from the step when the Date Interval is changed
					_this.calendar.on("timeIntervalChange", function(e) {
						_this.dateChooser.set("currentFocus", e.startTime, false);							
						_this.dateChooser.set("minDate", e.startTime);
						_this.dateChooser.set("maxDate", e.endTime);
						_this.dateChooser._populateGrid();
						Popup.close(_this.calendarAddEditEntryDialog);
						
						//Fetch the data from Store based on the current Selection and populate the Calendar
						//var strStartDate = locale.format(e.startTime, {'datePattern': 'MM/dd/yyyy', 'formatLength': 'short', 'selector': 'date'});
						//var strEndDate = locale.format(e.endTime, {'datePattern': 'MM/dd/yyyy', 'formatLength': 'short', 'selector': 'date'});
						_this.calendarMasterStore.query({ 'startDate': dojoStamp.toISOString(e.startTime, {zulu: true}), 'endDate': dojoStamp.toISOString(e.endTime, {zulu: true}) }, {
							start: 0,
							count: 100,
							sore: [{attribute: 'meetingDate', descending: false }]
						}).then(function(results){
							var calendarData = [];
							arr.forEach(results, function(calEntry){
								calendarData.push(calEntry);
							});
							//var calendarObj = { 'id': '', 'summary': 'Item Summary', 'startTime': 'startTime', 'endTime': 'endTime', 'calendar': 'Calendar2', 'allDay': false };
							//calendarData.push(calendarObj);
							_this.calendar.set("store", new Observable(new Memory({data: calendarData})));
						});
						
						
					});
		        	
		        	//Calendar Initialization is completed here
		        	
		        	
					var id=9999;
					//New Event Creation on Grid Click 
					var createItem = function(view, d, e){
						var start, end;
						var colView = _this.calendar.columnView;
						var cal = _this.calendar.dateModule;
						if (view == colView) {
							start = _this.calendar.floorDate(d, "minute",
									colView.timeSlotDuration);
							end = cal.add(start, "minute", colView.timeSlotDuration);
						} else {
							start = _this.calendar.floorToDay(d);
							end = cal.add(start, "day", 1);
						}
						
						var item = {
							id : id,
							summary : "New event " + id,
							agenda: '',
							email: true,
							emailText: 'Email Text to send',
							fromTime : start,
							toTime : end,
							calendar : "Calendar1",
							allDay: false,
							newlyCreated: true
						};
						id++;
						return item;
					};
					_this.calendar.set("createOnGridClick", true);
					_this.calendar.set("createItemFunc", createItem);
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	
		        	/*var modelBase = [ { day : 1, start : [ 10, 0 ], duration : 1400 }, 
		        	                  { day : 2, start : [ 10, 30 ], duration : 120 }, 
		        	                  { day : 2, start : [ 12, 0 ], duration : 240 }, 
		        	                  { day : 3, start : [ 6, 0 ], duration : 180 }, 
		        	                  { day : 3, start : [ 0, 0 ], duration : 2880, allDay : true }
		        	                  ];
		        	var someData = [];
		        	
		        	
		        	
		        	for (var id = 0; id < modelBase.length; id++) {
						var newObj = {
							id : id,
							summary : "New Event " + id,
							startTime : new _this.calendar.dateClassObj(startOfWeek.getTime()),
							endTime : new _this.calendar.dateClassObj(startOfWeek.getTime()),
							calendar : id % 2 == 0 ? "cal1" : "cal2",
							allDay : modelBase[id].allDay
						};
						newObj.startTime = _this.calendar.dateModule.add(newObj.startTime, "day", modelBase[id].day);
						newObj.startTime.setHours(modelBase[id].start[0]);
						newObj.startTime.setMinutes(modelBase[id].start[1]);
						newObj.endTime = _this.calendar.dateModule.add(newObj.startTime, "minute", modelBase[id].duration);
						someData.push(newObj);
					}
		        	
		        	
		        	
		        	//Attaching the Calendar to the store here
		        	Deferred.when(_this.calendar.set("store", _this.calendarMasterStore), function onOk(){
		        		console.log('Successfully connected to store ', arguments);
		        	}, function onFail(){
		        		console.log('Failed connecting to store ', arguments);
		        	});*/
					
					
					/*_this.calendar.on("gridDoubleClick", function(e){
						if (e.triggerEvent.ctrlKey && e.triggerEvent.shiftKey) {
							// drill down
							_this.calendar.set("date", e.date);
							_this.calendar.set("dateIntervalSteps", 1);
							_this.calendar.set("dateInterval", "day");
							return;
						}

						if (e.triggerEvent.shiftKey) {
							// drill up
							var dis = _this.calendar.get("dateIntervalSteps");
							var di = _this.calendar.get("dateInterval");
							var d = e.date;
							switch (e.source.viewKind) {
							case "columns":
								if (dis == 1) {
									di = "day";
									dis = 7;
									d = _this.calendar.floorToWeek(e.date);
								} else {
									di = "month";
									dis = 1;
								}
								break;
							case "matrix":
								di = "month";
								dis = 6;
								break;
							}
							_this.calendar.set("date", e.date);
							_this.calendar.set("dateIntervalSteps", dis);
							_this.calendar.set("dateInterval", di);
						}

					});*/
					
					// Enable creation of event interactively by ctrl clicking grid.
					/*var createItem = function(view, d, e){
						//console.log('createItem() Clicked --> ', view, d, e);
						var cal1 = true;//_this.calendar1CB.get("checked");
						var cal2 = false;//_this.calendar2CB.get("checked");

						// create item by maintaining control key
						if (!e.ctrlKey || e.shiftKey || e.altKey
								|| (!cal1 && !cal2)) {
							return null;
						}

						// create a new event
						var start, end;
						var colView = _this.calendar.columnView;
						var cal = _this.calendar.dateModule;

						if (view == colView) {
							start = _this.calendar.floorDate(d, "minute",
									colView.timeSlotDuration);
							end = cal.add(start, "minute", colView.timeSlotDuration);
						} else {
							start = _this.calendar.floorToDay(d);
							end = cal.add(start, "day", 1);
						}

						var item = {
							id : id,
							summary : "New event " + id,
							startTime : start,
							endTime : end,
							calendar : cal1 ? "cal1" : "cal2",
							allDay : view.viewKind != "columns"
						};
						id++;
						return item;
					};
					_this.calendar.set("createOnGridClick", true);
					_this.calendar.set("createItemFunc", createItem);*/
					
					// filter out event according to their calendar
					/*var calendarVisibility = [ true, true ];
					var itemToRendererKindFunc = function(item){
						if (item.cssClass == "Calendar1" && calendarVisibility[0]
								|| item.cssClass == "Calendar2"
								&& calendarVisibility[1]) {
							return this._defaultItemToRendererKindFunc(item);
						}
						return null;
					};

					_this.calendar.columnView.set("itemToRendererKindFunc", itemToRendererKindFunc);
					_this.calendar.columnView.secondarySheet.set("itemToRendererKindFunc", itemToRendererKindFunc);
					_this.calendar.matrixView.set("itemToRendererKindFunc", itemToRendererKindFunc);
					_this.calendar.monthColumnView.set("itemToRendererKindFunc", itemToRendererKindFunc);*/
					
					// show context menu on right clicking an event
					
					
					// refresh item panel on event selection.
					/*var editedItem;
					
					_this.calendar.on("change", function(e) {
						selectionChanged(e, e.newValue);
					});*/
					
					
					
					
					/*_this.allDayCB.on("change", function(value) {
						_this.itemStartTimeEditor.set("disabled", value);
						_this.itemEndTimeEditor.set("disabled", value);
						var d;
						if (value) {
							d = _this.itemStartTimeEditor.get("value");
							_this.calendar.floorToDay(d, true);
							_this.itemStartTimeEditor.set("value", d);
							d = _this.itemEndTimeEditor.get("value");
							_this.calendar.floorToDay(d, true);
							_this.itemEndTimeEditor.set("value", d);
							if (!_this.calendar.isStartOfDay(editedItem.endTime)) {
								d = _this.itemEndDateEditor.get("value");
								_this.calendar.floorToDay(d, true);
								d = _this.calendar.dateModule.add(d, "day", 1);
								_this.itemEndDateEditor.set("value", d);
							}
						} else {
							editedItem.startTime.setHours(8);
							editedItem.endTime.setHours(9);
							_this.itemStartTimeEditor.set("value", editedItem.startTime);
							_this.itemEndTimeEditor.set("value", editedItem.endTime);
							d = _this.itemEndDateEditor.get("value");
							_this.calendar.floorToDay(d, true);
							d = _this.calendar.dateModule.add(d, "day", -1);
							_this.itemEndDateEditor.set("value", d);
						}
					});*/
					
					var mergeDateTime = function(isStart) {
						var dateEditor = isStart ? _this.itemStartDateEditor : _this.itemEndDateEditor;
						var timeEditor = isStart ? _this.itemStartTimeEditor : _this.itemEndTimeEditor;
						var date = dateEditor.get("value");
						var time = timeEditor.get("value");
						date.setHours(time.getHours());
						date.setMinutes(time.getMinutes());
						return date;
					};
					
					_this.updateItemButton.on("click", function(value) {
						if (editedItem != null) {
							delete editedItem.allDay;
							editedItem.summary = _this.itemSummaryEditor.get("value");
							editedItem.agenda = _this.itemAgendaEditor.get("value");
							editedItem.email = _this.itemEmailEditor.get("checked");
							editedItem.emailText = _this.itemEmailTextEditor.get("value");
							editedItem.fromTime = mergeDateTime(true);
							editedItem.toTime = mergeDateTime(false);
							
							var clonedItem = {};
							clonedItem.id = editedItem.id;
							clonedItem.summary = editedItem.summary;
							clonedItem.agenda = editedItem.agenda;
							clonedItem.email = editedItem.email;
							clonedItem.emailText = editedItem.emailText;
							clonedItem.fromTime = editedItem.fromTime;
							clonedItem.toTime = editedItem.toTime;
							clonedItem.newlyCreated = editedItem.newlyCreated;
							if(clonedItem.hasOwnProperty('newlyCreated') && (clonedItem.newlyCreated === true)){
								delete clonedItem.id;
								_this.calendarMasterStore.add(clonedItem).then(function(updatedItem){
									_this.calendar.store.remove(editedItem.id);
									clonedItem.summary = updatedItem.summary;
									clonedItem.agenda = updatedItem.agenda;
									clonedItem.email = updatedItem.email;
									clonedItem.emailText = updatedItem.emailText;
									clonedItem.fromTime = updatedItem.fromTime;
									clonedItem.toTime = updatedItem.toTime;
									clonedItem.newlyCreated = updatedItem.newlyCreated;
									clonedItem.id = updatedItem.id;
									clonedItem.calendar = updatedItem.calendar;
									_this.calendar.store.add(clonedItem, {'id': clonedItem.id, 'overwrite': true});
								});
							} else {
								var clonedItem = {};
								clonedItem.id = editedItem.id;
								clonedItem.summary = editedItem.summary;
								clonedItem.agenda = editedItem.agenda;
								clonedItem.email = editedItem.email;
								clonedItem.emailText = editedItem.emailText;
								clonedItem.fromTime = editedItem.fromTime;
								clonedItem.toTime = editedItem.toTime;
								clonedItem.newlyCreated = editedItem.newlyCreated;
								_this.calendarMasterStore.put(clonedItem).then(function(updatedItem){
									_this.calendar.store.remove(editedItem.id);
									clonedItem.summary = updatedItem.summary;
									clonedItem.agenda = updatedItem.agenda;
									clonedItem.email = updatedItem.email;
									clonedItem.emailText = updatedItem.emailText;
									clonedItem.fromTime = updatedItem.fromTime;
									clonedItem.toTime = updatedItem.toTime;
									clonedItem.newlyCreated = updatedItem.newlyCreated;
									clonedItem.id = updatedItem.id;
									clonedItem.calendar = updatedItem.calendar;
									_this.calendar.store.add(clonedItem, {'id': clonedItem.id, 'overwrite': true});
								});
							}
							/*if (_this.allDayCB.get("value")) {
								if (!_this.calendar.isStartOfDay(editedItem.startTime)) {
									editedItem.startTime = _this.calendar.floorToDay(_this.itemStartDateEditor.get("value"),true);
								}
								if (!_this.calendar.isStartOfDay(editedItem.endTime)) {
									editedItem.endTime = _this.calendar.floorToDay(_this.itemEndDateEditor.get("value"),true);
								}
								editedItem.allDay = true;
							} else*/ {
								
								
							}
							//var calValue = _this.calendarEditor.get("value");
							//editedItem.calendar = calValue == "Calendar 1" ? "cal1" : "cal2";
							
						}
					});
					
					_this.deleteItemButton.on("click", function(value) {
						if(editedItem != null) {
							var clonedItem = lang.clone(editedItem);
							if(clonedItem.hasOwnProperty('newlyCreated') && (clonedItem.newlyCreated === true)){
								_this.calendar.store.remove(clonedItem.id);
							} else {
								_this.calendarMasterStore.remove(clonedItem.id).then(function(){
									_this.calendar.store.remove(clonedItem.id);
								});
							}
						}
					});
					
					_this.closeItemButton.on("click", function(value) {
						_this.calendar.set('selectedItem', null);
						Popup.close(_this.calendarAddEditEntryDialog);
					});
					
					/*_this.calendar1CB.on("change", function(v) {
						calendarVisibility[0] = v;
						_this.calendar.currentView.invalidateLayout();
					});

					_this.calendar2CB.on("change", function(v) {
						calendarVisibility[1] = v;
						_this.calendar.currentView.invalidateLayout();
					});*/
		        },
		        startCalendar: function(){
		        	this.customizeCalendar();
		        }
			});
		});