package com.services.core.data.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Type;

import com.services.core.data.model.employee.Employee;

@Entity
@Table(name = "employee_role")
public class Role implements Serializable {

	private static final long serialVersionUID = 5920652462712015025L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "active")
	@Type(type="yes_no")
	private Boolean active;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="employee_id", insertable=false, updatable=false)
	private Employee employee;
	
	@Column(name = "employee_id", nullable = false, insertable=true, updatable=true)
	private Integer employeeId;
	
	@Column(name = "store_id", nullable = false)
	private Integer storeId;
	
	@Column(name = "role_tab")
	private String roleTab;
	
	@Column(name = "updated_by")
	private Integer updated_by;
	
	@Column(name = "updated_date", nullable = true, insertable = false, updatable = false)
	@Temporal(TemporalType.DATE)
	private Date updated_date;

	public Role(){
		super();
	}
	
	public Role(Integer employeeId, Integer storeId, Integer updated_by) {
		super();
		this.employeeId = employeeId;
		this.storeId = storeId;
		this.updated_by = updated_by;
	}



	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Integer getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Integer employeeId) {
		this.employeeId = employeeId;
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

	public Integer getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(Integer updated_by) {
		this.updated_by = updated_by;
	}

	public Date getUpdated_date() {
		return updated_date;
	}

	public void setUpdated_date(Date updated_date) {
		this.updated_date = updated_date;
	}

	public Integer getId() {
		return id;
	}

	@Override
	public String toString() {
		return "Role [id=" + id + ", active=" + active + ", employeeId="
				+ employeeId + ", storeId=" + storeId + ", roleTab=" + roleTab
				+ "]";
	}
	
}
