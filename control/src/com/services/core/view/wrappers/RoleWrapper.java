package com.services.core.view.wrappers;

import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.services.core.data.model.Role;
import com.services.core.view.utils.CustomDateSerializer;

public class RoleWrapper extends BaseModel {
	
	
	private static final long serialVersionUID = -8085667572060228557L;
	
	private Integer id;
	private Boolean active;
	private Integer storeId;
	private String roleTab;
	private Integer updatedBy;
	private Date updatedDate;
	
	public RoleWrapper(){
		
	}
	
	public RoleWrapper(int id, boolean active, int storeId, String roleTab, int updatedBy, Date updatedDate){
		this.id = id;
		this.active = active;
		this.storeId = storeId;
		this.roleTab = roleTab;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	public String getRoleTab() {
		return roleTab;
	}

	public void setRoleTab(String roleTab) {
		this.roleTab = roleTab;
	}

	public Integer getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdated_by(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

}
