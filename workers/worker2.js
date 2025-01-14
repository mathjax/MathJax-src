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
  if (event.data?.debug) {
    console.log('Iframe  >>>  Worker:', event.data);
  }
  const {cmd, data} = event.data;
  if (Commands.hasOwnProperty(cmd)) {
    Post('Log',`running ${cmd}`);
    try {
      (Commands[cmd])(data);
    } catch (err) {
      Pool('Error', copyError(err));
    }
  } else {
    Pool('Error', {message: `Invalid worker command: ${cmd}`});
  }
}, false);

//
//  These are the commands that can be sent from the Tasks in the main window.
//  The commands are augmented by the libraries that are loaded via the import
//  command or by importScripts() calls added to this file, or by eval commands
//  that add to the list.
//  
const Commands = {
  //
  //  This is called when a Task is assigned to the worker.
  //     Clear the global data (removing any data from previous Tasks)
  //     Import any needed libraries
  //     Signal the Task that we are ready to go.
  //
  start: function(data) {
    Pool('ready', null);
  },
  //
  //  This stops the task by signalling the Task that we are done
  //  (this also causes the Pool to free up the worker to be reused).
  //
  stop: function (data) {Pool('done', data);},
  //
  //  This simply returns the data it was sent
  //  (for debugging, using the echo callback of the Task).
  //
  echo: function (data) {Pool('echo', data);},
  //
  //  This loads one or more libraries
  //  (it signals completion by the imported callback).
  //
  import: function (data) {
    if (data?.imports) {
      Import(data.imports);
    }
  },

  /**
   * Compute speech
   * @param data The data object
   * @param post The call back specification
   */
  speech: function(data) {
    if (data?.mml) {
      SRE.engineReady().then(() => {
        Pool('Client', {cmd: 'Attach', data:{ speech: SRE.toSpeechStructure(data.mml), id: data.id}});
      });
    }
  },

  setup: function(data) {
    if (data) {
      SRE.setupEngine(data);
    }
  }

};

//
//  Send a message to the Pool (to be passed on to the parent window),
//  trapping errors so that if the message can't be JSON stringified,
//  an error is produced.
//
function Post(cmd, data, action) {
  const msg = {cmd: cmd, data: data, action: action};
  try {
    self.postMessage(msg);
  } catch (err) {
    Pool('error', copyError(err));
  }
}

//
//  Send an action to the parent Task object
//
function Pool(action, data) {
  Post(action, data);
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
const _imported = {};
function Import(data) {
  if (!(data instanceof Array)) data = [data];
  for (let imp of data) {
    if (!_imported[imp]) {
      importScripts(imp);
      _imported[imp] = true;
    }
  }
}

// TODO:
// Do we really need error?
// go over all the commands to see if they are necessary
