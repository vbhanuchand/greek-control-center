package com.services.core.data.dao;

import java.util.Date;
import java.util.List;

import com.services.core.data.model.Item;
import com.services.core.data.model.store.Store;
import com.services.core.data.model.store.StoreAccount;
import com.services.core.data.model.store.StoreAlarm;
import com.services.core.data.model.store.StoreDate;
import com.services.core.data.model.store.StoreInvoice;
import com.services.core.data.model.store.StoreInvoiceDetails;
import com.services.core.data.model.store.StoreKey;
import com.services.core.data.model.store.StoreMaintenance;
import com.services.core.data.model.store.StoreStock;
import com.services.core.view.wrappers.UploadNotesWrapper;


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
	
	List<StoreAccount> getStoreAccountByQuarter(int storeId, int year, int quarter);
	
	List<String> getStoreAccountYears(int storeId);
	
	List<StoreAccount> getStoreAccountsByYear(int storeId, int year);
	
	/*List<StoreMaintenance> getStoreMaintenanceRecords(int storeId);
	
	List<StoreAlarm> getStoreAlarmRecords(int storeId);
	
	List<StoreDate> getStoreDateRecords(int storeId);
	
	List<StoreKey> getStoreKeyRecords(int storeId);*/
	
	int createStoreAccount(int storeId, int quarter, int year, double labor, double foodCost, double advertisement, double misc, double profit, Boolean active, int updatedBy);
	
	boolean updateStoreAccount(int id, int storeId, int quarter, int year, double labor, double foodCost, double advertisement, double misc, double profit, Boolean active, int updatedBy);
	
	//Store Inventory-tab related operations
	List<StoreInvoice> getStoreInvoices(int storeId);
	
	int insertStoreInvoice(int storeId, Date invoiceDate, boolean locked, boolean active, int updatedBy);
	
	boolean updateStoreInvoice(int id, int storeId, Date invoiceDate, boolean locked, boolean active, int updatedBy);
	
	int insertStoreInvoiceDetails(int invoiceId, int itemId, int itemCategory, int itemStock, int itemOrder, double itemPricePerUnit, double itemGSPercent, int updatedBy);
	
	boolean updateStoreInvoiceDetails(int id, int invoiceId, int itemId, int itemCategory, int itemStock, int itemOrder, double itemPricePerUnit, double itemGSPercent, int updatedBy);
	
	List<StoreInvoiceDetails> getInvoiceDetails(int invoiceId);
	
	List<StoreStock> getStoreStock(int storeId);
	
	int insertStoreStock(int storeId, int itemId, int itemCategory, int itemStock, int itemOrder, double itemPricePerUnit, double itemGSPercent, int updatedBy);
	
	boolean updateStoreStock(int id, int storeId, int itemId, int itemCategory, int itemStock, int itemOrder, double itemPricePerUnit, double itemGSPercent, int updatedBy);
	
	@SuppressWarnings("rawtypes")
	List getStoreHealthInspectionDetails(int storeId, String tab); 
	
	int insertHealthInspectionDetails(int storeId, String purpose, Date purposeDate, String purposeNotes, int updatedBy, String blobKey, String fileName);
	
	boolean updateHealthInspectionDetails(int id, int storeId, String purpose, Date purposeDate, String purposeNotes, int updatedBy, String blobKey, String fileName);
	
	List<Item> getStoreDistributors(int storeId);
	
	int insertStoreItem(int itemCode, String itemColor, String itemName, int itemPar, String itemUnits, int storeId, int updatedBy);
}
