package com.services.core.data.dao.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.services.core.data.dao.StoreDAO;
import com.services.core.data.model.store.Store;
import com.services.core.data.model.store.StoreAccount;
import com.services.core.data.model.store.StoreAlarm;
import com.services.core.data.model.store.StoreDate;
import com.services.core.data.model.store.StoreInvoice;
import com.services.core.data.model.store.StoreInvoiceDetails;
import com.services.core.data.model.store.StoreKey;
import com.services.core.data.model.store.StoreMaintenance;
import com.services.core.data.model.store.StoreStock;

@Service
@SuppressWarnings("unchecked")
public class StoreDAOImpl implements StoreDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public void insertStore(Store store) {
		sessionFactory.getCurrentSession().save(store);
	}

	@Override
	public void updateStore(Store store) {
		sessionFactory.getCurrentSession().update(store);
	}
	
	@Override
	public Store getStoreById(int id) {
		/*return (Store) sessionFactory.getCurrentSession().get(
				Store.class, id);*/
		Query query = sessionFactory.getCurrentSession().createQuery(
				"from Store where id = :id");
		query.setParameter("id", id);
		return (Store) query.list().get(0);
	}

	@Override
	public Store getStoreByStoreName(String displayName) {
		Query query = sessionFactory.getCurrentSession().createQuery(
				"from Store where displayName = :displayName");
		query.setParameter("displayName", displayName);
		return (Store) query.list().get(0);
	}

	@Override
	public List<Store> getStores() {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(
				Store.class);
		return criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();
	}

	@Override
	public boolean updateStoreInfo(int id, String store_address, String operating_hrs, String contact_details, String lease_copy_loc, String store_notes, int updated_by){
		String hql = "UPDATE Store s set s.store_address = :store_address, " + "s.operating_hrs = :operating_hrs, "  
					+	"s.contact_details = :contact_details, "  +	"s.lease_copy_loc = :lease_copy_loc, " 
					+	"s.store_notes = :store_notes, "  +	"s.updatedBy = :updated_by "  
					+   "WHERE s.id = :store_id and s.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("store_address", store_address);
		query.setParameter("operating_hrs", operating_hrs);
		query.setParameter("contact_details", contact_details);
		query.setParameter("lease_copy_loc", lease_copy_loc);
		query.setParameter("store_notes", store_notes);
		query.setParameter("updated_by", updated_by);
		query.setParameter("store_id", id);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public boolean updateStoreAlarm(int id, int storeId, String name, String code, String position, String notes, int updated_by){
		String hql = "UPDATE StoreAlarm s set s.name = :name, " + "s.code = :code, "  
					+	"s.position = :position, s.updatedBy = :updatedBy, s.notes = :notes "  
					+   "WHERE s.id = :id and s.storeId= :storeId and s.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("name", name);
		query.setParameter("code", code);
		query.setParameter("position", position);
		query.setParameter("updatedBy", updated_by);
		query.setParameter("notes", notes);
		query.setParameter("id", id);
		query.setParameter("storeId", storeId);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public boolean createStoreAlarm(int storeId, String name, String code, String position, String notes, int updated_by){
		StoreAlarm storeAlarm = new StoreAlarm(storeId, name, code, position, notes, updated_by);
		storeAlarm.setActive(true);
		sessionFactory.getCurrentSession().save(storeAlarm);
		return true;
	}
	
	@Override
	public boolean createStoreDate(int storeId, Date impDate, String notes, int updated_by){
		StoreDate storeDate = new StoreDate(storeId, impDate, notes, true, updated_by);
		sessionFactory.getCurrentSession().save(storeDate);
		return true;
	}
	
	@Override
	public boolean createStoreKey(int id, int storeId, String name, String type, String position, String notes, int updated_by){
		StoreKey storeKey = new StoreKey(storeId, name, type, position, notes, updated_by);
		storeKey.setActive(true);
		sessionFactory.getCurrentSession().save(storeKey);
		return true;
	}
	
	@Override
	public boolean updateStoreKey(int id, int storeId, String name, String type, String position, String notes, int updated_by){
		String hql = "UPDATE StoreKey s set s.name = :name, " + "s.type = :type, "  
					+	"s.position = :position, s.updatedBy = :updatedBy "  
					+   "WHERE s.id = :id and s.storeId= :storeId and s.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("name", name);
		query.setParameter("type", type);
		query.setParameter("position", position);
		query.setParameter("updatedBy", updated_by);
		query.setParameter("id", id);
		query.setParameter("storeId", storeId);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public boolean createStoreMaintenance(int id, int storeId, Date date, String notes, String problem, String company, String phone, int updated_by){
		StoreMaintenance storeMaintenance = new StoreMaintenance(storeId, date, notes, problem, company, phone, updated_by);
		storeMaintenance.setActive(true);
		sessionFactory.getCurrentSession().save(storeMaintenance);
		return true;
	}
	
	@Override
	public boolean updateStoreMaintenance(int id, int storeId, Date date, String notes, String problem, String company, String phone, int updated_by){
		String hql = "UPDATE StoreMaintenance s set s.date = :date, " + "s.notes = :notes, "  
					+	"s.problem = :problem, s.company = :company, s.phone = :phone, s.updatedBy = :updatedBy "  
					+   "WHERE s.id = :id and s.storeId= :storeId and s.active=true";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("date", date);
		query.setParameter("notes", notes);
		query.setParameter("problem", problem);
		query.setParameter("company", company);
		query.setParameter("phone", phone);
		query.setParameter("updatedBy", updated_by);
		query.setParameter("id", id);
		query.setParameter("storeId", storeId);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public List<StoreMaintenance> getStoreMaintenanceRecords(int storeId){
		Query query = sessionFactory.getCurrentSession().createQuery("from StoreMaintenance where storeId=:storeId order by date desc");
		query.setParameter("storeId", storeId);
		return query.list();
	}
	
	@Override
	public List<StoreDate> getStoreDateRecords(int storeId){
		Query query = sessionFactory.getCurrentSession().createQuery("from StoreDate where storeId=:storeId order by impDate desc");
		query.setParameter("storeId", storeId);
		return query.list();
	}
	
	@Override
	public List<StoreAlarm> getStoreAlarmRecords(int storeId){
		Query query = sessionFactory.getCurrentSession().createQuery("from StoreAlarm where storeId=:storeId order by position desc");
		query.setParameter("storeId", storeId);
		return query.list();
	}
	
	@Override
	public List<StoreKey> getStoreKeyRecords(int storeId){
		Query query = sessionFactory.getCurrentSession().createQuery("from StoreKey where storeId=:storeId order by position desc");
		query.setParameter("storeId", storeId);
		return query.list();
	}
	
	@Override
	public List<StoreAccount> getStoreAccountByQuarter(int storeId, int year, int quarter){
		Query query = sessionFactory.getCurrentSession().createQuery("from StoreAccount where storeId=:storeId and quarter=:quarter and year=:year");
		query.setParameter("storeId", storeId);
		query.setParameter("quarter", quarter);
		query.setParameter("year", year);
		return query.list();
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public List<String> getStoreAccountYears(int storeId){
		Query query = sessionFactory.getCurrentSession().createQuery("select year as year from StoreAccount where storeId=:storeId");
		query.setParameter("storeId", storeId);
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		List<String> returnList = new ArrayList<String>();
		for(Object yearItem: query.list()){
			Map mapYrItem = (Map) yearItem;
			returnList.add(mapYrItem.get("year").toString());
		}
		return returnList;
	}
	
	@Override
	public List<StoreAccount> getStoreAccountsByYear(int storeId, int year){
		Query query = sessionFactory.getCurrentSession().createQuery("from StoreAccount where storeId=:storeId and year=:year");
		query.setParameter("storeId", storeId);
		query.setParameter("year", year);
		return query.list();
	}
	
	@Override
	public int createStoreAccount(int storeId, int quarter, int year, double labor, double foodCost, double advertisement, double misc, double profit, Boolean active, int updatedBy){
		StoreAccount storeAcc = new StoreAccount(storeId, quarter, year, labor, foodCost, advertisement, misc, profit, true, 1);
		sessionFactory.getCurrentSession().save(storeAcc);
		return storeAcc.getId();
	}
	
	@Override
	public boolean updateStoreAccount(int id, int storeId, int quarter, int year, double labor, double foodCost, double advertisement, double misc, double profit, Boolean active, int updatedBy){
		String hql = "UPDATE StoreAccount sa set sa.storeId = :storeId, sa.quarter = :quarter, sa.year = :year, sa.labor = :labor, " 
				+ "sa.foodCost=:foodCost, sa.advertisement = :advertisement, sa.misc=:misc, sa.profit = :profit, sa.active=:active," 
				+ "sa.updated_by=:updatedBy WHERE sa.id = :id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("storeId", storeId);
		query.setParameter("quarter", quarter);
		query.setParameter("year", year);
		query.setParameter("labor", labor);
		query.setParameter("foodCost", foodCost);
		query.setParameter("advertisement", advertisement);
		query.setParameter("misc", misc);
		query.setParameter("profit", profit);
		query.setParameter("active", active);
		query.setParameter("updatedBy", updatedBy);
		query.setParameter("id", id);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public int insertStoreInvoice(int storeId, Date invoiceDate, boolean locked, boolean active, int updatedBy){
		StoreInvoice storeInv = new StoreInvoice(storeId, invoiceDate, locked, active, updatedBy);
		sessionFactory.getCurrentSession().save(storeInv);
		return storeInv.getId();
	}
	
	@Override
	public boolean updateStoreInvoice(int id, int storeId, Date invoiceDate, boolean locked, boolean active, int updatedBy){
		String hql = "UPDATE StoreInvoice si set si.storeId = :storeId, si.invoiceDate = :invoiceDate, si.locked = :locked, si.active=:active," 
				+ "si.updatedBy=:updatedBy WHERE si.id = :id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("storeId", storeId);
		query.setParameter("invoiceDate", invoiceDate);
		query.setParameter("locked", locked);
		query.setParameter("active", active);
		query.setParameter("updatedBy", updatedBy);
		query.setParameter("id", id);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public int insertStoreInvoiceDetails(int invoiceId, int itemId, int itemCategory, int itemStock, int itemOrder, double itemPricePerUnit, 
			double itemGSPercent, int updatedBy){
		StoreInvoiceDetails storeInv = new StoreInvoiceDetails(invoiceId, itemId, itemCategory, itemStock, itemOrder, itemPricePerUnit, itemGSPercent, updatedBy);
		sessionFactory.getCurrentSession().save(storeInv);
		return storeInv.getId();
	}
	
	@Override
	public boolean updateStoreInvoiceDetails(int id, int invoiceId, int itemId, int itemCategory, int itemStock, int itemOrder, 
			double itemPricePerUnit, double itemGSPercent, int updatedBy){
		String hql = "UPDATE StoreInvoiceDetails si set si.itemId=:itemId, si.itemCategory=:itemCategory, si.itemStock=:itemStock, " 
				+ "si.itemOrder=:itemOrder, si.itemPricePerUnit=:itemPricePerUnit, si.itemGSPercent=:itemGSPercent, "
				+ "si.updatedBy=:updatedBy WHERE si.id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		query.setParameter("itemId", itemId);
		query.setParameter("itemCategory", itemCategory);
		query.setParameter("itemStock", itemStock);
		query.setParameter("itemOrder", itemOrder);
		query.setParameter("itemPricePerUnit", itemPricePerUnit);
		query.setParameter("itemGSPercent", itemGSPercent);
		query.setParameter("updatedBy", updatedBy);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public List<StoreStock> getStoreStock(int storeId){
		Query query = sessionFactory.getCurrentSession().createQuery(
				"from StoreStock where storeId = :storeId");
		query.setParameter("storeId", storeId);
		return query.list();
	}
	
	@Override
	public int insertStoreStock(int storeId, int itemId, int itemCategory, int itemStock, int itemOrder, double itemPricePerUnit, 
			double itemGSPercent, int updatedBy){
		StoreStock storeStock = new StoreStock(storeId, itemId, itemCategory, itemStock, itemOrder, itemPricePerUnit, itemGSPercent, updatedBy);
		sessionFactory.getCurrentSession().save(storeStock);
		return storeStock.getId();
	}
	
	@Override
	public boolean updateStoreStock(int id, int storeId, int itemId, int itemCategory, int itemStock, int itemOrder, double itemPricePerUnit, 
			double itemGSPercent, int updatedBy){
		String hql = "UPDATE StoreInvoiceDetails si set si.itemId=:itemId, si.storeId=:storeId, si.itemCategory=:itemCategory, si.itemStock=:itemStock, " 
				+ "si.itemOrder=:itemOrder, si.itemPricePerUnit=:itemPricePerUnit, si.itemGSPercent=:itemGSPercent, "
				+ "si.updatedBy=:updatedBy WHERE si.id=:id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		query.setParameter("storeId", storeId);
		query.setParameter("itemId", itemId);
		query.setParameter("itemCategory", itemCategory);
		query.setParameter("itemStock", itemStock);
		query.setParameter("itemOrder", itemOrder);
		query.setParameter("itemPricePerUnit", itemPricePerUnit);
		query.setParameter("itemGSPercent", itemGSPercent);
		query.setParameter("updatedBy", updatedBy);
		int result = query.executeUpdate();
		return (result == 1);
	}
}
