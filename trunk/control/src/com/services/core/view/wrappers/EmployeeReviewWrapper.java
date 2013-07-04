package com.services.core.view.wrappers;

import java.util.Date;

public class EmployeeReviewWrapper extends BaseModel{

	private static final long serialVersionUID = -9172438961448921186L;

	private Integer id;
	
	private Integer empId;
	
	private Integer storeId;
	
	private Integer quartersList;
	
	private Double possibleBonus;
	
	private Date bonusDate;
	
	private Double bonusAmt;
	
	private String quarterlyNotes;
	
	private Integer year;
	
	private Boolean active;
	
	private Integer updatedBy;
	
	private Date updatedDate;

	public EmployeeReviewWrapper() {
		super();
	}

	public EmployeeReviewWrapper(Integer id, Integer empId, Integer storeId,
			Integer quartersList, Double possibleBonus, Date bonusDate,
			Double bonusAmt, String quarterlyNotes, Integer year,
			Boolean active, Integer updatedBy) {
		super();
		this.id = id;
		this.empId = empId;
		this.storeId = storeId;
		this.quartersList = quartersList;
		this.possibleBonus = possibleBonus;
		this.bonusDate = bonusDate;
		this.bonusAmt = bonusAmt;
		this.quarterlyNotes = quarterlyNotes;
		this.year = year;
		this.active = active;
		this.updatedBy = updatedBy;
	}
	
	public EmployeeReviewWrapper(Integer id, Integer empId, Integer storeId,
			Integer quartersList, Double possibleBonus, Date bonusDate,
			Double bonusAmt, String quarterlyNotes, Integer year,
			Boolean active, Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.empId = empId;
		this.storeId = storeId;
		this.quartersList = quartersList;
		this.possibleBonus = possibleBonus;
		this.bonusDate = bonusDate;
		this.bonusAmt = bonusAmt;
		this.quarterlyNotes = quarterlyNotes;
		this.year = year;
		this.active = active;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
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

	public Integer getQuartersList() {
		return quartersList;
	}

	public void setQuartersList(Integer quartersList) {
		this.quartersList = quartersList;
	}

	public Double getPossibleBonus() {
		return possibleBonus;
	}

	public void setPossibleBonus(Double possibleBonus) {
		this.possibleBonus = possibleBonus;
	}

	public Date getBonusDate() {
		return bonusDate;
	}

	public void setBonusDate(Date bonusDate) {
		this.bonusDate = bonusDate;
	}

	public Double getBonusAmt() {
		return bonusAmt;
	}

	public void setBonusAmt(Double bonusAmt) {
		this.bonusAmt = bonusAmt;
	}

	public String getQuarterlyNotes() {
		return quarterlyNotes;
	}

	public void setQuarterlyNotes(String quarterlyNotes) {
		this.quarterlyNotes = quarterlyNotes;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
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
