package com.services.core.data.dao.impl;

import java.util.Calendar;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.services.core.data.dao.MeetingDAO;
import com.services.core.data.model.Meeting;
import com.services.core.view.utils.QueryParams;
import com.services.core.view.utils.Utilities;


@SuppressWarnings("unchecked")
@Lazy
public class MeetingDAOImpl implements MeetingDAO{
	
	@Autowired
	private SessionFactory sessionFactory;
	
	//Meeting Related Ops
	@Override
	public int getMeetingRecordsCount(QueryParams params){
		Query query = sessionFactory.getCurrentSession().createQuery("select count(*) as count from Meeting where fromTime >= :startDate and toTime < :endDate");
		System.out.println("Getting Records for --> " + Utilities.getParsedDateForMeeting(params.getSubstitutions().get("startDate")) + " --> " + Utilities.getParsedDateForMeeting(params.getSubstitutions().get("endDate")));
		query.setParameter("startDate", Utilities.getParsedZuluDateDojo(params.getSubstitutions().get("startDate")));
		query.setParameter("endDate", Utilities.getParsedZuluDateDojo(params.getSubstitutions().get("endDate")));
		//query.setCacheable(true);
		return Integer.parseInt(String.valueOf(((Long) query.uniqueResult())));
	}
	
	@Override
	public List<Meeting> getMeetingRecords(QueryParams params){
		Query query = sessionFactory.getCurrentSession().createQuery("from Meeting where fromTime >= :startDate and toTime < :endDate order by fromTime");
		query.setParameter("startDate", Utilities.getParsedZuluDateDojo(params.getSubstitutions().get("startDate")));
		query.setParameter("endDate", Utilities.getParsedZuluDateDojo(params.getSubstitutions().get("endDate")));
		query.setFirstResult(params.getStart());
		query.setMaxResults(params.getCount());
		List<Meeting> meetingRecords = query.list();
		return meetingRecords;
	}
	
	@Override
	public Meeting getMeetingRecordById(QueryParams params){
		Query query = sessionFactory.getCurrentSession().createQuery(
				"from Meeting where id = :id");
		query.setParameter("id", Integer.parseInt(params.getSubstitutions().get("id")));
		return (Meeting) query.list().get(0);
	}
	
	@Override
	public boolean updateMeetingRecord(int id, String summary, String agenda, Boolean email,
			String emailText, Calendar fromTime, Calendar toTime, Integer updatedBy){
		String hql = "UPDATE Meeting m set m.summary = :summary, m.agenda = :agenda, m.email = :email, " +
				"m.emailText = :emailText, m.fromTime = :fromTime, m.toTime = :toTime," +
				"m.updatedBy = :updatedBy WHERE m.id = :id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", id);
		query.setParameter("summary", summary);
		query.setParameter("agenda", agenda);
		query.setParameter("email", email);
		query.setParameter("emailText", emailText);
		query.setParameter("fromTime", fromTime);
		query.setParameter("toTime", toTime);
		query.setParameter("updatedBy", updatedBy);
		int result = query.executeUpdate();
		return (result == 1);
	}
	
	@Override
	public Meeting insertMeetingRecord(String summary, String agenda, Boolean email,
			String emailText, Calendar fromTime, Calendar toTime, Integer updatedBy){
		Meeting meeting = new Meeting(summary, agenda, email, emailText, fromTime, toTime, updatedBy);
		sessionFactory.getCurrentSession().save(meeting);
		return meeting;
	}
	
	@Override
	public boolean deleteMeetingRecord(QueryParams params){
		String hql = "delete from Meeting m where m.id = :id";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter("id", Integer.parseInt(params.getSubstitutions().get("id")));
		return query.executeUpdate() == 1;
	}	

}
