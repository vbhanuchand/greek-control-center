package com.services.core.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.services.core.controllers")
@ImportResource({"classpath:spring-hibernate.xml", "classpath:spring-security.xml"})
public class Config /*extends WebMvcConfigurerAdapter*/ {
	
	/*
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/resources/**").addResourceLocations("/WEB-INF/static/");//.setCachePeriod(31556926);
	}*/
	
}