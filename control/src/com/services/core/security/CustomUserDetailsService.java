package com.services.core.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Lazy;

import com.services.core.data.mgr.DataManager;
import com.services.core.view.wrappers.EmployeeWrapper;
import com.services.core.view.wrappers.RoleWrapper;

@Service("customUserDetailsService")
@Lazy
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	DataManager dataService;
	List<String> stores;

	public List<String> getStores() {
		return stores;
	}

	public void setStores(List<String> stores) {
		this.stores = stores;
	}

	/**
	 * Returns a populated {@link UserDetails} object. The username is first
	 * retrieved from the database and then mapped to a {@link UserDetails}
	 * object.
	 */
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		try {

			EmployeeWrapper user = dataService.getEmployeeByUserName(username);
			boolean enabled = true;
			boolean accountNonExpired = true;
			boolean credentialsNonExpired = true;
			boolean accountNonLocked = true;
			User signedUser;
			if ((user.getUsername() != null)
					&& user.getUsername().trim().length() > 0) {
				List<String> roles = new ArrayList<String>();
				List<String> stores = new ArrayList<String>();
				for (RoleWrapper role : user.getEmployeeRoles()) {
					roles.add(role.getRoleTab());
					stores.add("store-" + String.valueOf(role.getStoreId()));
				}
				this.setStores(stores);
				int roleCode = 0;
				if (roles.contains("store-ownr"))
					roleCode = 99;
				else if ((roles.contains("store-mgr")) || (roles.contains("area-mgr")))
					roleCode = 98;
				else
					roleCode = 97;
				signedUser = new User(user.getUsername(), user.getPassword(),
						enabled, accountNonExpired, credentialsNonExpired,
						accountNonLocked, getAuthorities(roleCode));
			} else
				signedUser = new User("%#$#invalid$#(*&", "%$#invalid&$%",
						false, false, false, false, getAuthorities(1));

			return signedUser;

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	/**
	 * Retrieves a collection of {@link GrantedAuthority} based on a numerical
	 * role
	 * 
	 * @param role
	 *            the numerical role
	 * @return a collection of {@link GrantedAuthority

	 */
	public Collection<? extends GrantedAuthority> getAuthorities(Integer role) {
		List<GrantedAuthority> authList = getGrantedAuthorities(getRoles(role));
		return authList;
	}

	/**
	 * Converts a numerical role to an equivalent list of roles
	 * 
	 * @param role
	 *            the numerical role
	 * @return list of roles as as a list of {@link String}
	 */
	public List<String> getRoles(Integer role) {
		List<String> roles = new ArrayList<String>();

		if (role.intValue() == 99) {
			roles.add("ROLE_OWNER");

		} else if (role.intValue() == 98) {
			roles.add("ROLE_MGR");
		} else
			roles.add("ROLE_EMP");
		for(String store: this.getStores())
			roles.add(store);
		return roles;
	}

	/**
	 * Wraps {@link String} roles to {@link SimpleGrantedAuthority} objects
	 * 
	 * @param roles
	 *            {@link String} of roles
	 * @return list of granted authorities
	 */
	public static List<GrantedAuthority> getGrantedAuthorities(
			List<String> roles) {
		List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		for (String role : roles) {
			authorities.add(new SimpleGrantedAuthority(role));
		}
		return authorities;
	}

}
