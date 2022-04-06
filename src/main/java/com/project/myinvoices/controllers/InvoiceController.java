package com.project.myinvoices.controllers;

import java.io.File;

import java.util.ArrayList;


import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.project.myinvoices.model.Company;
import com.project.myinvoices.model.CompanyInvoice;
import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;
import com.project.myinvoices.service.InvoiceService;

@Controller
@RequestMapping("/invoice")
public class InvoiceController {
	
	@Autowired
	private InvoiceService invoiceService;
	
	@Value("${output-location}")
	private String basePath;
	
	@GetMapping("/createInvoice")
	public String createInvoice()
	{
		return "/invoice/CreateInvoice.html";
	}
	
	@GetMapping("/viewInvoices")
	public String viewInvoices()
	{
		return "/invoice/ViewInvoices.html";
	}
	
	@PostMapping("/saveInvoice")
	@ResponseBody
	public String saveInvoice(@RequestBody CompanyInvoice companyInvoice)
	{	
		invoiceService.saveInvoice(companyInvoice);
		return "{\"msg\":\"Success\"}";
	}
	
	@GetMapping("/listInvoices")
	@ResponseBody
	public ArrayList<Invoice> listInvoices()
	{	
		return invoiceService.listInvoices();
	}
	
	@PostMapping("/deleteInvoice")
	@ResponseBody
	public String deleteInvoice(int id)
	{
		invoiceService.deleteInvoice(id);
		return "Success";
	}
	
	@PostMapping("/updateInvoice")
	@ResponseBody
	public Company updateInvoice(@RequestBody CompanyInvoice companyInvoice)
	{
		System.out.println(companyInvoice.getCompany().getName());
		//System.out.println(companyInvoice.getInvoice().getInvoiceNumber());
		//System.out.println(companyInvoice.getInvoice().getInvoiceDetails().toString());
		invoiceService.updateInvoice(companyInvoice);
		return companyInvoice.getCompany();
	}
	
	@GetMapping(path = "/downloadInvoice")
	@ResponseBody
	public FileSystemResource downloadInvoice(@RequestParam("date") String date, @RequestParam("invoiceNumber") String invoiceNumber, @RequestParam("id") int id,HttpServletResponse response) {
		String[] arr = date.split("-");
		File file = new File(basePath+ arr[0]+ "/" + arr[1] + "/" + arr[2]+ "/" + invoiceNumber + ".pdf");
		if (!file.exists()) {
			Invoice invoice = invoiceService.getInvoiceById(id);
			CompanyInvoice companyInvoice = new CompanyInvoice();
			companyInvoice.setCompany(invoice.getCompany());
			companyInvoice.setInvoice(invoice);
			companyInvoice.setInvoiceDetails(new ArrayList<InvoiceDetails>(invoice.getInvoiceDetails()));
			invoiceService.generateInvoice(companyInvoice);
		}
		response.setContentType("application/pdf");
		response.setHeader("Content-Disposition", "attachment; filename=" + invoiceNumber + ".pdf");
		return new FileSystemResource(file);
	}
	
	@PostMapping(path = "/getInvoiceById")
	@ResponseBody
	public Invoice getInvoiceById(int id)
	{
		return invoiceService.getInvoiceById(id);
	}
	
}
