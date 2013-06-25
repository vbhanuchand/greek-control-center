package com.services.core.data.model.employee;

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

import org.hibernate.annotations.Type;

@Entity
@Table(name = "employee_leaves")
public class EmployeeLeaves implements Serializable{
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "employee_id", nullable = false)
	private Integer empId;
	
	@Column(name = "store_id", nullable = false)
	private Integer storeId;
	
	@Column(name = "on_date")
	@Temporal(TemporalType.DATE)
	private Date date;
	
	@Column(name = "reason")
	private String reason;
	
	@Column(name = "excused")
	@Type(type="yes_no")
	private Boolean excused;
	
	@Column(name = "hrs_active")
	private Integer activeHrs;
	
	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;
	
	@Column(name = "updated_by")
	private Integer updated_by;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;

	public EmployeeLeaves() {
		super();
	}

	public EmployeeLeaves(Integer empId, Integer storeId, Date date, String reason,
			Boolean excused, Integer activeHrs, Boolean active,
			Integer updated_by) {
		super();
		this.empId = empId;
		this.storeId = storeId;
		this.date = date;
		this.reason = reason;
		this.excused = excused;
		this.activeHrs = activeHrs;
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

	public Integer getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(Integer updated_by) {
		this.updated_by = updated_by;
	}

	public Date getUpdated_date() {
		return updated_date;
	}

	public void setUpdated_date(Date updated_date) {
		this.updated_date = updated_date;
	}

}
