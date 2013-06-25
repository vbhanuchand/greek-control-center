package com.services.core.data.mgr.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.services.core.data.dao.BlobDAO;
import com.services.core.data.dao.EmployeeDAO;
import com.services.core.data.dao.StoreDAO;
import com.services.core.data.mgr.DataManager;
import com.services.core.data.model.Blobs;
import com.services.core.data.model.employee.Employee;
import com.services.core.data.model.employee.EmployeeDiscipline;
import com.services.core.data.model.employee.EmployeeLabor;
import com.services.core.data.model.employee.EmployeeLeaves;
import com.services.core.data.model.employee.EmployeeSalary;
import com.services.core.data.model.store.Store;
import com.services.core.data.model.store.StoreAlarm;
import com.services.core.data.model.store.StoreDate;
import com.services.core.data.model.store.StoreKey;
import com.services.core.data.model.store.StoreMaintenance;
import com.services.core.view.utils.Utilities;
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

@Service
@Transactional(readOnly = true, propagation=Propagation.REQUIRED)
@SuppressWarnings("unused")
public class DataManagerImpl implements DataManager{

	private static Logger logger = Logger.getLogger(DataManagerImpl.class.getName());
	
	@Autowired
	private EmployeeDAO employeeDAO;
	
	@Autowired
	private StoreDAO storeDAO;
	
	@Autowired
	private BlobDAO blobDAO;
	
	@Override
	public void insertEmployee(Employee emp) {
		employeeDAO.insertEmployee(emp);
	}

	@Override
	public Employee getEmployeeById(int id) {
		return employeeDAO.getEmployeeById(id);
	}
	
	@Override
	public Employee getEmployeeByUserName(String username) {
		return employeeDAO.getEmployeeByUserName(username);
	}

	@Override
	public List<EmployeeWrapper> getEmployees() {
		List<EmployeeWrapper> employeeWrappers = new ArrayList<EmployeeWrapper>(); 
		EmployeeWrapper employee;
		for(Employee emp: employeeDAO.getEmployees()){
			employee = new EmployeeWrapper();
			employee.setId(emp.getId());
			employee.setFname(emp.getFname());
			employee.setLname(emp.getLname());
			employee.setUsername(emp.getUsername());
			employee.setActive(emp.getActive());
			employee.setPhone(emp.getPhone());
			/*for(Store tmpStore: emp.getStore()){
				employee.getStore().add(new StoreWrapper(tmpStore.getId(), tmpStore.getDisplayName(), tmpStore.getActive(), 
						tmpStore.getStore_address(), tmpStore.getContact_details(), tmpStore.getStore_notes(), tmpStore.getOperating_hrs(), tmpStore.getLease_copy_loc(), tmpStore.getUpdatedBy(), 
						tmpStore.getUpdatedDate()));
			}*/
			employeeWrappers.add(employee);
		}
		
		return employeeWrappers;
	}
	
	@Transactional(readOnly = false)
    public void deleteEmployee(String username) {
        Employee employee = employeeDAO.getEmployeeByUserName(username);
        employeeDAO.deleteEmployee(employee);
    }
	
	@Override
	public List<EmployeeWrapper> getEmployeesByStoreId(int storeId, boolean getMgrOnly) {
		List<EmployeeWrapper> employeeWrappers = new ArrayList<EmployeeWrapper>();
		for(Employee emp: employeeDAO.getEmployeesByStoreId(storeId, getMgrOnly)){
			/*for(Role empRole: emp.getEmployeeRoles()){
				if(empRole.getStoreId().intValue() == storeId)
					employeeRoleWrappers.add(new RoleWrapper(empRole.getId(), empRole.getActive(), 
							empRole.getStoreId(), empRole.getRoleTab(), empRole.getUpdated_by(), empRole.getUpdated_date()));
			}*/
			employeeWrappers.add(new EmployeeWrapper(emp.getId(), emp.getUsername(), emp.getFname(), 
					emp.getLname(), emp.getPhone(), emp.getPersonalPhone(), emp.getEmergencyContact(), emp.getAddress(), emp.getPosition(), emp.getManager(),  emp.getActive(), emp.getUpdated_by(), emp.getHired_date()));
		}
		return employeeWrappers;
	}
	
