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
		packages : [
					{name: "bootstrap", location: "/resources/themes/bootstrap", main: "main"},
					{name: "xstyle", location: "/resources/themes/xstyle"},
		            {name: "controls", location: "/resources/scripts/controls"}
		           ]
	};
	var INVENTORY_DISTRIBUTORS = [];
	var INVENTORY_ITEMS = {};
	var INVENTORY_DISTRIBUTORS_MAP = {};
	var laborPaneCalledFromStore = false;
	var globalYearWeekForRefresh = '';
</script>

<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/resources/dojo.css" />
<link rel="stylesheet" type="text/css" href="resources/themes/bootstrap/theme/dbootstrap/dijit.css"/> 
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/soria/soria.css">
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/resources/soriaGrid.css" />
<link rel="stylesheet" type="text/css" href="resources/themes/bootstrap/theme/dbootstrap/dbootstrap.css"/> 
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/enhanced/resources/claro/EnhancedGrid.css" />
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/nihilo/nihilo.css">
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/resources/nihiloGrid.css" />
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css"/>
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/form/resources/FileInput.css" />
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/layout/resources/ScrollPane.css" />
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/soria/Calendar.css" />
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/claro/claro.css">
<link rel="stylesheet"href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/claro/Calendar.css" />
<link rel="stylesheet"href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/claro/MonthColumnView.css" />
<link rel="stylesheet" href="resources/styles/styles.css" />
<link rel="stylesheet" href="resources/styles/overrides-bootstrap.css" />

<script data-dojo-config="has:{'dojo-firebug': true, 'dojo-debug-messages': true}, cacheBust: true, parseOnLoad:false, isDebug: true, locale: location.search.match(/locale=([\w\-]+)/) ? RegExp.$1 : 'en-us'" src="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/dojo.js"></script>
<script src="resources/scripts/custom-utils.js"></script>
<script src="resources/scripts/init.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript">google.load("visualization", "1", {packages:["corechart"]});</script>
</head>




