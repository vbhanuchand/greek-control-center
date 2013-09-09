<div class="dijitHidden">
	<div data-dojo-type="dijit/Dialog"
		data-dojo-props="title:'Add Item to Stock', loadingMessage:'Loading ...'"
		draggable="true" data-dojo-id="inventoryItemDialog"
		id="inventoryItemDialog">
		<form data-dojo-type="dijit/form/Form"
			data-dojo-id="inventoryItemDialogForm" id="inventoryItemDialogForm">
			<table class="bordered" style="vertical-align: middle;">
				<tr>
					<td align="left" valign="middle">Stock Item</td>
					<td align="left" valign="middle"><input data-dojo-type="dijit/form/Select"
						data-dojo-props="required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
						id="inventoryStockItem" name="inventoryStockItem"/></td>
				</tr>
				<tr>
					<td align="left" valign="middle">Par (Units)</td>
					<td align="left" valign="middle"><input data-dojo-type="dijit/form/ValidationTextBox"
						data-dojo-props="required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
						id="inventoryStockPar" name="inventoryStockPar"/></td>
				</tr>
				
				<tr>
					<td align="left" valign="middle">In Stock</td>
					<td align="left" valign="middle"><input data-dojo-type="dijit/form/ValidationTextBox"
						data-dojo-props="required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
						id="inventoryStockInStock" name="inventoryStockInStock"/></td>
				</tr>
				
				<tr>
					<td align="left" valign="middle">To Order</td>
					<td align="left" valign="middle"><input data-dojo-type="dijit/form/ValidationTextBox"
						data-dojo-props="required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
						id="inventoryStockToOrder" name="inventoryStockToOrder"/></td>
				</tr>
				
				<tr>
					<td align="left" valign="middle">Price Per Unit</td>
					<td align="left" valign="middle"><input data-dojo-type="dijit/form/ValidationTextBox"
						data-dojo-props="required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
						id="inventoryStockPPU" name="inventoryStockPPU"/></td>
				</tr>
				
				<tr>
					<td align="left" valign="middle">GS Charge %</td>
					<td align="left" valign="middle"><input data-dojo-type="dijit/form/ValidationTextBox"
						data-dojo-props="required: 'true', trim: 'true', invalidMessage : 'Item is Invalid'"
						id="inventoryStockGSCharge" name="inventoryStockGSCharge"/></td>
				</tr>
				
				<tr>
					<td colspan="2" align="left">
						<button data-dojo-type="dijit/form/Button" type="submit"
							id="inventoryStockSubmitButton">Submit</button></td>
				</tr>
			</table>
			<script type="dojo/on" data-dojo-event="submit" data-dojo-args="e">
				e.preventDefault(); // prevent the default submit
				e.stopPropagation();
			</script>
		</form>
	</div>
</div>



<!-- Health Inspection Dialog Starts here -->
<div class="dijitHidden">
	<div data-dojo-type="dijit/Dialog"
		data-dojo-props="title:'Add Info:'"
		draggable="true" data-dojo-id="healthInspectionDialog"
		id="healthInspectionDialog">
		<fieldset style="border:1px dotted grey;">
			<legend style="border:1px solid green; text-align: right; font-size:90%; color:green; ">Health Inspection Information:</legend>
			<table class="storeInfoTable">
				<tr>
					<td width="30%"><b>Date:</b></td>
					<td width="70%">
						<input data-dojo-type="dijit/form/DateTextBox" type="text" name="healthInspectionDate" id="healthInspectionDate"/>
					</td>
				</tr>
				<tr>
					<td width="30%"><b>Document:</b></td>
					<td width="70%">
						<div id="healthInspection" data-dojo-type="dijit/layout/ContentPane" style="margin-top: 2px;font-weight: normal;width: 100%" align="left">
							<div id="healthInspectionWidgetsDiv" style="display: none;">
								<span id="healthInspectionWidgets"></span>
								<span id="healthInspectionWidgetsProgressMsgs"></span>
								<a href="javascript: hideFileUploadDialog('healthInspection');">Hide</a>
							</div>
							<div id="healthInspectionUpload">
							  	<img align='top' src='resources/images/file-upload.png'/>
							  	<a href="javascript: showFileUploadDialog('healthInspection');">Upload Contract</a>
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
					<td width="30%"><b>Notes:</b></td>
					<td width="70%">
						<span id="healthInspectionNotes" data-dojo-type="dijit/InlineEditBox" 
							data-dojo-props="editor: dijit.form.Textarea, rows:2, cols:20, maxLength: 100" 
							widgetid="healthInspectionNotes" width="99%">
						</span>
					</td>
				</tr>
			</table>
		</fieldset>
	</div>
</div>
<!-- Health Inspection Dialog Ends here -->
