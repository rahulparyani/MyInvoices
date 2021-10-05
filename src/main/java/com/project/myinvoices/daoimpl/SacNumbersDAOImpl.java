package com.project.myinvoices.daoimpl;

import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.project.myinvoices.dao.SacNumbersDAO;
import com.project.myinvoices.model.SacNumbers;

@Repository
public class SacNumbersDAOImpl implements SacNumbersDAO {
	
	private Logger logger = LoggerFactory.getLogger(SacNumbersDAOImpl.class);
	
	@Autowired
	private EntityManager entityManager;

	@Override
	@Transactional
	public void addSac(SacNumbers sacNumbers) {
		
		logger.info("Enter add SAC ----->" + sacNumbers.getDescription());
		
		entityManager.unwrap(Session.class).persist(sacNumbers);
		
		logger.info("Exit add SAC");

	}

	@Override
	@Transactional
	public void updateSac(SacNumbers sacNumbers) {
		
		logger.info("Enter update SAC ----->" + sacNumbers.getDescription());
		
		entityManager.unwrap(Session.class).update(sacNumbers);
		
		logger.info("Exit update SAC");

	}

	@Override
	@Transactional
	public void deleteSac(SacNumbers sacNumbers) {
		
		logger.info("Enter delete SAC ----->" + sacNumbers.getDescription());

		entityManager.unwrap(Session.class).remove(entityManager.merge(sacNumbers));
		
		logger.info("Exit delete SAC");

	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public ArrayList<SacNumbers> listSac() {
		
		logger.info("Enter listSac()");
		
		return new ArrayList<SacNumbers>(entityManager.unwrap(Session.class).createQuery("from SacNumbers").list());
	}

}
