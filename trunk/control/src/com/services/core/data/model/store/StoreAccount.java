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
@Table(name = "store_accounting")
public class StoreAccount implements Serializable {

	private static final long serialVersionUID = -939502970582437512L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "store_id", nullable = false)
	private Integer storeId;

	@Column(name = "quarter")
	private Integer quarter;

	@Column(name = "yyyy")
	private Integer year;

	@Column(name = "laborAmt")
	private Double labor;

	@Column(name = "foodCostAmt")
	private Double foodCost;

	@Column(name = "advtAmt")
	private Double advertisement;

	@Column(name = "miscAmt")
	private Double misc;

	@Column(name = "profitAmt")
	private Double profit;
	
	@Column(name = "totalSales")
	private Double totalSales;
	
	@Column(name = "totalOpExp")
	private Double totalOpExp;
	
	@Column(name = "totalProfits")
	private Double totalProfits;
	
	@Column(name = "active")
	@Type(type = "yes_no")
	private Boolean active;

	@Column(name = "updated_by")
	private Integer updated_by;

	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;

	public StoreAccount() {
		super();
	}

	public StoreAccount(Integer storeId, Integer quarter, Integer year,
			Double labor, Double foodCost, Double advertisement, Double misc,
			Double profit, Double totalSales, Double totalOpExp, Double totalProfits, Boolean active, Integer updated_by) {
		super();
		this.storeId = storeId;
		this.quarter = quarter;
		this.year = year;
		this.labor = labor;
		this.foodCost = foodCost;
		this.advertisement = advertisement;
		this.misc = misc;
		this.profit = profit;
		this.totalSales = totalSales;
		this.totalOpExp = totalOpExp;
		this.totalProfits = totalProfits;
		this.active = active;
		this.updated_by = updated_by;
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

	public Double getTotalSales() {
		return totalSales;
	}

	public void setTotalSales(Double totalSales) {
		this.totalSales = totalSales;
	}

	public Double getTotalOpExp() {
		return totalOpExp;
	}

	public void setTotalOpExp(Double totalOpExp) {
		this.totalOpExp = totalOpExp;
	}

	public Double getTotalProfits() {
		return totalProfits;
	}

	public void setTotalProfits(Double totalProfits) {
		this.totalProfits = totalProfits;
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

	public Integer getId() {
		return id;
	}
	
}

