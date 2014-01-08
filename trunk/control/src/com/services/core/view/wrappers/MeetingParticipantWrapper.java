package com.services.core.view.wrappers;

public class MeetingParticipantWrapper extends BaseModel{
	
	private static final long serialVersionUID = -7276516966878941484L;

	private Integer id;
	
	private Integer meetingId;
	
	private String emailId;

	public MeetingParticipantWrapper(Integer meetingId, String emailId) {
		super();
		this.meetingId = meetingId;
		this.emailId = emailId;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getMeetingId() {
		return meetingId;
	}

	public void setMeetingId(Integer meetingId) {
		this.meetingId = meetingId;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

}
