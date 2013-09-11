package com.services.core.view.wrappers;

import java.util.Date;

public class ItemWrapper extends BaseModel{

	private static final long serialVersionUID = -8554510308341979893L;

	private Integer id;
	
	private Integer itemCode;
	
	private String itemColor;
	
	private String itemName;
	
	private Integer itemPar;
	
	private String itemUnits;
	
	private Integer storeId;
	
	private Integer updatedBy;
	
	private Date updatedDate;

	public ItemWrapper() {
		super();
	}

	public ItemWrapper(Integer id, Integer itemCode, String itemColor,
			String itemName, Integer itemPar, String itemUnits,
			Integer storeId, Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.itemCode = itemCode;
		this.itemColor = itemColor;
		this.itemName = itemName;
		this.itemPar = itemPar;
		this.itemUnits = itemUnits;
		this.storeId = storeId;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getItemCode() {
		return itemCode;
	}

	public void setItemCode(Integer itemCode) {
		this.itemCode = itemCode;
	}

	public String getItemColor() {
		return itemColor;
	}

	public void setItemColor(String itemColor) {
		this.itemColor = itemColor;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Integer getItemPar() {
		return itemPar;
	}

	public void setItemPar(Integer itemPar) {
		this.itemPar = itemPar;
	}

	public String getItemUnits() {
		return itemUnits;
	}

	public void setItemUnits(String itemUnits) {
		this.itemUnits = itemUnits;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
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
