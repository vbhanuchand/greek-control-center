package com.services.core.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.services.core.data.mgr.DataManager;
import com.services.core.view.utils.Utilities;
import com.services.core.view.wrappers.BaseModel;
import com.services.core.view.wrappers.EmployeeReviewWrapper;
import com.services.core.view.wrappers.ItemWrapper;
import com.services.core.view.wrappers.MultipleModelResponse;
import com.services.core.view.wrappers.SingleModelResponse;
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

@Controller
//@RequestMapping("/service")
public class StoreServiceController {

	@Autowired
	private DataManager dataService;
	
	private static Logger logger = Logger.getAnonymousLogger();
	
	
	//@RequestMapping(value = "/start", method = RequestMethod.GET)
	@RequestMapping(value = "/start", method = RequestMethod.GET)
	public String startPage() {
		  return "welcome";
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String redirect2(ModelMap model) {
		  return "welcome";
	}
	
	@RequestMapping(value = "/service/stores", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreWrapper> getStores() throws IOException {
		logger.info("Getting Stores Data --> " + "ALL");
		List<StoreWrapper> storeWrappers = dataService.getStores();
		return new MultipleModelResponse<StoreWrapper>(true, storeWrappers);
	}
	
	@RequestMapping(value = "/service/store/storeId={storeId}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> getStoreInformation(@PathVariable int storeId) throws IOException {
		logger.info("Getting Store Data --> " + storeId);
		StoreWrapper store = dataService.getStoreInfo(storeId);
		return new SingleModelResponse<StoreWrapper>(true, store);
	}
	
	
	@RequestMapping(value = "/service/store/{storeId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> updateStore(@PathVariable int storeId,
			@RequestBody StoreWrapper storeWrapper) throws IOException {
		logger.info("Store Put --> " + storeWrapper.toString());
		boolean updateStatus = dataService.updateStoreInfo(storeWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}

	
	
	@RequestMapping(value = "/service/store/{storeId}/alarms", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreAlarmWrapper> getStoreAlarms(@PathVariable int storeId) throws IOException {
		logger.info("Getting Store Alarm Data --> " + storeId);
		List<StoreAlarmWrapper> storeAlarms = dataService.getStoreAlarms(storeId);
		for(StoreAlarmWrapper storeAlarm: storeAlarms){
			storeAlarm.set_self("/service/store/" + storeId + "/alarms");
			storeAlarm.setPost(false);
		}
		return new MultipleModelResponse<StoreAlarmWrapper>(true, storeAlarms);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/dates", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreDateWrapper> getStoreDates(@PathVariable int storeId) throws IOException {
		logger.info("Getting Store Alarm Data --> " + storeId);
		List<StoreDateWrapper> storeDates = dataService.getStoreDates(storeId);
		for(StoreDateWrapper storeDate: storeDates){
			storeDate.set_self("/service/store/" + storeId + "/dates");
			storeDate.setPost(false);
		}
		return new MultipleModelResponse<StoreDateWrapper>(true, storeDates);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/dates", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> insertStoreDate(@PathVariable int storeId,
			@RequestBody StoreDateWrapper storeDateWrapper) throws IOException {
		logger.info("Store Put --> " + storeDateWrapper.toString());
		boolean updateStatus = dataService.insertStoreDate(storeDateWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}
	
	
	@RequestMapping(value = "/service/store/{storeId}/alarms", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> insertStoreAlarm(@PathVariable int storeId,
			@RequestBody StoreAlarmWrapper storeAlarmWrapper) throws IOException {
		logger.info("Store Put --> " + storeAlarmWrapper.toString());
		boolean updateStatus = dataService.insertStoreAlarm(storeAlarmWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/alarms", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> updateStoreAlarm(@PathVariable int storeId,
			@RequestBody StoreAlarmWrapper storeAlarmWrapper) throws IOException {
		logger.info("Store Put --> " + storeAlarmWrapper.toString());
		boolean updateStatus = dataService.updateStoreAlarm(storeAlarmWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/keys", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreKeyWrapper> getStoreKeys(@PathVariable int storeId) throws IOException {
		logger.info("Store Keys Get --> " + storeId);
		List<StoreKeyWrapper> storeKeyRecords = dataService.getStoreKeys(storeId);
		for(StoreKeyWrapper storeKey: storeKeyRecords){
			storeKey.set_self("/service/store/" + storeId + "/keys");
			storeKey.setPost(false);
		}
		return new MultipleModelResponse<StoreKeyWrapper>(true, storeKeyRecords);
	}
	
	
	@RequestMapping(value = "/service/store/{storeId}/keys", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> insertStoreKey(@PathVariable int storeId,
			@RequestBody StoreKeyWrapper storeKeyWrapper) throws IOException {
		logger.info("Store Key Put --> " + storeKeyWrapper.toString());
		boolean updateStatus = dataService.insertStoreKey(storeKeyWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/keys", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> updateStoreKey(@PathVariable int storeId,
			@RequestBody StoreKeyWrapper storeKeyWrapper) throws IOException {
		logger.info("Store Put --> " + storeKeyWrapper.toString());
		boolean updateStatus = dataService.updateStoreKey(storeKeyWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/maintenance", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreMaintenanceWrapper> getStoreMaintenance(@PathVariable int storeId) throws IOException {
		logger.info("Getting Store Data --> " + storeId);
		List<StoreMaintenanceWrapper> storeMaintenanceRecords = dataService.getStoreMaintenanceRecords(storeId);
		for(StoreMaintenanceWrapper storeMaintenance: storeMaintenanceRecords){
			storeMaintenance.set_self("/service/store/" + storeId + "/maintenance");
			storeMaintenance.setPost(false);
		}
		return new MultipleModelResponse<StoreMaintenanceWrapper>(true, storeMaintenanceRecords);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/maintenance", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> insertStoreMaintenance(@PathVariable int storeId,
			@RequestBody StoreMaintenanceWrapper storeMaintenanceWrapper) throws IOException {
		logger.info("Store Post --> " + storeMaintenanceWrapper.toString());
		boolean updateStatus = dataService.insertStoreMaintenance(storeMaintenanceWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/maintenance", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreWrapper> updateStoreMaintenance(@PathVariable int storeId,
			@RequestBody StoreMaintenanceWrapper storeMaintenanceWrapper) throws IOException {
		logger.info("Store Put --> " + storeMaintenanceWrapper.toString());
		boolean updateStatus = dataService.updateStoreMaintenance(storeMaintenanceWrapper);
		return new SingleModelResponse<StoreWrapper>(updateStatus, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/labor/schedule", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String, String>> getEmployeeLabor(@PathVariable int storeId)
			throws IOException {
		logger.info("Getting Employees Labor Schedule For Store Id --> " + storeId);
		return dataService.getLaborByStore(storeId);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/labor/{yearWeek}/schedule", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreLaborDetailsWrapper> getEmployeeLaborDetails(@PathVariable int storeId, @PathVariable String yearWeek)
			throws IOException {
		logger.info("Getting Employees Labor Details For Store Id --> " + storeId + " --> " + yearWeek);
		MultipleModelResponse<StoreLaborDetailsWrapper> returnModel = new MultipleModelResponse<StoreLaborDetailsWrapper>(true, dataService.getLaborDetails(storeId, yearWeek));
		Map<String, String> customMessages = new HashMap<String, String>();
		customMessages.put("skeleton", Utilities.getFormattedStartDateEndDate(yearWeek));
		returnModel.setCustomMessages(customMessages);
		
		for(StoreLaborDetailsWrapper item: returnModel.getModels()){
			item.set_self("/service/store/" + storeId + "/employee/"+ item.getEmpId() +"/labor");
			item.setPost(false);
		}
		
		return returnModel;
	}
	
	@RequestMapping(value = "/service/store/{storeId}/accounting/years", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> getStoreAccountingYears(@PathVariable int storeId)
			throws IOException {
		SingleModelResponse<BaseModel> model = new SingleModelResponse<BaseModel>(true, null);
		Map<String, String> map = new HashMap<String, String>();
		for(String year: dataService.getStoreAccountYears(storeId))
			map.put(year, year);
		model.setCustomMessages(map);
		return model;
	}
	
	@RequestMapping(value = "/service/store/{storeId}/accounting/year/{year}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreAccountWrapper> getStoreAccountsByYear(@PathVariable int storeId, @PathVariable int year)
			throws IOException {
		return new MultipleModelResponse<StoreAccountWrapper>(true, dataService.getStoreAccountsByYear(storeId, year));
	}
	
	@RequestMapping(value = "/service/store/{storeId}/accounting/year/{year}/quarter/{quarter}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreAccountWrapper> getStoreAccountByQuarter(@PathVariable int storeId, @PathVariable int year, @PathVariable int quarter)
			throws IOException {
		return new MultipleModelResponse<StoreAccountWrapper>(true, dataService.getStoreAccountByQuarter(storeId, year, quarter));
	}
	
	@RequestMapping(value = "/service/store/{storeId}/accounting/year/{year}/quarter/{quarter}", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreAccountWrapper> saveStoreAccount(@PathVariable int storeId, @PathVariable int year, @PathVariable int quarter, @RequestBody StoreAccountWrapper accData)
			throws IOException {
		int id = dataService.insertStoreAccount(accData);
		accData.setId(id);
		return new SingleModelResponse<StoreAccountWrapper>(true, accData);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/accounting/year/{year}/quarter/{quarter}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreAccountWrapper> updateStoreAccount(@PathVariable int storeId, @PathVariable int year, @PathVariable int quarter, @RequestBody StoreAccountWrapper accData)
			throws IOException {
		boolean status = dataService.updateStoreAccount(accData);
		return new SingleModelResponse<StoreAccountWrapper>(status, null);
	}
	
	
	
	//Accounting related methods start here
	@RequestMapping(value = "/service/store/{storeId}/{category}/stock", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreStockWrapper> getStoreStock(@PathVariable int storeId, @PathVariable String category)
			throws IOException {
		List<StoreStockWrapper> items = dataService.getStoreStock(storeId, category);
		for(StoreStockWrapper tempItem: items){
			tempItem.set_self("/service/store/" + storeId + "/" + category + "/stock");
		}
		return new MultipleModelResponse<StoreStockWrapper>(true, items);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/{category}/stock", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreStockWrapper> saveStoreStock(@PathVariable int storeId, @PathVariable String category, @RequestBody StoreStockWrapper storeStock)
			throws IOException {
		int id = dataService.insertStoreStock(storeStock, category);
		storeStock.setId(id);
		return new SingleModelResponse<StoreStockWrapper>(true, storeStock);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/{category}/stock", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreStockWrapper> updateStoreStock(@PathVariable int storeId, @PathVariable String category, @RequestBody StoreStockWrapper storeStock)
			throws IOException {
		return new SingleModelResponse<StoreStockWrapper>(dataService.updateStoreStock(storeStock, category), null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/{category}/invoice", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreInvoiceWrapper> saveStoreInvoice(@PathVariable int storeId, @PathVariable String category, @RequestBody StoreInvoiceWrapper storeInvoice)
			throws IOException {
		int id = dataService.insertStoreInvoice(storeInvoice, category);
		storeInvoice.setId(id);
		return new SingleModelResponse<StoreInvoiceWrapper>(true, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/{category}/invoice", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreInvoiceWrapper> getStoreInvoices(@PathVariable int storeId, @PathVariable String category)
			throws IOException {
		return new MultipleModelResponse<StoreInvoiceWrapper>(true, dataService.getStoreInvoices(storeId, category));
	}
	
	@RequestMapping(value = "/service/store/invoice/{invoiceId}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<StoreInvoiceDetailsWrapper> getInvoiceDetails(@PathVariable int invoiceId)
			throws IOException {
		List<StoreInvoiceDetailsWrapper> items = dataService.getInvoiceDetails(invoiceId);
		for(StoreInvoiceDetailsWrapper tempItem: items){
			tempItem.set_self("/service/store/invoiceDetail/" + tempItem.getId());
		}
		return new MultipleModelResponse<StoreInvoiceDetailsWrapper>(true, items);
	}
	
	@RequestMapping(value = "/service/store/invoiceDetail/{invoiceItemId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<StoreInvoiceDetailsWrapper> updateInvoiceItem(@PathVariable int invoiceItemId, @RequestBody StoreInvoiceDetailsWrapper storeInvDetail)
			throws IOException {
		return new SingleModelResponse<StoreInvoiceDetailsWrapper>(dataService.updateStoreInvoiceDetails(storeInvDetail), null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/{category}/distributors", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<ItemWrapper> getDistributorsForStore(@PathVariable int storeId, @PathVariable String category)
			throws IOException {
		return new MultipleModelResponse<ItemWrapper>(true, dataService.getDistributors(storeId, category));
	}
	
	@RequestMapping(value = "/service/store/{storeId}/{category}/items", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<ItemWrapper> insertInventoryItems(@PathVariable int storeId, @PathVariable String category, @RequestBody ItemWrapper itemWrapper)
			throws IOException {
		itemWrapper.setUpdatedBy(0);
		int id = dataService.insertStoreItem(itemWrapper, category);
		return new SingleModelResponse<ItemWrapper>(true, null);
	}
	
	
	
	//Health Inspection Tab related methods starts here
	@RequestMapping(value = "/service/store/{storeId}/health", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<UploadNotesWrapper> getHealthInspectionDetails(@PathVariable int storeId)
			throws IOException {
		String tab = "healthInspection";
		return new MultipleModelResponse<UploadNotesWrapper>(true, dataService.getHealthInspectionDetails(storeId, tab));
	}
	
	@RequestMapping(value = "/service/store/{storeId}/health", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<UploadNotesWrapper> insertHealthInspectionDetails(@PathVariable int storeId, @RequestBody UploadNotesWrapper uploadNotesDetails)
			throws IOException {
		String tab = "healthInspection";
		uploadNotesDetails.setLinkedId(storeId);
		uploadNotesDetails.setPurpose(tab);
		int id = dataService.insertHealthInspectionDetails(uploadNotesDetails);
		return new SingleModelResponse<UploadNotesWrapper>(true, null);
	}
	
	@RequestMapping(value = "/service/store/{storeId}/health/{healthId}", method = RequestMethod.PUT, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<UploadNotesWrapper> updateHealthInspectionDetails(@PathVariable int storeId, @PathVariable int healthId, @RequestBody UploadNotesWrapper uploadNotesDetails)
			throws IOException {
		uploadNotesDetails.setId(healthId);
		uploadNotesDetails.setLinkedId(storeId);
		uploadNotesDetails.setPurpose("healthInspection");
		boolean execute = dataService.updateHealthInspectionDetails(uploadNotesDetails);
		return new SingleModelResponse<UploadNotesWrapper>(execute, null);
	}
	
}
