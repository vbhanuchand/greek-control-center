package com.services.core.view.wrappers;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class EmployeeDisciplineWrapper extends BaseModel {

	private static final long serialVersionUID = -8467759332725870188L;

	private Integer id;
	
	private Integer empId;
	
	private Integer storeId;
	
	private String notes;
	
	private String notesType;
	
	private Date date;
	
	private Boolean active;
	
	private Integer updatedBy;
	
	private Date updatedDate;
	
	private Set<StoreWrapper> store = new HashSet<StoreWrapper>();

	public EmployeeDisciplineWrapper() {
		super();
	}
	
	public EmployeeDisciplineWrapper(Integer id, Integer empId,
			Integer storeId, Date date, String notes, String notesType, Boolean active,
			Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.empId = empId;
		this.storeId = storeId;
		this.date = date;
		this.notes = notes;
		this.notesType = notesType;
		this.active = active;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getEmpId() {
		return empId;
	}

	public void setEmpId(Integer empId) {
		this.empId = empId;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
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

	public String getNotesType() {
		return notesType;
	}

	public void setNotesType(String notesType) {
		this.notesType = notesType;
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

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Set<StoreWrapper> getStore() {
		return store;
	}

	public void setStore(Set<StoreWrapper> store) {
		this.store = store;
	}
	
}
