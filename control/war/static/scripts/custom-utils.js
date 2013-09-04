function displayMessage(trId, msgSpan, msg, styleClassToApply) {
    var styleClasses = ["success", "warning", "info"];
    require(["dojo/_base/array", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/domReady!"], function (array, domClass, domStyle, domAttr) {
        domStyle.set(trId, {
            display: ""
        });
        domAttr.set(msgSpan, "innerHTML", msg);
        array.forEach(styleClasses, function (entry, i) {
            domClass.remove(msgSpan, entry);
        });
        domClass.add(msgSpan, styleClassToApply);
    });
}

function fetchMgrYearlyReview(year){
	var empLayout = require('controls/EmployeeLayoutController');
	empLayout.fetchReviewsForYear(year);
}

function fetchAccountingYearlyDetails(year){
	var accLayout = require('controls/AccountingLayoutController');
	accLayout.fetchAccDetailsForYear(year);
}

function returnToAccountsPane(){
	var otherFx = require('dojo/fx');
	var dom = require('dojo/dom');
	var domStyle = require('dojo/dom-style');
	var query = require('dojo/query');
	var wipeOut = otherFx.wipeOut({node: dom.byId('accountingDetailsPane'), duration: 1000, delay: 250, 
		onEnd: function(node){
				domStyle.set(this.node, {display: "none", width: "99%", height: "99%"});
				dom.byId('accountsQuarterDetails').style.display = '';
				dom.byId('accountsYearlyDetails').style.display = 'none';
			}
	});
	var wipeIn = otherFx.wipeIn({node: dom.byId('accountingDetailsPane'), duration: 1000, delay: 250, 
		onBegin: function(node){
				domStyle.set(this.node, {display: "", width: "99%", height: "99%"});
				dom.byId('accountsQuarterDetails').style.display = '';
				dom.byId('accountsYearlyDetails').style.display = 'none';
			},
		onEnd: function(node){
			
		}
	});
	otherFx.chain([wipeOut, wipeIn]).play();
	var accLayout = require('controls/AccountingLayoutController');
	accLayout.reset();
}

function returnToManagerPane(){
	var otherFx = require('dojo/fx');
	var dom = require('dojo/dom');
	var domStyle = require('dojo/dom-style');
	var query = require('dojo/query');
	var registry = require('dijit/registry');
	var empLayout = require('controls/EmployeeLayoutController');
	empLayout.resetMgrForm();
	empLayout.fetchMgrLeavesDetails(registry.byId('mgrList').get('value'));
	
	var wipeOut = otherFx.wipeOut({node: dom.byId('mgrYearlyDetailsRegion'), duration: 1000, delay: 250, 
		onEnd: function(node){
				domStyle.set(this.node, {display: "none", width: "99%", height: "99%"});
				domStyle.set(dom.byId('mgrUnusedPersonalDaysDetailsDiv'), "display","none");
			}
	});
	
	var wipeIn = otherFx.wipeIn({node: dom.byId('managerDetailsPane'), duration: 1000, delay: 250, 
		onBegin: function(node){
				domStyle.set(this.node, {display: "", width: "99%", height: "99%"});
				domStyle.set(dom.byId('mgrReviewFormDiv'), "display","");
			}
	});
	otherFx.chain([wipeOut, wipeIn]).play();
	query('#mgrYearlyReviewsTable td a').forEach(function(node){
		if(registry.byId('hiddenSelectedYear').get('value') == node.innerHTML){
			domStyle.set(node, 'color', '#fff');
			domStyle.set(node, 'font-weight', 'bold');
			domStyle.set(node.parentNode, 'background-color', '#a00');
		}
		else {
			domStyle.set(node, 'color', '');
			domStyle.set(node, 'font-weight', '');
			domStyle.set(node.parentNode, 'background-color', '#fff');
		}
	});
}


