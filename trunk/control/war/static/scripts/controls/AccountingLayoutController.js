define(["dijit/dijit", "dojo/date", "dojo/dom", "dojo/dom-style", "dojo/dom-construct", "dojo/fx", "dojo/parser", "dijit/registry", "dojo/store/Memory", "dojo/json", "dojo/fx",
        "dojo/_base/lang", "dojo/request", "dojo/_base/array", "dojo/date/locale", "dijit/form/Select", "dijit/form/FilteringSelect", "dojo/number", "dojox/lang/functional", "dojo/window"],
function(dijit, date, dom, domStyle, domConstruct, otherFx, parser, registry, Memory, json, otherFx, lang, ajaxRequest, arrayUtils, locale, formSelect, FilteringSelect, DNumber, functional, window){
	var widgets = ['accountingLbrAmt', 'accountingFdAmt', 'accountingSuppliesAmt', 'accountingAdvtAmt', 'accountingMiscAmt', 'accountingProfitAmt', 'accountingTotalSales', 'accountingTotalOpExp'],
	percentSuffix = 'Percent', accountingChart = null, accountingMonthlyChart=null,
	initListening = function(){
		arrayUtils.forEach(widgets, function(id){
			var widget = '';
			try{
				widget = dijit.byId(id);
				widget.on('change', function(newVal){
					if(!(isNaN(newVal))){
						calculatePercents(newVal);
						refreshPieChartForQuarter();
					}
				});
			} catch(e){}
		});
	},
	calculatePercents = function(newVal){
		var total = 0;
		arrayUtils.forEach(widgets, function(id){
			total += isNaN(dijit.byId(id).get('value')) ? 0 : dijit.byId(id).get('value');
		});
		arrayUtils.forEach(widgets, function(id){
			var value = isNaN(dijit.byId(id).get('value')) ? 0 : dijit.byId(id).get('value');
			var percent = Number(isNaN(Number(value)/Number(total)) ? 0 : Number(value)/Number(total)) * 100;
			try{dom.byId(id+percentSuffix).innerHTML = DNumber.round(percent, 2, 10) + ' %';}catch(e){}
		});
	},
	refreshPieChartForQuarter = function(){
		var data = google.visualization.arrayToDataTable([['Sales', 'Amount'], 
		                                                  ['Labor', dijit.byId('accountingLbrAmt').get('value')], 
		                                                  ['Food Cost', dijit.byId('accountingFdAmt').get('value')],
		                                                  ['Supplies', dijit.byId('accountingSuppliesAmt').get('value')], 
		                                                  ['Advertisement',  dijit.byId('accountingAdvtAmt').get('value')], 
		                                                  ['Misc', dijit.byId('accountingMiscAmt').get('value')], 
		                                                  ['Profit', dijit.byId('accountingProfitAmt').get('value')]]);
		var options = {	title: 'Sales Distribution Chart', titleTextStyle: {}, is3D: true,
				 			chartArea: {left:2, top:20, width: '99%'},
				 			legend: {position: 'bottom', textStyle: {color: 'black'/*, fontSize: 11*/}, alignment: 'center'}
		 			};
		accountingChart.draw(data, options);
	},
	/*using totalProfits column for suppliesAmt field*/
	saveOrUpdateQuarterData = function(formData, buttonPressed){
		console.log('Form Data is --> ', formData, buttonPressed);
		var modifiedData = { storeId: registry.byId('hiddenStoreId').get('value'), quarter: registry.byId('accountingQuartersList').get('value'), 
				year: registry.byId('hiddenSelectedYear').get('value'), labor: dijit.byId('accountingLbrAmt').get('value'), 
				foodCost: dijit.byId('accountingFdAmt').get('value'), advertisement: dijit.byId('accountingAdvtAmt').get('value'), 
				misc: dijit.byId('accountingMiscAmt').get('value'), profit: dijit.byId('accountingProfitAmt').get('value'), totalSales: dijit.byId('accountingProfitAmt').get('value'),
				totalOpExp: dijit.byId('accountingTotalOpExp').get('value'), totalProfits: dijit.byId('accountingSuppliesAmt').get('value')};
		registry.byId('accountsQuarterDetailsStandBy').show();
		if(buttonPressed == 'save'){
			ajaxRequest.post("/service/store/" + modifiedData.storeId + "/accounting/year/" + modifiedData.year + "/quarter/" + modifiedData.quarter, {
        		headers: { "Content-Type":"application/json"}, 
        		handleAs: 'json', data: json.stringify(modifiedData), timeout: 4000 
        			}).then(function(accountUpdateResponse){
        				if(accountUpdateResponse.success){
        					registry.byId('accountingUpdateBtn').set('disabled', false);
        					registry.byId('accountingSaveBtn').set('disabled', true);
	        				//console.log('Add Successful -->' + accountUpdateResponse.model.id);
	        				dom.byId('messages').innerHTML = 'Add Successful';
	        				//dom.byId('hiddenAccountingRecordId').value = accountUpdateResponse.model.id;
	        				registry.byId('hiddenAccountingRecordId').set('value', accountUpdateResponse.model.id);
        				}
        				registry.byId('accountsQuarterDetailsStandBy').hide();
        		}, function(error){
        			registry.byId('accountingUpdateBtn').set('disabled', true);
					registry.byId('accountingSaveBtn').set('disabled', false);
    				console.log('Error while updating --> ' + error);
        			//dom.byId('hiddenAccountingRecordId').value = 0;
        			registry.byId('hiddenAccountingRecordId').set('value', 0);
        			dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
        			registry.byId('accountsQuarterDetailsStandBy').hide();
        		});
		}else {
			//modifiedData.id = dom.byId('hiddenAccountingRecordId').value;
			modifiedData.id = registry.byId('hiddenAccountingRecordId').get('value');
			ajaxRequest.put("/service/store/" + modifiedData.storeId + "/accounting/year/" + modifiedData.year + "/quarter/" + modifiedData.quarter, {
        		headers: { "Content-Type":"application/json"}, 
        		handleAs: 'json', data: json.stringify(modifiedData), timeout: 4000 
        			}).then(function(accountUpdateResponse){
        				if(accountUpdateResponse.success){
	        				console.log('Update Success -->');
	        				dom.byId('messages').innerHTML = 'Update Successful';
        				}
        				registry.byId('accountsQuarterDetailsStandBy').hide();
        		}, function(error){
        			console.log('Error while updating --> ' + error);
        			dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
        			registry.byId('accountsQuarterDetailsStandBy').hide();
        		});
		}
		
	},
	
	fetchBlobsForAccounting = function(accId){
		registry.byId('accMonthlyDocumentStandBy').show();
    	ajaxRequest.get("/service/blobs/accMonthlyDocument/" + accId,{
    		handleAs: 'json'
    	}).then(function(blobsResponse){
    		var uploadFilesNode = dom.byId('accMonthlyDocumentExisting');
    		domConstruct.empty(uploadFilesNode);
    		var fragment;
    		var innerHTMLText = '';
    		arrayUtils.forEach(blobsResponse.models, function(blob){
    			fragment = document.createDocumentFragment();
    			innerHTMLText = '&nbsp;&nbsp;&nbsp;<img src="resources/images/icon-pdf.png"/> &nbsp;'
    				+ '<a target="_new" href="/service/getBlob/' + blob.blobKey + '">' 
    				//+ ((blob.fileName.length > 20) ? (blob.fileName.substr(0, 20)+'...') : blob.fileName) 
    				+  blob.fileName 
    				+ '</a>'
    				/*+ '&nbsp;&nbsp;' + '<img src="resources/images/delete-icon.png" onclick="javascript: deleteItem(' + "'blob','mgrContract','" + blob.id + "'" + ');"/>'*/
    				+ '&nbsp;&nbsp;' + '<span onclick="javascript: deleteItem(' + "'blob','accMonthlyDocument','" + blob.id + "'" + ');"><i class="icon-remove"></i></span>'
    				;
    				//+ '&nbsp;<a target="_new" href="/service/getBlob/' + blob.blobKey + '">View/Download</a>';
    			domConstruct.create("li", {
                    innerHTML: innerHTMLText
                }, fragment);
	    		domConstruct.place(fragment, uploadFilesNode);
    		});
    		registry.byId('accMonthlyDocumentStandBy').hide();
    	}, function(error){
    		console.log('Error occurred while fetching store data ' + error);
    		registry.byId('accMonthlyDocumentStandBy').hide();
    	});
	},
	
	populateQuartersList = function(domNode){
		accountingChart = new google.visualization.PieChart(document.getElementById('accountingChartDiv'));
		accountingMonthlyChart = new google.visualization.ColumnChart(document.getElementById('accountingMonthlyChartDiv'));
		
		var quartersStore = new Memory({data: [
		                                       {id: 0, name:"--Month--", label:"--Month--"}, 
		                                       {id: 1, name:"January", label:"January"},
		                                       {id: 2, name:"February", label:"February"},
		                                       {id: 3, name:"March", label:"March"},
		                                       {id: 4, name:"April", label:"April"},
		                                       {id: 5, name:"May", label:"May"},
		                                       {id: 6, name:"June", label:"June"},
		                                       {id: 7, name:"July", label:"July"},
		                                       {id: 8, name:"August", label:"August"},
		                                       {id: 9, name:"September", label:"September"},
		                                       {id: 10, name:"October", label:"October"},
		                                       {id: 11, name:"November", label:"November"},
		                                       {id: 12, name:"December", label:"December"}
		                                      ]
										});
		                                   
		var quartersList = new FilteringSelect({ id: "accountingQuartersList", value: 0, store: quartersStore, searchAttr: "name", name: "accountingQuartersList",
             labelAttr: "label", style: "width: 100px; padding-left: 10px;" }, dom.byId("accountingQuartersList"));
	
		quartersList.on('change', function(newValue){
			if(Number(newValue) > 0){
				populateQuarterData(newValue);
			} else {
				resetForm(true, true);
				registry.byId('hiddenAccountingRecordId').set('value', 0);
				fetchBlobsForAccounting(registry.byId('hiddenAccountingRecordId').get('value'));
			}
		});
	},
	
	populateQuarterData = function(quarter){
		console.log('Quarter -->' , quarter);
		registry.byId('accountsQuarterDetailsStandBy').show();
		var year = registry.byId('hiddenSelectedYear').get('value');
		ajaxRequest.get("/service/store/" + registry.byId('hiddenStoreId').get('value') + "/accounting/year/" + year + "/quarter/" + quarter,{
    		handleAs: 'json'
    	}).then(function(quarterResponse){
    		if(quarterResponse.models.length > 0){
    			var formData = quarterResponse.models[0];
    			resetForm(true, false);
    			registry.byId('accountingEntriesForm').set('value', {accountingLbrAmt: formData.labor, accountingFdAmt: formData.foodCost, 
    					accountingAdvtAmt: formData.advertisement, accountingMiscAmt: formData.misc, accountingProfitAmt: formData.profit, 
    					accountingTotalSales: formData.totalSales, accountingTotalOpExp: formData.totalOpExp, accountingSuppliesAmt: formData.totalProfits});
    			//dom.byId('hiddenAccountingRecordId').value = formData.id;
    			registry.byId('hiddenAccountingRecordId').set('value', formData.id);
    		} else{
    			registry.byId('hiddenAccountingRecordId').set('value', 0);
    			resetForm(false, true);
    		}
    		fetchBlobsForAccounting(registry.byId('hiddenAccountingRecordId').get('value'));
    		registry.byId('accountsQuarterDetailsStandBy').hide();
    	}, function(error){
    		registry.byId('accountsQuarterDetailsStandBy').hide();
    	});
	},
	
	resetForm = function(save, update){
		arrayUtils.forEach(widgets, function(id){
			registry.byId(id).reset();
		});
		registry.byId('accountingUpdateBtn').set('disabled', update);
		registry.byId('accountingSaveBtn').set('disabled', save);
	},
	fetchYearlyAccounts = function(storeId){
    	registry.byId('accountingYearsStandBy').show();
    	ajaxRequest.get("/service/store/" + storeId + "/accounting/years",{
    		handleAs: 'json'
    	}).then(function(accountingYearsResponse){
    		if(accountingYearsResponse.success){
    			populateYearlyAccounts('accountingYearlyTable', accountingYearsResponse.customMessages);
    			registry.byId('accountingYearsStandBy').hide();
    		}
    	}, function(error){
    		console.log('Error occurred while fetching Accounting data ' + error);
    		registry.byId('accountingYearsStandBy').hide();
    	});
    },
    populateYearlyAccounts = function(domNode, yearlyReviewsModel){
    	var yearlyList = dom.byId(domNode);
    	var selectedYear = registry.byId('hiddenSelectedYear').get('value');
    	domConstruct.empty(yearlyList);
    	var tableTR;
    	var keys = functional.keys(yearlyReviewsModel);
    	arrayUtils.forEach(keys, function(yearRecord){
    		tableTR = domConstruct.create("tr");
    		var xtraStyle = '';
    		if(selectedYear == yearRecord)
    			xtraStyle = "style='color: #fff'";
    		var td = domConstruct.create("td", { innerHTML: "<a " + xtraStyle + " href='javascript: fetchAccountingYearlyDetails(\"" + yearRecord + "\");'>" + yearRecord + "</a>"}, tableTR);
    		domStyle.set(td, 'text-align', 'center');
    		if(selectedYear == yearRecord){
    			domStyle.set(td, 'background-color', '#a00');
    		}
    		else {
    			domStyle.set(td, 'background-color', '#fff');
    		}
    		tableTR.appendChild(td);
    		yearlyList.appendChild(tableTR);
    	});
    	
    },
    populateAccountingYearlyDetails = function(year){
    	var tableDom = dom.byId('yearlyAccountingDetailsTable');
    	domConstruct.empty(tableDom);
    	registry.byId('accountsYearlyDetailsStandBy').show();
    	ajaxRequest.get('/service/store/' + registry.byId('hiddenStoreId').get('value') + '/accounting/year/' + registry.byId('hiddenSelectedYear').get('value'),
    			{ handleAs: 'json'}).then(function(accountingYearsResponse){
    		if(accountingYearsResponse.success && (accountingYearsResponse.models.length > 0)){
    			var labels = ['<b>Total Sales</b>', /*'blank',*/ 'Labor', 'Food Cost', 'Supplies', 'Advertisement', 'Misc', '<b>Profit</b>'], quarters = [1, 2, 3, 4];
    			var dataForTable = {}, sampleData = {}, quarterlyDataForTable = {};
    			arrayUtils.forEach(quarters, function(quarter){
    				dataForTable[quarter] = {'total': 0, 'labor': 0, 'foodCost': 0, 'supplies': 0, 'advertisement': 0, 'misc': 0, 'profit': 0};
    			});
    			
    			//totalProfits === supplies
    			var totalOperatingExpenses = 0;
    			arrayUtils.forEach(accountingYearsResponse.models, function(quartleryEntry, index){
    				var totalSales = quartleryEntry.labor + quartleryEntry.foodCost + quartleryEntry.totalProfits + quartleryEntry.advertisement + quartleryEntry.misc + quartleryEntry.profit;
    				totalOperatingExpenses += quartleryEntry.totalOpExp;
    				dataForTable[quartleryEntry.quarter] = {'total': totalSales, 'labor': quartleryEntry.labor, 'foodCost': quartleryEntry.foodCost, 'supplies': quartleryEntry.totalProfits,
    						'advertisement': quartleryEntry.advertisement, 'misc': quartleryEntry.misc, 'profit': quartleryEntry.profit, 'operatingExpenses': quartleryEntry.totalOpExp};
    			});
    			
    			arrayUtils.forEach(functional.keys(dataForTable), function(monthKey, index){
    				var quarterNumber = parseInt(monthKey/3);
    				if((monthKey%3) == 0)
    					quarterNumber = quarterNumber+'';
    				else 
    					quarterNumber = (quarterNumber+1)+'';
    				if(!(quarterNumber in quarterlyDataForTable))
    					quarterlyDataForTable[quarterNumber] = lang.clone(dataForTable[monthKey]);
    				else {
    					var temp = lang.clone(dataForTable[monthKey]);
    					quarterlyDataForTable[quarterNumber]['total'] = quarterlyDataForTable[quarterNumber]['total'] + temp.total;
    					quarterlyDataForTable[quarterNumber]['labor'] = quarterlyDataForTable[quarterNumber]['labor'] + temp.labor;
    					quarterlyDataForTable[quarterNumber]['foodCost'] = quarterlyDataForTable[quarterNumber]['foodCost'] + temp.foodCost;
    					quarterlyDataForTable[quarterNumber]['supplies'] = quarterlyDataForTable[quarterNumber]['supplies'] + temp.supplies;
    					quarterlyDataForTable[quarterNumber]['advertisement'] = quarterlyDataForTable[quarterNumber]['advertisement'] + temp.advertisement;
    					quarterlyDataForTable[quarterNumber]['misc'] = quarterlyDataForTable[quarterNumber]['misc'] + temp.misc;
    					quarterlyDataForTable[quarterNumber]['profit'] = quarterlyDataForTable[quarterNumber]['profit'] + temp.profit;
    					quarterlyDataForTable[quarterNumber]['operatingExpenses'] = quarterlyDataForTable[quarterNumber]['operatingExpenses'] + temp.operatingExpenses;
    				}
    			});
    			
    			arrayUtils.forEach(quarters, function(quarterlyIndex){
    				var quarterNumber = quarterlyIndex+'';
    				if(!(quarterNumber in quarterlyDataForTable))
    					quarterlyDataForTable[quarterNumber] = {'total': 0, 'labor': 0, 'foodCost': 0, 'supplies': 0, 'advertisement': 0, 'misc': 0, 'profit': 0, 'operatingExpenses': 0};
    			});
    			refreshColumnChartForYearlyData(lang.clone(dataForTable));
    			
    			dataForTable = lang.clone(quarterlyDataForTable);
    			var tableTR, td, tdLabel, tdValue=0, tdTotal=0, dataForGraph={};
    			arrayUtils.forEach(labels, function(label){
	    			tableTR = domConstruct.create("tr");
					if(label == 'blank') tdLabel = ''
					else tdLabel = label;
					td = domConstruct.create("td", {innerHTML: tdLabel});
					tableTR.appendChild(td);
					tdValue = 0;
					tdTotal = 0;
					arrayUtils.forEach(quarters, function(quarterlyIndex){
						switch(label){
							case '<b>Total Sales</b>':
								tdValue = (dataForTable[quarterlyIndex+'']).total;
								break;
							case 'Labor':
								tdValue = (dataForTable[quarterlyIndex+'']).labor;
								break;
							case 'Food Cost':
								tdValue = (dataForTable[quarterlyIndex+'']).foodCost;
								break;
							case 'Supplies':
								tdValue = (dataForTable[quarterlyIndex+'']).supplies;
								break;
							case 'Advertisement':
								tdValue = (dataForTable[quarterlyIndex+'']).advertisement;
								break;
							case 'Misc':
								tdValue = (dataForTable[quarterlyIndex+'']).misc;
								break;
							case '<b>Profit</b>':
								tdValue = (dataForTable[quarterlyIndex+'']).profit;
								break;
							case 'blank':
								tdValue = '';
								break;
						}
						if(!(label == 'blank')){
							tdValue = isNaN(tdValue) ? 0 : DNumber.format(tdValue, {places: 2, locale: 'en-us'});
							tdTotal += DNumber.parse(tdValue, {places: 2, locale: 'en-us'});
							tdValue = '$' + tdValue;
						} else tdValue = '&nbsp;';
						if((label == '<b>Total Sales</b>') || (label == '<b>Profit</b>')){
							tdValue = '<b>' + tdValue + '</b>';
						}
	    				td = domConstruct.create("td", {innerHTML: tdValue});
	    				tableTR.appendChild(td);
	    			});
					
					switch(label){
						case '<b>Total Sales</b>':
							dataForGraph.totalSales = tdTotal;
							break;
						case 'Labor':
							dataForGraph.labor = tdTotal;
							break;
						case 'Food Cost':
							dataForGraph.foodCost = tdTotal;
							break;
						case 'Supplies':
							dataForGraph.supplies = tdTotal;
							break;
						case 'Advertisement':
							dataForGraph.advertisement = tdTotal;
							break;
						case 'Misc':
							dataForGraph.misc = tdTotal;
							break;
						case '<b>Profit</b>':
							dataForGraph.profit = tdTotal;
							break;
					}
					
					if(label == 'blank') tdTotal = '';
					else tdTotal = '$' + DNumber.format(tdTotal, {places: 2, locale: 'en-us'});
					if((label == '<b>Total Sales</b>') || (label == '<b>Profit</b>')){
						tdTotal = '<b>' + tdTotal + '</b>';
					}
					td = domConstruct.create("td", {innerHTML: tdTotal});
    				tableTR.appendChild(td);
					tableDom.appendChild(tableTR);
	    		});
    			refreshPieChartForYearlyData({labor: dataForGraph.labor, foodCost: dataForGraph.foodCost, supplies: dataForGraph.supplies, advertisement: dataForGraph.advertisement, 
    				misc: dataForGraph.misc, profit: dataForGraph.profit});
    			dom.byId('totalYearlySalesAmt').innerHTML = '$' + DNumber.format(dataForGraph.totalSales, {places: 2, locale: 'en-us'});
    			
    			//var totalOperExp = totalOperatingExpenses;
    			dom.byId('totalOperatingExpensesAmt').innerHTML = '$' + DNumber.format(totalOperatingExpenses, {places: 2, locale: 'en-us'});;
    			//dom.byId('totalOperatingExpensesPercent').innerHTML = DNumber.round((totalOperExp/dataForGraph.totalSales) * 100, 2, 10) + '%' ;
    			
    			dom.byId('totalProfitsAmt').innerHTML = '$' + DNumber.format(dataForGraph.profit, {places: 2, locale: 'en-us'});
    			dom.byId('totalProfitsPercent').innerHTML = DNumber.round((dataForGraph.profit/dataForGraph.totalSales) * 100, 2, 10) + '%' ;
    		}
    		registry.byId('accountsYearlyDetailsStandBy').hide();
    		document.getElementById('accountingMonthlyChartDiv').style.display='';
    	}, function(error){
    		console.log('Error occurred while fetching Accounting data ' + error);
    		registry.byId('accountsYearlyDetailsStandBy').hide();
    	});
    },
    refreshPieChartForYearlyData = function(data){
		var data = google.visualization.arrayToDataTable([['Sales', 'Amount'], 
		                                                  ['Labor', data.labor], 
		                                                  ['Food Cost', data.foodCost], 
		                                                  ['Supplies', data.supplies],
		                                                  ['Advertisement',  data.advertisement], 
		                                                  ['Misc', data.misc], 
		                                                  ['Profit', data.profit]]);
		var windowBoxObj = window.getBox();
		var chartHeight = parseInt(windowBoxObj.h - parseInt(32*(windowBoxObj.h/100)));
		var options = {	title: 'Sales Distribution Chart', titleTextStyle: {}, is3D: true,
				 			chartArea:{left:2, top:20, width: '99%'/*, height: '90%'*/},
				 			legend: {position: 'bottom', textStyle: {color: 'black'/*, fontSize: 11*/}, alignment: 'center'}
		 			};
		accountingChart.draw(data, options);
	},
	refreshColumnChartForYearlyData = function(columnData){
		//if(columnData.length > 0){
			var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var googleData = [];
			googleData.push(['Month', 'Operating Expenses', 'Labor', 'Food', 'Supplies', 'Advertisement', 'Misc.', 'Profit']);
			arrayUtils.forEach(months, function(month){
				var tempArray = [];
				if(month in columnData){
					tempArray.push(monthNames[month-1]);
					tempArray.push(columnData[month+''].operatingExpenses);
					tempArray.push(columnData[month+''].labor);
					tempArray.push(columnData[month+''].foodCost);
					tempArray.push(columnData[month+''].supplies);
					tempArray.push(columnData[month+''].advertisement);
					tempArray.push(columnData[month+''].misc);
					tempArray.push(columnData[month+''].profit);
				} else {
					tempArray.push(monthNames[month-1]);
					tempArray.push(0);
					tempArray.push(0);
					tempArray.push(0);
					tempArray.push(0);
					tempArray.push(0);
					tempArray.push(0);
					tempArray.push(0);
				}
				googleData.push(tempArray);
			});
			var data = google.visualization.arrayToDataTable(googleData);
			var windowBoxObj = window.getBox();
			var chartWidth = parseInt(windowBoxObj.w - parseInt(25*(windowBoxObj.w/100)));
			var chartHeight = parseInt(windowBoxObj.h - parseInt(70*(windowBoxObj.h/100)));
			var options = { title: 'Monthly Stats', hAxis: {title: 'Month', titleTextStyle: {color: 'black'}}, width: chartWidth, height: chartHeight };
			accountingMonthlyChart.draw(data, options);
		//}
	};
	
	return {
		init: function(){
			populateQuartersList();
		},
		postCreate: function(){
			initListening();
		},
		reset: function(){
			fetchYearlyAccounts(registry.byId('hiddenStoreId').get('value'));
			registry.byId('accountingQuartersList').reset();
			resetForm(true, true);
			refreshPieChartForQuarter();
			document.getElementById('accountingMonthlyChartDiv').style.display='none';
			//refreshColumnChartForYearlyData([]);
			fetchBlobsForAccounting(0);
		},
		fetchAccDetailsForYear: function(year){
			registry.byId('hiddenSelectedYear').set('value', year);
			var wipeOut = otherFx.wipeOut({node: dom.byId('accountingDetailsPane'), duration: 1000, delay: 250, 
	    		onEnd: function(node){
	    				domStyle.set(this.node, {display: "none", width: "99%", height: "99%"});
	    				dom.byId('accountsQuarterDetails').style.display = 'none';
	    				dom.byId('accountsYearlyDetails').style.display = '';
	    				document.getElementById('accountingMonthlyChartDiv').style.display='';
	    			}
	    	});
	    	var wipeIn = otherFx.wipeIn({node: dom.byId('accountingDetailsPane'), duration: 1000, delay: 250, 
	    		onBegin: function(node){
	    				domStyle.set(this.node, {display: "", width: "99%", height: "99%"});
	    				dom.byId('accountsQuarterDetails').style.display = 'none';
	    				dom.byId('accountsYearlyDetails').style.display = '';
	    			}
	    	});
	    	otherFx.chain([wipeOut, wipeIn]).play();
	    	//dom.byId('accountingYearButton').innerHTML = year;
	    	populateAccountingYearlyDetails(year);
		},
		updateAccountingData: function(formData, buttonPressed){
			saveOrUpdateQuarterData(formData, buttonPressed);
		},
		fetchAccountingMonthlyBlobs: function(accId){
			fetchBlobsForAccounting(accId);
	    }
	};
});