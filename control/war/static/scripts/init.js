/*require(['bootstrap', 'dojo/ready', "dojo/parser", 'dijit/MenuBar', 'dijit/PopupMenuBarItem', 'dijit/Menu', 'dijit/MenuItem', 'dijit/MenuSeparator', 'dijit/PopupMenuItem', 'dijit/CheckedMenuItem'], 
		function(bootstrap, ready, parser){
		ready(function(){
			parser.parse();
		});
});*/

require(["bootstrap", "dijit/MenuBar", "dijit/PopupMenuBarItem", "dojo/parser", "dijit/dijit", "dojo/dom-style", "dojo/date", "dojo/date/locale", "dojo/dom-construct", "dojo/_base/fx", "dojo/fx", "dojo/_base/declare", "dojo/dom", "dojo/on", "dijit/form/Select",
         "controls/StoreLayoutController", "controls/EmployeeLayoutController", "controls/LaborLayoutController", "controls/AccountingLayoutController", "controls/InventoryLayoutController", "dijit/form/DateTextBox", "dojo/store/Memory",
         "dojo/_base/lang", "dojo/request", "dojo/dom-form", "dojo/json", "dojo/query", "dijit/registry", "dojo/_base/array", "dojox/widget/Dialog", "dijit/form/FilteringSelect",
         "dijit/TooltipDialog", "dijit/popup", 'dojox/form/Uploader', 'dojox/form/uploader/FileList', 'dojox/layout/ScrollPane', "dojox/form/TimeSpinner", "dijit/form/Button", 'dojox/timing/doLater', 'dojo/ready'], 
         function(bootstrap, MenuBar, PopupMenu, parser, dijit, domStyle, date, locale, domConstruct, fx, otherFx, declare, dom, on, formSelect, storeLayout, empLayout, laborLayout, accLayout, inventoryLayout, DateTextBox, Memory, lang, 
        		 ajaxRequest, domForm, json, query, registry, baseArray, dojoxDialog, FilteringSelect, TooltipDialog, popup, uploader, fileList, scrollPane, TimeSpinner, Button, doLater, ready){
		  ready(function(){
		   parser.parse();
		    var LoadingObj = declare(null, {
				overlayNode: null,
				constructor : function() {
					this.overlayNode = dom.byId('loadingOverlay');
				},
				endLoading : function() {
					try{fx.fadeOut({
						node : this.overlayNode,
						duration: 1000, delay: 150,
						onEnd : function(node) {
							domStyle.set(node, 'display', 'none');
						}
					}).play();
					}catch(e){console.log('Error in Fx Fadeout !! ' + e);};
				},
				setSelectedLocation : function() {
					console.log('Setting Location !');
				}
			});
			loadingObj = new LoadingObj();
			registry.byId('hiddenStoreId').set('value', 0);
			storeLayout.init();
			empLayout.init();
			laborLayout.init();
			accLayout.init();
			inventoryLayout.init();
			loadingObj.endLoading();
			//setTimeout(lang.hitch(loadingObj, "setSelectedLocation"), 500);
			console.log('Layout Require() Completed');

			loginDialog._onKey = function(evt) {
					key = evt.keyCode;
					if (key == dojo.keys.ESCAPE) {
						dojo.stopEvent(evt);
						displayMessage("loginTrId", "loginMessage",
								"Cannot close the Dialog without login.", "info");
					}
			};
			loginDialog.closeButtonNode.style.display = "none";
			otherFx.wipeIn({node: dom.byId('loginDialog'),duration: 1000, delay: 350, onBegin: function(node){registry.byId('loginDialog').show();domStyle.set(this.node, {top:'40px', position: "absolute"});}}).play();
			//loginDialog.show();
			
			var checkAndAddMainTabPlus = function(paneId, paneTitle){
				if(paneId === 'employeePane'){
					if(paneTitle.indexOf(' &nbsp; <img ') > 0)
						return paneTitle;
					else return paneTitle + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeRecord(event);'/> &nbsp;";
				}	else return paneTitle;
			};
			
			
			
			document.getElementById('laborPaneInfo').style.display='none';
			document.getElementById('employeePaneInfo').style.display='none';
			var tabContainer  = registry.byId("tabContainer");
			var storeId = registry.byId('hiddenStoreId').get('value');
			dojo.connect(tabContainer, "selectChild", function(child){
				switch(child.get('id')){
					case 'storeInfo':
						if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						if(domStyle.get(dom.byId('employeePaneInfo'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('employeePaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						storeLayout.populateStoreData(registry.byId('hiddenStoreId').get('value'));
						break;
					case 'employeePane':
						if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						empLayout.populateEmployeesData(registry.byId('hiddenStoreId').get('value'));
						child.set('title', checkAndAddMainTabPlus('employeePane', child.get('title')));
						break;
					case 'laborPane':
						if(domStyle.get(dom.byId('employeePaneInfo'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('employeePaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						laborLayout.resetToCurrentWeek(false);
						if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') == 'none')
							otherFx.wipeIn({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "block"});}}).play();
						break;
					case 'managerPane':
						empLayout.populateManagerTabDetails(registry.byId('hiddenStoreId').get('value'));
						if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						registry.byId('reviewUpdateBtn').set('disabled', true);
						registry.byId('reviewSaveBtn').set('disabled', true);
						registry.byId('quartersList').set('disabled', true);
						registry.byId('quartersList').set('value', 0);
						break;
					case 'managePane':
						if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						storeLayout.populateUsersToManage();
						break;
					case 'accountingPane':
						if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						accLayout.reset();
						break;
					case 'inventoryPane':
						if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
							otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
						inventoryLayout.reset();
						break;
				}
				empLayout.hidePhoto('employeePaneInfo');
			});
			
			var fileUploadComplete = function(dataArray){
				if(dataArray){
					if(dataArray.status && dataArray.status == "success"){
						dom.byId('fileUploadProgressMsgs').innerHTML = 'Upload Success..';
						otherFx.wipeOut({node: dom.byId('fileUploadWidgetsDiv'), duration: 1000, delay: 250, 
							onEnd: function(node){
								domStyle.set(this.node, {display: "none"});
							}
						}).play();
						var uploadFilesNode = dom.byId('storeInfoUploadedDocument');
						domConstruct.empty(uploadFilesNode);
						var fragment = document.createDocumentFragment();
						var innerHTMLText = '&nbsp;&nbsp;&nbsp;<img src="resources/images/icon-pdf.png"/> &nbsp;' + dataArray.fileName + '&nbsp;<a href="javascript: saveFileRefToDB(\'store-lease\', \'' + dataArray.fileName + '\', \'' + 
												dataArray['blob-key'] + '\');">Save</a>';
						domConstruct.create("li", {
	                        innerHTML: innerHTMLText
	                    }, fragment);
						 domConstruct.place(fragment, uploadFilesNode);
					}else{
						console.log('error',data,ioArgs);
					}
				}else{
					console.log('ugh?',arguments);
				}
			}, fileUploadStart = function(dataArray){
				//this.emit('abort', event, null);
				this.set('url', window.blobStoreURL);
				dom.byId('fileUploadProgressMsgs').innerHTML = 'Uploading ...';
			};
			
			var myUploader = new dojox.form.Uploader({ name: "uploadedFile", multiple:false, showProgress:true, label: "Select File",
				uploadOnSelect:true, url: blobStoreURL, onBegin: fileUploadStart, onComplete: fileUploadComplete});
			dojo.byId("fileUploadWidgets").appendChild(myUploader.domNode);
			
			
			
			
			var fileUploadCompleteEmp = function(dataArray){
				if(dataArray){
					if(dataArray.status && dataArray.status == "success"){
						dom.byId('fileUploadProgressMsgsEmp').innerHTML = 'Upload Success..';
						otherFx.wipeOut({node: dom.byId('fileUploadWidgetsDivEmp'), duration: 1000, delay: 250, 
							onEnd: function(node){
								domStyle.set(this.node, {display: "none"});
								dom.byId('employeeImg').setAttribute('src', dataArray.imageURL);
							}
						}).play();
						
						var uploadFilesNode = dom.byId('empPhotoUploadOptions');
						domConstruct.empty(uploadFilesNode);
						var fragment = document.createDocumentFragment();
						var innerHTMLText = '&nbsp;<a href="javascript: saveFileRefToDB(\'photo\', \'' + dataArray.fileName + '\', \'' + 
												dataArray['blob-key'] + '\');">Save</a>';
						domConstruct.create("span", {
	                        innerHTML: innerHTMLText
	                    }, fragment);
						 domConstruct.place(fragment, uploadFilesNode);
					}else{
						console.log('error', data, ioArgs);
					}
				}else{
					console.log('ugh?',arguments);
				}
			}, fileUploadStartEmp = function(dataArray){
				//this.emit('abort', event, null);
				this.set('url', window.blobStoreURL);
				dom.byId('fileUploadProgressMsgsEmp').innerHTML = 'Uploading ...';
			};
			
			var myUploaderEmp = new dojox.form.Uploader({ name: "uploadedFile", multiple:false, showProgress:true, label: "Select Photo",
				uploadOnSelect:true, url: blobStoreURL, onBegin: fileUploadStartEmp, onComplete: fileUploadCompleteEmp});
			dojo.byId("fileUploadWidgetsEmp").appendChild(myUploaderEmp.domNode);
			
			
			// Manager Tab Details
			var mgrSelectWidget = new formSelect({style: {width: '50%', 'text-align': 'right'}}, dom.byId('mgrList'));
			mgrSelectWidget.startup();

			mgrSelectWidget.on("change", function(){
				var empId = this.get('value');
				if(Number(this.get('value')) > 0){
					domStyle.set(dom.byId('mgrContract'), 'display','block');
					domStyle.set(dom.byId('mgrAddLeavesIcon'), 'display','');
					this.store.fetch({query: {id: this.get('value')}, onComplete: function(items, request){
						if(items.length > 0){
							empLayout.populateManagerInfo(items[0]);
						}
					}});
			      empLayout.showPhotoByEmpId(this.get('value'), 'managerPhoto', 'mgrPhotoPane', 'mgrPhotoPaneStandBy');
			      empLayout.fetchManagerContractBlobs(this.get('value'));
			      empLayout.fetchMgrLeavesDetails(empId);
			      empLayout.fetchCurrentYearReviews(empId);
			      registry.byId('quartersList').set('disabled', false);
				}else {
					domConstruct.empty(dom.byId('mgrPaneInfoUl'));
					domConstruct.empty(dom.byId('mgrYearlyReviewsTable'));
					domStyle.set(dom.byId('mgrContract'), 'display','none');
					empLayout.hidePhoto('mgrPhotoPane');
					domStyle.set(dom.byId('mgrAddLeavesIcon'), 'display','none');
					empLayout.resetMgrLeavesGrid();
					registry.byId('quartersList').set('disabled', true);
					registry.byId('quartersList').set('value', 0);
				}
				empLayout.resetMgrForm();
			});
			// Manager Tab Details ends
			
			//Manager Contract File Upload
			var fileUploadCompleteMgr = function(dataArray){
				var progressMsgsNode = 'mgrContractWidgetsProgressMsgs';
				var widgetNode = 'mgrContractWidgetsDiv';
				var docUploadedNode = 'mgrContractUploaded';
					if(dataArray){
						if(dataArray.status && dataArray.status == "success"){
							dom.byId(progressMsgsNode).innerHTML = 'Upload Success..';
							otherFx.wipeOut({node: dom.byId(widgetNode), duration: 1000, delay: 250, 
								onEnd: function(node){
									domStyle.set(this.node, {display: "none"});
								}
							}).play();
							var uploadFilesNode = dom.byId(docUploadedNode);
							domConstruct.empty(uploadFilesNode);
							var fragment = document.createDocumentFragment();
							var innerHTMLText = '&nbsp;&nbsp;&nbsp;<img src="resources/images/icon-pdf.png"/> &nbsp;' + dataArray.fileName + 
												'&nbsp;<a href="javascript: saveFileRefToDB(\'mgrContract\', \'' + dataArray.fileName + '\', \'' + 
												dataArray['blob-key'] + '\');">Save</a>';
							domConstruct.create("li", {
		                        innerHTML: innerHTMLText
		                    }, fragment);
							 domConstruct.place(fragment, uploadFilesNode);
						}else{
							console.log('error',data,ioArgs);
						}
					}else{
						console.log('ugh?',arguments);
					}
				}, fileUploadStartMgr = function(dataArray){
					var progressMsgsNode = 'mgrContractWidgetsProgressMsgs';
					this.set('url', window.blobStoreURL);
					dom.byId(progressMsgsNode).innerHTML = 'Uploading ...';
				};
				
			var myUploaderMgr = new dojox.form.Uploader({ name: "uploadedFile", multiple:false, showProgress:true, label: "Select File",
					uploadOnSelect:true, url: blobStoreURL, onBegin: fileUploadStartMgr, onComplete: fileUploadCompleteMgr});
			dojo.byId("mgrContractWidgets").appendChild(myUploaderMgr.domNode);
			//Mgr Contract File Upload Ends
			
			
			//Health Inspection File Upload
			var fileUploadCompletehealthInspection = function(dataArray){
				var progressMsgsNode = 'healthInspectionWidgetsProgressMsgs';
				var widgetNode = 'healthInspectionWidgetsDiv';
				var docUploadedNode = 'healthInspectionUploaded';
					if(dataArray){
						if(dataArray.status && dataArray.status == "success"){
							dom.byId(progressMsgsNode).innerHTML = 'Upload Successful..';
							otherFx.wipeOut({node: dom.byId(widgetNode), duration: 1000, delay: 250, 
								onEnd: function(node){
									domStyle.set(this.node, {display: "none"});
								}
							}).play();
							var uploadFilesNode = dom.byId(docUploadedNode);
							domConstruct.empty(uploadFilesNode);
							var fragment = document.createDocumentFragment();
							var innerHTMLText = '&nbsp;&nbsp;<img src="resources/images/icon-pdf.png"/>&nbsp;' + dataArray.fileName ;
							domConstruct.create("li", {
		                        innerHTML: innerHTMLText
		                    }, fragment);
							domConstruct.place(fragment, uploadFilesNode);
							//This variable is used in Add/Edit Dialog to store the blobKey
							registry.byId('hiddenUploadedDocId').set('value', dataArray['blob-key']);
							//To Clear the Earlier Files
							domConstruct.empty(dom.byId('healthInspectionExisting'));
						}else{
							console.log('error',data,ioArgs);
						}
					}else{
						console.log('ugh?',arguments);
					}
				}, fileUploadStarthealthInspection = function(dataArray){
					var progressMsgsNode = 'healthInspectionWidgetsProgressMsgs';
					this.set('url', window.blobStoreURL);
					dom.byId(progressMsgsNode).innerHTML = 'Uploading ...';
					registry.byId('hiddenUploadedDocId').set('value', '0');
				};
				
			var myUploaderhealthInspection = new dojox.form.Uploader({ name: "uploadedFile", multiple:false, showProgress:true, label: "Select File",
					uploadOnSelect:true, url: blobStoreURL, onBegin: fileUploadStarthealthInspection, onComplete: fileUploadCompletehealthInspection});
			dojo.byId("healthInspectionWidgets").appendChild(myUploaderhealthInspection.domNode);
			//Health Inspection File Upload Ends
			
			
			
			
			
			var empSelectWidget = new formSelect({style: {width: '75%'}}, dom.byId('itemSummaryEditor'));
			empSelectWidget.startup();
			empSelectWidget.on('change', function(){
				registry.byId('addItemButton').set('disabled', false);
				registry.byId('updateItemButton').set('disabled', true);
				registry.byId('deleteItemButton').set('disabled', true);
			});
			
			
			var dateTextBox = new DateTextBox({value: new Date(), style: {width: '70%'}}, dom.byId('itemStartDateEditor'));
			dateTextBox.on('change', function(newValue){
				var oldValue = dijit.byId('hiddenItemDate').get('value');
				var oldWeek = locale.format(oldValue, {selector: 'date', datePattern: 'w', locale: 'en'});
				var newWeek = locale.format(newValue, {selector: 'date', datePattern: 'w', locale: 'en'});
				if(Math.abs(newWeek - oldWeek) > 0){
					var currentYear = locale.format(newValue, {selector: 'date', datePattern: 'yyyy', locale: 'en'});
					newWeek++;
					laborLayout.populateData(registry.byId('hiddenStoreId').get('value'), currentYear+'-'+newWeek);
				}
				dijit.byId('hiddenItemDate').set('value', newValue);
			});
			
			var updateItemButton = new Button({
	            label: "Update",
	            onClick: function(){
	            	if(Number(registry.byId('itemSummaryEditor').get('value')) > 0){
	            		var standByWidget = 'calendarEntryTitlePaneStandBy';
	            		registry.byId(standByWidget).show();
		            	var editedItem = {};
		            	var serviceURL = '/service/store/'+registry.byId('hiddenStoreId').get('value')+'/employee/'+registry.byId('itemSummaryEditor').get('value')+'/labor';
		            	var fmtTimeFrom = locale.format(registry.byId('itemStartTimeEditor').get('value'), {selector: 'date', datePattern: 'HH:mm', locale: 'en'});
		            	var fmtTimeTo = locale.format(registry.byId('itemEndTimeEditor').get('value'), {selector: 'date', datePattern: 'HH:mm', locale: 'en'});
		            	var strPosition = registry.byId('itemSummaryEditor').get('displayedValue');
		            	strPosition = (((strPosition.split('('))[1]).split(')'))[0];
		            	var recordToAdd = { id: registry.byId('hiddenLaborItemId').get('value'), storeId: registry.byId('hiddenStoreId').get('value'), 
		            			empId: registry.byId('itemSummaryEditor').get('value'), date: registry.byId('itemStartDateEditor').get('value'), 
		            			position: strPosition, active: true, timeFrom: fmtTimeFrom, timeTo: fmtTimeTo, updatedBy: 0 };
		            	
		            	ajaxRequest.put(serviceURL, {
		            		headers: { "Content-Type":"application/json"}, handleAs: 'json', 
			        		data: json.stringify(recordToAdd), timeout: 10000}).then(function(laborUpdateResponse){
			        			if(laborUpdateResponse.success){
			        				dom.byId('messages').innerHTML = 'Update Success';
			        				fmtTimeFrom = registry.byId('itemStartTimeEditor').get('displayedValue');
			        				fmtTimeTo = registry.byId('itemEndTimeEditor').get('displayedValue');
			        				recordToAdd.summary = (registry.byId('itemSummaryEditor').get('displayedValue')).replace(strPosition, (fmtTimeFrom + '-' + fmtTimeTo));
			        				recordToAdd.actualBeginTime = registry.byId('itemStartTimeEditor').get('displayedValue');
			        				recordToAdd.actualEndTime = registry.byId('itemEndTimeEditor').get('displayedValue');
			        				var beginDate = new Date(recordToAdd.date);
			        				var endDate = new Date(recordToAdd.date);
			        				switch(strPosition){
			        				case 'Manager':
			        					beginDate.setHours(8);beginDate.setMinutes(5);
			        					endDate.setHours(8);endDate.setMinutes(50);
			        					recordToAdd.begin = beginDate;
			        					recordToAdd.end = endDate;
			        					recordToAdd.calendar='Calendar0';
			        					break;
			        				case 'Front':
			        					beginDate.setHours(10);beginDate.setMinutes(5);
			        					endDate.setHours(10);endDate.setMinutes(50);
			        					recordToAdd.begin = beginDate;
			        					recordToAdd.end = endDate;
			        					recordToAdd.calendar='Calendar1';
			        					break;
			        				case 'Cook':
			        					beginDate.setHours(14);beginDate.setMinutes(5);
			        					endDate.setHours(14);endDate.setMinutes(50);
			        					recordToAdd.begin = beginDate;
			        					recordToAdd.end = endDate;
			        					recordToAdd.calendar='Calendar2';
			        					break;
			        				}
			        				var editedItem = lang.mixin({}, recordToAdd);
			        				console.log(editedItem);
			        				var calendar = registry.byId('labor-calendar');
			        				calendar.store.put(editedItem);
			        			}
			        			registry.byId(standByWidget).hide();
			        	}, function(error){
			        		dom.byId('messages').innerHTML = 'Error while updating --> ' + error;
			        		registry.byId(standByWidget).hide();
			        	});
	            	}
	            }
	        }, "updateItemButton");
			
			var addItemButton = new Button({
	            label: "Add",
	            onClick: function(){
	            	if(Number(registry.byId('itemSummaryEditor').get('value')) > 0){
	            		var standByWidget = 'calendarEntryTitlePaneStandBy';
	            		registry.byId(standByWidget).show();
	            		var editedItem = {};
	            		var serviceURL = '/service/store/'+registry.byId('hiddenStoreId').get('value')+'/employee/'+registry.byId('itemSummaryEditor').get('value')+'/labor';
		            	var fmtTimeFrom = locale.format(registry.byId('itemStartTimeEditor').get('value'), {selector: 'date', datePattern: 'HH:mm', locale: 'en'});
		            	var fmtTimeTo = locale.format(registry.byId('itemEndTimeEditor').get('value'), {selector: 'date', datePattern: 'HH:mm', locale: 'en'});
		            	var strPosition = registry.byId('itemSummaryEditor').get('displayedValue');
		            	strPosition = (((strPosition.split('('))[1]).split(')'))[0];
		            	var recordToAdd = { id: registry.byId('hiddenLaborItemId').get('value'), storeId: registry.byId('hiddenStoreId').get('value'),
		            			empId: registry.byId('itemSummaryEditor').get('value'), date: registry.byId('itemStartDateEditor').get('value'), 
		            			position: strPosition, active: true, timeFrom: fmtTimeFrom, timeTo: fmtTimeTo, updatedBy: 0 };
		            	
		            	ajaxRequest.post(serviceURL, {
		            		headers: { "Content-Type":"application/json"}, handleAs: 'json', 
			        		data: json.stringify(recordToAdd), timeout: 10000}).then(function(laborUpdateResponse){
			        			if(laborUpdateResponse.success){
			        				dom.byId('messages').innerHTML = 'Add Success';
			        				fmtTimeFrom = registry.byId('itemStartTimeEditor').get('displayedValue');
			        				fmtTimeTo = registry.byId('itemEndTimeEditor').get('displayedValue');
			        				recordToAdd.summary = (registry.byId('itemSummaryEditor').get('displayedValue')).replace(strPosition, (fmtTimeFrom + '-' + fmtTimeTo));
			        				recordToAdd.actualBeginTime = registry.byId('itemStartTimeEditor').get('displayedValue');
			        				recordToAdd.actualEndTime = registry.byId('itemEndTimeEditor').get('displayedValue');
			        				var beginDate = new Date(recordToAdd.date);
			        				var endDate = new Date(recordToAdd.date);
			        				switch(strPosition){
			        				case 'Manager':
			        					beginDate.setHours(8);beginDate.setMinutes(5);
			        					endDate.setHours(8);endDate.setMinutes(50);
			        					recordToAdd.begin = beginDate;
			        					recordToAdd.end = endDate;
			        					recordToAdd.calendar='Calendar0';
			        					break;
			        				case 'Front':
			        					beginDate.setHours(10);beginDate.setMinutes(5);
			        					endDate.setHours(10);endDate.setMinutes(50);
			        					recordToAdd.begin = beginDate;
			        					recordToAdd.end = endDate;
			        					recordToAdd.calendar='Calendar1';
			        					break;
			        				case 'Cook':
			        					beginDate.setHours(14);beginDate.setMinutes(5);
			        					endDate.setHours(14);endDate.setMinutes(50);
			        					recordToAdd.begin = beginDate;
			        					recordToAdd.end = endDate;
			        					recordToAdd.calendar='Calendar2';
			        					break;
			        				}
			        				//console.log(laborUpdateResponse.model);
			        				//console.log(recordToAdd);
			        				//var editedItem = lang.mixin(laborUpdateResponse.model, recordToAdd);
			        				recordToAdd.id = laborUpdateResponse.model.id;
			        				var calendar = registry.byId('labor-calendar');
			        				calendar.store.put(recordToAdd);
			        			}
			        			registry.byId(standByWidget).hide();
			        	}, function(error){
			        		dom.byId('messages').innerHTML = 'Error while adding --> ' + error;
			        		registry.byId(standByWidget).hide();
			        	});
	            	}
	            	
	            }
	        }, "addItemButton");
			
			var deleteItemButton = new Button({
	            label: "Delete",
	            onClick: function(){
	            	if(Number(registry.byId('itemSummaryEditor').get('value')) > 0){
	            		var standByWidget = 'calendarEntryTitlePaneStandBy';
	            		registry.byId(standByWidget).show();
	            		var serviceURL = '/service/labor/' + registry.byId('hiddenLaborItemId').get('value');
	            		ajaxRequest.put(serviceURL, {
		            		headers: { "Content-Type":"application/json"}, handleAs: 'json', 
			        		timeout: 10000}).then(function(laborUpdateResponse){
			        			if(laborUpdateResponse.success){
			        				var calendar = registry.byId('labor-calendar');
			        				calendar.store.remove(registry.byId('hiddenLaborItemId').get('value'));
			        			}
			        			registry.byId(standByWidget).hide();
			        		}, function(error){
				        		dom.byId('messages').innerHTML = 'Error while adding --> ' + error;
				        		registry.byId(standByWidget).hide();
				        	});
	            	}
	            }}, "deleteItemButton");
			
			
			
			addItemButton.set('disabled', false);
			updateItemButton.set('disabled', true);
			deleteItemButton.set('disabled', true);
			
			var quartersStore = new Memory({data: [{id: 0, name:"--Select--", label:"--Select--"},
			                                       {id: 1, name:"Quarter 1", label:"Quarter 1"}, 
			                                       {id: 2, name:"Quarter 2", label:"Quarter 2"}, 
			                                       {id: 3, name:"Quarter 3", label:"Quarter 3"},
			                                       {id: 4, name:"Quarter 4", label:"Quarter 4"}]});
			                                   
			var quartersList = new FilteringSelect({
	             id: "quartersList",
	             value: 0,
	             store: quartersStore,
	             searchAttr: "name",
	             name: "quartersList",
	             labelAttr: "label",
	             style: "width: 90px;"
	       }, dom.byId("quartersList"));
		
			quartersList.on('change', function(newValue){
				if(Number(newValue) > 0)
					empLayout.populateMgrReviewForm(newValue);
				else empLayout.resetMgrForm();
			});
			
			dojo.connect(registry.byId('storeInfoTitlePane'),"toggle",function(){
				console.log('Open Value is ', this.open);
				if(!this.open){
					dom.byId('storeInfoTabContainer').style.height = '94%';
				} else{
					dom.byId('storeInfoTabContainer').style.height = '52%';
				}
				registry.byId('storeInfoTabContainer').resize();
			});
	  });
});

function createPieChart(divId){
	  var data = google.visualization.arrayToDataTable([
        ['Sales', 'Amount'],
        ['Labor',     28],
        ['Food Cost',      32],
        ['Advertisement',  3],
        ['Misc', 22],
        ['Profit',    15]
      ]);

      var options = {title: 'Sales Distribution', titleTextStyle: {}, chartArea:{left:2,top:20,width:"100%",height:"60%"}, is3D: true,
    		  legend: {position: 'bottom', textStyle: {color: 'black', fontSize: 11}, alignment: 'center'}
      };

      var chart = new google.visualization.PieChart(document.getElementById('accountingChartDiv'));
      chart.draw(data, options);
}
require(["dojox/form/Uploader", "dojox/embed/Flash", "dojox/form/uploader/plugins/IFrame"], function(uploader, flash){
	if(flash.available){
		  	require(["dojox/form/uploader/plugins/Flash"]);
		}else{
			require(["dojox/form/uploader/plugins/IFrame"]);
		}
});
/*var fileUploadIdAppender = 0;
function addNewUpload(){
	var node = document.createElement('input'); 
	dojo.byId('leaseContentDocUpload').appendChild(node);
	var widget = new dojox.form.FileInputBlind({
		id: "dynamic"+(++fileUploadIdAppender),
		url: "/service/upload",
		//url:"http://archive.dojotoolkit.org/nightly/checkout/dojox/widget/resources/RecieveFile.php",
		name: "dynamic"+fileUploadIdAppender,
		onComplete: fileUploadComplete
	},node);
	widget.startup();
}
*/
