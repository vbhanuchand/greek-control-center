package com.services.core.data.dao;

import java.util.Calendar;
import java.util.List;

import com.services.core.data.model.Meeting;
import com.services.core.view.utils.QueryParams;

public interface MeetingDAO {

	// Meeting Related Ops
	int getMeetingRecordsCount(QueryParams params);

	List<Meeting> getMeetingRecords(QueryParams params);

	Meeting getMeetingRecordById(QueryParams params);

	Meeting insertMeetingRecord(String summary, String agenda, Boolean email,
			String emailText, Calendar fromTime, Calendar toTime, Integer updatedBy);

	boolean updateMeetingRecord(int id, String summary, String agenda, Boolean email,
			String emailText, Calendar fromTime, Calendar toTime, Integer updatedBy);

	boolean deleteMeetingRecord(QueryParams params);

}
