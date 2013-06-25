define(["dojo/_base/array", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/query", "dojo/on",
        "dijit/registry", "controls/StoreLayoutController", "controls/EmployeeLayoutController"], 
		function(array, domClass, domStyle, domAttr, query, on, registry, storeLayout, empLayout){
			var styleClasses = ["success", "warning", "info"],
			
			checkSelectedPane = function(trId, rightPane, storeId){
				environment.selectedLocation = storeId;
				query("#locationTable tr").forEach(function (node) {
		            domClass.remove(node.id, 'active');
		            domClass.replace(trId, 'hoveredClass', 'hoveredClass');
		        });
		        domClass.add(trId, 'active');

		        var child = registry.byId('tabContainer').selectedChildWidget;
		        switch (child.get('id')) {
		            case 'storeInfo':
		                storeLayout.populateStoreData(storeId);
		                break;
		            case 'employeePane':
		                empLayout.populateEmployeesData(storeId);
		                break;
		        }
			},
			modifyContentPaneTitles = function(){
				console.log('Setting Title Node ');
		        var widget = registry.byId('storeInfo');
		        widget.set('title', "<img align='top' src='resources/images/store.png'/> &nbsp;" + widget.get('title'));
		        widget = registry.byId('manage');
		        widget.set('title', "<img align='top' src='resources/images/manage.png'/> &nbsp;" + widget.get('title'));
		        widget = registry.byId('employeePane');
		        widget.set('title', "<img align='top' src='resources/images/admin.png'/> &nbsp;" + widget.get('title'));
		        widget = registry.byId('laborPane');
		        widget.set('title', "<img align='top' src='resources/images/labor.png'/> &nbsp;" + widget.get('title'));
			},
			modifyStoreTabGridTitles = function(){
				var widget = registry.byId('storeAlarms');
		        widget.set('title', widget.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addStoreAlarmTabRecord();'/>");

		        widget = registry.byId('storeKeys');
		        widget.set('title', widget.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addStoreKeyTabRecord();'/>");

		        widget = registry.byId('storeMaintenance');
		        widget.set('title', widget.get('title') + " &nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addStoreMaintenanceTabRecord();'/>");

			},
			addStoreAlarmTabRecord = function(){
				storeLayout.addRowInGrid('storeAlarmCodesGrid');
			},
			addStoreKeyTabRecord = function(){
				storeLayout.addRowInGrid('storeKeysGrid');
			},
			addStoreMaintenanceTabRecord = function(){
				storeLayout.addRowInGrid('storeMaintenanceGrid');
			},
			styleTabContainer = function(){
				 var tabContainer = registry.byId("tabContainer");
			     dojo.addClass(tabContainer.tablist.pane2button["storeInfo"].domNode, "customTabClass");
			},
			modifyWidgetTitle = function(nodeId){
				var widget = registry.byId(nodeId);
		        widget.set('title', widget.get('title') + "<a href='javascript: addImportantDate()'> Add Date</a>");
			},
			modifyStoreDateLabel = function(nodeId){
				var qry = "label[for='" + nodeId + "']";
		        query(qry).forEach(function (node) {
		            node.innerHTML = node.innerHTML + '<font style="font-weight: normal; margin-left: 10px;"><a href="javascript: addImportantDate();">add Date</a></font>'
		        });
			},
			updateGridRowToDB = function(id, gridId){
				storeLayout.updateGridRow(true, id, gridId);
			},
			addGridRowToDB = function(id, gridId){
				storeLayout.updateGridRow(false, id, gridId);
			},
			connectEventsToLocationTable = function(){
				on(locationTable, "tr:select", function (evt) {
		            // console.log("Clicked on node ", evt.target,
		            // " in table row ", this);
		            //dojo.addClass(this, active);
		        });
			},
			displayMessage = function(trId, msgSpan, msg, styleClassToApply) {
				 domStyle.set(trId, {
			            display: ""
			        });
			        domAttr.set(msgSpan, "innerHTML", msg);
			        array.forEach(styleClasses, function (entry, i) {
			            domClass.remove(msgSpan, entry);
			        });
			        domClass.add(msgSpan, styleClassToApply);
				
		    };
	
		 return {
		        init: function() {
		            console.log('Utils Controller Initialized ()');
		        }
		    };
	}