function saveFileRefToDB(tab, fileName, blobKey){
	var registry = require('dijit/registry'), dom = require('dojo/dom'), otherFx = require('dojo/fx'), domStyle = require('dojo/dom-style'),
	domConstruct = require('dojo/dom-construct'), ajaxRequest = require("dojo/request"), json = require('dojo/json'), 
	storeLayout = require('controls/StoreLayoutController'), empLayout = require('controls/EmployeeLayoutController');
	var linkedId, standByWidget;
	
	switch(tab){
		case 'store-lease': 
			linkedId = registry.byId('hiddenStoreId').get('value');
			standByWidget = 'storeInfoLeaseDocumentsStandBy';
			break;
		case 'photo': 
			var empId = empLayout.getEmployeeId();
			linkedId = Number(empId);
			standByWidget = 'employeePaneInfoStandBy';
			break;
		case 'mgrContract': 
			var empId = registry.byId('mgrList').get('value');
			linkedId = Number(empId);
			standByWidget = 'mgrContractStandBy';
			break;
	}
	
	var jsonData = {};
	jsonData['linkedId'] = linkedId;
	jsonData['fileName'] = fileName;
	jsonData['blobKey'] = blobKey;
	jsonData['tab'] = tab;
	
	registry.byId(standByWidget).show();
	ajaxRequest.post("/service/blobs",{
		headers: { "Content-Type":"application/json"},
		data: json.stringify(jsonData),
		handleAs: 'json'
	}).then(function(uploadBlobData){
		if(uploadBlobData.success){
			switch(tab){
			case 'store-lease': 
				domConstruct.empty(dom.byId('storeInfoUploadedDocument'));
				registry.byId(standByWidget).hide();
				storeLayout.fetchStoreLeaseBlobs(linkedId);
				break;
			case 'photo': 
				domConstruct.empty(dom.byId('empPhotoUploadOptions'));
				registry.byId(standByWidget).hide();
				break;
			case 'mgrContract':
				domConstruct.empty(dom.byId('mgrContractUploaded'));
				registry.byId(standByWidget).hide();
				empLayout.fetchManagerContractBlobs(linkedId);
				break;
			}
		}
	}, function(error){
		console.log('Issue saving the Uploaded file. Please try again later.');
		registry.byId(standByWidget).hide();
	});
}

function showFileUploadDialog(domNode){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var otherFx = require('dojo/fx');
	var domStyle = require('dojo/dom-style');
	var ajaxRequest = require("dojo/request");
	
	var standByWidget, fileUploadWidget, progressMsg;
	switch(domNode){
		case 'storeInfo':
			standByWidget = 'storeInfoLeaseDocumentsStandBy';
			fileUploadWidget = 'fileUploadWidgetsDiv';
			progressMsg = 'fileUploadProgressMsgs';
			break;
		case 'empPane':
			standByWidget = 'employeePaneInfoStandBy';
			fileUploadWidget = 'fileUploadWidgetsDivEmp';
			progressMsg = 'fileUploadProgressMsgsEmp';
			break;
		case 'mgrContract':
			standByWidget = 'mgrContractStandBy';
			fileUploadWidget = 'mgrContractWidgetsDiv';
			progressMsg = 'mgrContractWidgetsProgressMsgs';
			break;
	}
	
	registry.byId(standByWidget).show();
	ajaxRequest.get("/service/getUploadUrl",{
		handleAs: 'json'
	}).then(function(uploadURLObject){
		if(uploadURLObject.success){
			window.blobStoreURL = uploadURLObject.model.uploadURL;
			otherFx.wipeIn({node: dom.byId(fileUploadWidget),duration: 1000, delay: 250, 
				onBegin: function(node){
						domStyle.set(this.node, {display: "block"});
						dom.byId(progressMsg).innerHTML='';
				}
			}).play();
			registry.byId(standByWidget).hide();
		}
	}, function(error){
		console.log('Upload Service is Unavailable. Please check again later.');
		registry.byId(standByWidget).hide();
	});
}

