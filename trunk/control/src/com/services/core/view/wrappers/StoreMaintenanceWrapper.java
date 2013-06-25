package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class StoreMaintenanceWrapper extends BaseModel {

	private static final long serialVersionUID = 9080484053213091647L;

	private Integer id;
	
	private Integer storeId;
	
	private Date date;
	
	private String notes;
	
	private String problem;
	
	private String company;
	
	private String phone;
	
	private Boolean active;
	
	private Integer updatedBy;
	
	private Date updatedDate;
	
	private StoreWrapper store;

	public StoreMaintenanceWrapper(){
		
	}
	
	public StoreMaintenanceWrapper(Integer id, Integer storeId, Date date,
			String notes, String problem, String company, String phone,
			Boolean active, Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.storeId = storeId;
		this.date = date;
		this.notes = notes;
		this.problem = problem;
		this.company = company;
		this.phone = phone;
		this.active = active;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}




	public Integer getStoreId() {
		return storeId;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getProblem() {
		return problem;
	}

	public void setProblem(String problem) {
		this.problem = problem;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
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

	public StoreWrapper getStore() {
		return store;
	}

	public void setStore(StoreWrapper store) {
		this.store = store;
	}

	public Integer getId() {
		return id;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdatedDate() {
		return updatedDate;
	}
	
}
