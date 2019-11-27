// Nashorn-JS script: 
// A macro to launch the Perl script articledata.pl, possibly other scripts;
// a tool to navigate through specific file trees and handle files.
// Work steps: 2017-01-03 - Article Data; 2018-07 - QC Tool. 

var javaImports = new JavaImporter(
	// GUI
	javax.swing.JFrame,
	javax.swing.JTabbedPane,
	javax.swing.JPanel,
	javax.swing.JLabel,
	javax.swing.JButton,
	javax.swing.JTextField,
	javax.swing.JTextArea,
	javax.swing.JScrollPane,
	javax.swing.JComboBox,
	javax.swing.JFileChooser,
	javax.swing.filechooser.FileNameExtensionFilter,
	javax.swing.WindowConstants,
	// AWT
	java.awt.GridLayout,
	java.awt.FlowLayout,
	java.awt.GridBagLayout,
	java.awt.GridBagConstraints,
	java.awt.Dimension,
	java.awt.Color,
	java.awt.Toolkit,
	java.awt.GraphicsEnvironment,
	// OTHER
	java.io,
	java.io.BufferedReader,
	java.io.InputStreamReader,
	java.lang,
	java.lang.Integer,
	//java.util,
	java.util.regex,
	java.io.File,
	//java.io.IOException,
	java.nio.file.FileSystems,
	java.nio.file.Path,
	//
	org.gjt.sp.jedit.jEdit,
	org.gjt.sp.jedit.View.ViewConfig,
	//
	// for Excel
	java.io.FileInputStream,
	java.util.Iterator,
	org.apache.poi.ss.usermodel.Cell,
	org.apache.poi.ss.usermodel.Row,
	org.apache.poi.xssf.usermodel.XSSFRow,
	org.apache.poi.ss.usermodel.Row,
	org.apache.poi.ss.usermodel.Row.MissingCellPolicy,
	org.apache.poi.xssf.usermodel.XSSFSheet,
	org.apache.poi.xssf.usermodel.XSSFWorkbook,
	
	org.apache.commons.io.FileUtils
	);

