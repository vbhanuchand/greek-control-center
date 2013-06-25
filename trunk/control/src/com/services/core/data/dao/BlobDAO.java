package com.services.core.data.dao;

import java.util.List;

import com.services.core.data.model.Blobs;

public interface BlobDAO {
	
	boolean insertBlobReference(Integer linkedId, String fileName, String blobKey, String tab, Boolean active, Integer updatedBy);
	
	List<Blobs> getBlobReference(Integer linkedId, String tab, Boolean active);

}
