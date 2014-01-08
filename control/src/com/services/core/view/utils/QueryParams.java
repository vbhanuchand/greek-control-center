package com.services.core.view.utils;

import java.util.HashMap;
import java.util.Map;

public class QueryParams {
	
	private int start;
	private int count;
	private Map<String, String> substitutions;
	private Map<String, String> orderBy;

	public QueryParams() {
		super();
		this.start = 0;
		this.count = 1;
		this.substitutions = new HashMap<String, String>();
		this.orderBy = new HashMap<String, String>();
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public Map<String, String> getSubstitutions() {
		return substitutions;
	}

	public void setSubstitutions(Map<String, String> substitutions) {
		this.substitutions = substitutions;
	}
	
	public Map<String, String> getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(Map<String, String> order) {
		this.orderBy = order;
	}

	@Override
	public String toString() {
		return "QueryParams [start=" + start + ", count=" + count
				+ ", substitutions=" + substitutions + ", orderBy=" + orderBy + "]";
	}
	
}
