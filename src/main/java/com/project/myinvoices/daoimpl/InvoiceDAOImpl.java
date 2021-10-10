package com.project.myinvoices.daoimpl;

import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.project.myinvoices.dao.InvoiceDAO;
import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;

@Repository
public class InvoiceDAOImpl implements InvoiceDAO {
	
	private Logger logger = LoggerFactory.getLogger(InvoiceDAOImpl.class);
	
	@Autowired
	private EntityManager entityManager;

	@Override
	@Transactional
	public void createInvoice(Invoice invoice) {
		
		logger.info("Enter create Invoice ----->" + invoice.getInvoiceNumber()+ ", " +invoice.getCompany().getName()+ ", "+ invoice.getCompany().getId());
		
		entityManager.unwrap(Session.class).persist(invoice);
		
		logger.info("Exit createInvoice");
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public ArrayList<Invoice> listInvoices() {
		
		logger.info("Enter listInvoices()");
		
		return new ArrayList<Invoice>(entityManager.unwrap(Session.class).createQuery("from Invoice").list());
		
	}

	@Override
	public void updateInvoice(Invoice invoice) {
		
		logger.info("Enter update Invoice ----->" + invoice.getInvoiceNumber()+ ", " +invoice.getCompany().getName());
		
		entityManager.unwrap(Session.class).update(invoice);
		
		logger.info("Exit updateInvoice");

	}

	@Override
	public void deleteInvoice(Invoice invoice) {

		logger.info("Enter delete Invoice ----->" + invoice.getInvoiceNumber()+ ", " +invoice.getCompany().getName());

		entityManager.unwrap(Session.class).remove(entityManager.merge(invoice));
		
		logger.info("Exit deleteInvoice");

	}

	@Transactional
	@Override
	public void saveInvoiceDetails(InvoiceDetails invoiceDetails) {
		
		logger.info("save invoiceDetails ---- >" + invoiceDetails.getDescription());
		
		entityManager.unwrap(Session.class).persist(invoiceDetails);
		
		logger.info("Exit saveInvoiceDetails");
		
	}

}
