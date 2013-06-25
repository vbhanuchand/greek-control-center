define([ "dijit/dijit", "dijit/registry", "dojo/query", "dojo/dom", "dojo/dom-style", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/string", "dojo/on", 
         "dojo/keys", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/json", "dojo/_base/config", "dojo/io-query", "dojo/_base/window", "dojo/aspect",
		"dojo/date/locale",  "dojo/_base/fx", "dojox/layout/TableContainer", "dijit/form/TextBox", "dijit/layout/ContentPane", "dijit/form/SimpleTextarea", "dijit/form/Textarea",
		"dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/Calendar", "dijit/TitlePane", "dijit/form/FilteringSelect",	"dijit/form/Form", "dijit/form/ValidationTextBox",	
		"dojox/layout/ScrollPane", "dijit/Dialog", "dijit/form/DropDownButton", "dijit/form/Button", "dojox/grid/DataGrid", "dojox/grid/EnhancedGrid", "dojo/store/Memory", 
		"dojo/data/ObjectStore", "dojo/request", "dojox/form/Manager", "dojox/math/random/Simple", "dojo/data/ItemFileWriteStore", "controls/LaborLayoutController",
		"dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Pagination"],
		function(dijit, registry, query, dom, domStyle, domClass, domConstruct, domGeometry, string, on, 
				keys, lang, baseArray, event, json, djConfig, ioQuery, win, aspect, 
				locale, baseFx, Table, TextBox, ContentPane, SimpleTextArea, TextArea, 
				BorderContainer, TabContainer, Calendar, TitlePane, FilteringSelect, Form, ValidationTextBox, scrollPane,
				Dialog, DropDownButton, Button, DataGrid, EnhancedGrid, Memory, ObjectStore, ajaxRequest, dojoxFormManager, randomNumber, itemFileWriteStore, laborLayout) {
			
			var storeInfoTable = null, storeAlarmCodesGrid = null, storeKeysGrid = null, storeMaintenanceGrid = null, storeLaborGrid = null,
			randomGen = new randomNumber(), loginQuery = djConfig.loginRequest || {}, blankArray=[],
			
			startup = function() {
				updateStoreAlarmsGrid(blankArray);
				updateStoreKeysGrid(blankArray);
				updateStoreMaintenanceGrid(blankArray);
				updateStoreLaborGrid(blankArray);
				attachGridEvents('storeAlarmCodesGrid');
				attachGridEvents('storeKeysGrid');
				attachGridEvents('storeMaintenanceGrid');
				handleLaborPaneCellClicks('storeLaborGrid');
		    },
		    getRandomId = function(){
		    	var t = new Array(256);
		    	randomGen.nextBytes(t);
		    	return t[0];
		    },
		    checkTitles = function(child){
		    	if(!(child.get('title').indexOf(' &nbsp; <img ') > 0))
			    	switch(child.get('id')){
					case 'storeAlarms':
						child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='addStoreAlarmTabRecord(event)'/> &nbsp;");
						break;
					case 'storeKeys':
						child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='addStoreKeyTabRecord(event)'/> &nbsp;");
						break;
					case 'storeMaintenance':
						child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='addStoreMaintenanceTabRecord(event)'/> &nbsp;");
						break;
			    	}
		    },
		    refreshSelectedPane = function(){
		    	var storeTabsContainer = registry.byId("storeInfoTabContainer");
		    	var child = storeTabsContainer.selectedChildWidget;
		    	updateStoreAlarmsGrid(blankArray);
				updateStoreKeysGrid(blankArray);
				updateStoreMaintenanceGrid(blankArray);
		    	switch(child.get('id')){
		    		case 'storeAlarms': 
		    			fetchStoreAlarmsData(registry.byId('hiddenStoreId').get('value'));
		    			break;
		    		case 'storeKeys': 
		    			fetchStoreKeysData(registry.byId('hiddenStoreId').get('value'));
		    			break;
		    		case 'storeMaintenance': 
		    			fetchStoreMaintenanceData(registry.byId('hiddenStoreId').get('value'));
		    			break;
		    		case 'storeLabor': 
		    			fetchStoreLaborData(registry.byId('hiddenStoreId').get('value'));
		    			break;
		    	}
		    	checkTitles(child);
		    },
		    clearGridSelections = function(){
		    	try{dijit.byId('storeAlarmCodesGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('storeKeysGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('storeMaintenanceGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('storeLaborGrid').selection.clear();}catch(e){}
		    },
		    handleLaborPaneCellClicks = function(gridId){
		    	registry.byId(gridId).on("CellClick", function(event){
		    		if(event.cellIndex == 0){
		    			event.preventDefault();
		    			event.stopPropagation();
		    			var yearWeek = event.grid.getItem(event.rowIndex).week;
		    			laborLayout.populateData(registry.byId('hiddenStoreId').get('value'), yearWeek);
		    			registry.byId("tabContainer").selectChild(registry.byId("laborPane"));
		    		}
		    	}, true);
		    },
		    validateDatePattern = function(value, constraints){
		    	var reg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
		    	var returnValue = reg.test(value);
		    	return returnValue;
		    },
		    validateCell = function(cellWidget){
		    	var returnValue = false;
		    	try{returnValue = cellWidget.validate();}catch(e){returnValue=true;}
		    	return returnValue;
		    },
		    attachGridEvents = function(gridId){
		    	registry.byId(gridId).on("CellClick", function(evt){
		    		//evt.grid.inherited(arguments);
		    		if(evt.cellIndex == 0){
		    			var standByWidgetId = evt.grid.get('id') + 'StandBy';
		    			registry.byId(standByWidgetId).show();
		    			var grid = evt.grid, serviceURL= evt.grid.getItem(evt.rowIndex)._self, addOrUpdate = evt.grid.getItem(evt.rowIndex).post;
		    			if(addOrUpdate == 'true') serviceURL = evt.grid.getItem(0)._self;
		    			var selectedItems = grid.selection.getSelected(), editedItem = '';
		    			var rowValid = true;
		    			baseArray.forEach(evt.grid.layout.cells, function(cell){
		    				rowValid = rowValid && validateCell(evt.grid.getCell(cell.index).widget);
			    		});
		    			if(rowValid){
					    	dojo.forEach(selectedItems, function(selectedItem) {
					    		editedItem = '{';
					    		dojo.forEach(grid.store.getAttributes(selectedItem), function(attribute) {
					    			if(!(attribute.substring(0,1) == '_'))
					    				editedItem += '"' + attribute + '":"' + grid.store.getValues(selectedItem, attribute) + '",';
					    		});
					    		editedItem = editedItem.substring(0,(editedItem.length-1)) + '}';
					    	});
					    	var jsonRowObject = json.parse(editedItem,false);
			    			var tmpDate;
			    			if(jsonRowObject.incrementDate){
			    				try{tmpDate = jsonRowObject.incrementDate;
			    					jsonRowObject.incrementDate = new Date(tmpDate.split('/')[2], Number(tmpDate.split('/')[1])-1, tmpDate.split('/')[0]);
			    				}catch(e){jsonRowObject.incrementDate = new Date();}
			    			}
			    			if(jsonRowObject.date){
			    				try{tmpDate = jsonRowObject.date;
		    						jsonRowObject.date = new Date(tmpDate.split('/')[2], Number(tmpDate.split('/')[1])-1, tmpDate.split('/')[0]);
			    				}catch(e){jsonRowObject.date = new Date();}
			    			}
			    			if(jsonRowObject.hiredDate){
			    				try{tmpDate = jsonRowObject.hiredDate;
		    						jsonRowObject.hiredDate = new Date(tmpDate.split('/')[2], Number(tmpDate.split('/')[1])-1, tmpDate.split('/')[0]);
			    				}catch(e){jsonRowObject.hiredDate = new Date();}
			    			}
			    			
			    			try{delete jsonRowObject['store']; delete jsonRowObject['updatedDate']; delete jsonRowObject['updated_date'];
				    		 delete jsonRowObject['__isDirty']; delete jsonRowObject['employeeRoles'];}catch(e){}
				    		if(addOrUpdate == 'true'){
				    			ajaxRequest.post(serviceURL, {
				        		headers: { "Content-Type":"application/json"}, 
				        		handleAs: 'json', data: json.stringify(jsonRowObject), timeout: 10000 
				        			}).then(function(storeUpdateResponse){
				        				if(storeUpdateResponse.success){
				        				console.log('Update Success ');
				        				dom.byId('messages').innerHTML = 'Add Successful';
				        				refreshSelectedPane();
				        				//registry.byId(standByWidgetId).hide();
				        			}
				        		}, function(error){
				        			console.log('Error while updating --> ' + error);
				        			dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
				        			registry.byId(standByWidgetId).hide();
				        		});
					    	}else {
					    		ajaxRequest.put(serviceURL, {
				        		headers: { "Content-Type":"application/json"}, 
				        		handleAs: 'json', data: json.stringify(jsonRowObject), timeout: 10000 
				        			}).then(function(storeUpdateResponse){
				        				if(storeUpdateResponse.success){
				        				console.log('Update Success ');
				        				dom.byId('messages').innerHTML = 'Update Success';
				        				//refreshSelectedPane();
				        				registry.byId(standByWidgetId).hide();
				        			}
				        		}, function(error){
				        			console.log('Error while updating --> ' + error);
				        			dom.byId('messages').innerHTML = 'Error while updating --> ' + error;
				        			registry.byId(standByWidgetId).hide();
				        		});
					    	}
		    			}else {
		    				registry.byId(standByWidgetId).hide(); //hideStandBy();
		    			}
		    		}
		    	}, true);
		    },
		    createAddUpdateLink = function(values, rowIndex){
		    	if(values[1] === '__new__')
		    		return '<span style="text-align: center;"><a href="#">Add</a></span>';
		    	else return '<span style="text-align: center;"><a href="#">Update</a></span>';
		    },
		    showScheduleLink = function(value){
		    	//return "<div class='tab-heading'><div class='hold'><span>Schedule</span></div></div>";
		    	return '<span style="text-align: center;"><a href="#">View Schedule</a></span>';
		    }
		    fetchStoreData = function(storeId) {
		    	registry.byId('storeInfoTitlePaneStandBy').show();
		    	ajaxRequest.get("/service/store/storeId=" + storeId,{
		    		handleAs: 'json'
		    	}).then(function(storeDetailsResponse){
		    		if(storeDetailsResponse.success){
		    			populateStoreParticulars(storeDetailsResponse.model);
		    			registry.byId('storeInfoTitlePaneStandBy').hide();
		    		}
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('storeInfoTitlePaneStandBy').hide();
		    	});
		    },
		    fetchStoreAlarmsData = function(storeId) {
		    	registry.byId('storeAlarmCodesGridStandBy').show();
		    	ajaxRequest.get("/service/store/" + storeId + "/alarms",{
		    		handleAs: 'json'
		    	}).then(function(storeDetailsResponse){
		    		if(storeDetailsResponse.success){
		    			updateStoreAlarmsGrid(storeDetailsResponse.models);
		    			registry.byId('storeAlarmCodesGridStandBy').hide();
		    		}
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('storeAlarmCodesGridStandBy').hide();
		    	});
		    },
		    fetchStoreKeysData = function(storeId) {
		    	registry.byId('storeKeysGridStandBy').show();
		    	ajaxRequest.get("/service/store/" + storeId + "/keys",{
		    		handleAs: 'json'
		    	}).then(function(storeDetailsResponse){
		    		if(storeDetailsResponse.success){
		    			updateStoreKeysGrid(storeDetailsResponse.models);
		    			registry.byId('storeKeysGridStandBy').hide();
		    		}
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('storeKeysGridStandBy').hide();
		    	});
		    },
		    fetchStoreMaintenanceData = function(storeId) {
		    	registry.byId('storeMaintenanceGridStandBy').show();
		    	ajaxRequest.get("/service/store/" + storeId + "/maintenance",{
		    		handleAs: 'json'
		    	}).then(function(storeDetailsResponse){
		    		if(storeDetailsResponse.success){
		    			updateStoreMaintenanceGrid(storeDetailsResponse.models);
		    			registry.byId('storeMaintenanceGridStandBy').hide();
		    		}
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('storeMaintenanceGridStandBy').hide();
		    	});
		    },
		    fetchStoreLaborData = function(storeId) {
		    	registry.byId('storeLaborGridStandBy').show();
		    	ajaxRequest.get("/service/store/" + storeId + "/labor/schedule",{
		    		handleAs: 'json'
		    	}).then(function(storeDetailsResponse){
	    			updateStoreLaborGrid(storeDetailsResponse);
	    			registry.byId('storeLaborGridStandBy').hide();
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('storeLaborGridStandBy').hide();
		    	});
		    },
		    fetchStoreLeaseBlobs = function(storeId){
		    	registry.byId('storeInfoLeaseDocumentsStandBy').show();
		    	ajaxRequest.get("/service/blobs/store-lease/" + storeId,{
		    		handleAs: 'json'
		    	}).then(function(storeBlobsResponse){
		    		var uploadFilesNode = dom.byId('storeInfoUploadedDocumentsExisting');
		    		domConstruct.empty(uploadFilesNode);
		    		var fragment;
		    		var innerHTMLText = '';
		    		baseArray.forEach(storeBlobsResponse.models, function(blob){
		    			fragment = document.createDocumentFragment();
		    			innerHTMLText = '&nbsp;&nbsp;&nbsp;<img src="resources/images/icon-pdf.png"/> &nbsp;' + ((blob.fileName.length > 20) ? (blob.fileName.substr(0, 20)+'...') : blob.fileName) + 
		    					'&nbsp;<a target="_new" href="/service/getBlob/' + blob.blobKey + '">Download</a>';
		    			domConstruct.create("li", {
	                        innerHTML: innerHTMLText
	                    }, fragment);
			    		domConstruct.place(fragment, uploadFilesNode);
		    		});
		    		registry.byId('storeInfoLeaseDocumentsStandBy').hide();
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('storeInfoLeaseDocumentsStandBy').hide();
		    	});
		    },
		    fetchStoreDates = function(storeId){
		    	registry.byId('storeInfoImpDatesStandBy').show();
		    	ajaxRequest.get("/service/store/" + storeId + "/dates",{
		    		handleAs: 'json'
		    	}).then(function(storeDetailsResponse){
		    		if(storeDetailsResponse.success){
		    			populateStoreDates(storeDetailsResponse.models);
		    			registry.byId('storeInfoImpDatesStandBy').hide();
		    		}
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('storeInfoImpDatesStandBy').hide();
		    	});
		    },
		    populateStoreDates = function(storeDatesModel){
		    	var impDatesList = dom.byId('storeInfoImpDatesTable');
		    	domConstruct.empty(impDatesList);
		    	var tableTR;
		    	baseArray.forEach(storeDatesModel, function(dateRecord){
		    		tableTR = domConstruct.create("tr");
		    		var td1 = domConstruct.create("td", { innerHTML: dateRecord.impDate }, tableTR);
		    		var td2 = domConstruct.create("td", { innerHTML: dateRecord.notes }, tableTR);
		    		tableTR.appendChild(td1);
		    		tableTR.appendChild(td2);
		    		impDatesList.appendChild(tableTR);
		    	});
		    },
		    populateStoreParticulars = function(storeInfoDataModel){
		    	console.log('Populating the Store Information values');
		    	try{
			    	if(dijit.byId('store-info-mailing-address') && dijit.byId('store-info-phone-numbers') && dijit.byId('store-info-notes')){
			    		dijit.byId('store-info-mailing-address').set('value', storeInfoDataModel.store_address);
				    	dijit.byId('store-info-phone-numbers').set('value', storeInfoDataModel.store_contact_details);
				    	dijit.byId('store-info-operating-hrs').set('value', storeInfoDataModel.operating_hrs);
				    	//dojo.byId('store-info-important-dates-content').innerHTML = impDatesList.innerHTML;
				    	dijit.byId('store-info-notes').set('value', storeInfoDataModel.store_notes);
				    	//dojo.byId('store-info-lease-documents-content').innerHTML = '<a href="#">' + storeInfoDataModel.lease_copy_loc + '</a>';
			    	}
		    	}catch(e){console.log('Error Occurred during populateStoreParticulars() method ' + e);}
		    },
		    addRow = function(gridId){
		    	var recordToAdd={};
		    	try{
		    		var gridStore = dijit.byId(gridId).store;
		    		var randomNumber = getRandomId();
		    		console.log('Random Number used is ' + getRandomId());
		    		switch(gridId){
				    	case 'storeAlarmCodesGrid': 
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), name: 'Add Name', 
				    			code: 'Add Code', position: 'Add Position', notes: 'Add Notes', active: true, updatedBy: 1, updatedDate: '', 
				    			_self: '/service/store/'+registry.byId('hiddenStoreId').get('value')+'/alarms', post: true, store: '__new__'};
				    		break;
				    	case 'storeKeysGrid': 
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), name: 'Add Name', 
				    			type: 'Add Type', position: 'Add Position', notes: 'Add Notes', active: true, updatedBy: 1, updatedDate: '', 
				    			_self: '/service/store/'+registry.byId('hiddenStoreId').get('value')+'/keys', post: true, store: '__new__'};
				    		break;
				    	case 'storeMaintenanceGrid':
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), date: '23/12/2013', notes: 'Add Notes', 
				    			problem: 'Add Problem', company: 'Add Company', phone: 'Add Phone', active: true, updatedBy: 1, updatedDate: '', 
				    			_self: '/service/store/'+registry.byId('hiddenStoreId').get('value')+'/maintenance', post: true, store: '__new__'};
				    		break;
				    }
			    	var t = gridStore.newItem(recordToAdd);
		    	} catch(e){
		    		console.log('Error while adding Row --> ' + e);
		    	}
		    },
		    updateStoreAlarmsGrid = function(alarmsData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = alarmsData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
		    	
		    	if(!dijit.byId('storeAlarmCodesGrid')){ 
					storeAlarmCodesGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											    cells: [{ name: "Update", fields: ['id', 'store'], width: "10%", noresize: true, formatter: createAddUpdateLink},
											    { name: "Name", field: "name", width: "20%", noresize: true, editable: true, hidden: false, 
													constraint:{required: true}, widgetProps: {maxLength: 30, promptMessage: 'Name within 30 characters', 
													missingMessage: 'Please provide Name' }, widgetClass: ValidationTextBox},
												{ name: "User #", field: "id", editable: false, width: "15%", noresize: true, hidden: true},
												{ name: "Code", field: "code", width: "15%", noresize: true, editable: true, hidden: false, 
													constraint:{required: true}, widgetProps: {maxLength: 10, promptMessage: 'Alarm Code within 10 characters', 
													missingMessage: 'Please provide Alarm Code' }, widgetClass: ValidationTextBox},
												{ name: "Position", field: "position", width: "20%", noresize: true, editable: true, hidden: false, 
													constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Position within 20 characters', 
													missingMessage: 'Please provide Position' }, widgetClass: ValidationTextBox},
												{ name: "Notes", field: "notes", width: "20%", noresize: true, editable: true, hidden: false, 
													constraint:{required: false}, widgetProps: {maxLength: 100, promptMessage: 'Notes within 100 characters', 
													missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
									        errorMessage:   'Oops we could not retrive the requested data!',
									        noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>No Data to Display !!!</font></span>",
									        onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									        selectionMode: "single",
											//rowSelector: '20px',
									        plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 10
												},
					                            exporter: true
								        }}, "storeAlarmCodesGrid");
					console.log('Start the Store Alarm Grid !!');
					storeAlarmCodesGrid.startup();
				} else dijit.byId('storeAlarmCodesGrid').setStore(gridDataStore);
		    },
		    updateStoreKeysGrid = function(keysData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = keysData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('storeKeysGrid')){
					storeKeysGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											            cells:[{ name: "Update", fields: ['id', 'store'], width: "10%", noresize: true, formatter: createAddUpdateLink},
											            { name: "Name", field: "name", width: "20%", noresize: true, editable: true, hidden: false, 
														  	constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Name within 20 characters', 
															missingMessage: 'Please provide Name' }, widgetClass: ValidationTextBox},
														{ name: "Key", field: "type", width: "20%", noresize: true, editable: true, hidden: false, 
															constraint:{required: true}, widgetProps: {maxLength: 30, promptMessage: 'Key within 30 characters', 
															missingMessage: 'Please provide Key' }, widgetClass: ValidationTextBox},
														{ name: "Position", field: "position", width: "25%", noresize: true, editable: true, hidden: false, 
															constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Position within 20 characters', 
															missingMessage: 'Please provide Position' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
								            errorMessage:   'Oops we could not retrive the requested data!',
								            noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'><b>No Data to Display !!!<b></font></span>",
								            onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
								            selectionMode: "single",
											//rowSelector: '20px',
								            plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 10
												},
					                            exporter: true
								        }}, "storeKeysGrid");
					console.log('Start the Store Key Grid !!');
					storeKeysGrid.startup();
				} else dijit.byId('storeKeysGrid').setStore(gridDataStore);
		    },
		    updateStoreMaintenanceGrid = function(maintenanceData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = maintenanceData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('storeMaintenanceGrid')){
					storeMaintenanceGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											    cells:[{ name: "Update", fields: ['id', 'store'], width: "10%", noresize: true, formatter: createAddUpdateLink},
											    { name: "Date", field: "date", width: "15%", noresize: true, editable: true, constraint:{required: true}, 
											    	widgetProps: {validator: validateDatePattern, promptMessage: 'Provide date in DD/MM/YYYY', 
											    	missingMessage: 'Please provide date in DD/MM/YYYY', invalidMessage: 'Date format should be in DD/MM/YYYY'}, 
											    	widgetClass: ValidationTextBox },
											    { name: "Problem", field: "problem", width: "15%", noresize: true, editable: true, hidden: false, 
											    	constraint:{required: true}, widgetProps: {maxLength: 50, promptMessage: 'Problem within 50 characters', 
											    	missingMessage: 'Please provide Problem Description' }, widgetClass: ValidationTextBox},
											    { name: "Company Name", field: "company", width: "15%", noresize: true, editable: true, hidden: false, 
											    	constraint:{required: true}, widgetProps: {maxLength: 50, promptMessage: 'Company Name within 50 characters', 
											    	missingMessage: 'Please provide Company Name' }, widgetClass: ValidationTextBox},
											    { name: "Phone Number", field: "phone", width: "15%", noresize: true, editable: true, hidden: false, 
											    	constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Contact Number within 20 characters', 
											    	missingMessage: 'Please provide Company Contact Number' }, widgetClass: ValidationTextBox},
											    { name: "Fixed or Not Fixed (Reason)", field: "notes", width: "30%", noresize: true, editable: true, hidden: false, 
											    	constraint:{required: false}, widgetProps: {maxLength: 200, promptMessage: 'Notes within 200 characters', 
											    	missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
									        errorMessage:   'Oops we could not retrive the requested data!',
									        noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'><b>No Data to Display !!!<b></font></span>",
									        onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									        selectionMode: "single",
											//rowSelector: '20px',
									        plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 10
												},
					                            exporter: true
								        }}, "storeMaintenanceGrid");
					console.log('Start the Store Maintenance Grid !!');
					storeMaintenanceGrid.startup();
				} else dijit.byId('storeMaintenanceGrid').setStore(gridDataStore);
		    },
		    updateStoreLaborGrid = function(laborData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = laborData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('storeLaborGrid')){
					storeLaborGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{ name: "Schedule", field: "week", editable: false, width: "12%", noresize: true, formatter: showScheduleLink}, 
											            { name: "Date", field: "skeletonKey", editable: false, width: "23%", noresize: true},
												{ name: "Manager Hours", field: "Manager", editable: false, width: "22%", noresize: true},
												{ name: "Cook Hours", field: "Cook", editable: false, width: "22%", noresize: true},
												{ name: "Front Hours", field: "Front", editable: false, width: "21%", noresize: true}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
									        errorMessage:   'Oops we could not retrive the requested data!',
									        noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'><b>No Data to Display !!!<b></font></span>",
									        onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									        selectionMode: "none",
											//rowSelector: '20px',
									        plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 10
												},
					                            exporter: true
								        }}, "storeLaborGrid");
					console.log('Start the Store Labor Grid !!');
					storeLaborGrid.startup();
				} else dijit.byId('storeLaborGrid').setStore(gridDataStore);
		    };
		    
		    return {
		        init: function() {
		            startup();
		        },
		        populateStoreData: function(storeId){
		        	clearGridSelections();
		        	fetchStoreData(storeId);
		        	fetchStoreDates(storeId);
		        	refreshSelectedPane();
		        	fetchStoreLeaseBlobs(storeId);
		        	console.log('Store Data Populated !!! ');
		        },
		        saveStoreInfoData: function(){
		        	var storeData = {id: registry.byId('hiddenStoreId').get('value'), store_address: dijit.byId('store-info-mailing-address').get('value'),
		        				operating_hrs: dijit.byId('store-info-operating-hrs').get('value'),
		        				store_contact_details: dijit.byId('store-info-phone-numbers').get('value'),
		        				store_notes: dijit.byId('store-info-notes').get('value'),
		        				lease_copy_loc: dijit.byId('store-info-mailing-address').get('value'),
		        				updated_by: 0
		        				//,imp_date: new Date()
		        				};
		        	registry.byId('storeInfoTitlePaneStandBy').show();
		        	ajaxRequest.put('/service/store/' + registry.byId('hiddenStoreId').get('value'), {
		        		headers: { "Content-Type":"application/json"}, handleAs: 'json', data: dojo.toJson(storeData), 
		        		timeout: 10000}).then(function(storeUpdateResponse){
		        		console.log('Store Infor update Response --> ' + storeUpdateResponse.success);
		        		if(storeUpdateResponse.success){
		        			fetchStoreData(registry.byId('hiddenStoreId').get('value'));
		        		}
		        	}, function(error){
			    		console.log('Error occurred while Updating store data ' + error);
			    		registry.byId('storeInfoTitlePaneStandBy').hide();
			    	});
		        },
		        addRowInGrid: function(gridId){
		        	addRow(gridId);
		        },
		        postCreate: function(){
		        	console.log('Calling Tab Container Listener ' + registry.byId("storeInfoTabContainer"));
				    var storeTabsContainer = registry.byId("storeInfoTabContainer");
				    dojo.connect(storeTabsContainer, "selectChild", function(child){
						baseArray.forEach(storeTabsContainer.getChildren(), function(storeTab){
							if(storeTab.get('title').indexOf(' &nbsp; <img ') > 0){
								storeTab.set('title', storeTab.get('title').substring(0, storeTab.get('title').indexOf(' &nbsp; <img ')));
							}
						});
					    switch(child.get('id')){
							case 'storeAlarms':
								child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='addStoreAlarmTabRecord(event)'/> &nbsp;");
								break;
							case 'storeKeys':
								child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='addStoreKeyTabRecord(event)'/> &nbsp;");
								break;
							case 'storeMaintenance':
								child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='addStoreMaintenanceTabRecord(event)'/> &nbsp;");
								break;
						}
						refreshSelectedPane();
					});
		        },
		        fetchStoreLeaseBlobs: function(storeId){
		        	fetchStoreLeaseBlobs(storeId);
		        },
		        refreshStoreDates: function(storeId){
		        	fetchStoreDates(storeId);
		        }
		    };
});