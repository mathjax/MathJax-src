/********************************************************************/
/*
 *  This is the code run by the webworkers in the iframe.
 *  It can load content from the CDN since the iframe runs from there.
 *  You can add importScripts() commands at the top to preload libraries
 *  or a Task can run the "import" action to load libraries on the fly.
 *  
 *  The actions that can be run are listed in the Commands variable, and
 *  imported scripts can add to that object to make more commands available.
 *  If you want to pre-load libraries that add commands, they should be
 *  imported at the bottom of this file using importScripts().
 */

//
//  Add an event listener so that we can act on the commands from the Pool
//  We extract the command and data from the event, and look for the
//  command in the Commands object below.  If the command is defined,
//  we try to run the command, and if there is an error, we send it to
//  the calling Task.  If the command was not found in the list of valid
//  commands, we produce an error.
//  
self.addEventListener('message',function (event) {
  console.log('In Worker Listener');
  console.log(event);
  var cmd = event.data.cmd, post = event.data.post;
  console.log(cmd);
  console.log(event.data.data);
  if (Commands.hasOwnProperty(cmd)) {
    Post("Log","running "+cmd);
    try {
      data = (Commands[cmd])(event.data.data,post);
      console.log(data);
    } catch (err) {
      Task("error",copyError(err),post);
    }
  } else {
    Task("error",{message: "Invalid worker command: "+cmd},post);
  }
},false);

//
//  These are the commands that can be sent from the Tasks in the main window.
//  The commands are augmented by the libraries that are loaded via the import
//  command or by importScripts() calls added to this file, or by eval commands
//  that add to the list.
//  
var Commands = {
  //
  //  This is called when a Task is assigned to the worker.
  //     Clear the global data (removing any data from previous Tasks)
  //     Import any needed libraries
  //     Signal the Task that we are ready to go.
  //
  start: function(data,post) {
    global = {};
    Task("ready",null,post);
  },
  //
  //  This stops the task by signalling the Task that we are done
  //  (this also causes the Pool to free up the worker to be reused).
  //
  stop: function (data,post) {Task("done",data,post)},
  //
  //  This simply returns the data it was sent
  //  (for debugging, using the echo callback of the Task).
  //
  echo: function (data,post) {Task("echo",data,post)},
  //
  //  This loads one or more libraries
  //  (it signals completion by the imported callback).
  //
  import: function (data,post) {
    console.log(3);
    console.log(data);
    if (data?.imports) {
      Import(data.imports); // "http://localhost/sre/speech-rule-engine/lib/sre.js");
    }
  },
  speech: function(data, post) {
    console.log(2);
    console.log(data);
    if (data?.mml) {
      SRE.setupEngine({locale: 'en'}).then(() => {
        console.log(`Worker ${data.name}: ${SRE.toSpeech(data.mml)}`);
      });
    }
  }
  //
  //  This evaluates the data as a string of commands to perform.
  //  (These are run within the sandbox of this function, so variables
  //   and functions that it defines are not available outside this
  //   code.  But the "global" object is available for storing values
  //   that need to persist between eval commands.  One use of eval
  //   is to define new commands by adding them to the Commands variable.
  //   It is also possible to run the Task() command to send messages to
  //   the associated Task().)
  //
  // eval: function (data,post) {
  //   function Task(action,data) {Post("Task",data,action,post);};
  //   eval(data);
  // }
};

var global = {};   // an object where eval commands can store persistent data

//
//  Send a message to the Pool (to be passed on to the parent window),
//  trapping errors so that if the message can't be JSON stringified,
//  an error is produced.
//
function Post(cmd,data,action,post) {
  var msg = {cmd:cmd, data:data, action:action, post:post};
  try {
    self.postMessage(msg);
  } catch (err) {
    Task("error",copyError(err),post);
  }
}

//
//  Send an action to the parent Task object
//
function Task(action,data,post) {
  Post("Task",data,action,post);
}

//
//  Make a copy of an Error object (since those can't be stringified).
//
function copyError(error) {
  return {
    message: error.message,
    stack: error.stack,
    fileName: error.fileName,
    lineNumber: error.lineNumber
  };
}

//
//  We keep track of the imported libraries, so that we don't
//  load them again if another Task asks for them.
//
var _imported = {};
function Import(data) {
  if (!(data instanceof Array)) data = [data];
  for (var i = 0, m = data.length; i < m; i++) {
    if (!_imported[data[i]]) {
      importScripts(data[i]);
      _imported[data[i]] = true;
    }
  }
}

