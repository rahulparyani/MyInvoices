package com.project.myinvoices.dao;

import java.util.ArrayList;

import com.project.myinvoices.model.SacNumbers;

public interface SacNumbersDAO {
	
	public void addSac(SacNumbers sacNumbers);
	
	public void updateSac(SacNumbers sacNumbers);
	
	public void deleteSac(SacNumbers sacNumbers);
	
	public ArrayList<SacNumbers> listSac();
}
