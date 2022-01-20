package com.project.myinvoices.controllers;

import java.io.File;
import java.util.ArrayList;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.project.myinvoices.service.InvoiceService;

@Controller
@RequestMapping("/invoice")
public class InvoiceController {
	
	@Autowired
	private InvoiceService invoiceService;
	
	
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
		return companyInvoice.getCompany();
	}
	
	@GetMapping(path = "/downloadInvoice{date}")
	@ResponseBody
	public FileSystemResource downloadInvoice(@RequestParam("date") String date, @RequestParam("invoiceId") int id, HttpServletResponse response) {
		System.out.println(date);
		System.out.println(id);
		response.setContentType("application/pdf");
		response.setHeader("Content-Disposition", "attachment; filename=23234.pdf");
		return new FileSystemResource(new File("D:\\EclipseWorkspace1\\MyInvoices\\2022\\1\\6\\23234.pdf"));
	}
	
}
