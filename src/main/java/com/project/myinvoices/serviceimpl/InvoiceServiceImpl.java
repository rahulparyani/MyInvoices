package com.project.myinvoices.serviceimpl;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.myinvoices.dao.InvoiceDAO;
import com.project.myinvoices.model.CompanyInvoice;
import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;
import com.project.myinvoices.service.InvoiceService;

@Service
public class InvoiceServiceImpl implements InvoiceService {

	@Autowired
	private InvoiceDAO invoiceDAO;
	
	private Logger logger = LoggerFactory.getLogger(InvoiceServiceImpl.class);
	
	@Override
	public void saveInvoice(CompanyInvoice companyInvoice) {
		
		logger.info("Enter saveInvioice -----> ");
		Invoice invoice = companyInvoice.getInvoice();
		logger.info("setCompany --------> " + companyInvoice.getCompany());
		invoice.setCompany(companyInvoice.getCompany());
		logger.info("Calling createInvoice ---->");
		// call DAO to save Invoice details
		invoiceDAO.createInvoice(invoice);
		InvoiceDetails[] invoiceDetails = companyInvoice.getInvoiceDetails();
		//iterate over InvoiceDetails and save each InvoiceDetail
		for(int index = 1; index < invoiceDetails.length; index++)
		{
			logger.info("setInvoice --------> " + invoice.getInvoiceNumber());
			invoiceDetails[index].setInvoice(invoice);
			invoiceDAO.saveInvoiceDetails(invoiceDetails[index]);
		}
	}

	@Override
	public void updateInvoice(CompanyInvoice companyInvoice) {
		// TODO Auto-generated method stub

	}

	@Override
	public void deleteInvoice(CompanyInvoice companyInvoice) {
		// TODO Auto-generated method stub

	}

	@Override
	public ArrayList<Invoice> listInvoices() {
		// TODO Auto-generated method stub
		return null;
	}

}
