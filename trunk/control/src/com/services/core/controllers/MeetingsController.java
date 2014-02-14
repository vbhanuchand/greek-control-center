package com.services.core.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;

import com.services.core.data.mgr.DataManager;
import com.services.core.view.utils.QueryParams;
import com.services.core.view.utils.Utilities;
import com.services.core.view.wrappers.MeetingWrapper;

@Controller
@RequestMapping("/service/meetings")
@Lazy
public class MeetingsController extends BaseController{

	private static final String ACCEPT_JSON = "Accept=application/json";
	//private static final String CONTENT_RANGE_HEADER = "Content-Range";
	//private static final String RANGE_PREFIX = "items=";

	@Autowired
	private DataManager dataService;

	private static Logger logger = Logger.getLogger(MeetingsController.class.getName());
	
	@RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE, params = {"startDate", "endDate"})
	@ResponseBody
	public HttpEntity<List<MeetingWrapper>> getCalendarRecords(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate)
			throws IOException {
		logger.info("Start Date End Date Params --> " + startDate + " --> " + endDate);
		QueryParams queryParams = new QueryParams();
		queryParams.setStart(0);
		queryParams.setCount(100);
		String storeId = "1";
		queryParams.getSubstitutions().put("startDate", startDate);
		queryParams.getSubstitutions().put("endDate", endDate);
		
		/*//Extracting Sort Params starts here
		if(sort != null)
			for(String sortParam: sort.split(","))
				queryParams.getOrderBy().put(sortParam.contains("-") || sortParam.contains("+") ? sortParam.substring(1, sortParam.length()) : sortParam, sortParam.contains("-") ? "desc" : "asc");
		//Extraction of Sort Params ends here*/
		
		long count = 0;
		List<MeetingWrapper> body = new ArrayList<MeetingWrapper>();
		HttpHeaders headers = new HttpHeaders();
		logger.info("Query Parameters for DB query --> " + queryParams);
		try{
			if(Integer.parseInt(storeId) > 0)
				count = dataService.getCalendarRecordsCount(queryParams);
			logger.info("Count retrieved --> " + count);
		}catch(Exception e){
			count = 0;
		}
		if(count > 0){
			body = dataService.getCalendarRecords(queryParams);
		}
		logger.info("Fetched records --> " + body.size());
		return new HttpEntity<List<MeetingWrapper>>(body, headers);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, headers = ACCEPT_JSON, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MeetingWrapper getCalendarInformation(@PathVariable("id") int id, HttpServletResponse response) 
			throws IOException {
		logger.info("GET Store Employee data for " + id);
		QueryParams queryParams = new QueryParams();
		queryParams.getSubstitutions().put("id", String.valueOf(id));
		MeetingWrapper returnWrapper = dataService.getCalendarRecordById(queryParams);
		if(returnWrapper != null){
			response.setStatus(HttpStatus.OK.value());
			return returnWrapper;
		}
		else {
			response.setStatus(HttpStatus.NOT_FOUND.value());
			return null;
		}
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, headers = ACCEPT_JSON, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MeetingWrapper updateCalendarRecord(@RequestBody MeetingWrapper meeting, @PathVariable("id") Integer id, HttpServletResponse response) throws IOException {
		Assert.isTrue(id.equals(meeting.getId()));
		logger.info("store PUT / POST --> No headers " + meeting);
		meeting.setUpdatedBy(0);
		response.setStatus(HttpStatus.OK.value());  
		response.setHeader("Location", "/service/meetings/" + meeting.getId());
		dataService.updateCalendarRecord(meeting);
		return meeting;
	}

	@RequestMapping(value = "/", method = { RequestMethod.POST, RequestMethod.PUT }, headers = { ACCEPT_JSON, "If-None-Match=*" }, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MeetingWrapper createCalendarRecord(@RequestBody MeetingWrapper meeting, HttpServletResponse response, WebRequest request) throws IOException {
		logger.info("Calendar PUT / POST --> If-None-Match header " + meeting);
		meeting.setUpdatedBy(0);
		MeetingWrapper newWrapper = dataService.insertCalendarRecord(meeting);
		if(newWrapper != null){
			response.setStatus(HttpStatus.CREATED.value());
			response.setHeader("Location", "/service/meetings/" + newWrapper.getId());
		}
		
		
		//Code to send the Email starts here
		
		try{
		Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        
        String msgBody = "<html><body><div>Hi, <br/><br/> You've been invited for the Meeting by Greek Souvlaki Owner scheduled on <b>" 
        				+ Utilities.getLocalDateFormattedForEmail(meeting.getLocalDateFrom()) + " " + meeting.getLocalTimeFrom() 
        				+ "</b></div><br/> <b><u>Further Meeting details below:</u></b> " 
        				+ "<div><span> Meeting Starts at: </span><span><b>" + Utilities.getLocalDateFormattedForEmail(meeting.getLocalDateFrom()) + " " + meeting.getLocalTimeFrom() + "</b></span></div>"
        				+ "<div><span> Meeting Ends at: </span><span><b>" + Utilities.getLocalDateFormattedForEmail(meeting.getLocalDateTo()) + " " + meeting.getLocalTimeTo() + "</b></span></div>"
        				+ "<br/><div><b> Meeting Text: " + "</b></div><p>"
        				+ newWrapper.getEmailText() 
        				+ "</p><br/><div>Best Regards,</div><div>Greek Souvlaki Team</div>"
        				+ "</html>";

        try {
        	MimeMessage msg = new MimeMessage(session);
            //msg.setFrom(new InternetAddress("v.bhanuchand@gmail.com", "Murali Chand (Admin)"));
            msg.setFrom(new InternetAddress("chrispaulos@greeksouvlaki.com", "Chris Paulos"));
            String emailIds = newWrapper.getAgenda();
            if((emailIds != null) && (emailIds.contains(",") && emailIds.contains("@") || emailIds.contains("@"))){
            	for(String emailIdTo: emailIds.split(",")){
            		if(emailIdTo.length() > 0)
            			msg.addRecipient(Message.RecipientType.TO, new InternetAddress(emailIdTo, emailIdTo));
            	}
            	msg.addRecipient(Message.RecipientType.CC, new InternetAddress("chrispaulos@greeksouvlaki.com", "Chris Paulos"));
            	msg.addRecipient(Message.RecipientType.BCC, new InternetAddress("v.bhanuchand@gmail.com", "Bhanu"));
            	msg.addRecipient(Message.RecipientType.BCC, new InternetAddress("mvipparla@gmail.com", "Murali"));
            	msg.setSubject(" (Greek Souvlaki) Meeting Scheduled from " + Utilities.getLocalDateFormattedForEmail(meeting.getLocalDateFrom()) + " " + meeting.getLocalTimeFrom() + " to " + Utilities.getLocalDateFormattedForEmail(meeting.getLocalDateTo()) + " " + meeting.getLocalTimeTo());
            	msg.setContent(msgBody, "text/html; charset=utf-8");
            	Transport.send(msg);
            }

        } catch (AddressException e) {
        	System.out.println("Error sending Email Address Exception " + e);
        } catch (MessagingException e) {
        	System.out.println("Error sending Email Messaging Exception " + e);
        }}catch(Exception e){
        	System.out.println("Error sending Email " + e);
        }
		
		//Code to send Email ends here
		
		
		
		
		return newWrapper;
	}

	@RequestMapping(value = "/{id}", method=RequestMethod.DELETE, headers = ACCEPT_JSON)
    public @ResponseBody ResponseEntity<String> deleteCalendarRecord(@PathVariable("id") Integer id) {
		QueryParams queryParams = new QueryParams();
		queryParams.getSubstitutions().put("id", String.valueOf(id));
		dataService.deleteCalendarRecord(queryParams);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
	
}
