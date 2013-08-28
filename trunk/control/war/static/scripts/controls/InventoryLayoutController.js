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
 				itemFileWriteStore, gridDijit, TimeTextBox, ValidationTextBox, CurrencyTextBox, Observable, Tooltip, popup){

	var INVENTORY_DISTRIBUTORS = [
	                              {id: '1', name: 'NICHOLAS', color: '#0040FF', items: [{code: '101', name: 'PITA BREAD', par: '10', units: {singular: 'Box', plural: 'Boxes'}},
	                                                                  {code: '102', name: 'YEERO CONE', par: '10', units: {singular: 'Cone', plural: 'Cones'}},
	                                                                  {code: '103', name: 'BREADED ZUCCHINI', par: '4', units: {singular: 'Bag', plural: 'Bags'}},
	                                                                  {code: '104', name: 'BREADED MUSHROOM', par: '4', units: {singular: 'Bag', plural: 'Bags'}}]},
	                              {id: '2', name: 'US FOODS', color: '#FF00FF', items: [{code: '201', name: 'WHITE SAUCE', par: '3', units: {singular: 'Pan', plural: 'Pans'}},
	                                                                  {code: '202', name: 'RED SAUCE', par: '3', units: {singular: 'Pan', plural: 'Pans'}},
	                                                                  {code: '203', name: 'CHICKEN SOULVAKI', par: '4', units: {singular: 'Tray', plural: 'Trays'}}]},
	                              {id: '3', name: 'SAMS CLUB', color: '#FF0040', items: [{code: '301', name: 'LOUKOUMADE SYRUP', par: '1', units: {singular: 'Bottle', plural: 'Bottles'}},
	                                                                   {code: '302', name: 'LOUKOUMADE SPICE', par: '1', units: {singular: 'Bottle', plural: 'Bottles'}}]},
	                              {id: '4', name: 'GS KITCHEN', color: '#2EFE2E', items: [{code: '401', name: 'WINDEX', par: '2', units: {singular: 'Unit', plural: 'Units'}},
	                                                                    {code: '402', name: 'HAND ROLLS', par: '2', units: {singular: 'Unit', plural: 'Units'}},
	                                                                    {code: '403', name: 'BREADED ZUCCHINI', par: '4', units: {singular: 'Bag', plural: 'Bags'}},
	                                                                    {code: '404', name: 'BREADED MUSHROOM', par: '4', units: {singular: 'Bag', plural: 'Bags'}}]}
							],
	inventoryDetailsGrid=null, inventoryInvoicesGrid=null,

	initInventory = function(){
		updateInventoryDetailsGrid([]);
		updateInventoryInvoicesGrid([]);
	},
	
	fetchInvoiceGridData = function(storeId){
		registry.byId('inventoryInvoiceDetailsGridStandBy').show();
		ajaxRequest.get("/service/store/" + storeId + "/stock",{
			handleAs: 'json'
		}).then(function(stockResponse){
			if(stockResponse.success){
				updateInventoryDetailsGrid(stockResponse.models);
				registry.byId('inventoryInvoiceDetailsGridStandBy').hide();
			}
		}, function(error){
			console.error('Error occurred while fetching Stock data ' + error);
			registry.byId('inventoryInvoiceDetailsGridStandBy').hide();
		});
	},
	updateInventoryDetailsGrid = function(inventoryData){
		var tempStore = {
				"identifier" : "id",
				"items" : []
		};
		tempStore.items = inventoryData;
		var gridDataStore = new itemFileWriteStore({data: tempStore});
		if(!dijit.byId('inventoryInvoiceDetailsGrid')){
			inventoryDetailsGrid = new EnhancedGrid({
									store: gridDataStore,
									query: { id: "*" },
									structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
									            cells: [{ name: "Edit", field: "id", width: "7%", noresize: true},
												{ name: "Item", field: "itemId", width: "13%", noresize: true},
									            { name: "Par (Units)", field: "itemCategory", width: "12%", noresize: true},
												{ name: "In Stock", field: "itemStock", width: "12%", noresize: true},
												{ name: "Order", field: "itemOrder", width: "8%", noresize: true},
												{ name: "Price per Unit", field: "itemPricePerUnit", width: "17%", noresize: true},
												{ name: "GS Charge (10%)", field: "itemGSPercent", width: "19%", noresize: true},
												{ name: "Total", field: "itemGSPercent", width: "9%", noresize: true}
												]}],
									singleClickEdit: false,
									editable: false,
									selectable: true,
									rowsPerPage: 10,
									loadingMessage: 'loadingMessage: Loading data from server..',
									errorMessage: 'Oops we could not retrive the requested data!',
									noDataMessage: "<span class=\"dojoxGridNoData\"><font color='grey'>Inventory Details not available. Please Add !!!</font></span>",
									onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									selectionMode: "single"
									}, "inventoryInvoiceDetailsGrid");
			inventoryDetailsGrid.startup();
		} else dijit.byId('inventoryInvoiceDetailsGrid').setStore(gridDataStore);
	},
	
	updateInventoryInvoicesGrid = function(invoiceData){
		var tempStore = {
				"identifier" : "id",
				"items" : []
		};
		tempStore.items = invoiceData;
		var gridDataStore = new itemFileWriteStore({data: tempStore});
		if(!dijit.byId('inventoryInvoicesGrid')){
			inventoryInvoicesGrid = new EnhancedGrid({
									store: gridDataStore,
									query: { id: "*" },
									structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
									            cells: [{ name: "Date", field: "itemId", width: "25%", noresize: true},
									            { name: "GS Invoice", field: "itemCategory", width: "25%", noresize: true},
												{ name: "GS Charges", field: "itemStock", width: "25%", noresize: true},
												{ name: "Total Charges", field: "itemOrder", width: "25%", noresize: true}
												]}],
									singleClickEdit: false,
									editable: false,
									selectable: true,
									rowsPerPage: 10,
									loadingMessage: 'loadingMessage: Loading data from server..',
									errorMessage: 'Oops we could not retrive the requested data!',
									noDataMessage: "<span class=\"dojoxGridNoData\"><font color='grey'>Invoice Details not available.</font></span>",
									onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									selectionMode: "single"
									}, "inventoryInvoicesGrid");
			inventoryInvoicesGrid.startup();
		} else dijit.byId('inventoryInvoicesGrid').setStore(gridDataStore);
	},
	
	showDialogToAddItem=function(){
		var codesData = [];
		baseArray.forEach(dojo.clone(INVENTORY_DISTRIBUTORS), function(distributor){
			baseArray.forEach(distributor.items, function(item){
				codesData.push(lang.mixin(item, {category: distributor.id, code: item.code, name: '&nbsp;<span style="background-color: ' + distributor.color + '; color: #fff;">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' + item.name + '&nbsp;&nbsp;&nbsp;'}));
			});
		});
		var itemStockStore = new Memory({idProperty: 'code', data: codesData});
		var os = new ObjectStore({ objectStore: itemStockStore });
		dijit.byId('inventoryStockItem').setStore(os);
		dijit.byId('inventoryStockItem').startup();
		registry.byId('inventoryItemDialogForm').reset();
		inventoryItemDialog.show();
	};
	
	return{
			init: function(){
				initInventory();
			},
			reset: function(){
				fetchInvoiceGridData(registry.byId('hiddenStoreId').get('value'));
			},
			showAddItemDialog: function(){
				showDialogToAddItem();
			},
			addItemToDB: function(){
				//console.log('Form submitting --> ', domForm.toObject('inventoryItemDialogForm'));
				registry.byId('inventoryItemDialogFormStandBy').show();
				var jsonRowObject = {};
				var formData = domForm.toObject('inventoryItemDialogForm');
				jsonRowObject['storeId'] = registry.byId('hiddenStoreId').get('value');
				jsonRowObject['itemId'] = formData['inventoryStockItem'];
				jsonRowObject['itemCategory'] = formData['inventoryStockParCategory'];
				jsonRowObject['itemStock'] = formData['inventoryStockInStock'];
				jsonRowObject['itemOrder'] = formData['inventoryStockToOrder'];
				jsonRowObject['itemPricePerUnit'] = formData['inventoryStockPPU'];
				jsonRowObject['itemGSPercent'] = formData['inventoryStockGSCharge'];
				var standByWidget = '';
				ajaxRequest.post('/service/store/'+ registry.byId('hiddenStoreId').get('value') +'/stock', {
		    		headers: { "Content-Type":"application/json"}, 
		    		handleAs: 'json', data: json.stringify(jsonRowObject), timeout: 10000
		    			}).then(function(stockUpdateResponse){
		    				if(stockUpdateResponse.success){
		    					fetchInvoiceGridData(registry.byId('hiddenStoreId').get('value'));
		    					inventoryItemDialog.hide();
		    				}
		    				registry.byId('inventoryItemDialogFormStandBy').hide();
		    		}, function(error){
		    			registry.byId('inventoryItemDialogFormStandBy').hide();
		    			dom.byId('inventoryItemDialogFormErrorMsgs').innerHTML = '<font color="red">Error while Adding --> ' + error + '</font>';
		    		});
			}
	};
});