package com.services.core.view.wrappers;

import java.util.List;
import java.util.Map;

public class MultipleModelResponse<E extends BaseModel> {
	
	private boolean success;
	private List<E> models;
	
	public MultipleModelResponse(boolean success, List<E> models) {
        this.success = success;
        this.models = models;
    }
 
    public boolean isSuccess() {
        return success;
    }
 
    public List<E> getModels() {
        return models;
    }
    
    private Map<String, String> customMessages;
	
	public Map<String, String> getCustomMessages() {
		return customMessages;
	}
	public void setCustomMessages(Map<String, String> customMessages) {
		this.customMessages = customMessages;
	}
	
}
