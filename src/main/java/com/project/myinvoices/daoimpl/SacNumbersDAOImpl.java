package com.project.myinvoices.daoimpl;

import java.util.ArrayList;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.project.myinvoices.dao.SacNumbersDAO;
import com.project.myinvoices.model.SacNumbers;
import com.project.myinvoices.repository.SacNumbersRepository;

@Repository
public class SacNumbersDAOImpl implements SacNumbersDAO {
	
	private Logger logger = LoggerFactory.getLogger(SacNumbersDAOImpl.class);
	
	@Autowired
	private SacNumbersRepository sacRepo;

	@Override
	@Transactional
	public void addSac(SacNumbers sacNumbers) {
		
		logger.info("Enter add SAC ----->" + sacNumbers.getDescription());
		
		sacRepo.save(sacNumbers);
		
		logger.info("Exit add SAC");

	}

	@Override
	@Transactional
	public void updateSac(SacNumbers sacNumbers) {
		
		logger.info("Enter update SAC ----->" + sacNumbers.getDescription());
		
		sacRepo.save(sacNumbers);
		
		logger.info("Exit update SAC");

	}

	@Override
	@Transactional
	public void deleteSac(SacNumbers sacNumbers) {
		
		logger.info("Enter delete SAC ----->" + sacNumbers.getDescription());

		sacRepo.delete(sacNumbers);
		
		logger.info("Exit delete SAC");

	}

	@Override
	@Transactional
	public ArrayList<SacNumbers> listSac() {
		
		logger.info("Enter listSac()");
		
		return new ArrayList<SacNumbers>(sacRepo.findAll());
	}

}
