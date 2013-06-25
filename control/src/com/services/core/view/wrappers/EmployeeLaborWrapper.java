package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class EmployeeLaborWrapper extends BaseModel {

	private static final long serialVersionUID = -2994043483732724574L;

	private Integer id;
	
	private Integer empId;
	
	private Integer storeId;
	
	private Date date;
	
	private Integer from;
	
	private Integer to;
	
	private String timeFrom;
	
	private String timeTo;
	
	private String position;
	
	private Boolean active;
	
	private Integer updatedBy;
	
	private Date updatedDate;

	public EmployeeLaborWrapper() {
		super();
	}

	public EmployeeLaborWrapper(Integer id, Integer empId, Integer storeId,
			Date date, Integer from, Integer to, String position, Boolean active,
			Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.empId = empId;
		this.storeId = storeId;
		this.date = date;
		this.from = from;
		this.to = to;
		this.position = position;
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

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Integer getFrom() {
		if((this.timeFrom != null) && this.timeFrom.replaceAll(":", "").matches("[0-9]+")){
			return Integer.parseInt(this.timeFrom.replaceAll(":", ""));
		} else return from;
	}

	public void setFrom(Integer from) {
		this.from = from;
	}

	public Integer getTo() {
		if((this.timeTo != null) && this.timeTo.replaceAll(":", "").matches("[0-9]+")){
			return Integer.parseInt(this.timeTo.replaceAll(":", ""));
		} else return to;
	}

	public void setTo(Integer to) {
		this.to = to;
	}

	public String getTimeFrom() {
		if((from!= null) && (from > 0)) return convertIntToHHMM(from);
		else return timeFrom;
	}

	public void setTimeFrom(String timeFrom) {
		this.timeFrom = timeFrom;
	}

	public String getTimeTo() {
		if((to != null) && (to > 0)) return convertIntToHHMM(to);
		else return timeTo;
	}

	public void setTimeTo(String timeTo) {
		this.timeTo = timeTo;
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
	
	public String convertIntToHHMM(int hhmm){
		String returnVal = "00:00";
		String hrs = "";
		String mins = "";
		if(hhmm > 0){
			hrs = String.valueOf(hhmm/100);
			mins = String.valueOf(hhmm%100);
			returnVal = ((hrs.length() == 2) ?  hrs : "0"+hrs) + ":" + ((mins.length() == 2) ?  mins : "0"+mins) ;
		}
		return returnVal;
	}

	@Override
	public String toString() {
		return "EmployeeLaborWrapper [id=" + id + ", empId=" + empId
				+ ", storeId=" + storeId + ", date=" + date + ", from=" + from
				+ ", to=" + to + ", timeFrom=" + this.getTimeFrom() + ", timeTo="
				+ this.getTimeTo() + ", position=" + position + ", active=" + active
				+ ", updatedBy=" + updatedBy + ", updatedDate=" + updatedDate + ", from=" + this.getFrom() + ", to=" + this.getTo()
				+ "]";
	}
	
}
