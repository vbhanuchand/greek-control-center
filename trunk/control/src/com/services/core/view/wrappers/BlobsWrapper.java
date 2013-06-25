package com.services.core.view.wrappers;

import java.util.Date;

public class BlobsWrapper extends BaseModel{
	
	private static final long serialVersionUID = 6872801792281820201L;

	private Integer id;
	
	private Integer linkedId;
	
	private String fileName;
	
	private String blobKey;
	
	private String tab;
	
	private Boolean active;	
	
	private Integer updatedBy;
	
	private Date updatedDate;
	
	public BlobsWrapper() {
		super();
	}

	public BlobsWrapper(Integer id, Integer linkedId, String fileName, String blobKey, String tab,
			Boolean active, Integer updatedBy) {
		super();
		this.id = id;
		this.linkedId = linkedId;
		this.fileName = fileName;
		this.blobKey = blobKey;
		this.tab = tab;
		this.active = active;
		this.updatedBy = updatedBy;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getLinkedId() {
		return linkedId;
	}

	public void setLinkedId(Integer linkedId) {
		this.linkedId = linkedId;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getBlobKey() {
		return blobKey;
	}

	public void setBlobKey(String blobKey) {
		this.blobKey = blobKey;
	}

	public String getTab() {
		return tab;
	}

	public void setTab(String tab) {
		this.tab = tab;
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
	
}