	@Override
	@Transactional
	public boolean insertEmployee(EmployeeWrapper emp){
		return employeeDAO.insertEmployee(emp.getStoreId(), emp.getUsername(), emp.getFname(), emp.getLname(), emp.getPhone(), emp.getPersonalPhone(), emp.getEmergencyContact(), emp.getAddress(), 
				emp.getActive(), emp.getMgr(), emp.getPosition(), emp.getHiredDate(), emp.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean updateEmployee(EmployeeWrapper empWrapper){
		return employeeDAO.updateEmployee(empWrapper.getId(), empWrapper.getUsername(), empWrapper.getFname(), empWrapper.getLname(), empWrapper.getPhone(), 
				empWrapper.getPersonalPhone(), empWrapper.getEmergencyContact(), empWrapper.getAddress(), empWrapper.getActive(), empWrapper.getMgr(), empWrapper.getPosition(), empWrapper.getHiredDate(), empWrapper.getUpdatedBy());
	}
	
	@Override
	public List<EmployeeSalaryWrapper> getEmployeeSalary(int empId) {
		List<EmployeeSalaryWrapper> empSalaryList = new ArrayList<EmployeeSalaryWrapper>();
		EmployeeSalaryWrapper empSalWrapper = null;
		for(EmployeeSalary empSal: employeeDAO.getEmployeeSalary(empId)){
			empSalWrapper = new EmployeeSalaryWrapper(empSal.getEmpId(), empSal.getStoreId(), empSal.getIncrement(), empSal.getIncrementDate(), 
					empSal.getSalBefInc(), empSal.getSalAftInc(), empSal.getNotes(), empSal.getActive(), empSal.getUpdated_by());
			empSalWrapper.setId(empSal.getId());
			empSalWrapper.setUpdated_date(empSal.getUpdated_date());
			empSalaryList.add(empSalWrapper);
		}
		return empSalaryList;
	}
	
	@Override
	@Transactional
	public boolean insertEmployeeSalary(EmployeeSalaryWrapper empSalary){
		return employeeDAO.createEmployeeSalary(empSalary.getEmpId(), empSalary.getStoreId(), empSalary.getIncrement(), 
				empSalary.getIncrementDate(), empSalary.getSalBefInc(), empSalary.getSalAftInc(), empSalary.getNotes(), empSalary.getUpdated_by());
	}
	
	@Override
	@Transactional
	public boolean updateEmployeeSalary(EmployeeSalaryWrapper empSalary){
		return employeeDAO.updateEmployeeSalary(empSalary.getId(), empSalary.getEmpId(), empSalary.getStoreId(), empSalary.getIncrement(), 
				empSalary.getIncrementDate(), empSalary.getSalBefInc(), empSalary.getSalAftInc(), empSalary.getNotes(), empSalary.getUpdated_by());
	}
	
	@Override
	public List<EmployeeDisciplineWrapper> getEmployeeDiscipline(int empId) {
		List<EmployeeDisciplineWrapper> empDisciplineList = new ArrayList<EmployeeDisciplineWrapper>();
		EmployeeDisciplineWrapper empDisciplineWrapper = null;
		for(EmployeeDiscipline empDisc: employeeDAO.getEmployeeDiscipline(empId)){
			empDisciplineWrapper = new EmployeeDisciplineWrapper(empDisc.getId(), empDisc.getEmpId(), empDisc.getStoreId(), empDisc.getDate(), empDisc.getNotes(), empDisc.getNotesType(), empDisc.getActive(), empDisc.getUpdated_by(), empDisc.getUpdated_date());
			empDisciplineList.add(empDisciplineWrapper);
		}
		return empDisciplineList;
	}
	
	@Override
	@Transactional
	public boolean insertEmployeeDiscipline(EmployeeDisciplineWrapper empDisc){
		return employeeDAO.createEmployeeDiscipline(empDisc.getEmpId(), empDisc.getStoreId(), empDisc.getDate(), empDisc.getNotes(), empDisc.getNotesType(), empDisc.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean updateEmployeeDiscipline(EmployeeDisciplineWrapper empDisc){
		return employeeDAO.updateEmployeeDiscipline(empDisc.getId(), empDisc.getEmpId(), empDisc.getStoreId(), empDisc.getDate(), empDisc.getNotes(), empDisc.getNotesType(), empDisc.getUpdatedBy());
	}
	
	@Override
	public List<EmployeeLeavesWrapper> getEmployeeLeaves(int empId) {
		List<EmployeeLeavesWrapper> empLeavesList = new ArrayList<EmployeeLeavesWrapper>();
		EmployeeLeavesWrapper empLeavesWrapper = null;
		for(EmployeeLeaves empLeaves: employeeDAO.getEmployeeLeaves(empId)){
			empLeavesWrapper = new EmployeeLeavesWrapper(empLeaves.getId(), empLeaves.getEmpId(), empLeaves.getStoreId(), empLeaves.getDate(), empLeaves.getReason(), empLeaves.getExcused(), empLeaves.getActiveHrs(), empLeaves.getActive(), empLeaves.getUpdated_by());
			empLeavesList.add(empLeavesWrapper);
		}
		return empLeavesList;
	}
	
	@Override
	@Transactional
	public boolean insertEmployeeLeaves(EmployeeLeavesWrapper empLeave){
		return employeeDAO.createEmployeeLeaves(empLeave.getEmpId(), empLeave.getStoreId(), empLeave.getDate(), empLeave.getReason(), empLeave.getExcused(), empLeave.getActiveHrs(), true, empLeave.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean updateEmployeeLeaves(EmployeeLeavesWrapper empLeave){
		return employeeDAO.updateEmployeeLeaves(empLeave.getId(), empLeave.getEmpId(), empLeave.getStoreId(), empLeave.getDate(), empLeave.getReason(), empLeave.getExcused(), empLeave.getActiveHrs(), true, empLeave.getUpdatedBy());
	}
	
	
	@SuppressWarnings("rawtypes")
	public List<Map<String, String>> getLaborByStore(int storeId){
		Map mapObject = new HashMap();
		List<Map<String, String>> dbList = new ArrayList<Map<String, String>>();
		Map<String, String> dbItem;
		
		List empLaborList = employeeDAO.getEmployeeLaborByStore(storeId);
		Iterator iter = empLaborList.iterator();
		while(iter.hasNext()){
			mapObject = (Map)iter.next();
			dbItem = new HashMap<String, String>();
			dbItem.put("date", mapObject.get("date").toString());
			dbItem.put("position", String.valueOf(mapObject.get("position")));
			dbItem.put("total", String.valueOf(mapObject.get("total")));
			dbItem.put("skeleton", Utilities.getStringforLaborSkeleton(mapObject.get("date").toString()));
			dbList.add(dbItem);
		}
		Map<String, Map<String, String>> consolidatedMap = new HashMap<String, Map<String, String>>();
		Map<String, String> tempMap;
		
		for(Map<String, String> tmp: dbList){
			if(!consolidatedMap.containsKey(tmp.get("skeleton"))){
				tempMap = new HashMap<String, String>();
			}else tempMap = consolidatedMap.get(tmp.get("skeleton"));
			
			if(tempMap.containsKey(tmp.get("position"))){
				tempMap.put(tmp.get("position"), String.valueOf(Double.parseDouble(tempMap.get(tmp.get("position"))) + Double.parseDouble(tmp.get("total"))));
			}else tempMap.put(tmp.get("position"), tmp.get("total"));
			tempMap.put("date", tmp.get("date"));
			consolidatedMap.put(tmp.get("skeleton"), tempMap);
		}
		
		List<Map<String, String>> returnList = new ArrayList<Map<String, String>>();
		int id=0;
		for (Map.Entry<String, Map<String, String>> entry : consolidatedMap.entrySet()) {
			tempMap = new HashMap<String, String>();
			tempMap.put("skeletonKey",entry.getKey());
			for (Map.Entry<String, String> subEntry : entry.getValue().entrySet()) {
				tempMap.put(subEntry.getKey(), subEntry.getValue());
			}
			if(!tempMap.containsKey("Manager")) tempMap.put("Manager", "0.0");
			if(!tempMap.containsKey("Front")) tempMap.put("Front", "0.0");
			if(!tempMap.containsKey("Cook")) tempMap.put("Cook", "0.0");
			tempMap.put("id", String.valueOf(id++));
			tempMap.put("week", Utilities.getWeekNumber(tempMap.get("date")));
			returnList.add(tempMap);
		}
		
		Collections.sort(returnList, new Comparator<Map<String, String>>() {
		    @Override
		    public int compare(final Map<String, String> map1, final Map<String, String> map2) {
		    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		    	Date date1 = new Date();
		    	Date date2 = new Date();
				try {
					date1 = sdf.parse(map1.get("date"));
					date2 = sdf.parse(map2.get("date"));
				} catch (ParseException e) {
				}
	        	return date2.compareTo(date1);
		    }
		});
		
		return returnList;
	}
	
	@Override
	@SuppressWarnings("rawtypes")
	public List<StoreLaborDetailsWrapper> getLaborDetails(int storeId, String yearWeek){
		Map<String, Date> datesMap = Utilities.getStartDateEndDate(yearWeek);
		List<StoreLaborDetailsWrapper> storeLaborDetails = new ArrayList<StoreLaborDetailsWrapper>();
		Calendar cal = Calendar.getInstance();
		Map rowObject;
		int mgrHr = 0;
		int frontHr = 0;
		int cookHr = 0;
		StoreLaborDetailsWrapper temp;
		Date rollingDate = datesMap.get("startDate");
		for(Object empLabor: employeeDAO.getStoreLaborDetails(storeId, datesMap.get("startDate"), datesMap.get("endDate"))){
			rowObject = (Map) empLabor;
			if(rollingDate.compareTo((Date)rowObject.get("date")) < 0)	{
				mgrHr = 0;
				frontHr = 0;
				cookHr = 0;
				rollingDate = (Date)rowObject.get("date");
			}
			cal.setTime((Date)rowObject.get("date"));
			temp = new StoreLaborDetailsWrapper((Integer)rowObject.get("id"), (Integer)rowObject.get("empId"), (String)rowObject.get("fname"), "", (String)rowObject.get("position"), cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH), 
					frontHr, 5, frontHr, 50, (double)rowObject.get("totalTime"), "Calendar1");
			temp.setSummary(Utilities.getSummary((String)rowObject.get("fname"), (Integer)rowObject.get("from"), (Integer)rowObject.get("to")));
			if(((String)rowObject.get("position")).equalsIgnoreCase("Front")){
				temp.setCalendar("Calendar1");
				temp.setBeginHH(10 + (frontHr%4));
				temp.setEndHH(10 + (frontHr%4));
				frontHr++;
				storeLaborDetails.add(temp);
			}else if(((String)rowObject.get("position")).equalsIgnoreCase("Cook")){
				temp.setCalendar("Calendar2");
				temp.setBeginHH(14 + (cookHr%4));
				temp.setEndHH(14 + (cookHr%4));
				cookHr++;
				storeLaborDetails.add(temp);
			}else if(((String)rowObject.get("position")).equalsIgnoreCase("Manager")){
				temp.setCalendar("Calendar0");
				temp.setBeginHH(8 + (mgrHr%2));
				temp.setEndHH(8 + (mgrHr%2));
				mgrHr++;
				storeLaborDetails.add(temp);
			}
			temp.setStartDate(datesMap.get("startDate"));
			temp.setEndDate(datesMap.get("endDate"));
			temp.setActualBeginTime((Integer)rowObject.get("from"));
			temp.setActualEndTime((Integer)rowObject.get("to"));
		}
		return storeLaborDetails;
	}
	
	
	@Override
	public List<EmployeeLaborWrapper> getEmployeeLabor(int storeId, int empId) {
		List<EmployeeLaborWrapper> empLaborList = new ArrayList<EmployeeLaborWrapper>();
		EmployeeLaborWrapper empLaborWrapper = null;
		for(EmployeeLabor empLabor: employeeDAO.getEmployeeLabor(storeId, empId)){
			empLaborWrapper = new EmployeeLaborWrapper(empLabor.getId(), empLabor.getEmpId(), empLabor.getStoreId(), empLabor.getDate(), empLabor.getFrom(), empLabor.getTo(), empLabor.getPosition(), empLabor.getActive(), empLabor.getUpdated_by(), empLabor.getUpdated_date());
			empLaborList.add(empLaborWrapper);
		}
		return empLaborList;
	}
	
	@Override
	@Transactional
	public EmployeeLaborWrapper insertEmployeeLabor(EmployeeLaborWrapper empLabor){
		EmployeeLabor empLaborReturned = employeeDAO.createEmployeeLabor(empLabor.getEmpId(), empLabor.getStoreId(), empLabor.getDate(), empLabor.getFrom(), empLabor.getTo(), empLabor.getPosition(), empLabor.getActive(), empLabor.getUpdatedBy());
		EmployeeLaborWrapper empLaborWrapper = new EmployeeLaborWrapper(empLaborReturned.getId(), empLaborReturned.getEmpId(), empLaborReturned.getStoreId(), empLaborReturned.getDate(), empLaborReturned.getFrom(), empLaborReturned.getTo(), empLaborReturned.getPosition(), empLaborReturned.getActive(), empLaborReturned.getUpdated_by(), empLaborReturned.getUpdated_date());
		return empLaborWrapper;
	}
	
	@Override
	@Transactional
	public boolean updateEmployeeLabor(EmployeeLaborWrapper empLabor){
		return employeeDAO.updateEmployeeLabor(empLabor.getId(), empLabor.getEmpId(), empLabor.getStoreId(), empLabor.getDate(), empLabor.getFrom(), empLabor.getTo(), empLabor.getPosition(), empLabor.getActive(), empLabor.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean deleteEmployeeLabor(int laborId){
		return employeeDAO.deleteEmployeeLabor(laborId);
	}
	
	@Override
	public void insertStore(Store store) {
		storeDAO.insertStore(store);
	}

	@Override
	public List<StoreWrapper> getStores() {
		List<StoreWrapper> storeWrappers = new ArrayList<StoreWrapper>();
		for(Store store: storeDAO.getStores()){
			storeWrappers.add(new StoreWrapper(store.getId(), store.getDisplayName(), 
					store.getActive(), store.getStore_address(), store.getContact_details(), store.getStore_notes(), store.getOperating_hrs(), store.getLease_copy_loc(), 
					store.getUpdatedBy(), store.getUpdatedDate()));
		}
		return storeWrappers;
	}

	/*@Override
	public StoreWrapper getStoreAlarmRecords(int storeId) {
		Store store = storeDAO.getStoreById(storeId);
		StoreWrapper storeWrapper = new StoreWrapper();
		if(store != null){
			storeWrapper = new StoreWrapper(store.getId(), store.getDisplayName(), store.getActive(), 
				store.getStore_address(), store.getContact_details(), store.getStore_notes(), store.getOperating_hrs(), store.getLease_copy_loc(), store.getUpdatedBy(), 
				store.getUpdatedDate());
			Set<StoreAlarmWrapper> storeAlarmRecords = new HashSet<StoreAlarmWrapper>();
			for(StoreAlarm storeAlarm: store.getStoreAlarmRecords()){
				storeAlarmRecords.add(new StoreAlarmWrapper(storeAlarm.getId(), storeAlarm.getStoreId(), 
						storeAlarm.getName(), storeAlarm.getCode(), storeAlarm.getPosition(), storeAlarm.getNotes(), 
						storeAlarm.getActive(), storeAlarm.getUpdatedBy(), storeAlarm.getUpdatedDate()));
			}
			Collections.sort(storeAlarmRecords.toArray(), new Comparator<StoreAlarmWrapper>() {
			    @Override
			    public int compare(final StoreAlarmWrapper o1, final StoreAlarmWrapper o2) {
			    	return o2.getUpdatedDate().compareTo(o1.getUpdatedDate());
			    }
			});
			storeWrapper.setStoreAlarmRecords(storeAlarmRecords);
		}
		return storeWrapper;
	}*/

	/*@Override
	public StoreWrapper getStoreDateRecords(int storeId) {
		Store store = storeDAO.getStoreById(storeId);
		StoreWrapper storeWrapper = new StoreWrapper();
		if(store != null){
			storeWrapper = new StoreWrapper(store.getId(), store.getDisplayName(), store.getActive(), 
				store.getStore_address(), store.getContact_details(), store.getStore_notes(), store.getOperating_hrs(), store.getLease_copy_loc(), store.getUpdatedBy(), 
				store.getUpdatedDate());
			Set<StoreDateWrapper> storeDateRecords = new HashSet<StoreDateWrapper>();
			for(StoreDate storeDate: store.getStoreDateRecords()){
				storeDateRecords.add(new StoreDateWrapper(storeDate.getId(), storeDate.getStoreId(), 
						storeDate.getImpDate(), storeDate.getActive(), storeDate.getUpdatedBy(), storeDate.getUpdatedDate()));
			}
			storeWrapper.setStoreDateRecords(storeDateRecords);
		}
		return storeWrapper;
	}*/

	/*@Override
	public StoreWrapper getStoreKeyRecords(int storeId) {
		Store store = storeDAO.getStoreById(storeId);
		StoreWrapper storeWrapper = new StoreWrapper();
		if(store != null){
			storeWrapper = new StoreWrapper(store.getId(), store.getDisplayName(), store.getActive(), 
				store.getStore_address(), store.getContact_details(), store.getStore_notes(), store.getOperating_hrs(), store.getLease_copy_loc(), store.getUpdatedBy(), 
				store.getUpdatedDate());
			Set<StoreKeyWrapper> storeKeyRecords = new HashSet<StoreKeyWrapper>();
			for(StoreKey storeKey: store.getStoreKeyRecords()){
				storeKeyRecords.add(new StoreKeyWrapper(storeKey.getId(), storeKey.getStoreId(), 
						storeKey.getName(), storeKey.getType(), storeKey.getPosition(), storeKey.getNotes(), 
						storeKey.getActive(), storeKey.getUpdatedBy(), storeKey.getUpdatedDate()));
			}
			storeWrapper.setStoreKeyRecords(storeKeyRecords);
		}
		return storeWrapper;
	}*/
	
	
	@Override
	public StoreWrapper getStoreInfo(int storeId) {
		Store store = storeDAO.getStoreById(storeId);
		StoreWrapper storeWrapper = new StoreWrapper();
		if(store != null){
			storeWrapper = new StoreWrapper(store.getId(), store.getDisplayName(), store.getActive(), 
				store.getStore_address(), store.getContact_details(), store.getStore_notes(), store.getOperating_hrs(), store.getLease_copy_loc(), store.getUpdatedBy(), 
				store.getUpdatedDate());
			
			/*Set<StoreDateWrapper> storeDateRecords = new HashSet<StoreDateWrapper>();
			for(StoreDate storeDate: store.getStoreDateRecords()){
				storeDateRecords.add(new StoreDateWrapper(storeDate.getId(), storeDate.getStoreId(), 
						storeDate.getImpDate(), storeDate.getActive(), storeDate.getUpdatedBy(), storeDate.getUpdatedDate()));
			}
			storeWrapper.setStoreDateRecords(storeDateRecords);*/
			
			/*Set<StoreAlarmWrapper> storeAlarmRecords = new HashSet<StoreAlarmWrapper>();
			for(StoreAlarm storeAlarm: store.getStoreAlarmRecords()){
				storeAlarmRecords.add(new StoreAlarmWrapper(storeAlarm.getId(), storeAlarm.getStoreId(), 
						storeAlarm.getName(), storeAlarm.getCode(), storeAlarm.getPosition(), storeAlarm.getNotes(), 
						storeAlarm.getActive(), storeAlarm.getUpdatedBy(), storeAlarm.getUpdatedDate()));
			}
			storeWrapper.setStoreAlarmRecords(storeAlarmRecords);
			
			Set<StoreKeyWrapper> storeKeyRecords = new HashSet<StoreKeyWrapper>();
			for(StoreKey storeKey: store.getStoreKeyRecords()){
				storeKeyRecords.add(new StoreKeyWrapper(storeKey.getId(), storeKey.getStoreId(), 
						storeKey.getName(), storeKey.getType(), storeKey.getPosition(), storeKey.getNotes(), 
						storeKey.getActive(), storeKey.getUpdatedBy(), storeKey.getUpdatedDate()));
			}
			storeWrapper.setStoreKeyRecords(storeKeyRecords);
			
			Set<StoreMaintenanceWrapper> storeMaintenanceRecords = new HashSet<StoreMaintenanceWrapper>();
			for(StoreMaintenance storeMaintenance: store.getStoreMaintenanceRecords()){
				storeMaintenanceRecords.add(new StoreMaintenanceWrapper(storeMaintenance.getId(), storeMaintenance.getStoreId(), 
						storeMaintenance.getDate(), storeMaintenance.getNotes(), storeMaintenance.getProblem(), storeMaintenance.getCompany(), 
						storeMaintenance.getPhone(), storeMaintenance.getActive(), storeMaintenance.getUpdatedBy(), storeMaintenance.getUpdatedDate()));
			}
			storeWrapper.setStoreMaintenanceRecords(storeMaintenanceRecords);*/
		}
		return storeWrapper;
	}
	
	@Override
	public List<StoreDateWrapper> getStoreDates(int storeId) {
		List<StoreDateWrapper> storeDateRecords = new ArrayList<StoreDateWrapper>();
		for(StoreDate storeDate: storeDAO.getStoreDateRecords(storeId)){
			storeDateRecords.add(new StoreDateWrapper(storeDate.getId(), storeDate.getStoreId(), 
					storeDate.getImpDate(), storeDate.getNotes(), 
					storeDate.getActive(), storeDate.getUpdatedBy(), storeDate.getUpdatedDate()));
		}
		return storeDateRecords;
	}
	
	@Override
	public List<StoreAlarmWrapper> getStoreAlarms(int storeId) {
		List<StoreAlarmWrapper> storeAlarmRecords = new ArrayList<StoreAlarmWrapper>();
		for(StoreAlarm storeAlarm: storeDAO.getStoreAlarmRecords(storeId)){
			storeAlarmRecords.add(new StoreAlarmWrapper(storeAlarm.getId(), storeAlarm.getStoreId(), 
					storeAlarm.getName(), storeAlarm.getCode(), storeAlarm.getPosition(), storeAlarm.getNotes(), 
					storeAlarm.getActive(), storeAlarm.getUpdatedBy(), storeAlarm.getUpdatedDate()));
		}
		return storeAlarmRecords;
	}
	
	@Override
	public List<StoreKeyWrapper> getStoreKeys(int storeId) {
		List<StoreKeyWrapper> storeKeyRecords = new ArrayList<StoreKeyWrapper>();
		for(StoreKey storeKey: storeDAO.getStoreKeyRecords(storeId)){
			storeKeyRecords.add(new StoreKeyWrapper(storeKey.getId(), storeKey.getStoreId(), 
				storeKey.getName(), storeKey.getType(), storeKey.getPosition(), storeKey.getNotes(), 
				storeKey.getActive(), storeKey.getUpdatedBy(), storeKey.getUpdatedDate()));
		}
		return storeKeyRecords;
	}
	
	@Override
	@Transactional
	public boolean updateStoreInfo(StoreWrapper store){
		return storeDAO.updateStoreInfo(store.getId(), store.getStore_address(), store.getOperating_hrs(), 
				store.getStore_contact_details(), store.getLease_copy_loc(), store.getStore_notes(), store.getUpdated_by());
	}
	
	@Override
	@Transactional
	public boolean updateStoreAlarm(StoreAlarmWrapper storeAlarm){
		return storeDAO.updateStoreAlarm(storeAlarm.getId(), storeAlarm.getStoreId(), storeAlarm.getName(), 
				storeAlarm.getCode(), storeAlarm.getPosition(), storeAlarm.getNotes(), storeAlarm.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean insertStoreAlarm(StoreAlarmWrapper storeAlarm){
		return storeDAO.createStoreAlarm(storeAlarm.getStoreId(), storeAlarm.getName(), 
				storeAlarm.getCode(), storeAlarm.getPosition(), storeAlarm.getNotes(), storeAlarm.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean insertStoreDate(StoreDateWrapper storeDate){
		return storeDAO.createStoreDate(storeDate.getStoreId(), storeDate.getImpDate(), storeDate.getNotes(), storeDate.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean updateStoreKey(StoreKeyWrapper storeKey){
		return storeDAO.updateStoreKey(storeKey.getId(), storeKey.getStoreId(), storeKey.getName(), 
				storeKey.getType(), storeKey.getPosition(), storeKey.getNotes(), storeKey.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean insertStoreKey(StoreKeyWrapper storeKey){
		return storeDAO.createStoreKey(storeKey.getId(), storeKey.getStoreId(), storeKey.getName(), 
				storeKey.getType(), storeKey.getPosition(), storeKey.getNotes(), storeKey.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean updateStoreMaintenance(StoreMaintenanceWrapper storeMaintenance){
		return storeDAO.updateStoreMaintenance(storeMaintenance.getId(), storeMaintenance.getStoreId(), storeMaintenance.getDate(), 
				storeMaintenance.getNotes(), storeMaintenance.getProblem(), storeMaintenance.getCompany(), storeMaintenance.getPhone(), 
				storeMaintenance.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean insertStoreMaintenance(StoreMaintenanceWrapper storeMaintenance){
		return storeDAO.createStoreMaintenance(storeMaintenance.getId(), storeMaintenance.getStoreId(), storeMaintenance.getDate(), 
				storeMaintenance.getNotes(), storeMaintenance.getProblem(), storeMaintenance.getCompany(), storeMaintenance.getPhone(), 
				storeMaintenance.getUpdatedBy());
	}
	
	@Override
	public List<StoreMaintenanceWrapper> getStoreMaintenanceRecords(int storeId) {
		List<StoreMaintenanceWrapper> storeMaintenanceRecords = new ArrayList<StoreMaintenanceWrapper>();
		for(StoreMaintenance storeMaintenance: storeDAO.getStoreMaintenanceRecords(storeId)){
			storeMaintenanceRecords.add(new StoreMaintenanceWrapper(storeMaintenance.getId(), storeMaintenance.getStoreId(), 
			storeMaintenance.getDate(), storeMaintenance.getNotes(), storeMaintenance.getProblem(), storeMaintenance.getCompany(), 
			storeMaintenance.getPhone(), storeMaintenance.getActive(), storeMaintenance.getUpdatedBy(), storeMaintenance.getUpdatedDate()));
		}
		return storeMaintenanceRecords;
	}

	@Override
	public StoreWrapper getStoreAlarmRecords(int storeId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public StoreWrapper getStoreDateRecords(int storeId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public StoreWrapper getStoreKeyRecords(int storeId) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	@Transactional
	public boolean insertBlob(BlobsWrapper blob){
		return blobDAO.insertBlobReference(blob.getLinkedId(), blob.getFileName(), blob.getBlobKey(), blob.getTab(), true, 0);
	}
	
	@Override
	public List<BlobsWrapper> getBlobs(Integer linkedId, String tab){
		List<BlobsWrapper> blobList = new ArrayList<BlobsWrapper>();
		for(Blobs blobs: blobDAO.getBlobReference(linkedId, tab, true)){
			blobList.add(new BlobsWrapper(blobs.getId(), blobs.getLinkedId(), blobs.getFileName(), blobs.getBlobKey(), blobs.getTab(), blobs.getActive(), blobs.getUpdatedBy()));
		}
		return blobList;
	}
}
