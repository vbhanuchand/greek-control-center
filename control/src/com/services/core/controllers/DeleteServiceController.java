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
	@RequestMapping(value = "/service/delete/invoice-details/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<BaseModel> deleteInvoiceItem(@PathVariable int id) {
		String hql = "delete from StoreInvoiceDetails where id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		return new SingleModelResponse<BaseModel>(query.executeUpdate() == 1, null);
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

}