<body class="dbootstrap">
	<div id="loadingOverlay" class="loadingPanel" align="center"><div align="left" style="background: #DBEB8F; padding: 2px">Loading...</div></div>

	<!-- Hidden Fields definition goes here -->
	<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenStoreId" id="hiddenStoreId"></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenInvoiceCategory" id="hiddenInvoiceCategory"></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenUploadedDocId" id="hiddenUploadedDocId"></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenSelectedYear" id="hiddenSelectedYear" value="2013"></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/DateTextBox" data-dojo-id="hiddenItemDate" id="hiddenItemDate" value="now"></div>
	<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenAccountingRecordId" id="hiddenAccountingRecordId" value="0"></div>
	
	<div class="dijitHidden">
		<!-- Login Dialog -->  
		<div class="soria" data-dojo-type="dijit/Dialog" data-dojo-props="title:'Sign In', loadingMessage:'Loading Login Form...'" draggable="true" data-dojo-id="loginDialog" id="loginDialog">
			<div class="dijitDialogPaneContentArea">
				<form data-dojo-type="dijit/form/Form" data-dojo-id="loginForm" id="loginForm">
					<table style="padding: 10px 0px 10px 0px;">
		                <tr>
							<td><img align="top" src="resources/images/login.png" height="60" width="60"/></td>
							<td>Login with your credentials to navigate further.</td>
						</tr>
						<tr id="loginTrId" style="display: none; padding-bottom: 10px; padding-top: 10px;">
							<td colspan="2" align="center"><span id="loginMessage"></span></td>
						</tr>
		                <tr>
		                    <td align="left"><label for="username">Username:</label></td>
		                    <td align="center"><input data-dojo-type="dijit/form/ValidationTextBox" id="j_username" name="j_username" 
		                    data-dojo-props="required: 'true', trim: 'true', ucfirst:'true', invalidMessage : 'Username is invalid', placeHolder:'(Assigned by Administrator)'"/></td>
		                </tr>
		                <tr>
		                    <td align="left"><label for="password">Password:</label></td>
		                    <td align="center"><input name="j_password" type="password" data-dojo-type="dijit/form/ValidationTextBox" id="j_password" data-dojo-props="required: 'true', trim: 'true', ucfirst:'true'"/></td>
		                </tr>
	            	</table>
					<div class="dijitDialogPaneActionBar">
						<button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'primary'" type="submit" id="loginButton">Login</button>
			            <button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'inverse', disabled:true" disabled>Cancel</button>
			        </div>
					<script type="dojo/on" data-dojo-event="submit" data-dojo-args="e">
						var registry = require("dijit/registry");
						registry.byId('loginButton').set('disabled', true);
            			e.preventDefault(); // prevent the default submit
						e.stopPropagation();
            			if(!loginForm.isValid()){ 
							displayMessage("loginTrId", "loginMessage", "Invalid Username and Password. Please check.. ", "dbootstrap warning dijitButtonNode");
							return; 
						};
						var ajaxRequest = require("dojo/request");
						var json = require('dojo/json');
						var domForm = require('dojo/dom-form');
						var promise = ajaxRequest.post('/service/j_spring_security_check', {data: domForm.toObject('loginForm'), sync: true});
						promise.response.then(function(response){
							var message = dojo.fromJson(response.data);
							if(message.success && (message.roles != 'ROLE_EMP')){
								displayMessage("loginTrId", "loginMessage", "Login to the Portal is successful.", "dbootstrap success dijitButtonNode");
								applySecurityRoles(message);
								var otherFx = require("dojo/fx");
								var dom = require("dojo/dom");
								var domStyle = require('dojo/dom-style');
								otherFx.wipeOut({node: dom.byId('loginDialog'),duration: 1000, delay: 250, onEnd: function(){
									registry.byId('loginDialog').hide();
								}}).play();
								modifyContentPaneTitles();
								modifyStoreDateLabel('store-info-important-dates');
								var storeLayout = require("controls/StoreLayoutController");
								var empLayout = require("controls/EmployeeLayoutController");
								var accLayout = require("controls/AccountingLayoutController");
								var invLayout = require("controls/InventoryLayoutController");
								storeLayout.postCreate();
								empLayout.postCreate();
								accLayout.postCreate();
								invLayout.postCreate();
							} else {
								registry.byId('loginButton').set('disabled', false);
								displayMessage("loginTrId", "loginMessage", "Invalid Username and Password. Please check.. ", "dbootstrap danger dijitButtonNode");
								return false; 
							}					
						});
        			</script>
				</form>
			</div>
		</div>
		<!-- End of Login Dialog -->
		
		
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




	<div data-dojo-type="dijit/layout/BorderContainer" class="application" data-dojo-props="design:'headline', gutters:true, liveSplitters: false" style="padding: 0px;">
		<div id="header" data-dojo-type="dijit/MenuBar" data-dojo-props="region:'top', 'class':'primary inverse'">
	        <span class='brand'>Greek Souvlaki Control Centre</span>
	        <div data-dojo-type="dijit/PopupMenuBarItem" id="adminPopupMenu">
	            <span>Administrator</span>
	            <div data-dojo-type="dijit/Menu">
	            	<!-- <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick: showAirportSection">Airport Section</div> -->
	                <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick: callManageUsers">View Managers</div>
	            </div>
	        </div>
	        <div data-dojo-type="dijit/PopupMenuBarItem" id="userOptionsPopupMenu" style="float: right;">
	            <span>Options</span>
	            <div data-dojo-type="dijit/Menu">
	                <div data-dojo-type="dijit/MenuItem" data-dojo-props="iconClass:'icon-lock icon-large', onClick: function(){changePasswordDialog.show();}">Change Password</div>
	                <div data-dojo-type="dijit/MenuItem" data-dojo-props="iconClass:'icon-signout icon-large', onClick: function(){ window.location.href='/service/logout'; }">Sign out</div>
	            </div>
	        </div>
	    </div>
		<div data-dojo-type="dijit/layout/ContentPane" style="width: 15%; top: 25px !important; overflow: visible;" data-dojo-props="splitter: true, region: 'leading'">
			<div class="bs-docs-sidebar" style="width: 100%;">
				<ul class="nav nav-list bs-docs-sidenav" id="locationTable">
					<li class="active" id="locationTabletr1">
						<a href="javascript: checkSelectedPane('locationTabletr1', 'rightAccordion', 1);"><i class="icon-chevron-right"></i> Downtown</a>
					</li>
					<li class="" id="locationTabletr2">
						<a href="javascript: checkSelectedPane('locationTabletr2', 'rightAccordion', 2);"><i class="icon-chevron-right"></i> West Valley</a>
					</li>
					<li class="" id="locationTabletr3">
						<a href="javascript: checkSelectedPane('locationTabletr3', 'rightAccordion', 3);"><i class="icon-chevron-right"></i> Murray</a>
					</li>
					<li class="" id="locationTabletr4">
						<a href="javascript: checkSelectedPane('locationTabletr4', 'rightAccordion', 4);"><i class="icon-chevron-right"></i> South Jordan</a>
					</li>
					<li class="" id="locationTabletr5">
						<a href="javascript: checkSelectedPane('locationTabletr5', 'rightAccordion', 5);"><i class="icon-chevron-right"></i> Airport</a>
					</li>
				</ul>
			</div>
			<div id="employeePaneInfo" data-dojo-props="title:'Photograph', open:true" data-dojo-type="dijit/TitlePane" style="display: none; width:100%; font-size:90%; height: 25%;">
				<div id="employeePaneInfoContent" align="center">
					<img id="employeeImg" align='top' src='resources/images/no-photo.jpg' width="150px;" height="150px;"/>
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
			<div id="messages" style="width: 100%; height: 5%;"></div>
			<div id="calendarEntryTitlePane" style="font-size: 90%; width: 100%;" data-dojo-type="dijit/TitlePane" data-dojo-props="title:'Labor Entry'" >
				<div><span class="propertyTitle">Employee:</span></div>
				<div id="itemSummaryEditor"></div>
				<div style="margin-top:10px"><span class="propertyTitle">Date:</span></div>
				<div>
					<div id="itemStartDateEditor"></div>
				</div>
				<div style="margin-top:10px"><span class="propertyTitle">Time:</span></div>
				<div>
					<div id="itemStartTimeEditor" data-dojo-attach-point="itemStartTimeEditor" data-dojo-type="dojox/form/TimeSpinner" style="font-size: 90%; width:45%;" data-dojo-props="disabled:false, pattern: 'HH:mm', smallDelta: 60, largeDelta: 60" ></div>
					<div id="itemEndTimeEditor" data-dojo-attach-point="itemEndTimeEditor" data-dojo-type="dojox/form/TimeSpinner" style="font-size: 90%; width:45%;" data-dojo-props="disabled:false, pattern: 'HH:mm', smallDelta: 60, largeDelta: 60" ></div>
				</div>
				<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenLaborItemId" id="hiddenLaborItemId"> </div>
				<div style="margin-top:10px; text-align:left;">
					<span style="text-align:left">
						<button id="deleteItemButton" type="button"></button>
					</span>
					<span style="text-align:right">
						<button id="updateItemButton" type="button"></button>
						<button id="addItemButton" type="button"></button>
					</span>
				</div>
				<div id="calendarEntryTitlePaneStandBy" data-dojo-id="calendarEntryTitlePaneStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'calendarEntryTitlePane', color:'white'"></div>
			</div>
			<div id="inventoryLegendTitlePane" style="font-size: 90% !important; width: 100%; display: none;" data-dojo-type="dijit/TitlePane" data-dojo-props="title:'Distributor Codes Reference', open:true" >
				<table class="laborTable" style="width: 100%; height: 100%; border: .1em solid #000; font-weight: bold !important;">
					<tr><th style="width: 50%;">Distributor</th><th style="width: 50%;">Code</th></tr>
					<tr><td style="width: 50%; padding-left: 3px !important;">NICHOLAS</td><td style="width: 50%; text-align: center !important;">1000</td></tr>
					<tr><td style="width: 50%; padding-left: 3px !important;">US FOODS</td><td style="width: 50%; text-align: center !important;">2000</td></tr>
					<tr><td style="width: 50%; padding-left: 3px !important;">SAMS CLUB</td><td style="width: 50%; text-align: center !important;">3000</td></tr>
					<tr><td style="width: 50%; padding-left: 3px !important;">GS KITCHEN</td><td style="width: 50%; text-align: center !important;">4000</td></tr>
					<tr><td style="width: 50%; padding-left: 3px !important;">Others</td><td style="width: 50%; text-align: center !important;">5000</td></tr>
				</table>
			</div>
		</div>



		<div data-dojo-id="tabContainer" id="tabContainer" data-dojo-type="dijit/layout/TabContainer" data-dojo-props="region:'center', tabStrip:true">
			<div id="managePane" data-dojo-type="dijit/layout/ContentPane" title="Manage" data-dojo-props="selected:false" style="width: 99%; height: 99%">
				<div id="manageUsersRegion" data-dojo-type="dijit/layout/ContentPane" style="width: 99%; height: 99%; border: .1em solid #ddd;" align="center">
					<div id="manageUsersRegionContent" align="left">
						<div align="center" style="padding: 2px;">
							<table style="width: 99%; height: 99%;" class='dateTable' id="manageUsersRegionTable">
								<tr>
									<th width="20%">User</th>
									<th width="20%">Downtown</th>
									<th width="20%">West Valley</th>
									<th width="20%">Murray</th>
									<th width="20%">South Jordan</th>
									<th width="20%">Airport</th>
								</tr>
							</table>
						</div>
					</div>
					<div id="manageUsersRegionStandBy" data-dojo-id="manageUsersRegionStandBy" 
							data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'manageUsersRegionContent', color:'lightgrey'">
					</div>
				</div>
			</div>
			<div id="storeInfo" data-dojo-type="dijit/layout/ContentPane" title="Store Info" data-dojo-props="selected:true" style="width: 99%; height: 99%">
				<div data-dojo-type="dijit/TitlePane" id="storeInfoTitlePane" data-dojo-props="title:'Store Information', style:'width:99%;', open: false">
					<form data-dojo-type="dijit/form/Form" data-dojo-id="storeInfoForm" id="storeInfoForm">	
						<div  id="storeInfoTable" data-dojo-type="dojox/layout/TableContainer" data-dojo-props="showLabels:true, orientation:'vert', spacing:1, cols:3, customClass:'leaseInfo-labelsAndValues', style:'width:100%;'">
							<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Contact Info'" style="border: .1em solid #ddd; width: 99%; padding: 0px 2px 0px 2px !important;">
								<table class="storeInfoTable">
									<tr>
										<td width="30%"><b>Address:</b></td>
										<td width="70%">
											<span id="store-info-mailing-address" data-dojo-type="dijit/InlineEditBox" 
												data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:20, maxLength: 100 }" 
												width="250px"></span>
										</td>
									</tr>
									<tr>
										<td width="30%"><b>Phone Numbers:</b></td>
										<td width="70%">
											<span id="store-info-phone-numbers" data-dojo-type="dijit/InlineEditBox" 
												data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:20, maxLength: 100 }" 
												width="250px"></span>
										</td>
									</tr>
									<tr>
										<td width="30%"><b>Operating Hours:</b></td>
										<td width="70%">
											<span id="store-info-operating-hrs" data-dojo-type="dijit/InlineEditBox" 
												data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:20, maxLength: 100 }" 
												width="250px"></span>
										</td>
									</tr>
								</table>
							</div>
							<div id="storeInfoPropertyPane" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Property Info'" style="border: .1em solid #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
								<div style="padding: 2px 0px 2px 0px;"><span id="store-info-property-mgr-info" data-dojo-type="dijit/InlineEditBox" 
									data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:90, maxLength: 100 }" 
									width="350px"></span></div>
							</div>
							<div id="storeInfoNotesPane" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Store Notes'" style="border: .1em solid #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
								<div style="padding: 2px 0px 2px 0px;"><span id="store-info-notes" data-dojo-type="dijit/InlineEditBox" 
									data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:90, maxLength: 100 }" 
									width="350px"></span></div>
							</div>
							<div id="store-info-important-dates" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Important Dates'" style="border: .1em none #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
	  							<!--  <div id="store_info-add-date-link" style="text-align: right;"></div> -->
	  							<div id="store-info-important-dates-content-new" style="display: none;">
	  								<div style="padding: 1px 0px 4px 0px;">
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
	  								<button data-dojo-type="dijit/form/Button" type="submit" data-dojo-props="'class':'primary'">Save Changes</button>
	  							</div>
	  							<div id="storeInfoImpDatesStandBy" data-dojo-id="storeInfoImpDatesStandBy" 
										data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'store-info-important-dates', color:'white'">
								</div>
	  						</div>
							<div id="storeInfoMortgagePane" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Lease/ Mortgage/ Loan Info'" style="border: .1em solid #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
								<div style="padding: 2px 0px 2px 0px;"><span id="store-mortgage-info" data-dojo-type="dijit/InlineEditBox" data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:90, maxLength: 100 }" 
									width="350px"></span></div>
							</div>
	  						<div id="store-info-lease-documents" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Documents'" 
	  							style="border: .1em solid #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
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
				<div id="storeInfoTabContainer" data-dojo-id="storeInfoTabContainer" data-dojo-type="dijit/layout/TabContainer" data-dojo-props="tabPosition: 'top'" style="width:99%;height:92%;">
					<div class="nihilo" data-dojo-type="dijit/layout/ContentPane" id="storeMaintenance" data-dojo-props="title:'Maintenance', style:'height:99%;width:99%;', selected:true">
						<div id="storeMaintenanceGrid" align="center" style="height:99%; width:99%;"></div>
						<div id="storeMaintenanceGridStandBy" data-dojo-id="storeMaintenanceGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeMaintenanceGrid', color:'white'">
						</div>
					</div>
					<div class="nihilo" data-dojo-type="dijit/layout/ContentPane" id="storeHealthInspection" data-dojo-props="title:'Health Inspection', style:'height:99%;width:99%;', selected:false">
						<div id="storeHealthInspectionGrid" align="center" style="height:99%; width:99%;"></div>
						<div id="storeHealthInspectionGridStandBy" data-dojo-id="storeHealthInspectionGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeHealthInspectionGrid', color:'white'"></div>
					</div>
					<div class="nihilo" data-dojo-type="dijit/layout/ContentPane" id="storeAlarms" data-dojo-props="title:'Alarm Codes', style:'height:99%;width:99%;'">
							<div id="storeAlarmCodesGrid" align="center"
							style="height:99%;margin:2px; width:99%;"></div>
							<div id="storeAlarmCodesGridStandBy" data-dojo-id="storeAlarmCodesGridStandBy" 
											data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeAlarmCodesGrid', color:'white'">
							</div>
						</div>
					<div class="nihilo" data-dojo-type="dijit/layout/ContentPane" id="storeKeys" data-dojo-props="title:'Keys Information', style:'height:99%;width:99%;'">
						<div id="storeKeysGrid" align="center" style="height:99%; width:99%;"></div>
						<div id="storeKeysGridStandBy" data-dojo-id="storeKeysGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeKeysGrid', color:'white'"></div>
					</div>
					<div class="nihilo" data-dojo-type="dijit/layout/ContentPane" id="storeLabor" data-dojo-props="title:'Labor Summary', style:'height:99%;width:99%;'">
						<div id="storeLaborGrid" align="center" style="height:99%; width:99%;"></div>
						<div id="storeLaborGridStandBy" data-dojo-id="storeLaborGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'storeLaborGrid', color:'white'"></div>
					</div>
				</div>
			</div>
			<div id="managerPane" data-dojo-type="dijit/layout/ContentPane" title="Manager" data-dojo-props="selected:false" style="width: 99%; height: 99%">
				<div id="mgrYearlyDetailsRegion" data-dojo-type="dijit/layout/ContentPane" style="display: none; width: 99%; height: 1%;" align="center">
					<div id="mgrYearlyDetailsRegionContent" align="left">
						<div style="text-align: left; display: inline-block;"><!-- 
							--><span style="text-align: left;">&nbsp;&nbsp;<i class="icon-chevron-left"></i><i class="icon-chevron-left"></i>&nbsp;&nbsp;<a href="javascript: returnToManagerPane();">Return</a></span></div><!-- 
						--><div style="text-align: left; display: inline-block; padding-left: 5px;"><button id="yearButton" data-dojo-type="dijit/form/Button" data-dojo-props="'class':'danger', disabled:true" disabled></button></div><!-- 
						 --><div style="text-align: right; display: inline-block; float: right; padding-right: 10px;"><a href="javascript: printManagerReview();">Print Review</a></div><!-- 
						  --><div align="center" style="display:block; padding: 2px;" id="printManagerReviewDiv">
							<table style="width: 99%;" class='dateTable' id="mgrYearlyReviewsQuarterTable">
								<tr><th width="10%">Quarter #</th><th width="45%">Notes</th><th width="10%">Bonus</th><th width="35%">End Year Payout</th></tr>
							</table>
						</div>
					</div>
					<hr class="spacer">
					<div id="mgrUnusedPersonalDaysDetailsDiv" align="center" style="display: none; height: 4%; vertical-align: bottom;">
						<table style="width: 99%;" class='dateTable' id="mgrUnusedPersonalDaysDetailsTable"></table>
					</div>
				</div>
				<div id="managerDetailsPane" style="display: block; width: 99%; height: 39%;" data-dojo-type="dijit/layout/ContentPane">
						<div style="width: 15%; height: 99%; padding: 0px 2px 0px 2px !important; display: inline-block; vertical-align: middle;"><!--  
						--><div id="mgrList" data-dojo-type="dijit/form/Select" style="display: block; width: 150px; height: 35px; vertical-align: top; padding-left: 10px;"></div><!--
						--><div id="mgrPhotoPane" style="display: block; width: 100%; height: 100%;"><div style="display: block; text-decoration: underline; font-weight: bold;">Photograph</div><img id="managerPhoto" align="top" width="150px" height="150px;"/></div><!-- 
					 --></div><!-- 
					 --><div id="managerPersonalInfo" style="width: 30%; height: 99%; display: inline-block; vertical-align: top; padding-left: 20px;"><!-- 
						 --><div style="display: block; text-decoration: underline; font-weight: bold;">Manager Details</div><ul id="mgrPaneInfoUl" style="vertical-align: top; list-style: none; height: 80%;"></ul><!-- 
					 --></div><!-- 
					 --><div style="width: 35%; height: 99%; padding: 0px 2px 0px 2px !important; display: inline-block; vertical-align: top;"><!--
						--><div style="display: block; text-decoration: underline; font-weight: bold; text-align: center;">Contract Documents</div><div id="mgrContract" style="display: block;"><div id="mgrContractWidgetsDiv" style="display: none; padding-left: 10px;"><!--
							--><span id="mgrContractWidgets"></span><span id="mgrContractWidgetsProgressMsgs"></span><a href="javascript: hideFileUploadDialog('mgrContract');">Hide</a><!--
						--></div><!--
						--><div id="mgrContractUpload" style="padding-left: 10px;"><!--
							--><img align='top' src='resources/images/file-upload.png'/><a href="javascript: showFileUploadDialog('mgrContract');">Upload Contract</a><!--
						--></div><!--
						--><div style="padding-left: 10px;"><!--
							--><ul id="mgrContractUploaded"></ul><!--
							--><ol id="mgrContractExisting"></ol><!--
						--></div></div><!--
					--></div><!--
					--><div id="mgrYearlyReviews" style="width: 10%; height: 99%; padding: 0px 2px 0px 2px !important; display: inline-block; vertical-align: top;" title="Yearly Reviews"><!--
						--><div style="display: block; text-decoration: underline; font-weight: bold; text-align: center;">Yearly</div><table id="mgrYearlyReviewsTable" class='storeInfoTable' align="center"></table><!--
					--></div><!--
				--></div>
				<!-- <hr class="spacer"> -->
				<div id="mgrDetailsTabContainer" data-dojo-id="mgrDetailsTabContainer" data-dojo-type="dijit/layout/TabContainer" data-dojo-props="tabPosition: 'top'" style="width:99%; height:59%;">
					<div id="mgrLeavesTab" data-dojo-type="dijit/layout/ContentPane" class="nihilo" data-dojo-props="title:'Personal/Sick Days', style:'height:99%;width:99%;', selected:true">
						<div id="mgrLeavesGrid" style="width: 99%; height: 98%;"></div>
					</div>
					<div id="addReviewTab" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Add/Edit Review', style:'height:99%;width:99%; overflow: auto;', selected:false">
						<div data-dojo-type="dijit/form/Form" id="quarterlyReviewForm" data-dojo-id="quarterlyReviewForm" encType="multipart/form-data">
							<div id="mgrReviewFormDiv" align="left" style="font-weight: normal; width: 50%; font-style: normal; padding-left: 5px;">
								<div style="padding-top: 5px; width: 100%" align="center">
									<table class="dateTable" style="width: 100%" align="center">
										<tr>
											<th style="width: 33%;">Choose Quarter</th>
											<th style="width: 34%;" class="noBorder"></th>
											<th style="width: 33%;">Possible Bonus</th>
										</tr>
										<tr>
											<td style="width: 33%;" class="noBorder">
												<div id="quartersList" style="width: 100%;"></div>
											</td>
											<td style="width: 34%;" class="noBorder"></td>
											<td style="width: 33%;">
												<input style="width: 100%;" type="text" name="possibleBonus" id="possibleBonus" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
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
													width="99%"></span>
											</td>
										</tr>
										<tr><td colspan="3" class="noBorder">
												<button id="reviewUpdateBtn" data-dojo-type="dijit/form/Button" disabled="disabled" type="submit" style="padding: 3px;" value="update">Update</button>
												<button id="reviewSaveBtn" data-dojo-type="dijit/form/Button" disabled="disabled" type="submit" style="padding: 3px;" value="save">Save</button>
										</td></tr>
									</table>
								</div>
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
					</div>
				</div>
				<div id="managerDetailsStandBy" data-dojo-id="managerDetailsStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'managerPersonalInfo', color:'white'"></div>
				<div id="mgrReviewStandBy" data-dojo-id="mgrReviewStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrReviewFormDiv', color:'white'"></div>
				<div id="mgrLeavesGridStandBy" data-dojo-id="mgrLeavesGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrLeavesGrid', color:'white'"></div>
				<div id="mgrPhotoPaneStandBy" data-dojo-id="mgrPhotoPaneStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrPhotoPane', color:'white'"></div>
				<div id="mgrYearlyDetailsRegionStandBy" data-dojo-id="mgrYearlyDetailsRegionStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrYearlyDetailsRegion', color:'lightgrey'"></div>
				<div id="mgrContractStandBy" data-dojo-id="mgrContractStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrContract', color:'lightgrey'"></div>
				<div id="mgrYearlyReviewsStandBy" data-dojo-id="mgrYearlyReviewsStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrYearlyReviews', color:'white'"></div>
			
			</div>
			<div id="employeePane" data-dojo-type="dijit/layout/ContentPane" title="Employees" data-dojo-props="selected:false" style="width: 99%; height: 99%">
				<div id="employeesGridContentPane" data-dojo-type="dijit/layout/ContentPane" class="nihilo" style="width:99%;height:49%; vertical-align:top;">
					<div id="employeesGrid" align="center" class="nihilo" style="margin:2px;width:99%;height:99%; vertical-align:top;"></div>
				</div>
				<div id="employeeInfoTabContainer" data-dojo-id="employeeInfoTabContainer" data-dojo-type="dijit/layout/TabContainer" data-dojo-props="tabPosition: 'top'" style="width:100%;height:49%;vertical-align:bottom;">
					<div id="empSalaryDetails" data-dojo-type="dijit/layout/ContentPane" class="nihilo" data-dojo-props="title:'Salary Particulars', style:'margin-top:1px;height:99%;width:100%;vertical-align:top;'">
						<div id="employeeSalaryDetailsGrid" class="nihilo" align="center" style="height:98%;margin:2px; width:99%;"></div>
					</div>
					<div id="empDisciplineDetails" data-dojo-type="dijit/layout/ContentPane" class="nihilo" data-dojo-props="title:'Performance', style:'margin-top:1px;height:100%;width:100%;'">
						<table style="width: 100%;height: 100%" class="bordered">
							<tr>
								<th>Performance Details&nbsp;<img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeDisciplineTabRecord(event);'/>&nbsp;</th>
								<th>Doing Good Section&nbsp;<img align='top' src='resources/images/add-icon.png' onclick='javascript: addEmployeeDoingGoodTabRecord(event);'/>&nbsp;</th>
							</tr>
							<tr style="height: 100%">
								<td style="width: 50%;height: 100%">
									<div id="employeeDisciplineGrid" class="nihilo" align="left" style="height:99%;margin:2px; width:100%;vertical-align:top;"></div>
								</td>
								<td style="width: 50%;height: 100%">
									<div id="employeeDoingGoodGrid" class="nihilo" align="right" style="height:99%;margin:2px; width:100%;vertical-align:top;"></div>
								</td>
							</tr>
						</table>
					</div>
					<div id="empLeavesDetails" data-dojo-type="dijit/layout/ContentPane" class="nihilo" data-dojo-props="title:'Missed Shifts', style:'margin-top:1px;height:99%;width:100%;'">
						<div id="employeeLeavesGrid" class="nihilo" align="center" style="height:98%;margin:2px; width:99%;vertical-align:top;"></div>
					</div>
					<div id="empDocumentDetails" data-dojo-type="dijit/layout/ContentPane" class="nihilo" data-dojo-props="title:'Documents', style:'margin-top:1px;height:99%;width:100%;'">
						<div id="empDocumentsGrid" class="nihilo" align="center" style="height:98%;margin:2px; width:99%;vertical-align:top;"></div>
					</div>
					<div id="empLaborDetails" data-dojo-type="dijit/layout/ContentPane" class="nihilo" data-dojo-props="title:'Labor Entry', style:'margin-top:1px;height:99%;width:100%;'">
						<div id="empLaborDetailsGrid" class="nihilo" align="center" style="height:98%;margin:2px; width:99%;vertical-align:top;"></div>
					</div>
				</div>
				<div id="employeesGridStandBy" data-dojo-id="employeesGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeesGridContentPane', color:'white'"></div>
				<div id="employeeSalaryDetailsGridStandBy" data-dojo-id="employeeSalaryDetailsGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeSalaryDetailsGrid', color:'white'"></div>
				<div id="employeeDisciplineGridStandBy" data-dojo-id="employeeDisciplineGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeDisciplineGrid', color:'white'"></div>
				<div id="employeeDoingGoodGridStandBy" data-dojo-id="employeeDoingGoodGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeDoingGoodGrid', color:'white'"></div>
				<div id="employeeLeavesGridStandBy" data-dojo-id="employeeLeavesGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeeLeavesGrid', color:'white'"></div>
				<div id="employeeDocumentsGridStandBy" data-dojo-id="employeeDocumentsGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'empDocumentsGrid', color:'white'"></div>
				<div id="empLaborDetailsGridStandBy" data-dojo-id="empLaborDetailsGridStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'empLaborDetailsGrid', color:'white'"></div>
			</div>
			<div id="laborPane" data-dojo-type="dijit/layout/ContentPane" title="Current Schedule" data-dojo-props="selected: false, style:'width:100%; height:100%;'">
				<table style="width: 100%; height: 100%;">
					<tr style="width: 100%; height: 100%;">
						<td style="width: 85%; height: 100%;">
							<div data-dojo-type="dijit/layout/ContentPane" style="width:99%; height:99%; font-size: inherit;" class="claro">
								<div id="labor-calendar" class="claro" data-dojo-type="dojox/calendar/Calendar" data-dojo-props="style: 'position:relative; width:100%; height:100%;'" style="font-size: inherit;"></div>
							</div>
						</td>
						<td style="width: 15%; height: 100%;" valign="top">
							<div id="laborPaneInfo" data-dojo-type="dijit/layout/ContentPane" style="margin-top: 5px; width:99%; height:98%; font-size: inherit;">
								<div id="laborPaneInfoContent"></div>
							</div>
						</td>
					</tr>
				</table>
				
			</div>
			<div id="accountingPane" data-dojo-type="dijit/layout/ContentPane" title="Accounting" data-dojo-props="selected:false" style="width: 99%; height: 99%">
				<div data-dojo-type="dijit/layout/ContentPane" style="width: 99%; height: 60%;" align="center">
					<table style="width: 100%; height: 99%;" class="dateTable">
						<tr style="width: 100%; height: 99%;" valign="top">
							<td style="width: 56%; height: 99%;" align="center" valign="top">
								<div id="accountingDetailsPane" style="width: 99%; vertical-align: top; height: 99%;" align="center">
									<form data-dojo-type="dijit/form/Form" data-dojo-id="accountingEntriesForm" id="accountingEntriesForm">
									<table style="width: 100%; height: 100%; vertical-align: top;" id="accountsQuarterDetails">
										<tr valign="top">
											<td style="width: 50%; vertical-align: top;" valign="top" class="noBorder">
												<table style="width: 100%; height: 50%; vertical-align: top;" class="accountingTable">
													<tr style="height: 10%;" valign="top"><td colspan="3" align="left"><b><u>Select Month</u></b>:&nbsp;&nbsp;&nbsp;<span id="accountingQuartersList"></span></td></tr>
													<tr style="height: 5%;" valign="top">
														<th style="width: 35%;">Distribution</th>
														<th style="width: 40%;">Amount</th>
														<th style="width: 25%;">%</th>
													</tr>
													<tr style="height: 5%;" valign="top">
														<td style="width: 35%;">Labor</td>
														<td style="width: 40%;" align="center">
															<input style="width: 90%;" type="text" name="accountingLbrAmt" id="accountingLbrAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
														<td style="width: 25%; text-align: center;" id="accountingLbrAmtPercent"></td>
													</tr>
													<tr style="height: 5%;" valign="top">
														<td style="width: 35%;">Food Cost</td>
														<td style="width: 40%;" align="center">
															<input style="width: 90%;" type="text" name="accountingFdAmt" id="accountingFdAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
														<td style="width: 25%; text-align: center;" id="accountingFdAmtPercent"></td>
													</tr>
													<tr style="height: 5%;" valign="top">
														<td style="width: 35%;">Advertisement</td>
														<td style="width: 40%;" align="center">
															<input style="width: 90%;" type="text" name="accountingAdvtAmt" id="accountingAdvtAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
														<td style="width: 25%; text-align: center;" id="accountingAdvtAmtPercent"></td>
													</tr>
													<tr style="height: 5%;" valign="top">
														<td style="width: 35%;">Misc.</td>
														<td style="width: 40%;" align="center">
															<input style="width: 90%;" type="text" name="accountingMiscAmt" id="accountingMiscAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
														<td style="width: 25%; text-align: center;" id="accountingMiscAmtPercent"></td>
													</tr>
													<tr style="height: 5%;" valign="top">
														<td style="width: 35%;">Profit</td>
														<td style="width: 40%;" align="center">
															<input style="width: 90%;" type="text" name="accountingProfitAmt" id="accountingProfitAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
														<td style="width: 25%; text-align: center;" id="accountingProfitAmtPercent"></td>
													</tr>
													<tr style="height: 5%;" valign="top">
														<td class="noBorder" colspan="3">
															<button id="accountingUpdateBtn" data-dojo-type="dijit/form/Button" data-dojo-props="'class':'primary', disabled:true" disabled="disabled" type="submit" style="padding: 3px;" value="update">Update</button>
															<button id="accountingSaveBtn" data-dojo-type="dijit/form/Button" data-dojo-props="'class':'primary', disabled:true" disabled="disabled" type="submit" style="padding: 3px;" value="save">Save</button>
														</td>
													</tr>
												</table>
											</td>
											<td style="width: 50%; vertical-align: top;" valign="top" class="noBorder">
												<table style="width: 100%; height: 20%; vertical-align: top;" class="accountingTable">
													<!-- New Fields -->
													<tr valign="top">
														<td style="width: 40%;">Total Sales</td>
														<td style="width: 40%;" align="center">
															<input style="width: 95%;" type="text" name="accountingTotalSales" id="accountingTotalSales" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
													</tr>
													<tr valign="top">
														<td style="width: 40%;">Total Operating Expenses</td>
														<td style="width: 40%;" align="center">
															<input style="width: 95%;" type="text" name="accountingTotalOpExp" id="accountingTotalOpExp" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
													</tr>
													<tr valign="top">
														<td style="width: 40%;">Total Profits</td>
														<td style="width: 40%;" align="center">
															<input style="width: 95%;" type="text" name="accountingTotalProfits" id="accountingTotalProfits" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
														</td>
													</tr>
													<tr valign="top">
														<td style="width: 100%;" align="left" colspan="2"><div id="accMonthlyDocument" style="display: block;"><div id="accMonthlyDocumentWidgetsDiv" style="display: none; padding-left: 10px;"><!--
															--><span id="accMonthlyDocumentWidgets"></span><span id="accMonthlyDocumentWidgetsProgressMsgs"></span><a href="javascript: hideFileUploadDialog('accMonthlyDocument');">Hide</a><!--
															--></div><!--
															--><div id="accMonthlyDocumentUpload" style="padding-left: 10px;"><!--
																--><img align='top' src='resources/images/file-upload.png'/><a href="javascript: showFileUploadDialog('accMonthlyDocument');">Add Document</a><!--
															--></div><!--
															--><div style="padding-left: 10px;"><!--
																--><ul id="accMonthlyDocumentUploaded"></ul><!--
																--><ol id="accMonthlyDocumentExisting"></ol><!--
															--></div></div>
															<div id="accMonthlyDocumentStandBy" data-dojo-id="accMonthlyDocumentStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accMonthlyDocument', color:'lightgrey'"></div>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
									<script type="dojo/on" data-dojo-event="submit" data-dojo-args="evt">
										evt.preventDefault();
										evt.stopPropagation();
										var json = require('dojo/json');
										var registry = require('dijit/registry');
										var accLayout = require('controls/AccountingLayoutController');
										var buttonValue = registry.byId('accountingUpdateBtn').get('disabled') ? 'save' : 'update';
										if(this.validate() && (Number(registry.byId('accountingQuartersList').get('value')) > 0)){
											accLayout.updateAccountingData(this.getValues(), buttonValue);
										}
										return false;
									</script>
									</form>
									<table style="width: 100%; height: 99%; display: none; vertical-align: top;" id="accountsYearlyDetails">
										<tr valign="top">
											<td colspan="5"><!-- 
											--><div style="text-align: left; display: inline-block;"><!-- 
												--><span style="text-align: left;">&nbsp;&nbsp;<i class="icon-chevron-left"></i><i class="icon-chevron-left"></i>&nbsp;&nbsp;<a href="javascript: returnToAccountsPane();">Return</a></span></div><!-- 
											--><div style="text-align: center; display: inline-block; padding-left: 10px; float: right;" align="center"><b>End of Year Statement</b></div><!-- 
										--></td>
										</tr>
										<tr valign="top">
											<td style="width: 15%" class="noBorder">
												<table class="accountingTable" style="width: 100%; height: 100%;">
													<tr><th>Total Sales</th></tr>
													<tr><td id="totalYearlySalesAmt"></td></tr>
												</table>
											</td>
											<td style="width: 8%" class="noBorder">&nbsp;</td>
											<td style="width: 41%" class="noBorder">
												<table class="accountingTable" style="width: 100%; height: 100%;">
													<tr><th width="90%">Total Operating Expenses</th><th width="10%">%</th></tr>
													<tr><td id="totalOperatingExpensesAmt" width="90%"></td><td id="totalOperatingExpensesPercent" width="10%"></td></tr>
												</table>
											</td>
											<td style="width: 6%" class="noBorder">&nbsp;</td>
											<td style="width: 30%" class="noBorder">
												<table class="accountingTable" style="width: 100%; height: 100%;">
													<tr><th>Total Profits</th><th>%</th></tr>
													<tr><td id="totalProfitsAmt"></td><td id="totalProfitsPercent"></td></tr>
												</table>
											</td>
										</tr>
										<tr><td colspan="5" style="width: 100%; height: 100%; padding: 10px 2px 10px 2px;">
											<table style="width: 100%; height: 100%;" class="accountingTable">
												<tr><th style="width: 16%"></th><th style="width: 16%">Quarter 1</th><th style="width: 16%">Quarter 2</th><th style="width: 16%">Quarter 3</th><th style="width: 16%">Quarter 4</th><th style="width: 20%">End of Year</th></tr>
												<tbody id="yearlyAccountingDetailsTable"></tbody>
											</table></td>
										</tr>
									</table>
								</div>
							</td>
							<td style="width: 34%; height: 100%;" align="center" valign="top">
								<div id="accountingChartDiv" style="width: 100%; height: 90%;"></div>
							</td>
							<td style="text-align: center; width: 10%; height: 100%;" align="center" valign="top" id="accountingYearsTd">
								<font style="text-align: center; font-weight: bold;"><u>End of Year</u></font>
								<div align="center" style="padding-top: 5px;">
									<table id="accountingYearlyTable" style="width: 40%; text-align: center;" class='storeInfoTable' align="center">
			  							<tr><td>No Data Available !!!</td></tr>
			  						</table>
			  					</div>
							</td>
						</tr>
					</table>
				</div>
				<div data-dojo-type="dijit/layout/ContentPane" style="width: 99%; height: 38%;" align="center">
					<div id="accountingMonthlyChartDiv" style="width: 99%; height: 99%;"></div>
				</div>
				<div id="accountsYearlyDetailsStandBy" data-dojo-id="accountsYearlyDetailsStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accountsYearlyDetails', color:'white'"></div>
				<div id="accountingYearsStandBy" data-dojo-id="accountingYearsStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accountingYearsTd', color:'white'"></div>
				<div id="accountsQuarterDetailsStandBy" data-dojo-id="accountsQuarterDetailsStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accountsQuarterDetails', color:'white'"></div>
			</div>
			<div id="inventoryPane" data-dojo-type="dijit/layout/ContentPane" title="Inventory" data-dojo-props="selected:false" style="width: 99%; height: 99%;">
				<table style="width: 99%; height: 99%;" id="inventoryPaneTable">
					<tr valign="middle" style="width: 100%; height: 8%;">
						<td style="text-align: left; border: .1em solid #ddd; padding: 2px 0px 2px 0px;" colspan="2"><!--
							 --><div style="display: inline-block;">&nbsp;&nbsp;<font style="font-weight: normal; text-decoration: underline;">Select Category</font></div>:&nbsp;&nbsp;<!--   
							--><div id="invoiceCategorySelect" name="invoiceCategorySelect" data-dojo-type="dijit/form/Select" style="text-align: center; display: inline-block;"><!-- 
							     --><span value="Distributor" selected="selected"><b>Distributor</b></span><!-- 
							     --><span value="GS Kitchen"><b>GS Kitchen</b></span><!--
							 --></div><!--
							 --><div style="display: inline-block;">&nbsp;&nbsp;&nbsp;&nbsp;<font style="font-weight: normal; text-decoration: underline;">Choose Action</font></div>:&nbsp;&nbsp;<!--
							--><div id="invoiceActionSelect" name="invoiceActionSelect" data-dojo-type="dijit/form/Select" style="text-align: center; display: inline-block;"><!--
								--><span value="reset" selected="selected" style="font-style: italic;"><i><b>--Select Action--</b></i></span><!--
							    --><span value="checkStock"><b>Master Inventory</b></span><!-- 
							    --><!-- <span value="updateStock"><b>Add/Update Item In Stock</b></span> --><!--
							    --><span value="addInventoryItem"><b>Add Item to Inventory</b></span><!--
							 --></div><!--
							--><div align="right" style="float: right; vertical-align: baseline;"><!-- <u>Categories</u>:&nbsp;&nbsp; --><div style="display: inline-block;"><font style="color: whitesmoke; background-color: #2E2EFE; border: 1px solid black;">&nbsp;FREEZER&nbsp;</font></div>&nbsp;&nbsp;<!-- 
							--><div style="display: inline-block;"><font style="color: whitesmoke; background-color: #8904B1; border: 1px solid black;">&nbsp;FRIDGE&nbsp;</font></div>&nbsp;&nbsp;<!-- 
							--><div style="display: inline-block;"><font style="color: whitesmoke; background-color: #B40431; border: 1px solid black;">&nbsp;DRY GOODS&nbsp;</font></div>&nbsp;&nbsp;<!-- 
							--><div style="display: inline-block;"><font style="color: whitesmoke; background-color: #21610B; border: 1px solid black;">&nbsp;PAPER/CLEANING&nbsp;</font></div>&nbsp;&nbsp;<!-- 
							--></div>
						</td>
					</tr>
					<tr valign="middle" style="width: 100%; height: 5%;">
						<td style="text-align: center;"><!--
							  --><div style="text-decoration:underline; display: inline-block; color: orange; font-weight: bolder; font-size: 100%;" id="inventoryTabTitle">Inventories</div>&nbsp;&nbsp;<!-- 
							 --><div style="display: inline-block; color: orange; font-weight: bolder; font-size: 100%;" id="inventoryTabTitleCategory">(Distributor)</div><!--
						 --></td>
						<td style="text-align: center;"><!--
							  --><div style="text-decoration:underline; display: inline-block; color: orange; font-weight: bolder; font-size: 100%;" id="inventoryTabTitle1">Stock</div>&nbsp;&nbsp;<!-- 
							 --><div style="display: inline-block; color: orange; font-weight: bolder; font-size: 100%;" id="inventoryTabTitleCategory1">(Distributor)</div><!--
							 --><div style="display: inline-block; float: right" id="createInvoiceLink"><!--
								 --><a href='javascript:createInvoice();'><span id="createTitle">Create Invoice</span></a>&nbsp;&nbsp;</div><!--
								 --><div style="display: inline-block; float: right"><a href="javascript: printInvoice('inventoryInvoiceDetailsGrid', 'inventoryTabTitleCategory');"><span id="printTitle">Print Invoice</span></a>&nbsp;&nbsp;<!-- 
							 --></div><!-- 
						 --></td>
					</tr>
					<tr valign="top" style="width: 100%; height: 87%;">
						<td align="left" style="height: 95%; width: 32%; border: .1em solid #ddd;">
							<div id="inventoryInvoicesGrid" align="center" class="nihilo"
								style="height: 100%; margin: 2px; width: 100%;">
							</div>
							<div id="inventoryInvoicesGridStandBy" data-dojo-id="inventoryInvoicesGridStandBy" data-dojo-type="dojox/widget/Standby" 
									data-dojo-props="target:'inventoryInvoicesGrid', color:'white'">
							</div>
						</td>
						<td align="left" style="height: 95%; width: 67%; border: .1em solid #ddd;">
							<div id="inventoryInvoiceDetailsGrid" align="center"
								style="height: 99%; margin: 2px; width: 99%;">
							</div>
							<div id="inventoryInvoiceDetailsGridStandBy" data-dojo-id="inventoryInvoiceDetailsGridStandBy" data-dojo-type="dojox/widget/Standby" 
								data-dojo-props="target:'inventoryInvoiceDetailsGrid', color:'white'">
							</div>
						</td>
					</tr>
				</table>
				<div id="inventoryPaneStandBy" data-dojo-id="inventoryPaneStandBy" data-dojo-type="dojox/widget/Standby" 
					data-dojo-props="target:'inventoryPane', color:'white'">
				</div>
			</div>
			<div id="templatesPane" data-dojo-type="dijit/layout/ContentPane" title="Templates" data-dojo-props="selected:false" style="width: 99%; height: 99%">
				<div id="templatesGridContentPane" data-dojo-type="dijit/layout/ContentPane" class="nihilo" style="width:99%;height:99%; vertical-align:top;">
					<div id="templatesGrid" align="center" class="nihilo" style="margin:2px;width:99%;height:99%; vertical-align:top;"></div>
				</div>
				<div id="templatesPaneStandBy" data-dojo-id="templatesPaneStandBy" data-dojo-type="dojox/widget/Standby" 
					data-dojo-props="target:'templatesPane', color:'white'">
				</div>
			</div>
		</div>
	</div>

