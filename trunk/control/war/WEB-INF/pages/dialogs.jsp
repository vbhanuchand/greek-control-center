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