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
@Table(name = "employee_labor")
public class EmployeeLabor implements Serializable {

	private static final long serialVersionUID = 6229923309726923941L;

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
	
	@Column(name = "time_from_hr_min", nullable = false)
	private Integer from;
	
	@Column(name = "time_to_hr_min", nullable = false)
	private Integer to;
	
	@Column(name = "total_hrs", nullable = false)
	private Double totalTime;
	
	@Column(name = "position", nullable = false)
	private String position;
	
	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;
	
	@Column(name = "updated_by")
	private Integer updated_by;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;

	public EmployeeLabor() {
		super();
	}

	public EmployeeLabor(Integer empId, Integer storeId, Date date,
			Integer from, Integer to, String position, Boolean active, Integer updated_by) {
		super();
		this.empId = empId;
		this.storeId = storeId;
		this.date = date;
		this.from = from;
		this.to = to;
		this.position = position;
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

	public Integer getFrom() {
		return from;
	}

	public void setFrom(Integer from) {
		this.from = from;
	}

	public Integer getTo() {
		return to;
	}

	public void setTo(Integer to) {
		this.to = to;
	}

	public Double getTotalTime() {
		return totalTime;
	}

	public void setTotalTime(Double totalTime) {
		this.totalTime = totalTime;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
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
