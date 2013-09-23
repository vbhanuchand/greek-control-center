package com.services.core.view.wrappers;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.view.utils.CustomDateSerializer;

@SuppressWarnings({ "serial" })
public class StoreWrapper extends BaseModel {
	
	private Integer id;
	private String displayName;
	private Boolean active;
	private String store_address;
	private String store_contact_details;
	private String store_notes;
	private String property_info;
	private String lease_info;
	private String operating_hrs;
	private String lease_copy_loc;
	private Integer updated_by;
	private Date updated_date;
	private Set<EmployeeWrapper> storeEmployees = new HashSet<EmployeeWrapper>();
	private Set<StoreMaintenanceWrapper> storeMaintenanceRecords = new HashSet<StoreMaintenanceWrapper>();
	private Set<StoreAlarmWrapper> storeAlarmRecords = new HashSet<StoreAlarmWrapper>();
	private Set<StoreDateWrapper> storeDateRecords = new HashSet<StoreDateWrapper>();
	private Set<StoreKeyWrapper> storeKeyRecords = new HashSet<StoreKeyWrapper>();
	
	
	public StoreWrapper(){
		
	}
	
	

	public StoreWrapper(Integer id, String displayName, Boolean active,
			String store_address, String store_contact_details,
			String store_notes, String property_info, String lease_info, String operating_hrs, String lease_copy_loc,
			Integer updated_by, Date updated_date) {
		super();
		this.id = id;
		this.displayName = displayName;
		this.active = active;
		this.store_address = store_address;
		this.store_contact_details = store_contact_details;
		this.store_notes = store_notes;
		this.property_info = property_info;
		this.lease_info = lease_info;
		this.operating_hrs = operating_hrs;
		this.lease_copy_loc = lease_copy_loc;
		this.updated_by = updated_by;
		this.updated_date = updated_date;
	}

	public Integer getId() {
		return id;
	}



	public void setId(Integer id) {
		this.id = id;
	}



	public String getDisplayName() {
		return displayName;
	}



	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}



	public Boolean getActive() {
		return active;
	}



	public void setActive(Boolean active) {
		this.active = active;
	}



	public String getStore_address() {
		return store_address;
	}



	public void setStore_address(String store_address) {
		this.store_address = store_address;
	}



	public String getStore_contact_details() {
		return store_contact_details;
	}



	public void setStore_contact_details(String store_contact_details) {
		this.store_contact_details = store_contact_details;
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



	public String getOperating_hrs() {
		return operating_hrs;
	}



	public void setOperating_hrs(String operating_hrs) {
		this.operating_hrs = operating_hrs;
	}



	public String getLease_copy_loc() {
		return lease_copy_loc;
	}



	public void setLease_copy_loc(String lease_copy_loc) {
		this.lease_copy_loc = lease_copy_loc;
	}



	public Integer getUpdated_by() {
		return updated_by;
	}



	public void setUpdated_by(Integer updated_by) {
		this.updated_by = updated_by;
	}



	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdated_date() {
		return updated_date;
	}



	public void setUpdated_date(Date updated_date) {
		this.updated_date = updated_date;
	}



	public Set<EmployeeWrapper> getStoreEmployees() {
		return storeEmployees;
	}



	public void setStoreEmployees(Set<EmployeeWrapper> storeEmployees) {
		this.storeEmployees = storeEmployees;
	}



	public Set<StoreMaintenanceWrapper> getStoreMaintenanceRecords() {
		return storeMaintenanceRecords;
	}



	public void setStoreMaintenanceRecords(
			Set<StoreMaintenanceWrapper> storeMaintenanceRecords) {
		this.storeMaintenanceRecords = storeMaintenanceRecords;
	}



	public Set<StoreAlarmWrapper> getStoreAlarmRecords() {
		return storeAlarmRecords;
	}



	public void setStoreAlarmRecords(Set<StoreAlarmWrapper> storeAlarmRecords) {
		this.storeAlarmRecords = storeAlarmRecords;
	}



	public Set<StoreDateWrapper> getStoreDateRecords() {
		return storeDateRecords;
	}



	public void setStoreDateRecords(Set<StoreDateWrapper> storeDateRecords) {
		this.storeDateRecords = storeDateRecords;
	}



	public Set<StoreKeyWrapper> getStoreKeyRecords() {
		return storeKeyRecords;
	}



	public void setStoreKeyRecords(Set<StoreKeyWrapper> storeKeyRecords) {
		this.storeKeyRecords = storeKeyRecords;
	}



	@Override
	public String toString() {
		return "StoreWrapper [id=" + id + ", displayName=" + displayName
				+ ", active=" + active + ", store_address=" + store_address
				+ ", operating_hrs=" + operating_hrs + ", lease_copy_loc="
				+ lease_copy_loc + ", updated_by=" + updated_by
				+ ", updated_date=" + updated_date + "]";
	}
	
}
