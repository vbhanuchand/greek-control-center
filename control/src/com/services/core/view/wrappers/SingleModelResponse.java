package com.services.core.view.wrappers;

import java.util.Map;

public class SingleModelResponse<E extends BaseModel> {
	private boolean success;
	private E model;
	
	public SingleModelResponse(boolean success, E model) {
        this.success = success;
        this.model = model;
    }
 
    public boolean isSuccess() {
        return success;
    }
 
    public E getModel() {
        return model;
    }
    
    private Map<String, String> customMessages;
	
	public Map<String, String> getCustomMessages() {
		return customMessages;
	}
	public void setCustomMessages(Map<String, String> customMessages) {
		this.customMessages = customMessages;
	}
	
}
