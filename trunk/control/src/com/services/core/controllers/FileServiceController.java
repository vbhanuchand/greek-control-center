package com.services.core.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.services.core.data.mgr.DataManager;
import com.services.core.view.wrappers.BlobsWrapper;
import com.services.core.view.wrappers.MultipleModelResponse;
import com.services.core.view.wrappers.SimpleModel;
import com.services.core.view.wrappers.SingleModelResponse;

@Controller
public class FileServiceController {

	private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

	private static Logger logger = Logger.getLogger(FileServiceController.class.getName());
	
	@Autowired
	private DataManager dataService;
	
	@RequestMapping(value = "/getUploadUrl", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<SimpleModel> getUploadURL(){
		BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
		String blobStoreServiceURL = blobstoreService.createUploadUrl("/service/upload"); 
		SimpleModel returnModel = new SimpleModel();
		returnModel.setUploadURL(blobStoreServiceURL);
		return new SingleModelResponse<SimpleModel>(true, returnModel);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/upload")
    public void uploadBlob(final HttpServletRequest request, final HttpServletResponse response)
        throws Exception 
    { 
		//@RequestParam("uploadedfile") MultipartFile multipartFile, 
		String responseHTML = "";
		//Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
        //BlobKey blobKey = blobs.get("uploadedFile").get(0);
		
		Map<String, List<BlobInfo>> blobInfoList = blobstoreService.getBlobInfos(request);
        BlobInfo blobInfo = blobInfoList.get("uploadedFile").get(0);
        
        ImagesService imagesService = ImagesServiceFactory.getImagesService();
        String imgServingURL = null;
        if (!(blobInfo == null)) {
        	if(blobInfo.getContentType().contains("jpeg") || blobInfo.getContentType().contains("png") || blobInfo.getContentType().contains("gif") || blobInfo.getContentType().contains("jpg"))
        	{
        		ServingUrlOptions options = ServingUrlOptions.Builder.withBlobKey(blobInfo.getBlobKey());
        		imgServingURL = imagesService.getServingUrl(options);
        	}
        		
        	responseHTML = "{\"status\": \"success\", \"fileName\":\"" + blobInfo.getFilename() + "\",\"fileType\":\"" 
        					+ blobInfo.getContentType() + "\", \"blob-key\":\"" + blobInfo.getBlobKey().getKeyString() + "\",\"imageURL\": \"" + imgServingURL + "\"}";
        }else {
        	responseHTML = "{\"status\": \"failed\", \"fileName\":\"" + "File Upload Failed. Please try again" + "\",\"fileType\":\"" 
        					+ "--none--" + "\", \"blob-key\":\"" + "--none--" + "\"}";
        }
        
        System.out.println("File read --> ");
        
        /*if(multipartFile!=null)
        {
                    fileName = multipartFile.getOriginalFilename();
        }*/

        //file inputstream can be accessed as multipartFile.getInputStream()
        response.setContentType("text/html");

        final OutputStream responseStream = response.getOutputStream();
        responseStream.write(responseHTML.getBytes());
        responseStream.write("\r\n".getBytes());
        responseStream.close();
    }
	
	@RequestMapping(value = "/blobs/{tab}/{linkedId}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<BlobsWrapper> getBlobs(@PathVariable String tab, @PathVariable int linkedId) throws IOException {
		logger.info("Getting Blobs Data --> ");
		List<BlobsWrapper> blobsList = dataService.getBlobs(linkedId, tab);
		return new MultipleModelResponse<BlobsWrapper>(true, blobsList);
	}
	
	@RequestMapping(value = "/getBlob/{blobKey}", method = RequestMethod.GET)
	@ResponseBody
	public void getBlob(@PathVariable String blobKey, final HttpServletResponse response) throws IOException {
		logger.info("Getting Blob --> " + blobKey);
		BlobKey blobStoreKey = new BlobKey(blobKey);
	    blobstoreService.serve(blobStoreKey, response);
	}
	
	@RequestMapping(value = "/getImage/{empId}", method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public SingleModelResponse<SimpleModel> getImage(@PathVariable int empId, final HttpServletResponse response) throws IOException {
		logger.info("Getting Blob --> " + empId);
		String imgServingURL = "resources/images/no-photo.png";
		List<BlobsWrapper> blobsList = dataService.getBlobs(empId, "photo");
		if(blobsList.size() > 0){
			ImagesService imagesService = ImagesServiceFactory.getImagesService();
			ServingUrlOptions options = ServingUrlOptions.Builder.withBlobKey(new BlobKey(blobsList.get(0).getBlobKey()));
			imgServingURL = imagesService.getServingUrl(options);
		}
		SimpleModel returnModel = new SimpleModel();
		returnModel.setImageURL(imgServingURL);
		return new SingleModelResponse<SimpleModel>(true, returnModel);
	}
	
	
	@RequestMapping(value = "/blobs", method = RequestMethod.POST, produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
	@ResponseBody
	public MultipleModelResponse<BlobsWrapper> insertBlob(@RequestBody BlobsWrapper blobWrapper)
			throws IOException {
		logger.info("Inserting Blob --> " + blobWrapper.getBlobKey());
		blobWrapper.setActive(true);
		boolean updateStatus = dataService.insertBlob(blobWrapper);
		return new MultipleModelResponse<BlobsWrapper>(updateStatus, null);
	}
}
