define([ "dojo/_base/declare", "dijit/dijit", "dojo/dom-form", "dijit/form/Select", "dijit/registry", "dojo/dom", "dojo/dom-style", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/string", "dojo/on", 
         "dojo/keys", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/json", "dojo/_base/config", "dojo/fx", "dojo/io-query", "dojo/_base/window", "dojo/aspect",
 		"dojo/date/locale",  "dojo/_base/fx", "dojox/layout/TableContainer", "dijit/form/TextBox", "dijit/layout/ContentPane", "dijit/form/SimpleTextarea", "dijit/form/Textarea",
 		"dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/Calendar", "dijit/TitlePane", "dijit/form/FilteringSelect",	"dijit/form/Form", 
 		"dijit/Dialog", "dijit/form/DropDownButton", "dijit/form/Button", "dijit/form/DateTextBox", "dojox/grid/DataGrid", "dojox/grid/EnhancedGrid", "dojo/store/Memory", 
 		"dojo/query", "dojo/_base/declare", "dojo/has", "dojo/data/ObjectStore", "dojo/request", "dojox/form/Manager", "dojox/math/random/Simple", "dojox/lang/functional",
 		"dojo/data/ItemFileWriteStore", "dojox/grid/cells/dijit", "dijit/form/TimeTextBox", "dijit/form/ValidationTextBox",	"dijit/form/CurrencyTextBox", "dojo/store/Observable",  
 		"dijit/TooltipDialog", "dijit/popup", "dojo/number", "dijit/form/NumberTextBox", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/IndirectSelection"],
 		function(declare, dijit, domForm, Select, registry, dom, domStyle, domClass, domConstruct, domGeometry, string, on, 
 				keys, lang, baseArray, event, json, djConfig, otherFx, ioQuery, win, aspect, 
 				locale, baseFx, Table, TextBox, ContentPane, SimpleTextArea, TextArea, 
 				BorderContainer, TabContainer, Calendar, TitlePane, FilteringSelect, Form, 
 				Dialog, DropDownButton, Button, DateTextBox, DataGrid, EnhancedGrid, Memory, 
 				query, declare, has, ObjectStore, ajaxRequest, dojoxFormManager, randomNumber, functional,
 				itemFileWriteStore, gridDijit, TimeTextBox, ValidationTextBox, CurrencyTextBox, Observable, Tooltip, popup, DNumber, NumberTextBox){

	var inventoryDetailsGrid=null, invoiceItemsGrid=null, inventoryInvoicesGrid=null, isInvoiceDetail = false, /*INVENTORY_ITEMS_INFO = {},*/
	refreshInvoiceDetails = function(){
		registry.byId('inventoryInvoiceDetailsGrid').selection.clear();
		dom.byId('createInvoiceLink').style.display = 'none';
		var selectedRow = registry.byId('inventoryInvoicesGrid').selection.getSelected()[0];
		var selectedValue = registry.byId('invoiceCategorySelect').get('value');
		switch(selectedValue){
			case 'Distributor':
				dom.byId('inventoryTabTitle1').innerHTML = 'Inventory Details';
				break;
			case 'GS Kitchen':
				dom.byId('inventoryTabTitle1').innerHTML = 'Invoice Details';
				break;
		}
		
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
			registry.byId("invoiceActionSelect").set('value', 'reset');
		});
		var grid = registry.byId('inventoryInvoiceDetailsGrid');
		dojo.connect(grid, 'onStyleRow', function(row){
			var item = grid.getItem(row.index);
			var nd = dojo.query('td[idx="3"]', row.node)[0];
			if(nd && item){
				nd.style.backgroundColor = INVENTORY_ITEMS_INFO[item['itemId'][0]]['itemColor'];
				nd.style.color = '#ffffff';
			}
		});
		attachGridCellClickEvent('inventoryInvoiceDetailsGrid');
	},
	destroyAndCreateSelectWidget = function(items){
		if(registry.byId('inventoryStockItem')){
			registry.byId('inventoryStockItem').destroy(true);
		}
		var itemStockStore = new Memory({idProperty: 'code', data: items});
		var os = new ObjectStore({objectStore: itemStockStore});
		
		//registry.byId('inventoryStockInStock').reset();
		//registry.byId('inventoryStockToOrder').reset();
		//registry.byId('inventoryStockPPU').reset();
		//registry.byId('inventoryStockGSCharge').reset();
		//registry.byId('inventoryStockPar').reset();
		//registry.byId('inventoryStockParUnits').reset();
		
		selectWdgt= new Select({
            name: "inventoryStockItem",
            store: os,
            style: "width: 100px; font-size: 90%;",
            labelAttr: "name",
            invalidMessage : 'Item Selected is Invalid',
            required: true,
            maxHeight: -1, // tells _HasDropDown to fit menu within viewport
            onChange: function(newVal){
            	//console.log('onChange called witjh ', newVal);
            	this.get('store').fetch({query: {'code': newVal}, onComplete: function(items){
            		try{
						registry.byId('inventoryStockPar').reset();
						registry.byId('inventoryStockPar').set('value', items[0].par);
						var newPar = Number(items[0].par);
						registry.byId('inventoryStockParUnits').set('value', items[0].units);
						registry.byId('inventoryStockParCategory').set('value', items[0].category);
					}catch(e){console.log('Error in onChange() ', e);}
            	}});
            }
        }, "inventoryStockItem");
		selectWdgt.startup();
	},
	attachGridCellClickEvent = function(gridId){
		registry.byId(gridId).on("CellClick", function(evt){
			//console.log('Cell Clicked ', evt);
			if((evt.grid.get('id') == 'inventoryInvoiceDetailsGrid') && (evt.cellIndex == 2)){
				var standByWidgetId = evt.grid.get('id') + 'StandBy';
				registry.byId(standByWidgetId).show();
				var grid = evt.grid, serviceURL= evt.grid.getItem(evt.rowIndex)._self, editedItem = '{}';
				var selectedItems = [];//grid.selection.getSelected();
				selectedItems.push(evt.grid.getItem(evt.rowIndex));
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
	    			//console.log('Edited Item ', editedItem);
				    var jsonRowObject = json.parse(editedItem,false);
				    ajaxRequest.put(serviceURL, {
		        		headers: { "Content-Type":"application/json"}, 
		        		handleAs: 'json', data: json.stringify(jsonRowObject), timeout: 10000 
		        	}).then(function(updateResponse){
		        			if(updateResponse.success){
		        				console.log('Update Success ');
		        				dom.byId('messages').innerHTML = 'Update Success';
		        				if(evt.grid.get('id') == 'inventoryInvoiceDetailsGrid'){
		        					
		        				}
		        			}
		        			registry.byId(standByWidgetId).hide();
		        	}, function(error){
		        			console.log('Error while updating --> ' + error);
		        			dom.byId('messages').innerHTML = 'Error while updating --> ' + error;
		        			registry.byId(standByWidgetId).hide();
		        	});
			} else {
				registry.byId(standByWidgetId).hide();
			}
		} else if((evt.grid.get('id') == 'inventoryInvoiceDetailsGrid') && (evt.cellIndex == 1)){
			if((evt.grid.store.getValue(evt.grid.getItem(evt.rowIndex), '_self')+'').indexOf('/invoiceDetail') > 0)
				deleteItem('invoice-item', '', evt.grid.store.getValue(evt.grid.getItem(evt.rowIndex), 'id'));
			else
				deleteItem('stock-item', '', evt.grid.store.getValue(evt.grid.getItem(evt.rowIndex), 'id'));
		} else if((evt.grid.get('id') == 'inventoryInvoicesGrid') && (evt.cellIndex == 0)){
			deleteItem('invoice', '', evt.grid.store.getValue(evt.grid.getItem(evt.rowIndex), 'id'));
		}
	});
	},
	validateCell = function(cellWidget){
    	var returnValue = false;
    	try{cellWidget.focus(); returnValue = cellWidget.validate();}catch(e){console.log('Error while Validating Cell --> ' + e);returnValue=true;}
    	return returnValue;
    },
	fetchInvoiceGridData = function(storeId){
		registry.byId('inventoryInvoicesGridStandBy').show();
		ajaxRequest.get("/service/store/" + storeId + '/' + registry.byId('hiddenInvoiceCategory').get('value') + "/invoice",{
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
		ajaxRequest.get("/service/store/" + storeId + '/' + registry.byId('hiddenInvoiceCategory').get('value') + "/stock",{
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
		var tempStore = {
				"identifier" : "id",
				"items" : []
		};
		tempStore.items = inventoryData;
		var gridDataStore = new itemFileWriteStore({data: tempStore});
		
		var formatCode = function(inVal, rowIndex){
			return INVENTORY_ITEMS_INFO[inVal[1]]['itemCode'];
		};
		
		var formatItem = function(inVal, rowIndex){
			//if((isInvoiceDetail === true) || (isInvoiceDetail == 'true'))
			//	return '<a href="javascript: editInvoiceItem(' + inVal[0] + ',' + rowIndex + ')">' + INVENTORY_ITEMS_INFO[inVal[1]]['itemName'] + '</a>';
			//else
				return INVENTORY_ITEMS_INFO[inVal[1]]['itemName'];
		};
		
		var formatParUnits = function(inVal){
			return INVENTORY_ITEMS_INFO[inVal[1]]['itemPar'] + ' ' + INVENTORY_ITEMS_INFO[inVal[1]]['itemUnits'];
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
		
		var formatUpdate = function(inVal){
			return '<span><i class="icon-save"></i></span>';
		};
		
		var formatDelete = function(inVal){
			return '<span><i class="icon-trash"></i></span>';
		};
		
		if(!dijit.byId('inventoryInvoiceDetailsGrid')){
			inventoryDetailsGrid = new EnhancedGrid({
									store: gridDataStore,
									query: { id: "*" },
									structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'padding-left: 2px; text-align: left;', noresize: true, editable: false },
										cells: [{ name: "<span><i class='icon-trash'></i></span>", field: "id", width: "3%", noresize: true, styles: 'text-align: center;', formatter: formatDelete },
										        { name: "<span><i class='icon-save'></i></span>", field: "id", width: "3%", noresize: true, styles: 'text-align: center;', formatter: formatUpdate },
										        { name: "<b>Code</b>", fields: ["id", "itemId"], width: "7%", noresize: true, styles: 'text-align: center;', formatter: formatCode },
										        { name: "<b>Stock Item</b>", fields: ["id", "itemId"], width: "18%", noresize: true, formatter: formatItem },
									            { name: "<b>Par (Packaging)</b>", fields: ["id", "itemId"], width: "14%", noresize: true, formatter: formatParUnits },
												{ name: "<b>In Stock</b>", field: "itemStock", width: "10%", noresize: true, editable: true, 
										        	constraint:{required: false}, widgetProps: { promptMessage: 'Provide Stock Count', 
										        	missingMessage: 'Please enter only Numbers', invalidMessage: 'Accepts only Numerics'}, 
										        	widgetClass: NumberTextBox },
												{ name: "<b>Order</b>", field: "itemOrder", width: "7%", noresize: true, editable: true, 
										        	constraint:{required: false}, widgetProps: { promptMessage: 'Provide Order Count', 
										        	missingMessage: 'Please enter only Numbers', invalidMessage: 'Accepts only Numerics'}, 
										        	widgetClass: NumberTextBox },
												/*{ name: "Per Unit ($)", field: "itemPricePerUnit", width: "11%", noresize: true, formatter: formatToCurrency },*/
												{ name: "<b>Per Unit ($)</b>", field: "itemPricePerUnit", width: "12%", noresize: true, editable: true, 
										        	constraint:{required: false}, widgetProps: { promptMessage: 'Provide Price Per Unit', 
										        	missingMessage: 'Please enter only Numbers', invalidMessage: 'Accepts only Numerics'}, 
										        	widgetClass: NumberTextBox },
												/*{ name: "GS Charge %", field: "itemGSPercent", width: "13%", noresize: true, formatter: formatToPercent },*/
												{ name: "<b>GS Charge %</b>", field: "itemGSPercent", width: "13%", noresize: true, editable: true, 
										        	constraint:{required: false}, widgetProps: { promptMessage: 'Provide GS Charge %', 
										        	missingMessage: 'Please enter only Numbers', invalidMessage: 'Accepts only Numerics'}, 
										        	widgetClass: NumberTextBox },
												{ name: "<b>Total</b>", fields: ['itemOrder', 'itemPricePerUnit', 'itemGSPercent'], width: "7%", noresize: true, formatter: formatTotal }
												]}],
									singleClickEdit: true,
									editable: true,
									selectable: true,
									rowsPerPage: 10,
									loadingMessage: 'loadingMessage: Loading data from server..',
									errorMessage: 'Oops we could not retrive the requested data!',
									noDataMessage: "<span class=\"dojoxGridNoData\"><font color='grey'>Inventory Details not available. Please Add !!!</font></span>",
									onFetchError: function(error,ioargs){console.log('Error ocured: '+error+' ioargs: '+ioargs); return true;},
									selectionMode: "multiple",
									rowSelector: '0px;',
									keepSelection: false,
									plugins: {indirectSelection: {headerSelector:true, width:"20px", styles:"text-align: center;"}}
									}, "inventoryInvoiceDetailsGrid");
			inventoryDetailsGrid.startup();
		} else dijit.byId('inventoryInvoiceDetailsGrid').setStore(gridDataStore);
		
		if(registry.byId('invoiceCategorySelect')){
			var selectedValue = registry.byId('invoiceCategorySelect').get('value');
			switch(selectedValue){
				case 'Distributor':
					registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(8, false);
					registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(9, false);
					registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(10, false);
					//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(11, false);
					//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(12, false);
					break;
				case 'GS Kitchen':
					registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(8, true);
					registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(9, true);
					registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(10, true);
					//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(11, true);
					//registry.byId('inventoryInvoiceDetailsGrid').layout.setColumnVisibility(12, true);
					break;
			}
		}
		
		
	},
	
	updateInventoryInvoicesGrid = function(invoiceData){
		var tempStore = {
				"identifier" : "id",
				"items" : []
		};
		tempStore.items = invoiceData;
		var gridDataStore = new itemFileWriteStore({data: tempStore});
		var formatGSInvoice = function(inVal){
			return '<a href="#" onClick="return false;">GS Invoice</a>';
		};
		var formatInventory = function(inVal){
			return '<a href="#" onClick="return false;">Inventory</a>';
		};
		var formatToCurrency = function(inVal){
			return '$ ' + inVal;
		};
		var formatDelete = function(inVal){
			return '<span><i class="icon-trash"></i></span>';
		};
		if(!dijit.byId('inventoryInvoicesGrid')){
			inventoryInvoicesGrid = new EnhancedGrid({
									store: gridDataStore,
									query: { id: "*" },
									structure: [{defaultCell: { width: "20%", type: dojox.grid.cells._Widget, styles: 'text-align: left;', noresize: true, editable: false },
									            cells: [{ name: "<span><i class='icon-trash'></i></span>", field: "id", width: "5%", noresize: true, styles: 'text-align: center;', formatter: formatDelete },
									            { name: "<b>Date</b>", field: "invoiceDate", width: "20%", noresize: true, styles: 'text-align: center;'},
									            { name: "<b>Invoice</b>", field: "id", width: "19%", noresize: true, formatter: formatGSInvoice, styles: 'text-align: center;'},
									            { name: "<b>Inventory</b>", field: "id", width: "19%", noresize: true, formatter: formatInventory, styles: 'text-align: center;'},
												{ name: "<b>GS Charges($)</b>", field: "gsCharges", width: "25%", noresize: true, formatter: formatToCurrency},
												{ name: "<b>Total</b>", field: "totalCharges", width: "12%", noresize: true, formatter: formatToCurrency}
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
		
		if(registry.byId('invoiceCategorySelect')){
			var selectedValue = registry.byId('invoiceCategorySelect').get('value');
			switch(selectedValue){
				case 'Distributor':
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(2, false);
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(3, true);
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(4, false);
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(5, false);
					break;
				case 'GS Kitchen':
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(2, true);
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(3, false);
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(4, true);
					registry.byId('inventoryInvoicesGrid').layout.setColumnVisibility(5, true);
					break;
			}
		}
		
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
		//registry.byId('inventoryItemDialogForm').reset();
		registry.byId('inventoryStockItem').reset();
		registry.byId('inventoryStockInStock').reset();
		registry.byId('inventoryStockToOrder').reset();
		registry.byId('inventoryStockPPU').reset();
		registry.byId('inventoryStockGSCharge').reset();
		inventoryItemDialog.show();
		domStyle.set(dom.byId('inventoryItemDialog'), {top:'40px', position: "absolute"});
		//registry.byId('inventoryStockItem').set('value', '703');
		//selectWdgt.set('value', '703');
	},
	resetScreen = function(){
		dom.byId('inventoryTabTitle1').innerHTML = 'Items in Stock';
		dom.byId('createInvoiceLink').style.display = '';
		registry.byId('inventoryInvoicesGrid').selection.clear();
		registry.byId('inventoryInvoiceDetailsGrid').selection.clear();
		registry.byId('inventoryInvoiceItemId').set('value', 0);
		//registry.byId("invoiceCategorySelect").set('value', 'Distributor');
		//registry.byId("invoiceActionSelect").set('value', 'reset');
		ajaxRequest.get("/service/store/" + registry.byId('hiddenStoreId').get('value') + '/' + registry.byId('hiddenInvoiceCategory').get('value') + "/distributors",{
			handleAs: 'json'
		}).then(function(response){
			if(response.success){
				var codesData = new Array();
				baseArray.forEach(response.models, function(stockItem){
					INVENTORY_ITEMS_INFO[stockItem.id] = dojo.clone(stockItem);
					codesData.push({'code': stockItem.itemCode+'', 'par': stockItem.itemPar, 
						'units': stockItem.itemUnits, 'category': stockItem.itemCategory,
						'name': '&nbsp;<span style="background-color: #' + stockItem.itemColor + '; color: #fff;">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' + stockItem.itemName
						});
				});
				fetchInvoiceGridData(registry.byId('hiddenStoreId').get('value'));
				fetchStockGridData(registry.byId('hiddenStoreId').get('value'));
				//var itemStockStore = new Memory({idProperty: 'code', data: codesData});
				//var os = new ObjectStore({objectStore: itemStockStore});
				//dijit.byId('inventoryStockItem').setStore(null);
				//registry.byId('inventoryStockItem').setStore(os);
				//var emptyStore = new Memory({idProperty: 'code', data: []});
				//var emptyObjectStore = new ObjectStore({objectStore: emptyStore});
				//registry.byId('inventoryStockItem').setStore(emptyObjectStore);
				
				//setTimeout(function(){registry.byId('inventoryStockItem').setStore(os)}, 100);
				destroyAndCreateSelectWidget(codesData);
			}
		}, function(error){
			console.log('Error occurred while fetching Inventory Details data ' + error);
		});
		
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
			postCreate: function(){
				console.log('Inventory --> postCreate()');
				/*var invoiceCategoryTabContainer = registry.byId("invoiceCategoryTabContainer");
				registry.byId("invoiceCategoryTabContainer").watch("selectedChildWidget", function(name, oval, nval){
				    var newPaneTitle = nval.get('title');
				    switch(newPaneTitle){
				    	case 'GS Kitchen':
				    		registry.byId("hiddenInvoiceCategory").set('value', 'g');
				    		dom.byId('inventoryTabTitleCategory').innerHTML = '(GS Kitchen)';
				    		break;
				    	case 'Distributor':
				    		registry.byId("hiddenInvoiceCategory").set('value', 'd');
				    		dom.byId('inventoryTabTitleCategory').innerHTML = '(Distributor)';
				    		break;
				    }
		    		resetScreen();
				});*/
				
				on(registry.byId("invoiceCategorySelect"), "change", function(){
					var newVal = this.get('value');
					switch(newVal){
				    	case 'GS Kitchen':
				    		registry.byId("hiddenInvoiceCategory").set('value', 'g');
				    		dom.byId('inventoryTabTitleCategory').innerHTML = '(GS Kitchen)';
				    		dom.byId('inventoryTabTitleCategory1').innerHTML = '(GS Kitchen)';
				    		dom.byId('invoiceItemPPURow').style.display='';
				    		dom.byId('invoiceItemGSChargeRow').style.display='';
				    		dom.byId('printTitle').innerHTML = 'Print Invoice';
				    		dom.byId('createTitle').innerHTML = 'Create Invoice';
				    		dom.byId('inventoryTabTitle').innerHTML = 'Invoices';
				    		break;
				    	case 'Distributor':
				    		registry.byId("hiddenInvoiceCategory").set('value', 'd');
				    		dom.byId('inventoryTabTitleCategory').innerHTML = '(Distributor)';
				    		dom.byId('inventoryTabTitleCategory1').innerHTML = '(Distributor)';
				    		dom.byId('invoiceItemPPURow').style.display='none';
				    		dom.byId('invoiceItemGSChargeRow').style.display='none';
				    		dom.byId('printTitle').innerHTML = 'Print Inventory';
				    		dom.byId('createTitle').innerHTML = 'Create Inventory';
				    		dom.byId('inventoryTabTitle').innerHTML = 'Inventories';
				    		break;
					}
					resetScreen();
					registry.byId("invoiceActionSelect").set('value', 'reset');
				});
				registry.byId("hiddenInvoiceCategory").set('value', 'd');
				dom.byId('invoiceItemPPURow').style.display='none';
	    		dom.byId('invoiceItemGSChargeRow').style.display='none';
	    		dom.byId('printTitle').innerHTML = 'Print Inventory';
	    		dom.byId('createTitle').innerHTML = 'Create Inventory';
	    		dom.byId('inventoryTabTitle').innerHTML = 'Inventories';
				
				on(registry.byId("invoiceActionSelect"), "change", function(){
					var newVal = this.get('value');
					switch(newVal){
				    	case 'checkStock':
				    		resetScreen();
				    		break;
				    	case 'updateStock':
				    		registry.byId('inventoryInvoiceItemId').set('value', 0);
							registry.byId('inventoryStockItem').set('readOnly', false);
							showDialogToAddItem();
				    		break;
				    	case 'addInventoryItem':
				    		var codesData = [];
				    		baseArray.forEach(dojo.clone(INVENTORY_DISTRIBUTORS), function(distributor){
				    			codesData.push({ color: distributor.color, id: distributor.id, name: '&nbsp;<span style="background-color: ' + distributor.color + '; color: #fff;">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' + distributor.name + '&nbsp;&nbsp;&nbsp;'});
				    		});
				    		var itemStockStore = new Memory({idProperty: 'id', data: codesData});
				    		var os = new ObjectStore({ objectStore: itemStockStore });
				    		dijit.byId('inventoryItemDistributor').setStore(os);
				    		addInventoryItemDialog.show();
				    		domStyle.set(dom.byId('addInventoryItemDialog'), {top:'40px', position: "absolute"});
				    		break;
				    	default:
				    		break;
					}
				});
				
				on(registry.byId("inventoryItemDialog"), 'hide', function(){
					registry.byId("invoiceActionSelect").set('value', 'reset');
				});
				
				on(registry.byId("addInventoryItemDialog"), 'hide', function(){
					registry.byId("invoiceActionSelect").set('value', 'reset');
				});
				
			},
			resetInvoiceDetails: function(){
				resetInvoiceDetails();
			},
			reset: function(){
				resetScreen();
			},
			refreshSelectedInvoiceDetails: function(){
				refreshInvoiceDetails();
			},
			createInvoiceAction: function(){
				var grid = registry.byId('inventoryInvoiceDetailsGrid');
				var selectedItems = grid.selection.getSelected();
				var invoiceDetails = [], invoice = {}, storeId=0;
				if(selectedItems.length > 0){
					baseArray.forEach(selectedItems, function(selItem){
						storeId = selItem.storeId[0];
						invoiceDetails.push({'itemId': selItem.itemId[0], /*'itemCategory': selItem.itemCategory[0], */'itemStock': selItem.itemStock[0],   
							'itemOrder': selItem.itemOrder[0], 'itemGSPercent': selItem.itemGSPercent[0], 'itemPricePerUnit': selItem.itemPricePerUnit[0]
							});
					});
					invoice['storeId'] = storeId;
					invoice['invoiceDetails'] = invoiceDetails;
					invoice['locked'] = false;
					invoice['active'] = true;
					
					registry.byId('inventoryPaneStandBy').show();
					ajaxRequest.post('/service/store/'+ registry.byId('hiddenStoreId').get('value') + '/' + registry.byId('hiddenInvoiceCategory').get('value') + '/invoice', {
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
				registry.byId('inventoryStockItem').set('value', selectedItem['itemId'][0]+'');
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
				
				var postURL = '/service/store/'+ registry.byId('hiddenStoreId').get('value') + '/' + registry.byId('hiddenInvoiceCategory').get('value') + '/stock';
				var itemId = registry.byId('inventoryInvoiceItemId').get('value');
				if(Number(itemId) > 0){
					postURL = '/service/store/' + '/' + registry.byId('hiddenInvoiceCategory').get('value') + 'invoiceDetail/'+ itemId;
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