package com.services.core.data.model.store;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Type;

@Entity
@Table(name = "store_maintenance")
public class StoreMaintenance implements Comparable<StoreMaintenance> {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "store_id", nullable = false, insertable = true, updatable = true)
	private Integer storeId;

	@Column(name = "date")
	@Temporal(TemporalType.DATE)
	private Date date;

	@Column(name = "notes")
	private String notes;

	@Column(name = "m_problem")
	private String problem;

	@Column(name = "m_company")
	private String company;

	@Column(name = "m_phone")
	private String phone;

	@Column(name = "active")
	@Type(type = "yes_no")
	private Boolean active;

	@Column(name = "updated_by", nullable = false)
	private Integer updatedBy;

	@Column(name = "updated_date", insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updatedDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "store_id", insertable = false, updatable = false)
	private Store store;

	public StoreMaintenance() {

	}

	public StoreMaintenance(Integer storeId, Date date, String notes,
			String problem, String company, String phone, Integer updatedBy) {
		this.storeId = storeId;
		this.date = date;
		this.notes = notes;
		this.problem = problem;
		this.company = company;
		this.phone = phone;
		this.updatedBy = updatedBy;
	}

	public Integer getStoreId() {
		return storeId;
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

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	public Integer getId() {
		return id;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public int compareTo(StoreMaintenance that) {
		final int BEFORE = -1;
		final int AFTER = 1;
		if (that == null) {
			return BEFORE;
		}

		Comparable thisRecord = this.getDate();
		Comparable thatRecord = that.getDate();

		if (thisRecord == null) {
			return AFTER;
		} else if (thatRecord == null) {
			return BEFORE;
		} else {
			return thisRecord.compareTo(thatRecord);
		}
	}

}
