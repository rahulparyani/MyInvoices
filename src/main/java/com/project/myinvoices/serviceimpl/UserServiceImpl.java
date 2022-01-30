package com.project.myinvoices.serviceimpl;

import java.util.Arrays;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.myinvoices.model.User;
import com.project.myinvoices.repository.UserRepository;
import com.project.myinvoices.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	
	@Autowired
	private UserRepository userRepository;
	

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		System.out.println("Called service: " + email);
		User user = userRepository.findByEmail(email);
		System.out.println(user);
		if(user == null) {
			System.out.println("Inside IF");
			throw new UsernameNotFoundException("Invalid username or password." + user);
		}
		return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthorities(user.getRole()));
		
	}
	
	public Collection<? extends GrantedAuthority> getAuthorities(String roleName) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);
        return Arrays.asList(authority);
    }

}
