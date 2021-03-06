package com.services.core.data.mgr.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
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
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.services.core.data.dao.BlobDAO;
import com.services.core.data.dao.EmployeeDAO;
import com.services.core.data.dao.MeetingDAO;
import com.services.core.data.dao.StoreDAO;
import com.services.core.data.mgr.DataManager;
import com.services.core.data.model.Blobs;
import com.services.core.data.model.Item;
import com.services.core.data.model.Meeting;
import com.services.core.data.model.employee.Employee;
import com.services.core.data.model.employee.EmployeeDiscipline;
import com.services.core.data.model.employee.EmployeeLabor;
import com.services.core.data.model.employee.EmployeeLeaves;
import com.services.core.data.model.employee.EmployeeReview;
import com.services.core.data.model.employee.EmployeeSalary;
import com.services.core.data.model.store.Store;
import com.services.core.data.model.store.StoreAccount;
import com.services.core.data.model.store.StoreAlarm;
import com.services.core.data.model.store.StoreDate;
import com.services.core.data.model.store.StoreInvoiceDetails;
import com.services.core.data.model.store.StoreKey;
import com.services.core.data.model.store.StoreMaintenance;
import com.services.core.data.model.store.StoreStock;
import com.services.core.view.utils.QueryParams;
import com.services.core.view.utils.Utilities;
import com.services.core.view.wrappers.BlobsWrapper;
import com.services.core.view.wrappers.EmployeeDisciplineWrapper;
import com.services.core.view.wrappers.EmployeeLaborWrapper;
import com.services.core.view.wrappers.EmployeeLeavesWrapper;
import com.services.core.view.wrappers.EmployeeReviewWrapper;
import com.services.core.view.wrappers.EmployeeSalaryWrapper;
import com.services.core.view.wrappers.EmployeeWrapper;
import com.services.core.view.wrappers.ItemWrapper;
import com.services.core.view.wrappers.MeetingWrapper;
import com.services.core.view.wrappers.RoleWrapper;
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

@Transactional(readOnly = true, propagation=Propagation.REQUIRED)
@SuppressWarnings("unused")
@Lazy
public class DataManagerImpl implements DataManager{

	private static Logger logger = Logger.getLogger(DataManagerImpl.class.getName());
	
	@Autowired
	private EmployeeDAO employeeDAO;
	
	@Autowired
	private StoreDAO storeDAO;
	
	@Autowired
	private BlobDAO blobDAO;
	
	@Autowired
	private MeetingDAO meetingDAO;
	
	@Override
	public void insertEmployee(Employee emp) {
		employeeDAO.insertEmployee(emp);
	}

