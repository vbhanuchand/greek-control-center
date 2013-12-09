var INVENTORY_DISTRIBUTORS = [{id: '400', name: 'FREEZER', color: '#2E2EFE'},
	                             {id: '500', name: 'FRIDGE', color: '#8904B1'},
	                             {id: '600', name: 'DRY GOODS', color: '#B40431'},
	                             {id: '700', name: 'PAPER/CLEANING', color: '#21610B'}];

var INVENTORY_DISTRIBUTORS_MAP = {
									'400': {id: '400', name: 'FREEZER', color: '#2E2EFE'},
									'500': {id: '500', name: 'FRIDGE', color: '#8904B1'},
									'600': {id: '600', name: 'DRY GOODS', color: '#B40431'},
									'700': {id: '700', name: 'PAPER/CLEANING', color: '#21610B'}
								};
var INVENTORY_ITEMS_INFO = {};

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

function fetchAirportAccountingYearlyDetails(year, domId){
	var storeLayout = require('controls/StoreLayoutController');
	storeLayout.fetchAirportSectionYearDetails(year, domId);
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
				this.node.style.display = 'none';
				this.node.style.width = '99%';
				this.node.style.height = '1%';
				//domStyle.set(this.node, {display: "none", width: "99%", height: "2%"});
				//domStyle.set(dom.byId('mgrUnusedPersonalDaysDetailsDiv'), "display","none");
				dom.byId('mgrUnusedPersonalDaysDetailsDiv').style.display = 'none';
			}
	});
	
	var wipeIn = otherFx.wipeIn({node: dom.byId('managerDetailsPane'), duration: 1000, delay: 250, 
		onBegin: function(node){
				this.node.style.display = 'block';
				this.node.style.width = '99%';
				this.node.style.height = '39%';
				try{dom.byId('mgrReviewFormDiv').style.display = 'block';}catch(e){}
			},
		onEnd: function(){
			dom.byId('mgrDetailsTabContainer').style.display = '';
			dijit.byId('mgrDetailsTabContainer').selectChild(dijit.byId('addReviewTab'));
			dijit.byId('mgrDetailsTabContainer').selectChild(dijit.byId('mgrLeavesTab'));
		}
	});
	otherFx.chain([wipeOut, wipeIn]).play();
	query('#mgrYearlyReviewsTable td a').forEach(function(node){
		if(registry.byId('hiddenSelectedYear').get('value') == node.innerHTML){
			domStyle.set(node, 'color', '#fff');
			domStyle.set(node, 'font-weight', 'bold');
			domStyle.set(node, 'padding-left', '3px');
			domStyle.set(node, 'padding-right', '3px');
			domStyle.set(node.parentNode, 'background-color', '#a00');
		}
		else {
			domStyle.set(node, 'color', '');
			domStyle.set(node, 'font-weight', '');
			domStyle.set(node, 'padding-left', '3px');
			domStyle.set(node, 'padding-right', '3px');
			domStyle.set(node.parentNode, 'background-color', '#fff');
		}
	});
}


