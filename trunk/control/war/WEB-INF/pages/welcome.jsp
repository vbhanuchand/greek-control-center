<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"	"http://www.w3.org/TR/html4/strict.dtd">

<!--  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">-->
<!-- The HTML 4.01 Transitional DOCTYPE declaration-->
<!-- above set at the top of the file will set     -->
<!-- the browser's rendering engine into           -->
<!-- "Quirks Mode". Replacing this declaration     -->
<!-- with a "Standards Mode" doctype is supported, -->
<!-- but may lead to some differences in layout.   -->

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Control Center</title>
<link rel="shortcut icon" href="resources/images/favicon.ico" />
<script type="text/javascript">
	var loadingObj;
	var blobStoreURL="/service/upload";
	window.blobStoreURL = "/service/upload";
	var globalId=999;
	var calendar;
	var dojoConfig = {
		dojoBlankHtmlUrl: location.pathname.replace(/\/[^/]+$/, '') + '/resources/images/blank.html',
		baseUrl : "//ajax.googleapis.com/ajax/libs/dojo/1.8.3/",
		tlmSiblingOfDojo : false,
		async : true,
		application : {
			app : 'control-center',
			user : 'anonymous'
		},
		loginRequest : {
			username : 'services',
			password : 'welcome1',
			employeeURL : '/employees',
			sort : [ {
				attribute : 'id',
				descending : true
			} ]
		},
		packages : [{name : "controls", location : location.pathname.replace(/\/[^/]+$/, '') + "/resources/scripts/controls", main : "layoutController"},
		             {name: "dgrid", location: location.pathname.replace(/\/[^/]+$/, '') + "/resources/scripts/dgrid"},
		             {name: "put-selector", location: location.pathname.replace(/\/[^/]+$/, '') + "/resources/scripts/put-selector"},
		             {name: "xstyle", location: location.pathname.replace(/\/[^/]+$/, '') + "/resources/scripts/xstyle"}]
	};
</script>

<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/resources/dojo.css" />
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css" />
	
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/nihilo/nihilo.css">
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/resources/nihiloGrid.css" />	

<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/claro/claro.css" />
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/resources/claroGrid.css" />
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/enhanced/resources/claro/EnhancedGrid.css" />
	
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/soria/soria.css">
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/resources/soriaGrid.css" />

<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/soria/Calendar.css" />
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/nihilo/Calendar.css" />
	<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/claro/Calendar.css" />
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/form/resources/FileInput.css" />
<!-- <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/widget/Dialog/Dialog.css" /> -->
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/layout/resources/ScrollPane.css" />
<link rel="stylesheet" href="resources/styles/styles2.css" />
<script
	data-dojo-config="has:{'dojo-firebug': true, 'dojo-debug-messages': true}, cacheBust: true, parseOnLoad:false, isDebug: true,
	waitSeconds: 20, locale: location.search.match(/locale=([\w\-]+)/) ? RegExp.$1 : 'en-us'"
	src="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/dojo.js">
	
</script>
<script src="resources/scripts/custom-utils.js"></script>
<script src="resources/scripts/init.js"></script>
</head>

