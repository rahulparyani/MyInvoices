package com.project.myinvoices.serviceimpl;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.myinvoices.dao.CompanyDAO;
import com.project.myinvoices.model.Company;
import com.project.myinvoices.service.CompanyService;

@Service
public class CompanyServiceImpl implements CompanyService {

	private Logger logger = LoggerFactory.getLogger(CompanyServiceImpl.class);
	
	@Autowired
	private CompanyDAO companyDAO;
	
	@Override
	public void addCompany(Company company) {
		
		logger.info("Enter addCompany ----> " + company.getName());
		companyDAO.addCompany(company);
		
	}

	@Override
	public ArrayList<Company> listCompanies() {
			
		return companyDAO.listCompanies();
	}

	@Override
	public void updateCompany(Company company) {
		
		companyDAO.updateCompany(company);
		
	}

	@Override
	public void deleteCompany(Company company) {

		companyDAO.deleteCompany(company);
		
	}

}
