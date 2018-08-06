// Nashorn-JS script: a macro to launch the Perl script articledata.pl.
// Work started: 2017-01-03

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
	// OTHER
	java.io,
	java.io.BufferedReader,
	java.io.InputStreamReader,
	java.lang,
	java.util,
	org.gjt.sp.jedit.jEdit
	);

with (javaImports) {

	// ===
	// Data for script articledata.pl
	var _perl = "d:\\bin\\perl\\bin\\perl.exe";
	var _script = "d:\\works\\articledata\\articledata.pl";
	var _outputTempDir = "d:\\works\\articledata\\temp\\";

	//
	var _rt = Runtime.getRuntime();
	var _jEdit = Java.type('org.gjt.sp.jedit.jEdit');
	var _view = _jEdit.getActiveView();

	function createComponents()
	{
		var tabPaneMain = new JTabbedPane();
		//tabPane.setTabPlacement(TOP); // default
		// ...,tabPlacement=TOP]
		// the script's articledata.pl starter is placed onto a tabbed pane.
		var paneArticleDataOuter = new JPanel();
		tabPaneMain.addTab("Article Data", paneArticleDataOuter);
		// To make "paneArticleData" somehow stable in size, it is put onto another JPanel
		// with the desirable or "default" layout.
		var paneArticleData = new JPanel();
		paneArticleDataOuter.add(paneArticleData);
		//
		
		// === Here are the components of the tab "Article Data": ===
		var sourceList =  ["article", "order"];
		var requestList = ["fmt_all", "fmt", "refersto"];
		var markupList =  ["default", "bibtags"];

		var labelSourceType = new JLabel("Source Type ");
		var labelSourceFile = new JLabel("Source File");
		var labelOutputFile = new JLabel("Output File");
		textFieldSourceFile = new JTextField(25);
		textFieldOutputFile = new JTextField(25);
		//
		textFieldSourceFile.setText("");
		textFieldOutputFile.setText("");
		//
		comboSource = new JComboBox(sourceList);
		var labelRequest = new JLabel("request");
		comboRequest = new JComboBox(requestList);
		var labelMarkup = new JLabel("markup");
		comboMarkup = new JComboBox(markupList);
		var buttonBrowseSource = new JButton("Browse Source");
		var buttonBrowseOutput = new JButton("Browse Output");
		var buttonClear = new JButton("Clear");
		var buttonRun = new JButton("Run");
		var buttonHelp = new JButton("Help");
		
		var buttonRunBackgroundColor = new Color(153, 202, 133) // RGB
		buttonRun.setBackground(buttonRunBackgroundColor);
		//buttonRun.setBackground(Color.green);

		// === GridBagLayout
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
		
		// Listeners: 
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
		//
		buttonBrowseOutput.addActionListener(function ()
			{
				// https://community.oracle.com/thread/1359948:
				// starts file browsing from "My Computer"
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
		//
		buttonClear.addActionListener(function ()
			{
				textFieldSourceFile.setText("");
				textFieldOutputFile.setText("");
			});
		//
		// === button "Run"
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
		
		//
		// Tooltips
		labelSourceFile.setToolTipText("[default]: File in the active buffer");
		labelOutputFile.setToolTipText("[default]: File in some TEMP; opens in a new buffer");
		buttonClear.setToolTipText("Sets fields \"Source File\" and \"Output File\" to [default]");
		buttonHelp.setToolTipText("To Be Done :)");
		buttonRun.setToolTipText("Runs script");
		
		// =====================
		
		var paneNext = new JPanel();
		var labelNext = new JLabel("This is a pane for other starter");
		tabPaneMain.addTab("[Any script]", paneNext);
		paneNext.add(labelNext);
		
		// ===============
		
		return tabPaneMain;
	}

	var frame = new JFrame("STARTER :: Any script starter :: 2017-01-03");
	frame.setSize(600, 400);

	// === createComponents()
	frame.getContentPane().add(createComponents()); //, _BorderLayout.CENTER);
		// frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE)
		// In this way, closing the program (script) window, jEdit's window does not close:
		//frame.setDefaultCloseOperation(_.WindowConstants.DISPOSE_ON_CLOSE);
	//frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
		//frame.setDefaultCloseOperation(2);
		// 2 corresponds DISPOSE_ON_CLOSE, see
		// http://docs.oracle.com/javase/7/docs/api/constant-values.html#javax.swing.WindowConstants.DISPOSE_ON_CLOSE
	frame.pack();
	frame.setVisible(true);

}

