$(document).ready(function() {

	function sleep(ms) {
  		return new Promise(resolve => setTimeout(resolve, ms));
	}

	$("#loading").hide()

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
		$("#amountINR-" + id[1]).val((inr).toFixed(2)).change()

	})

	$("#invoiceDetails").on("change", ".volume", function() {

		var id = $(this).attr('id').split('-')
		var volume = $("#volume-" + id[1]).val()
		var rate = $("#rate-" + id[1]).val()
		var currency = $("#currency-" + id[1]).val()
		if (currency === "USD") {
			$("#amountUSD-" + id[1]).val((rate * volume).toFixed(2)).change()
		}
		else {
			$("#amountINR-" + id[1]).val((rate * volume).toFixed(2)).change()
		}
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
			$("#sgst-" + id[1]).val((amountINR * (sgstRate / 100)).toFixed(2)).change()
			$("#cgst-" + id[1]).val((amountINR * (cgstRate / 100)).toFixed(2)).change()
		}
		else {

			$("#igst-" + id[1]).val((amountINR * (igstRate / 100)).toFixed(2)).change()
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

		$('#totalsgst').val(totalsgst.toFixed(2));

		$('#totalcgst').val(totalcgst.toFixed(2));

		$('#totaligst').val(totaligst.toFixed(2));

		$("#grossTotal").val((total).toFixed(2)).change()

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
		$("#grandTotal").val((grandTotal).toFixed(2))
	}


	$("#state").on('change', function() {
		// if state is gujarat SGST and CGST will be applicable    	
		if ($("#state").val() == "Gujarat") {

			if ($.fn.DataTable.isDataTable('#invoiceDetails')) {
				//drop dataDatable if already initialized
				$("#invoiceDetails").DataTable().clear().destroy();
			}
			$("#taxBlock").html('<div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">SGST:</label> <div class="col-md-2 col-xs-12"> <input type="text" class="form-control" id="totalsgst" name="totalsgst" readonly="readonly" placeholder="Total SGST"> </div></div><div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">CGST:</label> <div class="col-md-2 col-xs-12"> <input type="text" class="form-control" id="totalcgst" name="totalcgst" readonly="readonly" placeholder="Total CGST"> </div></div>')
			$("#invoiceDetails").html("<thead><th style='width:10px'>Sr No.</th><th>Description</th><th style='width:60px'>SAC Number</th><th style='width:45px'>Rate</th><th style='width:45px'>Currency</th><th style='width:45px'>Volume</th><th style='width:45px'>SGST Rate <span class='fa fa-percent'></span></th><th style='width:50px'>SGST <span class='fa fa-inr'></span></th><th style='width:45px'>CGST Rate <span class='fa fa-percent'></th><th style='width:50px'>CGST <span class='fa fa-inr'></span></th><th style='width:100px'>Amount USD</th><th style='width:100px'>Amount INR</th></thead>");
			var count = 1;
			var invoiceDetails = $("#invoiceDetails").DataTable({
				dom: 'Bfrtip',
				"searching": false,
				"paging": false,
				buttons: [
					{
						text: 'Add Row',
						action: function(e, dt, node, config) {
							this.row.add([
								count,
								'<input type="text" class="description" id="description-' + count + '" name="description-' + count + '"/>',
								'<input type="text" class="form-control" id="sacNumber-' + count + '" name="sacNumber-' + count + '" >',
								'<input type="number" step="0.01" class="form-control" id="rate-' + count + '" name="rate-' + count + '" >',
								'<select class="form-control" id="currency-' + count + '"><option value="USD">USD</option><option value="INR">INR</option></select>',
								'<input type="number" step="0.01" class="form-control volume" id="volume-' + count + '" name="volume-' + count + '" >',
								'<input type="text" readonly class="form-control" id="sgstRate-' + count + '" name="sgstRate-' + count + '">',
								'<input type="text" readonly class="form-control sgst" id="sgst-' + count + '" name="sgst-' + count + '">',
								'<input type="text" readonly class="form-control" id="cgstRate-' + count + '" name="cgstRate-' + count + '">',
								'<input type="text" readonly class="form-control cgst" id="cgst-' + count + '" name="cgst-' + count + '">',
								'<input type="number" step="0.01" class="form-control amountUSD" id="amountUSD-' + count + '" name="amountUSD-' + count + '">',
								'<input type="number" step="0.01" class="form-control amountINR" id="amountINR-' + count + '" name="amountINR-' + count + '">',
							]).draw();
							//initialize autocomplete on description
							init_autoComplete(count);
							count++;
						}
					},
					{
						text: 'Remove Row',
						action: function() {
							invoiceDetails.row('.selected').remove().draw(false);
							$(".amountINR").change();
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

			$("#invoiceDetails").html("<thead><th style='width:10px'>Sr No.</th><th>Description</th><th style='width:60px'>SAC Number</th><th style='width:45px'>Rate</th><th style='width:45px'>Currency</th><th style='width:45px'>Volume</th><th style='width:45px'>IGST Rate <span class='fa fa-percent'></span></th><th style='width:50px'>IGST <span class='fa fa-inr'></span></th><th style='width:100px'>Amount USD</th><th style='width:100px'>Amount INR</th></thead>");
			var count = 1;
			var invoiceDetails = $("#invoiceDetails").DataTable({
				dom: 'Bfrtip',
				"searching": false,
				"paging": false,
				buttons: [
					{
						text: 'Add Row',
						action: function(e, dt, node, config) {
							this.row.add([
								count,
								'<input type="text" class="description" id="description-' + count + '" name="description-' + count + '"/>',
								'<input type="text" class="form-control" id="sacNumber-' + count + '" name="sacNumber-' + count + '" >',
								'<input type="number" step="0.01" class="form-control" id="rate-' + count + '" name="rate-' + count + '" >',
								'<select class="form-control" id="currency-' + count + '"><option value="USD">USD</option><option value="INR">INR</option></select>',
								'<input type="number" step="0.01" class="form-control volume" id="volume-' + count + '" name="volume-' + count + '" >',
								'<input type="text" readonly class="form-control" id="igstRate-' + count + '" name="igstRate-' + count + '">',
								'<input type="text" readonly class="form-control igst" id="igst-' + count + '" name="igst-' + count + '">',
								'<input type="number" step="0.01" class="form-control amountUSD" id="amountUSD-' + count + '" name="amountUSD-' + count + '">',
								'<input type="number" step="0.01" class="form-control amountINR" id="amountINR-' + count + '" name="amountINR-' + count + '">'
							]).draw();
							//initialize autocomplete on description
							init_autoComplete(count);
							count++;
						}
					},
					{
						text: 'Remove Row',
						action: function() {
							invoiceDetails.row('.selected').remove().draw(false)
							$(".amountINR").change();
						}
					}
				]
			});
		}
	})

	$("#invoiceDetails").on('click', 'tr', function() {
		if ($(this).hasClass('selected')) {
		}
		else {
			var invoiceDetails = $("#invoiceDetails").DataTable();
			invoiceDetails.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	})


	$("#createInvoice").on('submit', function(event) {
		event.preventDefault();
		$("#loading").show()
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
		invoice.date = $("#date").val()
		invoice.invoiceNumber = $("#shipmentNumber").val() + "-" + $("#invoiceNumber").val() + "-" + $("#year").val() 
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
		invoice.notes = $("#notes").val()

		var invoiceDetails = new Array();

		$.each($('[role=row]'), function(v, index) {
			var row = new invoiceDetail();
			$(index).find('td').each(function(x, element) {
				var elem = $(element).find('input, select')
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
						row.sacNumber = elem.val();
					}
					else if (elem.context.id.indexOf('rate') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('rate') != -1
						)) {
						row.rate = elem.val();
					}
					else if (elem.context.id.indexOf('currency') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('currency') != -1
						)) {
						row.currency = elem.val();
					}
					else if (elem.context.id.indexOf('volume') != -1 ||
						(elem.length > 0 && elem[0].id.indexOf('volume') != -1
						)) {
						row.volume = elem.val();
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

		var postData = {
			company: company,
			invoiceDetails: invoiceDetails,
			invoice: invoice
		}

		$.ajax({
			type: 'post',
			url: '/invoice/saveInvoice',
			dataType: 'JSON',
			headers: {
				"Accept": "application/json; charset=utf-8",
				"Content-Type": "application/json; charset=utf-8"
			},
			data: JSON.stringify(postData),
			success: function(data) {
				new PNotify({ title: 'Operation Successful', text: 'Invoice saved and generated successfully!', type: 'success', styling: 'bootstrap3' });
				if ($.fn.DataTable.isDataTable('#invoiceDetails')) {
					//drop dataDatable if already initialized
					$("#invoiceDetails").DataTable().clear().destroy();
				}
				$("#createInvoice")[0].reset()
				sleep(2000).then(() => { location.reload(); });
			},
			error: function(data) {
				if (data.responseJSON.message.includes("invoice_number_UNIQUE")) {
					new PNotify({ title: 'Oh No!', text: 'Invoice number already exists!', type: 'error', styling: 'bootstrap3' });
				}
				else {
					new PNotify({ title: 'Oh No!', text: 'Something went wrong, please see logs for more information!', type: 'error', styling: 'bootstrap3' });
				}
			},
			complete: function() {
				$('#loading').hide();
			}
		})

	})

	var invoiceDatasource = new kendo.data.DataSource({
		transport: {
			read: {
				url: "/invoice/listInvoices"
			},
			destroy: {
				url: "/invoice/deleteInvoice",
				type: "POST"
			},
			parameterMap: function(options, operation) {
				if (operation == "destroy" && options) {
					return { id: options.id };
				}
				else if (operation == "update" && options) {
					var postData = new Object();
					var invoice = new Object();
					invoice.id = options.id;
					invoice.date = options.date;
					invoice.invoiceNumber = options.invoiceNumber;
					invoice.vessel = options.vessel
					invoice.eta = options.eta
					invoice.volume = options.volume;
					invoice.pol = options.pol;
					invoice.pod = options.pod;
					invoice.blNumber = options.blNumber;
					invoice.cntNumber = options.cntNumber;
					invoice.exchangeRate = options.exchangeRate;
					invoice.grossTotal = options.grossTotal
					invoice.totalsgst = options.totalsgst
					invoice.totalcgst = options.totalcgst
					invoice.totaligst = options.totaligst
					invoice.grandTotal = options.grandTotal
					postData.invoice = invoice;
					postData.company = options.company;
					postData.invoiceDetails = options.invoiceDetails;
					return JSON.stringify(postData);
				}
			},
		},
		pageSize: 20,
		schema: {
			model: {
				id: "id",
				fields: {
					blNumber: {},
					cntNumber: {},
					date: {},
					eta: {},
					exchangeRate: {},
					grandTotal: {},
					grossTotal: {},
					invoiceNumber: {},
					pod: {},
					pol: {},
					totalcgst: {},
					totalsgst: {},
					totaligst: {},
					vessel: {},
					volume: {},
					invoiceDetails: [
						{ id: {} },
						{ description: {} },
						{ amountINR: {} },
						{ amountUSD: {} },
						{ cgst: {} },
						{ cgstRate: {} },
						{ sgst: {} },
						{ sgstRate: {} },
						{ igst: {} },
						{ igstRate: {} },
						{ sacNumber: {} },
					],
					company: {
						id: {},
						name: {},
						address: {},
						city: {},
						state: {},
						country: {},
						gstNumber: {}
					}
				}
			}
		}
	})

	$("#invoiceGrid").kendoGrid({
		dataSource: invoiceDatasource,
		editable: "popup",
		toolbar: ["excel", "pdf", "search"],
		pageable: {
			alwaysVisible: true,
			pageSizes: [5, 10, 20, 100]
		},
		sortable: true,
		columnMenu: true,
		navigatable: true,
		resizable: true,
		reorderable: true,
		groupable: true,
		filterable: true,
		columns: [
			{
				field: "invoiceNumber",
				title: "Invoice Number"
			},
			{
				field: "company.name",
				title: "Name"
			},
			{
				field: "date",
				title: "Date"
			},
			{
				field: "blNumber",
				title: "BL Number",
				hidden: true
			},
			{
				field: "cntNumber",
				title: "Container Number",
				hidden: true
			},
			{
				field: "exchangeRate",
				title: "Exchange Rate",
				hidden: true
			},
			{
				field: "grossTotal",
				title: "Gross Total"
			},
			{
				field: "totalcgst",
				title: "Total CGST"
			},
			{
				field: "totalsgst",
				title: "Total SGST",
			},
			{
				field: "totaligst",
				title: "Total IGST",
			},
			{
				field: "grandTotal",
				title: "Grand Total",
			},
			{ command: [{ text: "View", click: viewInvoiceDetails, iconClass: "k-icon k-i-file" }, { text: "Edit", click: editInvoiceDetails, iconClass: "k-icon k-i-edit" }, "destroy"], title: "Actions", width: "230px" }

		]
	})

	function viewInvoiceDetails(e) {
		e.preventDefault();
		var dataItem = this.dataItem($(e.currentTarget).closest("tr"))
		var template = kendo.template($("#template").html());
		var invoiceWindow = $("#invoiceWindow").kendoWindow({
			title: "Invoice Details",
			modal: true,
			resizable: true,
			width: 900,
			height: 500,
			scrollable: true,
			actions: ["Close"]
		}).data("kendoWindow")
		invoiceWindow.content(template(dataItem))
		invoiceWindow.maximize().open()
		if (dataItem.company.state == "Gujarat") {
			init_grid(dataItem)
		}
		else {
			init_IgstGrid(dataItem)
		}

		$("#downloadInvoice").click(function() {
			var invoice = new Object();
			invoice.id = dataItem.id;
			invoice.invoiceNumber = dataItem.invoiceNumber;
			invoice.date = dataItem.date;
			window.open("http://" + location.host + "/invoice/downloadInvoice?date=" + invoice.date + "&invoiceNumber=" + invoice.invoiceNumber + "&id=" + invoice.id, "_blank")
		})
		$("#loading").hide();
	}

	function editInvoiceDetails(e) {
		e.preventDefault();
		var dataItem = this.dataItem($(e.currentTarget).closest("tr"))
		console.log(dataItem)
		var invoiceDetailsDataSource = initDataSource(dataItem);
		var template = kendo.template($("#editTemplate").html());
		var invoiceWindow = $("#editInvoiceWindow").kendoWindow({
			title: "Edit Invoice",
			modal: true,
			resizable: true,
			width: 900,
			height: 500,
			scrollable: true,
			actions: ["Close"]
		}).data("kendoWindow")
		invoiceWindow.content(template(dataItem))
		invoiceWindow.maximize().open()
		$("#loading").hide();
		if (dataItem.company.state == "Gujarat") {
			edit_grid(invoiceDetailsDataSource)
		}
		else {
			edit_IgstGrid(invoiceDetailsDataSource)
		}

		$("#name").kendoAutoComplete({
			dataSource: dataSource,
			dataTextField: "name",
			change: onChange,
			select: onSelect,
			value: dataItem.company.name
		})

		$("#state").on('change', function() {
			console.log("state changed");
			$("#editDetailsGrid").kendoGrid('destroy').empty();
			dataItem.invoiceDetails = [];
			if($("#state").val() == "Gujarat")
				edit_grid(initDataSource(dataItem));
			else
				edit_IgstGrid(initDataSource(dataItem));
		})

		$("#updateInvoice").click(function() {
			$("#loading").show();
			var postData = new Object();
			var invoice = new Object();
			var company = new Object();
			var invoiceDetails = new Object();
			postData.company = company;
			postData.invoice = invoice;
			postData.invoiceDetails = invoiceDetails;
			postData.company.id = $("#id").val()
			postData.company.name = $("#name").val()
			postData.company.address = $("#address").val()
			postData.company.city = $("#city").val()
			postData.company.state = $("#state").val()
			postData.company.country = $("#country").val()
			postData.company.gstNumber = $("#gstNumber").val()
			postData.invoice.id = dataItem.id
			postData.invoice.date = $("#date").val()
			postData.invoice.invoiceNumber = $("#invoiceNumber").val()
			postData.invoice.vessel = $("#vessel").val()
			postData.invoice.eta = $("#eta").val()
			postData.invoice.volume = $("#volume").val();
			postData.invoice.pol = $("#pol").val()
			postData.invoice.pod = $("#pod").val()
			postData.invoice.blNumber = $("#blNumber").val()
			postData.invoice.cntNumber = $("#cntNumber").val();
			postData.invoice.exchangeRate = $("#exchangeRate").val();
			postData.invoice.grossTotal = $("#grossTotal").val()
			postData.invoice.totalsgst = $("#totalsgst").val()
			postData.invoice.totalcgst = $("#totalcgst").val()
			postData.invoice.totaligst = $("#totaligst").val()
			postData.invoice.grandTotal = $("#grandTotal").val()
			postData.invoice.notes = $("#notes").val()
			postData.invoiceDetails = $("#editDetailsGrid").data("kendoGrid").dataSource.data()

			$.ajax({
				type: 'post',
				url: '/invoice/updateInvoice',
				dataType: 'JSON',
				headers: {
					"Accept": "application/json; charset=utf-8",
					"Content-Type": "application/json; charset=utf-8"
				},
				data: JSON.stringify(postData),
				success: function(data) {
					new PNotify({ title: 'Operation Successful', text: 'Invoice Updated and Generated successfully!', type: 'success', styling: 'bootstrap3' });
					invoiceWindow.close();
					$("#invoiceGrid").data('kendoGrid').dataSource.read();
				},
				error: function(data) {
					if (data.responseJSON.message.includes("invoice_number_UNIQUE")) {
						new PNotify({ title: 'Oh No!', text: 'Invoice number already exists!', type: 'error', styling: 'bootstrap3' });
					}
					else {
						new PNotify({ title: 'Oh No!', text: 'Something went wrong, please see logs for more information!', type: 'error', styling: 'bootstrap3' });
					}
				}
			})
		})
	}

	function initDataSource(dataItem) {
		var invoiceDetails = new kendo.data.DataSource({
			data: dataItem.invoiceDetails,
			schema: {
				model: {
					id: "id",
					fields: {
						amountUSD: { type: "number" },
						amountINR: { type: "number" },
						description: {},
						cgst: { type: "number" },
						cgstRate: { type: "number" },
						sgst: { type: "number" },
						sgstRate: { type: "number" },
						igst: { type: "number" },
						igstRate: { type: "number" },
						sacNumber: { type: "string" },
						rate: { type: "number" },
						volume: { type: "number" },
						currency: { type: "string" }
					}
				}
			},
			change: function(e) {
				if (e.action == "remove") {
					e.field = "amountINR"
				}
				switch (e.field) {
					case "volume":
						if (e.items[0].currency == "USD")
							e.items[0].set("amountUSD", e.items[0].rate * e.items[0].volume)
						else {
							e.items[0].set("amountUSD", 0)
							e.items[0].set("amountINR", e.items[0].rate * e.items[0].volume)
						}
						break;

					case "amountUSD":
						if (e.items[0].amountUSD != 0) {
							e.items[0].set("amountINR", (e.items[0].amountUSD * $("#exchangeRate").val()).toFixed(2))
						}
						break;

					case "amountINR":
						console.log(e)
						if ($("#state").val() == "Gujarat") {
							e.items[0].set("sgst", ((e.items[0].sgstRate * e.items[0].amountINR) / 100).toFixed(2))
							e.items[0].set("cgst", ((e.items[0].cgstRate * e.items[0].amountINR) / 100).toFixed(2))
						}
						else {
							e.items[0].set("igst", ((e.items[0].igstRate * e.items[0].amountINR) / 100).toFixed(2))
						}

						var totalINR = 0;
						var totalSGST = 0;
						var totalCGST = 0;
						var totalIGST = 0;

						for (i = 0; i < e.sender._data.length; i++) {
							totalINR += e.sender._data[i].amountINR;
							totalSGST += e.sender._data[i].sgst;
							totalCGST += e.sender._data[i].cgst;
							totalIGST += e.sender._data[i].igst;
						}

						$("#grossTotal").val((totalINR).toFixed(2));
						$("#totalsgst").val((totalSGST).toFixed(2));
						$("#totalcgst").val((totalCGST).toFixed(2));
						$("#totaligst").val((totalIGST).toFixed(2));
						$("#grandTotal").val((totalINR + totalSGST + totalIGST + totalCGST).toFixed(2))
						break;
				}
			}
		})
		return invoiceDetails;
	}

	function init_grid(dataItem) {
		$("#detailsGrid").kendoGrid({
			dataSource: dataItem.invoiceDetails,
			columns: [
				{
					field: "description",
					title: "Description"
				},
				{
					field: "sacNumber",
					title: "SAC Number"
				},
				{
					field: "rate",
					title: "Rate"
				},
				{
					field: "currency",
					title: "Currency"
				},
				{
					field: "volume",
					title: "Volume"
				},
				{
					field: "sgstRate",
					title: "SGST Rate %"
				},
				{
					field: "sgst",
					title: "SGST"
				},
				{
					field: "cgstRate",
					title: "CGST Rate %"
				},
				{
					field: "cgst",
					title: "CGST"
				},
				{
					field: "amountUSD",
					title: "Amount USD"
				},
				{
					field: "amountINR",
					title: "Amount INR"
				}
			]

		})
	}

	function init_IgstGrid(dataItem) {
		$("#detailsGrid").kendoGrid({
			dataSource: dataItem.invoiceDetails,
			columns: [
				{
					field: "description",
					title: "Description"
				},
				{
					field: "sacNumber",
					title: "SAC Number"
				},
				{
					field: "rate",
					title: "Rate"
				},
				{
					field: "currency",
					title: "Currency"
				},
				{
					field: "volume",
					title: "Volume"
				},
				{
					field: "igstRate",
					title: "IGST Rate %"
				},
				{
					field: "igst",
					title: "IGST"
				},
				{
					field: "amountUSD",
					title: "Amount USD"
				},
				{
					field: "amountINR",
					title: "Amount INR"
				}
			]

		})
	}

	function edit_grid(invoiceDetailsDataSource) {
		$("#editDetailsGrid").kendoGrid({
			dataSource: invoiceDetailsDataSource,
			editable: {
				mode: "incell",
				confirmation: false
			},
			toolbar: ["create"],
			columns: [
				{
					field: "description",
					title: "Description",
					editor: descriptionAutoComplete
				},
				{
					field: "sacNumber",
					title: "SAC Number"
				},
				{
					field: "rate",
					title: "Rate"
				},
				{
					field: "currency",
					title: "Currency",
					editor: currencyDropDown
				},
				{
					field: "volume",
					title: "Volume"
				},
				{
					field: "sgstRate",
					title: "SGST Rate %"
				},
				{
					field: "sgst",
					title: "SGST"
				},
				{
					field: "cgstRate",
					title: "CGST Rate %"
				},
				{
					field: "cgst",
					title: "CGST"
				},
				{
					field: "amountUSD",
					title: "Amount USD"
				},
				{
					field: "amountINR",
					title: "Amount INR"
				},
				{ command: [{ text: "Delete", click: deleteInvoiceDetails, iconClass: "k-icon k-i-delete" }], title: "&nbsp;", width: 150 }
			],
			remove: function(e) {
				$.ajax({
					url: "/invoice/deleteInvoiceDetails",
					type: "POST",
					data: JSON.stringify(e.model),
					dataType: 'JSON',
					headers: {
						"Accept": "application/json; charset=utf-8",
						"Content-Type": "application/json; charset=utf-8"
					},
					success: function(data) {
						new PNotify({ title: 'Operation Successful', text: 'Invoice Detail deleted successfully!', type: 'success', styling: 'bootstrap3' });
					},
					error: function(data) {
						new PNotify({ title: 'Oh No!', text: 'Something went wrong, please see logs for more information!', type: 'error', styling: 'bootstrap3' });
					}
				})
			}
		})
	}

	function edit_IgstGrid(invoiceDetailsDataSource) {
		$("#editDetailsGrid").kendoGrid({
			dataSource: invoiceDetailsDataSource,
			editable: {
				mode: "incell",
				confirmation: false
			},
			toolbar: ["create"],
			columns: [
				{
					field: "description",
					title: "Description",
					editor: descriptionAutoComplete
				},
				{
					field: "sacNumber",
					title: "SAC Number"
				},
				{
					field: "rate",
					title: "Rate"
				},
				{
					field: "currency",
					title: "Currency",
					editor: currencyDropDown
				},
				{
					field: "volume",
					title: "Volume"
				},
				{
					field: "igstRate",
					title: "IGST Rate %"
				},
				{
					field: "igst",
					title: "IGST"
				},
				{
					field: "amountUSD",
					title: "Amount USD"
				},
				{
					field: "amountINR",
					title: "Amount INR"
				},
				{ command: "destroy", title: "&nbsp;", width: 150 }
			]

		})
	}

	function descriptionAutoComplete(container, options, e) {
		$('<input required data-bind="value:' + options.field + '"/>')
			.appendTo(container)
			.kendoAutoComplete({
				dataSource: dataSac,
				dataTextField: "description",
				change: function(e) {
					var selectedItem = e.sender.dataItem();
					var grid = $("#editDetailsGrid").getKendoGrid();
					var editedRow = $(grid.tbody).find(".k-grid-edit-row");
					var editedItem = grid.dataItem(editedRow);
					editedItem.set("sacNumber", selectedItem.sacNumber);
					editedItem.set("igstRate", selectedItem.igst);
					editedItem.set("cgstRate", selectedItem.cgst);
					editedItem.set("sgstRate", selectedItem.sgst);
					editedItem.set("rate", "");
					editedItem.set("currency", "");
					editedItem.set("volume", "");
					editedItem.set("amountUSD", "");
					editedItem.set("amountINR", "");
				},
				minLength: 1
			});
	}

	function currencyDropDown(container, options, e) {
		$('<input required data-bind="value:' + options.field + '"/>')
			.appendTo(container)
			.kendoDropDownList({
				dataSource: ["USD", "INR"],
			})
	}

	function deleteInvoiceDetails(e) {
		console.log(e)
		e.preventDefault();
		var $tr = $(e.currentTarget).closest("tr")
		var dataItem = this.dataItem($(e.currentTarget).closest("tr"))
		console.log($tr)
		var window = $("#deletePrompt").kendoWindow({
			title: "Are you sure you want to delete this record?",
			visible: false, //the window will not appear before its .open method is called
			width: "650px",
			height: "150px",
		}).data("kendoWindow");
		var windowTemplate = kendo.template($("#windowTemplate").html());
		window.content(windowTemplate(dataItem)); //send the row data object to the template and render it
		window.center().open();
		$("#yesButton").click(function() {
			var grid = $("#editDetailsGrid").data("kendoGrid");
			grid.removeRow($tr);
			window.close();
		})
		$("#noButton").click(function() {
			window.close();
		})
	}
})