<!-- Dialogs are defined here !!! -->

<!-- Inventory Dialog Starts here  -->
<div class="dijitHidden">
	<div data-dojo-type="dijit/Dialog"
		data-dojo-props="title:'Add/ Update Stock Item', loadingMessage:'Loading ...', style: 'font-size: 100%;'"
		draggable="true" data-dojo-id="inventoryItemDialog"
		id="inventoryItemDialog">
			<form data-dojo-type="dijit/form/Form"
				data-dojo-id="inventoryItemDialogForm" id="inventoryItemDialogForm">
				<table style="vertical-align: middle; width: 100%; height: 100% ">
					<tr>
						<td colspan="2" align="right">
							<div id="inventoryItemDialogFormErrorMsgs"></div>
						</td>
					</tr>
					<tr>
						<td align="left" valign="middle"><u>Stock Item:</u></td>
						<td align="left" valign="middle">
							<div id="inventoryStockItem" data-dojo-type="dijit/form/Select" name="inventoryStockItem" style="width: 200px;"></div>
						</td>
					</tr>
					<tr>
						<td align="left" valign="middle"><u>Par (Units):</u></td>
						<td align="left" valign="middle">
							<div data-dojo-type="dijit/form/NumberTextBox"
							data-dojo-props="style: 'float: left; width: 30px;', readOnly: true, required: 'true', trim: 'true', invalidMessage : 'Item is Invalid', value: 0"
							id="inventoryStockPar" name="inventoryStockPar">
							</div>&nbsp;
							<input data-dojo-type="dijit/form/TextBox"
								data-dojo-props="style: 'width: 60px;', disabled: 'true', readOnly: 'true', trim: 'true'"
								id="inventoryStockParUnits" name="inventoryStockParUnits"/>&nbsp;
							<input data-dojo-type="dijit/form/TextBox" type="hidden"
								data-dojo-props="style: 'width: 30px;', readOnly: 'true', trim: 'true'"
								id="inventoryStockParCategory" name="inventoryStockParCategory"/>
							<input data-dojo-type="dijit/form/TextBox" type="hidden"
								data-dojo-props="style: 'width: 30px;', readOnly: 'true', trim: 'true'"
								id="inventoryInvoiceItemId" name="inventoryInvoiceItemId"/>	
						</td>
					</tr>
									
					<tr>
						<td align="left" valign="middle"><u>In Stock:</u></td>
						<td align="left" valign="middle"><input data-dojo-type="dijit/form/NumberTextBox"
							data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
							id="inventoryStockInStock" name="inventoryStockInStock"/></td>
					</tr>
									
					<tr>
						<td align="left" valign="middle"><u>To Order:</u></td>
						<td align="left" valign="middle"><input data-dojo-type="dijit/form/NumberTextBox"
							data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
							id="inventoryStockToOrder" name="inventoryStockToOrder"/></td>
					</tr>
								
					<tr id="invoiceItemPPURow">
						<td align="left" valign="middle"><u>Price Per Unit:</u></td>
						<td align="left" valign="middle"><input data-dojo-type="dijit/form/CurrencyTextBox"
							data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid', value: 0"
							id="inventoryStockPPU" name="inventoryStockPPU"/></td>
					</tr>
									
					<tr id="invoiceItemGSChargeRow">
						<td align="left" valign="middle"><u>GS Charge %:</u></td>
						<td align="left" valign="middle"><input data-dojo-type="dijit/form/CurrencyTextBox"
							data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid', value: 0"
							id="inventoryStockGSCharge" name="inventoryStockGSCharge"/></td>
					</tr>
									
					<tr>
						<td colspan="2" align="right">
							<button style="float: right;" data-dojo-type="dijit/form/Button" value="Close"
								id="inventoryStockCloseButton">Close
								<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
									inventoryItemDialog.hide();
								</script>
							</button>
							<button style="float: right;" data-dojo-type="dijit/form/Button" type="submit" value="Update"
								id="inventoryStockSubmitButton">Add/Update</button>
						</td>
					</tr>
				</table>
					<script type="dojo/on" data-dojo-event="submit" data-dojo-args="e">
						e.preventDefault(); // prevent the default submit
						e.stopPropagation();
						var inventoryLayout = require("controls/InventoryLayoutController");
						if(inventoryItemDialogForm.validate()){
							inventoryLayout.addItemToDB();
						}
					</script>
			</form>
			<div id="inventoryItemDialogFormStandBy" data-dojo-id="inventoryItemDialogFormStandBy" data-dojo-type="dojox/widget/Standby" 
					data-dojo-props="target:'inventoryItemDialogForm', color:'white'">
			</div>
	</div>
	<div data-dojo-type="dijit/Dialog"
		data-dojo-props="title:'Select Items for Invoice', loadingMessage:'Loading ...', style: 'font-size: 100%;'"
		draggable="true" data-dojo-id="invoiceItemsDialog" id="invoiceItemsDialog" style="position: absolute; top: 80px; height: 400px; width: 600px;">
		<div id="invoiceItemsGrid" align="center"
			style="height: 300px; margin: 2px; width: 540px;">
		</div>
		<div style="position: absolute; bottom: 10px; right: 30px;">
			<button data-dojo-type="dijit/form/Button" type="button" value="Confirm"
				id="invoiceItemsConfirmButton">Confirm and Submit Invoice
				<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
						e.preventDefault(); // prevent the default submit
						e.stopPropagation();
						var inventoryLayout = require("controls/InventoryLayoutController");
				</script>
			</button>
			<button data-dojo-type="dijit/form/Button" type="button" value="Back"
				id="invoiceItemsBackButton">Back
				<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
						e.preventDefault(); // prevent the default submit
						e.stopPropagation();
						invoiceItemsDialog.hide();
				</script>
			</button>
		</div>
		<div id="invoiceItemsGridStandBy" data-dojo-id="invoiceItemsGridStandBy" data-dojo-type="dojox/widget/Standby" 
			data-dojo-props="target:'invoiceItemsGrid', color:'white'">
		</div>
	</div>
