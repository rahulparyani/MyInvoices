package com.project.myinvoices.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/")
public class BaseController {

	@GetMapping("/")
	public String getHomePage()
	{
		return "index.html";
	}
	
	@GetMapping("/login")
	public String getLoginPage()
	{
		return "login.html";
	}
	
	@GetMapping("/jspPage")
	public String getJSPPage()
	{
		return "jspPage.jsp";
	}
}
