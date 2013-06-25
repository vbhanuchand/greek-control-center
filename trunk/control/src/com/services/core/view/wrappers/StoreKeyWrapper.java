package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;


public class StoreKeyWrapper extends BaseModel {

	private static final long serialVersionUID = -9022442348744955308L;

	private Integer id;
	
	private Integer storeId;
	
	private String name;
	
	private String type;
	
	private String position;
	
	private String notes;
	
	private Boolean active;
	
	private Integer updatedBy;
	
	private Date updatedDate;

	private StoreWrapper store;
	
	public StoreKeyWrapper(){
		super();
	}
	
	public StoreKeyWrapper(Integer id, Integer storeId, String name,
			String type, String position, String notes, Boolean active,
			Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.storeId = storeId;
		this.name = name;
		this.type = type;
		this.position = position;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
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
	
}
