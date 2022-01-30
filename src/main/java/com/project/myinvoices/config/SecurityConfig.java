package com.project.myinvoices.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.project.myinvoices.component.FailureHandler;
import com.project.myinvoices.component.SuccessHandler;
import com.project.myinvoices.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private SuccessHandler handlerComponent;
	
	@Autowired
	private FailureHandler failure;
	
	@Bean
	public BCryptPasswordEncoder brEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public DaoAuthenticationProvider daoProvider() {
		DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
		auth.setUserDetailsService(userService);
		auth.setPasswordEncoder(brEncoder());
		return auth;
	}
	
	

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(daoProvider());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.csrf().disable()
			.authorizeRequests()
			.antMatchers("/vendors/**", "/build/**","/fa").permitAll()
			.anyRequest()
			.authenticated()
			.and()
			.formLogin()
				.loginPage("/login")
				.permitAll()
				.successHandler(handlerComponent)
				.failureHandler(failure)
			.and()
			.logout()
				.logoutUrl("/logout")
				.clearAuthentication(true)
				.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				.logoutSuccessUrl("/login");
	}

}
