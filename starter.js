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
	javax.swing.JComboBox,
	javax.swing.JFileChooser,
	javax.swing.WindowConstants,
	//
	javax.swing.filechooser.FileSystemView,
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
	//java.util,
	java.util.regex,
	java.io.File,
	//java.io.IOException,
	java.nio.file.FileSystems,
	java.nio.file.Path,
	//
	org.gjt.sp.jedit.jEdit,
	org.gjt.sp.jedit.View.ViewConfig

	);

with (javaImports) {

	// ==================================================================
	var macroFrame = new JFrame("STARTER :: Developed :: 2017.01.03-2018.09.10");
	var _frame_Width = 600;
	var _frame_Height = 400;
	macroFrame.setSize(_frame_Width, _frame_Height);
	var ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
	var defaultScreen = ge.getDefaultScreenDevice();
	var rect = defaultScreen.getDefaultConfiguration().getBounds();
	var x = rect.getMaxX() - _frame_Width;
	var y = 0;
	macroFrame.setLocation(x, y);

	// http://stackoverflow.com/questions/297938/always-on-top-windows-with-java
	// Sets the window to be "always on top"
	macroFrame.setAlwaysOnTop(true);
	
	//
	//var _jEdit = Java.type('org.gjt.sp.jedit.jEdit');
	//var _view = _jEdit.getActiveView();
	// ===
	var JPanel = Java.type("javax.swing.JPanel");
	var JLabel = Java.type("javax.swing.JLabel");
	var JButton = Java.type("javax.swing.JButton");
	var JTextField = Java.type("javax.swing.JTextField");
	var JComboBox = Java.type("javax.swing.JComboBox");
	var JFileChooser = Java.type("javax.swing.JFileChooser");
	var Dimension = Java.type("java.awt.Dimension");
	var FileSystems = Java.type("java.nio.file.FileSystems");
	var Color = Java.type("java.awt.Color");
	var Pattern = Java.type("java.util.regex.Pattern");
	var GridBagLayout = Java.type("java.awt.GridBagLayout");
	var GridBagConstraints = Java.type("java.awt.GridBagConstraints");

	var File = Java.type("java.io.File");
	var Toolkit = Java.type("java.awt.Toolkit");
	// ===
	var _rt = Runtime.getRuntime();
	//
	var Thread = Java.type("java.lang.Thread");
	var Runnable = Java.type('java.lang.Runnable');
	//
	// Data for script articledata.pl
	var _perl = "d:\\bin\\perl\\bin\\perl.exe";
	var _script = "d:\\works\\articledata\\articledata.pl";
	var _outputTempDir = "d:\\works\\articledata\\temp\\";
	// SQC Helper:
	var _sevenz = "C:\\PROGRA~1\\7-Zip\\7z.exe";
	var _sevenz_command = "x";             // eXtract files with full paths
	var _sevenz_switch_dir = "-o";         // -o{Directory} : set Output directory
	var _sevenz_switch_overwrite = "-aoa"; // Overwrite All existing files without prompt
		// ================

	function createTabPaneMain()
	{
		var tabPaneMain = new JTabbedPane();
		//tabPane.setTabPlacement(TOP); // nutylima
		// ...,tabPlacement=TOP]
		var pnArticleData = createPaneArticleData();
		tabPaneMain.addTab("Article Data", pnArticleData);
		//
		var pnQcTool = createPaneQcTool();
		tabPaneMain.addTab("QC Tool", pnQcTool);

		tabPaneMain.setSelectedComponent(pnQcTool);

		return tabPaneMain;
	}

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

	//{{{ //~~~ GridBagLayout
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
					var selectedFile = chooserS.getSelectedFile();
					path = chooserS.getSelectedFile().getAbsolutePath();
					textFieldSourceFile.setText(path);
				}
			});
		//}}}
		//
	//{{{ //~~~ buttonBrowseOutput.addActionListener(
		buttonBrowseOutput.addActionListener(function ()
			{
				// https://community.oracle.com/thread/1359948:
				// starts file browsing with "My Computer"
				var fsv = FileSystemView.getFileSystemView();
				var roots = fsv.getRoots();
				var files = roots[0].listFiles();
				var start = files[0];
				//
				var chooserO = new JFileChooser(start);
				chooserO.setDialogTitle("Choose Output File");
				chooserO.setPreferredSize(new Dimension(380, 660));
				var returnValue = chooserO.showOpenDialog(null);
				if (returnValue == JFileChooser.APPROVE_OPTION) {
					var selectedFile = chooserO.getSelectedFile();
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

	function createPaneQcTool()
	{
		var jEdit = Java.type('org.gjt.sp.jedit.jEdit');
		var view = jEdit.getActiveView();

		// To make "paneArticleData" somehow stable in size, it is put onto another JPanel
		// with the desirable or "default" layout.
		var paneHelperOuter = new JPanel();
		var paneHelper = new JPanel();
		//
		paneHelperOuter.add(paneHelper);
		//
		var labelMasterFolder = new JLabel("Master folder ");
		var textFieldMasterFolder = new JTextField(25);
		textFieldMasterFolder.setText("");
		var buttonMasterFolder = new JButton("Browse Folder");
		//
		var labelPathToItem = new JLabel("Path to Item ");
		var textFieldPathToItem = new JTextField(25);
		textFieldPathToItem.setText("");
		var buttonBrowsePath = new JButton("Browse for item");
		//
		var labelItemId = new JLabel("ITEM9999 ");
		labelItemId.setToolTipText("Item in check or just checked");
		////var buttonOpenFiles = new JButton("Open Files For Check");
		////var buttonClear = new JButton("Clear");
		//
		var buttonCloseFiles = new JButton("Close Files");
		var buttonOrigFiles = new JButton("Open orig. PDFs");
		var buttonExtractBz2 = new JButton("Extract bz2 (global)");
		var textFieldIsDone = new JTextField(12);
		//
		var openFilesColor = new Color(0x99ff99)   // 0x00cc33 0x99ff99
		var closeFilesColor = new Color(0xff0000)  // 0xff0000
		var extractBz2Color = new Color(0x00f1ea)  // 0x00f1ea
		buttonBrowsePath.setBackground(openFilesColor);
		buttonCloseFiles.setBackground(closeFilesColor);
		buttonExtractBz2.setBackground(extractBz2Color);
		textFieldIsDone.setBackground(extractBz2Color);

		var nameMasterFolder = "D:\\_vtex-els--sqc\\__M-N-factors-2018";
		//"D:\\_vtex-els--sqc";
		var nameItemFolder;
		var processExternal;

		var tk = Toolkit.getDefaultToolkit();
		var scrDim = tk.getScreenSize();
		var scrWidth = scrDim.width;
		var scrHeight = scrDim.height;
		//screen dimensions = "1366x768";   // HPP @home
		//screen dimensions = "1680x1050";  // PHILIPS monitor @work
		var _host;
		// C:\Program Files\Adobe\Acrobat 7.0\Reader\AcroRd32.exe
		var _adobeReader;
		var adobeReaderHome = "C:/Program Files (x86)/Adobe/Acrobat Reader DC/Reader/AcroRd32.exe";
		var adobeReaderWork = "C:/Program Files/Adobe/Acrobat 7.0/Reader/AcroRd32.exe";
		var _taskkill;
		//
		var viewWidth;
		var viewHeight;
		if (scrWidth == 1366) {
			_host = "laptop";
			viewWidth = scrWidth - 80;  //view.x=79
			viewHeight = scrHeight;
			_adobeReader = adobeReaderHome;
			_taskkill = "C:/Windows/System32/taskkill.exe";
		} else {
			_host = "desktop";
			viewWidth = scrWidth; //1686;
			viewHeight = scrHeight - 30; //1020;
			_adobeReader = adobeReaderWork;
			_taskkill = "C:/Windows/SysWOW64/taskkill.exe";  // ??
		}
		// laptop: view.width=1288
		// laptop: view.height=767
		// laptop: view.y=0
		// laptop: view.x=79

		// --- jEdit views - buffers ---
		//var _view = _jEdit.getActiveView();
		var newVcfgA;
		var newVcfgB;
		var viewTeX;
		var viewTXml;
		//
		var vcfg = view.getViewConfig();
		var viewConfig = Java.type('org.gjt.sp.jedit.View.ViewConfig');
		if (_host == "desktop") {
			newVcfgA = new viewConfig(vcfg.plainView, vcfg.splitConfig,
				0, 0, viewWidth, viewHeight, vcfg.extState);
			newVcfgB = new viewConfig(vcfg.plainView, vcfg.splitConfig,
				200, 0, viewWidth - 200, viewHeight, vcfg.extState);
		}
		if (_host == "laptop") {
			newVcfgA = new viewConfig(vcfg.plainView, vcfg.splitConfig,
				80, 0, viewWidth, viewHeight, vcfg.extState);
			newVcfgB = new viewConfig(vcfg.plainView, vcfg.splitConfig,
				220, 0, viewWidth - 140, viewHeight, vcfg.extState);
		}

	//{{{ //~~~ GridBagLayout
		var gbl = new GridBagLayout();
		var gbc = new GridBagConstraints();
		gbc.fill = GridBagConstraints.HORIZONTAL;
		paneHelper.setLayout(gbl);
		// ===
		//(0, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 0;
		paneHelper.add(labelMasterFolder, gbc);
		//
		// (0, 1) position
		gbc.weightx = 0.5; //0.5
		gbc.gridx = 1;
		gbc.gridy = 0;
		paneHelper.add(textFieldMasterFolder, gbc);
		// (0, 2) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 0;
		//gbc.weighty = 1.0; // request any extra vertical space
		paneHelper.add(buttonMasterFolder, gbc);
		// ===
		//(1, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 1;
		paneHelper.add(labelPathToItem, gbc);
		//
		// (1, 1) position
		gbc.weightx = 0.5; //0.5
		gbc.gridx = 1;
		gbc.gridy = 1;
		paneHelper.add(textFieldPathToItem, gbc);
		// (1, 2) position;
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 1;
		//gbc.weighty = 1.0; // request any extra vertical space
		paneHelper.add(buttonBrowsePath, gbc);
		//
		//(2, 0) position
		gbc.weightx = 0.0; //0.5
		gbc.gridx = 0;
		gbc.gridy = 2;
		paneHelper.add(labelItemId, gbc);
		// (2, 1) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 2;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneHelper.add(buttonCloseFiles, gbc);
		// (2, 2) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 2;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneHelper.add(buttonOrigFiles, gbc);
		// ===
		// (3, 1) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 1;
		gbc.gridy = 3;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneHelper.add(buttonExtractBz2, gbc);
		// (3, 2) position
		gbc.weightx = 1.0; //0.5
		gbc.gridx = 2;
		gbc.gridy = 3;
		gbc.gridwidth = 1;
		//gbc.fill = GridBagConstraints.NONE;
		paneHelper.add(textFieldIsDone, gbc);
		// }}}

		// Listeners:
	//{{{ //~~~ buttonMasterFolder.addActionListener
		buttonMasterFolder.addActionListener(
			function () {
				//try {
				var startLocationMf = "D:"; //\\_vtex-els--sqc";
				var dialogTitleMf = "Choose Master Folder";
				var chooserMf = new JFileChooser(startLocationMf);
				var pathMf;
				chooserMf.setDialogTitle(dialogTitleMf);
				chooserMf.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
				chooserMf.setPreferredSize(new Dimension(380, 660));
				var returnValueMf = chooserMf.showOpenDialog(null);
				if (returnValueMf == JFileChooser.APPROVE_OPTION) {
					var selectedFileMf = chooserMf.getSelectedFile();
					pathMf = chooserMf.getSelectedFile().getAbsolutePath();
					textFieldMasterFolder.setText(pathMf);
					nameMasterFolder = pathMf;
				}
		});
		//}}}

	//{{{ //~~~ buttonBrowsePath.addActionListener
		buttonBrowsePath.addActionListener(
			function () {
				//try {
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
				chooserD.setPreferredSize(new Dimension(780, 640));
				var returnValueD = chooserD.showOpenDialog(null);
				if (returnValueD == JFileChooser.APPROVE_OPTION) {
					var selectedFileD = chooserD.getSelectedFile();
					pathD = chooserD.getSelectedFile().getAbsolutePath();
					textFieldPathToItem.setText(pathD);
					nameItemFolder = pathD;
					//
					openItemRelatedFiles(pathD);
				}
		});
		//}}}
		//
		
	//{{{ //~~~ extractArchiveSevenZ
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
 		}
 	// }}}	
	//{{{ //~~~ viewPDFFilesAdobeReader	
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
			var RunAdobe = Java.extend(Runn, {
					run: function() {
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

			//function () {
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
				alert("Both S200 and S250 found.");
			}
			if (resupplyFound) {
				alert("RESUPPLY found.");
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
					}}}}}}}}}
				}
				//
				var allViews = jEdit.getViews();
				var newEmpty = jEdit.newFile(view); // Buffer
				var t;
				for (t = 0; t < allViews.length; t++) {
					if ( (allViews[t].title == "txt / XML") ||
						 (allViews[t].title == "init & TeX") ) {
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
				// Now trying to open PDF files
				viewPDFFilesAdobeReader(pdfs);
			}
			else {
				alert("SkyLaTeX output files not found.");
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
					}}}}
				}
				//
				var allViews = jEdit.getViews();
				var newEmpty = jEdit.newFile(view); // Buffer
				var t;
				for (t = 0; t < allViews.length; t++) {
					if ( (allViews[t].title.substring(0,5) == "txt /") || // "txt / XML"   // "init & TeX"
						 (allViews[t].title.substring(0,6) == "init &") ) {
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
				// Now trying to open PDF files
				viewPDFFilesAdobeReader(pdfs);
			}
			//
			var reLastSlash = "(.+\\\\)([^\\\\]+)";
			var ptnLastSlash = Pattern.compile(reLastSlash, Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
			var mtchLastSlash;
			mtchLastSlash = ptnLastSlash.matcher(_itemFolderName);
			if (mtchLastSlash.find()) {
				labelItemId.setText(mtchLastSlash.group(2).toUpperCase());
			}
			else {
				labelItemId.setText("ITEM9999");
			}

		}

	//{{{	//~~~ buttonExtractBz2.addActionListener
		buttonExtractBz2.addActionListener(
			// extract all *bz2 arxhives
			function () {
				//var cll = [];     // command line list
				var reBz2 = "(.*)\\\\(.*?)(\.bz2)$";  // directory - filename - .bz2
				var ptnBz2 = Pattern.compile(reBz2, Pattern.DOTALL);
				var mtchBz2;
				//var pathString = textFieldPathToItem.getText();
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
					textFieldIsDone.setText("Done: " + length + "/" + counter);
				}
				else {
					alert("No files found in \"master folder\".");
				}
		});
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
		//
		
	//{{{ //~~~ buttonCloseFiles.addActionListener
		buttonCloseFiles.addActionListener(
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
			function() {
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
			}
		);
		// }}}
		
		// Tooltips
		buttonOrigFiles.setToolTipText("Opens orig. PDF files from the item's ZIP ..._S100.zip.");
		buttonExtractBz2.setToolTipText("Extracts *.bz2 archives in \"Master folder\" and subfolders.");
		//
		return paneHelperOuter;
	}

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
	// http://www.avajava.com/tutorials/lessons/how-do-i-recursively-display-all-files-and-directories-in-a-directory.html
	// recursively collect data on all files and directories in a directory
	function arrayDirectoryContents(argFile, argFileArray) {
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


	// ==================================================================
	// === createComponents()
	macroFrame.getContentPane().add(createTabPaneMain()); //, _BorderLayout.CENTER);
		// frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE)
		// Tokiu budu, uzdarant sios programos langa, jEdit neuzsidaro:
		//frame.setDefaultCloseOperation(_.WindowConstants.DISPOSE_ON_CLOSE);
	//frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
		//frame.setDefaultCloseOperation(2);
		// 2 corresponds DISPOSE_ON_CLOSE, see
		// http://docs.oracle.com/javase/7/docs/api/constant-values.html#javax.swing.WindowConstants.DISPOSE_ON_CLOSE
	macroFrame.pack();
	macroFrame.setVisible(true);

}



/* :folding=explicit:collapseFolds=1:tabSize=4:indentSize=4:noTabs=false: */