</div>

<!-- Inventory Dialog Ends here -->

<!-- Health Inspection Dialog Starts here -->
<div class="dijitHidden">
	<div data-dojo-type="dijit/Dialog" data-dojo-props="title:'Health Inspection Details'" draggable="true" data-dojo-id="healthInspectionDialog" id="healthInspectionDialog">
		<fieldset style="border:1px dotted ThreeDDarkShadow;">
			<legend style="display: block; background: none; margin-left: 10px; padding: 0px 3px 0px 3px; border:1px dotted ThreeDDarkShadow; text-align: left; font-size:90%;"><b>Add/Modify Details:</b></legend>
			<form data-dojo-type="dijit/form/Form" data-dojo-id="healthInspectionForm" id="healthInspectionForm">
				<table class="addRecordTable" style="width: 98%; height: 90%; padding: 10px;">
					<tr>
						<td width="25%"><b>Date:</b></td>
						<td width="75%">
							<input required="true" data-dojo-type="dijit/form/DateTextBox" type="text" name="healthInspectionDate" id="healthInspectionDate" style="width: 150px;"/>
						</td>
					</tr>
					<tr>
						<td width="25%"><b>Document:</b></td>
						<td width="75%">
							<div id="healthInspection" data-dojo-type="dijit/layout/ContentPane" style="margin-top: 2px;font-weight: normal;width: 100%" align="left">
								<div id="healthInspectionWidgetsDiv" style="display: none;">
									<span id="healthInspectionWidgets"></span>
									<span id="healthInspectionWidgetsProgressMsgs"></span>
									<a href="javascript: hideFileUploadDialog('healthInspection');">Hide</a>
								</div>
								<div id="healthInspectionUpload">
								  	<img align='top' src='resources/images/file-upload.png'/>
								  	<a href="javascript: showFileUploadDialog('healthInspection');">Upload Document</a>
								</div>
								<div>
									<ul id="healthInspectionUploaded"></ul>
								  	<ol id="healthInspectionExisting"></ol>
								</div>
								<div id="healthInspectionStandBy" data-dojo-id="healthInspectionStandBy" 
									data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'healthInspection', color:'lightgrey'">
								</div>
							</div>						
						</td>
					</tr>
					<tr>
						<td width="25%"><b>Notes:</b></td>
						<td width="75%">
							<textarea id="healthInspectionNotes" name="healthInspectionNotes" data-dojo-type="dijit/form/SimpleTextarea" maxLength='100' rows="4" cols="25"></textarea>
						</td>
					</tr>
					<tr>
						<td width="25%">&nbsp;<div class="dijitHidden" data-dojo-type="dijit/form/TextBox" data-dojo-id="hiddenHealthId" id="hiddenHealthId"></div></td>
						<td width="75%" style="text-align: right;">
							<button data-dojo-type="dijit/form/Button" type="button">Save
								<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
									e.preventDefault();
									e.stopPropagation();
									console.log('Form Validation ', healthInspectionForm.validate(), healthInspectionForm.get('value'));
									var registry = require('dijit/registry');
									var storeLayout = require('controls/StoreLayoutController');
									var empLayout = require('controls/EmployeeLayoutController');
									if(healthInspectionForm.validate()){
										var formValues = healthInspectionForm.get('value');
										var uploadNotesWrapper = {};
										uploadNotesWrapper['purposeDate'] = formValues['healthInspectionDate'];
										uploadNotesWrapper['purposeNotes'] = formValues['healthInspectionNotes'];
										if(formValues['uploadedFile'].length > 0){
											uploadNotesWrapper['fileName'] = formValues['uploadedFile'][0]['name'];
											uploadNotesWrapper['blobKey'] = registry.byId('hiddenUploadedDocId').get('value');
										} else {
											uploadNotesWrapper['fileName'] = '&#/#&';
											uploadNotesWrapper['blobKey'] = '&#/#&';
										} 
										var ajaxRequest = require("dojo/request");
										var json = require('dojo/json');
										var dom = require('dojo/dom');
										var standByWidgetId = 'healthInspectionFormStandBy';
										registry.byId(standByWidgetId).show();
										
										var urlToUse = "/service/store/" + registry.byId('hiddenStoreId').get('value') + "/health";
										var action = 'store';
										if(registry.byId("tabContainer").selectedChildWidget.get('id') == 'employeePane'){
											urlToUse = "/service/employee/" + empLayout.getEmployeeId() + "/documents";
											action = 'employee';
										} else if(registry.byId("tabContainer").selectedChildWidget.get('id') == 'templatesPane'){
											urlToUse = "/service/store/" + registry.byId('hiddenStoreId').get('value') + "/templates";
											action = 'templates';
										}
																				
										if(Number(registry.byId('hiddenHealthId').get('value')) == 0){
											ajaxRequest.post(urlToUse, {
				        							headers: { "Content-Type":"application/json"}, 
				        							handleAs: 'json', data: json.stringify(uploadNotesWrapper), timeout: 10000 
				        						}).then(function(healthDetailsResponse){
				        								if(healthDetailsResponse.success){
				        									dom.byId('messages').innerHTML = 'Add Successful';
				        									if(action == 'store')
																storeLayout.refreshPane();
															else if(action == 'employee')
																empLayout.populateEmployeeDetails('');
															else if(action == 'templates')
																storeLayout.refreshTemplatesPane(registry.byId('hiddenStoreId').get('value'));
				        								}
														registry.byId(standByWidgetId).hide();
														healthInspectionDialog.hide();
				        						}, function(error){
				        							console.log('Error while updating --> ' + error);
				        							dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
				        							registry.byId(standByWidgetId).hide();
				        						});
										} else {
											ajaxRequest.put(urlToUse + '/' + registry.byId('hiddenHealthId').get('value'), {
				        							headers: { "Content-Type":"application/json"}, 
				        							handleAs: 'json', data: json.stringify(uploadNotesWrapper), timeout: 10000 
				        						}).then(function(healthDetailsResponse){
				        								if(healthDetailsResponse.success){
				        									dom.byId('messages').innerHTML = 'Update Successful';
				        									if(action == 'store')
																storeLayout.refreshPane();
															else if(action == 'employee')
																empLayout.populateEmployeeDetails('');
															else if(action == 'templates')
																storeLayout.refreshTemplatesPane(registry.byId('hiddenStoreId').get('value'));
				        								}
														registry.byId(standByWidgetId).hide();
														healthInspectionDialog.hide();
				        						}, function(error){
				        							console.log('Error while updating --> ' + error);
				        							dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
				        							registry.byId(standByWidgetId).hide();
				        						});
										}
								}
								</script>
							</button>
							&nbsp;&nbsp;
							<button data-dojo-type="dijit/form/Button" type="button">Close
								<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
									e.preventDefault();
									e.stopPropagation();
									healthInspectionDialog.hide();
							</script>
							</button>
						</td>
					</tr>
				</table>
			</form>
			<div id="healthInspectionFormStandBy" data-dojo-id="healthInspectionFormStandBy" 
									data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'healthInspectionForm', color:'lightgrey'">
			</div>
		</fieldset>
	</div>
