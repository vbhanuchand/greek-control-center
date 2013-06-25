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
@Table(name = "store_key")
public class StoreKey implements Comparable<StoreKey>{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "store_id", nullable = false, insertable=true, updatable=true)
	private Integer storeId;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "type")
	private String type;
	
	@Column(name = "position")
	private String position;
	
	@Column(name = "notes")
	private String notes;
	
	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;
	
	@Column(name = "updated_by", nullable = false)
	private Integer updatedBy;
	
	@Column(name = "updated_date", insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updatedDate;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="store_id", insertable=false, updatable=false)
	private Store store;
	
	
	public StoreKey() {

	}

	public StoreKey(Integer storeId, String name, String type, String position,
			String notes, Integer updatedBy) {
		this.storeId = storeId;
		this.name = name;
		this.type = type;
		this.position = position;
		this.notes = notes;
		this.updatedBy = updatedBy;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
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

	public Integer getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}

	public Integer getId() {
		return id;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public int compareTo(StoreKey that) {
		final int BEFORE = -1;
		final int AFTER = 1;
		if (that == null) {
			return BEFORE;
		}

		Comparable thisRecord = this.getUpdatedDate();
		Comparable thatRecord = that.getUpdatedDate();

		if (thisRecord == null) {
			return AFTER;
		} else if (thatRecord == null) {
			return BEFORE;
		} else {
			return thisRecord.compareTo(thatRecord);
		}
	}
	
}
