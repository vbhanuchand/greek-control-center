package com.services.core.data.dao.impl;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.services.core.data.dao.EmployeeDAO;
import com.services.core.data.model.Role;
import com.services.core.data.model.employee.Employee;
import com.services.core.data.model.employee.EmployeeDiscipline;
import com.services.core.data.model.employee.EmployeeLabor;
import com.services.core.data.model.employee.EmployeeLeaves;
import com.services.core.data.model.employee.EmployeeSalary;
import com.services.core.view.utils.Utilities;

@Service
@SuppressWarnings("unchecked")
public class EmployeeDAOImpl implements EmployeeDAO {
	
	@Autowired
	private SessionFactory sessionFactory;

	public boolean insertEmployee(int storeId, String username, String fname, String lname, String phone, String personalPhone, String emergencyContact, String address, boolean active, int manager, String position, Date hired_date, int updated_by){
		
		Employee emp = new Employee(username, fname, lname, phone, personalPhone, emergencyContact, address, active, manager, position, hired_date, updated_by);
		sessionFactory.getCurrentSession().save(emp);
		Role empRole = new Role(emp.getId(), storeId, updated_by);
		empRole.setActive(true);
		empRole.setRoleTab("store-tab");
		sessionFactory.getCurrentSession().save(empRole);
		return true;
	}
	
	
	@Override
	public boolean updateEmployee(int id, String username, String fname, String lname, String phone, String personalPhone, String emergencyContact, String address, boolean active, 
			int manager, String position, Date hired_date, int updated_by){
		String hql = "update Employee e set e.username=:username, e.fname=:fname, e.lname=:lname, e.phone=:phone, e.personalPhone=:personalPhone, " +
				"e.emergencyContact=:emergencyContact, e.address=:address, e.active=:active, " +
				"e.manager=:manager, e.position=:position, e.hired_date=:hired_date, e.updated_by=:updated_by " + 
				"where e.id = :id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		query.setParameter("username", username);
		query.setParameter("fname", fname);
		query.setParameter("lname", lname);
		query.setParameter("phone", phone);
		query.setParameter("personalPhone", personalPhone);
		query.setParameter("emergencyContact", emergencyContact);
		query.setParameter("address", address);
		query.setParameter("active", active);
		query.setParameter("manager", manager);
		query.setParameter("position", position);
		query.setParameter("hired_date", hired_date);
		query.setParameter("updated_by", updated_by);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	
	@Override
	public List<Employee> getEmployeesByStoreId(int storeId, boolean getMgrOnly){
		Query query;
		if(getMgrOnly){
			query = sessionFactory.getCurrentSession().createQuery("from Employee e where e.id in (select employeeId from Role where storeId=:storeId) and e.position=:position" +
					" order by e.position desc, e.hired_date");
			query.setParameter("position", "Manager");
		}
		else{
			query = sessionFactory.getCurrentSession().createQuery("from Employee e where e.id in (select employeeId from Role where storeId=:storeId)" +
					" order by e.position desc, e.hired_date");
		}
		query.setParameter("storeId", storeId);
		return query.list();
	}
	
	@Override
	public List<EmployeeSalary> getEmployeeSalary(int empId){
		Query query = sessionFactory.getCurrentSession().createQuery("from EmployeeSalary where empId=:empId order by incrementDate desc");
		query.setParameter("empId", empId);
		return query.list();
	}
	
	@Override
	public boolean createEmployeeSalary(int empId, int storeId, double increment, Date incrementDate, double salBefInc, double salAftInc, String notes, int updated_by){
		EmployeeSalary empSalary = new EmployeeSalary(empId, storeId, increment, incrementDate, salBefInc, salAftInc, notes, true, updated_by);
		sessionFactory.getCurrentSession().save(empSalary);
		return true;
	}
	
	@Override
	public boolean updateEmployeeSalary(int id, int empId, int storeId, double increment, Date incrementDate, double salBefInc, 
			double salAftInc, String notes, int updated_by){
		String hql = "UPDATE EmployeeSalary es set es.empId = :empId, " + "es.storeId = :storeId, "  
					+	"es.increment = :increment, es.incrementDate = :incrementDate, es.salBefInc = :salBefInc, "
					+	"es.salAftInc = :salAftInc, es.notes=:notes, es.updated_by=:updated_by "  
					+   "WHERE es.id = :id and es.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("empId", empId);
		query.setParameter("storeId", storeId);
		query.setParameter("increment", increment);
		query.setParameter("incrementDate", incrementDate);
		query.setParameter("salBefInc", salBefInc);
		query.setParameter("salAftInc", salAftInc);
		query.setParameter("notes", notes);
		query.setParameter("updated_by", updated_by);
		query.setParameter("id", id);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public List<EmployeeDiscipline> getEmployeeDiscipline(int empId){
		Query query = sessionFactory.getCurrentSession().createQuery("from EmployeeDiscipline where empId=:empId order by date desc");
		query.setParameter("empId", empId);
		return query.list();
	}
	
	@Override
	public boolean createEmployeeDiscipline(int empId, int storeId, Date date, String notes, String notesType, int updated_by){
		EmployeeDiscipline empDiscipline = new EmployeeDiscipline(empId, storeId, date, notes, notesType, true, updated_by);
		sessionFactory.getCurrentSession().save(empDiscipline);
		return true;
	}
	
	@Override
	public boolean updateEmployeeDiscipline(int id, int empId, int storeId, Date date, String notes, String notesType, int updated_by){
		String hql = "UPDATE EmployeeDiscipline ed set ed.empId = :empId, " + "ed.storeId = :storeId, "  
					+	"ed.date = :date, ed.notes = :notes, ed.notesType = :notesType, "
					+	"ed.updated_by=:updated_by "  
					+   "WHERE ed.id = :id and ed.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("empId", empId);
		query.setParameter("storeId", storeId);
		query.setParameter("date", date);
		query.setParameter("notes", notes);
		query.setParameter("notesType", notesType);
		query.setParameter("updated_by", updated_by);
		query.setParameter("id", id);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public List<EmployeeLeaves> getEmployeeLeaves(int empId){
		Query query = sessionFactory.getCurrentSession().createQuery("from EmployeeLeaves where empId=:empId order by date desc");
		query.setParameter("empId", empId);
		return query.list();
	}
	
	@Override
	public boolean createEmployeeLeaves(int empId, int storeId, Date date, String reason, boolean excused, int activeHrs, boolean active, int updated_by){
		EmployeeLeaves empLeave = new EmployeeLeaves(empId, storeId, date, reason, excused, activeHrs, true, updated_by);
		sessionFactory.getCurrentSession().save(empLeave);
		return true;
	}
	
	@Override
	public boolean updateEmployeeLeaves(int id, int empId, int storeId, Date date, String reason, boolean excused, int activeHrs, boolean active, int updated_by){
		String hql = "UPDATE EmployeeLeaves el set el.empId = :empId, " + "el.storeId = :storeId, "  
					+	"el.date = :date, el.reason = :reason, el.excused = :excused, el.activeHrs = :activeHrs,"
					+	"el.updated_by=:updated_by "  
					+   "WHERE el.id = :id and el.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("empId", empId);
		query.setParameter("storeId", storeId);
		query.setParameter("date", date);
		query.setParameter("reason", reason);
		query.setParameter("excused", excused);
		query.setParameter("activeHrs", activeHrs);
		query.setParameter("updated_by", updated_by);
		query.setParameter("id", id);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public List<EmployeeLabor> getEmployeeLabor(int storeId, int empId){
		Query query = sessionFactory.getCurrentSession().createQuery("from EmployeeLabor where empId=:empId and storeId=:storeId and active=true order by date desc");
		query.setParameter("empId", empId);
		query.setParameter("storeId", storeId);
		return query.list();
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public List getEmployeeLaborByStore(int storeId){
		Query query = sessionFactory.getCurrentSession().createQuery("select date as date, position as position, sum(totalTime) as total from EmployeeLabor where active=true group by date, position, storeId having storeId=:storeId order by date desc");
		query.setParameter("storeId", storeId);
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		return query.list();
	}
	
	public List getStoreLaborDetails(int storeId, Date dateFrom, Date dateTo){
		String hql = "select el.id as id, e.id as empId, e.fname as fname, el.date as date, el.position as position, el.from as from, el.to as to, el.totalTime as totalTime from EmployeeLabor el, Employee e where el.active=true and e.active=true and e.id=el.empId and el.storeId=:storeId and el.date >= :dateFrom and el.date<= :dateTo order by el.date";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("storeId", storeId);
		query.setParameter("dateFrom", dateFrom);
		query.setParameter("dateTo", dateTo);
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		return query.list();
	}
	
	
	
	@Override
	public EmployeeLabor createEmployeeLabor(int empId, int storeId, Date date, int from, int to, String position, boolean active, int updated_by){
		EmployeeLabor empLabor = new EmployeeLabor(empId, storeId, date, from, to, position, true, updated_by);
		empLabor.setTotalTime(Utilities.getTimeSpent(from, to));
		sessionFactory.getCurrentSession().save(empLabor);
		return empLabor;
	}
	
	@Override
	public boolean updateEmployeeLabor(int id, int empId, int storeId, Date date, int from, int to, String position, boolean active, int updated_by){
		String hql = "UPDATE EmployeeLabor el set el.empId = :empId, " + " el.storeId = :storeId, "  
					+	"el.date = :date, el.from = :from, el.to = :to, el.position=:position, el.totalTime=:totalTime, "
					+	"el.updated_by=:updated_by WHERE el.id = :id and el.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("empId", empId);
		query.setParameter("storeId", storeId);
		query.setParameter("date", date);
		query.setParameter("from", from);
		query.setParameter("to", to);
		query.setParameter("totalTime", Utilities.getTimeSpent(from, to));
		query.setParameter("position", position);
		query.setParameter("updated_by", updated_by);
		query.setParameter("id", id);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public boolean deleteEmployeeLabor(int id){
		String hql = "UPDATE EmployeeLabor el set el.active = :active where el.id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		query.setParameter("active", false);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public void insertEmployee(Employee emp) {
		sessionFactory.getCurrentSession().save(emp);
	}
	
	@Override
	public void deleteEmployee(Employee emp) {
		sessionFactory.getCurrentSession().delete(emp);
	}

	@Override
	public Employee getEmployeeById(int id) {
		return (Employee) sessionFactory.getCurrentSession().get(
				Employee.class, id);
	}
	
	@Override
	public Employee getEmployeeByUserName(String username) {
		Query query = sessionFactory.getCurrentSession().createQuery(
				"from Employee where username = :username");
		query.setParameter("username", username);
		return (Employee) query.list().get(0);
	}

	@Override
	public List<Employee> getEmployees() {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(
				Employee.class);
		return criteria.list();
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	

}