with (javaImports) {

	// ===
	var JPanel = Java.type("javax.swing.JPanel");
	var JLabel = Java.type("javax.swing.JLabel");
	var JButton = Java.type("javax.swing.JButton");
	var JTextField = Java.type("javax.swing.JTextField");
	var JComboBox = Java.type("javax.swing.JComboBox");
	var JFileChooser = Java.type("javax.swing.JFileChooser");
	var FileNameExtensionFilter = Java.type("javax.swing.filechooser.FileNameExtensionFilter");
	var Dimension = Java.type("java.awt.Dimension");
	var FileSystems = Java.type("java.nio.file.FileSystems");
	var Color = Java.type("java.awt.Color");
	var Pattern = Java.type("java.util.regex.Pattern");
	var GridBagLayout = Java.type("java.awt.GridBagLayout");
	var GridBagConstraints = Java.type("java.awt.GridBagConstraints");

	var File = Java.type("java.io.File");
	var Toolkit = Java.type("java.awt.Toolkit");
	//
	// ==================================================================
	//
	var tk = Toolkit.getDefaultToolkit();
	var scrDim = tk.getScreenSize();
	//alert(scrDim);
	var scrWidth = scrDim.width;
	var scrHeight = scrDim.height;
	// DELL@Win10 (actual screen 1920x1080):
	// scrWidth  = 1280; scrHeight = 720
	// due to special trick with Java forced to see low resolution
	//
	//screen dimensions = "1366x768";   // HPP @home; Win10 Home 
	//screen dimensions = "1680x1050";  // PHILIPS monitor @work; Win10 Pro
	
	// ===
	var Thread = Java.type("java.lang.Thread");
	var Runnable = Java.type('java.lang.Runnable');
	var _rt = Runtime.getRuntime();
	//
	// Data for script articledata.pl
	var _perl = "d:\\bin\\perl\\bin\\perl.exe";
	var _script = "d:\\works\\articledata\\articledata.pl";
	var _outputTempDir = "d:\\works\\articledata\\temp\\";
	// SQC Helper:
	var _sevenz = "C:\\PROGRA~1\\7-Zip\\7z.exe";
	var markButtonCloseFiles = false;
	
	// ================

	function createPaneArticleData()
	{
		var _jEdit = Java.type('org.gjt.sp.jedit.jEdit');
		var _view = _jEdit.getActiveView();
		// To make "paneArticleData" somehow stable in size, it is put onto another JPanel
		// with the desirable or "default" layout.
		var paneArticleDataOuter = new JPanel();
		var paneArticleData = new JPanel();
		//
		paneArticleDataOuter.add(paneArticleData);

		// === Here are the components of the tab "Article Data": ===
		var sourceList =  ["article", "order"];
		var requestList = ["fmt_all", "fmt", "refersto"];
		var markupList =  ["default", "bibtags"];

		var labelSourceType = new JLabel("Source Type ");
		var labelSourceFile = new JLabel("Source File");
		var labelOutputFile = new JLabel("Output File");
		var textFieldSourceFile = new JTextField(25);
		var textFieldOutputFile = new JTextField(25);
		//
		textFieldSourceFile.setText("");
		textFieldOutputFile.setText("");
		//
		var comboSource = new JComboBox(sourceList);
		var labelRequest = new JLabel("request");
		var comboRequest = new JComboBox(requestList);
		var labelMarkup = new JLabel("markup");
		var comboMarkup = new JComboBox(markupList);
		var buttonBrowseSource = new JButton("Browse Source");
		var buttonBrowseOutput = new JButton("Browse Output");
		var buttonClear = new JButton("Clear");
		var buttonRun = new JButton("Run");
		var buttonHelp = new JButton("Help");

		var buttonRunBackgroundColor = new Color(153, 202, 133) // RGB
		buttonRun.setBackground(buttonRunBackgroundColor);
		//buttonRun.setBackground(Color.green);

	//{{{ //~~~ GridBagLayout  in createPaneArticleData
		var gbl = new GridBagLayout();
		var gbc = new GridBagConstraints();
		gbc.fill = GridBagConstraints.HORIZONTAL;
		paneArticleData.setLayout(gbl);
		// ===
		//(0, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 0;
		paneArticleData.add(labelSourceType, gbc);
		//
		// (0, 1) position
		gbc.weightx = 0.5; //0.5
		gbc.gridx = 1;
		gbc.gridy = 0;
		paneArticleData.add(comboSource, gbc);
		// ===
		// (1, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 1;
		gbc.weighty = 1.0; // request any extra vertical space
		paneArticleData.add(labelSourceFile, gbc);
		//
		// (1, 1) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 1;
		gbc.weighty = 1.0; // request any extra vertical space
		paneArticleData.add(textFieldSourceFile, gbc);
		//
		// (1, 2) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 1;
		//gbc.weighty = 1.0; // request any extra vertical space
		paneArticleData.add(buttonBrowseSource, gbc);
		// ===
		// (2, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 2;
		gbc.weighty = 1.0; // request any extra vertical space
		paneArticleData.add(labelOutputFile, gbc);
		// (2, 1) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 2;
		gbc.weighty = 1.0; // request any extra vertical space
		paneArticleData.add(textFieldOutputFile, gbc);
		// (2, 2) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 2;
		//gbc.weighty = 1.0; // request any extra vertical space
		paneArticleData.add(buttonBrowseOutput, gbc);
		// ===
		//(3, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 3;
		paneArticleData.add(labelRequest, gbc);
		// (3, 1) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 3;
		paneArticleData.add(comboRequest, gbc);
		// ===
		// (3, 2) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 3;
		paneArticleData.add(buttonClear, gbc);
		// ===
		//(4, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 4;
		paneArticleData.add(labelMarkup, gbc);
		// ===
		// (4, 1) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 4;
		paneArticleData.add(comboMarkup, gbc);
		// ===
		// (5, 1) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 5;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneArticleData.add(buttonRun, gbc);
		// (5, 2) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 5;
		paneArticleData.add(buttonHelp, gbc);
		//
	// }}}

	// Listeners:
	//{{{ //~~~ buttonBrowseSource.addActionListener
		buttonBrowseSource.addActionListener(function ()
			{
				var startLocation = "D:\\local";
				var dialogTitle = "Choose Article File";
				var sourceType = comboSource.getSelectedItem().toString();
				if (sourceType == "order") {
					startLocation = "U:\\orig_db";
					dialogTitle = "Choose Order File";
				}
				var chooserS = new JFileChooser(startLocation);
				chooserS.setDialogTitle(dialogTitle);
				chooserS.setPreferredSize(new Dimension(380, 660));
				var returnValue = chooserS.showOpenDialog(null);
				if (returnValue == JFileChooser.APPROVE_OPTION) {
					path = chooserS.getSelectedFile().getAbsolutePath();
					textFieldSourceFile.setText(path);
				}
			});
		//}}}
		//
	//{{{ //~~~ buttonBrowseOutput.addActionListener(
		buttonBrowseOutput.addActionListener(function ()
			{
				var chooserO = new JFileChooser();
				var fsv = chooserO.getFileSystemView();
				var roots = fsv.getRoots();
				var files = roots[0].listFiles();
				var start = files[0];
				chooserO.setCurrentDirectory(start);
				chooserO.setDialogTitle("Choose Output File");
				chooserO.setPreferredSize(new Dimension(380, 660));
				var returnValue = chooserO.showOpenDialog(null);
				if (returnValue == JFileChooser.APPROVE_OPTION) {
					path = chooserO.getSelectedFile().getAbsolutePath();
					textFieldOutputFile.setText(path);
				}
			});
		//}}}
		//
	//{{{ //~~~	buttonClear.addActionListener
		buttonClear.addActionListener(function ()
			{
				textFieldSourceFile.setText("");
				textFieldOutputFile.setText("");
			});
		//}}}
		//
	//{{{ //~~~ buttonRun.addActionListener ~~~
		buttonRun.addActionListener(function ()
			{
				var buff;
				var pattern = "^(.*?)(\\.\\w+) \\(([A-Z]\:.*)\\)$";
				var re = new RegExp(pattern);
				var result;
				var fileName;
				var fileExt;
				var fileDir;

				var valueSourceType = comboSource.getSelectedItem().toString();
				var valueRequest = comboRequest.getSelectedItem().toString();
				var valueMarkup = comboMarkup.getSelectedItem().toString();

				var valueSourceFile = textFieldSourceFile.getText();
				var valueOutputFile = textFieldOutputFile.getText();

				var _sourceFile;
				var _source;
				var _outputFile;
				var _output;

				// ===
				// getting options for the script starter:
				if (valueSourceFile == "") {
					// If the file is not given in the option selection,
					// the file (of 'article' or 'order') in the active buffer is taken:
					buff = _view.getBuffer();
					// buffer_TeX_fmt_all_.js (D:\tools\jEdit5.2.0.j8\macros\[CADET]\)
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
					// var pattern = "^(.*?)(\\.\\w+) \\(([A-Z]\:.*)\\)$";
					// var re = new RegExp(pattern);
					result = re.exec(buff);
					fileName = result[1];
					fileExt = result[2];
					fileDir = result[3];
					_sourceFile = fileDir + fileName + ".tex"; //fileExt;
				} else {
					_sourceFile = valueSourceFile;
				}
				if (valueOutputFile == "") {
					// If the Output File is not given, 
					// then the Default Temp Output File name is created:
					if (valueSourceFile == "") {
						_outputFile = _outputTempDir + fileName + "-ouput" + ".tex"; //fileExt;
					}
					else {
						var date = new Date;
						_outputFile = _outputTempDir + date.getTime() + "-ouput" + ".tex";
					}
				} else {
					_outputFile = valueOutputFile;
				}
				//
				if (valueSourceType == "article") {
					_source = "--article=" + _sourceFile;
				} else if (valueSourceType == "order") {
					_source = "--order=" + _sourceFile;
				}
				_output = "--output=" + _outputFile;
				//
				var _request = "--request=" + valueRequest;
				var _markup  = "--markup=" + valueMarkup;

				// ===
				// script execution:
				// consPrint("_source: " + _source);
				// consPrint("_output: " + _output);
				// consPrint("_request: " + _request);
				// consPrint("_markup: " + _markup);

				try {
					var processPerl = _rt.exec([_perl, _script, _source, _output, _request, _markup]);
					processPerl.waitFor();
					var exitVal = processPerl.waitFor();
					//alert(exitVal);
					//
					if (exitVal == 0) {
						//consPrint("Successfully executed the command");
					}
					else {
						consPrint("Failed to execute the command");
						try {
							var br = new BufferedReader(new InputStreamReader(processPerl.getErrorStream()));
							var line;
							if ((line = br.readLine()) != null) {
								consPrint(line);
							}
						} catch (eexcp) {
							eexcp.printStackTrace();
						}
					}
					//psp.destroy();
					//psp.waitFor();
				} catch (exception) {
					alert(exception);
				}
				var buffNew = _jEdit.openFile(_view, _outputFile);

			});
		//}}}
		//
		// Tooltips
		labelSourceFile.setToolTipText("[default]: File in the active buffer");
		labelOutputFile.setToolTipText("[default]: File in some TEMP; opens in a new buffer");
		buttonClear.setToolTipText("Sets fields \"Source File\" and \"Output File\" to [default]");
		buttonHelp.setToolTipText("To Be Done :)");
		buttonRun.setToolTipText("Runs script");
		// ======
		return paneArticleDataOuter;
	}
	

	// =====
	// Variables common to createPaneQcTool and createPaneQcFiles: 	
	try {
		var FileInputStream = Java.type("java.io.FileInputStream"); 
		var FileOutputStream = Java.type("java.io.FileOutputStream"); 
		var XSSFWorkbook = Java.type("org.apache.poi.xssf.usermodel.XSSFWorkbook");
		var XSSFSheet = Java.type("org.apache.poi.xssf.usermodel.XSSFSheet");
		var ZipSecureFile = Java.type("org.apache.poi.openxml4j.util.ZipSecureFile");
		var XSSFRow = Java.type("org.apache.poi.xssf.usermodel.XSSFRow");
		var DataFormatter = Java.type("org.apache.poi.ss.usermodel.DataFormatter");
		var UmRow = Java.type("org.apache.poi.ss.usermodel.Row");
		var MissingCellPolicy = Java.type("org.apache.poi.ss.usermodel.Row.MissingCellPolicy");
		var FileUtilsApache = Java.type("org.apache.commons.io.FileUtils");
	} catch (excc) {
		println(excc);
	}
	var Integer = Java.type("java.lang.Integer");
	
	var labelMasterFolder = new JLabel("Master Folder ");
	var textFieldMasterFolder = new JTextField(25);  // length or width
	var textFieldItemPosition = new JTextField(25);
	var textFieldExcelFile = new JTextField(25);
	//
	var nameMasterFolder = "D:\\_vtex-els--sqc\\__M-N-factors-2019\\09 MN September\\0";
	// list of all 'items' in the master folder:
	var masterFolderItemsList; 
	var isMasterFolderChosen = false;
	//
	var isExcelChosen = false;   // global mark
	var isExcelFileWritten = false; // global mark
	var excelColor = new Color(0x99cc00);
	// =====
	
	
	function createPaneQcTool()
	{
		var machine;
		if (scrWidth == 1680) {
			machine = "desktop1680";
			// this means that acroreader is ...70
		} else {
			machine = "laptop";
			// this means that acroreader is ...DC;
			// and selection of acroreader works well;
			// in case of DELL@Win10, screen width = 1280, height = 720
		}
		// default: machine = "desktop";
		var adobeReaderDC = "C:/Program Files (x86)/Adobe/Acrobat Reader DC/Reader/AcroRd32.exe";
		var adobeReader70 = "C:/Program Files/Adobe/Acrobat 7.0/Reader/AcroRd32.exe";
		var _adobeReader;
		var _taskkill;
		if (machine == "desktop1680") {
			_adobeReader = adobeReader70;
			_taskkill = "C:/Windows/System32/taskkill.exe";
		} else {
			//machine = "laptop";
			_adobeReader = adobeReaderDC;
			_taskkill = "C:/Windows/SysWOW64/taskkill.exe";
		}
		var jEdit = Java.type('org.gjt.sp.jedit.jEdit');
		var view = jEdit.getActiveView();
		// for any sake: it may happen that perspective.xml gets <TITLE>txt / XML - </TITLE>
		// and the following code forces to close jEdit
		view.setUserTitle("jEdit");

		// To make "paneHelper" somehow stable in size, it is put onto another JPanel
		// with the desirable or "default" layout.
		var paneHelperOuter = new JPanel();
		var paneHelper = new JPanel();
		//
		paneHelperOuter.add(paneHelper);
		//
		var buttonMasterFolder = new JButton("Choose Folder"); 
		//
		var labelPathToItem = new JLabel("Path To Item ");
		var textFieldPathToItem = new JTextField(25);
		textFieldPathToItem.setText("");
		var buttonChooseItem = new JButton("Choose Item");
		//
		var labelItemId = new JLabel("ITEM9999 ");
		labelItemId.setToolTipText("Item in check or just checked");
		//
		var buttonCloseFiles = new JButton("Close Files");
		buttonCloseFiles.setEnabled(false);
		var buttonOrigFiles = new JButton("Open Orig. PDFs"); 
		//
		var labelItemPosition = new JLabel("Item Position ");
		textFieldItemPosition.setText("");
		var buttonNextItem = new JButton("Next Item");
		//
		var labelNotes = new JLabel("Notes ");
		var textFieldNotes = new JTextField(25);
		//
		var openFilesColor = new Color(0x99ff99)   // 0x00cc33 0x99ff99
		var closeFilesColor = new Color(0xff6633)  // 0xff0000
		var extractBz2Color = new Color(0x00f1ea)  // 0x00f1ea
		buttonChooseItem.setBackground(openFilesColor);
		buttonCloseFiles.setBackground(closeFilesColor);
		buttonNextItem.setBackground(openFilesColor);
		
		// for Excel:
		var labelPageType = new JLabel("Page type ");
		var textFieldPageType = new JTextField(25);
		var labelPageNumber = new JLabel("Page number ");
		var textFieldPageNumber = new JTextField(25);
		var buttonWriteToExcel = new JButton("Write to Excel");
		
		labelPageType.setOpaque(true);
		labelPageNumber.setOpaque(true);
		labelPageType.setBackground(excelColor);
		labelPageNumber.setBackground(excelColor);
		buttonWriteToExcel.setBackground(excelColor);
		//var buttonTestExcel = new JButton("TEST EXCEL");
		//buttonTestExcel.setBackground(excelColor);
		var nameExcelFile;
		var exclObj;
		//
		var currentItemPosition;  // position of the current item in this list
		var ip;

		var nameItemFolder;
		var processExternal;
		//
		// --- jEdit views - buffers ---
		var newVcfgA;
		var newVcfgB;
		var viewTeX;
		var viewTXml;
		//
		var vcfg = view.getViewConfig();
		var ViewConfig = Java.type('org.gjt.sp.jedit.View.ViewConfig');
		if (scrWidth == 1680) {
			// machine = "desktop1680"
			newVcfgA = new ViewConfig(vcfg.plainView, vcfg.splitConfig,
				0, 0, vcfg.width, vcfg.height, vcfg.extState);
			newVcfgB = new ViewConfig(vcfg.plainView, vcfg.splitConfig,
				200, 0, vcfg.width - 200, vcfg.height, vcfg.extState);
		}
		if (scrWidth == 1280) {
			// machine = "laptop"   "1280x720"
			newVcfgA = new ViewConfig(vcfg.plainView, vcfg.splitConfig,
				60, 0, 1220, vcfg.height, vcfg.extState); 
			// x=60 is width of OS vertical taskbar on left
			newVcfgB = new ViewConfig(vcfg.plainView, vcfg.splitConfig,
				110, 0, vcfg.width - 60, vcfg.height, vcfg.extState);  
			// 60 is width of OS vertical taskbar on left;
			// 110-60=50 is less than 60, i.e. the right side is per 10 from the screen edge
		}

		//{{{ //~~~ GridBagLayout  in createPaneQcTool
		var gbl = new GridBagLayout();
		var gbc = new GridBagConstraints();
		gbc.fill = GridBagConstraints.HORIZONTAL;
		paneHelper.setLayout(gbl);
		// ===
		// (0, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 0;
		paneHelper.add(labelPathToItem, gbc);
		// (0, 1) position
		gbc.weightx = 0.5; //0.5
		gbc.gridx = 1;
		gbc.gridy = 0;
		paneHelper.add(textFieldPathToItem, gbc);
		// (0, 2) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 0;
		//gbc.weighty = 1.0; // request any extra vertical space
		paneHelper.add(buttonChooseItem, gbc);
		//
		// (1, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 1;
		paneHelper.add(labelItemId, gbc);
		// (1, 1) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 1;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneHelper.add(buttonCloseFiles, gbc);
		// (1, 2) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 1;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneHelper.add(buttonOrigFiles, gbc);
		// ===
		// (2, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 2;
		paneHelper.add(labelItemPosition, gbc);
		// (2, 1) position
		gbc.weightx = 0.5; //0.5
		gbc.gridx = 1;
		gbc.gridy = 2;
		paneHelper.add(textFieldItemPosition, gbc);
		// (2, 2) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 2;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneHelper.add(buttonNextItem, gbc);
		// ===
		// (3, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 3;
		paneHelper.add(labelNotes, gbc);
		// (3, 1) position
		gbc.weightx = 0.5; //0.5
		gbc.gridx = 1;
		gbc.gridy = 3;
		paneHelper.add(textFieldNotes, gbc);
		// ===
		// (4, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 4;
		paneHelper.add(labelPageType, gbc);
		// (4, 1) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 4;
		paneHelper.add(textFieldPageType, gbc);
		// ===
		// (5, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 5;
		paneHelper.add(labelPageNumber, gbc);
		//(5, 1) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 5;
		paneHelper.add(textFieldPageNumber, gbc);
		//(8, 2) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 5;
		paneHelper.add(buttonWriteToExcel, gbc);
		//}}}

		// Listeners:
		//{{{ //~~~ buttonChooseItem.addActionListener
		buttonChooseItem.addActionListener(
			function () {
				if (!isMasterFolderChosen) {
					alert("Master Folder (QC Files) is not chosen.");
					return;
				}
				var pathD;
				var startLocationD = nameMasterFolder;
				var dialogTitleD = "Choose Folder for Item";
				var chooserD = new JFileChooser(startLocationD);
				// https://docs.oracle.com/javase/7/docs/api/javax/swing/JFileChooser.html
				chooserD.setOpaque(true);
				chooserD.setBackground(openFilesColor);
				chooserD.setDialogTitle(dialogTitleD);
				chooserD.setApproveButtonText("O P E N");
				chooserD.setApproveButtonToolTipText("Open prescribed files belonging to the item.");
				chooserD.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
				// we want "15 lines x 10 columns" layout of items in 'O P E N' window"
				chooserD.setPreferredSize(new Dimension(1100, 510));  // (780, 640) 
				var returnValueD = chooserD.showOpenDialog(null);
				if (returnValueD == JFileChooser.APPROVE_OPTION) {
					pathD = chooserD.getSelectedFile().getAbsolutePath();
					textFieldPathToItem.setText(pathD);
					nameItemFolder = pathD;
					for (ip = 0; ip < masterFolderItemsList.length; ip++) {
						if (nameItemFolder == masterFolderItemsList[ip].toString()) {
							currentItemPosition = ip + 1; // 1-based counter
							textFieldItemPosition.setText(currentItemPosition);
						}
					}
					if (currentItemPosition >= masterFolderItemsList.length) {
						alert("This will be the last item in the master folder.");
					}
					//
					openItemRelatedFiles(pathD);
				}
				//
				if (isExcelChosen) {
					nameExcelFile = textFieldExcelFile.getText();
					exclObj = new ExcelObj(nameExcelFile);
					exclObj.getSpreadsheet();
					exclObj.getItemRow(labelItemId.getText());  // here we have item name
					textFieldPageType.setText(exclObj.getPageType());
					isExcelFileWritten = false;
					buttonWriteToExcel.setEnabled(true);
				} else {
					textFieldPageType.setText("Excel QC List (QC Files) is not chosen.");
				}
		});
		//}}}
	
		//{{{ //~~~ buttonNextItem.addActionListener
		buttonNextItem.addActionListener(
			// actions needed: (1) close all files; (2) open next item files
			function() {
				if (markButtonCloseFiles) {
					buttonCloseFilesFunction();
				}
				if (currentItemPosition + 1 >= masterFolderItemsList.length) {
					alert("This will be the last item in the master folder.");
				}
				//
				var pathD = masterFolderItemsList[currentItemPosition].toString();
				nameItemFolder = pathD;
				textFieldPathToItem.setText(pathD);
				currentItemPosition = currentItemPosition + 1;
				textFieldItemPosition.setText(currentItemPosition);
				openItemRelatedFiles(pathD);
				//
				if (isExcelChosen) {
					if (!isExcelFileWritten) {
						pageNumber = textFieldPageNumber.getText();
						exclObj.acceptPageNumber(pageNumber);
						exclObj.writeToFile();
						textFieldPageType.setText("");
						textFieldPageNumber.setText("");
						isExcelFileWritten = true;
						buttonWriteToExcel.setEnabled(true);
					}
					//
					nameExcelFile = textFieldExcelFile.getText();
					exclObj = new ExcelObj(nameExcelFile);
					exclObj.getSpreadsheet();
					exclObj.getItemRow(labelItemId.getText());  // here we have item name
					textFieldPageType.setText(exclObj.getPageType());
					textFieldPageNumber.setText("");
					isExcelFileWritten = false;
					buttonWriteToExcel.setEnabled(true);
				} else {
					textFieldPageType.setText("Excel QC List (QC Files) is not chosen.");
				}
		});
		//}}}
		
		//{{{ //~~~ buttonWriteToExcel.addActionListener
		buttonWriteToExcel.addActionListener(
			function() {
				var pageNumber;
				if (isExcelChosen) {
					pageNumber = textFieldPageNumber.getText();
					exclObj.acceptPageNumber(pageNumber);
					if (!isExcelFileWritten) {
						exclObj.writeToFile();
						textFieldPageType.setText("");
						textFieldPageNumber.setText("");
						isExcelFileWritten = true;
						buttonWriteToExcel.setEnabled(false);
					}
				}
		});
		//}}}

		//{{{ //~~~ function viewPDFFilesAdobeReader
		function viewPDFFilesAdobeReader(pdfFileList) {
			// Function for code reuse.
			/**
			https://htipe.wordpress.com/2010/10/20/adobe-acrobat-command-line-options/
			A few more options:
			/n Launch a separate instance of the Acrobat application, even if one is currently open.
			/s Open Acrobat, suppressing the splash screen.
			/o Open Acrobat, suppressing the open file dialog.
			/h Open Acrobat in hidden mode.
			*/
			var kk;
			cllist = [];
			cllist.push(_adobeReader);
			cllist.push("/n");
			cllist.push("/o");
			var kk;
			for (kk = 0; kk < pdfFileList.length; kk++) {
				// trick found by trial:
				cllist.push(pdfFileList[kk]);
			}
			// ***
			var Runn = Java.type("java.lang.Runnable");
			var RunAdobe = Java.extend(Runn, { run: function() {
						runExternalApp(cllist, false)
					}
			});
			var ThreadAdobe = Java.type("java.lang.Thread");
			var thAdobe = new ThreadAdobe(new RunAdobe());
			thAdobe.start();
			//thAdobe.join();
			// - DOES NOT work without threading
		}
		//}}}	
		
		//{{{ //~~~ function openItemRelatedFiles
		function openItemRelatedFiles(_itemFolderName) {
		//buttonOpenFiles.addActionListener(
			// If an item is from SkyLaTeX:
			// For check the following PDF files are opened:
			// ...S100\\(.*?)_S100.1_aqf.pdf
			// ...S[200|250]\\(.*?)\.dvidiff.pdf
			// ...S[200|250]\\(.*?)\.dvidifftext.pdf
			// In jEdit, the following files opened for diff:
			// ...S[200|250]\\(.*?)\.tex.init
			// ...S[200|250]\\(.*?)\.tex
			// In another jEdit's 'view' the following files are opened:
			// ...S[200|250]\\_queries\.txt
			// ...S[200|250]\\_remarks\.txt   (if any)
			// ...S[200|250]\\(.*?)_S[200|250]\.xml

			var synctexFound = false;
			//var remarksFound = false;
			var reSync = "(.*)\\\\(.*?)\.synctex\.gz$";
			// D:\_vtex-els--sqc\__M-N-factors-2018\05 May\01\YJMAA22235\yjmaa22235.synctex.gz
			var reAqf = "(.*)\\\\(S100\\\\)(.*?)(\_S100\.1\_aqf)?\.pdf$"; // YJMAA_22241_S100.1_aqf.pdf
			// For some journals, "*.1_aqf.pdf" files are not included, e.g., BULSCI_2751.pdf.
			// ..... _S1631073X18301523-20180515_120101_S100.zip
			var reSourceZip = "(.*)\\\\(S100\\\\)(.*?)\_S100\.zip$";
			// order, final
			// ...... \fss7429\S200\_S0165011418302847-20180518_063415_S200.xml
			var reOrder = "(.*)\\\\(S2[0|5]0\\\\)([^\\\\]*)\_S2[0|5]0.xml$";
			var reDvidiff = "(.*)\\\\(S2[0|5]0\\\\)([^\\\\]*?)\.dvidiff\.pdf$"; // yjmaa22241.dvidiff.pdf  // (o?l?d?\\\\?)
			var reDvidifftext = "(.*)\\\\(S2[0|5]0\\\\)([^\\\\]*?)\.dvidifftext\.pdf$"; // yjmaa22241.dvidifftext.pdf  // (o?l?d?\\\\?)
			// U:\orig_db\esch\yhmat\YHMAT2983\S200\YHMAT_2983-proofs-RSS_NS_02_C830_201807001495220243.pdf
			var reDigitalSuffix = "(.*)\\\\(S2[0|5]0\\\\)([^\\\\]+?)\\d{10,}\.pdf$";
			var reTexinit = "(.*)\\\\(S2[0|5]0\\\\)([^\\\\]*?)\.tex\.init$"; // yjmaa22241.tex.init   // (o?l?d?\\\\?)
			var reTexout = "(.*)\\\\(S2[0|5]0\\\\)([^\\\\]*?)\.tex$"; // yjmaa22241.tex   // (o?l?d?\\\\?)
			var reQueries = "(.*)\\\\(S2[0|5]0\\\\)\_queries\.txt$"; // _queries.txt   // (o?l?d?\\\\?)
			var reRemarks = "(.*)\\\\(S2[0|5]0\\\\)\_remarks\.txt$"; // _remarks.txt   // (o?l?d?\\\\?)
			//
			var reS200 = "(.*)\\\\(S200\\\\)(.*)$";
			var reS250 = "(.*)\\\\(S250\\\\)(.*)$";
			var reResupply = "(.*)RESUPPLY(.*)$";

			// Multiple flags must be combined using the or operator (|).
			var ptnSync = Pattern.compile(reSync, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnAqf = Pattern.compile(reAqf, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnOrder = Pattern.compile(reOrder, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnSourceZip = Pattern.compile(reSourceZip, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnDvidiff = Pattern.compile(reDvidiff, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnDvidifftext = Pattern.compile(reDvidifftext, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnDigitalSuffix = Pattern.compile(reDigitalSuffix, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnTexinit = Pattern.compile(reTexinit, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnTexout = Pattern.compile(reTexout, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnQueries = Pattern.compile(reQueries, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnRemarks = Pattern.compile(reRemarks, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			//
			var ptnS200 = Pattern.compile(reS200, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnS250 = Pattern.compile(reS250, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnResupply = Pattern.compile(reResupply, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);

			var mtchSync;
			var mtchAqf;
			var mtchOrder;
			var mtchSourceZip;
			var mtchDvidiff;
			var mtchDvidifftext;
			var mtchDigitalSuffix;
			var mtchTexinit;
			var mtchTexout;
			var mtchQueries;
			var mtchRemarks;
			//
			var mtchS200;
			var mtchS250;
			var mtchResupply;

			// If not in SkyLaTeX:
			var reTxt = "(.*)\\\\(S2[0|5]0\\\\).*?\.txt$"; // *.txt   // (o?l?d?\\\\?)
			var rePdf = "(.*)\\\\(S2[0|5]0\\\\).*?\.pdf$"; // *.pdf   // (o?l?d?\\\\?)
			var reVtxt = ".*?V\\d.txt$";                   // *V\d.txt   // (o?l?d?\\\\?)
			var ptnTxt = Pattern.compile(reTxt, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnPdf = Pattern.compile(rePdf, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var ptnVtxt = Pattern.compile(reVtxt, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var mtchTxt;
			var mtchPdf;
			var mtchVtxt;
			//
			var initTeX;
			var corrTeX;
			var initBuffer;
			var corrBuffer;
			var pdfs = [];
			var txtxmls = [];
			var cllist = [];

			var pathStr = textFieldPathToItem.getText();
			// pathStr is a string for a path, but we need File type
			var argf =  new File(pathStr)
			var entriesHArray = [];
			//
			arrayDirectoryContents(argf, entriesHArray);
			//
			var k;
			var qhh;
			var qhhs;
			var S200Found;
			var S250Found;
			var resupplyFound;
			for (k = 0; k < entriesHArray.length; k++) {
				qhh = entriesHArray[k];
				// qhh.name is java.io.File, not String
				qhhs = qhh.name.toString();
				mtchSync = ptnSync.matcher(qhhs);
				if (mtchSync.find()) {
					synctexFound = true;
				}
				mtchS200 = ptnS200.matcher(qhhs);
				mtchS250 = ptnS250.matcher(qhhs);
				mtchResupply = ptnResupply.matcher(qhhs);
				if (mtchS200.find()) {
					S200Found = true;
				}
				if (mtchS250.find()) {
					S250Found = true;
				}
				if (mtchResupply.find()) {
					resupplyFound = true;
				}
			}
			//after loop
			if (S200Found && S250Found) {
				//alert("Both S200 and S250 found.");
				textFieldNotes.setText("Both S200 and S250 found.");
			}
			if (resupplyFound) {
				//alert("RESUPPLY found.");
				textFieldNotes.setText("RESUPPLY found.");
			}
			//
			var buffersB;
			if (synctexFound) {
				for (k = 0; k < entriesHArray.length; k++) {
					qhh = entriesHArray[k];
					// qhh.name is java.io.File, not String
					qhhs = qhh.name.toString();
					//println(k + ": " + qhhs);
					mtchAqf = ptnAqf.matcher(qhhs);
					if (mtchAqf.find()) {
						//println("aqf:  " + qhhs);
						pdfs.push(qhhs);
					} else {
						mtchDvidiff = ptnDvidiff.matcher(qhhs);
						if (mtchDvidiff.find()) {
							//println("dvidiff: " + qhhs);
							pdfs.push(qhhs);
						} else {
							mtchDvidifftext = ptnDvidifftext.matcher(qhhs);
							if (mtchDvidifftext.find()) {
								//println("dvidifftext: " + qhhs);
								pdfs.push(qhhs);
							} else {
								mtchDigitalSuffix = ptnDigitalSuffix.matcher(qhhs);
								if (mtchDigitalSuffix.find()) {
									pdfs.push(qhhs);
								} else {
									mtchTexinit = ptnTexinit.matcher(qhhs);
									if (mtchTexinit.find()) {
										//println("tex.init: " + qhhs);
										initTeX = qhhs;
									} else {
										mtchTexout = ptnTexout.matcher(qhhs);
										if (mtchTexout.find()) {
											//println("tex: " + qhhs);
											corrTeX = qhhs;
										} else {
											mtchQueries = ptnQueries.matcher(qhhs);
											if (mtchQueries.find()) {
												//println("_queries: " + qhhs);
												txtxmls.push(qhhs);
											} else {
												mtchRemarks = ptnRemarks.matcher(qhhs);
												if (mtchRemarks.find()) {
													//println("_remarks: " + qhhs);
													txtxmls.push(qhhs);
												} else {
													mtchOrder = ptnOrder.matcher(qhhs);
													if (mtchOrder.find()) {
														//println("order: " + qhhs);
														txtxmls.push(qhhs);
													} else {
														mtchSourceZip = ptnSourceZip.matcher(qhhs);
														if (mtchSourceZip.find()) {
															//println("source zip: " + qhhs);
															//txtxmls.push(qhhs);
														}
					} } } } } } } } }
				}
				// Now trying to open PDF files; earlier than files in jEdit:
				viewPDFFilesAdobeReader(pdfs);
				//
				var allViews = jEdit.getViews();
				var newEmpty = jEdit.newFile(view); // Buffer
				var t;
				for (t = 0; t < allViews.length; t++) {
					if ( (allViews[t].title.substring(0,9) == "txt / XML") ||
						 (allViews[t].title.substring(0,10) == "init & TeX") ) {
						jEdit.closeView(allViews[t]);
					}
				}
				//
				// Open LaTeX files in jEdit
				viewTeX = jEdit.newView(view, newEmpty, newVcfgA);
				viewTeX.setUserTitle("init & TeX");
				// JDiff episode:
				initBuffer = jEdit.openFile(viewTeX, initTeX);
				corrBuffer = jEdit.openFile(viewTeX, corrTeX);
				viewTeX.splitVertically();
				var editPanes = viewTeX.getEditPanes();
				editPanes[0].setBuffer(initBuffer);
				editPanes[1].setBuffer(corrBuffer);
				jEdit.getAction("toggle-dual-diff").invoke(viewTeX);
				//
				// other (TXT, XML) files
				viewTXml = jEdit.newView(view, newEmpty, newVcfgB);
				viewTXml.setUserTitle("txt / XML");
				for (t = 0; t < txtxmls.length; t++) {
					jEdit.openFile(viewTXml, txtxmls[t]);
				}
				buffersB = viewTXml.getBuffers();
				for (t = 0; t < buffersB.length; t++) {
					// focus is set on _queries.txt
					if (buffersB[t].getName() == "_queries.txt") {
						viewTXml.goToBuffer(buffersB[t]);
					}
				}
			}
			else {
				textFieldNotes.setText("SkyLaTeX output files not found.");
				for (k = 0; k < entriesHArray.length; k++) {
					qhh = entriesHArray[k];
					// qhh.name is java.io.File, not String
					qhhs = qhh.name.toString();
					mtchAqf = ptnAqf.matcher(qhhs);
					if (mtchAqf.find()) {
						pdfs.push(qhhs);
					} else {
						mtchPdf = ptnPdf.matcher(qhhs);
						if (mtchPdf.find()) {
							pdfs.push(qhhs);
						} else {
							mtchOrder = ptnOrder.matcher(qhhs);
							if (mtchOrder.find()) {
								txtxmls.push(qhhs);
							} else {
								mtchTxt = ptnTxt.matcher(qhhs);
								if (mtchTxt.find()) {
									txtxmls.push(qhhs);
								} else {
									mtchSourceZip = ptnSourceZip.matcher(qhhs);
									if (mtchSourceZip.find()) {
										//println("source zip: " + qhhs);
										//txtxmls.push(qhhs);
									}
					} } } }
				}
				// Now trying to open PDF files; earlier than files in jEdit:
				viewPDFFilesAdobeReader(pdfs);
				//
				var allViews = jEdit.getViews();
				var newEmpty = jEdit.newFile(view); // Buffer
				var t;
				for (t = 0; t < allViews.length; t++) {
					if ( (allViews[t].title.substring(0,9) == "txt / XML") || // "txt / XML"   // "init & TeX"
						 (allViews[t].title.substring(0,10) == "init & TeX") ) {
						jEdit.closeView(allViews[t]);
					}
				}
				//
				// other (TXT, XML) files
				viewTXml = jEdit.newView(view, newEmpty, newVcfgB);
				viewTXml.setUserTitle("txt / XML");
				for (t = 0; t < txtxmls.length; t++) {
					jEdit.openFile(viewTXml, txtxmls[t]);
				}
				buffersB = viewTXml.getBuffers();
				for (t = 0; t < buffersB.length; t++) {
					// focus is set on _V1.txt
					mtchVtxt = ptnVtxt.matcher(buffersB[t].getName());
					if (mtchVtxt.find()) {
						viewTXml.goToBuffer(buffersB[t]);
					}
				}
			}
			//
			labelItemId.setText(getItemName(_itemFolderName));
			buttonCloseFiles.setEnabled(true);
			markButtonCloseFiles = true;
		}
		// }}}
		
		//{{{ //~~~ buttonOrigFiles.addActionListener
		buttonOrigFiles.addActionListener(
			// buttonOrigFiles has to unzip files of 
			// ...\aescte4647\S100\_S1270963817321466-20180702_091021_S100.zip
			// into temporary subfolder 
			// ...\aescte4647\S100\_S100\
			// and then open all PDF files in it
			function() {
				//var cll = [];     // command line list
				var reS100zip = "(.*\\\\S100)(.*?)(_S100\.zip)$"; 
				var ptnS100zip = Pattern.compile(reS100zip, Pattern.DOTALL);
				var mtchS100zip;
				//
				var pathString = textFieldPathToItem.getText();
				pathString = pathString + "\\S100";
				var argFileS100 =  new File(pathString);
				var s100EntriesHashArray = [];
				arrayDirectoryContents(argFileS100, s100EntriesHashArray);
				var j;
				var thh;
				var thhs;
				var tempDir;
				for (j = 0; j < s100EntriesHashArray.length; j++) {
					thh = s100EntriesHashArray[j];
					// thh.name is java.io.File, not String
					thhs = thh.name.toString();
					mtchS100zip = ptnS100zip.matcher(thhs);
					if (mtchS100zip.find()) {
						tempDir = mtchS100zip.group(1) + "\\_S100";
						extractArchiveSevenZ(thhs, tempDir);
					}
				}
				// List of PDF files in the subfolder ...\_S100
				var argTempDir =  new File(tempDir);
				var entriesTempDir = [];
				arrayDirectoryContents(argTempDir, entriesTempDir);
				var pdfsS100 = [];
				for (j = 0; j < entriesTempDir.length; j++) {
					thh = entriesTempDir[j];
					// thh.name is java.io.File, not String
					thhs = thh.name.toString();
					if (thhs.substr(-4) == ".pdf") {
						pdfsS100.push(thhs);
					}
				}
				// Now trying to open S100 PDF files
				viewPDFFilesAdobeReader(pdfsS100);
		});
		// }}}	

		//{{{ //~~~ buttonCloseFiles.addActionListener
		buttonCloseFiles.addActionListener(
			function() {
				buttonCloseFilesFunction();
			}
		);
		
		function buttonCloseFilesFunction() {
			/**
			https://stackoverflow.com/questions/5085491/closing-an-instance-of-acrobat-reader-from-command-line#
			You cannot close the last open Acrobat window through the command line. From ancient history of
			programming scripts for Acrobat, I believe that there is no way to do this in an Acrobat script,
			either.
			Ctrl+Q in the PDF viewer window;
			*/
			/**
			https://stackoverflow.com/questions/6356340/killing-a-process-using-java
			what about
			Runtime.getRuntime().exec("taskkill /F /IM <processname>.exe")
			?
			https://www.reddit.com/r/techsupport/comments/2p60b5/cant_run_the_taskkill_command_on_a_batch_file/
			*/
			var Run = Java.type("java.lang.Runnable");
			var RunClosing = Java.extend(Run, {
					run: function() {
						var alst = [];
						alst.push("cmd.exe");
						alst.push("/C");
						alst.push(_taskkill);
						alst.push("/F");
						alst.push("/IM");
						//alst.push(_adobeReader);
						alst.push("AcroRd32.exe");  // THIS works!
						runExternalApp(alst, true);
					}
			});
			var ThreadClosing = Java.type("java.lang.Thread");
			var thClosing = new ThreadClosing(new RunClosing());
			try {
				thClosing.start();
				thClosing.join();  // Waits for this thread to die.
			} catch (exception) {
				alert(exception);
			}
			//
			var allViews = jEdit.getViews();
			var t;
			for (t = 0; t < allViews.length; t++) {
				if ( (allViews[t].title.substring(0,5) == "txt /") || // "txt / XML"   // "init & TeX"
					 (allViews[t].title.substring(0,6) == "init &") ) {
					jEdit.closeView(allViews[t]);
				}
			}
			var allBuffers = jEdit.getBuffers();
			for (t = 0; t < allBuffers.length; t++) {
				if (allBuffers[t].getName().substring(0,7) != "starter") {
					jEdit.closeBuffer(view, allBuffers[t]);
				}
			}
			buttonCloseFiles.setEnabled(false);
			markButtonCloseFiles = false;
			textFieldNotes.setText("");
		}
		//}}}
		
		// Tooltips
		buttonOrigFiles.setToolTipText("Opens orig. PDF files from the item's ZIP ..._S100.zip.");
		//
		return paneHelperOuter;
	}
	
	function createPaneQcFiles()
	{
		// To make "paneQcFiles" somehow stable in size, it is put onto another JPanel
		// with the desirable or "default" layout.
		var paneQcFilesOuter = new JPanel();
		var paneQcFiles = new JPanel();
		paneQcFilesOuter.add(paneQcFiles);
		// components:
		var labelSourceFolder = new JLabel("Source Folder ");
		var textFieldSourceFolder = new JTextField(25);
		var buttonSourceFolder = new JButton("Choose Source"); 
		
		var labelMasterFolder = new JLabel("Master Folder ");
		var textFieldMasterFolder = new JTextField(25);
		var buttonMasterFolder = new JButton("Choose Master"); 
		
		var buttonCopyItems = new JButton("Copy Item Files");
		var textFieldCopyItems = new JTextField(10);
		
		var buttonExtractBz2 = new JButton("Extract bz2 (global)");
		var textFieldBz2Done = new JTextField(10);
		
		var extractBz2Color = new Color(0x00f1ea)  // 0x00f1ea
		buttonExtractBz2.setBackground(extractBz2Color);
		textFieldBz2Done.setBackground(extractBz2Color);
		
		var labelExcel = new JLabel("Excel QC List");
		var buttonChooseExcel = new JButton("Choose Excel");
		labelExcel.setOpaque(true);
		labelExcel.setBackground(excelColor);
		buttonChooseExcel.setBackground(excelColor);
		
		// List of all source items complete paths:
		var itemsCompletePaths;
		// List of all source (short) items names:
		var itemsShortNames = [];
		
		//{{{ ~~~ GridBagLayout  in createPaneQcFiles
		var gbl = new GridBagLayout();
		var gbc = new GridBagConstraints();
		gbc.fill = GridBagConstraints.HORIZONTAL;
		paneQcFiles.setLayout(gbl);
		// ===
		// (0, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 0;
		paneQcFiles.add(labelSourceFolder, gbc);
		// (0, 1) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 0;
		paneQcFiles.add(textFieldSourceFolder, gbc);
		// (0, 2) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 0;
		paneQcFiles.add(buttonSourceFolder, gbc);
		// ===
		// (1, 0) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 1;
		paneQcFiles.add(labelMasterFolder, gbc);
		// (1, 1) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 1;
		paneQcFiles.add(textFieldMasterFolder, gbc);
		// (1, 2) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 1;
		paneQcFiles.add(buttonMasterFolder, gbc);
		// ===
		// (2, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 2;
		paneQcFiles.add(labelExcel, gbc);
		// (2, 1) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 2;
		paneQcFiles.add(textFieldExcelFile, gbc);
		// (2, 2) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 2;
		paneQcFiles.add(buttonChooseExcel, gbc);
		// ===
		// (3, 1) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 3;
		paneQcFiles.add(buttonExtractBz2, gbc);
		// (3, 2) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 3;
		paneQcFiles.add(textFieldBz2Done, gbc);
		// ===
		// (4, 1) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 4;
		paneQcFiles.add(buttonCopyItems, gbc);
		// (4, 2) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 4;
		paneQcFiles.add(textFieldCopyItems, gbc);
		
		//}}}
		
		// Listeners
		//{{{ //~~~ buttonMasterFolder.addActionListener
		buttonMasterFolder.addActionListener(
			function () {
				var startLocation = "D:"; 
				var dialogTitle = "Choose Master Folder";
				var pathMf = dialogChooseFolder(startLocation, dialogTitle);
				if (pathMf != "") {
					textFieldMasterFolder.setText(pathMf);
					nameMasterFolder = pathMf;
					masterFolderItemsList = (new File(nameMasterFolder)).listFiles();
					textFieldItemPosition.setText("");
					isMasterFolderChosen = true;
				}
		});
		//}}}
		
		//{{{ //~~~ buttonSourceFolder.addActionListener
		buttonSourceFolder.addActionListener(
			function () {
				var startLocation = "D:"; 
				var dialogTitle = "Choose Source Folder";
				var pathSf = dialogChooseFolder(startLocation, dialogTitle);
				var pp;
				if (pathSf != "") {
					textFieldSourceFolder.setText(pathSf);
					nameSourceFolder = pathSf;
					itemsCompletePaths = (new File(nameSourceFolder)).listFiles();
				}
		});
		//}}}
		
		//{{{ //~~~ buttonCopyItems.addActionListener
		buttonCopyItems.addActionListener(
			function() {
				if (!isMasterFolderChosen) {
					alert("Master Folder (QC Files) is not chosen.");
					return;
				}
				if (!isExcelChosen) {
					alert("Excel QC List (QC Files) is not chosen.");
					return;
				}
					
				var exObj;
				var nameExcel;
				var p;
				var counter = 1;
				var masterFolder = textFieldMasterFolder.getText() + "\\";
				for (p = 0; p < itemsCompletePaths.length; p++) {
					itemsShortNames[p] = getItemName(itemsCompletePaths[p].toString());
				}
				try {
					nameExcel = textFieldExcelFile.getText();
					exObj = new ExcelObj(nameExcel);
					exObj.getSpreadsheet();
					for (p = 0; p < itemsShortNames.length; p++) {
						exObj.getItemRow(itemsShortNames[p]);
						if (exObj.itemInExcel) {
							copyDirectoryApache(itemsCompletePaths[p].toString(),
								masterFolder + itemsShortNames[p]);
							exObj.itemInExcel = false;
							counter = counter + 1;
						} else {
							//println("NOT FOUND " + itemsShortNames[p]);
						}
					}
					textFieldCopyItems.setText(counter - 1);
					alert("Excel QC List should be opened anew. Close starter macro!");
				} catch (exp) {
					println(exp);
				}
		});
		//}}}
		
		//{{{ //~~~ buttonExtractBz2.addActionListener
		buttonExtractBz2.addActionListener(
			// extract all *bz2 arxhives
			function () {
				var reBz2 = "(.*)\\\\(.*?)(\.bz2)$";  // directory - filename - .bz2
				var ptnBz2 = Pattern.compile(reBz2, Pattern.DOTALL);
				var mtchBz2;
				var pathString = textFieldMasterFolder.getText();
				var argFile =  new File(pathString)
				var entriesHashArray = [];
				//
				arrayDirectoryContents(argFile, entriesHashArray);
				//
				var j;
				var thh;
				var thhs;
				var tdir;
				var length = entriesHashArray.length;
				var counter = 0;
				if (length > 0) {
					for (j = 0; j < length; j++) {
						thh = entriesHashArray[j];
						// thh.name is java.io.File, not String
						thhs = thh.name.toString();
						mtchBz2 = ptnBz2.matcher(thhs);
						if (mtchBz2.find()) {
							tdir = mtchBz2.group(1);
							extractArchiveSevenZ(thhs, tdir);
							counter++;
						}
					}
					textFieldBz2Done.setText("Done: " + length + "/" + counter);
				}
				else {
					alert("No .bz2 files found in \"master folder\".");
				}
		});
		//}}}
		
		//{{{ //~~~ buttonChooseExcel.addActionListener
		buttonChooseExcel.addActionListener(
			function () {
				if (!isMasterFolderChosen) {
					alert("Master Folder (QC Files) is not chosen.");
					return;
				}
				var startLocationExcel = "D:"; //\\_vtex-els--sqc";
				var dialogTitleExcel = "Choose Excel QC List";
				var chooserExcel = new JFileChooser(startLocationExcel);
				var filterExcel = new FileNameExtensionFilter("Excel files", "xlsx", "XLSX", "xls", "XLS");  // type: FileFilter
				var pathExcel;
				chooserExcel.setDialogTitle(dialogTitleExcel);
				chooserExcel.setFileSelectionMode(JFileChooser.FILES_ONLY);
				chooserExcel.setFileFilter(filterExcel);
				chooserExcel.setPreferredSize(new Dimension(380, 660));
				var returnValueExcel = chooserExcel.showOpenDialog(null);
				if (returnValueExcel == JFileChooser.APPROVE_OPTION) {
					pathExcel = chooserExcel.getSelectedFile().getAbsolutePath();
					textFieldExcelFile.setText(pathExcel);
					isExcelChosen = true;
				}
		});
		//}}}
		
		
		// Tooltips
		buttonExtractBz2.setToolTipText("Extracts *.bz2 archives in \"Master folder\" and subfolders.");
		buttonCopyItems.setToolTipText("Based on Excel file, copies item files from \"Source folder\" to \"Master folder\".");
		
		return paneQcFilesOuter;
	}
	
	
	function createPaneAbout()
	{
		var aboutString = "=STARTER :: JS :: 2019-11-25=" 
		aboutString = aboutString + "\nLatest changes:"; 
		aboutString = aboutString + "\n2019.11.25: Pane 'QC Tools', minor change.";
		aboutString = aboutString + "\n2019.11.07-11: Pane 'QC Files' added.";
		aboutString = aboutString + "\n2019.11.05: Excel file is in work.";
		aboutString = aboutString + "\n2019.09.29-30: Button 'Next'.";
		aboutString = aboutString + "\nEarly history: 2017.01.03-2018.09.10; 2018.11.23";
		var aboutArea = new JTextArea();
		var aboutPane = new JPanel();
		//aboutPane.setSize(600, 400); // width, height
		//aboutArea.setBounds(0, 0, 20, 20); 
		aboutArea.setWrapStyleWord(true);
		aboutArea.append(aboutString);
		var scrollPane = new JScrollPane(aboutArea);
		//scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED); // default
		//scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);  // default
		scrollPane.setPreferredSize(new Dimension(200, 100));
		aboutPane.add(scrollPane);
		return scrollPane; 
	}
	
	// ===== FUNCTIONS =====
	//{{{ //~~~ function dialogChooseFolder
	function dialogChooseFolder(start, title) {
		var chooser = new JFileChooser(start);
		var path = "";
		chooser.setDialogTitle(title);
		chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		chooser.setPreferredSize(new Dimension(380, 660));
		var returnValue = chooser.showOpenDialog(null);
		if (returnValue == JFileChooser.APPROVE_OPTION) {
			path = chooser.getSelectedFile().getAbsolutePath();
		}
		return path;
	}
	//}}}

	//{{{ //~~~ function splitItemName
	function splitItemName(str) {
		// Splits the item name into JID and AID.
		var reSplit = "\\A((CRASS1)|(.+?))(\\d+)\\Z";
		var ptnSplit = Pattern.compile(reSplit, Pattern.CASE_INSENSITIVE);
		var mtch;
		var data = {jid: "error", aid: "000"};
		mtch = ptnSplit.matcher(str);
		if (mtch.find()) {
			data.jid = mtch.group(1); 
			data.aid = mtch.group(4);
		} 
		return data;
	}
	//}}}
		
	//{{{ //~~~ constructor function ExcelObj(excelFname)
	function ExcelObj(excelFname) {
		this.excelFname = excelFname;
		this.excelFile;
		this.workbook;
		this.spreadsheet;
		this.dataFormatter = new DataFormatter();
		this.rowCount = 0;
		this.itemRow; 
		this.itemCellInRow;
		this.itemInExcel = false;
		this.getSpreadsheet = function() {
			/* https://poi.apache.org/apidocs/4.1/ */
			/* https://poi.apache.org/components/spreadsheet/quick-guide.html */
			try {
				this.excelFile = new File(this.excelFname);
				ZipSecureFile.setMinInflateRatio(0.001);
				// zipSecureFile.setMinInflateRatio(0.2); 
				// java.io.IOException: Zip bomb detected!
				// Uncompressed size: 143475, Raw/compressed size: 1430, ratio: 0.009967
				// Limits: MIN_INFLATE_RATIO: 0.010000, Entry: xl/pivotCache/pivotCacheRecords1.xml 
				var fis = new FileInputStream(this.excelFile);
				this.workbook = new XSSFWorkbook(fis);
				////workbook.setMissingCellPolicy(Row.CREATE_NULL_AS_BLANK);
				//alert(this.workbook.getMissingCellPolicy());
				///var mcp = new MissingCellPolicy(Row.CREATE_NULL_AS_BLANK);
				//workbook.setMissingCellPolicy(UmRow.CREATE_NULL_AS_BLANK);  //(Row.MissingCellPolicy missingCellPolicy)
				//Sets the policy on what to do when getting missing or blank cells from a row.
				this.spreadsheet = this.workbook.getSheetAt(0);
				this.rowCount = this.spreadsheet.getLastRowNum();
			} catch (exceptiona) {
				print(exceptiona);
			}
		}
		this.testSpreadsheet = function() {
			// testing how rows/cells are accessed
			var rowCount = this.rowCount;
			var rowCurrent = this.spreadsheet.getRow(0);  // type: XSSFRow;
			var cellCount = rowCurrent.getLastCellNum();
			// https://www.callicoder.com/java-read-excel-file-apache-poi/
			var row;
			var cell;
			var rowPosition = 0;
			var cellPosition = 0;
			var ri;
			var ci;
			for (ri = 0; ri <= rowCount; ri++) {
				row = this.spreadsheet.getRow(ri);
				cellCount = row.getLastCellNum(); 
				//Gets the index of the last cell contained in this row PLUS ONE.
				for (ci = 0; ci < cellCount; ci++) {
					///cell = row.getCell(ci, Row.MissingCellPolicy policy)
					//Returns the cell at the given (0 based) index, with the specified Row.MissingCellPolicy
					cell = row.getCell(ci);
					//Returns the cell at the given (0 based) index, with the Row.MissingCellPolicy from the parent Workbook.
					if ((ri < 3) || (ri > 148)) {
						println("row: " + ri + 
								", cell: " + ci + "  value: " 
								+ this.dataFormatter.formatCellValue(cell));
					}
				}
			}
		}
		this.getItemRow = function(itemId) {
			var itemData = splitItemName(itemId);
			var jidFound = false;
			var cellValue;
			var runOn = true;
			for (ri = 0; (ri <= this.rowCount) && runOn; ri++) {
				row = this.spreadsheet.getRow(ri);
				cellCount = row.getLastCellNum(); 
				//Gets the index of the last cell contained in this row PLUS ONE.
				for (ci = 0; (ci < cellCount) && runOn; ci++) {
					cell = row.getCell(ci);
					cellValue = this.dataFormatter.formatCellValue(cell);
					if (cellValue == itemData.jid) {
						jidFound = true;
					}
					if (jidFound && (cellValue == itemData.aid)) {
						this.itemRow = ri;
						this.itemCellInRow = ci;
						this.itemInExcel = true;
						runOn = false;
					}
				}
			}
		}
		this.getPageType = function() {
			return this.spreadsheet.getRow(this.itemRow).getCell(13);
		}
		this.acceptPageNumber = function(numb) {
			var numint = Integer.valueOf(numb);
			var targetRow = this.spreadsheet.getRow(this.itemRow);
			var targetCell = targetRow.getCell(10);
			if (targetCell == null) {
				targetCell = targetRow.createCell(10);
			}
			targetCell.setCellValue(numint);
		}
		this.writeToFile = function() {
			var fileOut = new FileOutputStream(this.excelFile);
			this.workbook.write(fileOut);
			fileOut.close();
		}
	}
	//}}}
	
	//{{{ //~~~ function extractArchiveSevenZ
	function extractArchiveSevenZ(archivePath, tmpDir) {
		// Function for code reuse.	
		// https://stackoverflow.com/questions/31460643/how-do-i-unzip-all-files-in-a-folder-using-7-zip-in-batch
		var cll = [];
		cll.push(_sevenz);
		cll.push("x");
		cll.push(archivePath);
		cll.push("-aoa");
		cll.push("-o" + tmpDir);
		runExternalApp(cll, true);
		// "x" -- eXtract files with full paths
		// "-o" --  -o{Directory} : set Output directory
		// "-aoa" -- Overwrite All existing files without prompt
	}
	//}}}	
	
	//{{{	//~~~ runExternalApp
	function runExternalApp(commandLineList, exitMsg) {
		/*
		https://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html
		There are four overloaded versions of the _rt.exec() command:
		<...>
		For each of these methods, a command -- and possibly a set of arguments --
		is passed to an operating-system-specific function call. This subsequently
		creates an operating-system-specific process (a running program) with
		a reference to a Process class returned to the Java VM. The Process class
		is an abstract class, because a specific subclass of Process exists
		for each operating system.
		*/
		// if exitMsg ...
		try {
			processExternal = _rt.exec( commandLineList );
			//println("1. processExternal: " + processExternal);
			processExternal.waitFor();
			var exitVal = processExternal.waitFor();
			//alert(exitVal);
			if (exitVal == 0) {
				//println("Successfully executed the command");
			}
			else {
				if (exitMsg) {
					println("Failed to execute: " + commandLineList);
				}
				try {
					var br = new BufferedReader(new InputStreamReader(processExternal.getErrorStream()));
					var line;
					if ((line = br.readLine()) != null) {
						println(line);
					}
				} catch (eexcp) {
					eexcp.printStackTrace();
				}
			}
		} catch (exception) {
			alert(exception);
		}
	}
	// }}}

	//{{{	//~~~ arrayDirectoryContents
	function arrayDirectoryContents(argFile, argFileArray) {
		// http://www.avajava.com/tutorials/lessons/how-do-i-recursively-display-all-files-and-directories-in-a-directory.html
		// recursively collect data on all files and directories in a directory
		var fileArr = Java.type ("java.util.ArrayList");
		var entriesArray = new fileArr();
		//
		try {
			entriesArray = argFile.listFiles();
			var i;
			var th;
			for (i = 0; i < entriesArray.length; i++) {
				if (entriesArray[i].isDirectory()) {
					th = {type: "d-ry", name: entriesArray[i]}; // directory
				}
				else {
					th = {type: "file", name: entriesArray[i]};
				}
				argFileArray.push(th);
				if (entriesArray[i].isDirectory()) {
					arrayDirectoryContents(entriesArray[i], argFileArray);
				}
			}
		} catch (exception) {
			print(exception);
			alert("excp: " + exception);
		}
	}
	// }}}
	
	//{{{	//~~~ getItemName
	function getItemName(folderPath) {
		var reLastSlash = "(.+\\\\)([^\\\\]+)";
		var ptnLastSlash = Pattern.compile(reLastSlash, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
		var mtchLastSlash;
		var itemName;
		mtchLastSlash = ptnLastSlash.matcher(folderPath);
		if (mtchLastSlash.find()) {
			itemName = mtchLastSlash.group(2).toUpperCase();
		}
		else {
			itemName = "ITEM9999";
		}
		return itemName;
	}
	//}}}
	
	//{{{	//~~~ copyItemDirectory
	function copyDirectoryApache(source, destin) {
		// https://kodejava.org/how-do-i-copy-directory-with-all-its-contents-to-another-directory/
		var srcDir = new File(source);
		var destDir = new File(destin);
		try {
			// Copy source directory into destination directory
			// including its child directories and files. When
			// the destination directory is not exists it will
			// be created. This copy process also preserve the
			// date information of the file.
			FileUtilsApache.copyDirectory(srcDir, destDir);
		} catch (exp) {
			exp.printStackTrace();
		}
	}
	//}}}
		
	
	// === Conveniency name for the main panel function of the script:
	// ===
	function panelMain()
	{
		var panelForTabbedPane = new JPanel();
		// for plugin, the overall panel must be just JPanel
		var tabPaneMain = new JTabbedPane();
		//tabPane.setTabPlacement(TOP); // nutylima
		// ...,tabPlacement=TOP]
		var pnArticleData = createPaneArticleData();
		tabPaneMain.addTab("Article Data", pnArticleData);
		//
		var pnQcTool = createPaneQcTool();
		tabPaneMain.addTab("QC Tool", pnQcTool);
		//
		var pnQcFiles = createPaneQcFiles();
		tabPaneMain.addTab("QC Files", pnQcFiles);
		//
		var pnAbout = createPaneAbout();
		tabPaneMain.addTab("About", pnAbout);

		tabPaneMain.setSelectedComponent(pnQcTool);
		panelForTabbedPane.add(tabPaneMain);
		return panelForTabbedPane;
	}

	// === makeMacroFrame
	// ===
	
	function makeMacroFrame() {
		var macroFrame = new JFrame("=STARTER :: JS :: 2019-11-11=");
		var panelM = panelMain();
		// dimensions are chosen for 1280x720 by trial:
		// panelM.setPreferredSize(new Dimension(550, 293));
		// panelM.setMaximumSize(new Dimension(550, 293));
		// panelM.setMinimumSize(new Dimension(550, 293));
			
		macroFrame.getContentPane().add(panelM); 
			//, _BorderLayout.CENTER);
			// frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE)
			// In this way, closing this frame, jEdit is not closed:
			//frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
			//frame.setDefaultCloseOperation(2);
			// 2 corresponds DISPOSE_ON_CLOSE, see
			// http://docs.oracle.com/javase/7/docs/api/constant-values.html#javax.swing.WindowConstants.DISPOSE_ON_CLOSE
		macroFrame.pack();
		//alert(macroFrame.getContentPane().getSize());
		macroFrame.setVisible(true);
		// http://stackoverflow.com/questions/297938/always-on-top-windows-with-java
		// Sets the window to be "always on top"
		macroFrame.setAlwaysOnTop(true);
		// Position the frame:
		var ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
		var defaultScreen = ge.getDefaultScreenDevice();
		var rect = defaultScreen.getDefaultConfiguration().getBounds();
		var frameWidth = macroFrame.getWidth();
		var x = rect.getMaxX() - frameWidth;
		var y = 0;
		macroFrame.setLocation(x, y);
		return null;
	}
	
	//makeMacroFrame();

}



/* :folding=explicit:collapseFolds=1:tabSize=4:indentSize=4:noTabs=false: */