function saveFileRefToDB(tab, fileName, blobKey){
	var registry = require('dijit/registry'), dom = require('dojo/dom'), otherFx = require('dojo/fx'), domStyle = require('dojo/dom-style'),
	domConstruct = require('dojo/dom-construct'), ajaxRequest = require("dojo/request"), json = require('dojo/json'), 
	storeLayout = require('controls/StoreLayoutController'), empLayout = require('controls/EmployeeLayoutController'), accLayout = require('controls/AccountingLayoutController');
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
		case 'accMonthlyDocument': 
			var accRecId = registry.byId('hiddenAccountingRecordId').get('value');
			linkedId = Number(accRecId);
			standByWidget = 'accMonthlyDocumentStandBy';
			break;
		/*case 'airportSectionDocs': 
			linkedId = 5;
			standByWidget = 'airportSectionDocsStandBy';
			break;*/
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
				case 'accMonthlyDocument': 
					domConstruct.empty(dom.byId('accMonthlyDocumentUploaded'));
					registry.byId(standByWidget).hide();
					accLayout.fetchAccountingMonthlyBlobs(linkedId);
					break;
				/*case 'airportSectionDocs': 
					domConstruct.empty(dom.byId('airportSectionDocsUploaded'));
					registry.byId(standByWidget).hide();
					storeLayout.fetchAirportLeaseBlobs(linkedId);
					break;*/
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
		case 'healthInspection':
			standByWidget = 'healthInspectionStandBy';
			fileUploadWidget = 'healthInspectionWidgetsDiv';
			progressMsg = 'healthInspectionWidgetsProgressMsgs';
			break;
		case 'accMonthlyDocument':
			standByWidget = 'accMonthlyDocumentStandBy';
			fileUploadWidget = 'accMonthlyDocumentWidgetsDiv';
			progressMsg = 'accMonthlyDocumentWidgetsProgressMsgs';
			if(!(registry.byId('accountingQuartersList').get('value') > 0) || !(parseInt(registry.byId('hiddenAccountingRecordId').get('value')) > 0)){
				if(!(registry.byId('accountingQuartersList').get('value') > 0)){
					alert('Please Select a Month');
					return;
				}
				if(!parseInt(registry.byId('hiddenAccountingRecordId').get('value') > 0)){
					alert('Please enter data for the Selected Month first');
					return;
				}
			}
			break;
		/*case 'airportSectionDocs':
			standByWidget = 'airportSectionDocsStandBy';
			fileUploadWidget = 'airportSectionDocsWidgetsDiv';
			progressMsg = 'airportSectionDocsWidgetsProgressMsgs';
			break;*/
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
		case 'healthInspection':
			fileUploadWidget = 'healthInspectionWidgetsDiv';
			break;
		case 'accMonthlyDocument':
			fileUploadWidget = 'accMonthlyDocumentWidgetsDiv';
			break;
		/*case 'airportSectionDocs':
			fileUploadWidget = 'airportSectionDocsWidgetsDiv';
			break;*/
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
    query("#locationTable li").forEach(function (node) {
           domClass.remove(node.id, 'active');
           //domClass.remove(node.id, 'dijitTab');
           //domClass.remove(node.id, 'dijitTabChecked');
           //domClass.replace(trId, 'hoveredClass', 'hoveredClass');
    });
    //domClass.add(trId, 'active');
    domClass.add(trId, 'active');
    //domClass.add(trId, 'dijitTab');
    //domClass.add(trId, 'dijitTabChecked');
    registry.byId('hiddenStoreId').set('value', storeId);
    storeId = registry.byId('hiddenStoreId').get('value');
    
    if((storeId == 5) || (storeId == '5')){
    	toggleAirportSection();
    } else {
    	toggleAirportSection();
	    var child = registry.byId('tabContainer').selectedChildWidget;
	    switch (child.get('id')) {
	        case 'storeInfo':
	            storeLayout.populateStoreData(storeId);
	            if(domStyle.get(dom.byId('inventoryLegendTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('inventoryLegendTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
	            break;
	        case 'employeePane':
	            empLayout.populateEmployeesData(storeId);
	            if(domStyle.get(dom.byId('inventoryLegendTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('inventoryLegendTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
	            break;
	        case 'laborPane':
	        	if(domStyle.get(dom.byId('employeePaneInfo'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('employeePaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				laborLayout.resetToCurrentWeek(true);
				if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') == 'none')
					otherFx.wipeIn({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "block"});}}).play();
				if(domStyle.get(dom.byId('inventoryLegendTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('inventoryLegendTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				break;
	        case 'managerPane':
	        	empLayout.populateManagerTabDetails(registry.byId('hiddenStoreId').get('value'));
				if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				if(domStyle.get(dom.byId('inventoryLegendTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('inventoryLegendTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				break;
	        case 'accountingPane':
				if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				if(domStyle.get(dom.byId('inventoryLegendTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('inventoryLegendTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				accLayout.reset();
				break;
	        case 'inventoryPane':
				if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				inventoryLayout.reset();
				if(domStyle.get(dom.byId('inventoryLegendTitlePane'), 'display') == 'none')
					otherFx.wipeIn({node: dom.byId('inventoryLegendTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "block"});}}).play();
				break;
	        case 'templatesPane':
				if(domStyle.get(dom.byId('laborPaneInfo'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				if(domStyle.get(dom.byId('inventoryLegendTitlePane'), 'display') != 'none')
					otherFx.wipeOut({node: dom.byId('inventoryLegendTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
				storeLayout.refreshTemplatesPane(registry.byId('hiddenStoreId').get('value'));
				break;
	    }
    }
}

function modifyContentPaneTitles() {
    require(["dijit/registry", "dojo/dom-attr", "dojo/domReady!"], function (registry, domAttr) {
        console.log('Setting Title Node ');
        
        var widget = registry.byId('storeInfo');
        try{
        	widget.set('title', "<img align='top' src='resources/images/store.png'/> &nbsp;" + widget.get('title'));
    	}catch(e){}
        try{
        	widget = registry.byId('managerPane');
            widget.set('title', "<img align='top' src='resources/images/manager-icon.png'/> &nbsp;" + widget.get('title'));
        }catch(e){}

        try{
        	widget = registry.byId('employeePane');
        	widget.set('title', "<img align='top' src='resources/images/admin.png'/> &nbsp;" + widget.get('title'));
        }catch(e){}
        
        try{
        	widget = registry.byId('laborPane');
        	widget.set('title', "<img align='top' src='resources/images/labor.png'/> &nbsp;" + widget.get('title'));
    	}catch(e){}
        
    	try{
        	widget = registry.byId('managePane');
        	widget.set('title', "<img align='top' src='resources/images/manage.png'/> &nbsp;" + widget.get('title'));
    	}catch(e){}
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

function addStoreHealthInspectionRecord(evt){
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	var storeLayout = require("controls/StoreLayoutController");
	storeLayout.addRowInGrid('storeHealthInspectionGrid');
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
			hideImportantDate();
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
	var domStyle = require('dojo/dom-style');
	var dom = require('dojo/dom');
	
	var role = authoritiesData.roles;
	var stores = authoritiesData.stores;
	
	if(role == 'ROLE_OWNER'){
		stores = 'store-1, store-2, store-3, store-4, store-5';
	}
	
	
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
			//Remove the Alarm Code and Keys Tabs
			registry.byId('storeInfoTitlePane').set('disabled', true);
			registry.byId('storeInfoTitlePane').toggle = function(){};
			registry.byId('storeInfoTitlePane')._onTitleKey = function(){};
			//Remove the Alarm Code Tab Starts here
			registry.byId('storeInfoTabContainer').removeChild(registry.byId('storeAlarms'));
			registry.byId('storeAlarms').destroy();
			//Remove the Alarm Code Tab Ends here
			
			//Remove the Keys Tab Starts here
			registry.byId('storeInfoTabContainer').removeChild(registry.byId('storeKeys'));
			registry.byId('storeKeys').destroy();
			//Remove the Keys Tab Ends here
			
			
			//Remove the Manage Tab Starts here
			registry.byId('tabContainer').removeChild(registry.byId('managePane'));
			registry.byId('managePane').destroy();
			//Remove the Manage Tab Ends here
			//Remove the View Schedule Column in Store Info --> Labor Summary Grid Start here
			registry.byId('storeLaborGrid').layout.setColumnVisibility(0,false);
			//Remove the View Schedule Column in Store Info --> Labor Summary Grid Ends here
			
			//Remove the Manager Tab in the Main Tab Container Starts here
			//Hide the Contract Documents DIV
			domStyle.set(dom.byId('managerContractDocumentsSection'), 'display', 'none');
			//Hide the Delete Column in Leaves Grid
			registry.byId('mgrLeavesGrid').layout.setColumnVisibility(0,false);
			//registry.byId('mgrLeavesGrid').layout.setColumnVisibility(1,false);
			registry.byId('mgrDetailsTabContainer').removeChild(registry.byId('addReviewTab'));
			//registry.byId('addReviewTab').destroy();
			//Remove the Manager Tab in the Main Tab Container Ends here
			
			//Remove the Update Column in Employees Grid, Salary Particulars Tab in the Employee Tabs, Labor Entry Tab
			//registry.byId('employeesGrid').layout.setColumnVisibility(0,false);
			
			registry.byId('employeeInfoTabContainer').removeChild(registry.byId('empSalaryDetails'));
			registry.byId('empSalaryDetails').destroy();
			
			
			//registry.byId('employeeInfoTabContainer').removeChild(registry.byId('empLaborDetails'));
			//registry.byId('empLaborDetails').destroy();
			//All of the above Ends here
			
			//Remove the Accounting Tab Starts here
			registry.byId('tabContainer').removeChild(registry.byId('accountingPane'));
			registry.byId('accountingPane').destroy();
			//Remove the Accounting Tab Ends here
			
			
			//Adjusting the Inventory Tab Starts here
			//registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(2,false);
			//registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(3,false);
			
			
			//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(5,false);
			//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(6,false);
			//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(7,false);
			//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(8,false);
			//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(9,false);
			//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(10,false);
			//Ends here
			
			//For removing the option to add new inventory item
			registry.byId('invoiceActionSelect').removeOption(2);
			checkSelectedPane('locationTabletr'+storeToSelect, 'rightAccordion', storeToSelect);
			break;
		case 'ROLE_EMP':
			break;
	}
	//Remove the Labor Entry Tab in Employees Section for Everyone
	registry.byId('employeeInfoTabContainer').removeChild(registry.byId('empLaborDetails'));
	registry.byId('empLaborDetails').destroy();
	//grid.layout.setColumnVisibility(columnIndex,booleanValue);
	//pane.set("disabled", true);
	
	/*For Removing a child of Tab Container*/
		//dijit.byId("myTabContainer").removeChild(dijit.byId("myContentPane"));
		//dijit.byId("myContentPane").destroy();
	/*For Removing a child of Tab Container*/
	console.log('End of Apply ROles method');
}

//Health Inspection Tab related methods
function addStoreInspectionRecord(evt){
	var dialogName = 'healthInspection';
	
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	
	var domStyle = require('dojo/dom-style');
	var dom = require('dojo/dom');
	var registry = require('dijit/registry');
	var domConstruct = require('dojo/dom-construct');
	switch(dialogName){
	case 'healthInspection':
		if(domStyle.getComputedStyle(dom.byId('healthInspectionWidgetsDiv')).display != 'none')
			hideFileUploadDialog('healthInspection');
		domConstruct.empty(dom.byId('healthInspectionUploaded'));
		domConstruct.empty(dom.byId('healthInspectionExisting'));
		
		healthInspectionDialog.reset();
		registry.byId('hiddenHealthId').set('value', 0);
		//healthInspectionDialog.titleBar.style.display = 'none';
		healthInspectionDialog.set('title', 'Health Inspection Details');
		healthInspectionDialog.show();
		domStyle.set(dom.byId('healthInspectionDialog'), {top:'40px', position: "absolute"});
		break;
	default:
		break;
	}
}

//Health Inspection Tab related methods
function editRecordByDialog(tab, id, rowIndex){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var domConstruct = require('dojo/dom-construct');
	var baseArray = require('dojo/_base/array');
	var stamp = require('dojo/date/stamp');
	var domStyle = require('dojo/dom-style');
	//console.log('Edit '+ tab + ' Id ' + id + ' rowIndex ', rowIndex);
	
	var grid; 
	switch(tab){
		case 'healthInspection':
			if(domStyle.getComputedStyle(dom.byId('healthInspectionWidgetsDiv')).display != 'none')
				hideFileUploadDialog('healthInspection');
			registry.byId('hiddenHealthId').set('value', id);
			domConstruct.empty(dom.byId('healthInspectionUploaded'));
			
			grid = registry.byId('storeHealthInspectionGrid');
			
			var date = (grid.store.getValue(grid.getItem(rowIndex), 'purposeDate')+'').split('/');
			date = '' + date[2] + '-' + date[0] + '-' + date[1];
			registry.byId('healthInspectionDate').set('value', stamp.fromISOString(date));
			
			if(grid.store.getValue(grid.getItem(rowIndex), 'blobKey') != '&#/#&'){
				var fragment = document.createDocumentFragment();
				domConstruct.create("li", {
		                innerHTML: '&nbsp;&nbsp;' + '<a target="_new" href="/service/getBlob/' + grid.store.getValue(grid.getItem(rowIndex), 'blobKey') + '">' 
									+  grid.store.getValue(grid.getItem(rowIndex), 'fileName') + '</a>'
		            }, fragment);
				domConstruct.empty(dom.byId('healthInspectionExisting'));
				domConstruct.place(fragment, dom.byId('healthInspectionExisting'));
			}
			
			registry.byId('healthInspectionNotes').set('value', grid.store.getValue(grid.getItem(rowIndex), 'purposeNotes'));
			healthInspectionDialog.set('title', 'Health Inspection Details');
			healthInspectionDialog.show();
		break;
	}
}

function addEmployeeDocumentsTabRecord(evt){
	var dialogName = 'employeeDocs';//employee-docs
	
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	
	var domStyle = require('dojo/dom-style');
	var dom = require('dojo/dom');
	var registry = require('dijit/registry');
	var domConstruct = require('dojo/dom-construct');
	switch(dialogName){
	case 'employeeDocs':
		if(domStyle.getComputedStyle(dom.byId('healthInspectionWidgetsDiv')).display != 'none')
			hideFileUploadDialog('healthInspection');
		domConstruct.empty(dom.byId('healthInspectionUploaded'));
		domConstruct.empty(dom.byId('healthInspectionExisting'));
		
		healthInspectionDialog.reset();
		registry.byId('hiddenHealthId').set('value', 0);
		//healthInspectionDialog.titleBar.style.display = 'none';
		healthInspectionDialog.set('title', 'Employee Documents');
		healthInspectionDialog.show();
		domStyle.set(dom.byId('healthInspectionDialog'), {top:'40px', position: "absolute"});
		break;
	default:
		break;
	}
}

function editEmployeeDocumentRecordByDialog(tab, id, rowIndex){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var domConstruct = require('dojo/dom-construct');
	var baseArray = require('dojo/_base/array');
	var stamp = require('dojo/date/stamp');
	var domStyle = require('dojo/dom-style');
	//console.log('Edit '+ tab + ' Id ' + id + ' rowIndex ', rowIndex);
	
	var grid; 
	switch(tab){
		case 'employee-docs':
			if(domStyle.getComputedStyle(dom.byId('healthInspectionWidgetsDiv')).display != 'none')
				hideFileUploadDialog('healthInspection');
			registry.byId('hiddenHealthId').set('value', id);
			domConstruct.empty(dom.byId('healthInspectionUploaded'));
			
			grid = registry.byId('empDocumentsGrid');
			
			var date = (grid.store.getValue(grid.getItem(rowIndex), 'purposeDate')+'').split('/');
			date = '' + date[2] + '-' + date[0] + '-' + date[1];
			registry.byId('healthInspectionDate').set('value', stamp.fromISOString(date));
			
			if(grid.store.getValue(grid.getItem(rowIndex), 'blobKey') != '&#/#&'){
				var fragment = document.createDocumentFragment();
				domConstruct.create("li", {
		                innerHTML: '&nbsp;&nbsp;' + '<a target="_new" href="/service/getBlob/' + grid.store.getValue(grid.getItem(rowIndex), 'blobKey') + '">' 
									+  grid.store.getValue(grid.getItem(rowIndex), 'fileName') + '</a>'
		            }, fragment);
				domConstruct.empty(dom.byId('healthInspectionExisting'));
				domConstruct.place(fragment, dom.byId('healthInspectionExisting'));
			}
			
			registry.byId('healthInspectionNotes').set('value', grid.store.getValue(grid.getItem(rowIndex), 'purposeNotes'));
			healthInspectionDialog.set('title', 'Employee Documents');
			healthInspectionDialog.show();
		break;
	}
}
function addTemplatesTabRecord(event){
	var dialogName = 'templateDocs';//employee-docs
	
	try{if (!evt) var evt = window.event;
	evt.preventDefault();
	evt.stopPropagation();}catch(e){console.log('Error is --> ' + e);}
	
	var domStyle = require('dojo/dom-style');
	var dom = require('dojo/dom');
	var registry = require('dijit/registry');
	var domConstruct = require('dojo/dom-construct');
	switch(dialogName){
		case 'templateDocs':
			if(domStyle.getComputedStyle(dom.byId('healthInspectionWidgetsDiv')).display != 'none')
				hideFileUploadDialog('healthInspection');
			domConstruct.empty(dom.byId('healthInspectionUploaded'));
			domConstruct.empty(dom.byId('healthInspectionExisting'));
			
			healthInspectionDialog.reset();
			registry.byId('hiddenHealthId').set('value', 0);
			//healthInspectionDialog.titleBar.style.display = 'none';
			healthInspectionDialog.set('title', 'Store Templates');
			healthInspectionDialog.show();
			domStyle.set(dom.byId('healthInspectionDialog'), {top:'40px', position: "absolute"});
			break;
		default:
			break;
	}
}

function editTemplatesTabRecord(tab, id, rowIndex){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var domConstruct = require('dojo/dom-construct');
	var baseArray = require('dojo/_base/array');
	var stamp = require('dojo/date/stamp');
	var domStyle = require('dojo/dom-style');
	//console.log('Edit '+ tab + ' Id ' + id + ' rowIndex ', rowIndex);
	
	var grid; 
	switch(tab){
		case 'templateDocs':
			if(domStyle.getComputedStyle(dom.byId('healthInspectionWidgetsDiv')).display != 'none')
				hideFileUploadDialog('healthInspection');
			registry.byId('hiddenHealthId').set('value', id);
			domConstruct.empty(dom.byId('healthInspectionUploaded'));
			
			grid = registry.byId('templatesGrid');
			
			var date = (grid.store.getValue(grid.getItem(rowIndex), 'purposeDate')+'').split('/');
			date = '' + date[2] + '-' + date[0] + '-' + date[1];
			registry.byId('healthInspectionDate').set('value', stamp.fromISOString(date));
			
			if(grid.store.getValue(grid.getItem(rowIndex), 'blobKey') != '&#/#&'){
				var fragment = document.createDocumentFragment();
				domConstruct.create("li", {
		                innerHTML: '&nbsp;&nbsp;' + '<a target="_new" href="/service/getBlob/' + grid.store.getValue(grid.getItem(rowIndex), 'blobKey') + '">' 
									+  grid.store.getValue(grid.getItem(rowIndex), 'fileName') + '</a>'
		            }, fragment);
				domConstruct.empty(dom.byId('healthInspectionExisting'));
				domConstruct.place(fragment, dom.byId('healthInspectionExisting'));
			}
			
			registry.byId('healthInspectionNotes').set('value', grid.store.getValue(grid.getItem(rowIndex), 'purposeNotes'));
			healthInspectionDialog.set('title', 'Store Templates');
			healthInspectionDialog.show();
		break;
	}
}

/*function createInventoryItem(){
	var registry = require('dijit/registry');
	var dom = require('dojo/dom');
	var domConstruct = require('dojo/dom-construct');
	var baseArray = require('dojo/_base/array');
	var domStyle = require('dojo/dom-style');
	var Memory = require('dojo/store/Memory');
	var ObjectStore = require('dojo/data/ObjectStore');
	
	var codesData = [];
	baseArray.forEach(dojo.clone(INVENTORY_DISTRIBUTORS), function(distributor){
		codesData.push({ color: distributor.color, id: distributor.id, name: '&nbsp;<span style="background-color: ' + distributor.color + '; color: #fff;">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' + distributor.name + '&nbsp;&nbsp;&nbsp;'});
	});
	var itemStockStore = new Memory({idProperty: 'id', data: codesData});
	var os = new ObjectStore({ objectStore: itemStockStore });
	dijit.byId('inventoryItemDistributor').setStore(os);
	addInventoryItemDialog.show();
	domStyle.set(dom.byId('addInventoryItemDialog'), {top:'40px', position: "absolute"});
}*/


function deleteItem(src, blobSrc, id){
	var registry = require('dijit/registry');
	var ajaxRequest = require("dojo/request");
	var json = require('dojo/json');
	var dom = require('dojo/dom');
	var storeLayout = require('controls/StoreLayoutController');
	var empLayout = require('controls/EmployeeLayoutController');
	var accLayout = require('controls/AccountingLayoutController');
	var invLayout = require('controls/InventoryLayoutController');
	//console.log('Deleting ', src, blobSrc, id);
	if(window.confirm("Confirm to Delete ?")){
		switch(src){
			case 'date':
				registry.byId('storeInfoImpDatesStandBy').show();
				ajaxRequest.get("/service/delete/date/" + id,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			storeLayout.refreshStoreDates(registry.byId('hiddenStoreId').get('value'));
		    		}
		    	}, function(error){
		    		registry.byId('storeInfoImpDatesStandBy').hide();
		    	});
				break;
			case 'blob':
				switch(blobSrc){
					case 'store-lease':
						registry.byId('storeInfoLeaseDocumentsStandBy').show();
						ajaxRequest.get("/service/delete/blob/" + id + '/store-lease',{
				    		handleAs: 'json'
				    	}).then(function(deleteResponse){
				    		if(deleteResponse.success){
				    			storeLayout.fetchStoreLeaseBlobs(registry.byId('hiddenStoreId').get('value'));
				    		}
				    	}, function(error){
				    		registry.byId('storeInfoLeaseDocumentsStandBy').hide();
				    	});
					break;
					case 'mgrContract':
						registry.byId('mgrContractStandBy').show();
						ajaxRequest.get("/service/delete/blob/" + id + '/mgrContract',{
				    		handleAs: 'json'
				    	}).then(function(deleteResponse){
				    		if(deleteResponse.success){
				    			empLayout.fetchManagerContractBlobs(registry.byId('mgrList').get('value'));
				    		}
				    	}, function(error){
				    		registry.byId('mgrContractStandBy').hide();
				    	});
					break;
					case 'accMonthlyDocument':
						registry.byId('accMonthlyDocumentStandBy').show();
						ajaxRequest.get("/service/delete/blob/" + id + '/accMonthlyDocument',{
				    		handleAs: 'json'
				    	}).then(function(deleteResponse){
				    		if(deleteResponse.success){
				    			accLayout.fetchAccountingMonthlyBlobs(registry.byId('hiddenAccountingRecordId').get('value'));
				    		}
				    	}, function(error){
				    		registry.byId('accMonthlyDocumentStandBy').hide();
				    	});
					break;
				}
				break;
			case 'store-tab':
				var selectedChildId = registry.byId('storeInfoTabContainer').selectedChildWidget.id;
				var standByNode = '', url = '';
				switch(selectedChildId){
					case 'storeAlarms':
						standByNode = 'storeAlarmCodesGridStandBy';
						url = "/service/delete/store/" + id + '/sa';
						break;
					case 'storeKeys':
						standByNode = 'storeKeysGridStandBy';
						url = "/service/delete/store/" + id + '/sk';
						break;
					case 'storeMaintenance':
						standByNode = 'storeMaintenanceGridStandBy';
						url = "/service/delete/store/" + id + '/sm';
						break;
				}
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			storeLayout.refreshPane();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'mgr-leaves':
				var standByNode = 'mgrLeavesGridStandBy', url = '/service/delete/employee/leaves/' + id;
				url = "/service/delete/employee/leaves/" + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			empLayout.fetchMgrLeavesData(registry.byId('mgrList').get('value'));
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'invoice-item':
				var standByNode = 'inventoryInvoiceDetailsGridStandBy', url = '/service/delete/invoice-details/' + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			invLayout.refreshSelectedInvoiceDetails();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'invoice':
				var standByNode = 'inventoryInvoicesGridStandBy', url = '/service/delete/invoice/' + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			invLayout.resetInvoiceDetails();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'stock-item':
				var standByNode = 'inventoryInvoiceDetailsGridStandBy', url = '/service/delete/stock-item/' + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			invLayout.reset();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'emp-salary':
				var standByNode = 'employeeSalaryDetailsGridStandBy', url = '/service/delete/employee/emp-salary/' + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			empLayout.populateEmployeeDetails();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'emp-discipline':
				var standByNode = 'employeeDisciplineGridStandBy', url = '/service/delete/employee/emp-discipline/' + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			empLayout.populateEmployeeDetails();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'emp-good':
				var standByNode = 'employeeDoingGoodGridStandBy', url = '/service/delete/employee/emp-good/' + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			empLayout.populateEmployeeDetails();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			case 'emp-missed':
				var standByNode = 'employeeLeavesGridStandBy', url = '/service/delete/employee/emp-missed/' + id;
				registry.byId(standByNode).show();
				ajaxRequest.get(url,{
		    		handleAs: 'json'
		    	}).then(function(deleteResponse){
		    		if(deleteResponse.success){
		    			empLayout.populateEmployeeDetails();
		    		}
		    	}, function(error){
		    		registry.byId(standByNode).hide();
		    	});
				break;
			default:
				break;
		
		}
	}
}

function callManageUsers(){
	console.log('callManageUsers() called !!!');
}
function printInvoiceDetails(divId, title){
	var dom = require('dojo/dom');
	var registry = require('dijit/registry');
	registry.byId(divId).layout.setColumnVisibility(0,false);
	var innerHTML = '<div style="display: block;" class="soria">' + dom.byId(divId).innerHTML + '</div>';
	registry.byId(divId).layout.setColumnVisibility(0,true);
	var html = '';
    html += '<html lang="en-us">';
    html += '<head>';
    html += '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/resources/dojo.css" />';
    html += '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css" />';
    
    html += '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/soria/soria.css">';
    html += '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/resources/soriaGrid.css" />';
    /*html += '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/resources/claroGrid.css" />';
    html += '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/enhanced/resources/claro/EnhancedGrid.css" />';
    html += '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/claro/Calendar.css" />';
    */
    html += '<link rel="stylesheet" type="text/css" href="resources/themes/bootstrap/theme/dbootstrap/dbootstrap.css"/>';
    html += '<link rel="stylesheet" type="text/css" href="resources/themes/bootstrap/theme/dbootstrap/dijit.css"/>';
    html += '<link rel="stylesheet" href="resources/styles/styles.css"/>'; 
    html += '<link rel="stylesheet" href="resources/styles/print.css"/>';
    html += '</head>';
    
    html += "<body class='dbootstrap' style='width: 100%; height: 100%;color: #000000; background: #ffffff; font-family: \"Times New Roman\", Times, serif; font-size: 12pt;'>";
    var strTitle = dom.byId(title).innerHTML + '';
    var titleToPrint = strTitle.substr(1, strTitle.length - 2);
    html += '<div style="display: block;" align="center"><h4>' + titleToPrint.toUpperCase() + ' INVOICE </h4></div>';
    html += '<br/><br/>';
    innerHTML += '<br/><br/>';
    innerHTML += '<div align="left" style="position: absolute; bottom: 20px; left: 10px;"><table style="width: 100%;" class="dateTable"><tr><th style="width: 25%;">Manager Signature</th><th style="width: 30%;" class="noBorder"></th><th style="width: 20%;">GS CHARGES</th><th style="width: 20%;">TOTAL CHARGES</th></tr>';
    innerHTML += '<tr><td style="width: 25%;"></td><td style="width: 30%;" class="noBorder"></td><td style="width: 20%;">&nbsp;&nbsp;$84.30</td><td style="width: 20%;">&nbsp;&nbsp;$843.00</td></tr>';
    innerHTML += '</table></div>';
    html += innerHTML;
	html += "</body>";
	html += "</html>";
	
	var w = window.open("about:blank");
	w.document.write(html);
	w.document.close();
	w.print(); 
}

function printInvoice(gridId, title){
	var registry = require('dijit/registry');
	var baseArray = require('dojo/_base/array');
	var dom = require('dojo/dom');
	var totalUnitsCost = 0, totalGsPercent=0, totalTotalCost=0;
	
	var dojoDateLocale = require('dojo/date/locale'); 
	var selectedInvoiceRows = registry.byId('inventoryInvoicesGrid').selection.getSelected();
	var selectedInvoiceRow = { 'date': dojoDateLocale.format(new Date(), { selector:"date", datePattern: 'MM/dd/yyyy' }) };
	if(selectedInvoiceRows.length > 0){
		try{selectedInvoiceRow['date'] = selectedInvoiceRows[0]['invoiceDate'][0];}catch(e){}
	}
	
	var selectedOption = registry.byId('invoiceCategorySelect').get('value');
	var storeName = '';
	switch(registry.byId('hiddenStoreId').get('value')){
		case '1':
			storeName='Downtown';
			break;
		case '2':
			storeName='West Valley';
			break;
		case '3':
			storeName='Murray';
			break;
		case '4':
			storeName='South Jordan';
			break;
		case '5':
			storeName='Airport';
			break;
	}
	
	var finalHTML = '';
	finalHTML += '<html lang="en-us">';
	finalHTML += '<head>';
	finalHTML += '<link rel="stylesheet" href="resources/styles/styles.css"/>';
	finalHTML += '</head>';
	finalHTML += "<body class='dbootstrap' style='width: 100%; height: 100%;color: #000000; background: #ffffff; font-family: \"Times New Roman\", Times, serif; font-size: 12pt;'>";
	var strTitle = dom.byId(title).innerHTML + '';
    var titleToPrint = strTitle.substr(1, strTitle.length - 2);
    finalHTML += '<div style="display: block"><div style="display: inline-block; text-decoration: underline;">Date: ' + selectedInvoiceRow['date'] +  '</div><div style="display: inline-block; height: 20px; padding-left: 27%;" align="center"><h4>' + titleToPrint.toUpperCase() + ' ' + ((selectedOption != 'Distributor') ? 'INVOICE' : ' INVENTORY') + ' ( ' + storeName.toUpperCase() + ' )</h4></div></div>';
    finalHTML += '<br/>';
    
	var table = '<table style="width: 100%; vertical-align: top;" class="printTable">';
	var bgColor = '';
	table += '<tr style="height: 10px;"><th style="width: 10px;">ITEM #</th><th>STOCK ITEM</th><th>PAR (UNITS)</th><th>IN STOCK</th><th>ORDER</th>' + ((selectedOption != 'Distributor') ? '<th>PRICE PER UNIT</th><th>GS CHARGE</th><th>TOTAL</th></tr>' : '</tr>');
	registry.byId(gridId).store.fetch({
		onComplete: function(items){
			baseArray.forEach(items, function(item, index){
				table += '<tr style="height: 10px;">';
				var gridStore = registry.byId('inventoryInvoiceDetailsGrid').store;
				bgColor = INVENTORY_ITEMS_INFO[gridStore.getValue(item, 'itemId')+'']['itemColor'];
				//INVENTORY_ITEMS_INFO[item['itemId'][0]]['itemColor']
				table += '<td style="text-align: center; width: 10px; color: #ffffff; background-color: ' + bgColor + '">' + INVENTORY_ITEMS_INFO[gridStore.getValue(item, 'itemId')+'']['itemCode'] + '</td>';
				table += '<td>' + INVENTORY_ITEMS_INFO[gridStore.getValue(item, 'itemId')+'']['itemName'] + '</td>';
				table += '<td>' + INVENTORY_ITEMS_INFO[gridStore.getValue(item, 'itemId')+'']['itemPar'] + ' ' + INVENTORY_ITEMS_INFO[gridStore.getValue(item, 'itemId')+'']['itemUnits']  + '</td>';
				table += '<td>' + gridStore.getValue(item, 'itemStock') + '</td>';
				table += '<td>' + gridStore.getValue(item, 'itemOrder') + '</td>';
				if(selectedOption != 'Distributor'){
					table += '<td> $' + gridStore.getValue(item, 'itemPricePerUnit') + '</td>';
					table += '<td>' + gridStore.getValue(item, 'itemGSPercent') + '%</td>';
					var unitsCost = parseFloat(parseFloat(gridStore.getValue(item, 'itemPricePerUnit')+'') * parseInt(gridStore.getValue(item, 'itemOrder')+''));
					var gsPercent = parseFloat((unitsCost * parseFloat(gridStore.getValue(item, 'itemGSPercent')+''))/100);
					//console.log('unitsCost --> ' + unitsCost + ' gsPercent--> ' + gsPercent + ' ppu--> ' + gridStore.getValue(item, 'itemPricePerUnit') + ' order--> ' + gridStore.getValue(item, 'itemOrder'));
					var totalCost = unitsCost + gsPercent;
					table += '<td> $' + parseFloat(totalCost).toFixed(2) + '</td>';
					totalUnitsCost += unitsCost;
					totalGsPercent += gsPercent;
					totalTotalCost += totalCost;
				}
				table += '</tr>';
			});
			table += '</table>';
			
			finalHTML += table;
			
			if(selectedOption != 'Distributor'){
				finalHTML += '<br/><br/>';
				finalHTML += '<div align="left" style="width: 95%; height: 10%; bottom: 10px; left: 10px;"><table style="width: 100%; height: 100%;" class="dateTable"><tr style="height: 10px;"><th style="width: 25%;">Manager Signature</th><th style="width: 30%;" class="noBorder"></th><th style="width: 20%;">GS CHARGES</th><th style="width: 20%;">TOTAL</th></tr>';
				finalHTML += '<tr><td style="width: 25%;"></td><td style="width: 30%;" class="noBorder"></td><td style="width: 20%;">&nbsp;&nbsp;$' + parseFloat(totalGsPercent).toFixed(2) + '</td><td style="width: 20%;">&nbsp;&nbsp;$' + parseFloat(totalTotalCost).toFixed(2) + '</td></tr>';
				finalHTML += '</table></div>';
			}
			finalHTML += "</body>";
			finalHTML += "</html>";
			
			var w = window.open("about:blank");
			w.document.write(finalHTML);
			w.document.close();
			w.print(); 
		}
	}); 
	
}

function printManagerReview(){
	var registry = require('dijit/registry');
	var baseArray = require('dojo/_base/array');
	var dom = require('dojo/dom');
	var finalHTML = '';
	finalHTML += '<html lang="en-us">';
	finalHTML += '<head>';
	finalHTML += '<link rel="stylesheet" href="resources/styles/styles.css"/>';
	finalHTML += '</head>';
	finalHTML += "<body class='dbootstrap' style='width: 100%; height: 100%;color: #000000; background: #ffffff; font-family: \"Times New Roman\", Times, serif; font-size: 12pt;'>";
	var employeeName = registry.byId('mgrList').store.fetch({query: {id: registry.byId('mgrList').get('value')}, onComplete: function(items, request){
		if(items.length > 0){
			finalHTML += '<div align="center"><span style="float: left; padding-left: 10px; padding-right: 10px; border 1px; background-color: #dd0000; color: #ffffff">' + registry.byId('hiddenSelectedYear').get('value') + '</span><span style="padding-left: 2px; padding-right: 2px; border 1px; font-weight: bold">' + items[0].label + '</span></div>';
			finalHTML += dom.byId('printManagerReviewDiv').innerHTML;
			finalHTML += dom.byId('mgrUnusedPersonalDaysDetailsDiv').innerHTML;
			var leavesGridId = 'mgrLeavesGrid';
			registry.byId(leavesGridId).store.fetch({
				onComplete: function(items){
					finalHTML += '<br/><div align="center"><h3>Personal / Sick Days</h3></div>';
					var leavesTable = '<table style="width: 100%;" class="printTable"><tr><th style="width: 30%;">Date</th><th style="width: 70%;">Notes</th>';
					baseArray.forEach(items, function(item, index){
						leavesTable += '<tr><td style="width: 30%; text-align: center !important;">' + item.date + '</td><td style="width: 70%; text-align: left !important; padding-left: 10px !important; ">' + item.reason + '</td></tr>';
					});
					leavesTable += '</table>';
					finalHTML += leavesTable;
					var w = window.open("about:blank");
					w.document.write(finalHTML);
					w.document.close();
					w.print(); 
				}
			});
			
		}
	}});
	
}

function refreshCalendarForSelectedWeek(){
	var laborLayout = require('controls/LaborLayoutController');
	var registry = require('dijit/registry');
	if(globalYearWeekForRefresh && (globalYearWeekForRefresh.length > 0))
		laborLayout.populateData(registry.byId('hiddenStoreId').get('value'), globalYearWeekForRefresh);
}

function printCalendar(){
	//Cook --> #F77878
	//Front --> #60C46E
	//Manager --> #0753EB
	var dom = require('dojo/dom');
	var registry = require('dijit/registry');
	var baseArray = require('dojo/_base/array');
	var dojoDate = require('dojo/date');
	var dojoDateLocale = require('dojo/date/locale');
	
	var allCalendarEntries = registry.byId('labor-calendar').store.query(function(object){return object.id > 0;});
	var mgrEntries = registry.byId('labor-calendar').store.query(function(object){return object.position == 'Manager';});
	var kaMgrEntries = registry.byId('labor-calendar').store.query(function(object){return object.position == 'KA-Manager';});
	var shiftLeadEntries = registry.byId('labor-calendar').store.query(function(object){return object.position == 'Shift Lead';});
	var frontEntries = registry.byId('labor-calendar').store.query(function(object){return object.position == 'Front';});
	var cookEntries = registry.byId('labor-calendar').store.query(function(object){return object.position == 'Cook';});
	
	var totalsMap = {total: 0, totalMgr: 0, totalKAMgr: 0, totalShiftLead: 0, totalCook: 0, totalFront: 0};
	var skeleton = '';
	baseArray.forEach(allCalendarEntries, function(item, index){
		skeleton = item.startDate + ' - ' + item.endDate;
		if(item.position == "Manager") totalsMap.totalMgr = totalsMap.totalMgr + item.totalTime;
		if(item.position == "KA-Manager") totalsMap.totalKAMgr = totalsMap.totalKAMgr + item.totalTime;
		if(item.position == "Shift Lead") totalsMap.totalShiftLead = totalsMap.totalShiftLead + item.totalTime;
		if(item.position == "Front") totalsMap.totalFront = totalsMap.totalFront + item.totalTime;
		if(item.position == "Cook") totalsMap.totalCook = totalsMap.totalCook + item.totalTime;
		totalsMap.total = totalsMap.total + item.totalTime;
	});
	
	var storeName = '';
	switch(registry.byId('hiddenStoreId').get('value')){
		case '1':
			storeName='Downtown';
			break;
		case '2':
			storeName='West Valley';
			break;
		case '3':
			storeName='Murray';
			break;
		case '4':
			storeName='South Jordan';
			break;
		case '5':
			storeName='Airport';
			break;
	}
	
	
	var laborInfoTableHTML = '<div style="display: block; width: 100%; overflow: visible;"><table class="laborTablePrint" valign="top" style="width: 100%;">' 
		+ '<tr><td class="laborDateTd" style="font-size: 90% !important;">' + skeleton + '</td>'
		+ '<td class="laborMgrTd" style="font-size: 80% !important;">Total Manager Hours : ' + totalsMap.totalMgr + '</td>'
		+ '<td class="laborMgrTd" style="font-size: 80% !important;">Total KA-Manager Hours : ' + totalsMap.totalKAMgr + '</td>'
		+ '<td class="laborShiftLeadTd" style="font-size: 80% !important;">Total Shift Lead Hours : ' + totalsMap.totalShiftLead + '</td>'
		+ '<td class="laborFrontTd" style="font-size: 80% !important;">Total Front Hours : ' + totalsMap.totalFront + '</td>'
		+ '<td class="laborCookTd" style="font-size: 80% !important;">Total Cook Hours : ' + totalsMap.totalCook + '</td>'
		+ '<td class="laborDateTd" style="font-size: 80% !important;">Total Hours (Not Included Manager): ' + (totalsMap.totalFront + totalsMap.totalCook) + '</td>'
		+ '</tr></table></div>';

	
	var htmlForCalendar = laborInfoTableHTML + '<div><table style="width: 100%;"><tr><td style="width:80%" valign="top">' + '<table class="laborTablePrint" style="width: 100%; border: .1em solid #000;">';
	var thForCalendar = '';
	var tbodyForCalendar = '';
	var cssClass = '';
	
	var maxEntriesForMgr = 0, maxEntriesForKAMgr = 0, maxEntriesForShiftLead = 0, maxEntriesForFront = 0, maxEntriesForCook = 0;
	var temp = [];
	baseArray.forEach(mgrEntries, function(item){
		temp = registry.byId('labor-calendar').store.query({'position': 'Manager', 'dd': item.dd});
		if(temp.length > maxEntriesForMgr) maxEntriesForMgr = temp.length;
	});
	baseArray.forEach(kaMgrEntries, function(item){
		temp = registry.byId('labor-calendar').store.query({'position': 'KA-Manager', 'dd': item.dd});
		if(temp.length > maxEntriesForKAMgr) maxEntriesForKAMgr = temp.length;
	});
	baseArray.forEach(shiftLeadEntries, function(item){
		temp = registry.byId('labor-calendar').store.query({'position': 'Shift Lead', 'dd': item.dd});
		if(temp.length > maxEntriesForShiftLead) maxEntriesForShiftLead = temp.length;
	});
	baseArray.forEach(frontEntries, function(item){
		temp = registry.byId('labor-calendar').store.query({'position': 'Front', 'dd': item.dd});
		if(temp.length > maxEntriesForFront) maxEntriesForFront = temp.length;
	});
	baseArray.forEach(cookEntries, function(item){
		temp = registry.byId('labor-calendar').store.query({'position': 'Cook', 'dd': item.dd});
		if(temp.length > maxEntriesForCook) maxEntriesForCook = temp.length;
	});
	//console.log('maxEntriesForMgr --> ' + maxEntriesForMgr + ' maxEntriesForFront--> ' + maxEntriesForFront + ' maxEntriesForCook--> ' + maxEntriesForCook);
	if(allCalendarEntries.length > 0){
		var item = allCalendarEntries[0];
		var startDateStr = item.startDate;
		var endDateStr = item.endDate;
		var startDateStrArray = startDateStr.split('/');
		var endDateStrArray = endDateStr.split('/');
		var startDate = new Date(startDateStrArray[2], parseInt(startDateStrArray[0])-1, startDateStrArray[1]);
		var endDate = new Date(endDateStrArray[2], parseInt(endDateStrArray[0])-1, endDateStrArray[1]);
		var daysDifference = dojoDate.difference(startDate, endDate, "day") + 1;
		var iterDate = startDate;
		thForCalendar += '<tr>';
		for(var i=1; i<=daysDifference; i++){
			thForCalendar += '<th>' + dojoDateLocale.format(iterDate, { selector:"date", datePattern: 'MMM dd (EEEE)' }) + '</th>';
			iterDate = dojoDate.add(startDate, 'day', i);
		}
		thForCalendar += '</tr>';
	}
	
	var anythingAdded = false;
	//Build the tbody section by iterating over the dates (For Manager)
	for(var j=0; j<maxEntriesForMgr; j++){
		anythingAdded = true;
		var item = allCalendarEntries[0];
		var startDateStr = item.startDate;
		var endDateStr = item.endDate;
		var startDateStrArray = startDateStr.split('/');
		var endDateStrArray = endDateStr.split('/');
		var startDate = new Date(startDateStrArray[2], parseInt(startDateStrArray[0])-1, startDateStrArray[1]);
		var endDate = new Date(endDateStrArray[2], parseInt(endDateStrArray[0])-1, endDateStrArray[1]);
		var daysDifference = dojoDate.difference(startDate, endDate, "day") + 1;
		var iterDate = startDate;
		tbodyForCalendar += '<tr>';
		for(var i=1; i<=daysDifference; i++){
			var storeItem = registry.byId('labor-calendar').store.query({'position': 'Manager', 'dd': iterDate.getDate()});
			if((storeItem.length > 0) && storeItem[j]){
				if(storeItem[j].position == 'Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'KA-Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'Shift Lead') cssClass = 'laborShiftLeadTd';
				else if(storeItem[j].position == 'Front') cssClass = 'laborFrontTd';
				else if(storeItem[j].position == 'Cook') cssClass = 'laborCookTd';
				tbodyForCalendar += '<td class="' + cssClass + '">' + storeItem[j].summary + '</td>';
			} else{
				tbodyForCalendar += '<td></td>';
			}
			iterDate = dojoDate.add(startDate, 'day', i);
		}
		tbodyForCalendar += '</tr>';
	}
	if(!anythingAdded) 
		tbodyForCalendar += '<tr><td colspan="7"></td></tr>';
	anythingAdded = false;
	
	//Build the tbody section by iterating over the dates (For KA-Manager)
	for(var j=0; j<maxEntriesForKAMgr; j++){
		anythingAdded = true;
		var item = allCalendarEntries[0];
		var startDateStr = item.startDate;
		var endDateStr = item.endDate;
		var startDateStrArray = startDateStr.split('/');
		var endDateStrArray = endDateStr.split('/');
		var startDate = new Date(startDateStrArray[2], parseInt(startDateStrArray[0])-1, startDateStrArray[1]);
		var endDate = new Date(endDateStrArray[2], parseInt(endDateStrArray[0])-1, endDateStrArray[1]);
		var daysDifference = dojoDate.difference(startDate, endDate, "day") + 1;
		var iterDate = startDate;
		tbodyForCalendar += '<tr>';
		for(var i=1; i<=daysDifference; i++){
			var storeItem = registry.byId('labor-calendar').store.query({'position': 'KA-Manager', 'dd': iterDate.getDate()});
			if((storeItem.length > 0) && storeItem[j]){
				if(storeItem[j].position == 'Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'KA-Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'Shift Lead') cssClass = 'laborShiftLeadTd';
				else if(storeItem[j].position == 'Front') cssClass = 'laborFrontTd';
				else if(storeItem[j].position == 'Cook') cssClass = 'laborCookTd';
				tbodyForCalendar += '<td class="' + cssClass + '">' + storeItem[j].summary + '</td>';
			} else{
				tbodyForCalendar += '<td></td>';
			}
			iterDate = dojoDate.add(startDate, 'day', i);
		}
		tbodyForCalendar += '</tr>';
	}
	if(!anythingAdded) 
		tbodyForCalendar += '<tr><td colspan="7"></td></tr>';
	anythingAdded = false;
	
	//Build the tbody section by iterating over the dates (For Shift Lead)
	for(var j=0; j<maxEntriesForShiftLead; j++){
		anythingAdded = true;
		var item = allCalendarEntries[0];
		var startDateStr = item.startDate;
		var endDateStr = item.endDate;
		var startDateStrArray = startDateStr.split('/');
		var endDateStrArray = endDateStr.split('/');
		var startDate = new Date(startDateStrArray[2], parseInt(startDateStrArray[0])-1, startDateStrArray[1]);
		var endDate = new Date(endDateStrArray[2], parseInt(endDateStrArray[0])-1, endDateStrArray[1]);
		var daysDifference = dojoDate.difference(startDate, endDate, "day") + 1;
		var iterDate = startDate;
		tbodyForCalendar += '<tr>';
		for(var i=1; i<=daysDifference; i++){
			var storeItem = registry.byId('labor-calendar').store.query({'position': 'Shift Lead', 'dd': iterDate.getDate()});
			if((storeItem.length > 0) && storeItem[j]){
				if(storeItem[j].position == 'Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'KA-Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'Shift Lead') cssClass = 'laborShiftLeadTd';
				else if(storeItem[j].position == 'Front') cssClass = 'laborFrontTd';
				else if(storeItem[j].position == 'Cook') cssClass = 'laborCookTd';
				tbodyForCalendar += '<td class="' + cssClass + '">' + storeItem[j].summary + '</td>';
			} else{
				tbodyForCalendar += '<td></td>';
			}
			iterDate = dojoDate.add(startDate, 'day', i);
		}
		tbodyForCalendar += '</tr>';
	}
	if(!anythingAdded) 
		tbodyForCalendar += '<tr><td colspan="7"></td></tr>';
	anythingAdded = false;
	
	
	//Build the tbody section by iterating over the dates (For Front)
	for(var j=0; j<maxEntriesForFront; j++){
		anythingAdded = true;
		var item = allCalendarEntries[0];
		var startDateStr = item.startDate;
		var endDateStr = item.endDate;
		var startDateStrArray = startDateStr.split('/');
		var endDateStrArray = endDateStr.split('/');
		var startDate = new Date(startDateStrArray[2], parseInt(startDateStrArray[0])-1, startDateStrArray[1]);
		var endDate = new Date(endDateStrArray[2], parseInt(endDateStrArray[0])-1, endDateStrArray[1]);
		var daysDifference = dojoDate.difference(startDate, endDate, "day") + 1;
		var iterDate = startDate;
		tbodyForCalendar += '<tr>';
		for(var i=1; i<=daysDifference; i++){
			var storeItem = registry.byId('labor-calendar').store.query({'position': 'Front', 'dd': iterDate.getDate()});
			if((storeItem.length > 0) && storeItem[j]){
				if(storeItem[j].position == 'Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'KA-Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'Shift Lead') cssClass = 'laborShiftLeadTd';
				else if(storeItem[j].position == 'Front') cssClass = 'laborFrontTd';
				else if(storeItem[j].position == 'Cook') cssClass = 'laborCookTd';
				tbodyForCalendar += '<td class="' + cssClass + '">' + storeItem[j].summary + '</td>';
			} else{
				tbodyForCalendar += '<td></td>';
			}
			iterDate = dojoDate.add(startDate, 'day', i);
		}
		tbodyForCalendar += '</tr>';
	}
	if(!anythingAdded) 
		tbodyForCalendar += '<tr><td colspan="7"></td></tr>';
	
	//Build the tbody section by iterating over the dates (For Cook)
	for(var j=0; j<maxEntriesForCook; j++){
		var item = allCalendarEntries[0];
		var startDateStr = item.startDate;
		var endDateStr = item.endDate;
		var startDateStrArray = startDateStr.split('/');
		var endDateStrArray = endDateStr.split('/');
		var startDate = new Date(startDateStrArray[2], parseInt(startDateStrArray[0])-1, startDateStrArray[1]);
		var endDate = new Date(endDateStrArray[2], parseInt(endDateStrArray[0])-1, endDateStrArray[1]);
		var daysDifference = dojoDate.difference(startDate, endDate, "day") + 1;
		var iterDate = startDate;
		tbodyForCalendar += '<tr>';
		for(var i=1; i<=daysDifference; i++){
			var storeItem = registry.byId('labor-calendar').store.query({'position': 'Cook', 'dd': iterDate.getDate()});
			if((storeItem.length > 0) && storeItem[j]){
				if(storeItem[j].position == 'Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'KA-Manager') cssClass = 'laborMgrTd';
				else if(storeItem[j].position == 'Shift Lead') cssClass = 'laborShiftLeadTd';
				else if(storeItem[j].position == 'Front') cssClass = 'laborFrontTd';
				else if(storeItem[j].position == 'Cook') cssClass = 'laborCookTd';
				tbodyForCalendar += '<td class="' + cssClass + '">' + storeItem[j].summary + '</td>';
			} else{
				tbodyForCalendar += '<td></td>';
			}
			iterDate = dojoDate.add(startDate, 'day', i);
		}
		tbodyForCalendar += '</tr>';
	}
	
	htmlForCalendar += thForCalendar;
	htmlForCalendar += tbodyForCalendar;
	htmlForCalendar += '</table></td><td style="width: 20%;" valign="top">' + dom.byId('laborPaneInfoContent').innerHTML + '</td></tr></table></div>';
	
	var html = '';
    html += '<html lang="en-us">';
    html += '<head>';
    html += '<link rel="stylesheet" href="resources/styles/styles.css"/>'; 
    html += '</head>';
    
    html += "<body style='width: 100%; height: 100%; color: #000000; background: #ffffff; font-family: \"Times New Roman\", Times, serif; font-size: 10pt;'>";
    html += '<div style="height: 5%; display: block;" align="center"><h2>' + storeName + '&nbsp;-&nbsp;Current Schedule' + '</h2></div>';
    html += '<div style="display: block;" align="center">' + htmlForCalendar + '</div>';
	html += "</body>";
	html += "</html>";
	
	var w = window.open("about:blank");
	w.document.write(html);
	w.document.close();
	w.print(); 
}

function clearPlusIcon(tabWidget){
	if(tabWidget.get('title').lastIndexOf(' &nbsp; <img ') > 0){
		tabWidget.set('title', tabWidget.get('title').substring(0, tabWidget.get('title').lastIndexOf(' &nbsp; <img ')));
	}
}

function toggleAirportSection(){
	var query = require("dojo/query");
    var domClass = require("dojo/dom-class");
    var registry = require("dijit/registry");
    var dijit = require("dijit/dijit");
    var storeLayout = require("controls/StoreLayoutController");
    var empLayout = require("controls/EmployeeLayoutController");
    var laborLayout = require("controls/LaborLayoutController");
    var accLayout = require("controls/AccountingLayoutController");
    var inventoryLayout = require("controls/InventoryLayoutController");
    var domStyle = require('dojo/dom-style');
    var otherFx = require('dojo/fx');
    var dom = require('dojo/dom');
    var baseArray = require("dojo/_base/array");
    var domConstruct = require('dojo/dom-construct');
    var ContentPane = require("dijit/layout/ContentPane");
    var NumberTextBox = require("dijit/form/NumberTextBox");
    var Standby = require("dojox/widget/Standby");
	if((registry.byId('hiddenStoreId').get('value') == 5) || (registry.byId('hiddenStoreId').get('value') == '5')){
		baseArray.forEach(registry.byId('storeInfoTabContainer').getChildren(), function(storeTab){
			if((storeTab.get('id') == 'storeMaintenance') || (storeTab.get('id') == 'storeHealthInspection') || (storeTab.get('id') == 'storeAlarms') || (storeTab.get('id') == 'storeKeys') || (storeTab.get('id') == 'storeLabor') )
				storeTab.set('disabled', true);
		});
		baseArray.forEach(registry.byId('tabContainer').getChildren(), function(storeTab){
			if((storeTab.get('id') == 'managerPane') || (storeTab.get('id') == 'employeePane') || (storeTab.get('id') == 'accountingPane') || (storeTab.get('id') == 'laborPane') || (storeTab.get('id') == 'inventoryPane') || (storeTab.get('id') == 'templatesPane'))
				storeTab.set('disabled', true);
			
		});
		
		
		
		dijit.byId('tabContainer').selectChild(dijit.byId('storeInfo'));
		var tabContainer = registry.byId('storeInfoTabContainer');
		var accountingPane = new ContentPane({ title:"Accounting", style: 'width: 99%; height: 99%', 'class': 'nihilo' });
		var gridNode = domConstruct.create("div", { id: "airportAccountingGrid", style: {width: '99%', height: '99%'}});
		
		//Create the Table and populate for the Airport section
		var tableNode = domConstruct.create('table', {style: {width: '100%', height: '100%'}});
		var trNode = domConstruct.create('tr', {style: {width: '100%', height: '100%'}});
		var tdNode1 = domConstruct.create('td', {style: {width: '70%', height: '100%'}, valign: 'top'});
		var tdNode2 = domConstruct.create('td', {style: {width: '15%', height: '100%', 'text-align': 'center'}, valign: 'top'});
		var tdNode3 = domConstruct.create('td', {style: {width: '15%', height: '100%', 'text-align': 'center'}, valign: 'top'});
		tdNode1.appendChild(gridNode);
		trNode.appendChild(tdNode1);
		
		totalYearlySales = new NumberTextBox({ name: "totalYearlySales"});
		totalRoyalties = new NumberTextBox({ name: "totalRoyalties"});
		//Table for Yearly Sales starts here
		var innerTable1 = domConstruct.create('table', {'class': 'dateTable', style: {width: '80%'}});
		var innerTableTr1 = domConstruct.create('tr');
		var innerTableTr2 = domConstruct.create('tr');
		var innerTableTh1 = domConstruct.create('th', {innerHTML: 'Yearly Sales'});
		var innerTableTd1 = domConstruct.create('td');
		innerTableTd1.appendChild(totalYearlySales.domNode);
		innerTableTr1.appendChild(innerTableTh1);
		innerTableTr2.appendChild(innerTableTd1);
		innerTable1.appendChild(innerTableTr1);
		innerTable1.appendChild(innerTableTr2);
		tdNode2.appendChild(innerTable1);
		
		
		//Table for Yearly Royalties Starts here
		var innerTable2 = domConstruct.create('table', {'class': 'dateTable', style: {width: '80%'}});
		var innerTableTr1 = domConstruct.create('tr');
		var innerTableTr2 = domConstruct.create('tr');
		var innerTableTh2 = domConstruct.create('th', {innerHTML: 'Yearly Royalties'});
		var innerTableTd2 = domConstruct.create('td');
		
		innerTableTd2.appendChild(totalRoyalties.domNode);
		innerTableTr1.appendChild(innerTableTh2);
		innerTableTr2.appendChild(innerTableTd2);
		innerTable2.appendChild(innerTableTr1);
		innerTable2.appendChild(innerTableTr2);
		
		tdNode2.appendChild(innerTable2);
		trNode.appendChild(tdNode2);
		
		
		//Populate the End Of Year TD
		var eoyDiv = domConstruct.create('div', {innerHTML: '<font style="text-align: center; font-weight: bold;"><u>End of Year</u></font> <div align="center" style="padding-top: 5px;">'
					+ '<table id="airportSectionYearlyTable" style="width: 50%; text-align: center;" class="storeInfoTable" align="center"><tr><td>No Data Available !!!</td></tr></table></div>'});
		tdNode3.appendChild(eoyDiv);
		trNode.appendChild(tdNode3);
		tableNode.appendChild(trNode);
		accountingPane.domNode.appendChild(tableNode);
		tabContainer.addChild(accountingPane, 0);
		tabContainer.selectChild(accountingPane);
		
		if(registry.byId(gridNode.id + 'StandBy')){
			registry.byId(gridNode.id + 'StandBy').destroy();
		}
		var standby = new Standby({id: gridNode.id + 'StandBy',target: accountingPane.id, color:'white'});
		accountingPane.domNode.appendChild(standby.domNode);
		standby.startup();
		storeLayout.initAirportSection(gridNode.id, []);
		
	} else {
		baseArray.forEach(registry.byId('storeInfoTabContainer').getChildren(), function(storeTab){
			if((storeTab.get('id') == 'storeMaintenance') || (storeTab.get('id') == 'storeHealthInspection') || (storeTab.get('id') == 'storeAlarms') || (storeTab.get('id') == 'storeKeys') || (storeTab.get('id') == 'storeLabor') )
				storeTab.set('disabled', false);
			if(storeTab.get('title') == 'Accounting'){
				registry.byId('storeInfoTabContainer').removeChild(storeTab);
				storeTab.destroy();
			}
		});
		baseArray.forEach(registry.byId('tabContainer').getChildren(), function(storeTab){
			if((storeTab.get('id') == 'managerPane') || (storeTab.get('id') == 'employeePane') || (storeTab.get('id') == 'accountingPane') || (storeTab.get('id') == 'laborPane') || (storeTab.get('id') == 'inventoryPane') || (storeTab.get('id') == 'templatesPane'))
				storeTab.set('disabled', false);
		});
	}
}


function showAirportSection(){
	airportSectionDialog.show();
	airportSectionDialog.containerNode.style.width = '99%';
	airportSectionDialog.containerNode.style.height = '90%';
	airportSectionDialog.containerNode.align = 'center';
	//console.log('Container Node ', airportSectionDialog.containerNode);
}
