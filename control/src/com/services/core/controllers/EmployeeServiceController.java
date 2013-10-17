package com.services.core.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.services.core.data.mgr.DataManager;
import com.services.core.view.utils.Utilities;
import com.services.core.view.wrappers.BaseModel;
import com.services.core.view.wrappers.EmployeeDisciplineWrapper;
import com.services.core.view.wrappers.EmployeeLaborWrapper;
import com.services.core.view.wrappers.EmployeeLeavesWrapper;
import com.services.core.view.wrappers.EmployeeReviewWrapper;
import com.services.core.view.wrappers.EmployeeSalaryWrapper;
import com.services.core.view.wrappers.EmployeeWrapper;
import com.services.core.view.wrappers.MultipleModelResponse;
import com.services.core.view.wrappers.SimpleModel;
import com.services.core.view.wrappers.SingleModelResponse;
import com.services.core.view.wrappers.UploadNotesWrapper;

@Controller
//@RequestMapping("/service")
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
	
	@RequestMapping(value = "/service/employees", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
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
	
	@RequestMapping(value = "/service/managers", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<BaseModel> getManagers() throws IOException {
		MultipleModelResponse<BaseModel> temp = new MultipleModelResponse<BaseModel>(true, null);
		temp.setEmpRoles(dataService.getAllStoreManagers());
		return temp;
	}
	
	@RequestMapping(value = "/service/store/{storeId}/modifyRole/{empId}/{role}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> modifyRoles(@PathVariable int storeId, @PathVariable int empId, @PathVariable int role) throws IOException {
		String roleName = "store-mgr";
		boolean addRole = false;
		if(role > 0) addRole = true;
		return new SingleModelResponse<BaseModel>(dataService.updateEmployeeRole(empId, storeId, addRole, roleName), null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/employees", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
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
	
	@RequestMapping(value = "/service/store/{storeId}/managers", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
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
	
	@RequestMapping(value = "/service/store/{storeId}/employees/{empId}", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeWrapper> insertEmployee(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeWrapper empWrapper)
			throws IOException {
		logger.info("Updating Employee Data For Emp Id --> " + empId);
		empWrapper.setActive(true);
		empWrapper.setStoreId(storeId);
		empWrapper.setMgr(0);
		empWrapper.setUpdatedBy(0);
		//empWrapper.setUsername(empWrapper.getFname()+"."+empWrapper.getLname());
		boolean updateStatus = dataService.insertEmployee(empWrapper);
		return new MultipleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/employees/{empId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeWrapper> updateEmployee(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeWrapper empWrapper)
			throws IOException {
		logger.info("Updating Employee Data For Emp Id --> " + empId);
		empWrapper.setMgr(0);
		empWrapper.setUpdatedBy(0);
		return new MultipleModelResponse<EmployeeWrapper>(dataService.updateEmployee(empWrapper), null);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/salary", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
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
	
	@RequestMapping(value = "/service/employee/{empId}/salary", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> insertEmployeeSalary(@PathVariable int empId, @RequestBody EmployeeSalaryWrapper empSalary)
			throws IOException {
		boolean updateStatus = dataService.insertEmployeeSalary(empSalary);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/salary", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeSalary(@PathVariable int empId, @RequestBody EmployeeSalaryWrapper empSalary)
			throws IOException {
		boolean updateStatus = dataService.updateEmployeeSalary(empSalary);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/discipline", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
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
	
	@RequestMapping(value = "/service/employee/{empId}/discipline", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> insertEmployeeDiscipline(@PathVariable int empId, @RequestBody EmployeeDisciplineWrapper empDiscipline)
			throws IOException {
		empDiscipline.setEmpId(empId);
		boolean updateStatus = dataService.insertEmployeeDiscipline(empDiscipline);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/discipline", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeDiscipline(@PathVariable int empId, @RequestBody EmployeeDisciplineWrapper empDiscipline)
			throws IOException {
		empDiscipline.setEmpId(empId);
		boolean updateStatus = dataService.updateEmployeeDiscipline(empDiscipline);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/leaves", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
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
	
	@RequestMapping(value = "/service/employee/{empId}/leaves/{year}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeLeavesWrapper> getEmployeeLeaves(@PathVariable int empId, @PathVariable int year)
			throws IOException {
		logger.info("Getting Employees Salary Data For Employee Id --> " + empId + " --> Year --> " + year);
		List<EmployeeLeavesWrapper> empLeaveWrappers = dataService.getEmployeeLeaves(empId, year);
		for(EmployeeLeavesWrapper emp: empLeaveWrappers){
			emp.set_self("/service/employee/" + empId + "/leaves");
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeLeavesWrapper>(true, empLeaveWrappers);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/leaves", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> insertEmployeeLeaves(@PathVariable int empId, @RequestBody EmployeeLeavesWrapper empLeaves)
			throws IOException {
		empLeaves.setEmpId(empId);
		boolean updateStatus = dataService.insertEmployeeLeaves(empLeaves);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/leaves", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeLeaves(@PathVariable int empId, @RequestBody EmployeeLeavesWrapper empLeaves)
			throws IOException {
		empLeaves.setEmpId(empId);
		boolean updateStatus = dataService.updateEmployeeLeaves(empLeaves);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	
	//Health Inspection Tab related methods starts here
	@RequestMapping(value = "/service/employee/{empId}/documents", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<UploadNotesWrapper> getHealthInspectionDetails(@PathVariable int empId)
			throws IOException {
		String tab = "employee-docs";
		return new MultipleModelResponse<UploadNotesWrapper>(true, dataService.getHealthInspectionDetails(empId, tab));
	}
	
	@RequestMapping(value = "/service/employee/{empId}/documents", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<UploadNotesWrapper> insertHealthInspectionDetails(@PathVariable int empId, @RequestBody UploadNotesWrapper uploadNotesDetails)
			throws IOException {
		String tab = "employee-docs";
		uploadNotesDetails.setLinkedId(empId);
		uploadNotesDetails.setPurpose(tab);
		int id = dataService.insertHealthInspectionDetails(uploadNotesDetails);
		return new SingleModelResponse<UploadNotesWrapper>(true, null);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/documents/{docId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<UploadNotesWrapper> updateHealthInspectionDetails(@PathVariable int empId, @PathVariable int docId, @RequestBody UploadNotesWrapper uploadNotesDetails)
			throws IOException {
		uploadNotesDetails.setId(docId);
		uploadNotesDetails.setLinkedId(empId);
		uploadNotesDetails.setPurpose("employee-docs");
		boolean execute = dataService.updateHealthInspectionDetails(uploadNotesDetails);
		return new SingleModelResponse<UploadNotesWrapper>(execute, null);
	}
	
	
	
	@RequestMapping(value = "/service/store/{storeId}/employee/{empId}/labor", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
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
	
	@RequestMapping(value = "/service/store/{storeId}/employee/{empId}/labor", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeLaborWrapper> insertEmployeeLabor(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeLaborWrapper empLabor)
			throws IOException {
		empLabor.setEmpId(empId);
		EmployeeLaborWrapper updatedRecord = dataService.insertEmployeeLabor(empLabor);
		return new SingleModelResponse<EmployeeLaborWrapper>(true, updatedRecord);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/employee/{empId}/labor", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> updateEmployeeLabor(@PathVariable int storeId, @PathVariable int empId, @RequestBody EmployeeLaborWrapper empLabor)
			throws IOException {
		empLabor.setEmpId(empId);
		boolean updateStatus = dataService.updateEmployeeLabor(empLabor);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/labor/{laborId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeWrapper> deleteEmployeeLabor(@PathVariable int laborId)
			throws IOException {
		boolean updateStatus = dataService.deleteEmployeeLabor(laborId);
		return new SingleModelResponse<EmployeeWrapper>(updateStatus, null);
	}
	
	
	@RequestMapping(value = "/service/employee/{empId}/reviews", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeReviewWrapper> getEmployeeReviews(@PathVariable int empId)
			throws IOException {
		logger.info("Getting Employee Reviews Data For Employee Id --> " + empId);
		String currentYear = Utilities.getCurrentYear();
		List<EmployeeReviewWrapper> empReviewWrappers = dataService.getEmployeeReviews(empId, Integer.parseInt(currentYear));
		for(EmployeeReviewWrapper emp: empReviewWrappers){
			emp.set_self("/service/employee/" + empId + "/reviews");
			emp.setPost(false);
		}
		return new MultipleModelResponse<EmployeeReviewWrapper>(true, empReviewWrappers);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/yearlyReviews", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> getEmployeeReviewsYearly(@PathVariable int empId)
			throws IOException {
		logger.info("Getting Employee Reviews Data For Employee Id --> " + empId);
		Map<String, String> yearItems = dataService.getEmployeeReviews(empId);
		SingleModelResponse<BaseModel> returnModel = new SingleModelResponse<BaseModel>(true, null);
		String currentYear = Utilities.getCurrentYear();
		if(!(yearItems.containsKey(currentYear))){
			yearItems.put(currentYear, currentYear);
		}
		returnModel.setCustomMessages(yearItems);
		return returnModel;
	}
	
	@RequestMapping(value = "/service/employee/{empId}/review/{year}/{quarter}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeReviewWrapper> getEmployeeReviewByQuarter(@PathVariable int empId, @PathVariable int year, @PathVariable int quarter)
			throws IOException {
		logger.info("Getting Employee Reviews Data For Employee Id --> " + empId);
		List<EmployeeReviewWrapper> empReviewWrapperList = dataService.getEmployeeReviewsByQuarter(empId, year, quarter);
		for(EmployeeReviewWrapper empReviewWrapper: empReviewWrapperList){
			empReviewWrapper.set_self("/service/employee/" + empId + "/reviews");
			empReviewWrapper.setPost(false);
		}
		return new MultipleModelResponse<EmployeeReviewWrapper>(true, empReviewWrapperList);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/review/{year}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<EmployeeReviewWrapper> getEmployeeReviewsForYear(@PathVariable int empId, @PathVariable int year)
			throws IOException {
		logger.info("Getting Employee Reviews Data For Employee Id --> " + empId);
		List<EmployeeReviewWrapper> empReviewWrapperList = dataService.getEmployeeReviews(empId, year);
		for(EmployeeReviewWrapper empReviewWrapper: empReviewWrapperList){
			empReviewWrapper.set_self("/service/employee/" + empId + "/reviews");
			empReviewWrapper.setPost(false);
		}
		return new MultipleModelResponse<EmployeeReviewWrapper>(true, empReviewWrapperList);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/reviews", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeReviewWrapper> insertEmployeeReview(@PathVariable int empId, @RequestBody EmployeeReviewWrapper empReview)
			throws IOException {
		empReview.setEmpId(empId);
		int id = dataService.insertEmployeeReview(empReview);
		empReview.setId(id);
		return new SingleModelResponse<EmployeeReviewWrapper>(true, empReview);
	}
	
	@RequestMapping(value = "/service/employee/{empId}/reviews", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<EmployeeReviewWrapper> updateEmployeeReview(@PathVariable int empId, @RequestBody EmployeeReviewWrapper empReview)
			throws IOException {
		empReview.setEmpId(empId);
		boolean status = dataService.updateEmployeeReview(empReview);
		return new SingleModelResponse<EmployeeReviewWrapper>(status, null);
	}
	
}