</div>
<!-- Health Inspection Dialog Ends here -->

<!-- Add Inventory Items Dialog -->
<div class="dijitHidden">
	<div data-dojo-type="dijit/Dialog"
		data-dojo-props="title:'Add Item to Inventory', loadingMessage:'Loading ...', style: 'font-size: 100%;'"
		draggable="true" data-dojo-id="addInventoryItemDialog" id="addInventoryItemDialog" style="position: absolute; top: 80px; height: 400px; width: 600px;">
		<div>
			<fieldset style="padding: 10px 2px 10px 2px; border: 1px dotted ThreeDDarkShadow;">
			<legend style="display: block; background: none; margin-left: 10px; padding: 0px 3px 0px 3px; border:1px dotted ThreeDDarkShadow; text-align: left; font-size:90%;"><b>Add/Modify Details:</b></legend>
				<form data-dojo-type="dijit/form/Form" data-dojo-id="inventoryItemForm" id="inventoryItemForm">
					<table class="addRecordTable" style="width: 98%; height: 90%; padding: 10px;">
						<tr>
							<td width="25%"><b>Distributor:</b></td>
							<td width="75%">
								<div data-dojo-type="dijit/form/Select" style="width: 200px;" data-dojo-props="required: 'true', labelAttr: 'name', trim: 'true'" id="inventoryItemDistributor" name="inventoryItemDistributor">
								</div>
							</td>
						</tr>
						<tr>
							<td width="25%"><b>Item Code:</b></td>
							<td width="75%">
								<input data-dojo-type="dijit/form/NumberTextBox" data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'" id="inventoryItemCode" name="inventoryItemCode"/>
							</td>
						</tr>
						<tr>
							<td width="25%"><b>Item Name:</b></td>
							<td width="75%">
								<input data-dojo-type="dijit/form/TextBox" data-dojo-props="style: 'width: 200px; font-size: 90%;', required: 'true', trim: 'true'" id="inventoryItemName" name="inventoryItemName"/>
							</td>
						</tr>
						<tr>
							<td width="25%"><b>Item Par:</b></td>
							<td width="75%">
								<input data-dojo-type="dijit/form/NumberTextBox" data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'" id="inventoryItemPar" name="inventoryItemPar"/>
							</td>
						</tr>
						<tr>
							<td width="25%"><b>Packaging:</b></td>
							<td width="75%">
								<input data-dojo-type="dijit/form/TextBox" data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true'" id="inventoryItemUnits" name="inventoryItemUnits"/>
							</td>
						</tr>
					</table>
				</form>
				<div id="inventoryItemFormStandBy" data-dojo-id="inventoryItemFormStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'inventoryItemForm', color:'lightgrey'">
				</div>
			</fieldset>
		</div>
		<div style="text-align: right; padding: 10px 2px 0px 0px;" align="right">
			<button data-dojo-type="dijit/form/Button" type="button" value="Save"
				id="addInventoryItemSaveButton">Save
				<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
					e.preventDefault();
					e.stopPropagation();
					console.log('Form Validation ', inventoryItemForm.validate(), inventoryItemForm.get('value'));
					var registry = require('dijit/registry');
					var storeLayout = require('controls/StoreLayoutController');
					if(inventoryItemForm.validate()){
						var formValues = inventoryItemForm.get('value');
						var itemWrapper = {};
						itemWrapper['id'] = formValues['inventoryItemDistributor'];
						itemWrapper['itemCode'] = formValues['inventoryItemCode'];
						itemWrapper['itemCategory'] = formValues['inventoryItemDistributor'];
						itemWrapper['itemColor'] = INVENTORY_DISTRIBUTORS_MAP[formValues['inventoryItemDistributor']]['color'];
						itemWrapper['itemName'] = formValues['inventoryItemName'];
						itemWrapper['itemPar'] = formValues['inventoryItemPar'];
						itemWrapper['itemUnits'] = formValues['inventoryItemUnits'];
						itemWrapper['storeId'] = registry.byId('hiddenStoreId').get('value');
						var ajaxRequest = require("dojo/request");
						var json = require('dojo/json');
						var dom = require('dojo/dom');
						var inventoryLayout = require("controls/InventoryLayoutController");
						var standByWidgetId = 'inventoryItemFormStandBy';
						registry.byId(standByWidgetId).show();
							ajaxRequest.post("/service/store/" + registry.byId('hiddenStoreId').get('value') + '/' + registry.byId('hiddenInvoiceCategory').get('value') + "/items", {
			       					headers: { "Content-Type":"application/json"}, 
			       					handleAs: 'json', data: json.stringify(itemWrapper), timeout: 10000 
			       			}).then(function(itemsResponse){
								if(itemsResponse.success){
			       					dom.byId('messages').innerHTML = 'Add Successful';
									inventoryLayout.reset();
									inventoryItemForm.reset();
			       				}
								registry.byId(standByWidgetId).hide();
								addInventoryItemDialog.hide();
			       			}, function(error){
			       				console.log('Error while updating --> ' + error);
			       				dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
			       				registry.byId(standByWidgetId).hide();
			       			});
					}
				</script>
			</button>
			<button data-dojo-type="dijit/form/Button" type="button" value="Back"
				id="addInventoryItemCloseButton">Close
				<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
						e.preventDefault(); // prevent the default submit
						e.stopPropagation();
						addInventoryItemDialog.hide();
				</script>
			</button>
		</div>
		<div id="addInventoryItemDialogStandBy" data-dojo-id="addInventoryItemDialogStandBy" data-dojo-type="dojox/widget/Standby" 
			data-dojo-props="target:'addInventoryItemDialog', color:'white'">
		</div>
	</div>
