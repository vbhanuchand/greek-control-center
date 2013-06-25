package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class StoreDateWrapper extends BaseModel {

	private static final long serialVersionUID = -8464592696877457239L;

	private Integer id;
	
	private Integer storeId;
	
	private Date impDate;
	
	private String notes;
	
	private Boolean active;	
	
	private Integer updatedBy;
	
	private Date updatedDate;

	private StoreWrapper store;	
	
	public StoreDateWrapper() {
		super();
	}

	public StoreDateWrapper(Integer id, Integer storeId, Date impDate, String notes,
			Boolean active, Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.storeId = storeId;
		this.impDate = impDate;
		this.notes = notes;
		this.active = active;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getImpDate() {
		return impDate;
	}

	public void setImpDate(Date impDate) {
		this.impDate = impDate;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Integer getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}

	public Integer getId() {
		return id;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdatedDate() {
		return updatedDate;
	}

	public StoreWrapper getStore() {
		return store;
	}

	public void setStore(StoreWrapper store) {
		this.store = store;
	}

	@Override
	public String toString() {
		return "StoreDateWrapper [storeId=" + storeId + ", impDate=" + impDate
				+ ", notes=" + notes + ", active=" + active + ", updatedBy="
				+ updatedBy + "]";
	}
	
}
