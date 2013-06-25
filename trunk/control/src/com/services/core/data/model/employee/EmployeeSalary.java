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
@Table(name = "employee_salary")
public class EmployeeSalary implements Serializable {

	private static final long serialVersionUID = -2153294991734803046L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "employee_id", nullable = false)
	private Integer empId;
	
	@Column(name = "store_id", nullable = false)
	private Integer storeId;
	
	@Column(name = "increment_amt")
	private Double increment;
	
	@Column(name = "increment_date", nullable = true)
	@Temporal(TemporalType.DATE)
	private Date incrementDate;
	
	@Column(name = "salary_bef_inc")
	private Double salBefInc;
	
	@Column(name = "salary_aft_inc")
	private Double salAftInc;
	
	@Column(name = "notes")
	private String notes;
	
	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;
	
	@Column(name = "updated_by")
	private Integer updated_by;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;

	public EmployeeSalary() {
		super();
	}

	public EmployeeSalary(Integer empId, Integer storeId, Double increment,
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

	public Date getUpdated_date() {
		return updated_date;
	}

	public void setUpdated_date(Date updated_date) {
		this.updated_date = updated_date;
	}
	
}
