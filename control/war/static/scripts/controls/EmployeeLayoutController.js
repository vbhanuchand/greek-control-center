define([ "dojo/_base/declare", "dijit/dijit", "dojo/dom-form", "dijit/registry", "dojo/dom", "dojo/dom-style", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/string", "dojo/on", 
         "dojo/keys", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/json", "dojo/_base/config", "dojo/fx", "dojo/io-query", "dojo/_base/window", "dojo/aspect",
		"dojo/date/locale",  "dojo/_base/fx", "dojox/layout/TableContainer", "dijit/form/TextBox", "dijit/layout/ContentPane", "dijit/form/SimpleTextarea", "dijit/form/Textarea",
		"dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/Calendar", "dijit/TitlePane", "dijit/form/FilteringSelect",	"dijit/form/Form", 
		"dijit/Dialog", "dijit/form/DropDownButton", "dijit/form/Button", "dijit/form/DateTextBox", "dojox/grid/DataGrid", "dojox/grid/EnhancedGrid", "dojo/store/Memory", 
		"dojo/query", "dojo/_base/declare", "dojo/has", "dojo/data/ObjectStore", "dojo/request", "dojox/form/Manager", "dojox/math/random/Simple", "dojox/lang/functional",
		"dojo/data/ItemFileWriteStore", "dojox/grid/cells/dijit", "dijit/form/TimeTextBox", "dijit/form/ValidationTextBox",	"dijit/form/CurrencyTextBox", "dojo/store/Observable",  
		"dijit/TooltipDialog", "dijit/popup", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Pagination"],
		function(declare, dijit, domForm, registry, dom, domStyle, domClass, domConstruct, domGeometry, string, on, 
				keys, lang, baseArray, event, json, djConfig, otherFx, ioQuery, win, aspect, 
				locale, baseFx, Table, TextBox, ContentPane, SimpleTextArea, TextArea, 
				BorderContainer, TabContainer, Calendar, TitlePane, FilteringSelect, Form, 
				Dialog, DropDownButton, Button, DateTextBox, DataGrid, EnhancedGrid, Memory, 
				query, declare, has, ObjectStore, ajaxRequest, dojoxFormManager, randomNumber, functional,
				itemFileWriteStore, gridDijit, TimeTextBox, ValidationTextBox, CurrencyTextBox, Observable, Tooltip, popup) {
			var employeesGrid = registry.byId('employeesGrid'), employeeSalaryDetailsGrid = registry.byId('employeeSalaryDetailsGrid'), 
				employeeDisciplineGrid = registry.byId('employeeDisciplineGrid'), employeeDoingGoodGrid = registry.byId('employeeDoingGoodGrid'), 
				employeeLeavesGrid=registry.byId('employeeLeavesGrid'), empLaborDetailsGrid=registry.byId('empLaborDetailsGrid'), employeeDocumentsGrid=registry.byId('empDocumentsGrid'),
				storePattern = 'MM/DD/YYYY', storeTimePattern = 'HH:mm', displayPattern = 'd, MMMM yyyy', randomGen = new randomNumber(), blankArray=[],
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
				updateEmployeeDocumentsGrid(blankArray);
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
				registry.byId('employeeDocumentsGridStandBy').show();
				registry.byId('empLaborDetailsGridStandBy').show();
		    },
		    hideStandBy = function(){
		    	registry.byId('employeesGridStandBy').hide();
				registry.byId('employeeSalaryDetailsGridStandBy').hide();
				registry.byId('employeeDisciplineGridStandBy').hide();
				registry.byId('employeeDoingGoodGridStandBy').hide();
				registry.byId('employeeLeavesGridStandBy').hide();
				registry.byId('employeeDocumentsGridStandBy').hide();
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
						case 'empDocumentDetails':
							child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeDocumentsTabRecord(event);'/> &nbsp;");
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
					case 'empDocumentDetails':
						if(getSelectedEmployeeId() > 0) fetchEmployeeDocumentsData(getSelectedEmployeeId());
						else updateEmployeeDocumentsGrid(blankArray);
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
					case 'empDocumentDetails':
						updateEmployeeDocumentsGrid(blankArray);
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
		    	try{dijit.byId('empDocumentsGrid').selection.clear();}catch(e){}
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
		    	try{cellWidget.focus(); returnValue = cellWidget.validate();}catch(e){console.log('Error while Validating Cell --> ' + e);returnValue=true;}
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
							//domStyle.set(this.node, {display: ""});
							this.node.style.display = 'inline-block';
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
		    		dom.byId('messages').innerHTML = '';
		    		domConstruct.empty(dom.byId('employeePanePasswordReset'));
		    		var passwordResetNode = domConstruct.create('a', {innerHTML: '<i class="icon-refresh"></i>&nbsp;&nbsp;Reset Password&nbsp;'});
		    		on(passwordResetNode, 'click', function(){
		    			if(confirm("Please confirm to reset the employee's Password")){
			    			registry.byId(standByWidget).show();
			    			ajaxRequest.get("/service/resetPassword/"+empId,{
					    		handleAs: 'json'
					    	}).then(function(response){
					    		registry.byId(standByWidget).hide();
					    		dom.byId('messages').innerHTML = 'Password Successfully Reset to default';
					    	}, function(error){
					    		registry.byId(standByWidget).hide();
					    		dom.byId('messages').innerHTML = 'Error Occurred during Password Reset ' + error;
					    	});
			    		}
		    		});
		    		dom.byId('employeePanePasswordReset').appendChild(passwordResetNode);
		    		dom.byId('employeePanePasswordReset').style.display = '';
		    		if(imageURLObject.success){
		    			dom.byId('employeeImg').setAttribute('src', imageURLObject.model.imageURL);
		    			otherFx.wipeIn({node: dom.byId('employeePaneInfo'),duration: 1000, delay: 250, onBegin: function(node){
							//domStyle.set(this.node, {display: ""});
							this.node.style.display = 'inline-block';
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
		    		var gridBasedEventCheck1 = ((evt.grid.get('id') == 'mgrLeavesGrid') && (evt.cellIndex == 1));
		    		var gridBasedEventCheck2 = ((evt.grid.get('id') == 'employeesGrid') && (evt.cellIndex == 0));
		    		var gridBasedEventCheck3 =  !gridBasedEventCheck1 && !gridBasedEventCheck2 && ((evt.cellIndex == 1) && (evt.grid.get('id') != 'employeesGrid'));
		    		if(gridBasedEventCheck1 || gridBasedEventCheck2 || gridBasedEventCheck3){
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
			    					jsonRowObject.incrementDate = new Date(tmpDate.split('/')[2], Number(tmpDate.split('/')[0])-1, tmpDate.split('/')[1]);
			    				}catch(e){jsonRowObject.incrementDate = new Date();}
			    			}
			    			if(jsonRowObject.date){
			    				try{tmpDate = jsonRowObject.date;
		    						jsonRowObject.date = new Date(tmpDate.split('/')[2], Number(tmpDate.split('/')[0])-1, tmpDate.split('/')[1]);
			    				}catch(e){jsonRowObject.date = new Date();}
			    			}
			    			if(jsonRowObject.hiredDate){
			    				try{tmpDate = jsonRowObject.hiredDate;
		    						jsonRowObject.hiredDate = new Date(tmpDate.split('/')[2], Number(tmpDate.split('/')[0])-1, tmpDate.split('/')[1]);
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
		    		return '<span><i class="icon-plus"></i></span>';//'<span style="text-align: center;"><a href="#">Add</a></span>';
		    	else return '<span><i class="icon-save"></i></span>';
		    },
		    createDeleteLink = function(id, rowIndex){
		    	return '<span style="text-align: center;"><a href="javascript: deleteItem(\'mgr-leaves\', \'\', ' + id + ');">Delete</a></span>';
		    },
		    createSalaryDeleteLink = function(id, rowIndex){
		    	return '<span style="text-align: center;"><a href="javascript: deleteItem(\'emp-salary\', \'\', ' + id + ');">Delete</a></span>';
		    },
		    createDisciplineDeleteLink = function(id, rowIndex){
		    	return '<span style="text-align: center;"><a href="javascript: deleteItem(\'emp-discipline\', \'\', ' + id + ');">Delete</a></span>';
		    },
		    createDoingGoodDeleteLink = function(id, rowIndex){
		    	return '<span style="text-align: center;"><a href="javascript: deleteItem(\'emp-good\', \'\', ' + id + ');">Delete</a></span>';
		    },
		    createMissedShiftsDeleteLink = function(id, rowIndex){
		    	return '<span style="text-align: center;"><a href="javascript: deleteItem(\'emp-missed\', \'\', ' + id + ');">Delete</a></span>';
		    },
		    createShowDetailsLink = function(id){
		    	return '<span style="text-align: center;"><a href="#">View</a></span>';
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
											            cells: [{ name: "<i class='icon-save'></i>", field: 'store', width: "2%", noresize: true, formatter: createAddUpdateLink, styles: 'text-align: center;'},
											            { name: "First Name", field: "fname", width: "7%", noresize: true, editable: true, 
											            	constraint:{required: true}, widgetProps: {maxLength: 25, promptMessage: 'First Name within 25 characters', 
											            	missingMessage: 'Please provide First Name' }, widgetClass: ValidationTextBox},
											            { name: "Last Name", field: "lname", width: "7%", noresize: true, editable: true, 
											            	constraint:{required: true}, widgetProps: {maxLength: 25, promptMessage: 'Last Name within 25 characters', 
											            	missingMessage: 'Please provide Last Name' }, widgetClass: ValidationTextBox},
											            { name: "Date Hired", field: "hiredDate", width: "8%", noresize: true, editable: true, 
											            	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
											            	promptMessage: 'Provide date in MM/DD/YYYY', missingMessage: 'Please provide date in MM/DD/YYYY', 
											            	invalidMessage: 'Date format should be in MM/DD/YYYY'}, widgetClass: ValidationTextBox, styles: 'text-align: center;' },
											            { name: "Position", field: "position", width: "8%", editable: true, noresize: true, 
											            	type: dojox.grid.cells.Select, options: ['Manager', 'KA-Manager', 'Shift Lead', 'Front','Cook'], styles: 'text-align: center;'},
											            { name: "Cellphone", field: "phone", width: "9%", noresize: true, editable: true, hidden: false, 
												            constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Work Cell within 20 characters', 
												            missingMessage: 'Please provide Work Cell' }, widgetClass: ValidationTextBox},
												        { name: "Personal", field: "personalPhone", width: "9%", noresize: true, editable: true, hidden: false, 
												            constraint:{required: true}, widgetProps: {maxLength: 20, promptMessage: 'Personal Number within 20 characters', 
													        missingMessage: 'Please provide Personal Number' }, widgetClass: ValidationTextBox},
													    { name: "Emergency Contact", field: "emergencyContact", width: "13%", noresize: true, editable: true, hidden: false, 
													        constraint:{required: true}, widgetProps: {maxLength: 30, promptMessage: 'Emergency Contact Details within 30 characters', 
														    missingMessage: 'Please provide Emergency Contact Details' }, widgetClass: ValidationTextBox},
														{ name: "Address", field: "address", width: "15%", noresize: true, editable: true, hidden: false, 
													            constraint:{required: true}, widgetProps: {maxLength: 100, promptMessage: 'Home Address within 100 characters', 
														        missingMessage: 'Please provide Home Address' }, widgetClass: ValidationTextBox},
											            { name: "Username", field: "username", width: "7%", noresize: true, editable: true, hidden: false, 
											            	constraint:{required: false}, widgetProps: {maxLength: 20, promptMessage: 'Username within 20 characters', 
											            	missingMessage: 'Please provide Username' }, widgetClass: ValidationTextBox},
											            { name: "Details", field: 'id', width: "5%", noresize: true, formatter: createShowDetailsLink, styles: 'text-align: center;'},
											            { name: "Active", field: 'active', width: "4%", noresize: true, type: dojox.grid.cells.Bool, editable: true},
											            { name: "Store", field: "storeId", width: "0%", editable: true, noresize: true, hidden: true}]}],
											singleClickEdit: true,
											//sortInfo: -1,
											editable: true,
											selectable: true,
											//rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
										    errorMessage:   'Oops we could not retrive the requested data!',
										    noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>No Data to Display !!!</font></span>",
										    onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
										    selectionMode: "single"
										    }, "employeesGrid");
					employeesGrid.startup();
				}	else dijit.byId('employeesGrid').setStore(gridDataStore);
				/*if((employeesGrid.rowCount > 0) && (employeesGrid.selection.selectedIndex >= 0)){
					employeesGrid.selection.setSelected(employeesGrid.selection.selectedIndex, false);
				}
				if(employeesGrid.rowCount > 0)	employeesGrid.selection.setSelected(0, true);*/
				//try{showMessages(1, registry.byId('messagesTooltip'), 'Data Loaded Successfully !!! ');}catch(e){console.log('Exception ' + e);}
				//setTimeout(function () { console.log('Resizing'); dijit.byId('employeesGrid').resize(); }, 50);
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
											            cells: [{ name: "<b>Delete</b>", field: 'id', width: "8%", noresize: true, formatter: createSalaryDeleteLink, styles: 'text-align: center;'},
											            { name: "<b>Update</b>", field: 'id', width: "8%", noresize: true, formatter: createAddUpdateLink, styles: 'text-align: center;'},
											            { name: "<b>Date Of Increment</b>", field: "incrementDate", width: "20%", noresize: true, editable: true, 
												        	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
												        	promptMessage: 'Provide date in MM/DD/YYYY', missingMessage: 'Please provide date in MM/DD/YYYY', 
												        	invalidMessage: 'Date format should be in MM/DD/YYYY'}, widgetClass: ValidationTextBox },
											            { name: "<b>Increment Amount</b>", field: "increment", width: "15%", noresize: true, editable: true, 
											            	formatter: formatCurrency, constraint:{currency: 'USD', required: true, min:0, max:1000, fractional:true}, 
											            	widgetProps: { promptMessage: 'Provide the increment Amount in USD', rangeMessage: 'Min 0$ and Max 1000$',
											            	missingMessage: 'Please provide Increment', invalidMessage:"Invalid Amount. Cents are MANDATORY." }, 
											            	widgetClass: CurrencyTextBox},
											            { name: "<b>Salary Before Increment</b>", field: "salBefInc", width: "20%", noresize: true, editable: true, 
											            	formatter: formatCurrency, constraint:{currency: 'USD', required: true, min:0, max:9999, fractional:true}, 
											            	widgetProps: { promptMessage: 'Provide the Salary before increment in USD', rangeMessage: 'Min 0$ and Max 9999$',
											            	missingMessage: 'Please provide Salary', invalidMessage:"Invalid Amount. Cents are MANDATORY." }, 
											            	widgetClass: CurrencyTextBox},
											            { name: "<b>Salary After Increment</b>", field: "salAftInc", width: "20%", noresize: true, editable: true, 
											            	formatter: formatCurrency, constraint:{currency: 'USD', required: true, min:0, max:9999, fractional:true}, 
											            	widgetProps: { promptMessage: 'Provide the Salary After Increment in USD', rangeMessage: 'Min 0$ and Max 9999$',
											            	missingMessage: 'Please provide Salary', invalidMessage:"Invalid Amount. Cents are MANDATORY." }, 
											            	widgetClass: CurrencyTextBox},
											            { name: "<b>Notes</b>", field: "notes", width: "20%", noresize: true, editable: true, 
											        	   		constraint:{required: true}, widgetProps: {maxLength: 100, 
											        	   		promptMessage: 'Provide Notes in not more than 100 characters', 
											        	   		missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											            singleClickEdit: true,
											            editable: true,
											            selectable: true,
											            //sortInfo: -1,
														//rowsPerPage: 10,
														loadingMessage: 'loadingMessage: Loading data from server..',
													    errorMessage:   'Oops we could not retrive the requested data!',
													    noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Salary Details not available. Please Enter !!!</font></span>",
													    onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
													    selectionMode: "single",
													    plugins: {
															nestedSorting: false,
											                pagination: {
																pageSizes: ["5", "10", "50", "100", "All"],
																description: true,
																sizeSwitch: false,
																pageStepper: true,
																gotoButton: false,
																maxPageStep: 4,
																position: "bottom",
																defaultPage: 1,
									                            defaultPageSize: 5
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
											            cells: [{ name: "<b>Delete</b>", field: 'id', width: "9%", noresize: true, formatter: createDisciplineDeleteLink, styles: 'text-align: center;'},
											    { name: "<b>Update</b>", field: "id", width: "9%", noresize: true, formatter: createAddUpdateLink, styles: 'text-align: center;'},
												{ name: "<b>Date</b>", field: "date", width: "20%", noresize: true, editable: true, 
										        	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
										        	promptMessage: 'Provide date in MM/DD/YYYY', missingMessage: 'Please provide date in MM/DD/YYYY', 
										        	invalidMessage: 'Date format should be in MM/DD/YYYY'}, widgetClass: ValidationTextBox },
										        { name: "<b>Info</b>", field: "notes", width: "60%", noresize: true, editable: true, 
								        	   		constraint:{required: true}, widgetProps: {maxLength: 100, 
								        	   		promptMessage: 'Provide Notes in not more than 100 characters', 
								        	   		missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											editable: true,
											selectable: true,
											//sortInfo: -1,
											//rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
										    errorMessage:   'Oops we could not retrive the requested data!',
										    noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Disciplinary Details not available. Please Enter !!!</font></span>",
										    onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
										    selectionMode: "single",
										    plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["5", "10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 5
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
											            cells: [{ name: "<b>Delete</b>", field: "id", width: "9%", noresize: true, formatter: createDoingGoodDeleteLink, styles: 'text-align: center;'},
											            { name: "<b>Update</b>", field: "id", width: "9%", noresize: true, formatter: createAddUpdateLink, styles: 'text-align: center;'},
														{ name: "<b>Date</b>", field: "date", width: "20%", noresize: true, editable: true, 
												        	constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
												        	promptMessage: 'Provide date in MM/DD/YYYY', missingMessage: 'Please provide date in MM/DD/YYYY', 
												        	invalidMessage: 'Date format should be in MM/DD/YYYY'}, widgetClass: ValidationTextBox },
												        { name: "<b>Info</b>", field: "notes", width: "60%", noresize: true, editable: true, 
										        	   		constraint:{required: true}, widgetProps: {maxLength: 100, 
										        	   		promptMessage: 'Provide Notes in not more than 100 characters', 
										        	   		missingMessage: 'Please provide Notes' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											editable: true,
											selectable: true,
											//sortInfo: -1,
											//rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
											errorMessage:   'Oops we could not retrive the requested data!',
											noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Doing Good Details not available. Please Enter !!!</font></span>",
											onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
											selectionMode: "single",
											plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["5", "10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 5
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
											           cells: [{ name: "<b>Delete</b>", field: "id", width: "8%", noresize: true, formatter: createMissedShiftsDeleteLink, styles: 'text-align: center;'},
											            { name: "Update", field: "id", width: "10%", noresize: true, formatter: createAddUpdateLink, styles: 'text-align: center;'},
														{ name: "<b>Date</b>", field: "date", width: "10%", noresize: true, editable: true, 
											        	   constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
											        		   promptMessage: 'Provide date in MM/DD/YYYY', missingMessage: 'Please provide date in MM/DD/YYYY', 
											        		   invalidMessage: 'Date format should be in MM/DD/YYYY'}, 
											        		   widgetClass: ValidationTextBox},
														{ name: "<b>Reason</b>", field: "reason", width: "35%", noresize: true, editable: true, 
											        	   			constraint:{required: true}, widgetProps: {maxLength: 200, 
											        	   				promptMessage: 'Provide Reason in not more than 200 characters', 
											        	   				missingMessage: 'Please provide Reason for Leave' }, widgetClass: ValidationTextBox},
											        	{ name: "<b>Excused/Not?</b>", field: "excused", width: "35%", noresize: true, editable: true, 
													        	   			constraint:{required: true}, widgetProps: {maxLength: 100, 
													        	   				promptMessage: 'Provide Notes in not more than 100 characters', 
													        	   				missingMessage: 'Please provide Notes for Leave' }, widgetClass: ValidationTextBox},
														{ name: "<b>Active hrs</b>", field: "activeHrs", width: "1%", noresize: true, editable: false, hidden: true }]}],
											singleClickEdit: true,
											editable: true,
											selectable: true,
											//sortInfo: -1,
											//rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
											errorMessage:   'Oops we could not retrive the requested data!',
											noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Leaves Details not available. Please Enter !!!</font></span>",
											onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
											selectionMode: "single",
											plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["5", "10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 5
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
											           cells: [{ name: "<b>Delete</b>", field: 'id', width: "7%", noresize: true, formatter: createDeleteLink, styles: 'text-align: center;'},
											                   { name: "<b>Update</b>", field: "store", width: "7%", noresize: true, formatter: createAddUpdateLink, styles: 'text-align: center;'},
														{ name: "<b>Date</b>", field: "date", width: "35%", noresize: true, editable: true, 
											        	   constraint:{required: true}, widgetProps: {validator: validateDatePattern, 
											        		   promptMessage: 'Provide date in MM/DD/YYYY', missingMessage: 'Please provide date in MM/DD/YYYY', 
											        		   invalidMessage: 'Date format should be in MM/DD/YYYY'}, 
											        		   widgetClass: ValidationTextBox},
														{ name: "<b>Notes</b>", field: "reason", width: "50%", noresize: true, editable: true, 
											        	   			constraint:{required: true}, widgetProps: {maxLength: 100, 
											        	   				promptMessage: 'Provide Notes in not more than 100 characters', 
											        	   				missingMessage: 'Please provide Notes for Leave' }, widgetClass: ValidationTextBox}]}],
											singleClickEdit: true,
											//sortInfo: -1,
											editable: true,
											selectable: true,
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
		    showEditLink = function(value, rowIndex){
		    	return '<span style="text-align: center;"><a href="javascript: editEmployeeDocumentRecordByDialog(' + "'employee-docs', " + value + "," + rowIndex + ');">Edit</a></span>';
		    },
		    showDocumentLink = function(values, rowIndex){
		    	if(values[0] != '&#/#&')
		    		return '<a target="_new" href="/service/getBlob/' + values[1] + '">' + values[0] + '</a>';
		    	else 
		    		return '-- No Attachments --';
		    },
		    updateEmployeeDocumentsGrid = function(docsData){
		    	var tempStore = {
		    			"identifier" : "id",
		    			"items" : []
		    	};
		    	tempStore.items = docsData;
		    	var gridDataStore = new itemFileWriteStore({data: tempStore});
				if(!dijit.byId('empDocumentsGrid')){
					employeeDocumentsGrid = new EnhancedGrid({
											store: gridDataStore,
											query: { id: "*" },
											structure: [{ name: "<b>Edit</b>", field: "id", editable: false, width: "5%", noresize: true, formatter: showEditLink, styles: 'text-align: center;'}, 
											            { name: "<b>Date</b>", field: "purposeDate", editable: false, width: "10%", noresize: true, styles: 'text-align: center;'},
											            { name: "<b>Document</b>", fields: ["fileName", "blobKey"], editable: false, formatter: showDocumentLink, width: "35%", noresize: true, styles: 'padding-left: 5px;'},
											            { name: "<b>Notes</b>", field: "purposeNotes", editable: false, width: "40%", noresize: true, styles: 'padding-left: 5px'}],
											singleClickEdit: false,
											editable: false,
											selectable: true,
											//rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
									        errorMessage:   'Oops we could not retrive the requested data!',
									        noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'><b>No Data to Display !!!<b></font></span>",
									        onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									        selectionMode: "none",
											plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["5", "10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 5
												}
								        }}, "empDocumentsGrid");
					employeeDocumentsGrid.startup();
				} else dijit.byId('empDocumentsGrid').setStore(gridDataStore);
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
											            cells: [{ name: "<b>Update</b>", field: "id", width: "10%", noresize: true, formatter: createAddUpdateLink},
														{ name: "<b>Date</b>", field: "date", width: "10%", noresize: true, editable: true, constraint:{required: true}, 
											            	widgetProps: {validator: validateDatePattern, promptMessage: 'Provide date in MM/DD/YYYY', 
											            	missingMessage: 'Please provide date in MM/DD/YYYY', invalidMessage: 'Date format should be in MM/DD/YYYY'},
											            	widgetClass: ValidationTextBox},
											            { name: "<b>Position</b>", field: "position", width: "10%", noresize: true, editable: false},
														{ name: "<b>Time From</b>", field: "timeFrom", width: "10%", noresize: true, editable: true, widgetClass: TimeTextBox, widgetProps: {openOnClick: true}, formatter: formatTime,
											            		constraint: {timePattern: 'HH:mm', clickableIncrement: 'T01:00', visibleIncrement: 'T01:00', visibleRange: 'T01:00', required: true}, getValue: getTimeValue},
														{ name: "<b>Time To</b>", field: "timeTo", width: "10%", noresize: true, editable: true, widgetClass: TimeTextBox, widgetProps: {openOnClick: true}, formatter: formatTime,
												            		constraint: {timePattern: 'HH:mm', clickableIncrement: 'T01:00', visibleIncrement: 'T01:00', visibleRange: 'T01:00', required: true}, getValue: getTimeValue}]}],
											singleClickEdit: true,
											editable: true,
											selectable: true,
											//sortInfo: -1,
											//rowsPerPage: 10,
											loadingMessage: 'loadingMessage: Loading data from server..',
											errorMessage:   'Oops we could not retrive the requested data!',
											noDataMessage:	"<span class=\"dojoxGridNoData\"><font color='grey'>Labor Details not available. Please Enter !!!</font></span>",
											onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
											selectionMode: "single",
											plugins: {
												nestedSorting: false,
								                pagination: {
													pageSizes: ["5", "10", "50", "100", "All"],
													description: true,
													sizeSwitch: false,
													pageStepper: true,
													gotoButton: false,
													maxPageStep: 4,
													position: "bottom",
													defaultPage: 1,
						                            defaultPageSize: 5
												},
					                            exporter: true
								        }}, "empLaborDetailsGrid");
					empLaborDetailsGrid.startup();
				} else dijit.byId('empLaborDetailsGrid').setStore(gridDataStore);
		    },
		    validateDatePattern = function(value, constraints){
		    	var dts  = value.split('/'), dateTest = new Date(value);
		    	return !isNaN(dateTest) && dateTest.getFullYear()===parseInt(dts[2],10) && dateTest.getMonth()===(parseInt(dts[0],10)-1) && dateTest.getDate()===parseInt(dts[1],10); 
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
							           editor({label: "<b>Date</b>", field: "date", width: "10%",  autoSave: true, 
							        	   editorArgs: {required: true, trim: true, maxlength: 10, intermediateChanges: false, invalidMessage: 'Invalid Date', missingMessage: 'Required', 
							        		   validator: function(value){return validateDatePattern(value);}}}, ValidationTextBox, "click"),
					        	{label: "<b>Time From</b>", field: "timeFrom", width: "10%"},
					        	{label: "<b>Time To</b>", field: "timeTo", width: "10%"}],
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
		    fetchEmployeeDocumentsData = function(empId) {
		    	registry.byId('employeeDocumentsGridStandBy').show();
		    	ajaxRequest.get("/service/employee/" + empId + "/documents",{
		    		handleAs: 'json'
		    	}).then(function(documentDetailsResponse){
		    		updateEmployeeDocumentsGrid(documentDetailsResponse.models);
	    			registry.byId('employeeDocumentsGridStandBy').hide();
		    	}, function(error){
		    		console.log('Error occurred while fetching Documents data ' + error);
		    		registry.byId('employeeDocumentsGridStandBy').hide();
		    	});
		    },
		    fetchMgrLeavesData = function(empId) {
		    	registry.byId('mgrLeavesGridStandBy').show();
		    	ajaxRequest.get("/service/employee/" + empId + "/leaves/"+registry.byId('hiddenSelectedYear').get('value'),{
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
		    fetchYearlyReviews = function(empId){
		    	registry.byId('mgrYearlyReviewsStandBy').show();
		    	ajaxRequest.get("/service/employee/" + empId + "/yearlyReviews",{
		    		handleAs: 'json'
		    	}).then(function(yearlyReviewsResponse){
		    		if(yearlyReviewsResponse.success){
		    			populateYearlyReviews(yearlyReviewsResponse.customMessages);
		    			registry.byId('mgrYearlyReviewsStandBy').hide();
		    		}
		    	}, function(error){
		    		console.log('Error occurred while fetching store data ' + error);
		    		registry.byId('mgrYearlyReviewsStandBy').hide();
		    	});
		    },
		    populateYearlyReviews = function(yearlyReviewsModel){
		    	var yearlyList = dom.byId('mgrYearlyReviewsTable');
		    	domConstruct.empty(yearlyList);
		    	var tableTR;
		    	var keys = functional.keys(yearlyReviewsModel);
		    	baseArray.forEach(keys, function(yearRecord){
		    		var xtraStyle='';
		    		if(registry.byId('hiddenSelectedYear').get('value') == yearRecord)
		    			xtraStyle = "style='color: #fff'";
		    		tableTR = domConstruct.create("tr");
		    		var td = domConstruct.create("td", { innerHTML: "<a " + xtraStyle + " href='javascript: fetchMgrYearlyReview(\"" + yearRecord + "\");'>" + yearRecord + "</a>"}, tableTR);
		    		domStyle.set(td, 'text-align', 'center');
		    		if(registry.byId('hiddenSelectedYear').get('value') == yearRecord){
		    			domStyle.set(td, 'background-color', '#a00');
		    		}
		    		else {
		    			domStyle.set(td, 'background-color', '#fff');
		    		}
		    		tableTR.appendChild(td);
		    		yearlyList.appendChild(tableTR);
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
				    			hiredDate: '12/05/2013', username: 'user'+randomNumber, position: 'Front', phone: 'Add Phone', active: true, mgr: 1,
				    			updatedBy: 1, updated_date: '', store: '__new__', _self: '/service/store/'+registry.byId('hiddenStoreId').get('value')+'/employees/0', post: true};
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
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: '12/12/2013', active: true,
				    			 _self: '/service/employee/'+empId+'/leaves', post: true, reason: 'Reason in not More than 100 Characters', excused: '', activeHrs: 0, updatedBy: 1, updatedDate: '', store: '__new__'};
				    		break;
				    	case 'mgrLeavesGrid':
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: '12/12/2013', active: true,
				    			 _self: '/service/employee/'+empId+'/leaves', post: true, reason: 'Notes in not More than 100 Characters', excused: false, activeHrs: 0, updatedBy: 1, updatedDate: '', store: '__new__'};
				    		break;
				    	case 'empLaborDetailsGrid':
				    		recordToAdd = {id: randomNumber, storeId: registry.byId('hiddenStoreId').get('value'), empId: empId, date: '12/12/2013', position: getSelectedEmployeePosition(), active: true,
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
			    	console.log('EmployeeLayoutController --> postCreate() start');
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
								case 'empDocumentDetails':
									child.set('title', child.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeDocumentsTabRecord(event);'/> &nbsp;");
									break;
							}
							refreshSelectedPane();
						}
					});
			    	try{
				    	on(registry.byId('mgrList'), 'change', function(){
				    		var empId = this.get('value');
				    		var empLayout = require('controls/EmployeeLayoutController');
							if(Number(this.get('value')) > 0){
								//domStyle.set(dom.byId('mgrContract'), 'display','block');
								dom.byId('mgrContract').style.display = 'inline-block';
								//domStyle.set(dom.byId('mgrAddLeavesIcon'), 'display','');
								dom.byId('mgrAddLeavesIcon').style.display = 'inline-block';
								this.store.fetch({query: {id: this.get('value')}, onComplete: function(items, request){
									if(items.length > 0){
										empLayout.populateManagerInfo(items[0]);
									}
								}});
						      empLayout.showPhotoByEmpId(this.get('value'), 'managerPhoto', 'mgrPhotoPane', 'mgrPhotoPaneStandBy');
						      empLayout.fetchCurrentYearReviews(empId);
						      empLayout.fetchManagerContractBlobs(this.get('value'));
						      empLayout.fetchMgrLeavesDetails(empId);
						      registry.byId('quartersList').set('disabled', false);
							} else {
								domConstruct.empty(dom.byId('mgrPaneInfoUl'));
								domConstruct.empty(dom.byId('mgrYearlyReviewsTable'));
								//domStyle.set(dom.byId('mgrContract'), 'display','none');
								dom.byId('mgrContract').style.display = 'none';
								empLayout.hidePhoto('mgrPhotoPane');
								//domStyle.set(dom.byId('mgrAddLeavesIcon'), 'display','none');
								dom.byId('mgrAddLeavesIcon').style.display = 'none';
								empLayout.resetMgrLeavesGrid();
								registry.byId('quartersList').set('disabled', true);
								registry.byId('quartersList').set('value', 0);
							}
							empLayout.resetMgrForm();
				    	});
				    	//Manager Tab --> Personal / Sick Days Tab
				    	var addIconLabel = "<span id='mgrAddLeavesIcon' style='display: none;'>&nbsp;<img align='top' src='resources/images/add-icon.png' onclick='javascript: addManagerLeavesTabRecord(event);'/></span>";
						var widget = registry.byId('mgrLeavesTab');
					    widget.set('title', widget.get('title') + '&nbsp;' + addIconLabel);
			    	} catch(e){console.log('Error occurred in postCreate() EmployeeLayoutController ', e);}
			    	console.log('EmployeeLayoutController --> postCreate() end');
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
		        	var array = [{id: 0, value: 0, label: '<font color= "#CBCB50">&nbsp;<i class="icon-warning-sign"></i>&nbsp;-Name- (pos)&nbsp;<i class="icon-warning-sign"></i></font>'}];
		        	var storeItem = {};
		        	var standByWidget = 'calendarEntryTitlePaneStandBy';
		        	registry.byId(standByWidget).show();
		        	ajaxRequest.get("/service/store/" + storeId + "/employees4Labor",{
			    		handleAs: 'json'
			    	}).then(function(response){
			    		if(response.success){
			    			baseArray.forEach(response.models, function(item){
			    				storeItem = {};
			    				storeItem.id = (item.id+'');
			    				storeItem.value = (item.id+'');
			    				var storeLabel = 
			    				storeItem.label = (item.active ? '<font color="#29BA05"><i class="icon-thumbs-up"></i>' : '<font color="#DB1C29"><i class="icon-exclamation-sign"></i>') + '&nbsp;' + '&nbsp;' + item.fname + '(' + item.position + ')&nbsp;' + (item.active ? '<i class="icon-thumbs-up"></i>' : '<i class="icon-exclamation-sign"></i>') + '</font>';
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
					//var fragment,  innerHTMLText;
					
					mgrPaneDetailsNode.appendChild(domConstruct.create("li", { innerHTML: '<b>Name: </b> ' + selectedItem.label }));
					mgrPaneDetailsNode.appendChild(domConstruct.create("li", { innerHTML: '<b>Position: </b> ' + selectedItem.position }));
					mgrPaneDetailsNode.appendChild(domConstruct.create("li", { innerHTML: '<b>Work Cell: </b> ' + selectedItem.phone }));
					mgrPaneDetailsNode.appendChild(domConstruct.create("li", { innerHTML: '<b>Personal: </b>' + selectedItem.personalPhone }));
					mgrPaneDetailsNode.appendChild(domConstruct.create("li", { innerHTML: '<b>Emergency Contact: </b> ' + selectedItem.emergencyContact }));
					mgrPaneDetailsNode.appendChild(domConstruct.create("li", { innerHTML: '<b>Home Address: </b> ' + selectedItem.address }));
					
					
					/*fragment = document.createDocumentFragment();
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
					innerHTMLText = '<b>Work Cell: </b> ' + selectedItem.phone;
					domConstruct.create("li", {
	                    innerHTML: innerHTMLText
	                }, fragment);
					domConstruct.place(fragment, mgrPaneDetailsNode);
					
					fragment = document.createDocumentFragment();
					innerHTMLText = '<b>Personal: </b>' + selectedItem.personalPhone;
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
					domConstruct.place(fragment, mgrPaneDetailsNode);*/
		       },
		       fetchManagerContractBlobs: function(mgrId){
		    	   if(dom.byId('managerContractDocumentsSection').style.display != 'none'){
				    	registry.byId('mgrContractStandBy').show();
				    	ajaxRequest.get("/service/blobs/mgrContract/" + mgrId,{
				    		handleAs: 'json'
				    	}).then(function(blobsResponse){
				    		var uploadFilesNode = dom.byId('mgrContractExisting');
				    		domConstruct.empty(uploadFilesNode);
				    		var fragment;
				    		var innerHTMLText = '';
				    		baseArray.forEach(blobsResponse.models, function(blob){
				    			fragment = document.createDocumentFragment();
				    			innerHTMLText = '&nbsp;&nbsp;&nbsp;<img src="resources/images/icon-pdf.png"/> &nbsp;'
				    				+ '<a target="_new" href="/service/getBlob/' + blob.blobKey + '">' 
				    				//+ ((blob.fileName.length > 20) ? (blob.fileName.substr(0, 20)+'...') : blob.fileName) 
				    				+  blob.fileName 
				    				+ '</a>'
				    				/*+ '&nbsp;&nbsp;' + '<img src="resources/images/delete-icon.png" onclick="javascript: deleteItem(' + "'blob','mgrContract','" + blob.id + "'" + ');"/>'*/
				    				+ '&nbsp;&nbsp;' + '<span onclick="javascript: deleteItem(' + "'blob','mgrContract','" + blob.id + "'" + ');"><i class="icon-remove"></i></span>'
				    				;
				    				//+ '&nbsp;<a target="_new" href="/service/getBlob/' + blob.blobKey + '">View/Download</a>';
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
			       }
			    },
			    fetchMgrLeavesDetails: function(empId){
			    	fetchMgrLeavesData(empId);
			    },
			    resetMgrLeavesGrid: function(){
			    	updateMgrLeavesGrid([]);
			    },
			    updateMgrReview: function(formData, button){
			    	registry.byId('mgrReviewStandBy').show();
			    	formData['id'] = 0;
			    	formData['empId'] = registry.byId('mgrList').get('value');
			    	formData['storeId'] = registry.byId('hiddenStoreId').get('value');
			    	formData['active'] = true;
			    	formData['quarterlyNotes'] = registry.byId('quarterlyNotes').get('value');
			    	formData['year'] = registry.byId('hiddenSelectedYear').get('value');
			    	formData['updatedBy'] = 0;
			    	if(button == 'save'){
			    		ajaxRequest.post("/service/employee/" + registry.byId('mgrList').get('value') + "/reviews", {
			        		headers: { "Content-Type":"application/json"}, 
			        		handleAs: 'json', data: json.stringify(formData), timeout: 10000 
			        			}).then(function(reviewUpdateResponse){
			        				if(reviewUpdateResponse.success){
			        				console.log('Update Success -->' + reviewUpdateResponse.model.id);
			        				dom.byId('messages').innerHTML = 'Add Successful';
			        				dom.byId('hiddenReviewRecordId').value = reviewUpdateResponse.model.id;
			        				registry.byId('reviewUpdateBtn').set('disabled', false);
									registry.byId('reviewSaveBtn').set('disabled', true);
			        			}
			        		}, function(error){
			        			console.log('Error while updating --> ' + error);
			        			dom.byId('hiddenReviewRecordId').value = 0;
			        			dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
			        			registry.byId('reviewUpdateBtn').set('disabled', true);
								registry.byId('reviewSaveBtn').set('disabled', false);
			        		});
			    	}else {
			    		formData['id'] = dom.byId('hiddenReviewRecordId').value;
			    		ajaxRequest.put("/service/employee/" + registry.byId('mgrList').get('value') + "/reviews", {
			        		headers: { "Content-Type":"application/json"}, 
			        		handleAs: 'json', data: json.stringify(formData), timeout: 10000 
			        			}).then(function(reviewUpdateResponse){
			        				if(reviewUpdateResponse.success){
			        				console.log('Update Success -->' + reviewUpdateResponse);
			        				dom.byId('messages').innerHTML = 'Update Successful';
			        				registry.byId('reviewUpdateBtn').set('disabled', false);
									registry.byId('reviewSaveBtn').set('disabled', true);
			        			}
			        		}, function(error){
			        			console.log('Error while updating --> ' + error);
			        			dom.byId('messages').innerHTML = 'Error while Updating --> ' + error;
			        			registry.byId('reviewUpdateBtn').set('disabled', false);
								registry.byId('reviewSaveBtn').set('disabled', true);
			        		});
			    	}
			    	registry.byId('mgrReviewStandBy').hide();
			    },
			    resetMgrForm: function(){
			    	registry.byId('quarterlyReviewForm').reset();
					registry.byId('possibleBonus').set('value', 0);
	    			registry.byId('bonusDate').set('value', new Date());
	    			registry.byId('bonusAmt').set('value', 0);
	    			registry.byId('quarterlyNotes').set('value', '');
					registry.byId('reviewUpdateBtn').set('disabled', true);
					registry.byId('reviewSaveBtn').set('disabled', true);
					//registry.byId('hiddenSelectedYear').set('value', '2013');
			    },
			    populateMgrReviewForm: function(quarterId){
			    	registry.byId('mgrReviewStandBy').show();
			    	var year=registry.byId('hiddenSelectedYear').get('value');
			    	ajaxRequest.get("/service/employee/" + registry.byId('mgrList').get('value') + "/review/"+year+"/"+quarterId,{
			    		handleAs: 'json'
			    	}).then(function(reviewResponse){
			    		if(reviewResponse.models.length > 0){
			    			var data = reviewResponse.models[0];
			    			registry.byId('possibleBonus').set('value', data.possibleBonus);
			    			registry.byId('bonusDate').set('value', data.bonusDate);
			    			registry.byId('bonusAmt').set('value', data.bonusAmt);
			    			registry.byId('quarterlyNotes').set('value', data.quarterlyNotes);
			    			registry.byId('reviewUpdateBtn').set('disabled', false);
							registry.byId('reviewSaveBtn').set('disabled', true);
							dom.byId('hiddenReviewRecordId').value = data.id;
			    		}else {
			    			registry.byId('reviewUpdateBtn').set('disabled', true);
							registry.byId('reviewSaveBtn').set('disabled', false);
							dom.byId('hiddenReviewRecordId').value = 0;
							registry.byId('possibleBonus').set('value', 0);
			    			registry.byId('bonusDate').set('value', new Date());
			    			registry.byId('bonusAmt').set('value', 0);
			    			registry.byId('quarterlyNotes').set('value', '');
			    		}
			    		registry.byId('mgrReviewStandBy').hide();
			    	}, function(error){
			    		registry.byId('mgrReviewStandBy').hide();
			    	});
			    },
			    fetchCurrentYearReviews: function(empId){
			    	fetchYearlyReviews(empId);
			    },
			    fetchReviewsForYear: function(year){
			    	//console.log('Fetch Data for --> ' + registry.byId('mgrList').get('value') + ' and Year --> ' + year);
			    	
			    	var wipeOut = otherFx.wipeOut({node: dom.byId('managerDetailsPane'), duration: 1000, delay: 250, 
			    		onEnd: function(node){
			    				this.node.style.display = 'none';
			    				this.node.style.width = '99%';
			    				this.node.style.height = '1%';
			    				//domStyle.set(this.node, {display: "none", width: "99%", height: "2%"});
			    				//domStyle.set(dom.byId('mgrReviewFormDiv'), "display","none");
			    				try{dom.byId('mgrReviewFormDiv').style.display = 'none';}catch(e){}
			    			}
			    	});
			    	var wipeIn = otherFx.wipeIn({node: dom.byId('mgrYearlyDetailsRegion'), duration: 1000, delay: 250, 
			    		onBegin: function(node){
			    				//domStyle.set(this.node, {display: "", width: "99%", height: "98%"});
			    				this.node.style.display = 'block';
			    				this.node.style.width = '99%';
			    				this.node.style.height = '39%';
			    			},
			    		onEnd: function(node){
			    			//registry.byId('mgrYearlyDetailsRegion').resize();
		    				//registry.byId('managerDetailsPaneContentPane').resize();
			    			dom.byId('mgrDetailsTabContainer').style.display = 'none';
			    		}
			    	});
			    	otherFx.chain([wipeOut, wipeIn]).play();
			    	registry.byId('hiddenSelectedYear').set('value', year);
			    	dom.byId('yearButton').innerHTML = year;
			    	fetchMgrLeavesData(registry.byId('mgrList').get('value'));
			    	
			    	var standByNode = "mgrYearlyDetailsRegionStandBy";
			    	registry.byId(standByNode).show();
			    	ajaxRequest.get("/service/employee/" + registry.byId('mgrList').get('value') + "/review/"+year,{
			    		handleAs: 'json'
			    	}).then(function(yearlyReviewsResponse){
			    		var modelsLength = yearlyReviewsResponse.models.length;
			    		if(yearlyReviewsResponse.success){
			    			var quarterlyList = dom.byId('mgrYearlyReviewsQuarterTable');
					    	domConstruct.empty(quarterlyList);
					    	var tableTR, td;
					    	tableTR = domConstruct.create("tr");
					    	td = domConstruct.create("th", { 
				    			innerHTML: "Quarter #"
				    			}, tableTR);
					    	domStyle.set(td, 'width', '10%');
				    		tableTR.appendChild(td);
				    		
				    		td = domConstruct.create("th", { 
				    			innerHTML: "Notes"
				    			}, tableTR);
					    	domStyle.set(td, 'width', '45%');
				    		tableTR.appendChild(td);
				    		
				    		td = domConstruct.create("th", { 
				    			innerHTML: "Bonus"
				    			}, tableTR);
					    	domStyle.set(td, 'width', '10%');
				    		tableTR.appendChild(td);
				    		
				    		td = domConstruct.create("th", { 
				    			innerHTML: "End Year Payout"
				    			}, tableTR);
					    	domStyle.set(td, 'width', '35%');
				    		tableTR.appendChild(td);
				    		quarterlyList.appendChild(tableTR);
				    		if(modelsLength == 0){
				    			tableTR = domConstruct.create("tr");
					    		td = domConstruct.create("td", { 
					    			innerHTML: "<i>No Data Available !!!</i>",
					    			colspan: 4
					    			}, tableTR);
					    		domStyle.set(td, 'text-align', 'center');
					    		quarterlyList.appendChild(tableTR);
					    		tableTR.appendChild(td);
					    	} else baseArray.forEach(yearlyReviewsResponse.models, function(model, index){
					    		tableTR = domConstruct.create("tr");
					    		td = domConstruct.create("td", { 
					    			innerHTML: model.quartersList
					    			}, tableTR);
					    		domStyle.set(td, 'width', '10%');
					    		domStyle.set(td, 'text-align', 'center');
					    		tableTR.appendChild(td);
					    		
					    		td = domConstruct.create("td", { 
					    			innerHTML: model.quarterlyNotes
					    			}, tableTR);
					    		domStyle.set(td, 'width', '45%');
					    		domStyle.set(td, 'text-align', 'center');
					    		tableTR.appendChild(td);
					    		
					    		td = domConstruct.create("td", { 
					    			innerHTML: '$ ' + model.bonusAmt
					    			}, tableTR);
					    		domStyle.set(td, 'width', '10%');
					    		domStyle.set(td, 'text-align', 'center');
					    		tableTR.appendChild(td);
					    		
					    		td = domConstruct.create("td", { 
					    			innerHTML: '$ ' + model.possibleBonus + ' on ' + model.bonusDate
					    			}, tableTR);
					    		domStyle.set(td, 'width', '35%');
					    		domStyle.set(td, 'text-align', 'center');
					    		tableTR.appendChild(td);
					    		
					    		quarterlyList.appendChild(tableTR);
					    	});
			    		}
			    		var unusedList = dom.byId("mgrUnusedPersonalDaysDetailsTable");
			    		var leavesAvailed = registry.byId('mgrLeavesGrid').rowCount;
				    	domConstruct.empty(unusedList);
				    	var tr, th, td;
				    	tr = domConstruct.create("tr");
				    	th = domConstruct.create("th", { 
			    			innerHTML: "Unused Personal Days",
			    			colspan: 3
		    			}, tr);
				    	domStyle.set(th, 'text-align', 'center');
				    	domStyle.set(th, 'height', '1%');
				    	tr.appendChild(th);
				    	unusedList.appendChild(tr);
				    	
				    	tr = domConstruct.create("tr");
				    	td = domConstruct.create("td", { 
			    			innerHTML: (10-leavesAvailed) + " Unused Days"
		    			}, tr);
				    	domStyle.set(td, 'text-align', 'center');
				    	tr.appendChild(td);
				    	
				    	td = domConstruct.create("td", { 
			    			innerHTML: "Unused Day Pay = $50"
		    			}, tr);
				    	domStyle.set(td, 'text-align', 'center');
				    	tr.appendChild(td);
				    	
				    	td = domConstruct.create("td", { 
			    			innerHTML: "Total = $" + ((10-leavesAvailed)*50)
		    			}, tr);
				    	domStyle.set(td, 'text-align', 'center');
				    	tr.appendChild(td);
				    	unusedList.appendChild(tr);
				    	
				    	domStyle.set(dom.byId('mgrUnusedPersonalDaysDetailsDiv'), "display","");
			    		registry.byId(standByNode).hide();
			    	}, function(error){
			    		console.log('Error occurred while fetching store data ' + error);
			    		registry.byId(standByNode).hide();
			    	});
			    }
		    };
});