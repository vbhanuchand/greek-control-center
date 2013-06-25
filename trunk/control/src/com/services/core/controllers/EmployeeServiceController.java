package com.services.core.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.services.core.data.mgr.DataManager;
import com.services.core.view.wrappers.EmployeeDisciplineWrapper;
import com.services.core.view.wrappers.EmployeeLaborWrapper;
import com.services.core.view.wrappers.EmployeeLeavesWrapper;
import com.services.core.view.wrappers.EmployeeSalaryWrapper;
import com.services.core.view.wrappers.EmployeeWrapper;
import com.services.core.view.wrappers.MultipleModelResponse;
import com.services.core.view.wrappers.SingleModelResponse;

@Controller
public class EmployeeServiceController {

	@Autowired
	private DataManager dataService;
	
	private static Logger logger = Logger.getAnonymousLogger();
	
	@SuppressWarnings("unused")
	private List<EmployeeWrapper> decorateWithSelfURL(List<EmployeeWrapper> empWrappers, String URL){
		for(EmployeeWrapper empWrapper: empWrappers){
			empWrapper.set_self(URL);
			empWrapper.setPost(false);
		}
		return empWrappers;
	}
	
	@RequestMapping(value = "/employees", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeWrapper> getEmployees() throws IOException {
		logger.info("Getting Employees Data --> " + "ALL");
		List<EmployeeWrapper> employeeWrappers = dataService.getEmployees();
		for(EmployeeWrapper emp: employeeWrappers){
			emp.set_self("/service/employee/" + emp.getId());
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeWrapper>(true, employeeWrappers);
	}
	
	@RequestMapping(value = "/store/{storeId}/employees", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeWrapper> getEmployeesByStore(@PathVariable int storeId)
			throws IOException {
		logger.info("Getting Employees Data For Store --> " + storeId);
		boolean getMgrOnly = false;
		List<EmployeeWrapper> employeeWrappers = dataService.getEmployeesByStoreId(storeId, getMgrOnly);
		for(EmployeeWrapper emp: employeeWrappers){
			emp.set_self("/service/store/" + storeId + "/employees/" + emp.getId());
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeWrapper>(true, employeeWrappers);
	}
	
	@RequestMapping(value = "/store/{storeId}/managers", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeWrapper> getManagersByStore(@PathVariable int storeId)
			throws IOException {
		logger.info("Getting Managers Data For Store --> " + storeId);
		boolean getMgrOnly = true;
		List<EmployeeWrapper> employeeWrappers = dataService.getEmployeesByStoreId(storeId, getMgrOnly);
		for(EmployeeWrapper emp: employeeWrappers){
			emp.set_self("/service/store/" + storeId + "/employees/" + emp.getId());
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeWrapper>(true, employeeWrappers);
	}
	
	@RequestMapping(value = "/store/{storeId}/employees/{empId}", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeWrapper> insertEmployee(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeWrapper empWrapper)
			throws IOException {
		logger.info("Updating Employee Data For Emp Id --> " + empId);
		empWrapper.setActive(true);
		empWrapper.setStoreId(storeId);
		boolean updateStatus = dataService.insertEmployee(empWrapper);
		return new MultipleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/store/{storeId}/employees/{empId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeWrapper> updateEmployee(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeWrapper empWrapper)
			throws IOException {
		logger.info("Updating Employee Data For Emp Id --> " + empId);
		empWrapper.setActive(true);
		boolean updateStatus = dataService.updateEmployee(empWrapper);
		return new MultipleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/employee/{empId}/salary", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeSalaryWrapper> getEmployeeSalary(@PathVariable int empId)
			throws IOException {
		logger.info("Getting Employees Salary Data For Employee Id --> " + empId);
		List<EmployeeSalaryWrapper> empSalWrappers = dataService.getEmployeeSalary(empId);
		for(EmployeeSalaryWrapper emp: empSalWrappers){
			emp.set_self("/service/employee/" + empId + "/salary");
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeSalaryWrapper>(true, empSalWrappers);
	}
	
	@RequestMapping(value = "/employee/{empId}/salary", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> insertEmployeeSalary(@PathVariable int empId, @RequestBody EmployeeSalaryWrapper empSalary)
			throws IOException {
		boolean updateStatus = dataService.insertEmployeeSalary(empSalary);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/employee/{empId}/salary", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeSalary(@PathVariable int empId, @RequestBody EmployeeSalaryWrapper empSalary)
			throws IOException {
		boolean updateStatus = dataService.updateEmployeeSalary(empSalary);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/employee/{empId}/discipline", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeDisciplineWrapper> getEmployeeDiscipline(@PathVariable int empId)
			throws IOException {
		logger.info("Getting Employees Salary Data For Employee Id --> " + empId);
		List<EmployeeDisciplineWrapper> empDiscWrappers = dataService.getEmployeeDiscipline(empId);
		for(EmployeeDisciplineWrapper emp: empDiscWrappers){
			emp.set_self("/service/employee/" + empId + "/discipline");
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeDisciplineWrapper>(true, empDiscWrappers);
	}
	
	@RequestMapping(value = "/employee/{empId}/discipline", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> insertEmployeeDiscipline(@PathVariable int empId, @RequestBody EmployeeDisciplineWrapper empDiscipline)
			throws IOException {
		empDiscipline.setEmpId(empId);
		boolean updateStatus = dataService.insertEmployeeDiscipline(empDiscipline);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/employee/{empId}/discipline", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeDiscipline(@PathVariable int empId, @RequestBody EmployeeDisciplineWrapper empDiscipline)
			throws IOException {
		empDiscipline.setEmpId(empId);
		boolean updateStatus = dataService.updateEmployeeDiscipline(empDiscipline);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/employee/{empId}/leaves", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeLeavesWrapper> getEmployeeLeaves(@PathVariable int empId)
			throws IOException {
		logger.info("Getting Employees Salary Data For Employee Id --> " + empId);
		List<EmployeeLeavesWrapper> empLeaveWrappers = dataService.getEmployeeLeaves(empId);
		for(EmployeeLeavesWrapper emp: empLeaveWrappers){
			emp.set_self("/service/employee/" + empId + "/leaves");
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeLeavesWrapper>(true, empLeaveWrappers);
	}
	
	@RequestMapping(value = "/employee/{empId}/leaves", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> insertEmployeeLeaves(@PathVariable int empId, @RequestBody EmployeeLeavesWrapper empLeaves)
			throws IOException {
		empLeaves.setEmpId(empId);
		boolean updateStatus = dataService.insertEmployeeLeaves(empLeaves);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/employee/{empId}/leaves", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeLeaves(@PathVariable int empId, @RequestBody EmployeeLeavesWrapper empLeaves)
			throws IOException {
		empLeaves.setEmpId(empId);
		boolean updateStatus = dataService.updateEmployeeLeaves(empLeaves);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/store/{storeId}/employee/{empId}/labor", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeLaborWrapper> getEmployeeLabor(@PathVariable int empId, @PathVariable int storeId)
			throws IOException {
		logger.info("Getting Employees Labor Data For Employee Id --> " + empId);
		List<EmployeeLaborWrapper> empLaborWrappers = dataService.getEmployeeLabor(storeId, empId);
		for(EmployeeLaborWrapper emp: empLaborWrappers){
			emp.set_self("/service/store/"+ emp.getStoreId() +  "/employee/" + empId + "/labor");
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeLaborWrapper>(true, empLaborWrappers);
	}
	
	@RequestMapping(value = "/store/{storeId}/employee/{empId}/labor", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeLaborWrapper> insertEmployeeLabor(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeLaborWrapper empLabor)
			throws IOException {
		empLabor.setEmpId(empId);
		EmployeeLaborWrapper updatedRecord = dataService.insertEmployeeLabor(empLabor);
		return new SingleModelResponse<EmployeeLaborWrapper>(true, updatedRecord);
	}
	
	@RequestMapping(value = "/store/{storeId}/employee/{empId}/labor", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeLabor(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeLaborWrapper empLabor)
			throws IOException {
		empLabor.setEmpId(empId);
		boolean updateStatus = dataService.updateEmployeeLabor(empLabor);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/labor/{laborId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> deleteEmployeeLabor(@PathVariable int laborId)
			throws IOException {
		boolean updateStatus = dataService.deleteEmployeeLabor(laborId);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
}
