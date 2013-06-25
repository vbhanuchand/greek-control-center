package com.services.core.view.wrappers;

import java.io.Serializable;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonAutoDetect;

@SuppressWarnings({ "serial" })
@JsonAutoDetect(getterVisibility = JsonAutoDetect.Visibility.ANY, fieldVisibility = JsonAutoDetect.Visibility.NONE, setterVisibility = JsonAutoDetect.Visibility.ANY)
public abstract class BaseModel implements Serializable{
	
	private String _self;
	private boolean post;
	
	public String get_self() {
		return _self;
	}
	public void set_self(String _self) {
		this._self = _self;
	}
	public boolean isPost() {
		return post;
	}
	public void setPost(boolean post) {
		this.post = post;
	}
	
}
