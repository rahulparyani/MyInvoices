package com.project.myinvoices.serviceimpl;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.project.myinvoices.dao.InvoiceDAO;
import com.project.myinvoices.model.CompanyInvoice;
import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;
import com.project.myinvoices.service.InvoiceService;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@Service
public class InvoiceServiceImpl implements InvoiceService {
	
	@Value("${output-location}")
	private String path;

	@Value("${source}")
	private String source;
	
	@Autowired
	private InvoiceDAO invoiceDAO;
	
	private Logger logger = LoggerFactory.getLogger(InvoiceServiceImpl.class);
	
	@Override
	public void saveInvoice(CompanyInvoice companyInvoice) {
		
		logger.info("Enter saveInvoice -----> ");
		Invoice invoice = companyInvoice.getInvoice();
		invoice.setCompany(companyInvoice.getCompany());
		logger.info("Calling createInvoice ---->");
		//remove header null values
		companyInvoice.getInvoiceDetails().remove(0);
		//call DAO to save Invoice
		invoiceDAO.createInvoice(invoice);
		ArrayList<InvoiceDetails> invoiceDetails = companyInvoice.getInvoiceDetails();
		//iterate over InvoiceDetails and save each InvoiceDetail
		for (InvoiceDetails id: invoiceDetails)
		{
			logger.info("setInvoice --------> " + invoice.getInvoiceNumber());
			logger.info("Description-----> "+id.getDescription());
			id.setInvoice(invoice);
			invoiceDAO.saveInvoiceDetails(id);
		}
		generateInvoice(companyInvoice);
	}

	@Override
	public void updateInvoice(CompanyInvoice companyInvoice) {
		// TODO Auto-generated method stub
		Invoice invoice = companyInvoice.getInvoice();
		invoice.setCompany(companyInvoice.getCompany());
		invoiceDAO.updateInvoice(invoice);
		ArrayList<InvoiceDetails> invoiceDetails = companyInvoice.getInvoiceDetails();
		//iterate over InvoiceDetails and save each InvoiceDetail
		for (InvoiceDetails id: invoiceDetails)
		{
			logger.info("setInvoice --------> " + invoice.getInvoiceNumber());
			logger.info("Description-----> "+id.getDescription());
			id.setInvoice(invoice);
			invoiceDAO.saveInvoiceDetails(id);
		}
		generateInvoice(companyInvoice);
	}

	@Override
	public void deleteInvoice(int id) {
		invoiceDAO.deleteInvoice(id);
	}

	@Override
	public ArrayList<Invoice> listInvoices() {
		return invoiceDAO.listInvoices();
	}
	
	@Override
	public void generateInvoice(CompanyInvoice companyInvoice) {
		
		try {
			
			logger.info("Generating Invoice --> invoiceNumber="+companyInvoice.getInvoice().getInvoiceNumber());
			
			JasperReport report;
			
			if(companyInvoice.getCompany().getState().equals("Gujarat"))
			{
				report = JasperCompileManager.compileReport(new FileInputStream(source + "sgst-invoice-template.jrxml"));
			}
			else
			{
				report = JasperCompileManager.compileReport(new FileInputStream(source + "igst-invoice-template.jrxml"));
			}
			
			JRBeanCollectionDataSource jrdata = new JRBeanCollectionDataSource(companyInvoice.getInvoiceDetails());
			
			HashMap<String , Object> map = new HashMap<String, Object>();
			
			map.put("Company", companyInvoice.getCompany());
			map.put("Invoice", companyInvoice.getInvoice());
			map.put("InvoiceDetails", jrdata);
			
			JasperPrint filledReport = JasperFillManager.fillReport(report, map, new JREmptyDataSource());
			Calendar c = Calendar.getInstance();
			c.setTime(companyInvoice.getInvoice().getDate());
			String appendPath = String.valueOf(c.get(Calendar.YEAR)) +"/"+new SimpleDateFormat("MM").format(c.getTime())+"/"+new SimpleDateFormat("dd").format(c.getTime());
			Files.createDirectories(Paths.get(path + appendPath));
			JasperExportManager.exportReportToPdfFile(filledReport, path + appendPath+ "/"+ companyInvoice.getInvoice().getInvoiceNumber()+".pdf");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JRException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public Invoice getInvoiceById(int id) {
		return invoiceDAO.getInvoiceById(id);
	}

	@Override
	public void deleteInvoiceDetails(InvoiceDetails invoiceDetails) {
		invoiceDAO.deleteInvoiceDetails(invoiceDetails);
	}

	@Override
	public Invoice getLastInvoice()
	{
		return invoiceDAO.getLastInvoice();
	}
	
}
