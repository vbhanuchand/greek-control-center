package com.services.core.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

@Service
@Lazy
public class SecurityLoginSuccessHandler extends
		SimpleUrlAuthenticationSuccessHandler {

	public SecurityLoginSuccessHandler() {
		super();
	}

	public void onAuthenticationSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {
		if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
			String roles = "", stores = "";
			for(GrantedAuthority authority: auth.getAuthorities()){
				if(authority.getAuthority().contains("ROLE"))
					roles = authority.getAuthority();
				else 
					stores += authority.getAuthority() + ",";
			}
			stores = stores.length() > 0 ? stores.substring(0, stores.length()-1): stores;
			response.getWriter().print(
					"{success:true, roles: '" + roles + "', stores: '" + stores + "', targetUrl : \'"
							+ this.getTargetUrlParameter() + "\'}");
			response.getWriter().flush();
		} else {
			super.onAuthenticationSuccess(request, response, auth);
		}
	}
}