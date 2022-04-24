package com.project.myinvoices.daoimpl;

import java.util.ArrayList;


import javax.transaction.Transactional;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.project.myinvoices.dao.InvoiceDAO;
import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;
import com.project.myinvoices.repository.InvoiceDetailsRepository;
import com.project.myinvoices.repository.InvoiceRepository;

@Repository
public class InvoiceDAOImpl implements InvoiceDAO {
	
	private Logger logger = LoggerFactory.getLogger(InvoiceDAOImpl.class);
	
	@Autowired
	private InvoiceRepository invoiceRepo;
	
	@Autowired
	private InvoiceDetailsRepository invoiceDetailsRepo;
	
	@Override
	@Transactional
	public void createInvoice(Invoice invoice) {
		
		logger.info("Enter create Invoice ----->" + invoice.getInvoiceNumber()+ ", " +invoice.getCompany().getName()+ ", "+ invoice.getCompany().getId());
		
		invoiceRepo.save(invoice);
		
		logger.info("Exit createInvoice");
	}

	@Override
	@Transactional
	public ArrayList<Invoice> listInvoices() {
		
		logger.info("Enter listInvoices()");
		
		return new ArrayList<Invoice>(invoiceRepo.findAll());
		
	}

	@Override
	public void updateInvoice(Invoice invoice) {
		
		logger.info("Enter update Invoice ----->" + invoice.getInvoiceNumber()+ ", " +invoice.getCompany().getName());
		
		invoiceRepo.save(invoice);
		
		logger.info("Exit updateInvoice");

	}

	@Transactional
	@Override
	public void deleteInvoice(int id) {
		invoiceRepo.delete(invoiceRepo.getInvoiceById(id));
		logger.info("Deleted Successfully!");
	}

	@Transactional
	@Override
	public void saveInvoiceDetails(InvoiceDetails invoiceDetails) {
		
		invoiceDetailsRepo.save(invoiceDetails);
		
		logger.info("Exit saveInvoiceDetails");
		
	}

	@Transactional
	@Override
	public Invoice getInvoiceById(int id) {
		return invoiceRepo.getInvoiceById(id);
	}

	@Override
	@Transactional
	public void deleteInvoiceDetails(InvoiceDetails invoiceDetails) {
		logger.info("Enter deleteInvoiceDetails");
		invoiceDetailsRepo.deleteById(invoiceDetails.getId());
		logger.info("Exit deleteInvoiceDetails");
	}
	
}
