package com.services.core.view.wrappers;

import java.util.Date;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class StoreInvoiceWrapper extends BaseModel{
	
	private static final long serialVersionUID = -8826673171129748310L;
	
	private int id;
	
	private int storeId;
	
	private Date invoiceDate;
	
	private boolean locked;
	
	private boolean active;
	
	private int updatedBy;
	
	private Date updatedDate;
	
	private List<StoreInvoiceDetailsWrapper> invoiceDetails;
	
	private double gsCharges;
	
	private double totalCharges;
	
	public StoreInvoiceWrapper() {
		super();
	}
	
	public StoreInvoiceWrapper(int id, int storeId, Date invoiceDate,
			boolean locked, boolean active, int updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.storeId = storeId;
		this.invoiceDate = invoiceDate;
		this.locked = locked;
		this.active = active;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}

	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public int getStoreId() {
		return storeId;
	}
	
	public void setStoreId(int storeId) {
		this.storeId = storeId;
	}
	
	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getInvoiceDate() {
		return invoiceDate;
	}
	
	public void setInvoiceDate(Date invoiceDate) {
		this.invoiceDate = invoiceDate;
	}
	
	public boolean isLocked() {
		return locked;
	}
	
	public void setLocked(boolean locked) {
		this.locked = locked;
	}
	
	public boolean isActive() {
		return active;
	}
	
	public void setActive(boolean active) {
		this.active = active;
	}
	
	public int getUpdatedBy() {
		return updatedBy;
	}
	
	public void setUpdatedBy(int updatedBy) {
		this.updatedBy = updatedBy;
	}
	
	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdatedDate() {
		return updatedDate;
	}
	
	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public List<StoreInvoiceDetailsWrapper> getInvoiceDetails() {
		return invoiceDetails;
	}

	public void setInvoiceDetails(List<StoreInvoiceDetailsWrapper> invoiceDetails) {
		this.invoiceDetails = invoiceDetails;
	}
	
	public double getGsCharges() {
		return gsCharges;
	}

	public void setGsCharges(double gsCharges) {
		this.gsCharges = gsCharges;
	}

	public double getTotalCharges() {
		return totalCharges;
	}

	public void setTotalCharges(double totalCharges) {
		this.totalCharges = totalCharges;
	}

	@Override
	public String toString() {
		return "StoreInvoiceWrapper [storeId=" + storeId + ", invoiceDate="
				+ invoiceDate + ", locked=" + locked + ", active=" + active
				+ ", updatedBy=" + updatedBy + ", updatedDate=" + updatedDate
				+ ", invoiceDetails=" + invoiceDetails + "]";
	}

}
