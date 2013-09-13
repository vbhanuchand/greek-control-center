define([ "dojo/_base/declare", "dijit/dijit", "dojo/dom-form", "dijit/registry", "dojo/dom", "dojo/dom-style", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/string", "dojo/on", 
         "dojo/keys", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/json", "dojo/_base/config", "dojo/fx", "dojo/io-query", "dojo/_base/window", "dojo/aspect",
 		"dojo/date/locale",  "dojo/_base/fx", "dojox/layout/TableContainer", "dijit/form/TextBox", "dijit/layout/ContentPane", "dijit/form/SimpleTextarea", "dijit/form/Textarea",
 		"dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/Calendar", "dijit/TitlePane", "dijit/form/FilteringSelect",	"dijit/form/Form", 
 		"dijit/Dialog", "dijit/form/DropDownButton", "dijit/form/Button", "dijit/form/DateTextBox", "dojox/grid/DataGrid", "dojox/grid/EnhancedGrid", "dojo/store/Memory", 
 		"dojo/query", "dojo/_base/declare", "dojo/has", "dojo/data/ObjectStore", "dojo/request", "dojox/form/Manager", "dojox/math/random/Simple", "dojox/lang/functional",
 		"dojo/data/ItemFileWriteStore", "dojox/grid/cells/dijit", "dijit/form/TimeTextBox", "dijit/form/ValidationTextBox",	"dijit/form/CurrencyTextBox", "dojo/store/Observable",  
 		"dijit/TooltipDialog", "dijit/popup", "dojo/number", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/IndirectSelection"],
 		function(declare, dijit, domForm, registry, dom, domStyle, domClass, domConstruct, domGeometry, string, on, 
 				keys, lang, baseArray, event, json, djConfig, otherFx, ioQuery, win, aspect, 
 				locale, baseFx, Table, TextBox, ContentPane, SimpleTextArea, TextArea, 
 				BorderContainer, TabContainer, Calendar, TitlePane, FilteringSelect, Form, 
 				Dialog, DropDownButton, Button, DateTextBox, DataGrid, EnhancedGrid, Memory, 
 				query, declare, has, ObjectStore, ajaxRequest, dojoxFormManager, randomNumber, functional,
 				itemFileWriteStore, gridDijit, TimeTextBox, ValidationTextBox, CurrencyTextBox, Observable, Tooltip, popup, DNumber){

	/*var INVENTORY_DISTRIBUTORS = [
	                              {id: '1', name: 'NICHOLAS', color: '#2E2EFE', items: [{code: '101', name: 'PITA BREAD', par: 10, units: {singular: 'Box', plural: 'Boxes'}},
	                                                                  {code: '102', name: 'YEERO CONE', par: 10, units: {singular: 'Cone', plural: 'Cones'}},
	                                                                  {code: '103', name: 'BREADED ZUCCHINI', par: 4, units: {singular: 'Bag', plural: 'Bags'}},
	                                                                  {code: '104', name: 'BREADED MUSHROOM', par: 4, units: {singular: 'Bag', plural: 'Bags'}}]},
	                              {id: '2', name: 'US FOODS', color: '#8904B1', items: [{code: '201', name: 'WHITE SAUCE', par: 3, units: {singular: 'Pan', plural: 'Pans'}},
	                                                                  {code: '202', name: 'RED SAUCE', par: 3, units: {singular: 'Pan', plural: 'Pans'}},
	                                                                  {code: '203', name: 'CHICKEN SOULVAKI', par: 4, units: {singular: 'Tray', plural: 'Trays'}}]},
	                              {id: '3', name: 'SAMS CLUB', color: '#B40431', items: [{code: '301', name: 'LOUKOUMADE SYRUP', par: 1, units: {singular: 'Bottle', plural: 'Bottles'}},
	                                                                   {code: '302', name: 'LOUKOUMADE SPICE', par: 1, units: {singular: 'Bottle', plural: 'Bottles'}}]},
	                              {id: '4', name: 'GS KITCHEN', color: '#21610B', items: [{code: '401', name: 'WINDEX', par: 2, units: {singular: 'Unit', plural: 'Units'}},
	                                                                    {code: '402', name: 'HAND ROLLS', par: 2, units: {singular: 'Unit', plural: 'Units'}},
	                                                                    {code: '403', name: 'BREADED ZUCCHINI', par: 4, units: {singular: 'Bag', plural: 'Bags'}},
	                                                                    {code: '404', name: 'BREADED MUSHROOM', par: 4, units: {singular: 'Bag', plural: 'Bags'}}]}
							],*/
	var inventoryDetailsGrid=null, invoiceItemsGrid=null, inventoryInvoicesGrid=null, isInvoiceDetail = false,
	refreshInvoiceDetails = function(){
		registry.byId('inventoryInvoiceDetailsGrid').selection.clear();
		dom.byId('createInvoiceLink').style.display = 'none';
		var selectedRow = registry.byId('inventoryInvoicesGrid').selection.getSelected()[0];
		dom.byId('inventoryTabTitle').innerHTML = 'Invoice Details';
		fetchInvoiceDetails(selectedRow['id'][0]);
	},
	initInventory = function(){
		updateInventoryDetailsGrid([]);
		updateInventoryInvoicesGrid([]);
		//updateInvoiceItemsGrid([]);
		registry.byId('inventoryInvoicesGrid').selection.clear();
		registry.byId('inventoryInvoiceDetailsGrid').selection.clear();
		dojo.connect(registry.byId('inventoryInvoicesGrid').selection, 'onSelected', function(rowIndex){
			refreshInvoiceDetails();
			//dijit.byId('grid').rowSelectCell.setDisabled(rowIndex, true|false);
		});
		var grid = registry.byId('inventoryInvoiceDetailsGrid');
		dojo.connect(grid, 'onStyleRow', function(row){
			var item = grid.getItem(row.index);
			var nd = dojo.query('td[idx="0"]', row.node)[0];
			if(nd && item){
				nd.style.backgroundColor = INVENTORY_ITEMS[item['itemId'][0]]['color'];
			}
		});
		fetchStoreDistributorsAndItems(registry.byId('hiddenStoreId').get('value'));
	},
	
	fetchStoreDistributorsAndItems = function(storeId){
		INVENTORY_DISTRIBUTORS = [];
		INVENTORY_DISTRIBUTORS_MAP = {};
		INVENTORY_ITEMS = {};
		ajaxRequest.get("/service/store/" + storeId + "/distributors",{
			handleAs: 'json'
		}).then(function(response){
			if(response.success){
				baseArray.forEach(response.models, function(item, index){
					if(item.itemType == 'stock-item'){
						INVENTORY_ITEMS[item.itemCode] = {'code': item.itemCode,'categoryId': parseInt(item.itemCode/100)*100, 
								'color': '#' + item.itemColor, 'name': item.itemName, 'par': item.itemPar, 'units': item.itemUnits};
						var distributorCode = parseInt(item.itemCode/100) * 100;
						if(!INVENTORY_DISTRIBUTORS_MAP[distributorCode])
							INVENTORY_DISTRIBUTORS_MAP[distributorCode] = new Array();
						
						INVENTORY_DISTRIBUTORS_MAP[distributorCode].push(INVENTORY_ITEMS[item.itemCode]);
					}
				});
				
				baseArray.forEach(response.models, function(item, index){
					if(item.itemType == 'distributor'){
						INVENTORY_DISTRIBUTORS.push({id: item.itemCode, name: item.itemName, color: '#' + item.itemColor, items: INVENTORY_DISTRIBUTORS_MAP[item.itemCode]});
					}
				});
			}
		}, function(error){
			console.log('Error occurred while fetching Inventory Details data ' + error);
		});
	},
	
	fetchInvoiceGridData = function(storeId){
		registry.byId('inventoryInvoicesGridStandBy').show();
		ajaxRequest.get("/service/store/" + storeId + "/invoice",{
			handleAs: 'json'
		}).then(function(invoiceResponse){
			if(invoiceResponse.success){
				updateInventoryInvoicesGrid(invoiceResponse.models);
				registry.byId('inventoryInvoicesGridStandBy').hide();
			}
		}, function(error){
			console.log('Error occurred while fetching Invoice data ' + error);
			registry.byId('inventoryInvoicesGridStandBy').hide();
		});
	},
	
	fetchStockGridData = function(storeId){
		registry.byId('inventoryInvoiceDetailsGridStandBy').show();
		ajaxRequest.get("/service/store/" + storeId + "/stock",{
			handleAs: 'json'
		}).then(function(stockResponse){
			if(stockResponse.success){
				isInvoiceDetail = false;
				updateInventoryDetailsGrid(stockResponse.models);
				registry.byId('inventoryInvoiceDetailsGridStandBy').hide();
			}
		}, function(error){
			console.log('Error occurred while fetching Stock data ' + error);
			registry.byId('inventoryInvoiceDetailsGridStandBy').hide();
		});
	},
	
	fetchInvoiceDetails = function(invoiceId){
		registry.byId('inventoryInvoiceDetailsGridStandBy').show();
		ajaxRequest.get("/service/store/invoice/" + invoiceId, {
			handleAs: 'json'
		}).then(function(invoiceResponse){
			if(invoiceResponse.success){
				isInvoiceDetail = true;
				updateInventoryDetailsGrid(invoiceResponse.models);
				registry.byId('inventoryInvoiceDetailsGridStandBy').hide();
			}
		}, function(error){
			console.log('Error occurred while fetching Invoice Details data ' + error);
			registry.byId('inventoryInvoiceDetailsGridStandBy').hide();
		});
	},
	/*fetchInvoiceItemsGridData = function(storeId){
		registry.byId('invoiceItemsGridStandBy').show();
		ajaxRequest.get("/service/store/" + storeId + "/stock",{
			handleAs: 'json'
		}).then(function(stockResponse){
			if(stockResponse.success){
				updateInvoiceItemsGrid(stockResponse.models);
				registry.byId('invoiceItemsGridStandBy').hide();
			}
		}, function(error){
			console.log('Error occurred while fetching Stock data ' + error);
			registry.byId('invoiceItemsGridStandBy').hide();
		});
	},*/
	updateInventoryDetailsGrid = function(inventoryData){
		//if(inventoryData.length > 0)
		//	populateInventoryItems();
		var tempStore = {
				"identifier" : "id",
				"items" : []
		};
		tempStore.items = inventoryData;
		var gridDataStore = new itemFileWriteStore({data: tempStore});
		
		var formatItem = function(inVal, rowIndex){
			var colorSpan = '';//'<span style="text-align: super;background-color: ' + INVENTORY_ITEMS[inVal[1]]['color'] + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
			if((isInvoiceDetail === true) || (isInvoiceDetail == 'true'))
				return colorSpan + '<a href="javascript: editInvoiceItem(' + inVal[0] + ',' + rowIndex + ')">' + INVENTORY_ITEMS[inVal[1]]['name'] + '</a>';
			else
				return colorSpan + INVENTORY_ITEMS[inVal[1]]['name'];
		};
		
		var formatParUnits = function(inVal){
			var par = Number(INVENTORY_ITEMS[inVal]['par']);
			if(par > 1)
				return par + ' ' + INVENTORY_ITEMS[inVal]['units'];
			else 
				return par + ' ' + INVENTORY_ITEMS[inVal]['units'];
		};
		
		var formatTotal = function(inVal){
			var totalPrice = Number(inVal[0]) * Number(inVal[1]);
			var totalGS = Number(inVal[2]) * totalPrice / 100;
			return '$ ' + DNumber.round(totalPrice + totalGS, 2, 10); 
		};
		
		var formatToCurrency = function(inVal){
			return '$ ' + inVal;
		};
		
		var formatToPercent = function(inVal){
			return inVal + ' %';
		};
		
		if(!dijit.byId('inventoryInvoiceDetailsGrid')){
			inventoryDetailsGrid = new EnhancedGrid({
									store: gridDataStore,
									query: { id: "*" },
									structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'padding-left: 2px; text-align: left;', noresize: true, editable: false },
										cells: [{ name: "Stock Item", fields: ['id', "itemId"], width: "20%", noresize: true, formatter: formatItem },
									            { name: "Par (Units)", field: "itemId", width: "15%", noresize: true, formatter: formatParUnits },
												{ name: "In Stock", field: "itemStock", width: "12%", noresize: true },
												{ name: "Order", field: "itemOrder", width: "10%", noresize: true },
												{ name: "Per Unit", field: "itemPricePerUnit", width: "15%", noresize: true, formatter: formatToCurrency },
												{ name: "GS Charge", field: "itemGSPercent", width: "16%", noresize: true, formatter: formatToPercent },
												{ name: "Total", fields: ['itemOrder', 'itemPricePerUnit', 'itemGSPercent'], width: "12%", noresize: true, formatter: formatTotal }
												]}],
									singleClickEdit: false,
									editable: false,
									selectable: true,
									rowsPerPage: 10,
									loadingMessage: 'loadingMessage: Loading data from server..',
									errorMessage: 'Oops we could not retrive the requested data!',
									noDataMessage: "<span class=\"dojoxGridNoData\"><font color='grey'>Inventory Details not available. Please Add !!!</font></span>",
									onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									selectionMode: "multiple",
									rowSelector: '0px;',
									keepSelection: false,
									plugins: {indirectSelection: {headerSelector:true, width:"15px", styles:"text-align: center;"}}
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
		var formatGSInvoice = function(inVal){
			return '<a href="#" onClick="return false;">Invoice Details</a>';
		};
		var formatToCurrency = function(inVal){
			return '$ ' + inVal;
		};
		if(!dijit.byId('inventoryInvoicesGrid')){
			inventoryInvoicesGrid = new EnhancedGrid({
									store: gridDataStore,
									query: { id: "*" },
									structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
									            cells: [{ name: "Date", field: "invoiceDate", width: "25%", noresize: true},
									            { name: "GS Invoice", field: "id", width: "25%", noresize: true, formatter: formatGSInvoice},
												{ name: "GS Charges", field: "gsCharges", width: "25%", noresize: true, formatter: formatToCurrency},
												{ name: "Total Charges", field: "totalCharges", width: "25%", noresize: true, formatter: formatToCurrency}
												]}],
									singleClickEdit: false,
									editable: false,
									selectable: true,
									rowsPerPage: 10,
									loadingMessage: 'loadingMessage: Loading data from server..',
									errorMessage: 'Oops we could not retrive the requested data!',
									noDataMessage: "<span class=\"dojoxGridNoData\"><font color='grey'>Invoices not available.</font></span>",
									onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									selectionMode: "single"
									}, "inventoryInvoicesGrid");
			inventoryInvoicesGrid.startup();
		} else dijit.byId('inventoryInvoicesGrid').setStore(gridDataStore);
	},
	/* Inventory Items Dialog Grid
	updateInvoiceItemsGrid = function(invoiceData){
		if(invoiceData.length > 0)
			populateInventoryItems();
		var tempStore = {
				"identifier" : "id",
				"items" : []
		};
		tempStore.items = invoiceData;
		var gridDataStore = new itemFileWriteStore({data: tempStore});
		
		var formatItem = function(inVal){
			return INVENTORY_ITEMS[inVal]['name'];
		};
		
		var formatParUnits = function(inVal){
			var par = Number(INVENTORY_ITEMS[inVal]['par']);
			if(par > 1)
				return par + ' ' + INVENTORY_ITEMS[inVal]['units']['plural'];
			else 
				return par + ' ' + INVENTORY_ITEMS[inVal]['units']['singular'];
		};
		
		var formatTotal = function(inVal){
			var totalPrice = Number(inVal[0]) * Number(inVal[1]);
			var totalGS = Number(inVal[2]) * totalPrice / 100;
			return DNumber.round(totalPrice + totalGS, 2, 10); 
		};
		
		if(!dijit.byId('invoiceItemsGrid')){
			invoiceItemsGrid = new EnhancedGrid({
									store: gridDataStore,
									style:'width:520px;height:300px;',
									query: { id: "*" },
									structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'padding-left: 2px; text-align: left;', noresize: true, editable: false },
										cells: [{ name: "Stock Item", field: "itemId", width: "17%", noresize: true, formatter: formatItem},
									            { name: "Par (Units)", field: "itemId", width: "14%", noresize: true, formatter: formatParUnits},
												{ name: "In Stock", field: "itemStock", width: "12%", noresize: true},
												{ name: "Order", field: "itemOrder", width: "10%", noresize: true},
												{ name: "Price per Unit", field: "itemPricePerUnit", width: "17%", noresize: true},
												{ name: "GS Charge (%)", field: "itemGSPercent", width: "20%", noresize: true},
												{ name: "Total", fields: ['itemOrder', 'itemPricePerUnit', 'itemGSPercent'], width: "10%", noresize: true, formatter: formatTotal}
												]}],
									singleClickEdit: false,
									editable: false,
									selectable: true,
									rowsPerPage: 10,
									loadingMessage: 'loadingMessage: Loading data from server..',
									errorMessage: 'Oops we could not retrive the requested data!',
									noDataMessage: "<span class=\"dojoxGridNoData\"><font color='grey'>Inventory Details not available. Please Add !!!</font></span>",
									onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									selectionMode: "multiple",
									rowSelector: '0px;',
									keepSelection: false,
									plugins: {indirectSelection: {headerSelector:true, width:"15px", styles:"text-align: center;"}}
									}, "invoiceItemsGrid");
			invoiceItemsGrid.startup();
		} else dijit.byId('invoiceItemsGrid').setStore(gridDataStore);
		invoiceItemsGrid.set('height', '300px');
		invoiceItemsGrid.set('width', '540px');
		invoiceItemsGrid.resize();
	},*/
	
	showDialogToAddItem=function(){
		var codesData = [];
		baseArray.forEach(dojo.clone(INVENTORY_DISTRIBUTORS), function(distributor){
			baseArray.forEach(distributor.items, function(item){
				codesData.push(lang.mixin(item, {category: item.categoryId, code: item.code, name: '&nbsp;<span style="background-color: ' + item.color + '; color: #fff;">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' + item.name + '&nbsp;&nbsp;&nbsp;'}));
			});
		});
		codesData.sort(function(a,b){return a.code - b.code });
		var itemStockStore = new Memory({idProperty: 'code', data: codesData});
		var os = new ObjectStore({ objectStore: itemStockStore });
		dijit.byId('inventoryStockItem').setStore(os);
		dijit.byId('inventoryStockItem').startup();
		registry.byId('inventoryItemDialogForm').reset();
		inventoryItemDialog.show();
		domStyle.set(dom.byId('inventoryItemDialog'), {top:'40px', position: "absolute"});
	},
	resetScreen = function(){
		dom.byId('inventoryTabTitle').innerHTML = 'Invoices / Stock';
		dom.byId('createInvoiceLink').style.display = '';
		registry.byId('inventoryInvoicesGrid').selection.clear();
		registry.byId('inventoryInvoiceDetailsGrid').selection.clear();
		registry.byId('inventoryInvoiceItemId').set('value', 0);
		INVENTORY_DISTRIBUTORS = [];
		fetchStoreDistributorsAndItems(registry.byId('hiddenStoreId').get('value'));
		var workLater = function(){
			var chkCondition = (INVENTORY_DISTRIBUTORS) && (INVENTORY_DISTRIBUTORS.length > 0);
			if(dojox.timing.doLater(chkCondition)){
				return;
			}
			fetchInvoiceGridData(registry.byId('hiddenStoreId').get('value'));
			fetchStockGridData(registry.byId('hiddenStoreId').get('value'));
		};
		workLater();
		
	},
	
	resetInvoiceDetails = function(){
		var selectedInvoiceId = registry.byId('inventoryInvoicesGrid').selection.getSelected()[0]['id'][0];
		fetchInvoiceGridData(registry.byId('hiddenStoreId').get('value'));
		fetchInvoiceDetails(selectedInvoiceId);
		console.log('Refresh Invoice ', selectedInvoiceId);
	};
	
	return{
			init: function(){
				initInventory();
			},
			applySecurity: function(){
				
			},
			reset: function(){
				resetScreen();
			},
			createInvoiceAction: function(){
				//invoiceItemsDialog.show();
				//domStyle.set(dom.byId('invoiceItemsDialog'), {top:'40px', position: "absolute"});
				//fetchInvoiceItemsGridData(registry.byId('hiddenStoreId').get('value'));
				var grid = registry.byId('inventoryInvoiceDetailsGrid');
				var selectedItems = grid.selection.getSelected();
				var invoiceDetails = [], invoice = {}, storeId=0;
				if(selectedItems.length > 0){
					baseArray.forEach(selectedItems, function(selItem){
						storeId = selItem.storeId[0];
						invoiceDetails.push({'itemId': selItem.itemId[0], 'itemCategory': selItem.itemCategory[0], 'itemStock': selItem.itemStock[0],   
							'itemOrder': selItem.itemOrder[0], 'itemGSPercent': selItem.itemGSPercent[0], 'itemPricePerUnit': selItem.itemPricePerUnit[0]
							});
					});
					invoice['storeId'] = storeId;
					invoice['invoiceDetails'] = invoiceDetails;
					invoice['locked'] = false;
					invoice['active'] = true;
					
					registry.byId('inventoryPaneStandBy').show();
					ajaxRequest.post('/service/store/'+ registry.byId('hiddenStoreId').get('value') +'/invoice', {
			    		headers: { "Content-Type":"application/json"}, 
			    		handleAs: 'json', data: json.stringify(invoice), timeout: 10000
			    			}).then(function(invoiceResponse){
			    				if(invoiceResponse.success){
			    					fetchInvoiceGridData(registry.byId('hiddenStoreId').get('value'));
			    					registry.byId('inventoryInvoiceDetailsGrid').selection.clear();
			    				}
			    				registry.byId('inventoryPaneStandBy').hide();
			    		}, function(error){
			    			registry.byId('inventoryPaneStandBy').hide();
			    		});
				} else {
					
				}
			},
			showAddItemDialog: function(){
				registry.byId('inventoryInvoiceItemId').set('value', 0);
				registry.byId('inventoryStockItem').set('readOnly', false);
				showDialogToAddItem();
			},
			editInvoiceItem: function(itemId, rowIndex){
				showDialogToAddItem();
				var selectedItem = registry.byId('inventoryInvoiceDetailsGrid').getItem(rowIndex);
				registry.byId('inventoryStockItem').set('value', selectedItem['itemId'][0]);
				registry.byId('inventoryStockItem').set('readOnly', true);
				//registry.byid('inventoryStockParUnits').set('value', selectedItem[''][0]);
				registry.byId('inventoryStockInStock').set('value', selectedItem['itemStock'][0]);
				registry.byId('inventoryStockToOrder').set('value', selectedItem['itemOrder'][0]);
				registry.byId('inventoryStockPPU').set('value', selectedItem['itemPricePerUnit'][0]);
				registry.byId('inventoryStockGSCharge').set('value', selectedItem['itemGSPercent'][0]);
				registry.byId('inventoryInvoiceItemId').set('value', selectedItem['id'][0]);
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
				
				var postURL = '/service/store/'+ registry.byId('hiddenStoreId').get('value') +'/stock';
				var itemId = registry.byId('inventoryInvoiceItemId').get('value');
				if(Number(itemId) > 0){
					postURL = '/service/store/invoiceDetail/'+ itemId;
					jsonRowObject['id'] = itemId;
					jsonRowObject['invoiceId'] = 0;
					delete jsonRowObject['storeId'];
					ajaxRequest.put(postURL, {
			    		headers: { "Content-Type":"application/json"}, 
			    		handleAs: 'json', data: json.stringify(jsonRowObject), timeout: 10000
			    			}).then(function(invUpdateResponse){
			    				if(invUpdateResponse.success){
			    					resetInvoiceDetails();
			    					inventoryItemDialog.hide();
			    				}
			    				registry.byId('inventoryItemDialogFormStandBy').hide();
			    		}, function(error){
			    			registry.byId('inventoryItemDialogFormStandBy').hide();
			    			dom.byId('inventoryItemDialogFormErrorMsgs').innerHTML = '<font color="red">Error while Adding --> ' + error + '</font>';
			    		});
				} else {
					ajaxRequest.post(postURL, {
			    		headers: { "Content-Type":"application/json"}, 
			    		handleAs: 'json', data: json.stringify(jsonRowObject), timeout: 10000
			    			}).then(function(stockUpdateResponse){
			    				if(stockUpdateResponse.success){
			    					//fetchStockGridData(registry.byId('hiddenStoreId').get('value'));
			    					resetScreen();
			    					inventoryItemDialog.hide();
			    				}
			    				registry.byId('inventoryItemDialogFormStandBy').hide();
			    		}, function(error){
			    			registry.byId('inventoryItemDialogFormStandBy').hide();
			    			dom.byId('inventoryItemDialogFormErrorMsgs').innerHTML = '<font color="red">Error while Adding --> ' + error + '</font>';
			    		});
				}
			}
	};
});