package com.project.myinvoices.daoimpl;

import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.project.myinvoices.dao.CompanyDAO;
import com.project.myinvoices.model.Company;

@Repository
public class CompanyDAOImpl implements CompanyDAO {

	private Logger logger = LoggerFactory.getLogger(CompanyDAOImpl.class);
	
	@Autowired
	private EntityManager entityManager;
	
	@Override
	@Transactional
	public void addCompany(Company company) {
		
		logger.info("Enter addCompany ------> " + company.getName());
		
		entityManager.unwrap(Session.class).persist(company);
		
		logger.info("Exit addCompany");
		
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public ArrayList<Company> listCompanies() {

		logger.info("Enter listCompanies()");
		
		return new ArrayList<Company>(entityManager.unwrap(Session.class).createQuery("from Company").list());
		
	}

	@Override
	@Transactional
	public void updateCompany(Company company) {
		
		logger.info("Enter updateCompany()---->" + company.getName());
		
		entityManager.unwrap(Session.class).update(company);
		
		logger.info("Exit updateCompany");
	}

	@Override
	@Transactional
	public void deleteCompany(Company company) {
		
		logger.info("Enter deleteCompany()---->" + company.getName());
		
		entityManager.unwrap(Session.class).remove(entityManager.merge(company));
		
		logger.info("Exit deleteCompany");
		
	}

}
