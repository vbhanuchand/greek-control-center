package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class EmployeeLeavesWrapper extends BaseModel {

	private static final long serialVersionUID = 3573506110730900092L;
	
	private Integer id;
	
	private Integer empId;
	
	private Integer storeId;
	
	private Date date;
	
	private String reason;
	
	private Boolean excused;
	
	private Integer activeHrs;
	
	private Boolean active;
	
	private Integer updatedBy;
	
	private Date updatedDate;
	
	public EmployeeLeavesWrapper() {
		super();
	}

	public EmployeeLeavesWrapper(Integer id, Integer empId, Integer storeId, Date date, String reason,
			Boolean excused, Integer activeHrs, Boolean active,
			Integer updated_by) {
		super();
		this.id = id;
		this.empId = empId;
		this.storeId = storeId;
		this.date = date;
		this.reason = reason;
		this.excused = excused;
		this.activeHrs = activeHrs;
		this.active = active;
		this.updatedBy = updated_by;
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

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Boolean getExcused() {
		return excused;
	}

	public void setExcused(Boolean excused) {
		this.excused = excused;
	}

	public Integer getActiveHrs() {
		return activeHrs;
	}

	public void setActiveHrs(Integer activeHrs) {
		this.activeHrs = activeHrs;
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

	public void setUpdatedDate(Date updated_date) {
		this.updatedDate = updated_date;
	}
	
}
