package com.services.core.view.wrappers;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

public class EmployeeWrapper extends BaseModel {

	
	private static final long serialVersionUID = 8365412065120180996L;
	
	private Integer id;
	private String username;
	private String fname;
	private String lname;
	private String phone;
	
	private String personalPhone;
	private String emergencyContact;
	private String address;
	
	private String position;
	private Integer mgr;
	private Integer storeId;
	private Boolean active;
	private Integer updatedBy;
	private Date updatedDate;
	private Date hiredDate;
	private Set<StoreWrapper> store = new HashSet<StoreWrapper>();
	private Set<RoleWrapper> employeeRoles = new HashSet<RoleWrapper>();

	public EmployeeWrapper(){
		super();
	}
	
	public EmployeeWrapper(Integer id, String username, String fname,
			String lname, String phone, String personalPhone, String emergencyContact, String address, String position, Integer mgr, Boolean active, Integer updatedBy, Date hiredDate) {
		super();
		this.id = id;
		this.username = username;
		this.fname = fname;
		this.lname = lname;
		this.phone = phone;
		this.personalPhone = personalPhone;
		this.emergencyContact = emergencyContact;
		this.address = address;
		this.position = position;
		this.mgr = mgr;
		this.active = active;
		this.updatedBy = updatedBy;
		this.hiredDate = hiredDate;
	}



	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public String getPersonalPhone() {
		return personalPhone;
	}

	public void setPersonalPhone(String personalPhone) {
		this.personalPhone = personalPhone;
	}

	public String getEmergencyContact() {
		return emergencyContact;
	}

	public void setEmergencyContact(String emergencyContact) {
		this.emergencyContact = emergencyContact;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public Integer getMgr() {
		return mgr;
	}

	public void setMgr(Integer mgr) {
		this.mgr = mgr;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getHiredDate() {
		return hiredDate;
	}

	public void setHiredDate(Date hiredDate) {
		this.hiredDate = hiredDate;
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

	public Set<StoreWrapper> getStore() {
		return store;
	}

	public void setStore(Set<StoreWrapper> store) {
		this.store = store;
	}

	public Set<RoleWrapper> getEmployeeRoles() {
		return employeeRoles;
	}

	public void setEmployeeRoles(Set<RoleWrapper> employeeRoles) {
		this.employeeRoles = employeeRoles;
	}
	
}