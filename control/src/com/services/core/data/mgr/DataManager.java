package com.services.core.data.mgr;

import java.util.List;
import java.util.Map;

import com.services.core.data.model.employee.Employee;
import com.services.core.data.model.store.Store;
import com.services.core.view.wrappers.BlobsWrapper;
import com.services.core.view.wrappers.EmployeeDisciplineWrapper;
import com.services.core.view.wrappers.EmployeeLaborWrapper;
import com.services.core.view.wrappers.EmployeeLeavesWrapper;
import com.services.core.view.wrappers.EmployeeSalaryWrapper;
import com.services.core.view.wrappers.EmployeeWrapper;
import com.services.core.view.wrappers.StoreAlarmWrapper;
import com.services.core.view.wrappers.StoreDateWrapper;
import com.services.core.view.wrappers.StoreKeyWrapper;
import com.services.core.view.wrappers.StoreLaborDetailsWrapper;
import com.services.core.view.wrappers.StoreMaintenanceWrapper;
import com.services.core.view.wrappers.StoreWrapper;

public interface DataManager {

	void insertEmployee(Employee emp);

	Employee getEmployeeById(int id);
	
	Employee getEmployeeByUserName(String username);

	List<EmployeeWrapper> getEmployees();
	
	boolean insertEmployee(EmployeeWrapper emp);
	
	boolean updateEmployee(EmployeeWrapper empWrapper);
	
	List<EmployeeSalaryWrapper> getEmployeeSalary(int empId);
	
	boolean insertEmployeeSalary(EmployeeSalaryWrapper empSalary);
	
	boolean updateEmployeeSalary(EmployeeSalaryWrapper empSalary);
	
	List<EmployeeDisciplineWrapper> getEmployeeDiscipline(int empId);
	
	boolean insertEmployeeDiscipline(EmployeeDisciplineWrapper empSalary);
	
	boolean updateEmployeeDiscipline(EmployeeDisciplineWrapper empSalary);
	
	List<EmployeeLeavesWrapper> getEmployeeLeaves(int empId);
	
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
		
}
