package com.services.core.view.wrappers;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class EmployeeSalaryWrapper extends BaseModel{

	private static final long serialVersionUID = -3731731028721430825L;

	private Integer id;
	
	private Integer empId;
	
	private Integer storeId;
	
	private Double increment;
	
	private Date incrementDate;
	
	private Double salBefInc;
	
	private Double salAftInc;
	
	private String notes;
	
	private Boolean active;
	
	private Integer updated_by;
	
	private Date updated_date;
	
	private Set<StoreWrapper> store = new HashSet<StoreWrapper>();
	
	public EmployeeSalaryWrapper() {
		super();
	}

	public EmployeeSalaryWrapper(Integer empId, Integer storeId, Double increment,
			Date incrementDate, Double salBefInc, Double salAftInc, String notes,
			Boolean active, Integer updated_by) {
		super();
		this.empId = empId;
		this.storeId = storeId;
		this.increment = increment;
		this.incrementDate = incrementDate;
		this.salBefInc = salBefInc;
		this.salAftInc = salAftInc;
		this.notes = notes;
		this.active = active;
		this.updated_by = updated_by;
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

	public Double getIncrement() {
		return increment;
	}

	public void setIncrement(Double increment) {
		this.increment = increment;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getIncrementDate() {
		return incrementDate;
	}

	public void setIncrementDate(Date incrementDate) {
		this.incrementDate = incrementDate;
	}

	public Double getSalBefInc() {
		return salBefInc;
	}

	public void setSalBefInc(Double salBefInc) {
		this.salBefInc = salBefInc;
	}

	public Double getSalAftInc() {
		return salAftInc;
	}

	public void setSalAftInc(Double salAftInc) {
		this.salAftInc = salAftInc;
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

	public Integer getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(Integer updated_by) {
		this.updated_by = updated_by;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdated_date() {
		return updated_date;
	}

	public void setUpdated_date(Date updated_date) {
		this.updated_date = updated_date;
	}

	public Set<StoreWrapper> getStore() {
		return store;
	}

	public void setStore(Set<StoreWrapper> store) {
		this.store = store;
	}
	
}
