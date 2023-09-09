// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const request = require("request");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "synonym-antonym-finder" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  function caller(type) {
	// The code you place here will be executed every time your command is executed

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
	  vscode.window.showInformationMessage("editor not found");
	  return;
	}
	const text = editor.document.getText(editor.selection);
	if (text) {
	  vscode.window.showInformationMessage(`your selected text is ${text}`);
	}
	var word = text;
	var response;
	request.get(
	  {
		url: "https://api.api-ninjas.com/v1/thesaurus?word=" + word,
		headers: {
		  "X-Api-Key": process.env.KEY,
		},
	  },
	async function (error, response, body) {
		if (error) return console.error("Request failed:", error);
		else if (response.statusCode != 200)
		  return console.error(
			"Error:",
			response.statusCode,
			body.toString("utf8")
		  );
		else	{
		  response =await JSON.parse(body);
		  console.log(response.synonyms);
		  const quickPick = vscode.window.createQuickPick();
		  var res;
		  if (type=="antonym") {
				res = response.antonyms;
			
		  }
		  else{
			res = response.synonyms;5
		  }
		  quickPick.items = res.map((synonym) => ({label: synonym}));
		  quickPick.onDidChangeSelection(([selection]) => {
			  if (selection) {
				  vscode.window.showInformationMessage(`You selected ${selection.label}`);
				  editor.edit(edit=>{
					  edit.replace(editor.selection,selection.label);
				  })
				  quickPick.dispose();
			  }});
		  quickPick.onDidHide(() => quickPick.dispose());
		  quickPick.show();
	  }
		}
		  
	);
	
   

  }
  let disposable = vscode.commands.registerCommand(
    "synonym-finder.find_synonym",()=>caller("synonym"));
  let disposable2 = vscode.commands.registerCommand(
    "antonym-finder.find_antonym",()=>caller("antonym")
   
  );

  context.subscriptions.push(disposable,disposable2);
 
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
