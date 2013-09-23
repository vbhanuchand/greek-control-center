package com.services.core.data.model.store;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import java.util.SortedSet;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Sort;
import org.hibernate.annotations.SortType;
import org.hibernate.annotations.Type;

import com.services.core.data.model.employee.Employee;

@Entity
@Table(name = "store")
public class Store implements Serializable {

	private static final long serialVersionUID = -6988791627165671910L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "displayName", nullable = false)
	private String displayName;
	
	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;
	
	@Column(name = "store_address", nullable = false)
	private String store_address;
	
	@Column(name = "operating_hrs", nullable = false)
	private String operating_hrs;
	
	@Column(name = "contact_details")
	private String contact_details;
	
	@Column(name = "lease_copy_loc", nullable = false)
	private String lease_copy_loc;
	
	@Column(name = "store_notes")
	private String store_notes;
	
	@Column(name = "property_info")
	private String property_info;
	
	@Column(name = "lease_info")
	private String lease_info;
	
	@Column(name = "updated_by", nullable = false)
	private Integer updatedBy;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updatedDate;
	
	
	/*@ManyToMany(mappedBy = "store", fetch=FetchType.LAZY)
    private Set<Employee> employee;

	
	@OneToMany(mappedBy="store", fetch=FetchType.LAZY)
	@Fetch(FetchMode.JOIN)
	@Sort(type=SortType.NATURAL)
	private SortedSet<StoreMaintenance> storeMaintenanceRecords;
	
	
	@OneToMany(mappedBy="store", fetch=FetchType.LAZY)
	@Fetch(FetchMode.JOIN)
	@Sort(type=SortType.NATURAL)
	private SortedSet<StoreAlarm> storeAlarmRecords;
	
	@OneToMany(mappedBy="store", fetch=FetchType.LAZY)
	@Fetch(FetchMode.JOIN)
	@Sort(type=SortType.NATURAL)
	private SortedSet<StoreDate> storeDateRecords;
	
	@OneToMany(mappedBy="store", fetch=FetchType.LAZY)
	@Fetch(FetchMode.JOIN)
	@Sort(type=SortType.NATURAL)
	private SortedSet<StoreKey> storeKeyRecords;*/
	
	public Store(){
		
	}
	
	public Integer getId() {
		return id;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getStore_address() {
		return store_address;
	}

	public void setStore_address(String store_address) {
		this.store_address = store_address;
	}

	public String getOperating_hrs() {
		return operating_hrs;
	}

	public void setOperating_hrs(String operating_hrs) {
		this.operating_hrs = operating_hrs;
	}

	public String getContact_details() {
		return contact_details;
	}

	public void setContact_details(String contact_details) {
		this.contact_details = contact_details;
	}

	public String getLease_copy_loc() {
		return lease_copy_loc;
	}

	public void setLease_copy_loc(String lease_copy_loc) {
		this.lease_copy_loc = lease_copy_loc;
	}

	public String getStore_notes() {
		return store_notes;
	}

	public void setStore_notes(String store_notes) {
		this.store_notes = store_notes;
	}

	public String getProperty_info() {
		return property_info;
	}

	public void setProperty_info(String property_info) {
		this.property_info = property_info;
	}

	public String getLease_info() {
		return lease_info;
	}

	public void setLease_info(String lease_info) {
		this.lease_info = lease_info;
	}

	public Integer getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdated_by(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdated_date(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	/*public Set<Employee> getEmployee() {
		return employee;
	}

	public void setEmployee(Set<Employee> employee) {
		this.employee = employee;
	}

	public Set<StoreMaintenance> getStoreMaintenanceRecords() {
		return storeMaintenanceRecords;
	}

	public void setStoreMaintenanceRecords(
			SortedSet<StoreMaintenance> storeMaintenanceRecords) {
		this.storeMaintenanceRecords = storeMaintenanceRecords;
	}*/

	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	/*public Set<StoreAlarm> getStoreAlarmRecords() {
		return storeAlarmRecords;
	}

	public void setStoreAlarmRecords(SortedSet<StoreAlarm> storeAlarmRecords) {
		this.storeAlarmRecords = storeAlarmRecords;
	}

	public Set<StoreDate> getStoreDateRecords() {
		return storeDateRecords;
	}

	public void setStoreDateRecords(SortedSet<StoreDate> storeDateRecords) {
		this.storeDateRecords = storeDateRecords;
	}

	public Set<StoreKey> getStoreKeyRecords() {
		return storeKeyRecords;
	}

	public void setStoreKeyRecords(SortedSet<StoreKey> storeKeyRecords) {
		this.storeKeyRecords = storeKeyRecords;
	}*/
	
}