function hideFileUploadDialog(domNode){
	var otherFx = require('dojo/fx');
	var dom = require('dojo/dom');
	var domStyle = require('dojo/dom-style');
	
	var fileUploadWidget;
	switch(domNode){
		case 'storeInfo':
			fileUploadWidget = 'fileUploadWidgetsDiv';
			break;
		case 'empPane':
			fileUploadWidget = 'fileUploadWidgetsDivEmp';
			break;
		case 'mgrContract':
			fileUploadWidget = 'mgrContractWidgetsDiv';
			break;
	}
	otherFx.wipeOut({node: dom.byId(fileUploadWidget), duration: 1000, delay: 250, 
		onEnd: function(node){
			domStyle.set(this.node, {display: "none"});
		}
	}).play();
}

function checkSelectedPane(trId, rightPane, storeId) {
    var query = require("dojo/query");
    var domClass = require("dojo/dom-class");
    var registry = require("dijit/registry");
    var storeLayout = require("controls/StoreLayoutController");
    var empLayout = require("controls/EmployeeLayoutController");
    var laborLayout = require("controls/LaborLayoutController");
    var accLayout = require("controls/AccountingLayoutController");
    var inventoryLayout = require("controls/InventoryLayoutController");
    var domStyle = require('dojo/dom-style');
    var otherFx = require('dojo/fx');
    var dom = require('dojo/dom');
    query("#locationTable tr").forEach(function (node) {
           domClass.remove(node.id, 'active');
           domClass.remove(node.id, 'dijitTab');
           domClass.remove(node.id, 'dijitTabChecked');
           //domClass.replace(trId, 'hoveredClass', 'hoveredClass');
    });
    //domClass.add(trId, 'active');
    domClass.add(trId, 'active');
    domClass.add(trId, 'dijitTab');
    domClass.add(trId, 'dijitTabChecked');
    registry.byId('hiddenStoreId').set('value', storeId);
    storeId = registry.byId('hiddenStoreId').get('value');
    var child = registry.byId('tabContainer').selectedChildWidget;
    switch (child.get('id')) {
        case 'storeInfo':
            storeLayout.populateStoreData(storeId);
            break;
        case 'employeePane':
            empLayout.populateEmployeesData(storeId);
            break;
        case 'laborPane':
        	if(domStyle.get(dom.byId('employeePaneInfo'), 'display') != 'none')
				otherFx.wipeOut({node: dom.byId('employeePaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
			laborLayout.resetToCurrentWeek(true);
			if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') == 'none')
				otherFx.wipeIn({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "block"});}}).play();
			break;
        case 'managerPane':
        	empLayout.populateManagerTabDetails(registry.byId('hiddenStoreId').get('value'));
			if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
				otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
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
}

function modifyContentPaneTitles() {
    require(["dijit/registry", "dojo/dom-attr", "dojo/domReady!"], function (registry, domAttr) {
        console.log('Setting Title Node ');
        var widget = registry.byId('storeInfo');
        widget.set('title', "<img align='top' src='resources/images/store.png'/> &nbsp;" + widget.get('title'));

        widget = registry.byId('managerPane');
        widget.set('title', "<img align='top' src='resources/images/manager-icon.png'/> &nbsp;" + widget.get('title'));

        widget = registry.byId('employeePane');
        widget.set('title', "<img align='top' src='resources/images/admin.png'/> &nbsp;" + widget.get('title'));

        widget = registry.byId('laborPane');
        widget.set('title', "<img align='top' src='resources/images/labor.png'/> &nbsp;" + widget.get('title'));
        
        widget = registry.byId('managePane');
        widget.set('title', "<img align='top' src='resources/images/manage.png'/> &nbsp;" + widget.get('title'));
    });
}

/*function modifyStoreTabGridTitles() {
    require(["dijit/registry", "dojo/dom-attr", "dojo/domReady!"], function (registry, domAttr) {
        console.log('Setting Title Node ');
        var widget = registry.byId('storeAlarms');
        widget.set('title', widget.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addStoreAlarmTabRecord();'/>");

        widget = registry.byId('storeKeys');
        widget.set('title', widget.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addStoreKeyTabRecord();'/>");

        widget = registry.byId('storeMaintenance');
        widget.set('title', widget.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addStoreMaintenanceTabRecord();'/>");

    });
}*/

function addStoreAlarmTabRecord(event) {
	try{if (!event) var event = window.event;
	event.preventDefault();
	event.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var storeLayout = require("controls/StoreLayoutController");
	storeLayout.addRowInGrid('storeAlarmCodesGrid');
}

function addStoreKeyTabRecord(evt) {
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var storeLayout = require("controls/StoreLayoutController");
	storeLayout.addRowInGrid('storeKeysGrid');
}

function addStoreMaintenanceTabRecord(evt) {
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var storeLayout = require("controls/StoreLayoutController");
	storeLayout.addRowInGrid('storeMaintenanceGrid');
}

function addEmployeeRecord(evt) {
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var empLayout = require("controls/EmployeeLayoutController");
    empLayout.addRowInGrid('employeesGrid');
}

function addEmployeeSalaryTabRecord(evt) {
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var empLayout = require("controls/EmployeeLayoutController");
    empLayout.addRowInGrid('employeeSalaryDetailsGrid');
}

function addEmployeeDisciplineTabRecord(evt) {
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var empLayout = require("controls/EmployeeLayoutController");
    empLayout.addRowInGrid('employeeDisciplineGrid');
}

function addEmployeeDoingGoodTabRecord(evt) {
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var empLayout = require("controls/EmployeeLayoutController");
    empLayout.addRowInGrid('employeeDoingGoodGrid');
}

function addEmployeeLeavesTabRecord(evt) {
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var empLayout = require("controls/EmployeeLayoutController");
    empLayout.addRowInGrid('employeeLeavesGrid');
}

function addEmployeeLaborTabRecord(evt){
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var empLayout = require("controls/EmployeeLayoutController");
    empLayout.addRowInGrid('empLaborDetailsGrid');
}

function addManagerLeavesTabRecord(evt){
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var empLayout = require("controls/EmployeeLayoutController");
    empLayout.addRowInGrid('mgrLeavesGrid');
}


function styleTabContainer() {
    console.log('Styling the Tab Container');
    require(["dijit/registry"], function (registry) {
        var tabContainer = registry.byId("tabContainer");
        dojo.addClass(tabContainer.tablist.pane2button["storeInfo"].domNode, "customTabClass");
    });
}

/*function modifyWidgetTitle(nodeId) {
    require(["dijit/registry"], function (registry) {
        var widget = registry.byId(nodeId);
        widget.set('title', widget.get('title') + "<a href='javascript: addImportantDate()'> Add Date</a>");
    });
}*/

function modifyStoreDateLabel(nodeId) {
	var query = require("dojo/query");
    var qry = "label[for='" + nodeId + "']";
    query(qry).forEach(function (node) {
          node.innerHTML = node.innerHTML + '<font style="font-weight: normal; margin-left: 10px;"><a href="javascript: addImportantDate();">Add Date</a></font>'
    });
}

function addImportantDate(){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var otherFx = require('dojo/fx');
	var domStyle = require('dojo/dom-style');
	var ajaxRequest = require("dojo/request");
	registry.byId('storeInfoImpDatesStandBy').show();
	otherFx.wipeIn({node: dom.byId('store-info-important-dates-content-new'),duration: 1000, delay: 250, 
		onBegin: function(node){
				domStyle.set(this.node, {display: "block"});
				registry.byId('impDateInput').set('value', new Date());
				registry.byId('impDateNotes').set('value', '');
		}
	}).play();
	registry.byId('storeInfoImpDatesStandBy').hide();
}

function hideImportantDate(){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var otherFx = require('dojo/fx');
	var domStyle = require('dojo/dom-style');
	var ajaxRequest = require("dojo/request");
	registry.byId('storeInfoImpDatesStandBy').show();
	otherFx.wipeOut({node: dom.byId('store-info-important-dates-content-new'),duration: 1000, delay: 250, 
		onEnd: function(node){
				domStyle.set(this.node, {display: "none"});
				registry.byId('impDateInput').set('value',  new Date());
				registry.byId('impDateNotes').set('value', '');
		}
	}).play();
	registry.byId('storeInfoImpDatesStandBy').hide();
}

function saveImpDate(){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var otherFx = require('dojo/fx');
	var domStyle = require('dojo/dom-style');
	var ajaxRequest = require("dojo/request");
	var json = require('dojo/json');
	var storeLayout = require('controls/StoreLayoutController');
	var standByWidget = 'storeInfoImpDatesStandBy';
	var jsonData = {};
	jsonData['impDate'] = registry.byId('impDateInput').get('value');
	jsonData['notes'] = registry.byId('impDateNotes').get('value');
	jsonData['storeId'] = registry.byId('hiddenStoreId').get('value');
	jsonData['active'] = true;
	jsonData['updatedBy'] = 0;
	
	registry.byId(standByWidget).show();
	ajaxRequest.post("/service/store/" +registry.byId('hiddenStoreId').get('value') + "/dates",{
		headers: { "Content-Type":"application/json"},
		data: json.stringify(jsonData),
		handleAs: 'json'
	}).then(function(datesResponse){
		if(datesResponse.success){
			//registry.byId(standByWidget).hide();
			storeLayout.refreshStoreDates(registry.byId('hiddenStoreId').get('value'));
		}
	}, function(error){
		console.log('Issue saving Important Date.');
		registry.byId(standByWidget).hide();
	});
}

/*function updateGridRowToDB(id, gridId) {
    require(["controls/StoreLayoutController", "controls/EmployeeLayoutController", "dojo/domReady!"], function (storeLayout, empLayout) {
        switch(gridId){
        case "storeAlarmCodesGrid":
        	storeLayout.updateGridRow(true, id, gridId);
        	break;
        case "storeKeysGrid":
        	storeLayout.updateGridRow(true, id, gridId);
        	break;
        case "storeMaintenanceGrid":
        	storeLayout.updateGridRow(true, id, gridId);
        	break;
        case "employeesGrid":
        	empLayout.updateGridRow(true, id, gridId);
        	break;
        }
    });
}*/

/*function addGridRowToDB(update, id, gridId) {
    require(["controls/StoreLayoutController", "controls/EmployeeLayoutController", "dojo/domReady!"], function (storeLayout, empLayout) {
        switch(gridId){
        case "storeAlarmCodesGrid":
        	storeLayout.updateGridRow(update, id, gridId);
        	break;
        case "storeKeysGrid":
        	storeLayout.updateGridRow(update, id, gridId);
        	break;
        case "storeMaintenanceGrid":
        	storeLayout.updateGridRow(update, id, gridId);
        	break;
        case "employeesGrid":
        	empLayout.updateGridRow(update, id, gridId);
        	break;
        case "employeeSalaryDetailsGrid":
        	empLayout.updateGridRow(update, id, gridId);
        	break;
        case "employeeDisciplineGrid":
        	empLayout.updateGridRow(update, id, gridId);
        	break;
        case "employeeDoingGoodGrid":
        	empLayout.updateGridRow(update, id, gridId);
        	break;
        }
    });
}*/

function connectEventsToLocationTable() {
    require(['dojo/on', 'dojo/dom-class', 'dojo/dom-attr', 'dojo/query'],

    function (on, domClass, domAttr, query) {
        on(locationTable, "tr:select", function (evt) {
            // console.log("Clicked on node ", evt.target,
            // " in table row ", this);
            //dojo.addClass(this, active);
        });
    });
}

function selectLaborPane(yearWeek){
	console.log('Year Week is --> ' + yearWeek);
	var registry = require("dijit/registry");
	setTimeout(registry.byId("tabContainer").selectChild(registry.byId("laborPane")), 1000);
}

function addItemToStock(){
	var inventoryLayout = require('controls/InventoryLayoutController');
	inventoryLayout.showAddItemDialog();
}

function createInvoice(){
	require('controls/InventoryLayoutController').createInvoiceAction();
}

function checkStock(){
	require('controls/InventoryLayoutController').reset();
}

function editInvoiceItem(invoiceItemId, rowIndex){
	require('controls/InventoryLayoutController').editInvoiceItem(invoiceItemId, rowIndex);
}

function applySecurityRoles(authoritiesData){
	console.log('Applying Security using ', authoritiesData);
	var registry = require('dijit/registry');
	var domConstruct = require('dojo/dom-construct');
	
	var role = authoritiesData.roles;
	var stores = authoritiesData.stores;
	
	if(role == 'ROLE_OWNER')
		stores = 'store-1, store-2, store-3, store-4, store-5';
	
	
	var storeToSelect = 0;
	if(stores.indexOf('store-1') < 0)
		domConstruct.destroy("locationTabletr1");
	else storeToSelect = 1;
	
	if(stores.indexOf('store-2') < 0) 
		domConstruct.destroy("locationTabletr2");
	else 
		storeToSelect = storeToSelect > 0 ? storeToSelect : 2;
	
	if(stores.indexOf('store-3') < 0)
		domConstruct.destroy("locationTabletr3");
	else 
		storeToSelect = storeToSelect > 0 ? storeToSelect : 3;
	
	if(stores.indexOf('store-4') < 0)
		domConstruct.destroy("locationTabletr4");
	else 
		storeToSelect = storeToSelect > 0 ? storeToSelect : 4;
	
	if(stores.indexOf('store-5') < 0)
		domConstruct.destroy("locationTabletr5");
	else 
		storeToSelect = storeToSelect > 0 ? storeToSelect : 5;
	
	
	switch(role){
		case 'ROLE_OWNER':
			checkSelectedPane('locationTabletr'+storeToSelect, 'rightAccordion', storeToSelect);
			break;
		case 'ROLE_MGR':
			//Remove the Manage Tab Starts here
			registry.byId('tabContainer').removeChild(registry.byId('managePane'));
			registry.byId('managePane').destroy();
			//Remove the Manage Tab Ends here
			
			//Remove the View Schedule Column in Store Info --> Labor Summary Grid Start here
			registry.byId('storeLaborGrid').layout.setColumnVisibility(0,false);
			//Remove the View Schedule Column in Store Info --> Labor Summary Grid Ends here
			
			//Remove the Manager Tab in the Main Tab Container Starts here
			registry.byId('tabContainer').removeChild(registry.byId('managerPane'));
			registry.byId('managerPane').destroy();
			//Remove the Manager Tab in the Main Tab Container Ends here
			
			//Remove the Update Column in Employees Grid, Salary Particulars Tab in the Employee Tabs, Labor Entry Tab
			registry.byId('employeesGrid').layout.setColumnVisibility(0,false);
			
			registry.byId('employeeInfoTabContainer').removeChild(registry.byId('empSalaryDetails'));
			registry.byId('empSalaryDetails').destroy();
			
			registry.byId('employeeInfoTabContainer').removeChild(registry.byId('empLaborDetails'));
			registry.byId('empLaborDetails').destroy();
			//All of the above Ends here
			
			//Remove the Accounting Tab Starts here
			registry.byId('tabContainer').removeChild(registry.byId('accountingPane'));
			registry.byId('accountingPane').destroy();
			//Remove the Accounting Tab Ends here
			
			//Adjusting the Inventory Tab Starts here
			registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(2,false);
			registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(3,false);
			
			registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(4,false);
			registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(5,false);
			registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(6,false);
			registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(7,false);
			//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(8,false);
			//Ends here
			
			checkSelectedPane('locationTabletr'+storeToSelect, 'rightAccordion', storeToSelect);
			break;
		case 'ROLE_EMP':
			break;
	}
	
	//grid.layout.setColumnVisibility(columnIndex,booleanValue);
	//pane.set("disabled", true);
	
	/*For Removing a child of Tab Container*/
		//dijit.byId("myTabContainer").removeChild(dijit.byId("myContentPane"));
		//dijit.byId("myContentPane").destroy();
	/*For Removing a child of Tab Container*/
}