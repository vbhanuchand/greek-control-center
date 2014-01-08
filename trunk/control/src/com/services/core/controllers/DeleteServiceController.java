package com.services.core.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.util.logging.Logger;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.services.core.view.wrappers.BaseModel;
import com.services.core.view.wrappers.SingleModelResponse;

@Controller
public class DeleteServiceController {

	@Autowired
	private SessionFactory sessionFactory;

	private static Logger logger = Logger.getAnonymousLogger();

	@Transactional
	@RequestMapping(value = "/service/delete/date/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteDate(@PathVariable int id) {
		String hql = "delete from StoreDate where id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/delete/blob/{id}/{blobSrc}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteBlob(@PathVariable int id, @PathVariable String blobSrc) {
		String hql = "delete from Blobs where id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/delete/store/{id}/{tab}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteStoreTabs(@PathVariable int id, @PathVariable String tab) {
		String hql = "";
		switch(tab){
			case "sa":
				hql = "delete from StoreAlarm where id=:id"; 
				break;
			case "sk":
				hql = "delete from StoreKey where id=:id"; 
				break;
			case "sm":
				hql = "delete from StoreMaintenance where id=:id"; 
				break;
		}
		
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/delete/employee/leaves/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteManagerLeaves(@PathVariable int id) {
		String hql = "delete from EmployeeLeaves where id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/delete/employee/{table}/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteManagerLeaves(@PathVariable String table, @PathVariable int id) {
		String hql = "";
		switch(table){
			case "emp-salary":
				hql = "delete from EmployeeSalary where id=:id";
				break;
			case "emp-discipline":
				hql = "delete from EmployeeDiscipline where id=:id";
				break;
			case "emp-good":
				hql = "delete from EmployeeDiscipline where id=:id";
				break;
			case "emp-missed":
				hql = "delete from EmployeeLeaves where id=:id";
				break;
		}
		
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/delete/invoice-details/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteInvoiceItem(@PathVariable int id) {
		String hql = "delete from StoreInvoiceDetails where id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/delete/invoice/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteInvoice(@PathVariable int id) {
		boolean returnVal = false;
		String hql = "delete from StoreInvoice where id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		returnVal = (query.executeUpdate() == 1);
		
		String hql1 = "delete from StoreInvoiceDetails where invoiceId=:invoiceId";
		Query query1 = sessionFactory.getCurrentSession().createQuery(hql1);
		query1.setParameter("invoiceId", id);
		returnVal = returnVal && (query1.executeUpdate() >= 0);
		return new SingleModelResponse<BaseModel>(returnVal, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/delete/stock-item/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteStockItem(@PathVariable int id) {
		String hql = "delete from StoreStock where id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	@Transactional
	@RequestMapping(value = "/service/resetPassword/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> resetEmployeePassword(@PathVariable int id) {
		String hql = "update Employee e set e.password=:password where e.id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		query.setParameter("password", "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8");
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
	}
	
	

}
