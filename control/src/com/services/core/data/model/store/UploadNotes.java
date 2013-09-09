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

@Entity
@Table(name = "upload_docs_notes")
public class UploadNotes implements Serializable {
	
	private static final long serialVersionUID = -5433535995377635869L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "linked_id")
	private Integer linkedId;
	
	@Column(name = "purpose")
	private String purpose;

	@Column(name = "purpose_date")
	@Temporal(TemporalType.DATE)
	private Date purposeDate;
	
	@Column(name = "purpose_notes")
	private String purposeNotes;
	
	@Column(name = "updated_by", nullable = false)
	private Integer updatedBy;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updatedDate;

	public UploadNotes() {
		super();
	}
	
	public UploadNotes(Integer linkedId, String purpose, Date purposeDate,
			String purposeNotes, Integer updatedBy) {
		super();
		this.linkedId = linkedId;
		this.purpose = purpose;
		this.purposeDate = purposeDate;
		this.purposeNotes = purposeNotes;
		this.updatedBy = updatedBy;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public Integer getLinkedId() {
		return linkedId;
	}

	public void setLinkedId(Integer linkedId) {
		this.linkedId = linkedId;
	}

	public Date getPurposeDate() {
		return purposeDate;
	}

	public void setPurposeDate(Date purposeDate) {
		this.purposeDate = purposeDate;
	}

	public String getPurposeNotes() {
		return purposeNotes;
	}

	public void setPurposeNotes(String purposeNotes) {
		this.purposeNotes = purposeNotes;
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
