define(["dijit/dijit", "dojo/date", "dojo/dom", "dojo/dom-style", "dojo/fx", "dojo/parser", "dijit/registry", "dojo/_base/lang",
        "dojox/calendar/Calendar","dojo/request", "dojo/store/Observable", "dojo/store/Memory", "dojo/_base/array", "dojo/date/locale", "controls/EmployeeLayoutController", "dojo/_base/event"],
	function(dijit, date, dom, domStyle, otherFx, parser, registry, lang, Calendar, ajaxRequest, Observable, Memory, arrayUtils, locale, empLayout, baseEvent){
	
	var fetchCalendarData = function(storeId, yearWeek){
		var standByWidget = 'calendarEntryTitlePaneStandBy';
		registry.byId(standByWidget).show();
		ajaxRequest.get('/service/store/' + storeId + '/labor/' + yearWeek + '/schedule',{
    		handleAs: 'json'
    	}).then(function(laborDetailsResponse){
    		if(laborDetailsResponse.success && laborDetailsResponse.models.length>0){
    			populateCalendarData(laborDetailsResponse);
    		} else {
    			var calendar = registry.byId('labor-calendar');
    			//registry.byId('labor-calendar').set('date', registry.byId('itemStartDateEditor').get('value'));
    			var calStart = laborDetailsResponse.empRoles.datesMap.startDate.split('/');
    			calStart = new Date(calStart[2], calStart[0]-1, calStart[1]);
    			
    			var calEnd = laborDetailsResponse.empRoles.datesMap.endDate.split('/');
    			calEnd = new Date(calEnd[2], calEnd[0]-1, calEnd[1]);
    			
    			registry.byId('labor-calendar').set('startDate', calStart);
    			registry.byId('labor-calendar').set('endDate', calEnd);
    			calendar.set('store', new Observable(new Memory({data: []})));
    			registry.byId('labor-calendar').buttonContainer.innerHTML = 'Data Not Available !!!';
    			//registry.byId('labor-calendar').buttonContainer.style.display = 'none';
    			//dom.byId('calendarSummaryDetails').innerHTML = 'Data Not Available !!!';
    			dojo.byId('laborPaneInfoContent').innerHTML = 'No Data !!!';
    			//calendar.set('startDate', registry.byId('itemStartTimeEditor').get('value'));
            	//calendar.set('endDate', date.add(registry.byId('itemStartTimeEditor').get('value'), 6, 'day'));
            	//calendar.set('dateInterval', 'week');
    		}
    		registry.byId(standByWidget).hide();
    	}, function(error){
    		console.log('Error occurred while fetching store labor data ' + error);
    		registry.byId(standByWidget).hide();
    	});
	},
	calculateTotals = function(skeleton, calendarData){
		totalsMap = {total: 0, totalMgr: 0, totalKAMgr: 0, totalShiftLead: 0, totalCook: 0, totalFront: 0};
		arrayUtils.forEach(calendarData, function(item, index){
			if(item.position == "Manager") totalsMap.totalMgr = totalsMap.totalMgr + item.totalTime;
			if(item.position == "KA-Manager") totalsMap.totalKAMgr = totalsMap.totalKAMgr + item.totalTime;
			if(item.position == "Shift Lead") totalsMap.totalShiftLead = totalsMap.totalShiftLead + item.totalTime;
			if(item.position == "Front") totalsMap.totalFront = totalsMap.totalFront + item.totalTime;
			if(item.position == "Cook") totalsMap.totalCook = totalsMap.totalCook + item.totalTime;
			totalsMap.total = totalsMap.total + item.totalTime;
		});
		
		var employeeHrsMap = {};
		var empHrsArray = [];
		var tempTime=0;
		arrayUtils.forEach(calendarData, function(item, index){
			if(employeeHrsMap[item.empId] == undefined){
				employeeHrsMap[item.empId] = {name: item.fname, position: item.position, time: item.totalTime};
			}else {
				tempTime = (employeeHrsMap[item.empId]).time;
				(employeeHrsMap[item.empId]).time = tempTime + item.totalTime;
			}
		});
		
		var laborInfoTableHTML = '<table class="laborTable" valign="top" style="width: 100%; overflow: auto;">' 
				+ '<tr><td class="laborDateTd">' + skeleton + '</td>'
				+ '<td class="laborMgrTd">Total Mgr Hrs : ' + totalsMap.totalMgr + '</td>'
				+ '<td class="laborMgrTd">Total KA-Mgr Hrs : ' + totalsMap.totalKAMgr + '</td>'
				+ '<td class="laborShiftLeadTd">Total Shift Lead : ' + totalsMap.totalShiftLead + '</td>'
				+ '<td class="laborFrontTd">Total Front : ' + totalsMap.totalFront + '</td>'
				+ '<td class="laborCookTd">Total Cook : ' + totalsMap.totalCook + '</td>'
				+ '<td class="laborDateTd">Total Hrs (Not Included Mgr): ' + (totalsMap.totalFront + totalsMap.totalCook + totalsMap.totalShiftLead) + '</td>'
				+ '<td style="text-align: center;"><span id="noPrint1" style="font-weight: bold;" align="left"><a href="javascript: refreshCalendarForSelectedWeek();">Refresh</a>&nbsp;&nbsp;<a href="javascript: printCalendar();">Print</a></span></td>'
				+ '</tr></table>';
		
		registry.byId('labor-calendar').buttonContainer.innerHTML = laborInfoTableHTML;
		//registry.byId('labor-calendar').buttonContainer.style.display = 'none';
		//dom.byId('calendarSummaryDetails').innerHTML = laborInfoTableHTML;
		var employeeDetailsPaneContent = '<table class="laborTable" style="width: 100%; height: 100%; border: .1em solid #000;"><tr><th style="width: 50%;">Employee</th><th style="width: 50%;">Hours</th></tr><tbody>';
		for(var key in employeeHrsMap){
			empHrsArray.push(employeeHrsMap[key]);
		}
		empHrsArray.sort(function(a, b) { return parseFloat(b.time) - parseFloat(a.time);});
		
		arrayUtils.forEach(empHrsArray, function(item, index){
			var cssClass = '';
			if(item.position == 'Manager') cssClass = 'laborMgrTd';
			else if(item.position == 'KA-Manager') cssClass = 'laborMgrTd';
			else if(item.position == 'Shift Lead') cssClass = 'laborShiftLeadTd';
			else if(item.position == 'Front') cssClass = 'laborFrontTd';
			else if(item.position == 'Cook') cssClass = 'laborCookTd';
			employeeDetailsPaneContent = employeeDetailsPaneContent + '<tr><td style="width: 50%;" class="' + cssClass + '">' + item.name + '</td><td style="width: 50%;" class="itemTime">' + item.time + ' hrs' + '</td></tr>';
		});
		employeeDetailsPaneContent = employeeDetailsPaneContent + '</tbody></table>';
		
		otherFx.wipeIn({node: dom.byId('laborPaneInfo'),duration: 1000, delay: 250, onBegin: function(node){
			domStyle.set(this.node, {display: ""});
			dojo.byId('laborPaneInfoContent').innerHTML = employeeDetailsPaneContent;
			}
		}).play();
	},
	populateCalendarData = function(laborDetailsResponse){
		var calendarData = laborDetailsResponse.models;
		var calData = [];
		var calStart = new Date(), calEnd = (calStart.getDate()) + 6;
		var newItem={};
		arrayUtils.forEach(calendarData, function(item, index){
			//calStart = item.startDate + ' ';
			//calEnd = item.endDate + ' ';
			newItem = {id: item.id, summary: item.summary, begin: new Date(item.yyyy, item.mm, item.dd, item.beginHH, item.beginMi), 
					end: new Date(item.yyyy, item.mm, item.dd, item.endHH, item.endMi), calendar: item.calendar};
			calData.push(lang.mixin(newItem, item));
		});
		//calStart = calStart.split('/');
		//calEnd = calEnd.split('/');
		
		//calStart = new Date(calStart[2], calStart[0]-1, calStart[1]);
		//calEnd =  new Date(calEnd[2], calEnd[0]-1, calEnd[1]);
		
		
		calStart = laborDetailsResponse.empRoles.datesMap.startDate.split('/');
		calStart = new Date(calStart[2], calStart[0]-1, calStart[1]);
		
		calEnd = laborDetailsResponse.empRoles.datesMap.endDate.split('/');
		calEnd = new Date(calEnd[2], calEnd[0]-1, calEnd[1]);
		
		registry.byId('labor-calendar').set('startDate', calStart);
		registry.byId('labor-calendar').set('endDate', calEnd);
		registry.byId('labor-calendar').set('dateInterval', 'week');
    	registry.byId('labor-calendar').set('dateIntervalSteps', 1);
		registry.byId('labor-calendar').set('store', new Observable(new Memory({data: calData})));
		registry.byId('labor-calendar').set('createOnGridClick', false);
		//registry.byId('labor-calendar').set('date', calStart);
		//registry.byId('labor-calendar').set('dateInterval', 'week');
    	//registry.byId('labor-calendar').set('dateIntervalSteps', 1);
		calculateTotals(laborDetailsResponse.customMessages.skeleton, calendarData);
	},
	makeItemEditable = function(item){
		var widgets = [registry.byId('itemSummaryEditor'), registry.byId('itemStartDateEditor'), registry.byId('itemStartTimeEditor'), 
		               registry.byId('itemEndTimeEditor'), registry.byId('deleteItemButton'), registry.byId('updateItemButton')];
		
		arrayUtils.forEach(widgets, function(w){
			w.set("disabled", false);
			w.set("value", null, false);
		});
	},
	initCalendar = function(){
		var someData = [];
		var calendar = registry.byId('labor-calendar');
		calendar.set('dateInterval', 'week');
		calendar.set('allDayAttr ', 'allDay');
		calendar.set('startTimeAttr', 'begin');
		calendar.set('endTimeAttr', 'end');
		calendar.set('summaryAttr', 'summary');
		calendar.set('selectionMode ', 'single');
		calendar.set('moveEnabled', false);
		calendar.set('resizeEnabled', false);
		calendar.set('cssClassFunc', function(item){
			return item.calendar;
		});
		calendar.set('animateRange', true);
		calendar.set('animationRangeDuration', 500);
		calendar.set('startDate', new Date(2013, 4, 19));
		calendar.set('endDate', new Date(2013, 4, 25));
		calendar.set('dateIntervalSteps', 1);
		
		
		calendar.columnView.set('columnHeaderDatePattern', 'MMM dd (EEEE)');
		calendar.columnView.set('rowHeaderTimePattern', '');
		calendar.columnView.set('minHours', 8);
		calendar.columnView.set('maxHours', 24);
		calendar.columnView.set('timeSlotDuration', 60);
		calendar.columnView.set('horizontalGap', 2);
		calendar.columnView.set('percentOverlap', 70);
		calendar.columnView.set('hourSize', 50);
		
		calendar.set('store', new Observable(new Memory({data: someData})));
		
		
		calendar.on("itemClick", function(e){
			registry.byId('addItemButton').set('disabled', true);
			registry.byId('addItemButton').domNode.style.display = 'none';
			registry.byId('updateItemButton').set('disabled', false);
			registry.byId('updateItemButton').domNode.style.display = 'inline-block';
			registry.byId('deleteItemButton').set('disabled', false);
			registry.byId('deleteItemButton').domNode.style.display = 'inline-block';
		});
		
		calendar.set('createOnGridClick', false);

		calendar.columnView._columnHeaderClick = function(e){
			baseEvent.stop(e);
			return;
		};
		
		calendar.on("change", function(e){
			try{
				if(e.newValue && !((e.newValue == null) ||  (e.newValue == 'null'))){
					dijit.byId('itemSummaryEditor').set('value', (e.newValue.empId+''));
					registry.byId('itemStartTimeEditor').set('value', e.newValue.actualBeginTime);
					registry.byId('itemEndTimeEditor').set('value', e.newValue.actualEndTime);
					registry.byId('hiddenLaborItemId').set('value', e.newValue.id);
					dijit.byId('hiddenItemDate').set('value', e.newValue.begin);
					registry.byId('itemStartDateEditor').set('value', e.newValue.begin);
				}else resetInputControls();
			}catch(e){resetInputControls();}
			registry.byId('addItemButton').set('disabled', false);
			registry.byId('addItemButton').domNode.style.display = 'inline-block';
			registry.byId('updateItemButton').set('disabled', true);
			registry.byId('updateItemButton').domNode.style.display = 'none';
			registry.byId('deleteItemButton').set('disabled', true);
			registry.byId('deleteItemButton').domNode.style.display = 'none';
		});	
	},
	resetInputControls = function(){
		dijit.byId('itemSummaryEditor').set('value', 0);
		registry.byId('itemStartTimeEditor').set('value', '12:00 AM');
		registry.byId('itemEndTimeEditor').set('value', '12:00 AM');
		registry.byId('hiddenLaborItemId').set('value', 0);
		//registry.byId('itemStartDateEditor').set('value', new Date());
		//registry.byId('hiddenItemDate').set('value', new Date());
	};
	return {
		init: function() {
			initCalendar();
			if(domStyle.get(dom.byId('calendarEntryTitlePane'), 'display') != 'none')
				otherFx.wipeOut({node: dom.byId('calendarEntryTitlePane'),duration: 1000, delay: 250, onEnd: function(node){domStyle.set(this.node, {display: "none"});}}).play();
			//registry.byId('labor-calendar').buttonContainer.style.display = 'none';
			console.log('Labor Layout Controller Initialized ()');
        },
        resetToCurrentWeek: function(fetchData){
        	var calendar = registry.byId('labor-calendar');
        	calendar.set('createOnGridClick', false);
        	resetInputControls();
        	empLayout.populateEmployeesSelectWidget(registry.byId('hiddenStoreId').get('value'));
        	registry.byId('labor-calendar').set('dateInterval', 'week');
        	registry.byId('labor-calendar').set('dateIntervalSteps', 1);
        	registry.byId('itemStartDateEditor').set('value', new Date());
        	//fetchData = fetchData || ((registry.byId('labor-calendar').buttonContainer.innerHTML + '').indexOf('dijit_Toolbar_') > 0);
        	if(fetchData && !((laborPaneCalledFromStore) && (laborPaneCalledFromStore === true))){
        		var currentYear = locale.format(registry.byId('itemStartDateEditor').get('value'), {selector: 'date', datePattern: 'yyyy', locale: 'en'});
	        	var currentWeek = locale.format(registry.byId('itemStartDateEditor').get('value'), {selector: 'date', datePattern: 'w', locale: 'en'});
	        	var currentDayOfWeek = locale.format(registry.byId('itemStartDateEditor').get('value'), {selector: 'date', datePattern: 'EEE', locale: 'en'});
	        	//console.log('currentDayOfWeek --> ', currentDayOfWeek);
	        	if(currentDayOfWeek == 'Sun'){
	        		fetchCalendarData(registry.byId('hiddenStoreId').get('value'), (currentYear + '-' + (Number(currentWeek-1))));
	        		globalYearWeekForRefresh = currentYear + '-' + Number(currentWeek-1);
	        	}else {
	        		fetchCalendarData(registry.byId('hiddenStoreId').get('value'), (currentYear + '-' + (Number(currentWeek))));
	        		globalYearWeekForRefresh = currentYear + '-' + (Number(currentWeek));
	        	}
	        	
        	}
        	if((laborPaneCalledFromStore) && (laborPaneCalledFromStore === true)){
        		laborPaneCalledFromStore = false;
        	}
        	//if(domStyle.getComputedStyle(registry.byId('labor-calendar').buttonContainer))
        	//if((registry.byId('labor-calendar').buttonContainer.innerHTML + '').indexOf('dijit_Toolbar_0') > 0)
        },
        populateData: function(storeId, yearWeek){
        	fetchCalendarData(storeId, yearWeek);
        }
	};
});