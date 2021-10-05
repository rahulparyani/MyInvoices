package com.project.myinvoices.dao;

import java.util.ArrayList;

import com.project.myinvoices.model.Invoice;

public interface InvoiceDAO {
	
	public void createInvoice(Invoice invoice);
	
	public ArrayList<Invoice> listInvoices();
	
	public void updateInvoice(Invoice invoice);
	
	public void deleteInvoice(Invoice invoice);

}
