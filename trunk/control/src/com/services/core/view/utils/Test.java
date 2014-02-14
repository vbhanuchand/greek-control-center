package com.services.core.view.utils;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		//System.out.println("Dates Testing --> " + Utilities.getStringforLaborSkeleton("2013-09-14") + " New --> " + Utilities.newGetStringforLaborSkeleton("2013-09-14"));
		//System.out.println("Dates Testing --> " + Utilities.newGetWeekNumber("2013-12-29") + " New --> " + Utilities.newGetWeekNumber("2014-01-01"));
		
		//System.out.println("Dates Testing --> " + Utilities.newGetStartDateEndDate("2013-52"));
		String inVal = "1/11/2014";
		System.out.println("Testing --> " + Utilities.getLocalDateFormattedForEmail(inVal));
	}

}
