package com.project.myinvoices.service;

import java.util.ArrayList;

import com.project.myinvoices.model.CompanyInvoice;
import com.project.myinvoices.model.Invoice;

public interface InvoiceService {
	
	public void saveInvoice(CompanyInvoice companyInvoice);
	
	public void updateInvoice(CompanyInvoice companyInvoice);
	
	public void deleteInvoice(int id);
	
	public ArrayList<Invoice> listInvoices();
	
	public Invoice getInvoiceById(int id);
	
	public void generateInvoice(CompanyInvoice companyInvoice);
	
}
