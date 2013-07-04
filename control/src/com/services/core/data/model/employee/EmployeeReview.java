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
@Table(name = "employee_review")
public class EmployeeReview implements Serializable {

	private static final long serialVersionUID = -939502970582437512L;

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

	@Column(name = "notes")
	private String notes;

	@Column(name = "quarter")
	private Integer quarter;

	@Column(name = "yyyy")
	private Integer year;

	@Column(name = "bonus")
	private Double bonus;

	@Column(name = "possible_bonus")
	private Double possibleBonus;

	@Column(name = "active")
	@Type(type = "yes_no")
	private Boolean active;

	@Column(name = "updated_by")
	private Integer updated_by;

	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;

	public EmployeeReview() {
		super();
	}

	public EmployeeReview(Integer empId, Integer storeId, Date date,
			String notes, Integer quarter, Integer year, Double bonus,
			Double possibleBonus, Boolean active, Integer updated_by) {
		super();
		this.empId = empId;
		this.storeId = storeId;
		this.date = date;
		this.notes = notes;
		this.quarter = quarter;
		this.year = year;
		this.bonus = bonus;
		this.possibleBonus = possibleBonus;
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

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Integer getQuarter() {
		return quarter;
	}

	public void setQuarter(Integer quarter) {
		this.quarter = quarter;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Double getBonus() {
		return bonus;
	}

	public void setBonus(Double bonus) {
		this.bonus = bonus;
	}

	public Double getPossibleBonus() {
		return possibleBonus;
	}

	public void setPossibleBonus(Double possibleBonus) {
		this.possibleBonus = possibleBonus;
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
