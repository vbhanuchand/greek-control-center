package com.services.core.data.model.employee;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Type;

import com.services.core.data.model.Role;
import com.services.core.data.model.store.Store;

@Entity
@Table(name = "employee")
public class Employee implements Serializable {

	private static final long serialVersionUID = -4287998779286366932L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "username", nullable = false)
	private String username;

	@Column(name = "fname", nullable = false)
	private String fname;

	@Column(name = "lname", nullable = false)
	private String lname;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "phone", nullable = false)
	private String phone;
	
	@Column(name = "personalPhone", nullable = false)
	private String personalPhone;
	
	@Column(name = "emergencyContact", nullable = false)
	private String emergencyContact;
	
	@Column(name = "address", nullable = false)
	private String address;

	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;

	@Column(name = "mgr_id")
	private Integer manager;
	
	@Column(name = "position")
	private String position;
	
	@Column(name = "hired_date", nullable = true)
	@Temporal(TemporalType.DATE)
	private Date hired_date;
	
	@Column(name = "updated_by")
	private Integer updated_by;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;
	
	@ManyToMany(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
	@JoinTable(name = "employee_role", joinColumns =  { @JoinColumn(referencedColumnName = "id") }, inverseJoinColumns = { @JoinColumn(referencedColumnName = "id") })
	private Set<Store> store = new HashSet<Store>();
	
	@OneToMany(mappedBy="employee", fetch=FetchType.LAZY)
	private Set<Role> employeeRoles = new HashSet<Role>();
	
	public Employee(){
		super();
	}
	
	public Employee(String username, String fname, String lname,
			String phone, String personalPhone, String emergencyContact, String address, Boolean active, Integer manager, String position,
			Date hired_date, Integer updated_by) {
		super();
		this.username = username;
		this.fname = fname;
		this.lname = lname;
		this.phone = phone;
		this.personalPhone = personalPhone;
		this.emergencyContact = emergencyContact;
		this.address = address;
		this.active = active;
		this.manager = manager;
		this.position = position;
		this.hired_date = hired_date;
		this.updated_by = updated_by;
	}

	public Employee(String username, Set<Store> stores) {
		super();
	    this.username = username;
	    this.store = stores;
	}
	
	public Integer getId() {
		return id;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
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

	public Set<Store> getStore() {
		return store;
	}

	public void setStore(Set<Store> store) {
		this.store = store;
	}

	public Set<Role> getEmployeeRoles() {
		return employeeRoles;
	}

	public void setEmployeeRoles(Set<Role> employeeRoles) {
		this.employeeRoles = employeeRoles;
	}

	public Integer getManager() {
		return manager;
	}

	public void setManager(Integer manager) {
		this.manager = manager;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public Date getHired_date() {
		return hired_date;
	}

	public void setHired_date(Date hired_date) {
		this.hired_date = hired_date;
	}
	
}
