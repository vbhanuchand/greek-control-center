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
import com.services.core.view.wrappers.MultipleModelResponse;
import com.services.core.view.wrappers.SingleModelResponse;
import com.services.core.view.wrappers.StoreAlarmWrapper;
import com.services.core.view.wrappers.StoreDateWrapper;
import com.services.core.view.wrappers.StoreKeyWrapper;
import com.services.core.view.wrappers.StoreLaborDetailsWrapper;
import com.services.core.view.wrappers.StoreMaintenanceWrapper;
import com.services.core.view.wrappers.StoreWrapper;

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
	
}