package com.services.core.view.wrappers;

import java.util.Date;

public class MeetingWrapper extends BaseModel {

	private static final long serialVersionUID = -7785403109695659458L;

	private Integer id;

	private String summary;

	private String agenda;

	private Boolean email;

	private String emailText;

	private String fromTime;

	private String toTime;

	private Integer updatedBy;

	private Date updatedDate;

	// These 3 fields are required in UI only --> Will not be stored in DB
	private String calendar="Calendar1";

	private boolean newlyCreated = false;

	private boolean allDay = false;
	
	private String localDateFrom;
	private String localDateTo;
	private String localTimeFrom;
	private String localTimeTo;
	

	// These 3 fields are required in UI only --> Will not be stored in DB

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getAgenda() {
		return agenda;
	}

	public void setAgenda(String agenda) {
		this.agenda = agenda;
	}

	public Boolean getEmail() {
		return email;
	}

	public void setEmail(Boolean email) {
		this.email = email;
	}

	public String getEmailText() {
		return emailText;
	}

	public void setEmailText(String emailText) {
		this.emailText = emailText;
	}

	public String getFromTime() {
		return fromTime;
	}

	public void setFromTime(String fromTime) {
		this.fromTime = fromTime;
	}

	public String getToTime() {
		return toTime;
	}

	public void setToTime(String toTime) {
		this.toTime = toTime;
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

	public String getCalendar() {
		return calendar;
	}

	public void setCalendar(String calendar) {
		this.calendar = calendar;
	}

	public boolean isNewlyCreated() {
		return newlyCreated;
	}

	public void setNewlyCreated(boolean newlyCreated) {
		this.newlyCreated = newlyCreated;
	}

	public boolean isAllDay() {
		return allDay;
	}

	public void setAllDay(boolean allDay) {
		this.allDay = allDay;
	}

	public MeetingWrapper(Integer id, String summary, String agenda,
			Boolean email, String emailText, String fromTime, String toTime,
			Integer updatedBy, Date updatedDate) {
		super();
		this.id = id;
		this.summary = summary;
		this.agenda = agenda;
		this.email = email;
		this.emailText = emailText;
		this.fromTime = fromTime;
		this.toTime = toTime;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}
	
	public MeetingWrapper() {
		super();
	}
	
	public String getLocalDateFrom() {
		return localDateFrom;
	}

	public void setLocalDateFrom(String localDateFrom) {
		this.localDateFrom = localDateFrom;
	}

	public String getLocalDateTo() {
		return localDateTo;
	}

	public void setLocalDateTo(String localDateTo) {
		this.localDateTo = localDateTo;
	}

	public String getLocalTimeFrom() {
		return localTimeFrom;
	}

	public void setLocalTimeFrom(String localTimeFrom) {
		this.localTimeFrom = localTimeFrom;
	}

	public String getLocalTimeTo() {
		return localTimeTo;
	}

	public void setLocalTimeTo(String localTimeTo) {
		this.localTimeTo = localTimeTo;
	}

	@Override
	public String toString() {
		return "MeetingWrapper [id=" + id + ", summary=" + summary
				+ ", agenda=" + agenda + ", email=" + email + ", emailText="
				+ emailText + ", fromTime=" + fromTime + ", toTime=" + toTime
				+ ", updatedBy=" + updatedBy + ", updatedDate=" + updatedDate
				+ ", calendar=" + calendar + ", newlyCreated=" + newlyCreated
				+ ", allDay=" + allDay + "]";
	}

}
