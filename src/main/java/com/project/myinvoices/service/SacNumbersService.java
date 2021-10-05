package com.project.myinvoices.service;

import java.util.ArrayList;

import com.project.myinvoices.model.SacNumbers;

public interface SacNumbersService {
	
	public void addSac(SacNumbers sacNumbers);
	
	public ArrayList<SacNumbers> listSac();
	
	public void updateSac(SacNumbers sacNumbers);
	
	public void deleteSac(SacNumbers sacNumbers);

}
