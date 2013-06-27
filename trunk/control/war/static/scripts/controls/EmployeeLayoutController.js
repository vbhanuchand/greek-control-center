define([ "dojo/_base/declare", "dijit/dijit", "dijit/registry", "dojo/dom", "dojo/dom-style", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/string", "dojo/on", 
         "dojo/keys", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/json", "dojo/_base/config", "dojo/fx", "dojo/io-query", "dojo/_base/window", "dojo/aspect",
		"dojo/date/locale",  "dojo/_base/fx", "dojox/layout/TableContainer", "dijit/form/TextBox", "dijit/layout/ContentPane", "dijit/form/SimpleTextarea", "dijit/form/Textarea",
		"dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/Calendar", "dijit/TitlePane", "dijit/form/FilteringSelect",	"dijit/form/Form", 
		"dijit/Dialog", "dijit/form/DropDownButton", "dijit/form/Button", "dijit/form/DateTextBox", "dojox/grid/DataGrid", "dojox/grid/EnhancedGrid", "dojo/store/Memory", 
		"dojo/query", "dojo/_base/declare", "dojo/has", "dojo/data/ObjectStore", "dojo/request", "dojox/form/Manager", "dojox/math/random/Simple", 
		"dojo/data/ItemFileWriteStore", "dojox/grid/cells/dijit", "dijit/form/TimeTextBox", "dijit/form/ValidationTextBox",	"dijit/form/CurrencyTextBox", "dojo/store/Observable",  
		"dijit/TooltipDialog", "dijit/popup", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Pagination"],
		function(declare, dijit, registry, dom, domStyle, domClass, domConstruct, domGeometry, string, on, 
				keys, lang, baseArray, event, json, djConfig, otherFx, ioQuery, win, aspect, 
				locale, baseFx, Table, TextBox, ContentPane, SimpleTextArea, TextArea, 
				BorderContainer, TabContainer, Calendar, TitlePane, FilteringSelect, Form, 
				Dialog, DropDownButton, Button, DateTextBox, DataGrid, EnhancedGrid, Memory, 
				query, declare, has, ObjectStore, ajaxRequest, dojoxFormManager, randomNumber, 
				itemFileWriteStore, gridDijit, TimeTextBox, ValidationTextBox, CurrencyTextBox, Observable, Tooltip, popup) {
			var employeesGrid = registry.byId('employeesGrid'), employeeSalaryDetailsGrid = registry.byId('employeeSalaryDetailsGrid'), 
				employeeDisciplineGrid = registry.byId('employeeDisciplineGrid'), employeeDoingGoodGrid = registry.byId('employeeDoingGoodGrid'), 
				employeeLeavesGrid=registry.byId('employeeLeavesGrid'), empLaborDetailsGrid=registry.byId('empLaborDetailsGrid'), 
				storePattern = 'dd/MM/yyyy', storeTimePattern = 'HH:mm', displayPattern = 'd, MMMM yyyy', randomGen = new randomNumber(), blankArray=[],
			formatDate = function(datum){
				var d = locale.parse(datum, {selector: 'date', datePattern: storePattern});
				//console.log('Format Date --> In Value is --> ' + datum + ' Converted to --> ' + locale.format(d, {selector: 'date', locale: 'en', datePattern: displayPattern}));
		        return locale.format(d, {selector: 'date', datePattern: displayPattern});
		    },
		    getDateValue = function(){
		    	console.log('Get value --> In Value is --> ' + this.widget.get('value') + ' Converted to --> ' + locale.format(this.widget.get('value'), {selector: 'date', locale: 'en', datePattern: storePattern}));
		    	return locale.format(this.widget.get('value'), {selector: 'date', datePattern: storePattern});
		    },
		    formatTime = function(datum){
		    	//return datum.toString().replace(/.*1970\s(\S+).*/,'$1');
		    	return datum;
		    },
		    getTimeValue = function(){
		    	return locale.format(this.widget.get('value'), {selector: 'date', datePattern: storeTimePattern, locale: 'en'});
		    },
		    startup = function() {
				updateEmployeesGrid(blankArray);
				updateEmployeeSalaryDetailsGrid(blankArray);
				updateEmployeeDisciplinaryDetailsGrid(blankArray);
				updateEmployeeDoingGoodGrid(blankArray);
				updateEmployeeLeavesGrid(blankArray);
				updateEmployeeLaborDetailsGrid(blankArray);
				updateMgrLeavesGrid(blankArray);
				attachGridEvents('employeesGrid');
				attachGridEvents('employeeSalaryDetailsGrid');
				attachGridEvents('employeeDisciplineGrid');
				attachGridEvents('employeeDoingGoodGrid');
				attachGridEvents('employeeLeavesGrid');
				attachGridEvents('empLaborDetailsGrid');
				attachGridEvents('mgrLeavesGrid');
		    },
		    getRandomId = function(){
		    	var t = new Array(256);
		    	randomGen.nextBytes(t);
		    	return t[0];
		    },
		    showStandBy = function(){
		    	registry.byId('employeesGridStandBy').show();
				registry.byId('employeeSalaryDetailsGridStandBy').show();
				registry.byId('employeeDisciplineGridStandBy').show();
				registry.byId('employeeDoingGoodGridStandBy').show();
				registry.byId('employeeLeavesGridStandBy').show();
				registry.byId('empLaborDetailsGridStandBy').show();
		    },
		    hideStandBy = function(){
		    	registry.byId('employeesGridStandBy').hide();
				registry.byId('employeeSalaryDetailsGridStandBy').hide();
				registry.byId('employeeDisciplineGridStandBy').hide();
				registry.byId('employeeDoingGoodGridStandBy').hide();
				registry.byId('employeeLeavesGridStandBy').hide();
				registry.byId('empLaborDetailsGridStandBy').hide();
		    },
		    checkTitles = function(child){
		    	if(!(child.get('title').indexOf(' &nbsp; <img ') > 0))
			    	switch(child.get('id')){
						case 'empSalaryDetails':
							child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeSalaryTabRecord(event);'/> &nbsp;");
							break;
						case 'empDisciplineDetails':
							child.set('title', child.get('title') + "");
							break;
						case 'empLeavesDetails':
							child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeLeavesTabRecord(event);'/> &nbsp;");
							break;
						case 'empLaborDetails':
							child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeLaborTabRecord(event);'/> &nbsp;");
							break;
					}
		    },
		    refreshSelectedPane = function(){
		    	var employeeTabsContainer = registry.byId("employeeInfoTabContainer");
		    	var child = employeeTabsContainer.selectedChildWidget;
		    	switch(child.get('id')){
				case 'empSalaryDetails':
					if(getSelectedEmployeeId() > 0) fetchEmployeeSalaryData(getSelectedEmployeeId());
					else updateEmployeeSalaryDetailsGrid(blankArray);
		        	break;
				case 'empDisciplineDetails':
					if(getSelectedEmployeeId() > 0) fetchEmployeeDisciplineData(getSelectedEmployeeId());
					else {
						updateEmployeeDisciplinaryDetailsGrid(blankArray);
						updateEmployeeDoingGoodGrid(blankArray);
					}
		        	break;
				case 'empLeavesDetails':
					if(getSelectedEmployeeId() > 0) fetchEmployeeLeavesData(getSelectedEmployeeId());
					else updateEmployeeLeavesGrid(blankArray);
					
		        	break;
				case 'empLaborDetails':
					if(getSelectedEmployeeId() > 0) fetchEmployeeLaborData(getSelectedEmployeeId());
					else updateEmployeeLaborDetailsGrid(blankArray);
					break;
				}
		    	checkTitles(child);
		    },
		    resetSelectedPaneToBlank = function(){
		    	var employeeTabsContainer = registry.byId("employeeInfoTabContainer");
		    	var child = employeeTabsContainer.selectedChildWidget;
		    	switch(child.get('id')){
				case 'empSalaryDetails':
					updateEmployeeSalaryDetailsGrid(blankArray);
		        	break;
				case 'empDisciplineDetails':
					updateEmployeeDisciplinaryDetailsGrid(blankArray);
					updateEmployeeDoingGoodGrid(blankArray);
					break;
				case 'empLeavesDetails':
					updateEmployeeLeavesGrid(blankArray);
					break;
				case 'empLaborDetails':
					updateEmployeeLaborDetailsGrid(blankArray);
					break;
				}
		    	hideStandBy();
		    },
		    clearGridSelections = function(){
		    	try{dijit.byId('employeesGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('employeeSalaryDetailsGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('employeeDisciplineGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('employeeDoingGoodGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('employeeLeavesGrid').selection.clear();}catch(e){}
		    	try{dijit.byId('empLaborDetailsGrid').selection.clear();}catch(e){}
		    },
		    showMessages = function(storeId, tooltip, message){
		    	if(tooltip){
			    	try{
			    		//console.log('Values provided are --> ' + storeId + ' --> ' + tooltip + ' --> ' + message);
				    	tooltip.set('content', message);
				    	popup.open({
			                popup: tooltip,
			                around: dom.byId('locationTabletr' + storeId)
			            });
				    	/*baseFx.fadeOut({
				    			onEnd : function() {
				    				popup.close(tooltip);
				    			}
				    		}).play(500);*/
				    	setTimeout(popup.close(tooltip), 5000);
					}catch(e){console.log('Error in Message Fadeout !! ' + e);};
		    	}
		    },
		    validateCell = function(cellWidget){
		    	var returnValue = false;
		    	try{returnValue = cellWidget.validate();}catch(e){returnValue=true;}
		    	return returnValue;
		    },
		    showPhotoByEmpId = function(empId, photoImgNode, photoPane, standByDomWidget){
		    	registry.byId(standByDomWidget).show();
		    	ajaxRequest.get("/service/getImage/"+empId,{
		    		handleAs: 'json'
		    	}).then(function(imageURLObject){
		    		if(imageURLObject.success){
		    			dom.byId(photoImgNode).setAttribute('src', imageURLObject.model.imageURL);
		    			otherFx.wipeIn({node: dom.byId(photoPane),duration: 1000, delay: 250, onBegin: function(node){
							domStyle.set(this.node, {display: ""});
						}}).play();
		    		}
		    		registry.byId(standByDomWidget).hide();
		    	}, function(error){
		    		console.log('Image Service is Unavailable. Please check again later.');
		    		registry.byId(standByDomWidget).hide();
		    	});
		    },
		    showPhotograph = function(){
		    	var empId = Number(getSelectedEmployeeId());
		    	var standByWidget = 'employeePaneInfoStandBy';
		    	registry.byId(standByWidget).show();
		    	ajaxRequest.get("/service/getImage/"+empId,{
		    		handleAs: 'json'
		    	}).then(function(imageURLObject){
		    		if(imageURLObject.success){
		    			dom.byId('employeeImg').setAttribute('src', imageURLObject.model.imageURL);
		    			otherFx.wipeIn({node: dom.byId('employeePaneInfo'),duration: 1000, delay: 250, onBegin: function(node){
							domStyle.set(this.node, {display: ""});
						}
					}).play();
		    		}
		    		registry.byId(standByWidget).hide();
		    	}, function(error){
		    		console.log('Image Service is Unavailable. Please check again later.');
		    		registry.byId(standByWidget).hide();
		    	});
		    },
		    hidePhotograph = function(photoPane){
		    	if(domStyle.get(dom.byId(photoPane), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId(photoPane),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
		    },
		    attachGridEvents = function(gridId){
		    	registry.byId(gridId).on("CellClick", function(evt){
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
			    			/*if(jsonRowObject.position && (addOrUpdate == 'true')){
			    				jsonRowObject.position = getSelectedEmployeePosition();
			    			}*/
			    			
			    			try{delete jsonRowObject['store']; delete jsonRowObject['updatedDate']; delete jsonRowObject['updated_date'];
				    		 delete jsonRowObject['__isDirty']; delete jsonRowObject['employeeRoles'];}catch(e){}
				    		if(addOrUpdate == 'true'){
				    			ajaxRequest.post(serviceURL, {
				        		headers: { "Content-Type":"application/json"}, 
				        		handleAs: 'json', data: json.stringify(jsonRowObject), timeout: 10000
				        			}).then(function(employeeUpdateResponse){
				        				if(employeeUpdateResponse.success){
				        				console.log('Update Success ');
				        				dom.byId('messages').innerHTML = 'Add Successful';
				        				try{grid.selection.getSelected()[0].store='';}catch(e){}
				        				if(evt.grid.get('id') == 'employeesGrid'){
				        					fetchEmployeesData(registry.byId('hiddenStoreId').get('value'));
				        					resetSelectedPaneToBlank();
				        				}else if(evt.grid.get('id') == 'mgrLeavesGrid'){
				        					registry.byId(standByWidgetId).hide();
				        					fetchMgrLeavesData(registry.byId('mgrList').get('value'));
				        				} else refreshSelectedPane();//hideStandBy();
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
				        			}).then(function(employeeUpdateResponse){
				        				if(employeeUpdateResponse.success){
				        				console.log('Update Success ');
				        				dom.byId('messages').innerHTML = 'Update Success';
				        				try{grid.selection.getSelected()[0].store='';}catch(e){}
				        				if(evt.grid.get('id') == 'employeesGrid'){
				        					fetchEmployeesData(registry.byId('hiddenStoreId').get('value'));
				        					resetSelectedPaneToBlank();
				        				}else if(evt.grid.get('id') == 'mgrLeavesGrid'){
				        					registry.byId(standByWidgetId).hide();
				        				} else hideStandBy();
				        			}
				        		}, function(error){
				        			console.log('Error while updating --> ' + error);
				        			dom.byId('messages').innerHTML = 'Error while updating --> ' + error;
				        			registry.byId(standByWidgetId).hide();
				        		});
					    	}
		    			}else {
		    				hideStandBy();
		    			}
		    		} else if(evt.cellIndex == 10){
		    			if(evt.grid.get('id') == 'employeesGrid'){
		    				refreshSelectedPane();
		    				showPhotograph();
		    			}
					} else if(evt.grid.get('id') == 'employeesGrid'){ 
							resetSelectedPaneToBlank();
							hidePhotograph('employeePaneInfo');
						} else {
							//hidePhotograph('employeePaneInfo');
							hideStandBy();
						}
		    	}, true);
		    },
		    createAddUpdateLink = function(value, rowIndex){
		    	if(value === '__new__')
		    		return '<span style="text-align: center;"><a href="#">Add</a></span>';
		    	else return '<span style="text-align: center;"><a href="#">Update</a></span>';
		    },
		    createShowDetailsLink = function(id){
		    	return '<span style="text-align: center;"><a href="#">Show Details</a></span>';
		    },
		    updateEmployeesGrid = function(employeesData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = employeesData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('employeesGrid')){ 
					employeesGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											            cells: [{ name: "Update", field: 'store', width: "5%", noresize: true, formatter: createAddUpdateLink},
											            { name: "First Name", field: "fname", width: "8%", noresize: true, editable: true, 
											            	constraint:{required: true}, widgetProps: {maxLength: 25, promptMessage: 'First Name within 25 characters', 
											            	missingMessage: 'Please provide First Name' }, widgetClass: ValidationTextBox},
											            { name: "Last Name", field: "lname", width: "8%", noresize: true, editable: true, 
											            	constraint:{required: true}, widgetProps: {maxLength: 25, promptMessage: 'Last Name within 25 characters', 
											            	missingMessage: 'Please provide Last Name' }, widgetClass: ValidationTextBox},
											            { name: "Date Hired", field: "hiredDate", width: "8%", noresize: true, editable: true, 
											            	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
											            	promptMessage: 'Provide date in DD/MM/YYYY', missingMessage: 'Please provide date in DD/MM/YYYY', 
											            	invalidMessage: 'Date format should be in DD/MM/YYYY'}, widgetClass: ValidationTextBox },
											            { name: "Position", field: "position", width: "10%", editable: true, noresize: true, 
											            	type: dojox.grid.cells.Select, options: ['Manager', 'Front','Cook']},
											            { name: "Work Cell", field: "phone", width: "10%", noresize: true, editable: true, hidden: false, 
												            constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Work Cell within 20 characters', 
												            missingMessage: 'Please provide Work Cell' }, widgetClass: ValidationTextBox},
												        { name: "Personal", field: "personalPhone", width: "10%", noresize: true, editable: true, hidden: false, 
												            constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Personal Number within 20 characters', 
													        missingMessage: 'Please provide Personal Number' }, widgetClass: ValidationTextBox},
													    { name: "Emergency Contact", field: "emergencyContact", width: "15%", noresize: true, editable: true, hidden: false, 
													        constraint:{required: true}, widgetProps: {maxLength: 30, promptMessage: 'Emergency Contact Details within 30 characters', 
														    missingMessage: 'Please provide Emergency Contact Details' }, widgetClass: ValidationTextBox},
														{ name: "Address", field: "address", width: "14%", noresize: true, editable: true, hidden: false, 
													            constraint:{required: true}, widgetProps: {maxLength: 40, promptMessage: 'Home Address within 40 characters', 
														        missingMessage: 'Please provide Home Address' }, widgetClass: ValidationTextBox},
											            { name: "Username", field: "username", width: "1%", noresize: true, editable: true, hidden: true, 
											            	constraint:{required: false}, widgetProps: {maxLength: 20, promptMessage: 'Username within 20 characters', 
											            	missingMessage: 'Please provide Username' }, widgetClass: ValidationTextBox},
											            { name: "Details", field: 'id', width: "10%", noresize: true, formatter: createShowDetailsLink},
											            { name: "Store", field: "storeId", width: "1%", editable: true, noresize: true, hidden: true}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
										    errorMessage:   'Oops we could not retrive the requested data!',
										    noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>No Data to Display !!!</font></span>",
										    onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
										    selectionMode: "single",
										    //rowSelector: '15px',
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
										        }}, "employeesGrid");
					employeesGrid.startup();
				}	else dijit.byId('employeesGrid').setStore(gridDataStore);
				/*if((employeesGrid.rowCount > 0) && (employeesGrid.selection.selectedIndex >= 0)){
					employeesGrid.selection.setSelected(employeesGrid.selection.selectedIndex, false);
				}
				if(employeesGrid.rowCount > 0)	employeesGrid.selection.setSelected(0, true);*/
				//try{showMessages(1, registry.byId('messagesTooltip'), 'Data Loaded Successfully !!! ');}catch(e){console.log('Exception ' + e);}
		    },
		    formatCurrency = function(inDatum){
		    	return isNaN(inDatum) ? '...' : dojo.currency.format(inDatum, this.constraint);
		    },
		    updateEmployeeSalaryDetailsGrid = function(empSalaryData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = empSalaryData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('employeeSalaryDetailsGrid')){
					employeeSalaryDetailsGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											            cells: [{ name: "Update", field: 'store', width: "8%", noresize: true, formatter: createAddUpdateLink},
											            { name: "Date Of Increment", field: "incrementDate", width: "20%", noresize: true, editable: true, 
												        	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
												        	promptMessage: 'Provide date in DD/MM/YYYY', missingMessage: 'Please provide date in DD/MM/YYYY', 
												        	invalidMessage: 'Date format should be in DD/MM/YYYY'}, widgetClass: ValidationTextBox },
											            { name: "Increment Amount", field: "increment", width: "15%", noresize: true, editable: true, 
											            	formatter: formatCurrency, constraint:{currency: 'USD', required: true, min:1, max:1000, fractional:true}, 
											            	widgetProps: { promptMessage: 'Provide the increment Amount in USD', rangeMessage: 'Min 1$ and Max 1000$',
											            	missingMessage: 'Please provide Increment', invalidMessage:"Invalid Amount. Cents are MANDATORY." }, 
											            	widgetClass: CurrencyTextBox},
											            { name: "Salary Before Increment", field: "salBefInc", width: "20%", noresize: true, editable: true, 
											            	formatter: formatCurrency, constraint:{currency: 'USD', required: true, min:1, max:9999, fractional:true}, 
											            	widgetProps: { promptMessage: 'Provide the Salary before increment in USD', rangeMessage: 'Min 1$ and Max 9999$',
											            	missingMessage: 'Please provide Salary', invalidMessage:"Invalid Amount. Cents are MANDATORY." }, 
											            	widgetClass: CurrencyTextBox},
											            { name: "Salary After Increment", field: "salAftInc", width: "20%", noresize: true, editable: true, 
											            	formatter: formatCurrency, constraint:{currency: 'USD', required: true, min:1, max:9999, fractional:true}, 
											            	widgetProps: { promptMessage: 'Provide the Salary After Increment in USD', rangeMessage: 'Min 1$ and Max 9999$',
											            	missingMessage: 'Please provide Salary', invalidMessage:"Invalid Amount. Cents are MANDATORY." }, 
											            	widgetClass: CurrencyTextBox},
											            { name: "Notes", field: "notes", width: "20%", noresize: true, editable: true, 
											        	   		constraint:{required: true}, widgetProps: {maxLength: 100, 
											        	   		promptMessage: 'Provide Notes in not more than 100 characters', 
											        	   		missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											            singleClickEdit: true,
														rowsPerPage: 10,
														loadingMessage: 'loadingMessage: Loading data from server..',
													    errorMessage:   'Oops we could not retrive the requested data!',
													    noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Salary Details not available. Please Enter !!!</font></span>",
													    onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
													    selectionMode: "single",
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
											        }}, "employeeSalaryDetailsGrid");
					employeeSalaryDetailsGrid.startup();
				} else dijit.byId('employeeSalaryDetailsGrid').setStore(gridDataStore);
		    },
		    updateEmployeeDisciplinaryDetailsGrid = function(empDisciplineData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = empDisciplineData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('employeeDisciplineGrid')){
					employeeDisciplineGrid = new DataGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											            cells: [{ name: "Update", field: "store", width: "18%", noresize: true, formatter: createAddUpdateLink},
												{ name: "Date", field: "date", width: "22%", noresize: true, editable: true, 
										        	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
										        	promptMessage: 'Provide date in DD/MM/YYYY', missingMessage: 'Please provide date in DD/MM/YYYY', 
										        	invalidMessage: 'Date format should be in DD/MM/YYYY'}, widgetClass: ValidationTextBox },
										        { name: "Info", field: "notes", width: "60%", noresize: true, editable: true, 
								        	   		constraint:{required: true}, widgetProps: {maxLength: 100, 
								        	   		promptMessage: 'Provide Notes in not more than 100 characters', 
								        	   		missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
										    errorMessage:   'Oops we could not retrive the requested data!',
										    noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Disciplinary Details not available. Please Enter !!!</font></span>",
										    onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
										    selectionMode: "single",
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
								        }}, "employeeDisciplineGrid");
					employeeDisciplineGrid.startup();
				} else dijit.byId('employeeDisciplineGrid').setStore(gridDataStore);
		    },
		    updateEmployeeDoingGoodGrid = function(empDoingGoodData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = empDoingGoodData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('employeeDoingGoodGrid')){
					employeeDoingGoodGrid = new DataGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											            cells: [{ name: "Update", field: "store", width: "18%", noresize: true, formatter: createAddUpdateLink},
														{ name: "Date", field: "date", width: "22%", noresize: true, editable: true, 
												        	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
												        	promptMessage: 'Provide date in DD/MM/YYYY', missingMessage: 'Please provide date in DD/MM/YYYY', 
												        	invalidMessage: 'Date format should be in DD/MM/YYYY'}, widgetClass: ValidationTextBox },
												        { name: "Info", field: "notes", width: "60%", noresize: true, editable: true, 
										        	   		constraint:{required: true}, widgetProps: {maxLength: 100, 
										        	   		promptMessage: 'Provide Notes in not more than 100 characters', 
										        	   		missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
											errorMessage:   'Oops we could not retrive the requested data!',
											noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Doing Good Details not available. Please Enter !!!</font></span>",
											onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
											selectionMode: "single",
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
								        }}, "employeeDoingGoodGrid");
					employeeDoingGoodGrid.startup();
				} else dijit.byId('employeeDoingGoodGrid').setStore(gridDataStore);
		    },
		    updateEmployeeLeavesGrid = function(empLeavesData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = empLeavesData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('employeeLeavesGrid')){
					employeeLeavesGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											           cells: [{ name: "Update", field: "store", width: "20%", noresize: true, formatter: createAddUpdateLink},
														{ name: "Date", field: "date", width: "20%", noresize: true, editable: true, 
											        	   constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
											        		   promptMessage: 'Provide date in DD/MM/YYYY', missingMessage: 'Please provide date in DD/MM/YYYY', 
											        		   invalidMessage: 'Date format should be in DD/MM/YYYY'}, 
											        		   widgetClass: ValidationTextBox},
														{ name: "Reason", field: "reason", width: "20%", noresize: true, editable: true, 
											        	   			constraint:{required: true}, widgetProps: {maxLength: 100, 
											        	   				promptMessage: 'Provide Reason in not more than 100 characters', 
											        	   				missingMessage: 'Please provide Reason for Leave' }, widgetClass: ValidationTextBox},
														{ name: "Excused/Not?", field: "excused", width: "20%", noresize: true, editable: true, type: dojox.grid.cells.Bool},
														{ name: "Active hrs", field: "activeHrs", width: "20%", noresize: true, editable: true,
															 constraint:{required: true}, widgetProps: {validator: validateNumericDigits, 
																 promptMessage: 'Provide Active Hrs before Leave', missingMessage: 'Please provide Active hrs', 
												        		 invalidMessage: 'Active Hrs should be numeric and not more than 2 digits'}, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
											errorMessage:   'Oops we could not retrive the requested data!',
											noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Leaves Details not available. Please Enter !!!</font></span>",
											onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
											selectionMode: "single",
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
								        }}, "employeeLeavesGrid");
					employeeLeavesGrid.startup();
				} else dijit.byId('employeeLeavesGrid').setStore(gridDataStore);
		    },
		    updateMgrLeavesGrid = function(mgrLeavesData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = mgrLeavesData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('mgrLeavesGrid')){
					employeeLeavesGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											           cells: [{ name: "Update", field: "store", width: "15%", noresize: true, formatter: createAddUpdateLink},
														{ name: "Date", field: "date", width: "35%", noresize: true, editable: true, 
											        	   constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
											        		   promptMessage: 'Provide date in DD/MM/YYYY', missingMessage: 'Please provide date in DD/MM/YYYY', 
											        		   invalidMessage: 'Date format should be in DD/MM/YYYY'}, 
											        		   widgetClass: ValidationTextBox},
														{ name: "Notes", field: "reason", width: "50%", noresize: true, editable: true, 
											        	   			constraint:{required: true}, widgetProps: {maxLength: 100, 
											        	   				promptMessage: 'Provide Notes in not more than 100 characters', 
											        	   				missingMessage: 'Please provide Notes for Leave' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											rowsPerPage: 20,
											loadingMessage: 'loadingMessage: Loading data from server..',
											errorMessage:   'Oops we could not retrive the requested data!',
											noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Leaves Details not available. Please Enter !!!</font></span>",
											onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
											selectionMode: "single"
											}, "mgrLeavesGrid");
					employeeLeavesGrid.startup();
				} else dijit.byId('mgrLeavesGrid').setStore(gridDataStore);
		    },
		    updateEmployeeLaborDetailsGrid = function(empLaborData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = empLaborData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('empLaborDetailsGrid')){
					empLaborDetailsGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
											            cells: [{ name: "Update", field: "store", width: "10%", noresize: true, formatter: createAddUpdateLink},
														{ name: "Date", field: "date", width: "10%", noresize: true, editable: true, constraint:{required: true}, 
											            	widgetProps: {validator: validateDatePattern, promptMessage: 'Provide date in DD/MM/YYYY', 
											            	missingMessage: 'Please provide date in DD/MM/YYYY', invalidMessage: 'Date format should be in DD/MM/YYYY'},
											            	widgetClass: ValidationTextBox},
											            { name: "Position", field: "position", width: "10%", noresize: true, editable: false},
														{ name: "Time From", field: "timeFrom", width: "10%", noresize: true, editable: true, widgetClass: TimeTextBox, widgetProps: {openOnClick: true}, formatter: formatTime,
											            		constraint: {timePattern: 'HH:mm', clickableIncrement: 'T01:00', visibleIncrement: 'T01:00', visibleRange: 'T01:00', required: true}, getValue: getTimeValue},
														{ name: "Time To", field: "timeTo", width: "10%", noresize: true, editable: true, widgetClass: TimeTextBox, widgetProps: {openOnClick: true}, formatter: formatTime,
												            		constraint: {timePattern: 'HH:mm', clickableIncrement: 'T01:00', visibleIncrement: 'T01:00', visibleRange: 'T01:00', required: true}, getValue: getTimeValue}]}],
											singleClickEdit: true,
											rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
											errorMessage:   'Oops we could not retrive the requested data!',
											noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Labor Details not available. Please Enter !!!</font></span>",
											onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
											selectionMode: "single",
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
								        }}, "empLaborDetailsGrid");
					empLaborDetailsGrid.startup();
				} else dijit.byId('empLaborDetailsGrid').setStore(gridDataStore);
		    },
		    validateDatePattern = function(value, constraints){
		    	var reg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
		    	var returnValue = reg.test(value);
		    	return returnValue;
		    },
		    validateNumericDigits = function(value){
		    	var reg = /^[1-9]?\d$/;
		    	var returnValue = reg.test(value);
		    	return returnValue;
		    },
		    updateEmployeeLaborDetailsGrid2 = function(empLaborData){
		    	var gridDataStore = Observable(new Memory({idProperty: "id", data: empLaborData}));
		    	if(!dijit.byId('empLaborDetailsGrid')){
					var EmployeeLaborDetailsGrid = declare([Grid, Pagination, Keyboard, Selection, DijitRegistry]);
					empLaborDetailsGrid = new EmployeeLaborDetailsGrid({store: gridDataStore, columns: [{ label: "Update", field: "store", width: "10%", formatter: createAddUpdateLink},
							           editor({label: "Date", field: "date", width: "10%",  autoSave: true, 
							        	   editorArgs: {required: true, trim: true, maxlength: 10, intermediateChanges: false, invalidMessage: 'Invalid Date', missingMessage: 'Required', 
							        		   validator: function(value){return validateDatePattern(value);}}}, ValidationTextBox, "click"),
					        	{label: "Time From", field: "timeFrom", width: "10%"},
					        	{label: "Time To", field: "timeTo", width: "10%"}],
					        	pagingLinks: 3, pagingTextBox: true, firstLastArrows: true, selectionMode: "single", showLoadingMessage: true, 
					        	rowsPerPage: 10, previousNextArrows: true, pagingLinks: 2, cellNavigation: true}, "empLaborDetailsGrid");
				} else empLaborDetailsGrid = dijit.byId('empLaborDetailsGrid');
		    	empLaborDetailsGrid.set('store', gridDataStore);
		    	empLaborDetailsGrid.resize();
		    	empLaborDetailsGrid.on("dgrid-datachange", function(evt){
					console.log("data changed: ", evt.oldValue, " -> ", evt.value);
					console.log("cell: ", evt.cell, evt.cell.row.id);
				});
		    	/*empLaborDetailsGrid.on("dgrid-editor-show", function(evt){
					console.log("show editOn editor: ", evt);
				});
		    	empLaborDetailsGrid.on("dgrid-editor-hide", function(evt){
					console.log("hide editOn editor: ", evt);
				});*/
		    },
		    fetchEmployeesData = function(storeId) {
		    	showStandBy();
		    	ajaxRequest.get("/service/store/" + storeId + "/employees",{
		    		handleAs: 'json'
		    	}).then(function(employeeDetailsResponse){
		    		if(employeeDetailsResponse.success){
		    			updateEmployeesGrid(employeeDetailsResponse.models);
		    		}
		    		hideStandBy();
		    	}, function(error){
		    		console.error('Error occurred while fetching employees data ' + error);
		    		hideStandBy();
		    	});
		    },
		    fetchEmployeeSalaryData = function(empId) {
		    	registry.byId('employeeSalaryDetailsGridStandBy').show();
		    	ajaxRequest.get("/service/employee/" + empId + "/salary",{
		    		handleAs: 'json'
		    	}).then(function(employeeSalaryResponse){
		    		if(employeeSalaryResponse.success){
		    			updateEmployeeSalaryDetailsGrid(employeeSalaryResponse.models);
		    		}
		    		registry.byId('employeeSalaryDetailsGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	}, function(error){
		    		console.error('Error occurred while fetching employees salary data ' + error);
		    		registry.byId('employeeSalaryDetailsGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	});
		    },
		    fetchEmployeeDisciplineData = function(empId) {
		    	registry.byId('employeeDisciplineGridStandBy').show();
		    	registry.byId('employeeDoingGoodGridStandBy').show();
		    	ajaxRequest.get("/service/employee/" + empId + "/discipline",{
		    		handleAs: 'json'
		    	}).then(function(employeeDisciplineResponse){
		    		if(employeeDisciplineResponse.success){
		    			var disciplineList = [], doingGoodList = [];
		    			baseArray.forEach(employeeDisciplineResponse.models, function(item){
		    				if(item.notesType === 'disc') disciplineList.push(item);
		    				else doingGoodList.push(item);
		    			});
		    			updateEmployeeDisciplinaryDetailsGrid(disciplineList);
		    			updateEmployeeDoingGoodGrid(doingGoodList);
		    		}
		    		registry.byId('employeeDisciplineGridStandBy').hide();
		    		registry.byId('employeeDoingGoodGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	}, function(error){
		    		console.error('Error occurred while fetching employees discipline data ' + error);
		    		registry.byId('employeeDisciplineGridStandBy').hide();
		    		registry.byId('employeeDoingGoodGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	});
		    },
		    fetchEmployeeLeavesData = function(empId) {
		    	registry.byId('employeeLeavesGridStandBy').show();
		    	ajaxRequest.get("/service/employee/" + empId + "/leaves",{
		    		handleAs: 'json'
		    	}).then(function(employeeLeavesResponse){
		    		if(employeeLeavesResponse.success){
		    			updateEmployeeLeavesGrid(employeeLeavesResponse.models);
		    		}
		    		registry.byId('employeeLeavesGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	}, function(error){
		    		console.error('Error occurred while fetching employees leaves data ' + error);
		    		registry.byId('employeeLeavesGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	});
		    },
		    fetchMgrLeavesData = function(empId) {
		    	registry.byId('mgrLeavesGridStandBy').show();
		    	ajaxRequest.get("/service/employee/" + empId + "/leaves",{
		    		handleAs: 'json'
		    	}).then(function(mgrLeavesResponse){
		    		if(mgrLeavesResponse.success){
		    			updateMgrLeavesGrid(mgrLeavesResponse.models);
		    		}
		    		registry.byId('mgrLeavesGridStandBy').hide();
		    	}, function(error){
		    		console.error('Error occurred while fetching Manager leaves data ' + error);
		    		registry.byId('mgrLeavesGridStandBy').hide();
		    	});
		    },
		    fetchEmployeeLaborData = function(empId) {
		    	registry.byId('empLaborDetailsGridStandBy').show();
		    	ajaxRequest.get("/service/store/"+ registry.byId('hiddenStoreId').get('value') + "/employee/" + empId + "/labor",{
		    		handleAs: 'json'
		    	}).then(function(employeeLaborResponse){
		    		if(employeeLaborResponse.success){
		    			updateEmployeeLaborDetailsGrid(employeeLaborResponse.models);
		    		}
		    		registry.byId('empLaborDetailsGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	}, function(error){
		    		console.error('Error occurred while fetching employees labor data ' + error);
		    		registry.byId('empLaborDetailsGridStandBy').hide();
		    		registry.byId('employeesGridStandBy').hide();
		    	});
		    },
		    getSelectedEmployeeId = function(){
		    	try{
			    	if(registry.byId('employeesGrid').rowCount > 0)
			    		return registry.byId('employeesGrid').selection.getSelected()[0].id;
			    	else 
			    		return 0;
		    	}catch(e){	return 0;	}
		    },
		    getSelectedEmployeePosition = function(){
		    	return registry.byId('employeesGrid').selection.getSelected()[0].position[0];
		    },
		    addRow = function(gridId, empId){
		    	var recordToAdd={};
		    	try{
		    		var gridStore = dijit.byId(gridId).store;
		    		var randomNumber = getRandomId();
		    		switch(gridId){
				    	case 'employeesGrid': 
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), fname: 'First Name', lname: 'Last Name', 
				    			hiredDate: '29/05/2013', username: 'Add User Name', position: 'Front', phone: 'Add Phone', active: true, mgr: 1,
				    			updatedBy: 1, updated_date: '', store: '__new__', _self: '/service/store/'+registry.byId('hiddenStoreId').get('value')+'/employee/0', post: true};
				    		break;
				    	case 'employeeSalaryDetailsGrid': 
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, increment: 'Add Amt in USD', 
				    			incrementDate: 'Add Increment Date', _self: '/service/employee/'+empId+'/salary', post: true, salBefInc: 'Current Salary', salAftInc: 'Salary After Increment', 
				    			notes: 'Add Notes', active: true, updated_by: 1, updated_date: '', store: '__new__'};
				    		break;
				    	case 'employeeDisciplineGrid': 
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: 'Add Date', 
				    			 _self: '/service/employee/'+empId+'/discipline', post: true, notes: 'Add Notes', notesType: 'disc', active: true, updatedBy: 1, updatedDate: '', store: '__new__'};
				    		break;
				    	case 'employeeDoingGoodGrid':
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: 'Add Date', 
				    			 _self: '/service/employee/'+empId+'/discipline', post: true, notes: 'Add Notes', notesType: 'good', active: true, updatedBy: 1, updatedDate: '', store: '__new__'};
				    		break;
				    	case 'employeeLeavesGrid':
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: '23/12/2013', active: true,
				    			 _self: '/service/employee/'+empId+'/leaves', post: true, reason: 'Reason in not More than 100 Characters', excused: false, activeHrs: 0, updatedBy: 1, updatedDate: '', store: '__new__'};
				    		break;
				    	case 'mgrLeavesGrid':
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: '23/12/2013', active: true,
				    			 _self: '/service/employee/'+empId+'/leaves', post: true, reason: 'Notes in not More than 100 Characters', excused: false, activeHrs: 0, updatedBy: 1, updatedDate: '', store: '__new__'};
				    		break;
				    	case 'empLaborDetailsGrid':
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: '20/12/2013', position: getSelectedEmployeePosition(), active: true,
				    			 _self: '/service/store/' + registry.byId('hiddenStoreId').get('value') + '/employee/'+empId+'/labor', post: true, timeFrom: '09:00', timeTo: '17:00', updatedBy: 1, store: '__new__'};
				    		break;
				    }
			    	//try{gridStore.newItem(recordToAdd);}catch(e){gridStore.add(recordToAdd);}
		    		gridStore.newItem(recordToAdd);
		    	} catch(e){
		    		console.log('Error while adding Row --> ' + e);
		    	}
		    };
		    
		    return {
		        init: function() {
		            startup();
		        },
		        populateEmployeesData: function(storeId){
		        	clearGridSelections();
		        	fetchEmployeesData(storeId);
		        	refreshSelectedPane();
		        },
		        hidePhoto: function(photoPane){
		        	hidePhotograph(photoPane);
		        },
		        getEmployeeId: function(){
		        	var empId = getSelectedEmployeeId();
		        	return empId;
		        },
		        populateEmployeeDetails: function(empId){
		        	refreshSelectedPane();
		        },
		        addRowInGrid: function(gridId){
		        	if(gridId === 'employeesGrid') 
		        		addRow(gridId, getSelectedEmployeeId());
		        	else if(gridId === 'mgrLeavesGrid')
		        		addRow(gridId, registry.byId('mgrList').get('value'));
		        	else if(getSelectedEmployeeId() > 0)
		        		addRow(gridId, getSelectedEmployeeId());
		        },
			    postCreate: function(){
			    	console.log('Calling Tab Container Listener ' + registry.byId("employeeInfoTabContainer"));
				    dojo.connect(registry.byId("employeeInfoTabContainer"), "selectChild", function(child){
						baseArray.forEach(registry.byId("employeeInfoTabContainer").getChildren(), function(empTab){
							if(empTab.get('title').indexOf(' &nbsp; <img ') > 0){
								empTab.set('title', empTab.get('title').substring(0, empTab.get('title').indexOf(' &nbsp; <img ')));
							}
						});
						if(getSelectedEmployeeId() > 0)
						{
							switch(child.get('id')){
								case 'empSalaryDetails':
									child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeSalaryTabRecord(event);'/> &nbsp;");
									break;
								case 'empDisciplineDetails':
									child.set('title', child.get('title') + "");
									break;
								case 'empLeavesDetails':
									child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeLeavesTabRecord(event);'/> &nbsp;");
									break;
								case 'empLaborDetails':
									child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeLaborTabRecord(event);'/> &nbsp;");
									break;
							}
							refreshSelectedPane();
						}
					});
		        },
		        populateManagerTabDetails: function(storeId){
		        	var mgrArray = [{id: 0, label: 'Select Manager'}];
		        	var mgrStoreItem = {};
		        	var standByWidget = 'managerDetailsStandBy';
		        	registry.byId(standByWidget).show();
		        	ajaxRequest.get("/service/store/" + storeId + "/managers",{
			    		handleAs: 'json'
			    	}).then(function(mgrDetailsResponse){
			    		if(mgrDetailsResponse.success){
			    			baseArray.forEach(mgrDetailsResponse.models, function(item){
			    				mgrStoreItem = {};
			    				mgrStoreItem.id = item.id;
			    				mgrStoreItem.label = item.fname + ' ' + item.lname;
			    				mgrArray.push(lang.mixin(mgrStoreItem, item));
			    			});
			    			var store = new Memory({idProperty: "id", data:mgrArray});
			    			var objectsStore = new ObjectStore({objectStore: store});
			    			try{registry.byId('mgrList').setStore(objectsStore, 0);}catch(e){}
			    		}
			    		registry.byId(standByWidget).hide();
			    	}, function(error){
			    		registry.byId(standByWidget).hide();
			    		console.error('Error occurred while fetching employees data ' + error);
			    	});
		        },
		        populateEmployeesSelectWidget: function(storeId){
		        	var array = [{id: 0, value: 0, label: '-Name- (pos)'}];
		        	var storeItem = {};
		        	var standByWidget = 'calendarEntryTitlePaneStandBy';
		        	registry.byId(standByWidget).show();
		        	ajaxRequest.get("/service/store/" + storeId + "/employees",{
			    		handleAs: 'json'
			    	}).then(function(response){
			    		if(response.success){
			    			baseArray.forEach(response.models, function(item){
			    				storeItem = {};
			    				storeItem.id = (item.id+'');
			    				storeItem.value = (item.id+'');
			    				storeItem.label = item.fname + ' (' + item.position + ')';
			    				array.push(lang.mixin(storeItem, item));
			    			});
			    			var store = new Memory({idProperty: "id", data:array});
			    			var objectsStore = new ObjectStore({objectStore: store});
			    			try{registry.byId('itemSummaryEditor').set('options', []);
			    				dijit.byId('itemSummaryEditor').addOption(array);
			    			}catch(e){}
			    		}
			    		registry.byId(standByWidget).hide();
			    	}, function(error){
			    		registry.byId(standByWidget).hide();
			    		console.error('Error occurred while fetching employees data ' + error);
			    	});
		       },
		       showPhotoByEmpId: function(empId, photoImgNode, photoPane, standByDomWidget){
		    	   showPhotoByEmpId(empId, photoImgNode, photoPane, standByDomWidget);
		       },
		       populateManagerInfo: function(selectedItem){
		    	   	var mgrPaneDetailsNode = dom.byId('mgrPaneInfoUl');
					domConstruct.empty(mgrPaneDetailsNode);
					var fragment,  innerHTMLText;
					
					fragment = document.createDocumentFragment();
					innerHTMLText = '<b>Name: </b> ' + selectedItem.label;
					domConstruct.create("li", {
                       innerHTML: innerHTMLText
                   }, fragment);
					domConstruct.place(fragment, mgrPaneDetailsNode);
					
					fragment = document.createDocumentFragment();
					innerHTMLText = '<b>Type: </b> ' + selectedItem.position;
					domConstruct.create("li", {
	                    innerHTML: innerHTMLText
	                }, fragment);
					domConstruct.place(fragment, mgrPaneDetailsNode);
					
					fragment = document.createDocumentFragment();
					innerHTMLText = '<b>Work Cell: </b> ' + selectedItem.phone + ' <b>Personal: </b>' + selectedItem.personalPhone;
					domConstruct.create("li", {
	                    innerHTML: innerHTMLText
	                }, fragment);
					domConstruct.place(fragment, mgrPaneDetailsNode);
					
					fragment = document.createDocumentFragment();
					innerHTMLText = '<b>Emergency Contact: </b> ' + selectedItem.emergencyContact;
					domConstruct.create("li", {
	                    innerHTML: innerHTMLText
	                }, fragment);
					domConstruct.place(fragment, mgrPaneDetailsNode);
					
					fragment = document.createDocumentFragment();
					innerHTMLText = '<b>Home Address: </b> ' + selectedItem.address;
					domConstruct.create("li", {
	                    innerHTML: innerHTMLText
	                }, fragment);
					domConstruct.place(fragment, mgrPaneDetailsNode);
		       },
		       fetchManagerContractBlobs: function(storeId){
			    	registry.byId('mgrContractStandBy').show();
			    	ajaxRequest.get("/service/blobs/mgrContract/" + storeId,{
			    		handleAs: 'json'
			    	}).then(function(blobsResponse){
			    		var uploadFilesNode = dom.byId('mgrContractExisting');
			    		domConstruct.empty(uploadFilesNode);
			    		var fragment;
			    		var innerHTMLText = '';
			    		baseArray.forEach(blobsResponse.models, function(blob){
			    			fragment = document.createDocumentFragment();
			    			innerHTMLText = '&nbsp;&nbsp;&nbsp;<img src="resources/images/icon-pdf.png"/> &nbsp;' + ((blob.fileName.length > 20) ? (blob.fileName.substr(0, 20)+'...') : blob.fileName) + 
			    					'&nbsp;<a target="_new" href="/service/getBlob/' + blob.blobKey + '">Download</a>';
			    			domConstruct.create("li", {
		                        innerHTML: innerHTMLText
		                    }, fragment);
				    		domConstruct.place(fragment, uploadFilesNode);
			    		});
			    		registry.byId('mgrContractStandBy').hide();
			    	}, function(error){
			    		console.log('Error occurred while fetching store data ' + error);
			    		registry.byId('mgrContractStandBy').hide();
			    	});
			    },
			    fetchMgrLeavesDetails: function(empId){
			    	fetchMgrLeavesData(empId);
			    },
			    resetMgrLeavesGrid: function(){
			    	updateMgrLeavesGrid([]);
			    }
		    };
});