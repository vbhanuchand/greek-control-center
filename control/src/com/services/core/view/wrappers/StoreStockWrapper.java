package com.services.core.view.wrappers;

import java.util.Date;

public class StoreStockWrapper extends BaseModel{
	
	private static final long serialVersionUID = -3884537530117078965L;
	private Integer id;
	private Integer storeId;
	private Integer itemId;
	private Integer itemCategory;
	private Integer itemStock;
	private Integer itemOrder;
	private Double itemPricePerUnit;
	private Double itemGSPercent;
	private Integer updatedBy;
	private Date updatedDate;
	
	public StoreStockWrapper() {
		super();
	}

	public StoreStockWrapper(Integer id, Integer storeId, Integer itemId,
			Integer itemCategory, Integer itemStock, Integer itemOrder,
			Double itemPricePerUnit, Double itemGSPercent, Integer updatedBy,
			Date updatedDate) {
		super();
		this.id = id;
		this.storeId = storeId;
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

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
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
	
	
}
