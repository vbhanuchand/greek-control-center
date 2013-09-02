package com.services.core.view.wrappers;

import java.util.Date;

public class StoreInvoiceDetailsWrapper extends BaseModel{
	
	private static final long serialVersionUID = 3534768859352620216L;
	
	private Integer id;
	private Integer invoiceId;
	private Integer itemId;
	private Integer itemCategory;
	private Integer itemStock;
	private Integer itemOrder;
	private Double itemPricePerUnit;
	private Double itemGSPercent;
	private Integer updatedBy;
	private Date updatedDate;
	
	public StoreInvoiceDetailsWrapper() {
		super();
	}
	
	public StoreInvoiceDetailsWrapper(Integer id, Integer invoiceId,
			Integer itemId, Integer itemCategory, Integer itemStock,
			Integer itemOrder, Double itemPricePerUnit, Double itemGSPercent,
			Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.invoiceId = invoiceId;
		this.itemId = itemId;
		this.itemCategory = itemCategory;
		this.itemStock = itemStock;
		this.itemOrder = itemOrder;
		this.itemPricePerUnit = itemPricePerUnit;
		this.itemGSPercent = itemGSPercent;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getInvoiceId() {
		return invoiceId;
	}

	public void setInvoiceId(Integer invoiceId) {
		this.invoiceId = invoiceId;
	}

	public Integer getItemId() {
		return itemId;
	}

	public void setItemId(Integer itemId) {
		this.itemId = itemId;
	}

	public Integer getItemCategory() {
		return itemCategory;
	}

	public void setItemCategory(Integer itemCategory) {
		this.itemCategory = itemCategory;
	}

	public Integer getItemStock() {
		return itemStock;
	}

	public void setItemStock(Integer itemStock) {
		this.itemStock = itemStock;
	}

	public Integer getItemOrder() {
		return itemOrder;
	}

	public void setItemOrder(Integer itemOrder) {
		this.itemOrder = itemOrder;
	}

	public Double getItemPricePerUnit() {
		return itemPricePerUnit;
	}

	public void setItemPricePerUnit(Double itemPricePerUnit) {
		this.itemPricePerUnit = itemPricePerUnit;
	}

	public Double getItemGSPercent() {
		return itemGSPercent;
	}

	public void setItemGSPercent(Double itemGSPercent) {
		this.itemGSPercent = itemGSPercent;
	}

	public Integer getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	@Override
	public String toString() {
		return "StoreInvoiceDetailsWrapper [invoiceId=" + invoiceId
				+ ", itemId=" + itemId + ", itemCategory=" + itemCategory
				+ ", itemStock=" + itemStock + ", itemOrder=" + itemOrder
				+ ", itemPricePerUnit=" + itemPricePerUnit + ", itemGSPercent="
				+ itemGSPercent + ", updatedBy=" + updatedBy + ", updatedDate="
				+ updatedDate + "]";
	}
	
}
