//$Id$
/*
 * Add printer-friendly tool to page.
 */
PrinterTool = {};

PrinterTool.windowSettings = 'toolbar=no,location=no,status=no,menu=no,' + 
	'scrollbars=yes,width=650,height=400';


PrinterTool.print = function (tagID) {
	target = document.getElementById(tagID);
	title = document.title;

	if(!target || target.childNodes.length == 0) {
		alert("Nothing to Print");
		return;
	}

	content = target.innerHTML;
	
	text = '<html><head><title>' +
		title +
		'</title><body>' +
		content +
		'</body></html>';

	printerWindow = window.open('','',PrinterTool.windowSettings);
	printerWindow.document.open();
	printerWindow.document.write(text);
	printerWindow.document.close();
	printerWindow.print();
}
