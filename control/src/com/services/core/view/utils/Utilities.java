package com.services.core.view.utils;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Utilities {
	
	//public static SimpleDateFormat laborScheduleFormatter = new SimpleDateFormat("MMM dd, yyyy");
	public static SimpleDateFormat laborScheduleFormatter = new SimpleDateFormat("MM/dd/yyyy");
	public static SimpleDateFormat dbDateFormatter = new SimpleDateFormat("yyyy-MM-dd");
	private static DecimalFormat dataBaseDecimalFormat = new DecimalFormat("##.##");

	// Returns the skeleton string from the "date"'s MONDAY to SUNDAY week
	//Week is MONDAY to SUNDAY
	public static String newGetStringforLaborSkeleton(String date){
		String returnDate="";
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		if(cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY){
			returnDate = laborScheduleFormatter.format(cal.getTime());
			cal.add(Calendar.DATE, -6);
			returnDate = laborScheduleFormatter.format(cal.getTime()) + " to " + returnDate;
		} else {
			cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
			returnDate = laborScheduleFormatter.format(cal.getTime());
			cal.add(Calendar.DATE, 6);
			returnDate = returnDate + " to " + laborScheduleFormatter.format(cal.getTime());
		}
		return returnDate;
	}
	
	//Week is SUNDAY to SATURDAY
	public static String getStringforLaborSkeleton(String date){
		String returnDate="";
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
		returnDate = laborScheduleFormatter.format(cal.getTime());
		cal.add(Calendar.DATE, 6);
		returnDate = returnDate + " to " + laborScheduleFormatter.format(cal.getTime());
		return returnDate;
	}
	
	//Returns Week Number based on MONDAY TO SUNDAY week
	public static String newGetWeekNumber(String date){
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		
		if(cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY){
			return (String.valueOf(cal.get(Calendar.YEAR)) + "-" + String.valueOf(cal.get(Calendar.WEEK_OF_YEAR) - 1));
		} else {
			return (String.valueOf(cal.get(Calendar.YEAR)) + "-" + String.valueOf(cal.get(Calendar.WEEK_OF_YEAR)));
		}
	}	
	
	
	
	//Returns Week Number based on SUNDAY TO SATURDAY week
	public static String getWeekNumber(String date){
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		return (String.valueOf(cal.get(Calendar.YEAR)) + "-" + String.valueOf(cal.get(Calendar.WEEK_OF_YEAR)));
	}
	
	public static String getCurrentYear(){
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		return String.valueOf(cal.get(Calendar.YEAR));
	}
	
	//Returns MONDAY to SUNDAY week dates 
	public static Map<String, Date> newGetStartDateEndDate(String yearWeek){
		Map<String, Date> returnMap = new HashMap<String, Date>();
		String[] yearWeekArray= yearWeek.split("-");
		String date = yearWeekArray[0] + "-01-01";
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		cal.set(Calendar.WEEK_OF_YEAR, Integer.parseInt(yearWeekArray[1]));
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		Date startDate = cal.getTime();
		cal.add(Calendar.DAY_OF_WEEK, 6);
		Date endDate = cal.getTime();
		
		returnMap.put("startDate", startDate);
		returnMap.put("endDate", endDate);
		return returnMap;
	}	
	
	//Returns SUNDAY to SATURDAY week dates 
	public static Map<String, Date> getStartDateEndDate(String yearWeek){
		Map<String, Date> returnMap = new HashMap<String, Date>();
		String[] yearWeekArray= yearWeek.split("-");
		String date = yearWeekArray[0] + "-01-01";
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		cal.set(Calendar.WEEK_OF_YEAR, Integer.parseInt(yearWeekArray[1]));
		cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
		Date startDate = cal.getTime();
		cal.add(Calendar.DAY_OF_WEEK, 6);
		Date endDate = cal.getTime();
		
		returnMap.put("startDate", startDate);
		returnMap.put("endDate", endDate);
		return returnMap;
	}
	
	//Returns MONDAY to SUNDAY Formatted data
	public static String newGetFormattedStartDateEndDate(String yearWeek){
		String returnString = "";
		String[] yearWeekArray= yearWeek.split("-");
		String date = yearWeekArray[0] + "-01-01";
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		cal.set(Calendar.WEEK_OF_YEAR, Integer.parseInt(yearWeekArray[1]));
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		Date startDate = cal.getTime();
		cal.add(Calendar.DAY_OF_WEEK, 6);
		Date endDate = cal.getTime();
		returnString = laborScheduleFormatter.format(startDate) + " to " + laborScheduleFormatter.format(endDate);
		return returnString;
	}
	
	public static String getFormattedStartDateEndDate(String yearWeek){
		String returnString = "";
		String[] yearWeekArray= yearWeek.split("-");
		String date = yearWeekArray[0] + "-01-01";
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(dbDateFormatter.parse(date));
		} catch (ParseException e) {
			cal.setTime(new Date());
		}
		cal.set(Calendar.WEEK_OF_YEAR, Integer.parseInt(yearWeekArray[1]));
		cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
		Date startDate = cal.getTime();
		cal.add(Calendar.DAY_OF_WEEK, 6);
		Date endDate = cal.getTime();
		returnString = laborScheduleFormatter.format(startDate) + " to " + laborScheduleFormatter.format(endDate);
		return returnString;
	}
	
	public static double getTimeSpent(int from, int to){
		double finalValue = 0, tempValue=0, delta=0;
		if(to > from){
			tempValue = (to-from)/100;
			delta = (to-from)%100;
			finalValue = (delta > 0) ? (tempValue + (delta/60)) : tempValue;
			return Double.parseDouble(dataBaseDecimalFormat.format(finalValue));
		}else return 0;
	}
	
	public static String getSummary(String fname, Integer fromTime, Integer toTime){
		String strFTime = "";
		String strETime = "";
		int fTime = fromTime;
		int eTime = toTime;
		int hh=0;
		int mi=0;
		if(fTime > 0){
			hh = fTime/100;
			mi = fTime%100;
			if(hh > 12) strFTime = hh-12 + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi)));// + " PM";
			else if(hh < 12) strFTime = hh + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi)));// + " AM";
			else if(hh == 12) strFTime = hh + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi)));// + " PM";
		}else strFTime="12:00";// AM";
		if(eTime > 0){
			hh = eTime/100;
			mi = eTime%100;
			if(hh > 12) strETime = hh-12 + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi))) + " PM";
			else if(hh < 12) strETime = hh + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi))) + " AM";
			else if(hh == 12) strETime = hh + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi))) + " PM";
		}else strETime="12:00";// AM";
		
		return "<span style='font-size: 90%;'>" + fname + "</span>&nbsp;<span style='font-size: 80%;'>" + strFTime + " - " + strETime + "</span>";
	}
	
}
