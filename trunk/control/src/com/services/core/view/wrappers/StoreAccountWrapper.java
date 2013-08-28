package com.services.core.view.wrappers;

import java.util.Date;

public class StoreAccountWrapper extends BaseModel{
	
	private static final long serialVersionUID = 1113313185413815342L;

	private Integer id;
	
	private Integer storeId;
	
	private Integer quarter;
	
	private Integer year;

	private Double labor;

	private Double foodCost;

	private Double advertisement;

	private Double misc;

	private Double profit;
	
	private Boolean active;

	private Integer updatedBy;

	private Date updatedDate;

	public StoreAccountWrapper() {
		super();
	}

	public StoreAccountWrapper(Integer id, Integer storeId, Integer quarter,
			Integer year, Double labor, Double foodCost, Double advertisement,
			Double misc, Double profit, Boolean active, Integer updated_by,
			Date updated_date) {
		super();
		this.id = id;
		this.storeId = storeId;
		this.quarter = quarter;
		this.year = year;
		this.labor = labor;
		this.foodCost = foodCost;
		this.advertisement = advertisement;
		this.misc = misc;
		this.profit = profit;
		this.active = active;
		this.updatedBy = updated_by;
		this.updatedDate = updated_date;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
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

	public Double getLabor() {
		return labor;
	}

	public void setLabor(Double labor) {
		this.labor = labor;
	}

	public Double getFoodCost() {
		return foodCost;
	}

	public void setFoodCost(Double foodCost) {
		this.foodCost = foodCost;
	}

	public Double getAdvertisement() {
		return advertisement;
	}

	public void setAdvertisement(Double advertisement) {
		this.advertisement = advertisement;
	}

	public Double getMisc() {
		return misc;
	}

	public void setMisc(Double misc) {
		this.misc = misc;
	}

	public Double getProfit() {
		return profit;
	}

	public void setProfit(Double profit) {
		this.profit = profit;
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

	public void setUpdated_by(Integer updated_by) {
		this.updatedBy = updated_by;
	}

	public Date getUpdated_date() {
		return updatedDate;
	}

	public void setUpdated_date(Date updated_date) {
		this.updatedDate = updated_date;
	}
	
}
