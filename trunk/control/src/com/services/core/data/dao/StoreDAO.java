package com.services.core.data.dao;

import java.util.Date;
import java.util.List;

import com.services.core.data.model.store.Store;
import com.services.core.data.model.store.StoreAlarm;
import com.services.core.data.model.store.StoreDate;
import com.services.core.data.model.store.StoreKey;
import com.services.core.data.model.store.StoreMaintenance;


public interface StoreDAO {

	void insertStore(Store store);
	
	void updateStore(Store store);
	
	boolean updateStoreInfo(int id, String store_address, String operating_hrs, String contact_details, String lease_copy_loc, String store_notes, int updated_by);
	
	boolean createStoreDate(int storeId, Date impDate, String notes, int updated_by);
	
	boolean createStoreAlarm(int storeId, String name, String code, String position, String notes, int updated_by);
	
	boolean updateStoreAlarm(int id, int storeId, String name, String code, String position, String notes, int updated_by);
	
	boolean createStoreKey(int id, int storeId, String name, String type, String position, String notes, int updated_by);
	
	boolean updateStoreKey(int id, int storeId, String name, String type, String position, String notes, int updated_by);
	
	boolean createStoreMaintenance(int id, int storeId, Date date, String notes, String problem, String company, String phone, int updated_by);
	
	boolean updateStoreMaintenance(int id, int storeId, Date date, String notes, String problem, String company, String phone, int updated_by);

	Store getStoreById(int id);

	Store getStoreByStoreName(String displayName);

	List<Store> getStores();
	
	List<StoreMaintenance> getStoreMaintenanceRecords(int storeId);
	
	List<StoreDate> getStoreDateRecords(int storeId);
	
	List<StoreAlarm> getStoreAlarmRecords(int storeId);
	
	List<StoreKey> getStoreKeyRecords(int storeId);
	
	/*List<StoreMaintenance> getStoreMaintenanceRecords(int storeId);
	
	List<StoreAlarm> getStoreAlarmRecords(int storeId);
	
	List<StoreDate> getStoreDateRecords(int storeId);
	
	List<StoreKey> getStoreKeyRecords(int storeId);*/
	
}
