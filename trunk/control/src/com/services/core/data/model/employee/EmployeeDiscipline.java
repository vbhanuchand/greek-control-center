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
@Table(name = "employee_discipline")
public class EmployeeDiscipline implements Serializable{

	private static final long serialVersionUID = 5291419022510069394L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "employee_id", nullable = false)
	private Integer empId;
	
	@Column(name = "store_id", nullable = false)
	private Integer storeId;
	
	@Column(name = "date", nullable = false)
	@Temporal(TemporalType.DATE)
	private Date date;
	
	@Column(name = "info")
	private String notes;
	
	@Column(name = "info_type")
	private String notesType;
	
	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;
	
	@Column(name = "updated_by")
	private Integer updated_by;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;

	public EmployeeDiscipline() {
		super();
	}

	public EmployeeDiscipline(Integer empId, Integer storeId, Date date, String notes,
			String notesType, Boolean active, Integer updated_by) {
		super();
		this.empId = empId;
		this.storeId = storeId;
		this.date = date;
		this.notes = notes;
		this.notesType = notesType;
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
