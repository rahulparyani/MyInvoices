package com.project.myinvoices.controllers;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.project.myinvoices.model.Company;
import com.project.myinvoices.service.CompanyService;

@Controller
@RequestMapping("/company")
public class CompanyController {
	
	private Logger logger = LoggerFactory.getLogger(CompanyController.class);
	
	@Autowired
	private CompanyService companyService;
	
	@GetMapping("/addCompany")
	public String addCompany()
	{
		return "/company/addCompany.html";
	}
	
	@GetMapping("/viewCompanies")
	public String viewCompanies()
	{
		return "/company/listCompanies.html";
	}
	
	@PostMapping("/saveCompany")
	@ResponseBody
	public String saveCompany(@RequestBody Company company)
	{
		logger.info("Calling save company");
		companyService.addCompany(company);
		return "Success";
	}
	
	@GetMapping("/listCompanies")
	@ResponseBody
	public ArrayList<Company> listCompanies()
	{
		logger.info("Calling list companies");
		return companyService.listCompanies();
	}
	
	@PostMapping("/updateCompany")
	@ResponseBody
	public Company updateCompany(Company company)
	{
		logger.info("Calling update company---->" + company.getName());
		companyService.updateCompany(company);
		
		return company;
	}
	
	@PostMapping("/deleteCompany")
	@ResponseBody
	public String deleteCompany(Company company)
	{
		logger.info("Calling delete company---->" + company.getName());
		companyService.deleteCompany(company);
		
		return "Success";
	}

}
