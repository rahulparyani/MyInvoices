package com.project.myinvoices.service;


import java.util.ArrayList;

import com.project.myinvoices.model.Company;

public interface CompanyService {
	
	public void addCompany(Company company);
	
	public ArrayList<Company> listCompanies();
	
	public void updateCompany(Company company);
	
	public void deleteCompany(Company company);
	
}
