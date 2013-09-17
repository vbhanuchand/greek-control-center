package com.services.core.data.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "items")
public class Item implements Serializable {
	
	private static final long serialVersionUID = 1015309282662986902L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "item_code")
	private Integer itemCode;
	
	@Column(name = "item_color")
	private String itemColor;
	
	@Column(name = "item_name")
	private String itemName;
	
	@Column(name = "item_par")
	private Integer itemPar;
	
	@Column(name = "item_units")
	private String itemUnits;
	
	@Column(name = "item_type")
	private String itemType;
	
	@Column(name = "store_id")
	private Integer storeId;
	
	@Column(name = "category")
	private String category;
	
	@Column(name = "updated_by", nullable = false)
	private Integer updatedBy;
	
	@Column(name = "updated_date", insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updatedDate;

	public Item() {
		super();
	}
	
	public Item(Integer itemCode, String itemColor, String itemName,
			Integer itemPar, String itemUnits, String itemType, Integer storeId,
			Integer updatedBy) {
		super();
		this.itemCode = itemCode;
		this.itemColor = itemColor;
		this.itemName = itemName;
		this.itemPar = itemPar;
		this.itemUnits = itemUnits;
		this.itemType = itemType;
		this.storeId = storeId;
		this.updatedBy = updatedBy;
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

	public String getItemType() {
		return itemType;
	}

	public void setItemType(String itemType) {
		this.itemType = itemType;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
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

	public Integer getId() {
		return id;
	}
	
}
