package com.services.core.view.wrappers;

public class SimpleModel extends BaseModel{

	private static final long serialVersionUID = 181144553753853653L;
	
	private String uploadURL;
	
	private String imageURL;

	public String getUploadURL() {
		return uploadURL;
	}

	public void setUploadURL(String uploadURL) {
		this.uploadURL = uploadURL;
	}

	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}
	
}
