package com.services.core.data.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "meeting_participants")
public class MeetingParticipant implements Serializable {

	private static final long serialVersionUID = -2371064569317711426L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "meeting_id", nullable = false)
	private Integer meetingId;

	@Column(name = "participant_email")
	private String emailId;

	public MeetingParticipant(Integer meetingId, String emailId) {
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

	public MeetingParticipant() {
		super();
	}
	
}
