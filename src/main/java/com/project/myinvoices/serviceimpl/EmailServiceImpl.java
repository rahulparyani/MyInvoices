package com.project.myinvoices.serviceimpl;

import java.io.File;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import com.project.myinvoices.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {
	
	@Autowired
	private JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String from;
	
	@Value("${email.subject}")
	private String subject;
	
	@Override
	public void sendEmail(String to, String path) {
		MimeMessagePreparator preparator = new MimeMessagePreparator() {
			
			@Override
			public void prepare(MimeMessage mimeMessage) throws Exception {
				mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
				mimeMessage.setFrom(from);
				mimeMessage.setSubject(subject);
				mimeMessage.setText("Your Invoice is attached with this email");
				FileSystemResource file = new FileSystemResource(new File(path));
	            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
	            helper.addAttachment("invoice.pdf", file);
			}
		};
		
		try {
	        mailSender.send(preparator);
	    }
	    catch (MailException ex) {
	        System.err.println(ex.getMessage());
	    }
	}
}
