package com.project.myinvoices.dao;

import java.util.ArrayList;

import com.project.myinvoices.model.Company;

public interface CompanyDAO {
	
	public void addCompany(Company company);
	
	public ArrayList<Company> listCompanies();
	
	public void updateCompany(Company company);
	
	public void deleteCompany(Company company);
	
}