</div>
<!-- Inventory Items Dialog ends here -->

<div class="dijitHidden">
	<div data-dojo-type="dijit/Dialog" data-dojo-props="title:'Change Password', loadingMessage:'Loading ...'" data-dojo-id="changePasswordDialog" id="changePasswordDialog">
		<div class="dijitDialogPaneContentArea">
			<fieldset style="padding: 10px; border: 1px dotted ThreeDDarkShadow;">
				<legend style="display: block; background: none; margin-left: 10px; padding: 5px; border:1px dotted ThreeDDarkShadow; text-align: left;"><b>Details:</b></legend>
				<div data-dojo-type="dojox/form/PasswordValidator" name="newPassword" id="newPassword">
					<table style="width: 90%;">
						<tr>
							<td style="width: 60%;">Enter New Password:</td>
							<td style="width: 40%;"><input type="password" pwType="new" /></td>
						</tr>
						<tr>
							<td style="width: 60%;">Enter New Password (again): </td>
							<td style="width: 40%;"><input type="password" pwType="verify" /></td>
						</tr>
					</table>
				</div>
				<div class="dijitDialogPaneActionBar">
					<button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'primary'" type="submit">Update
						<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
							e.preventDefault(); // prevent the default submit
							e.stopPropagation();
							var registry = require('dijit/registry');
							var ajaxRequest = require("dojo/request");
							var json = require('dojo/json');
							var dom = require('dojo/dom');
							var standByWidgetId = 'changePasswordDialogStandBy';
							if(!registry.byId('newPassword').isValid()){
								return false;
							}
							registry.byId(standByWidgetId).show();
							var item = {id: 0, storeId: 0, fname: 'First Name', lname: 'Last Name', username: 'user', position: 'Front', personalPhone: '', 
										emergencyContact: '', address: '', phone: 'Add Phone', active: true, mgr: 1, updatedBy: 1, password: registry.byId('newPassword').get('value')};
							ajaxRequest.post("/service/employee/profile", {
			       				headers: { "Content-Type":"application/json"}, 
			       				handleAs: 'json', data: json.stringify(item), timeout: 10000 
			       			}).then(function(response){
								if(response.success){
			       					dom.byId('messages').innerHTML = 'Password Changed Successfully';
									changePasswordDialog.hide();
			       				}
								registry.byId(standByWidgetId).hide();
								addInventoryItemDialog.hide();
			       			}, function(error){
			       				console.log('Error while updating --> ' + error);
			       				dom.byId('messages').innerHTML = 'Error while Modifying Password --> ' + error;
			       				registry.byId(standByWidgetId).hide();
			       			});
						</script>
					</button>
				    <button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'inverse'">Cancel
				    	<script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
							e.preventDefault(); // prevent the default submit
							e.stopPropagation();
							changePasswordDialog.hide();
						</script>
				    </button>
				</div>
				<div id="changePasswordDialogStandBy" data-dojo-id="changePasswordDialogStandBy" data-dojo-type="dojox/widget/Standby" 
					data-dojo-props="target:'changePasswordDialog', color:'white'">
				</div>
			</fieldset>
		</div>
		<script type="dojo/on" data-dojo-event="show" data-dojo-args="e">
			console.log('onShow() event called !!!');
			var registry = require('dijit/registry');
			registry.byId('newPassword').reset();
		</script>
	</div>
