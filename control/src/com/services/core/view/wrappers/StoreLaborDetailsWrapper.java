package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;
import com.services.core.view.utils.CustomTimeSerializer;

public class StoreLaborDetailsWrapper extends BaseModel{

	private static final long serialVersionUID = -1298091143273298993L;

	private int id;
	
	private int empId;
	
	private String fname;
	
	private String summary;
	
	private String position;
	
	private int YYYY;
	
	private int MM;
	
	private int DD;
	
	private int beginHH;
	
	private int beginMi;
	
	private int endHH;
	
	private int endMi;
	
	private double totalTime;
	
	private String calendar;
	
	private Date startDate;
	
	private Date endDate;
	
	private Integer actualBeginTime;
	
	private Integer actualEndTime;

	public StoreLaborDetailsWrapper() {
		super();
	}

	public StoreLaborDetailsWrapper(int id, int empId, String fname, String summary, String position, int yYYY, int mM,
			int dD, int beginHH, int beginMi, int endHH, int endMi, double totalTime, 
			String calendar) {
		super();
		this.id = id;
		this.empId = empId;
		this.fname = fname;
		this.summary = summary;
		this.position = position;
		this.YYYY = yYYY;
		this.MM = mM;
		this.DD = dD;
		this.beginHH = beginHH;
		this.beginMi = beginMi;
		this.endHH = endHH;
		this.endMi = endMi;
		this.totalTime = totalTime;
		this.calendar = calendar;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getEmpId() {
		return empId;
	}

	public void setEmpId(int id) {
		this.empId = id;
	}
	
	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}
	
	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}
	
	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public int getYYYY() {
		return YYYY;
	}

	public void setYYYY(int yYYY) {
		YYYY = yYYY;
	}

	public int getMM() {
		return MM;
	}

	public void setMM(int mM) {
		MM = mM;
	}

	public int getDD() {
		return DD;
	}

	public void setDD(int dD) {
		DD = dD;
	}

	public int getBeginHH() {
		return beginHH;
	}

	public void setBeginHH(int beginHH) {
		this.beginHH = beginHH;
	}

	public int getBeginMi() {
		return beginMi;
	}

	public void setBeginMi(int beginMi) {
		this.beginMi = beginMi;
	}

	public int getEndHH() {
		return endHH;
	}

	public void setEndHH(int endHH) {
		this.endHH = endHH;
	}

	public int getEndMi() {
		return endMi;
	}

	public void setEndMi(int endMi) {
		this.endMi = endMi;
	}

	public double getTotalTime() {
		return totalTime;
	}

	public void setTotalTime(double totalTime) {
		this.totalTime = totalTime;
	}

	public String getCalendar() {
		return calendar;
	}

	public void setCalendar(String calendar) {
		this.calendar = calendar;
	}

	@JsonSerialize(using = CustomTimeSerializer.class)
	public Integer getActualBeginTime() {
		return actualBeginTime;
	}

	public void setActualBeginTime(Integer actualBeginTime) {
		this.actualBeginTime = actualBeginTime;
	}

	@JsonSerialize(using = CustomTimeSerializer.class)
	public Integer getActualEndTime() {
		return actualEndTime;
	}

	public void setActualEndTime(Integer actualEndTime) {
		this.actualEndTime = actualEndTime;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
}
