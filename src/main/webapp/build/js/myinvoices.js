$(document).ready(function() {

	var dataSource = new kendo.data.DataSource({
		transport: {
			read: {
				url: "/company/listCompanies"
			},
		},
		pageSize: 10,
		schema: {
			model: {
				id: "id",
				fields: {
					name: {},
					address: {},
					city: {},
					state: {},
					country: {},
					gstNumber: {}
				}
			}
		}
	})

	var dataSac = new kendo.data.DataSource({
		transport: {
			read: {
				url: "/sac/listSac"
			},
		},
		pageSize: 10,
		schema: {
			model: {
				id: "id",
				fields: {
					description: {},
					sacNumber: {},
					sgst: {},
					cgst: {},
					igst: {}
				}
			}
		}
	})


	$("#name").kendoAutoComplete({
		dataSource: dataSource,
		dataTextField: "name",
		change: onChange,
		select: onSelect
	})

	function onChange(e) {
		// clear text box values if cleared
		if ($("#name").val() == '') {
			$("#id").val('')
			$("#address").val('')
			$("#city").val('')
			$("#state").val('')
			$("#country").val('')
			$("#gstNumber").val('')
		}
	}

	$("#invoiceDetails").on("change", ".amountUSD", function() {

		var id = $(this).attr('id').split('-')
		var usd = $("#amountUSD-" + id[1]).val();
		var exchangeRate = $("#exchangeRate").val()
		var inr = usd * exchangeRate;
		$("#amountINR-" + id[1]).val((inr).toFixed(3)).change()

	})

	function onSelect(e) {
		//set text box values on select fetching data from event object
		$("#id").val(e.dataItem.id)
		$("#address").val(e.dataItem.address)
		$("#city").val(e.dataItem.city)
		$("#state").val(e.dataItem.state).change();
		$("#country").val(e.dataItem.country)
		$("#gstNumber").val(e.dataItem.gstNumber)
	}

	function init_autoComplete(x) {
		$("#description-" + x).kendoAutoComplete({
			dataSource: dataSac,
			dataTextField: "description",
			select: selectDescription,
			change: onChangeDescription
		})
	}

	function selectDescription(e) {
		//collect "id" from event and fill in the values
		var id = e.sender.element[0].id.split("-")
		$("#sacNumber-" + id[1]).val(e.dataItem.sacNumber)
		$("#sgstRate-" + id[1]).val(e.dataItem.sgst)
		$("#cgstRate-" + id[1]).val(e.dataItem.cgst)
		$("#igstRate-" + id[1]).val(e.dataItem.igst)
	}

	function onChangeDescription(e) {
		var id = e.sender.element[0].id.split("-")
		if ($("#description-" + id[1]).val() == '') {
			$("#sacNumber-" + id[1]).val('')
			$("#sgstRate-" + id[1]).val('')
			$("#cgstRate-" + id[1]).val('')
			$("#igstRate-" + id[1]).val('')
		}
	}

	$("#invoiceDetails").on('change', '.amountINR', function() {
		var id = $(this).attr('id').split('-')
		var amountINR = $("#amountINR-" + id[1]).val()
		var sgstRate = $("#sgstRate-" + id[1]).val()
		var cgstRate = $("#cgstRate-" + id[1]).val()
		var igstRate = $("#igstRate-" + id[1]).val()
		var total = 0;
		var totalsgst = 0;
		var totalcgst = 0;
		var totaligst = 0;

		if ($("#state").val() == "Gujarat") {
			$("#sgst-" + id[1]).val((amountINR * (sgstRate / 100)).toFixed(3)).change()
			$("#cgst-" + id[1]).val((amountINR * (cgstRate / 100)).toFixed(3)).change()
		}
		else {

			$("#igst-" + id[1]).val((amountINR * (igstRate / 100)).toFixed(3)).change()
		}

		$('.amountINR').each(function(index, element) {
			var val = parseFloat($(element).val());
			if (!isNaN(val)) {
				total += val;
			}
		});

		$('.sgst').each(function(index, element) {
			var val = parseFloat($(element).val());
			if (!isNaN(val)) {
				totalsgst += val;
			}
		});

		$('.cgst').each(function(index, element) {
			var val = parseFloat($(element).val());
			if (!isNaN(val)) {
				totalcgst += val;
			}
		});

		$('.igst').each(function(index, element) {
			var val = parseFloat($(element).val());
			if (!isNaN(val)) {
				totaligst += val;
			}
		});

		$('#totalsgst').val(totalsgst);

		$('#totalcgst').val(totalcgst);

		$('#totaligst').val(totaligst);

		$("#grossTotal").val((total).toFixed(3)).change()

	})

	$("#grossTotal").on('change', calculateGrandTotal)

	function calculateGrandTotal(e) {
		var grandTotal = 0, totalsgst = 0, totalcgst = 0, totaligst = 0, grossTotal = 0;

		grossTotal = parseFloat($("#grossTotal").val())

		if ($("#state").val() == "Gujarat") {
			totalsgst = parseFloat($("#totalsgst").val())
			totalcgst = parseFloat($("#totalcgst").val())
			grandTotal = grossTotal + totalsgst + totalcgst;
		}
		else {
			totaligst = parseFloat($("#totaligst").val())
			grandTotal = grossTotal + totaligst;
		}
		$("#grandTotal").val((grandTotal).toFixed(3))
	}


	$("#state").on('change', function() {
		// if state is gujarat SGST and CGST will be applicable    	
		if ($("#state").val() == "Gujarat") {

			if ($.fn.DataTable.isDataTable('#invoiceDetails')) {
				//drop dataDatable if already initialized
				$("#invoiceDetails").DataTable().clear().destroy();
			}
			$("#taxBlock").html('<div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">SGST:</label> <div class="col-md-2 col-xs-12"> <input type="text" class="form-control" id="totalsgst" name="totalsgst" readonly="readonly" placeholder="Total SGST"> </div></div><div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">CGST:</label> <div class="col-md-2 col-xs-12"> <input type="text" class="form-control" id="totalcgst" name="totalcgst" readonly="readonly" placeholder="Total CGST"> </div></div>')
			$("#invoiceDetails").html("<thead><th style='width:10px'>Sr No.</th><th>Description</th><th style='width:60px'>SAC Number</th><th style='width:45px'>SGST Rate <span class='fa fa-percent'></span></th><th style='width:50px'>SGST <span class='fa fa-inr'></span></th><th style='width:45px'>CGST Rate <span class='fa fa-percent'></th><th style='width:50px'>CGST <span class='fa fa-inr'></span></th><th style='width:100px'>Amount USD</th><th style='width:100px'>Amount INR</th></thead>");
			var count = 1;
			var invoiceDetails = $("#invoiceDetails").DataTable({
				dom: 'Bfrtip',
				"searching": false,
				buttons: [
					{
						text: 'Add Row',
						action: function(e, dt, node, config) {
							this.row.add([
								count,
								'<input type="text" class="description" id="description-' + count + '" name="description-' + count + '"/>',
								'<input type="text" class="form-control" id="sacNumber-' + count + '" name="sacNumber-' + count + '" >',
								'<input type="text" readonly class="form-control" id="sgstRate-' + count + '" name="sgstRate-' + count + '">',
								'<input type="text" readonly class="form-control sgst" id="sgst-' + count + '" name="sgst-' + count + '">',
								'<input type="text" readonly class="form-control" id="cgstRate-' + count + '" name="cgstRate-' + count + '">',
								'<input type="text" readonly class="form-control cgst" id="cgst-' + count + '" name="cgst-' + count + '">',
								'<input type="number" step="0.001" class="form-control amountUSD" id="amountUSD-' + count + '" name="amountUSD-' + count + '">',
								'<input type="number" step="0.001" class="form-control amountINR" id="amountINR-' + count + '" name="amountINR-' + count + '">'
							]).draw();
							//initialize autocomplete on description
							//console.log("inside datatable" + count)
							init_autoComplete(count);
							count++;
						}
					}
				]
			});
		}
		else {
			// else IGST will be applicable
			if ($.fn.DataTable.isDataTable('#invoiceDetails')) {
				//drop dataDatable if already initialized
				$("#invoiceDetails").DataTable().clear().destroy();
			}

			$("#taxBlock").html('<div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">IGST:</label> <div class="col-md-2 col-xs-12"> <input type="text" class="form-control" id="totaligst" name="totaligst" readonly="readonly" placeholder="Total IGST" > </div></div>')

			$("#invoiceDetails").html("<thead><th style='width:10px'>Sr No.</th><th>Description</th><th style='width:60px'>SAC Number</th><th style='width:45px'>IGST Rate <span class='fa fa-percent'></span></th><th style='width:50px'>IGST <span class='fa fa-inr'></span></th><th style='width:100px'>Amount USD</th><th style='width:100px'>Amount INR</th></thead>");
			var count = 1;
			var invoiceDetails = $("#invoiceDetails").DataTable({
				dom: 'Bfrtip',
				"searching": false,
				buttons: [
					{
						text: 'Add Row',
						action: function(e, dt, node, config) {
							this.row.add([
								count,
								'<input type="text" class="description" id="description-' + count + '" name="description-' + count + '"/>',
								'<input type="text" class="form-control" id="sacNumber-' + count + '" name="sacNumber-' + count + '" >',
								'<input type="text" readonly class="form-control" id="igstRate-' + count + '" name="igstRate-' + count + '">',
								'<input type="text" readonly class="form-control igst" id="igst-' + count + '" name="igst-' + count + '">',
								'<input type="number" step="0.001" class="form-control amountUSD" id="amountUSD-' + count + '" name="amountUSD-' + count + '">',
								'<input type="number" step="0.001" class="form-control amountINR" id="amountINR-' + count + '" name="amountINR-' + count + '">'
							]).draw();
							//initialize autocomplete on description
							init_autoComplete(count);
							count++;
						}
					}
				]
			});
		}
	})

	$("#createInvoice").on('submit', function(event) {
		event.preventDefault();
		console.log("submit called")

		function company() {
			
		}

		function invoice() {

		}

		function invoiceDetail() {

		}

		var company = new company();
		company.id = $("#id").val()
		company.name = $("#name").val()
		company.address = $("#address").val()
		company.city = $("#city").val()
		company.state = $("#state").val()
		company.country = $("#country").val()
		company.gstNumber = $("#gstNumber").val()

		var invoice = new invoice();
		invoice.date=$("#date").val()
		invoice.invoiceNumber=$("#invoiceNumber").val()
		invoice.vessel = $("#vessel").val()
		invoice.eta = $("#eta").val()
		invoice.volume = $("#volume").val()
		invoice.pol = $("#pol").val()
		invoice.pod = $("#pod").val()
		invoice.blNumber = $("#blNumber").val()
		invoice.cntNumber = $("#cntNumber").val()
		invoice.exchangeRate = $("#exchangeRate").val()
		invoice.grossTotal = $("#grossTotal").val()
		invoice.totalsgst = $("#totalsgst").val()
		invoice.totalcgst = $("#totalcgst").val()
		invoice.totaligst = $("#totaligst").val()
		invoice.grandTotal = $("#grandTotal").val()

		var invoiceDetails = new Array();

		$.each($('[role=row]'), function(v, index) {
			var row = new invoiceDetail();
			$(index).find('td').each(function(x, element) {
				var elem = $(element).find('input')
				if (elem && elem !== undefined) {
					if (elem.context.id == undefined || (elem.length > 0 && elem[0].id == undefined)) {

					}
					else if (elem.context.id.indexOf('description') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('description') != -1)
					) {
						row.description = elem.val();
					}
					else if (elem.context.id.indexOf('sacNumber') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('sacNumber') != -1
						)) {
						row.sacNumber= elem.val();
					}
					else if (elem.context.id.indexOf('sgstRate') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('sgstRate') != -1)
					) {
						row.sgstRate = elem.val();
					}
					else if (elem.context.id.indexOf('sgst') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('sgst') != -1)
					) {
						row.sgst = elem.val();
					}
					else if (elem.context.id.indexOf('cgstRate') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('cgstRate') != -1)
					) {
						row.cgstRate = elem.val();
					}
					else if (elem.context.id.indexOf('cgst') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('cgst') != -1)
					) {
						row.cgst = elem.val();
					}
					else if (elem.context.id.indexOf('igstRate') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('igstRate') != -1)
					) {
						row.igstRate = elem.val();
					}
					else if (elem.context.id.indexOf('igst') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('igst') != -1)
					) {
						row.igst = elem.val();
					}
					else if (elem.context.id.indexOf('amountUSD') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('amountUSD') != -1)
					) {
						row.amountUSD = elem.val();
					}
					else if (elem.context.id.indexOf('amountINR') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('amountINR') != -1)
					) {
						row.amountINR = elem.val();
					}
				}
			})
			invoiceDetails.push(row)
		})
		console.log(company)
		console.log(invoiceDetails)
		console.log(invoice)
		
		var postData = {
			company : company,
			invoiceDetails: invoiceDetails,
			invoice: invoice
		}
		
		console.log(JSON.stringify(postData))
		
		$.ajax({
			type: 'post',
			url: '/invoice/saveInvoice',
			dataType: 'JSON',
			headers: {
				"Accept" : "application/json; charset=utf-8",
				"Content-Type" : "application/json; charset=utf-8"
			},
			data: JSON.stringify(postData),
			success: function(data){
				
			},
			error: function(data){
				alert ('failed');
				return false;
			}
		})

	})
})