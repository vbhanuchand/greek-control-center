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
@Table(name="store_invoice_details")
public class StoreInvoiceDetails implements Serializable {
	
	private static final long serialVersionUID = -1780451337119055832L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "invoice_id", nullable = false)
	private Integer invoiceId;

	@Column(name = "item_id")
	private Integer itemId;

	@Column(name = "item_cat_id")
	private Integer itemCategory;

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

	public StoreInvoiceDetails() {
		super();
	}

	public StoreInvoiceDetails(Integer invoiceId, Integer itemId,
			Integer itemCategory, Integer itemStock, Integer itemOrder,
			Double itemPricePerUnit, Double itemGSPercent, Integer updatedBy) {
		super();
		this.invoiceId = invoiceId;
		this.itemId = itemId;
		this.itemCategory = itemCategory;
		this.itemStock = itemStock;
		this.itemOrder = itemOrder;
		this.itemPricePerUnit = itemPricePerUnit;
		this.itemGSPercent = itemGSPercent;
		this.updatedBy = updatedBy;
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

	public Integer getId() {
		return id;
	}
	
}