	@Override
	public Employee getEmployeeById(int id) {
		return employeeDAO.getEmployeeById(id);
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public EmployeeWrapper getEmployeeByUserName(String username) {
		List empList = employeeDAO.getEmployeeByUserName(username);
		EmployeeWrapper returnEmp = new EmployeeWrapper();
		Set<RoleWrapper> employeeRoles = new HashSet<RoleWrapper>();
		RoleWrapper role;
		for(Object row: empList){
			Map mapRow = (Map) row;
			returnEmp.setId((Integer)mapRow.get("empId"));
			returnEmp.setPassword((String)mapRow.get("password"));
			role = new RoleWrapper();
			role.setRoleTab((String)mapRow.get("role"));
			role.setStoreId((Integer)mapRow.get("storeId"));
			employeeRoles.add(role);
		}
		returnEmp.setUsername(username);
		returnEmp.setEmployeeRoles(employeeRoles);
		return returnEmp;
	}
	
	@Override
	@Transactional
	public boolean updateEmployeePassword(String username, String newPassword) {
		return employeeDAO.updateEmployeePassword(username, newPassword);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<EmployeeWrapper> getEmployees() {
		List<EmployeeWrapper> employeeWrappers = new ArrayList<EmployeeWrapper>(); 
		EmployeeWrapper employee;
		Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities();
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		String currentUserRolesStr = authorities.toString();
		for(Employee emp: employeeDAO.getEmployees()){
			/*if(!(currentUserRolesStr.contains("ROLE_OWNER")) && (emp.getUsername().equalsIgnoreCase(currentUsername))){
				logger.info("Skipping the Mgr Entry because the manager cannot modify his own data");
			} else {*/
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
			//}
		}
		
		return employeeWrappers;
	}
	
	@SuppressWarnings({ "rawtypes" })
	@Override
	public Map<String, Map<String, String>> getAllStoreManagers() {
		
		List mgrList = employeeDAO.getAllStoreManagers();
		Iterator iter = mgrList.iterator();
		Map mapObject;
		Map<String, String> empObject;
		Map<String, Map<String, String>> finalObject = new HashMap<String, Map<String, String>>();
		while(iter.hasNext()){
			mapObject = (Map)iter.next();
			if(finalObject.containsKey(mapObject.get("empId").toString())){
				empObject = finalObject.get(mapObject.get("empId").toString());
			}
			else {
				empObject = new HashMap<String, String>();
				empObject.put("empFname", mapObject.get("empFname").toString());
				empObject.put("empLname", mapObject.get("empLname").toString());
				empObject.put("empId", mapObject.get("empId").toString());
			}
			
			if(empObject.containsKey("stores")){
				if(mapObject.get("active").toString() == "true"){
					empObject.put("stores", empObject.get("stores") + "," + mapObject.get("storeId").toString() + "&" + mapObject.get("role").toString());
				}
			} else{
				if(mapObject.get("active").toString() == "true"){
					empObject.put("stores", mapObject.get("storeId").toString() + "&" + mapObject.get("role").toString());
				}
			}
			
			finalObject.put(mapObject.get("empId").toString(), empObject);
		}
		
		
		return finalObject;
	}
	
	@Transactional(readOnly = false)
    public void deleteEmployee(String username) {
        //Employee employee = employeeDAO.getEmployeeByUserName(username);
        //employeeDAO.deleteEmployee(employee);
    }
	
	@SuppressWarnings("unchecked")
	@Override
	public List<EmployeeWrapper> getEmployeesByStoreId(int storeId, boolean getMgrOnly) {
		List<EmployeeWrapper> employeeWrappers = new ArrayList<EmployeeWrapper>();
		for(Employee emp: employeeDAO.getEmployeesByStoreId(storeId, getMgrOnly)){
			Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities();
			String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
			String currentUserRolesStr = authorities.toString();
			if(!(currentUserRolesStr.contains("ROLE_OWNER"))){
				if(getMgrOnly && currentUsername.equalsIgnoreCase(emp.getUsername())){
					employeeWrappers.add(new EmployeeWrapper(emp.getId(), emp.getUsername(), emp.getFname(), 
							emp.getLname(), emp.getPhone(), emp.getPersonalPhone(), emp.getEmergencyContact(), emp.getAddress(), emp.getPosition(), emp.getManager(),  emp.getActive(), emp.getUpdated_by(), emp.getHired_date()));
				}else if(currentUsername.equalsIgnoreCase(emp.getUsername())){
					logger.info("Skipping the Manager since he cannot modify his own information");
				}else{
					employeeWrappers.add(new EmployeeWrapper(emp.getId(), emp.getUsername(), emp.getFname(), 
							emp.getLname(), emp.getPhone(), emp.getPersonalPhone(), emp.getEmergencyContact(), emp.getAddress(), emp.getPosition(), emp.getManager(),  emp.getActive(), emp.getUpdated_by(), emp.getHired_date()));
				}
			} else employeeWrappers.add(new EmployeeWrapper(emp.getId(), emp.getUsername(), emp.getFname(), 
					emp.getLname(), emp.getPhone(), emp.getPersonalPhone(), emp.getEmergencyContact(), emp.getAddress(), emp.getPosition(), emp.getManager(),  emp.getActive(), emp.getUpdated_by(), emp.getHired_date()));
		}
		return employeeWrappers;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<EmployeeWrapper> getEmployeesByStoreIdForLabor(int storeId, boolean getMgrOnly) {
		List<EmployeeWrapper> employeeWrappers = new ArrayList<EmployeeWrapper>();
		for(Employee emp: employeeDAO.getEmployeesByStoreId(storeId, getMgrOnly)){
			Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities();
			String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
			String currentUserRolesStr = authorities.toString();
			if(!(currentUserRolesStr.contains("ROLE_OWNER"))){
				if(getMgrOnly && currentUsername.equalsIgnoreCase(emp.getUsername())){
					employeeWrappers.add(new EmployeeWrapper(emp.getId(), emp.getUsername(), emp.getFname(), 
							emp.getLname(), emp.getPhone(), emp.getPersonalPhone(), emp.getEmergencyContact(), emp.getAddress(), emp.getPosition(), emp.getManager(),  emp.getActive(), emp.getUpdated_by(), emp.getHired_date()));
				} else{
					employeeWrappers.add(new EmployeeWrapper(emp.getId(), emp.getUsername(), emp.getFname(), 
							emp.getLname(), emp.getPhone(), emp.getPersonalPhone(), emp.getEmergencyContact(), emp.getAddress(), emp.getPosition(), emp.getManager(),  emp.getActive(), emp.getUpdated_by(), emp.getHired_date()));
				}
			} else employeeWrappers.add(new EmployeeWrapper(emp.getId(), emp.getUsername(), emp.getFname(), 
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
	public boolean updateEmployeeRole(int empId, int storeId, boolean addRole, String roleName){
		return employeeDAO.updateEmployeeRole(empId, storeId, addRole, roleName);
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
	public List<EmployeeLeavesWrapper> getEmployeeLeaves(int empId, int year) {
		List<EmployeeLeavesWrapper> empLeavesList = new ArrayList<EmployeeLeavesWrapper>();
		EmployeeLeavesWrapper empLeavesWrapper = null;
		for(EmployeeLeaves empLeaves: employeeDAO.getEmployeeLeaves(empId, year)){
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
			dbItem.put("skeleton", Utilities.newGetStringforLaborSkeleton(mapObject.get("date").toString()));
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
			if(!tempMap.containsKey("KA-Manager")) tempMap.put("KA-Manager", "0.0");
			if(!tempMap.containsKey("Shift Lead")) tempMap.put("Shift Lead", "0.0");
			if(!tempMap.containsKey("Front")) tempMap.put("Front", "0.0");
			if(!tempMap.containsKey("Cook")) tempMap.put("Cook", "0.0");
			tempMap.put("id", String.valueOf(id++));
			tempMap.put("week", Utilities.newGetWeekNumber(tempMap.get("date")));
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
		Map<String, Date> datesMap = Utilities.newGetStartDateEndDate(yearWeek);
		List<StoreLaborDetailsWrapper> storeLaborDetails = new ArrayList<StoreLaborDetailsWrapper>();
		Calendar cal = Calendar.getInstance();
		Map rowObject;
		int mgrHr = 0;
		int asstMgrHr = 0;
		int shiftLeadHr = 0;
		int frontHr = 0;
		int cookHr = 0;
		StoreLaborDetailsWrapper temp;
		Date rollingDate = datesMap.get("startDate");
		for(Object empLabor: employeeDAO.getStoreLaborDetails(storeId, datesMap.get("startDate"), datesMap.get("endDate"))){
			rowObject = (Map) empLabor;
			if(rollingDate.compareTo((Date)rowObject.get("date")) < 0)	{
				mgrHr = 0;
				asstMgrHr = 0;
				shiftLeadHr = 0;
				frontHr = 0;
				cookHr = 0;
				rollingDate = (Date)rowObject.get("date");
			}
			cal.setTime((Date)rowObject.get("date"));
			temp = new StoreLaborDetailsWrapper((Integer)rowObject.get("id"), (Integer)rowObject.get("empId"), (String)rowObject.get("fname"), "", (String)rowObject.get("position"), cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH), 
					frontHr, 5, frontHr, 55, (double)rowObject.get("totalTime"), "Calendar1");
			temp.setSummary(Utilities.getSummary((String)rowObject.get("fname"), (Integer)rowObject.get("from"), (Integer)rowObject.get("to")));
			temp.setStartDate(datesMap.get("startDate"));
			temp.setEndDate(datesMap.get("endDate"));
			temp.setActualBeginTime((Integer)rowObject.get("from"));
			temp.setActualEndTime((Integer)rowObject.get("to"));
			if(((String)rowObject.get("position")).equalsIgnoreCase("Front")){
				temp.setCalendar("Calendar1");
				temp.setBeginHH(12 + (frontHr%4));
				temp.setEndHH(12 + (frontHr%4));
				frontHr++;
				storeLaborDetails.add(temp);
			}else if(((String)rowObject.get("position")).equalsIgnoreCase("Cook")){
				temp.setCalendar("Calendar2");
				temp.setBeginHH(16 + (cookHr%4));
				temp.setEndHH(16 + (cookHr%4));
				cookHr++;
				storeLaborDetails.add(temp);
			}else if(((String)rowObject.get("position")).equalsIgnoreCase("Manager")){
				temp.setCalendar("Calendar0");
				temp.setBeginHH(8 + (mgrHr%2));
				temp.setEndHH(8 + (mgrHr%2));
				mgrHr++;
				storeLaborDetails.add(temp);
			}else if(((String)rowObject.get("position")).equalsIgnoreCase("KA-Manager")){
				temp.setCalendar("Calendar0");
				temp.setBeginHH(8 + (asstMgrHr%2));
				temp.setEndHH(8 + (asstMgrHr%2));
				asstMgrHr++;
				storeLaborDetails.add(temp);
			}else if(((String)rowObject.get("position")).equalsIgnoreCase("Shift Lead")){
				temp.setCalendar("Calendar3");
				temp.setBeginHH(10 + (shiftLeadHr%2));
				temp.setEndHH(10 + (shiftLeadHr%2));
				shiftLeadHr++;
				storeLaborDetails.add(temp);
			}
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
					store.getActive(), store.getStore_address(), store.getContact_details(), store.getStore_notes(), store.getProperty_info(), store.getLease_info(), store.getOperating_hrs(), store.getLease_copy_loc(), 
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
				store.getStore_address(), store.getContact_details(), store.getStore_notes(), store.getProperty_info(), store.getLease_info(), store.getOperating_hrs(), store.getLease_copy_loc(), store.getUpdatedBy(), 
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
					storeAlarm.getName(), storeAlarm.getUserNumber(), storeAlarm.getCode(), storeAlarm.getPosition(), storeAlarm.getNotes(), 
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
				store.getStore_contact_details(), store.getLease_copy_loc(), store.getStore_notes(), store.getProperty_info(), store.getLease_info(), store.getUpdated_by());
	}
	
	@Override
	@Transactional
	public boolean updateStoreAlarm(StoreAlarmWrapper storeAlarm){
		return storeDAO.updateStoreAlarm(storeAlarm.getId(), storeAlarm.getStoreId(), storeAlarm.getName(), storeAlarm.getUserNumber(), 
				storeAlarm.getCode(), storeAlarm.getPosition(), storeAlarm.getNotes(), storeAlarm.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean insertStoreAlarm(StoreAlarmWrapper storeAlarm){
		return storeDAO.createStoreAlarm(storeAlarm.getStoreId(), storeAlarm.getName(), storeAlarm.getUserNumber(),
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
	
	@Override
	public List<EmployeeReviewWrapper> getEmployeeReviews(int empId, int year){
		List<EmployeeReviewWrapper> empReviewList = new ArrayList<EmployeeReviewWrapper>();
		EmployeeReviewWrapper empReviewWrapper = null;
		for(EmployeeReview empReview: employeeDAO.getEmployeeReviews(empId, year)){
			empReviewWrapper = new EmployeeReviewWrapper(empReview.getId(), empReview.getEmpId(), empReview.getStoreId(), empReview.getQuarter(), empReview.getPossibleBonus(), 
					empReview.getDate(), empReview.getBonus(),empReview.getNotes(), empReview.getYear(), empReview.getActive(), empReview.getUpdated_by(), empReview.getUpdated_date());
			empReviewList.add(empReviewWrapper);
		}
		return empReviewList;
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public Map<String, String> getEmployeeReviews(int empId){
		Map mapObject = new HashMap();
		Map<String, String> dbItem = new HashMap<String, String>();
		List empReviewList = employeeDAO.getEmployeeReviews(empId);
		Iterator iter = empReviewList.iterator();
		while(iter.hasNext()){
			mapObject = (Map)iter.next();
			dbItem.put(mapObject.get("year").toString(), mapObject.get("year").toString());
		}
		return dbItem;
	}
	
	@Override
	public List<EmployeeReviewWrapper> getEmployeeReviewsByQuarter(int empId, int year, int quarter){
		List<EmployeeReviewWrapper> empReviewList = new ArrayList<EmployeeReviewWrapper>();
		EmployeeReviewWrapper empReviewWrapper = null;
		for(EmployeeReview empReview: employeeDAO.getEmployeeReviewsByQuarter(empId, year, quarter)){
			empReviewWrapper = new EmployeeReviewWrapper(empReview.getId(), empReview.getEmpId(), empReview.getStoreId(), empReview.getQuarter(), empReview.getPossibleBonus(), 
					empReview.getDate(), empReview.getBonus(),empReview.getNotes(), empReview.getYear(), empReview.getActive(), empReview.getUpdated_by(), empReview.getUpdated_date());
			empReviewList.add(empReviewWrapper);
		}
		return empReviewList;
	}
	
	@Override
	@Transactional
	public int insertEmployeeReview(EmployeeReviewWrapper empReview){
		return employeeDAO.createEmployeeReview(empReview.getEmpId(), empReview.getStoreId(), empReview.getQuartersList(), empReview.getPossibleBonus(), 
				empReview.getBonusDate(), empReview.getBonusAmt(), empReview.getQuarterlyNotes(), empReview.getYear(), empReview.getActive(), empReview.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public boolean updateEmployeeReview(EmployeeReviewWrapper empReview){
		return employeeDAO.updateEmployeeReview(empReview.getId(), empReview.getEmpId(), empReview.getStoreId(), empReview.getQuartersList(), empReview.getPossibleBonus(), 
				empReview.getBonusDate(), empReview.getBonusAmt(), empReview.getQuarterlyNotes(), empReview.getYear(), empReview.getActive(), empReview.getUpdatedBy());
	}
	
	@Override
	public List<String> getStoreAccountYears(int storeId){
		return storeDAO.getStoreAccountYears(storeId);
	}
	
	@Override
	public List<StoreAccountWrapper> getStoreAccountsByYear(int storeId, int year){
		List<StoreAccountWrapper> storeAccountList = new ArrayList<StoreAccountWrapper>();
		StoreAccountWrapper storeAccWrapper = null;
		for(StoreAccount storeAccount: storeDAO.getStoreAccountsByYear(storeId, year)){
			storeAccWrapper = new StoreAccountWrapper(storeAccount.getId(), storeAccount.getStoreId(), storeAccount.getQuarter(), storeAccount.getYear(), storeAccount.getLabor(), 
					storeAccount.getFoodCost(), storeAccount.getAdvertisement(), storeAccount.getMisc(), storeAccount.getProfit(), storeAccount.getTotalSales(), storeAccount.getTotalOpExp(), storeAccount.getTotalProfits(), storeAccount.getActive(), 
					storeAccount.getUpdated_by(), storeAccount.getUpdated_date());
			storeAccountList.add(storeAccWrapper);
		}
		return storeAccountList;
	}
	
	@Override
	public List<StoreAccountWrapper> getStoreAccountByQuarter(int storeId, int year, int quarter){
		List<StoreAccountWrapper> storeAccountList = new ArrayList<StoreAccountWrapper>();
		StoreAccountWrapper storeAccWrapper = null;
		for(StoreAccount storeAccount: storeDAO.getStoreAccountByQuarter(storeId, year, quarter)){
			storeAccWrapper = new StoreAccountWrapper(storeAccount.getId(), storeAccount.getStoreId(), storeAccount.getQuarter(), storeAccount.getYear(), storeAccount.getLabor(), 
					storeAccount.getFoodCost(), storeAccount.getAdvertisement(), storeAccount.getMisc(), storeAccount.getProfit(), storeAccount.getTotalSales(), storeAccount.getTotalOpExp(), storeAccount.getTotalProfits(), storeAccount.getActive(), 
					storeAccount.getUpdated_by(), storeAccount.getUpdated_date());
			storeAccountList.add(storeAccWrapper);
		}
		return storeAccountList;
	}
	
	@Override
	@Transactional
	public int insertStoreAccount(StoreAccountWrapper accDetails){
		return storeDAO.createStoreAccount(accDetails.getStoreId(), accDetails.getQuarter(), accDetails.getYear(), accDetails.getLabor(), 
				accDetails.getFoodCost(), accDetails.getAdvertisement(), accDetails.getMisc(), accDetails.getProfit(), accDetails.getTotalSales(), accDetails.getTotalOpExp(), accDetails.getTotalProfits(), true, 0);
	}
	
	@Override
	@Transactional
	public boolean updateStoreAccount(StoreAccountWrapper accDetails){
		return storeDAO.updateStoreAccount(accDetails.getId(), accDetails.getStoreId(), accDetails.getQuarter(), accDetails.getYear(), accDetails.getLabor(), 
				accDetails.getFoodCost(), accDetails.getAdvertisement(), accDetails.getMisc(), accDetails.getProfit(), accDetails.getTotalSales(), accDetails.getTotalOpExp(), accDetails.getTotalProfits(), true, 0);
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public List<StoreInvoiceWrapper> getStoreInvoices(int storeId, String category){
		List invoiceList = storeDAO.getStoreInvoices(storeId, category);
		Map rowObject;
		List<StoreInvoiceWrapper> returnList = new ArrayList<StoreInvoiceWrapper>();
		StoreInvoiceWrapper returnObject;
		for(Object listItem: invoiceList){
			rowObject = (Map) listItem;
			returnObject = new StoreInvoiceWrapper();
			returnObject.setId((int)rowObject.get("invoiceId"));
			returnObject.setInvoiceDate((Date)rowObject.get("invoiceDate"));
			returnObject.setTotalCharges((double)rowObject.get("invTotal") + (double)rowObject.get("invGSCharges"));
			returnObject.setGsCharges((double)rowObject.get("invGSCharges"));
			returnList.add(returnObject);
		}
		return returnList;
	}
	
	@Override
	@Transactional
	public int insertStoreInvoice(StoreInvoiceWrapper storeInv, String category){
		int invoiceId = storeDAO.insertStoreInvoice(storeInv.getStoreId(), new Date(),
				false, true, 0, category);
		for(StoreInvoiceDetailsWrapper storeInvDetails: storeInv.getInvoiceDetails())
		{
			storeInvDetails.setInvoiceId(invoiceId);
			storeDAO.insertStoreInvoiceDetails(storeInvDetails.getInvoiceId(), storeInvDetails.getItemId(), storeInvDetails.getItemStock(), 
					storeInvDetails.getItemOrder(), storeInvDetails.getItemPricePerUnit(), storeInvDetails.getItemGSPercent(), 0);
		}
		return invoiceId;
	}
	
	@Override
	@Transactional
	public boolean updateStoreInvoice(StoreInvoiceWrapper storeInv){
		return storeDAO.updateStoreInvoice(storeInv.getId(), storeInv.getStoreId(), storeInv.getInvoiceDate(),
				false, true, 0);
	}
	
	@Override
	public List<StoreInvoiceDetailsWrapper> getInvoiceDetails(int invoiceId){
		List<StoreInvoiceDetailsWrapper> returnList = new ArrayList<StoreInvoiceDetailsWrapper>();
		for(StoreInvoiceDetails tempStock: storeDAO.getInvoiceDetails(invoiceId)){
			returnList.add(new StoreInvoiceDetailsWrapper(tempStock.getId(), tempStock.getInvoiceId(), tempStock.getItemId(), tempStock.getItemStock(), 
					tempStock.getItemOrder(), tempStock.getItemPricePerUnit(), tempStock.getItemGSPercent(), tempStock.getUpdatedBy(), tempStock.getUpdatedDate()));
		}
		return returnList;
	}
	
	@Override
	@Transactional
	public int insertStoreInvoiceDetails(StoreInvoiceDetailsWrapper storeInvDetails){
		return storeDAO.insertStoreInvoiceDetails(storeInvDetails.getInvoiceId(), storeInvDetails.getItemId(), storeInvDetails.getItemStock(), 
				storeInvDetails.getItemOrder(), storeInvDetails.getItemPricePerUnit(), storeInvDetails.getItemGSPercent(), 0);
	}
	
	@Override
	@Transactional
	public boolean updateStoreInvoiceDetails(StoreInvoiceDetailsWrapper storeInvDetails){
		return storeDAO.updateStoreInvoiceDetails(storeInvDetails.getId(), storeInvDetails.getInvoiceId(), storeInvDetails.getItemId(), storeInvDetails.getItemStock(), 
				storeInvDetails.getItemOrder(), storeInvDetails.getItemPricePerUnit(), storeInvDetails.getItemGSPercent(), 0);
	}
	
	@Override
	public List<StoreStockWrapper> getStoreStock(int storeId, String category){
		List<StoreStockWrapper> returnList = new ArrayList<StoreStockWrapper>();
		for(StoreStock tempStock: storeDAO.getStoreStock(storeId, category)){
			returnList.add(new StoreStockWrapper(tempStock.getId(), tempStock.getStoreId(), tempStock.getItemId(), tempStock.getItemStock(), 
					tempStock.getItemOrder(), tempStock.getItemPricePerUnit(), tempStock.getItemGSPercent(), tempStock.getUpdatedBy(), tempStock.getUpdatedDate()));
		}
		return returnList;
	}
	
	
	@Override
	@Transactional
	public int insertStoreStock(StoreStockWrapper storeInvDetails, String category){
		return storeDAO.insertStoreStock(storeInvDetails.getStoreId(), storeInvDetails.getItemId(), storeInvDetails.getItemStock(), 
				storeInvDetails.getItemOrder(), storeInvDetails.getItemPricePerUnit(), storeInvDetails.getItemGSPercent(), 0, category);
	}
	
	@Override
	@Transactional
	public boolean updateStoreStock(StoreStockWrapper storeInvDetails, String category){
		return storeDAO.updateStoreStock(storeInvDetails.getId(), storeInvDetails.getStoreId(), storeInvDetails.getItemId(), storeInvDetails.getItemStock(), 
				storeInvDetails.getItemOrder(), storeInvDetails.getItemPricePerUnit(), storeInvDetails.getItemGSPercent(), 0, category);
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public List<UploadNotesWrapper> getHealthInspectionDetails(int storeId, String tab){
		List notesList = storeDAO.getStoreHealthInspectionDetails(storeId, tab);
		List<UploadNotesWrapper> returnList = new ArrayList<UploadNotesWrapper>();
		UploadNotesWrapper returnObj;
		for(Object listObject: notesList){
			Map mapObj = (Map) listObject;
			returnObj = new UploadNotesWrapper();
			returnObj.setId((Integer)mapObj.get("id"));
			returnObj.setPurposeDate((Date)mapObj.get("purposeDate"));
			returnObj.setPurposeNotes((String)mapObj.get("purposeNotes"));
			returnObj.setFileName((String)mapObj.get("fileName"));
			returnObj.setBlobKey((String)mapObj.get("blobKey"));
			returnList.add(returnObj);
		}
		return returnList;
	}
	
	@Override
	@Transactional
	public int insertHealthInspectionDetails(UploadNotesWrapper notesWrapper){
		return storeDAO.insertHealthInspectionDetails(notesWrapper.getLinkedId(), notesWrapper.getPurpose(), notesWrapper.getPurposeDate(), notesWrapper.getPurposeNotes(), 0, notesWrapper.getBlobKey(), notesWrapper.getFileName());
	}
	
	@Override
	@Transactional
	public boolean updateHealthInspectionDetails(UploadNotesWrapper notesWrapper){
		return storeDAO.updateHealthInspectionDetails(notesWrapper.getId(), notesWrapper.getLinkedId(), notesWrapper.getPurpose(), notesWrapper.getPurposeDate(), notesWrapper.getPurposeNotes(), 0, notesWrapper.getBlobKey(), notesWrapper.getFileName());
	}
	
	
	@Override
	public List<ItemWrapper> getDistributors(int storeId, String category){
		List<ItemWrapper> returnList = new ArrayList<ItemWrapper>();
		ItemWrapper item;
		for(Item tempItem: storeDAO.getStoreDistributors(storeId, category)){
			item = new ItemWrapper();
			item.setId(tempItem.getId());
			item.setItemCategory(tempItem.getItemCategory());
			item.setItemCode(tempItem.getItemCode());
			item.setItemColor(tempItem.getItemColor());
			item.setItemName(tempItem.getItemName());
			item.setStoreId(tempItem.getStoreId());
			item.setItemType(tempItem.getItemType());
			item.setItemPar(tempItem.getItemPar());
			item.setItemUnits(tempItem.getItemUnits());
			returnList.add(item);
		}
		return returnList;
	}
	
	@Override
	@Transactional
	public int insertStoreItem(ItemWrapper item, String category){
		return storeDAO.insertStoreItem(item.getItemCode(), item.getItemCategory() , item.getItemColor(), item.getItemName(), item.getItemPar(), item.getItemUnits(), item.getItemPPU(), item.getItemGSPercent(), item.getStoreId(), item.getUpdatedBy(), category);
	}
	
	
	
	//Meeting Related Ops
	@Override
	public List<MeetingWrapper> getCalendarRecords(QueryParams params){
		List<MeetingWrapper> calList = new ArrayList<MeetingWrapper>();
		MeetingWrapper meetingWrapper = null;
		for(Meeting meeting: meetingDAO.getMeetingRecords(params)){
			meetingWrapper = new MeetingWrapper(meeting.getId(), meeting.getSummary(), meeting.getAgenda(), meeting.getEmail(), meeting.getEmailText(), 
					Utilities.getFormattedZuluString(meeting.getFromTime()), Utilities.getFormattedZuluString(meeting.getToTime()), meeting.getUpdatedBy(), meeting.getUpdatedDate().getTime());
			calList.add(meetingWrapper);
		}
		return calList;
	}
	
	@Override
	public int getCalendarRecordsCount(QueryParams params){
		return meetingDAO.getMeetingRecordsCount(params);
	}

	@Override
	public MeetingWrapper getCalendarRecordById(QueryParams params){
		Meeting meeting = meetingDAO.getMeetingRecordById(params);
		MeetingWrapper meetingWrapper = null;
		if (meeting != null) {
			meetingWrapper = new MeetingWrapper(meeting.getId(), meeting.getSummary(), meeting.getAgenda(), meeting.getEmail(), meeting.getEmailText(), 
					Utilities.getFormattedZuluString(meeting.getFromTime()), Utilities.getFormattedZuluString(meeting.getToTime()), meeting.getUpdatedBy(), meeting.getUpdatedDate().getTime());
		}
		return meetingWrapper;
	}

	@Override
	@Transactional
	public boolean updateCalendarRecord(MeetingWrapper meetingWrapper){
		return meetingDAO.updateMeetingRecord(meetingWrapper.getId(), meetingWrapper.getSummary(), meetingWrapper.getAgenda(), meetingWrapper.getEmail(), meetingWrapper.getEmailText(), 
				Utilities.getParsedZuluDate(meetingWrapper.getFromTime()), Utilities.getParsedZuluDate(meetingWrapper.getToTime()), meetingWrapper.getUpdatedBy());
	}
	
	@Override
	@Transactional
	public MeetingWrapper insertCalendarRecord(MeetingWrapper meetingWrapper){
		Meeting meeting = meetingDAO.insertMeetingRecord(meetingWrapper.getSummary(), meetingWrapper.getAgenda(), meetingWrapper.getEmail(), meetingWrapper.getEmailText(), 
				Utilities.getParsedZuluDate(meetingWrapper.getFromTime()), Utilities.getParsedZuluDate(meetingWrapper.getToTime()), meetingWrapper.getUpdatedBy());
		MeetingWrapper meetingWrapper1 = null;
		if (meeting != null) {
			meetingWrapper1 = new MeetingWrapper(meeting.getId(), meeting.getSummary(), meeting.getAgenda(), meeting.getEmail(), meeting.getEmailText(), 
					Utilities.getFormattedZuluString(meeting.getFromTime()), Utilities.getFormattedZuluString(meeting.getToTime()), meeting.getUpdatedBy(), meeting.getUpdatedDate().getTime());
		}
		return meetingWrapper1;
	}
	
	@Override
	@Transactional
	public boolean deleteCalendarRecord(QueryParams params){
		return meetingDAO.deleteMeetingRecord(params);
	}
	
}
