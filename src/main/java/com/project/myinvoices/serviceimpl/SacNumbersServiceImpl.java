package com.project.myinvoices.serviceimpl;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.myinvoices.dao.SacNumbersDAO;
import com.project.myinvoices.model.SacNumbers;
import com.project.myinvoices.service.SacNumbersService;

@Service
public class SacNumbersServiceImpl implements SacNumbersService {
	
	@Autowired
	public SacNumbersDAO sacNumbersDAO;

	@Override
	public void addSac(SacNumbers sacNumbers) {
		
		sacNumbersDAO.addSac(sacNumbers);

	}

	@Override
	public ArrayList<SacNumbers> listSac() {
		
		return sacNumbersDAO.listSac();
	}

	@Override
	public void updateSac(SacNumbers sacNumbers) {
		
		sacNumbersDAO.updateSac(sacNumbers);

	}

	@Override
	public void deleteSac(SacNumbers sacNumbers) {
		
		sacNumbersDAO.deleteSac(sacNumbers);
	}

}
