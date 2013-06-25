define([ "dijit/registry", "dojo/dom", "dojo/dom-style", "dojo/dom-class", "dojo/dom-construct",
         "dojo/dom-geometry", "dojo/string", "dojo/on", "dojo/keys",
		"dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/json",
		"dojo/_base/config", "dojo/io-query", "dojo/_base/window", "dojo/aspect",
		"dojo/date/locale",  "dojo/_base/fx", 
		"dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/layout/ContentPane",
		"dijit/Calendar", "dijit/TitlePane", "dijit/form/FilteringSelect",
		"dijit/form/Form", "dijit/Dialog", "dijit/form/DropDownButton",
		"dijit/form/TextBox", "dijit/form/Button", "dojox/grid/EnhancedGrid" ],
		function(registry, dom, domStyle, domClass, domConstruct, domGeometry, string, on, 	keys, 
				lang, baseArray, event, json, djConfig, ioQuery, win, aspect, locale, baseFx) {
			// pull configuration from the query string
			// and mix it into our app config
			/*var queryParams;
			try {
				queryParams = ioQuery.queryToObject(location.search
						.substring(1));
				djConfig.mixin(djConfig.app, queryParams);
			} catch (e) {
			}*/

			var stores = null, loginDate = null, loginUser = null,
			
			loginQuery = djConfig.loginRequest || {},
			
			startup = function() {
		        // create the data store
		        stores = new Date();
		        loginDate = locale.format(new Date(), { formatLength : "full", selector : "date" });
		        //json.stringify(djConfig, null, "\t") djConfig.application.user
		        
		        initUi();
		    },
		 
		    initUi = function() {
		        // summary:
		        // create and setup the UI with layout and widgets
		        console.log('Init UI Method()');
		    },
		    doLogin = function() {
		        // summary:
		        // inititate Login Call for the given Userid / Password
		    },
		    renderItem = function(item, refNode, posn) {
		        // summary:
		        // Create HTML string to represent the given item
		    };
		    
		    return {
		        init: function() {
		            // proceed directly with startup
		            startup();
		            console.log('Layout Controller Initialized ()');
		        }
		    };
});