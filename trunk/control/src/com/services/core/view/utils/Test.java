package com.services.core.view.utils;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("Dates Testing --> " + Utilities.getStringforLaborSkeleton("2013-10-26") + " New --> " + Utilities.newGetStringforLaborSkeleton("2013-10-26"));
		System.out.println("Dates Testing --> " + Utilities.getWeekNumber("2013-10-27") + " New --> " + Utilities.newGetWeekNumber("2013-10-27"));
	}

}
