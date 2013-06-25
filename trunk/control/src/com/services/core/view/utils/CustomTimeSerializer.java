package com.services.core.view.utils;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

public class CustomTimeSerializer extends JsonSerializer<Integer>{
	@Override
	public void serialize(Integer value, JsonGenerator gen, SerializerProvider arg2)
			throws IOException, JsonProcessingException {
		String strFTime = "";
		int fTime = value;
		int hh=0;
		int mi=0;;
		if(fTime > 0){
			hh = fTime/100;
			mi = fTime%100;
			if(hh > 12) strFTime = hh-12 + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi))) + " PM";
			else if(hh < 12) strFTime = hh + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi))) + " AM";
			else if(hh == 12) strFTime = hh + ":" + ((String.valueOf(mi).length() > 1) ? String.valueOf(mi) : ("0"+String.valueOf(mi))) + " PM";
		}else strFTime="12:00 AM";
		gen.writeString(strFTime);
	}
}
