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
</script>

<!-- --><link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/resources/dojo.css" />
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
<link rel="stylesheet"href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojox/calendar/themes/claro/Calendar.css" />
<link rel="stylesheet" href="resources/styles/styles.css" />
<link rel="stylesheet" href="resources/styles/overrides-bootstrap.css" />

<script data-dojo-config="has:{'dojo-firebug': true, 'dojo-debug-messages': true}, cacheBust: true, parseOnLoad:false, isDebug: true, waitSeconds: 10, locale: location.search.match(/locale=([\w\-]+)/) ? RegExp.$1 : 'en-us'" src="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/dojo.js"></script>
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
	                <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick: callManageUsers">View Managers</div>
	            </div>
	        </div>
	        <div data-dojo-type="dijit/PopupMenuBarItem" id="userOptionsPopupMenu" style="float: right;">
	            <span>Options</span>
	            <div data-dojo-type="dijit/Menu">
	                <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick: callManageUsers">Change Password</div>
	                <div data-dojo-type="dijit/MenuItem" data-dojo-props="iconClass:'icon-signout', onClick: function(){ console.log('not actually cutting anything, just a test!');}">Sign out</div>
	            </div>
	        </div>
	    </div>
		<div data-dojo-type="dijit/layout/ContentPane" style="width: 18%; top: 25px !important;" data-dojo-props="splitter: true, region: 'leading'">
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
						<a href="javascript: checkSelectedPane('locationTabletr5', 'rightAccordion', 5);"><i class="icon-chevron-right"></i> Salt Lake City</a>
					</li>
				</ul>
			</div>
			<div id="employeePaneInfo" data-dojo-props="title:'Photograph', open:true" data-dojo-type="dijit/TitlePane" style="display: none; width:100%; font-size:90%; height: 25%;">
				<div id="employeePaneInfoContent" align="center">
					<img id="employeeImg" align='top' src='resources/images/no-photo.png' width="80%" height="75%"/>
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
			<div id="laborPaneInfo" data-dojo-type="dijit/TitlePane" data-dojo-props="title:'Summary', style:'width:100%;font-size:90%; height: 10%;', open:true">
				<div data-dojo-type="dijit/layout/ContentPane">
					<div id="laborPaneInfoContent"></div>
				</div>
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
						<div data-dojo-type="dojox/layout/TableContainer" data-dojo-props="showLabels:true, orientation:'vert', spacing:1, cols:3, customClass:'leaseInfo-labelsAndValues', style:'width:100%;'" id="storeInfoTable">
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
							<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Property Info'" style="border: .1em solid #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
								<div style="padding: 2px 0px 2px 0px;"><span id="store-info-property-mgr-info" data-dojo-type="dijit/InlineEditBox" 
									data-dojo-props="editor: dijit.form.Textarea, editorParams: { rows:2, cols:90, maxLength: 100 }" 
									width="350px"></span></div>
							</div>
							<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Store Notes'" style="border: .1em solid #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
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
							<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Lease/ Mortgage/ Loan Info'" style="border: .1em solid #ddd; width: 99%; font-size: 96%; padding: 0px 2px 0px 2px !important;">
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
			<div id="managerPane" data-dojo-type="dijit/layout/ContentPane" title="Manager's" data-dojo-props="selected:false" style="width: 99%; height: 99%">
				<div id="mgrYearlyDetailsRegion" data-dojo-type="dijit/layout/ContentPane" style="display: none; width: 99%;" align="center">
					<div id="mgrYearlyDetailsRegionContent" align="left">
						<span style="text-align: left;"><a href="javascript: returnToManagerPane();"><i class="icon-chevron-left"></i><i class="icon-chevron-left"></i>&nbsp;&nbsp;Return</a></span>
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
					<div id="mgrYearlyDetailsRegionStandBy" data-dojo-id="mgrYearlyDetailsRegionStandBy" data-dojo-type="dojox/widget/Standby" 
						data-dojo-props="target:'mgrYearlyDetailsRegion', color:'lightgrey'"></div>
				</div>
				<div id="managerDetailsPane" style="width: 99%; height: 35%; margin-top: 1px" align="center">
					<table style="width: 99%; height: 99%;" class='dateTable'>
						<tr style="width: 100%; height: 100%">
							<td style="width: 18%" align="center">
								<div id="mgrPhotoPane" style="width: 100%; height: 100%" align="center">
									<img id="managerPhoto" align="top" src='resources/images/no-photo.png' width="150px" height="170px"/>
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
							<td style="width: 35%" valign="top">
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
										<div id="mgrContractStandBy" data-dojo-id="mgrContractStandBy" data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'mgrContract', color:'lightgrey'"></div>
									</div>
								</div>
							</td>
							<td style="width: 12%" valign="top" id="mgrYearlyReviews">
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
				<table style="width: 99%; height: 62%; margin-top: 1px;" class='dateTable' align="center">
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
			<div id="employeePane" data-dojo-type="dijit/layout/ContentPane" title="Employees" data-dojo-props="selected:false" style="width: 100%; height: 100%">
					<div id="employeesGridContentPane" data-dojo-type="dijit/layout/ContentPane" style="margin:2px;width:99%;height:50%; vertical-align:top;">
						<div id="employeesGrid" align="center"
							style="margin:2px;width:99%;height:99%; vertical-align:top;">
						</div>
					</div>
					<div id="employeesGridStandBy" data-dojo-id="employeesGridStandBy" 
									data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'employeesGridContentPane', color:'white'">
					</div>
					<div id="employeeInfoTabContainer" data-dojo-id="employeeInfoTabContainer" data-dojo-type="dijit/layout/TabContainer" 
						data-dojo-props="tabPosition: 'top'" style="margin:2px;font-style: italic; width:100%;height:49%;vertical-align:bottom;">
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
								data-dojo-props="title:'Missed Shifts', style:'margin-top:1px;height:99%;width:100%;'">
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
			<div id="laborPane" data-dojo-type="dijit/layout/ContentPane" title="Current Schedule" data-dojo-props="selected: false, style:'width:99%; height:99%;'">
					<div id="labor-calendar" class="claro" data-dojo-type="dojox/calendar/Calendar" data-dojo-props="style: 'position:relative;width:100%;height:99%;'"></div>
				</div>
			<div id="accountingPane" data-dojo-type="dijit/layout/ContentPane" title="Accounting" data-dojo-props="selected:false" style="width: 99%; height: 99%">
					<div id="accountingDetailsRegion" data-dojo-type="dijit/layout/ContentPane" style="width: 99%; height: 100%; border: .1em solid #ddd;" align="center">
						<div data-dojo-type="dijit/layout/ContentPane" style="width: 99%; height: 54%; border: .1em solid #ddd;" align="center">
							<table style="width: 100%; height: 100%;" class="dateTable">
								<tr style="width: 100%; height: 50%;" valign="top">
									<td style="width: 56%; height: 100%;" align="center" valign="top">
										<div id="accountingDetailsPane" style="width: 99%; vertical-align: top; height: 100%; margin-top: 2px" align="center">
											<table style="width: 100%; height: 100%; vertical-align: top;" id="accountsQuarterDetails">
												<tr valign="top">
													<td style="width: 65%; vertical-align: top;" valign="top" class="noBorder">
														<form data-dojo-type="dijit/form/Form" data-dojo-id="accountingEntriesForm" id="accountingEntriesForm">
															<table style="width: 100%; height: 50%; vertical-align: top;" class="accountingTable">
																<tr style="height: 5%;" valign="top"><td colspan="3" align="left">Select Month:&nbsp;&nbsp;&nbsp;<span id="accountingQuartersList"></span></td></tr>
																<tr style="height: 5%;" valign="top">
																	<th style="width: 33%;">Distribution</th>
																	<th style="width: 34%;">Amount</th>
																	<th style="width: 33%;">%</th>
																</tr>
																<tr style="height: 5%;" valign="top">
																	<td style="width: 33%;">Labor</td>
																	<td style="width: 34%;" align="center">
																		<input style="width: 90%;" type="text" name="accountingLbrAmt" id="accountingLbrAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																			data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
																	</td>
																	<td style="width: 33%; text-align: center;" id="accountingLbrAmtPercent"></td>
																</tr>
																<tr style="height: 5%;" valign="top">
																	<td style="width: 33%;">Food Cost</td>
																	<td style="width: 34%;" align="center">
																		<input style="width: 90%;" type="text" name="accountingFdAmt" id="accountingFdAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																			data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
																	</td>
																	<td style="width: 33%; text-align: center;" id="accountingFdAmtPercent"></td>
																</tr>
																<tr style="height: 5%;" valign="top">
																	<td style="width: 33%;">Advertisement</td>
																	<td style="width: 34%;" align="center">
																		<input style="width: 90%;" type="text" name="accountingAdvtAmt" id="accountingAdvtAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																			data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
																	</td>
																	<td style="width: 33%; text-align: center;" id="accountingAdvtAmtPercent"></td>
																</tr>
																<tr style="height: 5%;" valign="top">
																	<td style="width: 33%;">Misc.</td>
																	<td style="width: 34%;" align="center">
																		<input style="width: 90%;" type="text" name="accountingMiscAmt" id="accountingMiscAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																			data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
																	</td>
																	<td style="width: 33%; text-align: center;" id="accountingMiscAmtPercent"></td>
																</tr>
																<tr style="height: 5%;" valign="top">
																	<td style="width: 33%;">Profit</td>
																	<td style="width: 34%;" align="center">
																		<input style="width: 90%;" type="text" name="accountingProfitAmt" id="accountingProfitAmt" value="0" required="true" data-dojo-type="dijit/form/CurrencyTextBox" 
																			data-dojo-props="constraints:{fractional:false}, currency:'USD', invalidMessage:'Invalid Amount.'" />
																	</td>
																	<td style="width: 33%; text-align: center;" id="accountingProfitAmtPercent"></td>
																</tr>
																<tr style="height: 5%;" valign="top">
																	<td colspan="3" class="noBorder">
																		<button id="accountingUpdateBtn" data-dojo-type="dijit/form/Button" disabled="disabled" type="submit" style="padding: 3px;" value="update">Update</button>
																		<button id="accountingSaveBtn" data-dojo-type="dijit/form/Button" disabled="disabled" type="submit" style="padding: 3px;" value="save">Save</button>
																	</td>
																</tr>
															</table>
															<input type="hidden" name="hiddenAccountingRecordId" id="hiddenAccountingRecordId" value="0" />
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
													</td>
													<td style="width: 35%; vertical-align: top;" valign="top" class="noBorder">
														<table style="width: 100%; height: 20%; vertical-align: top;" class="accountingTable">
															<tr style="height: 5%;" valign="top">
																<td style="width: 60%;">Total Sales</td>
																<td style="width: 40%;" align="center" colspan="2"></td>
															</tr>
															<tr style="height: 5%;" valign="top">
																<td style="width: 60%;">Total Operating Expenses</td>
																<td style="width: 40%;" align="center" colspan="2"></td>
															</tr>
															<tr style="height: 5%;" valign="top">
																<td style="width: 60%;">Total Profits</td>
																<td style="width: 40%;" align="center" colspan="2"></td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
											<table style="width: 100%; height: 100%; display: none; vertical-align: top;" id="accountsYearlyDetails">
												<tr valign="top">
													<td colspan="5">
														<div style="float: left;"><a href="javascript: returnToAccountsPane();">&lt;&lt;&nbsp;&nbsp;Return</a></div>
														<div style="text-align: center;"><b>End of Year Statement</b></div>
													</td>
												</tr>
												<tr valign="top">
													<td style="width: 15%" class="noBorder">
														<table class="accountingTable" style="width: 100%; height: 100%;">
															<tr>
																<th>Total Sales</th>
															</tr>
															<tr>
																<td id="totalYearlySalesAmt"></td>
															</tr>
														</table>
													</td>
													<td style="width: 8%" class="noBorder">
														&nbsp;
													</td>
													<td style="width: 30%" class="noBorder">
														<table class="accountingTable" style="width: 100%; height: 100%;">
															<tr>
																<th width="70%">Total Operating Expenses</th>
																<th width="30%">%</th>
															</tr>
															<tr>
																<td id="totalOperatingExpensesAmt" width="70%"></td>
																<td id="totalOperatingExpensesPercent" width="30%"></td>
															</tr>
														</table>
													</td>
													<td style="width: 6%" class="noBorder">
														&nbsp;
													</td>
													<td style="width: 41%" class="noBorder">
														<table class="accountingTable" style="width: 100%; height: 100%;">
															<tr>
																<th>Total Profits</th>
																<th>%</th>
															</tr>
															<tr>
																<td id="totalProfitsAmt"></td>
																<td id="totalProfitsPercent"></td>
															</tr>
														</table>
													</td>
												</tr>
												<tr>
													<td colspan="5" style="width: 100%; height: 100%; padding: 10px 2px 10px 2px;">
														<table style="width: 100%; height: 100%;" class="accountingTable">
															<tr>
																<th style="width: 16%"></th>
																<th style="width: 16%">Quarter 1</th>
																<th style="width: 16%">Quarter 2</th>
																<th style="width: 16%">Quarter 3</th>
																<th style="width: 16%">Quarter 4</th>
																<th style="width: 20%">End of Year</th>
															</tr>
															<tbody id="yearlyAccountingDetailsTable">
															</tbody>
														</table>
													</td>
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
						<div data-dojo-type="dijit/layout/ContentPane" style="width: 99%; height: 45%; border: .1em solid #ddd;" align="center">
							<div id="accountingMonthlyChartDiv" style="width: 100%; height: 100%;"></div>
						</div>
					</div>
					<div id="accountingDetailsStandBy" data-dojo-id="accountingDetailsStandBy" 
							data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accountingDetailsRegion', color:'white'">
					</div>
					<div id="accountsYearlyDetailsStandBy" data-dojo-id="accountsYearlyDetailsStandBy" 
							data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accountsYearlyDetails', color:'white'">
					</div>
					<div id="accountingYearsStandBy" data-dojo-id="accountingYearsStandBy" 
							data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accountingYearsTd', color:'white'">
					</div>
					<div id="accountsQuarterDetailsStandBy" data-dojo-id="accountsQuarterDetailsStandBy" 
							data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'accountsQuarterDetails', color:'white'">
					</div>
				</div>
			<div id="inventoryPane" data-dojo-type="dijit/layout/ContentPane" title="Inventory" data-dojo-props="selected:false" style="width: 99%; height: 99%;">
					<table style="width: 99%; height: 99%;" id="inventoryPaneTable">
						<tr valign="bottom" style="width: 100%; height: 5%;">
							<td colspan="2">
								<div id="invoiceCategoryTabContainer" data-dojo-type="dijit/layout/TabContainer" data-dojo-props="tabPosition: 'top'" style="width: 100%;" doLayout="false">
							        <div data-dojo-type="dijit/layout/ContentPane" title="Distributor" data-dojo-props="selected:true" style="border: 0px; height: 0px;">
							        </div>
							        <div data-dojo-type="dijit/layout/ContentPane" title="GS Kitchen" data-dojo-props="selected:false" style="border: 0px; height: 0px;">
							        </div>
							   </div>
							</td> 
						</tr>
						<tr valign="middle" style="width: 100%; height: 7%;">
							<td colspan="2">
								<span style="float: left" id="checkStockLink">
									<a href="javascript: printInvoiceDetails('inventoryInvoiceDetailsGrid', 'inventoryTabTitleCategory');">Print Invoice</a>&nbsp;<a style="padding-right: 5px; padding-left: 5px;" href='javascript:checkStock("D");'>Check Stock</a>&nbsp;
									<img src='resources/images/add-icon.png' onclick='javascript: addItemToStock();'/>
								</span>
								<span style="position: relative; left: 1%; color: whitesmoke; background-color: #2E2EFE; border: 1px solid black;">&nbsp;NICHOLAS&nbsp;</span>&nbsp;&nbsp;
								<span style="position: relative; left: 1%; color: whitesmoke; background-color: #8904B1; border: 1px solid black;">&nbsp;US FOODS&nbsp;</span>&nbsp;&nbsp;
								<span style="position: relative; left: 3%; color: orange; font-weight: bolder; font-size: 100%;" id="inventoryTabTitle">Invoices / Stock</span>&nbsp;&nbsp;
								<span style="position: relative; left: 3%; color: orange; font-weight: bolder; font-size: 100%;" id="inventoryTabTitleCategory">(Distributor)</span>
								<span style="position: relative; left: 5%; color: whitesmoke; background-color: #B40431; border: 1px solid black;">&nbsp;SAMS CLUB&nbsp;</span>&nbsp;&nbsp;
								<span style="position: relative; left: 5%; color: whitesmoke; background-color: #21610B; border: 1px solid black;">&nbsp;GS KITCHEN&nbsp;</span>&nbsp;&nbsp;
								<span style="float: right" id="createInvoiceLink">
									<a href='javascript:createInventoryItem();'>Add Inventory Items</a>
									<a href='javascript:createInvoice();'>Create Invoice</a>
								</span>
							</td>
						</tr>
						<tr valign="top" style="width: 100%; height: 88%;">
							<td align="left" style="height: 95%; width: 40%;">
								<div id="inventoryInvoicesGrid" align="center"
									style="height: 100%; margin: 2px; width: 100%;">
								</div>
								<div id="inventoryInvoicesGridStandBy" data-dojo-id="inventoryInvoicesGridStandBy" data-dojo-type="dojox/widget/Standby" 
										data-dojo-props="target:'inventoryInvoicesGrid', color:'white'">
								</div>
							</td>
							<td align="left" style="height: 95%; width: 60%;">
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
							<div id="inventoryStockItem" data-dojo-type="dijit/form/Select" name="inventoryStockItem"></div>
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
								
					<tr>
						<td align="left" valign="middle"><u>Price Per Unit:</u></td>
						<td align="left" valign="middle"><input data-dojo-type="dijit/form/CurrencyTextBox"
							data-dojo-props="style: 'width: 100px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid', value: 0"
							id="inventoryStockPPU" name="inventoryStockPPU"/></td>
					</tr>
									
					<tr>
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
																				
										
										if(Number(registry.byId('hiddenHealthId').get('value')) == 0){
											ajaxRequest.post("/service/store/" + registry.byId('hiddenStoreId').get('value') + "/health", {
				        							headers: { "Content-Type":"application/json"}, 
				        							handleAs: 'json', data: json.stringify(uploadNotesWrapper), timeout: 10000 
				        						}).then(function(healthDetailsResponse){
				        								if(healthDetailsResponse.success){
				        									dom.byId('messages').innerHTML = 'Add Successful';
				        									storeLayout.refreshPane();
				        								}
														registry.byId(standByWidgetId).hide();
														healthInspectionDialog.hide();
				        						}, function(error){
				        							console.log('Error while updating --> ' + error);
				        							dom.byId('messages').innerHTML = 'Error while Adding --> ' + error;
				        							registry.byId(standByWidgetId).hide();
				        						});
										} else {
											ajaxRequest.put("/service/store/" + registry.byId('hiddenStoreId').get('value') + "/health/" + registry.byId('hiddenHealthId').get('value'), {
				        							headers: { "Content-Type":"application/json"}, 
				        							handleAs: 'json', data: json.stringify(uploadNotesWrapper), timeout: 10000 
				        						}).then(function(healthDetailsResponse){
				        								if(healthDetailsResponse.success){
				        									dom.byId('messages').innerHTML = 'Update Successful';
				        									storeLayout.refreshPane();
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
								<div data-dojo-type="dijit/form/Select"
									data-dojo-props="pageSize: 5, required: 'true', maxHeight: -1, labelAttr: 'name', style: 'width: 175px; font-size: 90%;', trim: 'true'"
									id="inventoryItemDistributor" name="inventoryItemDistributor">
								</div>
							</td>
						</tr>
						<tr>
							<td width="25%"><b>Item Name:</b></td>
							<td width="75%">
								<input data-dojo-type="dijit/form/TextBox"
									data-dojo-props="style: 'width: 200px; font-size: 90%;', required: 'true', trim: 'true'"
									id="inventoryItemName" name="inventoryItemName"/>
							</td>
						</tr>
						<tr>
							<td width="25%"><b>Item Par:</b></td>
							<td width="75%">
								<input data-dojo-type="dijit/form/NumberTextBox"
							data-dojo-props="style: 'width: 50px; font-size: 90%;', required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
							id="inventoryItemPar" name="inventoryItemPar"/>
							</td>
						</tr>
						<tr>
							<td width="25%"><b>Item Units:</b></td>
							<td width="75%">
								<input data-dojo-type="dijit/form/TextBox"
									data-dojo-props="style: 'width: 50px; font-size: 90%;', required: 'true', trim: 'true'"
									id="inventoryItemUnits" name="inventoryItemUnits"/>
							</td>
						</tr>
					</table>
				</form>
				<div id="inventoryItemFormStandBy" data-dojo-id="inventoryItemFormStandBy" 
						data-dojo-type="dojox/widget/Standby" data-dojo-props="target:'inventoryItemForm', color:'lightgrey'">
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
						itemWrapper['itemColor'] = INVENTORY_DISTRIBUTORS_MAP[formValues['inventoryItemDistributor']]['color'];
						itemWrapper['itemName'] = formValues['inventoryItemName'];
						itemWrapper['itemPar'] = formValues['inventoryItemPar'];
						itemWrapper['itemUnits'] = formValues['inventoryItemUnits'];
						itemWrapper['storeId'] = registry.byId('hiddenStoreId').get('value');
						itemWrapper['id'] = formValues['inventoryItemDistributor'];
						itemWrapper['itemCode'] = formValues['inventoryItemDistributor'];
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

</body>
</html>