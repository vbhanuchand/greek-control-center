package com.services.core.data.model;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

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
@Table(name = "meeting")
public class Meeting implements Serializable {

	private static final long serialVersionUID = -3099454034483122107L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "summary")
	private String summary;

	@Column(name = "agenda")
	private String agenda;

	@Column(name = "email")
	@Type(type = "yes_no")
	private Boolean email;

	@Column(name = "email_text")
	private String emailText;

	@Column(name = "fromTime")
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar fromTime;
	
	@Column(name = "toTime")
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar toTime;

	@Column(name = "updated_by", nullable = false)
	private Integer updatedBy;

	@Column(name = "updated_date", nullable = false, insertable = true, updatable = true)
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar updatedDate = Calendar.getInstance();

	public Meeting() {
		super();
	}

	public Meeting(String summary, String agenda, Boolean email,
			String emailText, Calendar fromTime, Calendar toTime, Integer updatedBy) {
		super();
		this.summary = summary;
		this.agenda = agenda;
		this.email = email;
		this.emailText = emailText;
		this.fromTime = fromTime;
		this.toTime = toTime;
		this.updatedBy = updatedBy;
	}

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

	public Calendar getFromTime() {
		return fromTime;
	}

	public void setFromTime(Calendar fromTime) {
		this.fromTime = fromTime;
	}

	public Calendar getToTime() {
		return toTime;
	}

	public void setToTime(Calendar toTime) {
		this.toTime = toTime;
	}

	public Integer getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}

	public Calendar getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Calendar updatedDate) {
		this.updatedDate = updatedDate;
	}
	
}
