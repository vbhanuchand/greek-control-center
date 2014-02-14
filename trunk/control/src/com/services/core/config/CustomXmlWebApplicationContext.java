package com.services.core.config;

import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.web.context.support.XmlWebApplicationContext;

public class CustomXmlWebApplicationContext extends XmlWebApplicationContext {
  protected void initBeanDefinitionReader(XmlBeanDefinitionReader beanDefinitionReader) {
    super.initBeanDefinitionReader(beanDefinitionReader);
    //if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production) {
      beanDefinitionReader.setValidationMode(XmlBeanDefinitionReader.VALIDATION_NONE);
      beanDefinitionReader.setNamespaceAware(true);
    //}
  }
}