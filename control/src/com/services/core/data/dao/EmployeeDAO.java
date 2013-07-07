package com.services.core.data.dao;

import java.util.Date;
import java.util.List;

import com.services.core.data.model.employee.Employee;
import com.services.core.data.model.employee.EmployeeDiscipline;
import com.services.core.data.model.employee.EmployeeLabor;
import com.services.core.data.model.employee.EmployeeLeaves;
import com.services.core.data.model.employee.EmployeeReview;
import com.services.core.data.model.employee.EmployeeSalary;

public interface EmployeeDAO {

	void insertEmployee(Employee emp);
	
	void deleteEmployee(Employee emp);

	Employee getEmployeeById(int id);
	
	List<Employee> getEmployeesByStoreId(int storeId, boolean getMrgOnly);

	Employee getEmployeeByUserName(String username);

	List<Employee> getEmployees();
	
	boolean insertEmployee(int storeId, String username, String fname, String lname, String phone, String personalPhone, String emergencyContact, String address, boolean active, int manager, String position, Date hired_date, int updated_by);
	
	boolean updateEmployee(int id, String username, String fname, String lname, String phone,  String personalPhone, String emergencyContact, String address, boolean active, int manager, String position, Date hired_date, int updated_by);
	
	List<EmployeeSalary> getEmployeeSalary(int empId);
	
	boolean createEmployeeSalary(int empId, int storeId, double increment, Date incrementDate, double salBefInc, double salAftInc, String notes, int updated_by);
	
	boolean updateEmployeeSalary(int id, int empId, int storeId, double increment, Date incrementDate, double salBefInc, double salAftInc, String notes, int updated_by);
	
	List<EmployeeDiscipline> getEmployeeDiscipline(int empId);
	
	boolean createEmployeeDiscipline(int empId, int storeId, Date date, String notes, String notesType, int updated_by);
	
	boolean updateEmployeeDiscipline(int id, int empId, int storeId, Date date, String notes, String notesType, int updated_by);
	
	List<EmployeeLeaves> getEmployeeLeaves(int empId);
	
	List<EmployeeLeaves> getEmployeeLeaves(int empId, int year);
	
	boolean createEmployeeLeaves(int empId, int storeId, Date date, String reason, boolean excused, int activeHrs, boolean active, int updated_by);
	
	boolean updateEmployeeLeaves(int id, int empId, int storeId, Date date, String reason, boolean excused, int activeHrs, boolean active, int updated_by);
	
	List getEmployeeLaborByStore(int storeId);
	
	List getStoreLaborDetails(int storeId, Date dateFrom, Date dateTo);
	
	List<EmployeeLabor> getEmployeeLabor(int storeId, int empId);
	
	EmployeeLabor createEmployeeLabor(int empId, int storeId, Date date, int from, int to, String position, boolean active, int updated_by);
	
	boolean updateEmployeeLabor(int id, int empId, int storeId, Date date, int from, int to, String position, boolean active, int updated_by);
	
	boolean deleteEmployeeLabor(int laborId);
	
	List<EmployeeReview> getEmployeeReviews(int empId, int year);
	
	List getEmployeeReviews(int empId);
	
	List<EmployeeReview> getEmployeeReviewsByQuarter(int empId, int year, int quarter);
	
	int createEmployeeReview(int empId, int storeId, int quarter, double possibleBonus, Date bonusDate, double bonusAmt, String quarterlyNotes, 
			int year, Boolean active, int updatedBy);
	
	boolean updateEmployeeReview(int id, int empId, int storeId, int quarter, double possibleBonus, Date bonusDate, double bonusAmt, String quarterlyNotes, 
			int year, Boolean active, int updatedBy);

}