<body class="soria">
	<noscript><style type="text/css">#loadingOverlay { display: none !important; }</style></noscript>
	<div id="loadingOverlay" class="loadingPanel" align="center"><div align="left"
		style="background: #DBEB8F; padding: 2px">Loading...</div></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenStoreId" id="hiddenStoreId"></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenSelectedYear" id="hiddenSelectedYear"></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/DateTextBox" data-dojo-id="hiddenItemDate" id="hiddenItemDate" value="now"></div>
	<!-- <div id="messagesTooltip" data-dojo-id="messagesTooltip" data-dojo-type="dijit/TooltipDialog"></div> -->
	<div class="dijitHidden">  
		<div data-dojo-type="dijit/Dialog"
			data-dojo-props="title:'Login', loadingMessage:'Loading Login Form...'"
			draggable="true" data-dojo-id="loginDialog" id="loginDialog" >
			<form data-dojo-type="dijit/form/Form" data-dojo-id="loginForm" id="loginForm">
				<table class="bordered" style="vertical-align: middle;">
					<tr>
						<td align="left" valign="middle"><img align="top"
							src="resources/images/login.png" height="60" width="60" /></td>
						<td align="left" valign="middle">Login with your credentials
							to navigate further.</td>
					</tr>
					<tr id="loginTrId" style="display: none;" align="center">
						<td colspan="2" align="center"><span id="loginMessage"></span></td>
					</tr>
					<tr>
						<td colspan="2" align="left"><label for="username">Username:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input
							data-dojo-type="dijit/form/ValidationTextBox"
							data-dojo-props="required: 'true', trim: 'true', ucfirst:'true', invalidMessage : 'Username is invalid', placeHolder:'(Assigned by Administrator)'"
							id="username" name="username" /></td>
					</tr>
					<tr>
						<td colspan="2" align="left"><label for="password">Password:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input
							data-dojo-type="dijit/form/ValidationTextBox" id="password"
							data-dojo-props="required: 'true', trim: 'true', ucfirst:'true'"
							name="password" type="password" /> &nbsp;&nbsp;&nbsp;
							<button data-dojo-type="dijit/form/Button" type="submit">Login</button>
						</td>
					</tr>
				</table>
				<script type="dojo/on" data-dojo-event="submit" data-dojo-args="e">
            		e.preventDefault(); // prevent the default submit
            		if(!loginForm.isValid()){ 
						displayMessage("loginTrId", "loginMessage", "Invalid Username and Password. Please check.. ", "warning");
						return; 
					};
						// xhr.post( {
            			//      url: 'foo.com/handler',
            			//      content: { field: 'go here' },
            			//      handleAs: 'json'
            			//      load: function(data){ .. },
            			//      error: function(data){ .. }
            			//  });
					displayMessage("loginTrId", "loginMessage", "Login to the Portal is successful.", "success");
					var otherFx = require("dojo/fx");
					var dom = require("dojo/dom");
					var registry = require("dijit/registry");
					var domStyle = require('dojo/dom-style');
					otherFx.wipeOut({node: dom.byId('loginDialog'),duration: 1000, delay: 250, onEnd: function(){
						//domStyle.set(this.node, {display: "none"});
						registry.byId('loginDialog').hide();
					}}).play();
					checkSelectedPane('locationTabletr3', 'rightAccordion', 3);
					modifyContentPaneTitles();
					modifyStoreDateLabel('store-info-important-dates');
					var storeLayout = require("controls/StoreLayoutController");
					var empLayout = require("controls/EmployeeLayoutController");
					storeLayout.postCreate();
					empLayout.postCreate();
        		</script>
			</form>
		</div>
		<div id="fileUploadDialog" data-dojo-type="dijit/Dialog"
			data-dojo-props="title:'Upload Files', loadingMessage:'Loading Form...'"
			draggable="true" data-dojo-id="fileUploadDialog">
			<form data-dojo-type="dijit/form/Form" data-dojo-id="fileUploadForm" id="fileUploadForm">
				 <input type="hidden" name="hiddenRecordId" value="1" />
				 <input name="uploadedFile" multiple="false" type="file" id="uploadedFileId"
       					data-dojo-type="dojox/form/Uploader" data-dojo-props='label:"Select File"' />
       			 <input type="submit" label="Submit" data-dojo-type="dijit/form/Button" />
			</form>
		</div>
	</div>

	<div data-dojo-type="dijit/layout/BorderContainer"
		style="padding: 0px; width: 100%; height: 100%;"
		data-dojo-props="design:'sidebar', gutters:true">
		<div data-dojo-type="dijit/layout/ContentPane" style="width: 15%;height: 98%;"
			data-dojo-props="splitter:false, region:'leading'">
			<div style='margin-top: 2px;'>
				<table class="bordered" style="width: 100%; height: 30%;"
					id="locationTable">
					<tr id="locationTabletr1"
						onclick="javascript: checkSelectedPane('locationTabletr1', 'rightAccordion', 1);">
						<td>Downtown</td>
					</tr>
					<tr id="locationTabletr2"
						onclick="javascript: checkSelectedPane('locationTabletr2', 'rightAccordion', 2);">
						<td>West Valley</td>
					</tr>
					<tr id="locationTabletr3"
						onclick="javascript: checkSelectedPane('locationTabletr3', 'rightAccordion', 3);">
						<td>Murray</td>
					</tr>
					<tr id="locationTabletr4"
						onclick="javascript: checkSelectedPane('locationTabletr4', 'rightAccordion', 4);">
						<td>South Jordan</td>
					</tr>
					
				</table>
			</div>
			<div id="employeePaneInfo" data-dojo-type="dijit/layout/ContentPane" align="center" style="display: none;"
				data-dojo-props="title:'Photograph', style:'margin-top:10px;width:100%;vertical-align:top;font-size:100%'">
				<div id="employeePaneInfoContent" align="center">
					<img id="employeeImg" align='top' src='resources/images/no-photo.png' width="140px" height="170px"/>
					<div id="fileUploadWidgetsDivEmp" style="display: none;">
   						<span id="fileUploadWidgetsEmp"></span>
	  					<span id="fileUploadProgressMsgsEmp"></span>
	  					<a href="javascript: hideFileUploadDialog('empPane');">Hide</a>
	  				</div>
   					<div style="padding: 2px 3px 1px 3px"><a href="javascript: showFileUploadDialog('empPane');">&lt;&lt;Upload Photo&gt;&gt;</a>
   						<span id="empPhotoUploadOptions"></span>
   					</div>
   					
	  				<div id="employeePaneInfoStandBy" data-dojo-id="employeePaneInfoStandBy" 
						data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeePaneInfoContent', color:'lightgrey'">
					</div>
				</div>
			</div>
			<div id="messages"></div>
			
			<div id="calendarEntryTitlePane" style="font-size: 95%" data-dojo-type="dijit.TitlePane" data-dojo-props="title:'Labor Entry', style:'margin-top:10px;width:100%;'" >
				<div><span class="propertyTitle">Employee:</span></div>
				<div id="itemSummaryEditor"></div>
				<div style="margin-top:10px"><span class="propertyTitle">Date:</span></div>
				<div>
					<div id="itemStartDateEditor"></div>
				</div>
				<div style="margin-top:10px"><span class="propertyTitle">Time:</span></div>
				<div>
					<div id="itemStartTimeEditor" data-dojo-attach-point="itemStartTimeEditor" data-dojo-type="dojox/form/TimeSpinner" style="width:45%;" data-dojo-props="disabled:false, pattern: 'HH:mm', smallDelta: 60, largeDelta: 60" ></div>
					<div id="itemEndTimeEditor" data-dojo-attach-point="itemEndTimeEditor" data-dojo-type="dojox/form/TimeSpinner" style="width:45%;" data-dojo-props="disabled:false, pattern: 'HH:mm', smallDelta: 60, largeDelta: 60" ></div>
				</div>
				<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenLaborItemId" id="hiddenLaborItemId"> </div>
				<div style="margin-top:10px; text-align:right">
					<span style="text-align:left">
						<button id="deleteItemButton" type="button"></button>
					</span>
					<span style="text-align:right">
						<button id="updateItemButton" type="button"></button>
						<button id="addItemButton" type="button"></button>
					</span>
				</div>
				<div id="calendarEntryTitlePaneStandBy" data-dojo-id="calendarEntryTitlePaneStandBy" 
						data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'calendarEntryTitlePane', color:'white'">
				</div>
			</div>
			
			<div id="laborPaneInfo" data-dojo-type="dijit/TitlePane"
							data-dojo-props="title:'Summary', style:'margin-top:10px;width:100%;vertical-align:top;font-size:100%', open:true">
				<div data-dojo-type="dijit/layout/ContentPane">
					<div id="laborPaneInfoContent"></div>
				</div>
			</div>
		</div>



		<div data-dojo-type="dijit/layout/ContentPane"
			data-dojo-props="splitter:false, doLayout:true, region:'center'"
			style="width: 85%; height: 100%">
			<!-- <div data-dojo-type="dijit/TitlePane"
				data-dojo-props="title:'Welcome Owner / Manager', style:'margin-top:0px;height:5%;width:100%;', open:false">
			</div> -->
			<div data-dojo-id="tabContainer" id="tabContainer" class="customTabClass"
				data-dojo-type="dijit/layout/TabContainer"
				data-dojo-props="tabPosition: 'top'"
				style="font-style: italic; width: 100%; height: 95%">
				<!-- <div id="manage" data-dojo-type="dijit/layout/ContentPane"
					title="Manage" data-dojo-props="selected:false"
					style="width: 99%; height: 99%"></div> -->
				<div id="storeInfo" data-dojo-type="dijit/layout/ContentPane"
					title="Store Info" data-dojo-props="selected:true"
					style="width: 100%; height: 100%">
					<!-- <div class="tab-heading">
						<div class="hold">
							<span>Store Information</span>
						</div>
					</div> -->
					<div data-dojo-type="dijit/TitlePane" id="storeInfoTitlePane"
							data-dojo-props="title:'Store Information', style:'margin-top:2px;width:100%;vertical-align:top;', open:true">
						<form data-dojo-type="dijit/form/Form" data-dojo-id="storeInfoForm" id="storeInfoForm">	
							<div data-dojo-type="dojox/layout/TableContainer" data-dojo-props="showLabels:true, orientation:'vert', spacing:2, cols:3, 
								customClass:'leaseInfo-labelsAndValues', style:'width:100%;'" id="storeInfoTable">
								<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Contact Info'" style="border: .1em solid #ddd; width: 100%">
									<table class="storeInfoTable">
										<tr>
											<td width="30%"><b>Address:</b></td>
											<td width="70%">
												<span id="store-info-mailing-address" data-dojo-type="dijit/InlineEditBox" 
													data-dojo-props="editor: dijit.form.Textarea, rows:2, cols:20, maxLength: 100" 
													widgetid="store-info-mailing-address" width="250px"></span>
											</td>
										</tr>
										<tr>
											<td width="30%"><b>Phone Numbers:</b></td>
											<td width="70%">
												<span id="store-info-phone-numbers" data-dojo-type="dijit/InlineEditBox" 
													data-dojo-props="editor: dijit.form.Textarea, rows:2, cols:20, maxLength: 100" 
													widgetid="store-info-phone-numbers" width="250px"></span>
											</td>
										</tr>
										<tr>
											<td width="30%"><b>Operating Hours:</b></td>
											<td width="70%">
												<span id="store-info-operating-hrs" data-dojo-type="dijit/InlineEditBox" 
												data-dojo-props="editor: dijit.form.Textarea, rows:2, cols:20, maxLength: 100" 
												widgetid="store-info-operating-hrs" width="250px"></span>
											</td>
										</tr>
									</table>
								</div>
								<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Property Manager Info'" style="border: .1em solid #ddd; width: 100%; font-size: 96%;">
									<div style="padding-top: 2px; padding-bottom: 2px;"><span id="store-info-property-mgr-info" data-dojo-type="dijit/InlineEditBox" 
										data-dojo-props="editor: dijit.form.Textarea, rows:2, cols:30, maxLength: 100" 
										widgetid="store-info-property-mgr-info" width="300px"></span></div>
								</div>
								<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Store Notes'" style="border: .1em solid #ddd; width: 100%; font-size: 96%;">
									<div style="padding-top: 2px; padding-bottom: 2px;"><span id="store-info-notes" data-dojo-type="dijit/InlineEditBox" 
										data-dojo-props="editor: dijit.form.Textarea" 
										widgetid="store-info-notes" width="300px"></span></div>
								</div>
								<div id="store-info-important-dates" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Important Dates'" style="border: .1em none #ddd; width: 100%; font-size: 96%;">
	  								<!--  <div id="store_info-add-date-link" style="text-align: right;"></div> -->
	  								<div id="store-info-important-dates-content-new" style="display: none;">
	  									<div style="padding-top: 1px; padding-bottom: 4px;">
	  										<input data-dojo-type="dijit/form/DateTextBox" type="text" name="impDateInput" id="impDateInput" style="width: 30%;"/>
	  										<input name="impDateNotes" id="impDateNotes" type="text" data-dojo-type="dijit/form/TextBox" style="width: 40%;"/>
	  										<a href="javascript: saveImpDate();">Save</a>&nbsp;&nbsp;<a href="javascript: hideImportantDate();">Hide</a>
	  									</div>
	  								</div>
	  								<div id="store-info-important-dates-content" align="left">
	  									<table id="storeInfoImpDatesTable" style="width: 80%; height: 100%;" class='storeInfoTable'>
	  										<tr><td width="30%"></td><td width="70%"></td></tr>
	  										<tr><td width="30%"></td><td width="70%"></td></tr>
	  										<tr><td width="30%"></td><td width="70%"></td></tr>
	  									</table>
	  									<button data-dojo-type="dijit/form/Button" type="submit" style="padding: 3px;">Save Changes</button>
	  								</div>
	  								<div id="storeInfoImpDatesStandBy" data-dojo-id="storeInfoImpDatesStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'store-info-important-dates', color:'white'">
									</div>
	  							</div>
								<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Lease/ Mortgage/ Loan Info'" style="border: .1em solid #ddd; width: 100%; font-size: 96%;">
									<div style="padding-top: 2px; padding-bottom: 2px;"><span id="store-mortgage-info" data-dojo-type="dijit/InlineEditBox" data-dojo-props="editor: dijit.form.Textarea" 
										widgetid="store-mortgage-info" width="300px"></span></div>
								</div>
	  							<div id="store-info-lease-documents" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Documents'" 
	  								style="border: .1em solid #ddd; width: 100%; font-size: 96%;">
	  								<div id="fileUploadWidgetsDiv" style="display: none;">
   										<span id="fileUploadWidgets"></span>
	  									<span id="fileUploadProgressMsgs"></span>
	  									<a href="javascript: hideFileUploadDialog('storeInfo');">Hide</a>
	  								</div>
   									<div id="store-info-lease-documents-content">
	  									<img align='top' src='resources/images/file-upload.png'/>
	  									<a href="javascript: showFileUploadDialog('storeInfo');">Upload Documents</a>
	  								</div>
	  								<div>
	  									<ul id="storeInfoUploadedDocument"></ul>
	  									<ol id="storeInfoUploadedDocumentsExisting"></ol>
	  								</div>
	  								<div id="storeInfoLeaseDocumentsStandBy" data-dojo-id="storeInfoLeaseDocumentsStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'store-info-lease-documents', color:'lightgrey'">
									</div>
	  							</div>
	  						</div>
	  						<script type="dojo/on" data-dojo-event="submit" data-dojo-args="evt">
								evt.preventDefault();
								evt.stopPropagation();
								var storeLayout = require("controls/StoreLayoutController");
								storeLayout.saveStoreInfoData();
								return false;
							</script>
						</form>
						<div id="storeInfoTitlePaneStandBy" data-dojo-id="storeInfoTitlePaneStandBy" 
							data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeInfoForm', color:'white'">
						</div>
					</div>
					
					<div id="storeInfoTabContainer" data-dojo-id="storeInfoTabContainer" data-dojo-type="dijit/layout/TabContainer" 
						data-dojo-props="tabPosition: 'top'" style="margin:2px;font-style: italic; width:100%;height:56%; vertical-align: bottom;">
						<div data-dojo-type="dijit/layout/ContentPane" id="storeMaintenance"
								data-dojo-props="title:'Maintenance', style:'margin-top:1px;height:99%;width:100%;', selected:false">
							<div id="storeMaintenanceGrid" align="center"
							style="height:99%;margin:2px; width:99%;"></div>
							<div id="storeMaintenanceGridStandBy" data-dojo-id="storeMaintenanceGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeMaintenanceGrid', color:'white'">
							</div>
						</div>
						<div data-dojo-type="dijit/layout/ContentPane" id="storeAlarms"
								data-dojo-props="title:'Alarm Codes', style:'margin-top:1px;height:99%;width:100%;'">
							<div id="storeAlarmCodesGrid" align="center"
							style="height:99%;margin:2px; width:99%;"></div>
							<div id="storeAlarmCodesGridStandBy" data-dojo-id="storeAlarmCodesGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeAlarmCodesGrid', color:'white'">
							</div>
						</div>
						<div data-dojo-type="dijit/layout/ContentPane" id="storeKeys"
								data-dojo-props="title:'Keys Information', style:'margin-top:1px;height:99%;width:100%;'">
							<div id="storeKeysGrid" align="center"
							style="height:99%;margin:2px; width:99%;"></div>
							<div id="storeKeysGridStandBy" data-dojo-id="storeKeysGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeKeysGrid', color:'white'">
							</div>
						</div>
						<div data-dojo-type="dijit/layout/ContentPane" id="storeLabor"
								data-dojo-props="title:'Labor Summary', style:'margin-top:1px;height:99%;width:100%;'">
							<div id="storeLaborGrid" align="center"
							style="height:99%;margin:2px; width:99%;"></div>
							<div id="storeLaborGridStandBy" data-dojo-id="storeLaborGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeLaborGrid', color:'white'">
							</div>
						</div>
					</div>
				</div>
				<div id="managerPane" data-dojo-type="dijit/layout/ContentPane" title="Manager" data-dojo-props="selected:false" style="width: 99%; height: 99%">
					<div id="managerDetails" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Manager Details'" style="width: 99%; height: 99%; border: .1em solid #ddd;" align="center">
						<div id="mgrYearlyDetailsRegion" data-dojo-type="dijit/layout/ContentPane" style="display: none; width: 99%; height: 99%; border: .1em solid #ddd;" align="center">
							<div id="mgrYearlyDetailsRegionContent" align="left">
								<span style="text-align: left;"><a href="javascript: returnToManagerPane();">&lt;&lt;&nbsp;&nbsp;Return</a></span>
								<div align="center" style="padding: 2px;">
									<table style="width: 99%; height: 99%;" class='dateTable' id="mgrYearlyReviewsQuarterTable">
										<tr>
											<th width="10%">Quarter #</th>
											<th width="45%">Notes</th>
											<th width="10%">Bonus</th>
											<th width="35%">End Year Payout</th>
										</tr>
									</table>
								</div>
							</div>
							<div id="mgrYearlyDetailsRegionStandBy" data-dojo-id="mgrYearlyDetailsRegionStandBy" 
									data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrYearlyDetailsRegion', color:'lightgrey'">
							</div>
						</div>
						<div id="managerDetailsPane" style="width: 99%; height: 30%; margin-top: 2px" align="center">
							<table style="width: 99%; height: 99%;" class='dateTable'>
								<tr style="width: 100%; height: 100%">
									<td style="width: 15%" align="center">
										<div id="mgrPhotoPane" style="width: 100%; height: 100%" align="center">
											<img id="managerPhoto" align='top' src='resources/images/no-photo.png' width="100%" height="170px"/>
											<div id="mgrPhotoPaneStandBy" data-dojo-id="mgrPhotoPaneStandBy" data-dojo-type="dojox/widget/Standby" 
												data-dojo-props="target:'mgrPhotoPane', color:'white'">
											</div>
										</div>
									</td>
									<td id="managerPersonalInfo" style="width: 35%" valign="top">
										<div align="center" style="font-weight: bold;font-style: inherit;"><u>Manager Details</u></div>
										<div id="mgrList"></div>
										<ul id="mgrPaneInfoUl" style="list-style: none;"></ul>
									</td>
									<td style="width: 25%" valign="top">
										<div align="center" style="font-weight: bold;font-style: inherit;">
											<u>Contract Documents</u>
											<div id="mgrContract" data-dojo-type="dijit/layout/ContentPane" style="margin-top: 2px;font-weight: normal;width: 100%" align="left">
												<div id="mgrContractWidgetsDiv" style="display: none;">
													<span id="mgrContractWidgets"></span>
												  	<span id="mgrContractWidgetsProgressMsgs"></span>
												  	<a href="javascript: hideFileUploadDialog('mgrContract');">Hide</a>
												</div>
											   	<div id="mgrContractUpload">
												  	<img align='top' src='resources/images/file-upload.png'/>
												  	<a href="javascript: showFileUploadDialog('mgrContract');">Upload Contract</a>
												</div>
												<div>
													<ul id="mgrContractUploaded"></ul>
												  	<ol id="mgrContractExisting"></ol>
												</div>
												<div id="mgrContractStandBy" data-dojo-id="mgrContractStandBy" 
													data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrContract', color:'lightgrey'">
												</div>
											</div>
										</div>
									</td>
									<td style="width: 25%" valign="top" id="mgrYearlyReviews">
										<div align="center" style="font-weight: bold;font-style: inherit;">
											<u>Yearly Reviews</u>
										</div>
										<div align="center" style="padding-top: 5px;">
											<table id="mgrYearlyReviewsTable" style="width: 40%; height: 100%;" class='storeInfoTable' align="center">
		  										<tr><td>No Data Available !!!</td></tr>
		  									</table>
										</div>
										<div id="mgrYearlyReviewsStandBy" data-dojo-id="mgrYearlyReviewsStandBy" 
													data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrYearlyReviews', color:'white'">
										</div>
									</td>
								</tr>
							</table>
						</div>
						<table style="width: 99%; height: 66%; margin-top: 1px;" class='dateTable' align="center">
							<tr style="width: 100%; height: 100%">
								<td style="width: 50%; height: 99%" align="center" valign="top">
									<div align="center" style="width: 99%; height: 98%; font-weight: bold;font-style: inherit; vertical-align: bottom;">
										<u>Personal / Sick Days</u> <span id="mgrAddLeavesIcon" style="display: none;">&nbsp; <img align='top' src='resources/images/add-icon.png' onclick='javascript: addManagerLeavesTabRecord(event);'/> &nbsp;</span>
										<div id="mgrLeavesGrid" align="center"
											style="height:70%; padding:2px; width:98%;">
										</div>
										<div align="center" id="mgrUnusedPersonalDaysDetailsDiv" style="display: none; height:20%; padding:2px; vertical-align: bottom;">
											<table style="width: 99%; height: 99%;" class='dateTable' id="mgrUnusedPersonalDaysDetailsTable">
											</table>
										</div>
										<div id="mgrLeavesGridStandBy" data-dojo-id="mgrLeavesGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrLeavesGrid', color:'white'">
										</div>
									</div>
								</td>
								<td style="width: 50%;height:100%" align="center" valign="top">
								<div data-dojo-type="dijit/form/Form" id="quarterlyReviewForm" data-dojo-id="quarterlyReviewForm" 
									encType="multipart/form-data" action="" method="">
									<div id="mgrReviewFormDiv" align="center" style="font-weight: normal; width: 100%; font-style: normal;">
										<u style="font-weight: bolder; font-style: italic;">Quarterly Reviews</u>
										<div style="padding-top: 5px; width: 100%" align="center">
											<table class="dataTable" style="width: 100%" align="center">
												<tr>
													<td style="width: 40%; text-align: left" class="noBorder" align="left">
														<span style="position: relative; padding-left: 1px; font-style: italic;">
															<input id="quartersList" style="text-align: center; font-style: italic;"/>
														</span>
													</td>
													<td style="width: 59%; padding: 2px; text-align: right;" align="right" class="noBorder">
														<label for="possibleBonus" style="font-style: italic; font-weight: bold; font-size: 90%">Possible Quarterly Bonus: </label>
														<input style="width: 90px;" type="text" name="possibleBonus" id="possibleBonus" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
															data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
													</td>
												</tr>
											</table>
										</div>
										<div style="padding: 2px; padding-top: 5px">
											<table style="width: 100%; height: 100%" class="dateTable">
												<tr>
													<th style="width: 33%;">Date</th>
													<th style="width: 34%;" class="noBorder"></th>
													<th style="width: 33%;">Bonus</th>
												</tr>
												<tr>
													<td style="width: 33%;">
														<input style="width: 100%;" type="text" name="bonusDate" id="bonusDate" value="now" data-dojo-type="dijit/form/DateTextBox" required="true"/>
													</td>
													<td style="width: 34%;" class="noBorder"></td>
													<td style="width: 33%;">
														<input style="width: 100%;" type="text" name="bonusAmt" id="bonusAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
															data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
													</td>
												</tr>
												<tr><td colspan="3" class="noBorder"></td></tr>
												<tr>
													<td colspan="3" style="background-color: #eee; text-align: center;font-weight: bold;" height="5px;">Notes</td>
												</tr>
												<tr>
													<td colspan="3" style="text-align: center;">
														<span id="quarterlyNotes" data-dojo-type="dijit/InlineEditBox" 
															data-dojo-props="editor: dijit.form.Textarea, rows:2, cols:20, maxLength: 100" 
															widgetid="quarterlyNotes" width="99%"></span>
													</td>
												</tr>
												<tr><td colspan="3" class="noBorder">
														<button id="reviewUpdateBtn" data-dojo-type="dijit/form/Button" disabled="disabled" type="submit" style="padding: 3px;" value="update">Update</button>
														<button id="reviewSaveBtn" data-dojo-type="dijit/form/Button" disabled="disabled" type="submit" style="padding: 3px;" value="save">Save</button>
												</td></tr>
											</table>
										</div>
									</div>
									<div id="mgrReviewStandBy" data-dojo-id="mgrReviewStandBy" 
												data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrReviewFormDiv', color:'white'">
									</div>
									<input type="hidden" name="hiddenReviewRecordId" id="hiddenReviewRecordId" value="0" />
									<script type="dojo/on" data-dojo-event="submit" data-dojo-args="evt">
										evt.preventDefault();
										evt.stopPropagation();
										var json = require('dojo/json');
										var registry = require('dijit/registry');
										var empLayout = require('controls/EmployeeLayoutController');
										var buttonValue = registry.byId('reviewSaveBtn').get('disabled') ? 'update' : 'save';
										if(this.validate() && (Number(registry.byId('quartersList').get('value')) > 0)){
											empLayout.updateMgrReview(this.getValues(), buttonValue);
										}
										return false;
									</script>
								</div>
								</td>
							</tr>
						</table>
						<div id="managerDetailsStandBy" data-dojo-id="managerDetailsStandBy" 
								data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'managerPersonalInfo', color:'white'">
						</div>
					</div>
				</div>
				<div id="employeePane" data-dojo-type="dijit/layout/ContentPane" title="Employees" data-dojo-props="selected:false" style="width: 100%; height: 100%">
					<div id="employeesGridContentPane" data-dojo-type="dijit/layout/ContentPane" style="margin:2px;width:99%;height:40%; vertical-align:top;">
						<div id="employeesGrid" align="center"
							style="margin:2px;width:99%;height:99%; vertical-align:top;">
						</div>
					</div>
					<div id="employeesGridStandBy" data-dojo-id="employeesGridStandBy" 
									data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeesGridContentPane', color:'white'">
					</div>
					<div id="employeeInfoTabContainer" data-dojo-id="employeeInfoTabContainer" data-dojo-type="dijit/layout/TabContainer" 
						data-dojo-props="tabPosition: 'top'" style="margin:2px;font-style: italic; width:100%;height:59%;vertical-align:bottom;">
						<div id="empSalaryDetails" data-dojo-type="dijit/layout/ContentPane"
								data-dojo-props="title:'Salary Particulars', style:'margin-top:1px;height:99%;width:100%;vertical-align:top;'">
							<div id="employeeSalaryDetailsGrid" align="center"
							style="height:98%;margin:2px; width:99%;"></div>
							<div id="employeeSalaryDetailsGridStandBy" data-dojo-id="employeeSalaryDetailsGridStandBy" 
									data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeSalaryDetailsGrid', color:'white'">
							</div>
						</div>
						<div id="empDisciplineDetails" data-dojo-type="dijit/layout/ContentPane"
								data-dojo-props="title:'Discipline Details', style:'margin-top:1px;height:100%;width:100%;'">
							<table style="width: 100%;height: 100%" class="bordered">
								<tr>
									<td>Disciplinary Details&nbsp;<img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeDisciplineTabRecord(event);'/>&nbsp;</td>
									<td>Doing Good Section&nbsp;<img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeDoingGoodTabRecord(event);'/>&nbsp;</td>
								</tr>
								<tr style="height: 100%">
									<td style="width: 50%;height: 100%">
										<div id="employeeDisciplineGrid" align="left"
											style="height:99%;margin:2px; width:100%;vertical-align:top;">
										</div>
										<div id="employeeDisciplineGridStandBy" data-dojo-id="employeeDisciplineGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeDisciplineGrid', color:'white'">
										</div>
									</td>
									<td style="width: 50%;height: 100%">
										<div id="employeeDoingGoodGrid" align="right"
											style="height:99%;margin:2px; width:100%;vertical-align:top;">
										</div>
										<div id="employeeDoingGoodGridStandBy" data-dojo-id="employeeDoingGoodGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeDoingGoodGrid', color:'white'">
										</div>
									</td>
								</tr>
							</table>
						</div>
						<div id="empLeavesDetails" data-dojo-type="dijit/layout/ContentPane"
								data-dojo-props="title:'Leaves Section', style:'margin-top:1px;height:99%;width:100%;'">
							<div id="employeeLeavesGrid" align="center"
								style="height:98%;margin:2px; width:99%;vertical-align:top;"></div>
							<div id="employeeLeavesGridStandBy" data-dojo-id="employeeLeavesGridStandBy" 
								data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeLeavesGrid', color:'white'">
							</div>
						</div>
						<div id="empLaborDetails" data-dojo-type="dijit/layout/ContentPane"
								data-dojo-props="title:'Labor Entry', style:'margin-top:1px;height:99%;width:100%;'">
							<div id="empLaborDetailsGrid" align="center"
								style="height:98%;margin:2px; width:99%;vertical-align:top;"></div>
							<div id="empLaborDetailsGridStandBy" data-dojo-id="empLaborDetailsGridStandBy" 
								data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'empLaborDetailsGrid', color:'white'">
							</div>
						</div>
					</div>
				</div>
				
				<div id="laborPane" data-dojo-type="dijit/layout/ContentPane" title="Current Schedule" data-dojo-props="selected: false, style:'width:99%; height:99%;'" style="font-size: 85%; font-style: normal;">
					<div id="labor-calendar" class="claro" data-dojo-type="dojox/calendar/Calendar" data-dojo-props="style: 'position:relative;width:100%;height:99%;'"></div>
					<!-- <div id="laborPaneStandBy" data-dojo-id="laborPaneStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'laborPane', color:'white'"></div> -->
				</div>
			</div>
		</div>
	</div>
</body>
</html>