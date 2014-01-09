package com.services.core.data.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.services.core.data.dao.BlobDAO;
import com.services.core.data.model.Blobs;


@SuppressWarnings("unchecked")
@Lazy
public class BlobDAOImpl implements BlobDAO{

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public boolean insertBlobReference(Integer linkedId, String fileName, String blobKey, String tab, Boolean active, Integer updatedBy){
		Blobs blob = new Blobs(linkedId, fileName, blobKey, tab, active, updatedBy);
		sessionFactory.getCurrentSession().save(blob);
		return true;
	}
	
	@Override
	public List<Blobs> getBlobReference(Integer linkedId, String tab, Boolean active){
		Query query = sessionFactory.getCurrentSession().createQuery("from Blobs b where b.linkedId=:linkedId and b.active=:active and b.tab=:tab order by updatedDate desc");
		query.setParameter("linkedId", linkedId);
		query.setParameter("active", active);
		query.setParameter("tab", tab);
		return query.list();
	}
	
}
