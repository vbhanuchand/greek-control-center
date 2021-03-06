package com.services.core.controllers;

import org.springframework.util.Assert;

public class BaseController {
	
	/*
	 * Local Class for Range and local method for getting the Range from the
	 * Result Set
	 */
	static final class Range {

		private Integer firstResult = 0;
		private Integer maxResults = 0;

		public Range(String range) {
			String[] parsed = range.split("-");
			Assert.isTrue(parsed.length == 2, "Range header in an unexpected format.");
			this.firstResult = new Integer(parsed[0]);
			Integer end = new Integer(parsed[1]);
			this.maxResults = end - firstResult + 1;
		}

		public Integer getFirstResult() {
			return this.firstResult;
		}

		public Integer getMaxResults() {
			return this.maxResults;
		}
	}

	protected String getContentRangeValue(Integer firstResult,
			Integer resultCount, Long totalCount) {
		StringBuilder value = new StringBuilder("items " + firstResult + "-");
		if (resultCount == 0) {
			value.append("0");
		} else {
			value.append(firstResult + resultCount - 1);
		}
		value.append("/" + totalCount);
		return value.toString();
	}
	
}
