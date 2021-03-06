package com.services.core.data.model.store;

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
@Table(name="store_stock")
public class StoreStock implements Serializable {
	
	private static final long serialVersionUID = -1780451337119055832L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "store_id", nullable = false)
	private Integer storeId;
	
	@Column(name = "category")
	private String category;

	@Column(name = "item_id")
	private Integer itemId;

	@Column(name = "item_stock")
	private Integer itemStock;

	@Column(name = "item_order")
	private Integer itemOrder;

	@Column(name = "item_ppu")
	private Double itemPricePerUnit;

	@Column(name = "item_gs_charge")
	private Double itemGSPercent;

	@Column(name = "updated_by")
	private Integer updatedBy;

	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updatedDate;

	public StoreStock() {
		super();
	}

	public StoreStock(Integer storeId, Integer itemId,
			Integer itemStock, Integer itemOrder,
			Double itemPricePerUnit, Double itemGSPercent, Integer updatedBy) {
		super();
		this.storeId = storeId;
		this.itemId = itemId;
		this.itemStock = itemStock;
		this.itemOrder = itemOrder;
		this.itemPricePerUnit = itemPricePerUnit;
		this.itemGSPercent = itemGSPercent;
		this.updatedBy = updatedBy;
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
	
	public Integer getItemId() {
		return itemId;
	}

	public void setItemId(Integer itemId) {
		this.itemId = itemId;
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

	public Integer getId() {
		return id;
	}
	
}
