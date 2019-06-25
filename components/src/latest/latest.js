/*************************************************************
 *
 *  latest.js
 *  
 *  Replacement for cdn.mathjax.org/mathjax/latest that loads the
 *  latest (3.x) version of a MathJax component from one of the
 *  supported CDNs
 *  
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2019 The MathJax Consortium
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function () {

  /*
   * The various CDNs and their data for how to obtain versions
   *   api = URL for JSON containing version number
   *   version = key for version string
   *   mathjax = base URL for MathJax on the CDN (version is appended to get actual URL)
   */
  var CDN = {
    'cdnjs.cloudflare.com': {
      api: 'https://api.cdnjs.com/libraries/mathjax?fields=version',
      version: 'version',
      mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/'
    },
    
    'rawcdn.githack.com': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      version: 'tag_name',
      mathjax: 'https://rawcdn.githack.com/mathjax/MathJax/'
    },
    
    'gitcdn.xyz': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      version: 'tag_name',
      mathjax: 'https://gitcdn.xyz/mathjax/MathJax/'
    },
    
    'cdn.statically.io': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      version: 'tag_name',
      mathjax: 'https://cdn.statically.io/gh/mathjax/MathJax/'
    },
    
    'unpkg.com': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      version: 'tag_name',
      mathjax: 'https://unpkg.com/mathjax@'
    },
    
    'cdn.jsdelivr.net': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      version: 'tag_name',
      mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@'
    }
  };

  /*
   * The data for getting release versions from GitHub
   */
  var GITHUB = {
    api: 'https://api.github.com/repos/mathjax/mathjax/releases',
    version: 'tag_name'
  };

  /*
   * The major version number for MathJax (we will load the highest version with this initial number)
   */
  var MJX_VERSION = 3;

  /*
   * The name to use for the version in localStorage
   */
  var MJX_LATEST = 'mjx-latest-version';

  /*
   * The amount of time a cached version number is valid
   */
  var SAVE_TIME = 1000 * 60 * 60 * 24 * 7;   // one week

  /*
   * Produce an error message on the console
   */
  function Error(message) {
    if (console && console.error) console.error('MathJax(latest.js): ' + message);
  }

  function scriptData(script, cdn) {
    script.parentNode.removeChild(script);
    var src = script.src;
    var file = src.replace(/.*?\/latest\.js(\?|$)/, '');
    if (file === '') {
      file = 'startup.js';
      src = src.replace(/\?$/, '') + '?' + file;
    }
    return {
      tag: script,
      src: src,
      file: file,
      cdn: cdn
    };
  }

  /*
   * Check if a script refers to MathJax on one of the CDNs
   */
  function checkScript(script) {
    for (var cdn in CDN) {
      if (CDN.hasOwnProperty(cdn)) {
        var url = CDN[cdn].mathjax;
        var src = script.src;
        if (src && src.substr(0, url.length) === url) {
          return scriptData(script, CDN[cdn]);
        }
      }
    }
  }

  /*
   * Get the script tag that loaded latest.js
   */
  function getScript() {
    if (document.currentScript) return scriptData(document.currentScript, null);
    var script = document.getElementById('MathJax-script');
    if (script) {
      return checkScript(script);
    }
    var scripts = document.getElementsByTagName('script');
    for (var i = 0, m = scripts.length; i < m; i++) {
      script = checkScript(scripts[i]);
      if (script) {
        return script;
      }
    }
  }

  /*
   * Save the version and date information in localStorage so we don't
   *   have to constact the CDN for every page that uses MathJax
   */
  function saveVersion(version) {
    try {
      var data = version + ' ' + Date.now();
      localStorage.setItem(MJX_LATEST, data);
    } catch (err) {}
  }
  
  /*
   * Get the version from localStorage, and make sure it is fresh enough to use
   */
  function getSavedVersion() {
    var version;
    try {
      var data = localStorage.getItem(MJX_LATEST).split(/ /);
      if (data[1] && Date.now() - parseInt(data[1]) < SAVE_TIME) {
        version = data[0];
      }
    } catch (err) {}
    return version;
  }

  /*
   * Create a script tag that loads the given URL
   */
  function loadMathJax(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    script.id = 'MathJax-script';
    var head = document.head || document.getElementsByTagName('head')[0] || document.body;
    if (head) {
      head.appendChild(script);
    } else {
      Error('Can\'t find the document <head> element');
    }
  }

  /*
   * When we can't find the current version, use the original URL but remove the "latest.js"
   */
  function loadDefaultMathJax() {
    if (script) {
      loadMathJax(script.src.replace(/\/latest\.js\?/, '/'));
    } else {
      Error('Can\'t determine the URL for loading MathJax');
    }
  }

  /*
   * Load the given version using the base URL and file to load
   */
  function loadVersion(script, version) {
    loadMathJax(script.cdn.mathjax + version + '/' + script.file);
  }

  /*
   * Check if the given version acceptable and load it if it is.
   * Return true if loaded, undefined if not
   */
  function checkVersion(script, version) {
    var major = parseInt(version.split(/\./)[0]);
    if (major === MJX_VERSION && !version.match(/-(beta|rc)/)) {
      saveVersion(version);
      loadVersion(script, version);
      return true;
    }
  }

  /*
   * Create an XMLHttpRequest object, if possible
   */
  function getXMLHttpRequest() {
    if (window.XMLHttpRequest) return new XMLHttpRequest();
    if (window.ActiveXObject) {
      try {return new ActiveXObject('Msxml2.XMLHTTP')} catch (err) {}
      try {return new ActiveXObject('Microsoft.XMLHTTP')} catch (err) {}
    }
  }

  /*
   * Request JSON data from a CDN.  If it loads OK, call the action() function
   * on the data.  If not, or if the action returns false, run the failure() function.
   */
  function requestXML(cdn, action, failure) {
    var request = getXMLHttpRequest();
    if (request) {
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status === 200) {
            !action(JSON.parse(request.responseText)) && failure();
          } else {
            Error('Problem acquiring MathJax version: status = ' + request.status);
            failure();
          }
        }
      };
      request.open('GET', cdn.api, true); 
      request.send(null);
    } else {
      Error('Can\'t create XMLHttpRequest object');
      failure();
    }
  }

  /*
   * Look through the list of versions on GitHub and find the first one that
   * has the MJX_VERSION as its major version number, and load that.  If none
   * is found, run the version from which latest.js was loaded.
   */
  function loadLatestGitVersion(script) {
    requestXML(GITHUB, function (json) {
      if (!json instanceof Array) return;
      for (var i = 0, m = json.length; i < m; i++) {
        if (checkVersion(script, json[i][GITHUB.version])) {
          return true;
        }
      }
    }, loadDefaultMathJax);
  }

  /*
   * Check the CDN for its latest version, and load that, if its major
   * version is MJX_VERSION.  Otherwise, (e.g., the current version has
   * a higher major version, find the highest version on GitHub with
   * the given major version and use that.  If one can't be found,
   * use the version where latest.js was loaded.
   */
  function loadLatestCdnVersion(script) {
    var cdn = script.cdn, key = cdn.version;
    requestXML(cdn, function (json) {
     if (json instanceof Array) {
        json = json[0];
      }
      if (!checkVersion(script, json[key])) {
        loadLatestGitVersion(script);
      }
      return true;
    }, loadDefaultMathJax);
  }

  /*
   * Find the script that loaded latest.js, and check if there is a file specified
   * Get the CDN from which it came.
   * If it is a known CDN:
   *   Get the file to be loaded
   *   Retrieve the cached version (if any)
   *   Load the given version of the file, if the version is cached,
   *   Otherwise find the latest version and load that.
   * Otherwise, use the version where latest.js was loaded.
   */
  var script = getScript();
  if (script.cdn) {
    var version = getSavedVersion();
    version ? 
      loadVersion(script, version) :
      loadLatestCdnVersion(script);
  } else {
    loadDefaultMathJax();
  }

})();
