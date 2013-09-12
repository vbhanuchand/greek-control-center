package com.services.core.data.mgr;

import java.util.List;
import java.util.Map;

import com.services.core.data.model.employee.Employee;
import com.services.core.data.model.store.Store;
import com.services.core.data.model.store.StoreAccount;
import com.services.core.view.wrappers.BlobsWrapper;
import com.services.core.view.wrappers.EmployeeDisciplineWrapper;
import com.services.core.view.wrappers.EmployeeLaborWrapper;
import com.services.core.view.wrappers.EmployeeLeavesWrapper;
import com.services.core.view.wrappers.EmployeeReviewWrapper;
import com.services.core.view.wrappers.EmployeeSalaryWrapper;
import com.services.core.view.wrappers.EmployeeWrapper;
import com.services.core.view.wrappers.ItemWrapper;
import com.services.core.view.wrappers.StoreAccountWrapper;
import com.services.core.view.wrappers.StoreAlarmWrapper;
import com.services.core.view.wrappers.StoreDateWrapper;
import com.services.core.view.wrappers.StoreInvoiceDetailsWrapper;
import com.services.core.view.wrappers.StoreInvoiceWrapper;
import com.services.core.view.wrappers.StoreKeyWrapper;
import com.services.core.view.wrappers.StoreLaborDetailsWrapper;
import com.services.core.view.wrappers.StoreMaintenanceWrapper;
import com.services.core.view.wrappers.StoreStockWrapper;
import com.services.core.view.wrappers.StoreWrapper;
import com.services.core.view.wrappers.UploadNotesWrapper;

public interface DataManager {

	void insertEmployee(Employee emp);

	Employee getEmployeeById(int id);
	
	EmployeeWrapper getEmployeeByUserName(String username);

	List<EmployeeWrapper> getEmployees();
	
	Map<String, Map<String, String>> getAllStoreManagers();
	
	boolean insertEmployee(EmployeeWrapper emp);
	
	boolean updateEmployee(EmployeeWrapper empWrapper);
	
	List<EmployeeSalaryWrapper> getEmployeeSalary(int empId);
	
	boolean insertEmployeeSalary(EmployeeSalaryWrapper empSalary);
	
	boolean updateEmployeeSalary(EmployeeSalaryWrapper empSalary);
	
	List<EmployeeDisciplineWrapper> getEmployeeDiscipline(int empId);
	
	boolean insertEmployeeDiscipline(EmployeeDisciplineWrapper empSalary);
	
	boolean updateEmployeeDiscipline(EmployeeDisciplineWrapper empSalary);
	
	List<EmployeeLeavesWrapper> getEmployeeLeaves(int empId);
	
	List<EmployeeLeavesWrapper> getEmployeeLeaves(int empId, int year);
	
	boolean insertEmployeeLeaves(EmployeeLeavesWrapper empSalary);
	
	boolean updateEmployeeLeaves(EmployeeLeavesWrapper empSalary);
	
	List<Map<String, String>> getLaborByStore(int storeId);
	
	List<EmployeeLaborWrapper> getEmployeeLabor(int storeId, int empId);
	
	List<StoreLaborDetailsWrapper> getLaborDetails(int storeId, String yearWeek);
	
	EmployeeLaborWrapper insertEmployeeLabor(EmployeeLaborWrapper empSalary);
	
	boolean updateEmployeeLabor(EmployeeLaborWrapper empSalary);
	
	boolean deleteEmployeeLabor(int laborId);
	
	List<EmployeeWrapper> getEmployeesByStoreId(int storeId, boolean isMgrOnly);

	void insertStore(Store store);
	
	List<StoreWrapper> getStores();
	
	List<StoreMaintenanceWrapper> getStoreMaintenanceRecords(int storeId);
	
	StoreWrapper getStoreAlarmRecords(int storeId);
	
	StoreWrapper getStoreDateRecords(int storeId);
	
	StoreWrapper getStoreKeyRecords(int storeId);
	
	StoreWrapper getStoreInfo(int storeId);
	
	List<StoreDateWrapper> getStoreDates(int storeId);
	
	List<StoreAlarmWrapper> getStoreAlarms(int storeId);
	
	List<StoreKeyWrapper> getStoreKeys(int storeId);
	
	boolean updateStoreInfo(StoreWrapper store);
	
	boolean updateStoreAlarm(StoreAlarmWrapper storeAlarm);
	
	boolean insertStoreAlarm(StoreAlarmWrapper storeAlarm);
	
	boolean insertStoreDate(StoreDateWrapper storeDate);
	
	boolean updateStoreKey(StoreKeyWrapper storeKey);
	
	boolean insertStoreKey(StoreKeyWrapper storeKey);
	
	boolean insertStoreMaintenance(StoreMaintenanceWrapper storeMaintenance);
	
	boolean updateStoreMaintenance(StoreMaintenanceWrapper storeMaintenance);
	
	boolean insertBlob(BlobsWrapper blob);
	
	List<BlobsWrapper> getBlobs(Integer linkedId, String tab);
	
	List<EmployeeReviewWrapper> getEmployeeReviewsByQuarter(int empId, int year, int quarter);
	
	List<EmployeeReviewWrapper> getEmployeeReviews(int empId, int year);
	
	Map<String, String> getEmployeeReviews(int empId);
	
	int insertEmployeeReview(EmployeeReviewWrapper empReview);
	
	boolean updateEmployeeReview(EmployeeReviewWrapper empReview);
	
	List<StoreAccountWrapper> getStoreAccountByQuarter(int storeId, int year, int quarter);
	
	List<String> getStoreAccountYears(int storeId);
	
	List<StoreAccountWrapper> getStoreAccountsByYear(int storeId, int year);
	
	int insertStoreAccount(StoreAccountWrapper accDetails);
	
	boolean updateStoreAccount(StoreAccountWrapper accDetails);
	
	List<StoreInvoiceWrapper> getStoreInvoices(int storeId);
	
	int insertStoreInvoice(StoreInvoiceWrapper storeInv);
	
	boolean updateStoreInvoice(StoreInvoiceWrapper storeInv);
	
	List<StoreInvoiceDetailsWrapper> getInvoiceDetails(int invoiceId);
	
	int insertStoreInvoiceDetails(StoreInvoiceDetailsWrapper storeInvDetails);
	
	boolean updateStoreInvoiceDetails(StoreInvoiceDetailsWrapper storeInvDetails);
	
	List<StoreStockWrapper> getStoreStock(int storeId);
	
	int insertStoreStock(StoreStockWrapper storeStock);
	
	boolean updateStoreStock(StoreStockWrapper storeStock);
	
	
	
	List<UploadNotesWrapper> getHealthInspectionDetails(int linkedId, String tab);
	
	int insertHealthInspectionDetails(UploadNotesWrapper notesWrapper);
	
	boolean updateHealthInspectionDetails(UploadNotesWrapper notesWrapper);
	
	List<ItemWrapper> getDistributors(int storeId);
	
	int insertStoreItem(ItemWrapper item);
	
}