</div>

<!-- Airport Section Dialog 
<div class="dijitHidden">
	<div class="application" data-dojo-type="dijit/Dialog" data-dojo-props="title:'Airport Section', loadingMessage:'Loading ...', style: 'font-size: 90% !important; height: 90%; width: 95%;'" data-dojo-id="airportSectionDialog" id="airportSectionDialog">
		<div align="center" data-dojo-type="dijit/layout/TabContainer" data-dojo-props="tabPosition: 'top', style:'margin-top:1px;height:99%;width:99%;'">
			<div align="center" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Store Info', style:'margin-top:1px;height:99%;width:99%;'">
				<form data-dojo-type="dijit/form/Form" data-dojo-id="airportSectionForm" id="airportSectionForm" style="width: 100%; height: 100%;">
					<table style="width: 100%; height: 100%;">
						<tr style="width: 99%; height: 49%;">
							<td style="width: 33%; height: 100%;"><div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Contact Info'" style="border: .1em solid #ddd; width: 99%; height: 99%;"><table class="storeInfoTable" style="width: 100%; height: 100%;">
								<tr>
									<td width="30%"><b>Address:</b></td>
									<td width="70%">
										<span id="airport-section-mailing-address" data-dojo-type="dijit/InlineEditBox" 
											data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:20, maxLength: 100 }" 
											width="250px"></span>
									</td>
								</tr>
								<tr>
									<td width="30%"><b>Phone Numbers:</b></td>
									<td width="70%">
										<span id="airport-section-phone-numbers" data-dojo-type="dijit/InlineEditBox" 
											data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:20, maxLength: 100 }" 
											width="250px"></span>
									</td>
								</tr>
								<tr>
									<td width="30%"><b>Operating Hours:</b></td>
									<td width="70%">
										<span id="airport-section-operating-hrs" data-dojo-type="dijit/InlineEditBox" 
											data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:20, maxLength: 100 }" 
											width="250px"></span>
									</td>
								</tr>
							</table></div></td>
							<td style="width: 34%; height: 100%;"><div id="airportsectionHostInfo" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'HMS Host Contact Info'" style="border: .1em solid #ddd; width: 99%; height: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;"><div style="padding: 2px 0px 2px 0px;"><span id="airport-section-host-contact-info" data-dojo-type="dijit/InlineEditBox" 
								data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:90, maxLength: 100 }" 
								width="350px"></span></div></div></td>
							<td style="width: 33%; height: 100%;"><div id="airportSectionNotesPane" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Store Notes'" style="border: .1em solid #ddd; width: 99%; height: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;"><div style="padding: 2px 0px 2px 0px;"><span id="airport-section-notes" data-dojo-type="dijit/InlineEditBox" 
								data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:90, maxLength: 100 }" 
								width="350px"></span></div></div></td>
						</tr>
						<tr style="width: 99%; height: 49%;">
							<td style="width: 33%; height: 100%;"><div id="airport-section-important-dates" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Important Dates'" style="border: .1em none #ddd; width: 99%; height: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;"><div id="airport-section-important-dates-content-new" style="display: none;">
		  						<div style="padding: 1px 0px 4px 0px;">
		  							<input data-dojo-type="dijit/form/DateTextBox" type="text" name="airportSectionImpDateInput" id="airportSectionImpDateInput" style="width: 30%;"/>
		  							<input name="airportSectionImpDateNotes" id="airportSectionImpDateNotes" type="text" data-dojo-type="dijit/form/TextBox" style="width: 40%;"/>
		  								<a href="javascript: saveImpDateAirportSection();">Save</a>&nbsp;&nbsp;<a href="javascript: hideImportantDateAirportSection();">Hide</a>
		  						</div>
		  					</div>
		  					<div id="airport-section-important-dates-content" align="left">
		  						<table id="airportSectionImpDatesTable" style="width: 80%; height: 100%;" class='storeInfoTable'>
		  							<tr><td width="30%"></td><td width="70%"></td></tr>
		  							<tr><td width="30%"></td><td width="70%"></td></tr>
		  							<tr><td width="30%"></td><td width="70%"></td></tr>
		  						</table>
		  					</div>
		  					<div id="airportSectionImpDatesStandBy" data-dojo-id="storeInfoImpDatesStandBy" 
									data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'airport-section-important-dates', color:'white'">
							</div></div></td>
							<td style="width: 34%; height: 100%;"><div id="airportSectionDocs" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Documents'" style="border: .1em solid #ddd; width: 99%; height: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;"><div id="airportSectionDocsWidgetsDiv" style="display: none;">
								<span id="airportSectionDocsWidgets"></span>
								<span id="airportSectionDocsWidgetsProgressMsgs"></span>
								<a href="javascript: hideFileUploadDialog('airportSectionDocs');">Hide</a>
							</div>
							<div id="airportSectionDocsUpload">
							  	<img align='top' src='resources/images/file-upload.png'/>
							  	<a href="javascript: showFileUploadDialog('airportSectionDocs');">Upload Document</a>
							</div>
							<div>
								<ul id="airportSectionDocsUploaded"></ul>
							  	<ol id="airportSectionDocsExisting"></ol>
							</div>
							<div id="airportSectionDocsStandBy" data-dojo-id="airportSectionDocsStandBy" 
								data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'airportSectionDocs', color:'lightgrey'">
							</div></div></td>
							<td style="width: 33%; height: 100%;"><button data-dojo-type="dijit/form/Button" type="submit" data-dojo-props="'class':'primary'">Save Changes</button></td>
						</tr>
					</table>
		  			<script type="dojo/on" data-dojo-event="submit" data-dojo-args="evt">
						evt.preventDefault();
						evt.stopPropagation();
						var storeLayout = require("controls/StoreLayoutController");
						storeLayout.saveStoreInfoData();
						return false;
					</script>
				</form>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Accounting'" style="width:100%; height:100%;">
			</div>
		</div>
		<div id="airportSectionTitlePaneStandBy" data-dojo-id="airportSectionTitlePaneStandBy" 
			data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'airportSectionForm', color:'white'">
		</div>
	</div>
<!-- </div> -->
<!-- Airport Section Dialog Ends here -->
</body>
</html>