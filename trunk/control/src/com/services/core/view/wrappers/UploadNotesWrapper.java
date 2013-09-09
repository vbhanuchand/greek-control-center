package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class UploadNotesWrapper extends BaseModel {

	private static final long serialVersionUID = -2842460175608278277L;
	
	private Integer id;
	private Integer linkedId;
	private String purpose;
	private Date purposeDate;
	private String purposeNotes;
	private Integer updatedBy;
	private Date updatedDate;
	private String blobKey;
	private String fileName;

	public UploadNotesWrapper() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
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

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public String getBlobKey() {
		return blobKey;
	}

	public void setBlobKey(String blobKey) {
		this.blobKey = blobKey;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public Integer getLinkedId() {
		return linkedId;
	}

	public void setLinkedId(Integer linkedId) {
		this.linkedId = linkedId;
	}

}
