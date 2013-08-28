package com.services.core.data.model.store;

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
@Table(name = "store_invoice")
public class StoreInvoice implements Serializable {
	
	private static final long serialVersionUID = 855960073134953318L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "store_id", nullable = false)
	private Integer storeId;
	
	@Column(name = "invoice_date", nullable = true)
	@Temporal(TemporalType.DATE)
	private Date invoiceDate;
	
	@Column(name = "locked")
	@Type(type = "yes_no")
	private Boolean locked;
	
	@Column(name = "active")
	@Type(type = "yes_no")
	private Boolean active;
	
	@Column(name = "updated_by")
	private Integer updatedBy;

	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updatedDate;

	public StoreInvoice() {
		super();
	}

	public StoreInvoice(Integer storeId, Date invoiceDate, Boolean locked,
			Boolean active, Integer updatedBy) {
		super();
		this.storeId = storeId;
		this.invoiceDate = invoiceDate;
		this.locked = locked;
		this.active = active;
		this.updatedBy = updatedBy;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	public Date getInvoiceDate() {
		return invoiceDate;
	}

	public void setInvoiceDate(Date invoiceDate) {
		this.invoiceDate = invoiceDate;
	}

	public Boolean getLocked() {
		return locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
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

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Integer getId() {
		return id;
	}
	
}
