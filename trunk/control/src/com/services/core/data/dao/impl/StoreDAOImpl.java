package com.services.core.data.dao.impl;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.services.core.data.dao.StoreDAO;
import com.services.core.data.model.store.Store;
import com.services.core.data.model.store.StoreAlarm;
import com.services.core.data.model.store.StoreDate;
import com.services.core.data.model.store.StoreKey;
import com.services.core.data.model.store.StoreMaintenance;

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
	
	
	/*@Override
	public List<StoreMaintenance> getStoreMaintenanceRecords(int storeId) {
		Query query = sessionFactory.getCurrentSession().createQuery(
				"from Store where storeId = :storeId");
		query.setParameter("storeId", storeId);
		List<Store> list = (List<StoreMaintenance>) query.list();
		return list;
	}

	@Override
	public List<StoreAlarm> getStoreAlarmRecords(int storeId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<StoreDate> getStoreDateRecords(int storeId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<StoreKey> getStoreKeyRecords(int storeId) {
		// TODO Auto-generated method stub
		return null;
	}*/
}
