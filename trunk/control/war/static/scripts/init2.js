/*
	require([ "dojo/date/locale","dijit/Dialog", "dijit/registry", "dojo/parser",
				"dojo/_base/lang", "dojo/json", "dojo/_base/config", "dojo/_base/window",
				"dojo/io-query",  "dojo/i18n", "dojo/domReady!" ], function(locale, Dialog, registry,
				parser, lang, JSON, config, win, ioQuery) {

			var now = new Date();
			
			// pull configuration from the query string
			// and mix it into our app config
			var queryParams = ioQuery.queryToObject(location.search
					.substring(1));
			lang.mixin(config.app, queryParams);

			// Create a dialog
			var dialog = new Dialog({
				title : "Welcome back " + config.application.user + " @ Today: " + locale.format(now, {
		            formatLength:"full",
		            selector:"date"
		    }),
				content : "<pre>" + JSON.stringify(config, true) + "</pre>"
			});

			// Draw on the app config to put up a personalized message
			dialog.show();
		});
	require(["dojo/dom", "dojo/fx", "dojo/domReady!"], function(dom, fx){
		    // The piece we had before...
		    var greeting = dom.byId("greeting");
		    greeting.innerHTML += " from Dojo!";
		 
		    // ...but now, with an animation!
		    fx.slideTo({
		        top: 100,
		        left: 200,
		        node: greeting
		    }).play();
		});
 */

// loadingObj is the object used to control the loading effects
require([ "dojo/dom-style", "dojo/_base/fx", "dojo/_base/declare",
		"dijit/registry", "dojo/dom"], function(domStyle, fx, declare,
		registry, dom) {
	var LoadingObj = declare(null, {
		overlayNode: null,
		constructor : function() {
			this.overlayNode = dom.byId('loadingOverlay');
		},
		endLoading : function() {
			try{fx.fadeOut({
				node : this.overlayNode,
				onEnd : function(node) {
					domStyle.set(node, 'display', 'none');
				}
			}).play();
			}catch(e){console.log('Error in Fx Fadeout !!');};
		},
		setSelectedLocation : function() {
			console.log('Setting Location !');
			environment.selectedLocation = "murray";
		}
	});
	loadingObj = new LoadingObj();
});

require(["controls/layoutController"], function(layout){console.log('Layout Require() Completed'); layout.init();});

require([ "dojo/_base/lang", "dojo/parser", "dojo/ready"], function(lang, parser, ready) {
	ready(function() {
		parser.parse();
		loginDialog._onKey = function(evt) {
			key = evt.keyCode;
			if (key == dojo.keys.ESCAPE) {
				dojo.stopEvent(evt);
				displayMessage("loginTrId", "loginMessage",
						"Cannot close the Dialog without login.", "info");
			}
		};
		loginDialog.closeButtonNode.style.display = "none";
		loadingObj.endLoading();
		loginDialog.show();
		setTimeout(lang.hitch(loadingObj, "setSelectedLocation"), 500);
	});
});






//Employee Pane Grid
require(["dojo/_base/declare", "dojo/store/Memory", "dgrid/Grid", "dgrid/extensions/Pagination", "dgrid/Keyboard", "dgrid/Selection", 
 "dgrid/extensions/ColumnHider", "dojo/query", "dojo/domReady!"], 
 function(declare, Memory, Grid, Pagination, Keyboard, Selection, ColumnHider, query){
	var empData = [
	            { icon: "a", fullName: "Barker1", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "b", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "c", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
	            { icon: "", fullName: "Barker", dateH: "23/12/1988", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " }
	        ];
	var showAdminIcon=function(value, rowIndex){return (value === 'Barker1' ? ("<img src='images/admin.png'/> &nbsp;&nbsp;&nbsp; " + value) : value);};
	var showPdfIcon=function(value, rowIndex){return "<img src='images/icon-pdf.png'/>";};
	var EmployeeGrid = declare([ Grid, Pagination, Keyboard, Selection, ColumnHider ]);
	var grid = new EmployeeGrid({store: new Memory({ data: empData }),
		columns: [
		{field: "icon", hidden: true},
		{field: "fullName", label: "Name", unhidable: true, formatter: showAdminIcon},
		{field: "dateH", label: "Date Hired" },
		{field: "startWage", label: "Start Wage" },
		{field: "payRaise", label: "Pay Raise / Date" },
		{field: "currentWage", label: "Current Wage" },
		{field: "quarterlyReview", label: "Reviews", formatter: showPdfIcon }
	], pagingLinks: 3, pagingTextBox: true, firstLastArrows: true, showLoadingMessage: true, rowsPerPage: 10, previousNextArrows: true, pagingLinks: 2, cellNavigation: false}, "employeeGrid");
    //grid.renderArray(data);
	grid.startup();
    grid.on("dgrid-select", function(event){
        //console.log("Row selected: ", event.rows[0].data);
    });
    grid.on("dgrid-deselect", function(event){
        //console.log("Row de-selected: ", event.rows[0].data);
    });
    grid.on(".dgrid-row:click", function(event){
        //var row = grid.row(event);
        //console.log("Row clicked:", row.id);
    });
});

/*require([
	"dojox/grid/EnhancedGrid","dojox/grid/enhanced/plugins/Pagination",
	"dojo/store/Memory",
	"dojo/data/ObjectStore",
	"dojo/request",
	"dojo/domReady!"
], function(DataGrid, Pagination, Memory, ObjectStore,request){
	var grid, dataStore, store;
	var empData = [
		            { icon: "a", fullName: "Barker", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "b", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "c", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1984", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1985", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1986", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1987", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " },
		            { icon: "", fullName: "Barker", dateH: "23/12/1988", startWage: "200$", payRaise: "Test ", currentWage: "1200$", quarterlyReview: "Test " }
		        ];
	
		var showAdminIcon=function(value, rowIndex){return "<img src='images/admin.png'/> &nbsp;&nbsp;&nbsp; " + value;};
		var showPdfIcon=function(value, rowIndex){return "<img src='images/icon-pdf.png'/>";};
		
		store = new Memory({ data: empData });
		dataStore = new ObjectStore({ objectStore: store });

		grid = new DataGrid({
			store: dataStore,
			query: { id: "*" },
			structure: [
			    { name: '', field: "icon", hidden: true},
				{ name: "Employee Name", field: "fullName", formatter: showAdminIcon, width: "20%", noresize: true},
				{ name: "Hire Date", field: "dateH", width: "20%", noresize: true},
				{ name: "Start Wage", field: "dateH", width: "15%", noresize: true},
				{ name: "Pay Raise", field: "dateH", width: "15%", noresize: true},
				{ name: "Current Wage", field: "dateH", width: "15%", noresize: true},
				{ name: "Quarterly Review", field: "dateH", formatter: showPdfIcon, width: "15%", noresize: true}
			],
			plugins:{
				pagination: {
		              pageSizes: ["25", "50", "100", "All"],
		              description: true,
		              sizeSwitch: true,
		              pageStepper: true,
		              gotoButton: true,
		              defaultPageSize: 20,
		                      page step to be displayed
		              maxPageStep: 4,
		                      position of the pagination bar
		              position: "bottom"
		          }
			  }
		}, "employeeGrid");
		grid.startup();
});*/










