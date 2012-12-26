/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {

  // Nodejs libs.
  var path = require('path');

  // External libs.
  var connect = require('connect');
  var cors = require('connect-xcors')

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('server', 'Start a static web server.', function() {
    // Get values from config, or use defaults.
    var port = grunt.config('server.port') || 8000;
    var base = path.resolve(grunt.config('server.base') || '.');
    var server

    server = connect()
    
    use_cors = true
    //use_cors = grunt.config('server.cors')
    if (use_cors) {
      server.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type');
        if(req.method == "OPTIONS"){
          res.setHeader('Content-Type', 'text/plain charset=UTF-8');
          res.setHeader('Content-Length', '0');
          res.setHeader('Access-Control-Max-Age', '1728000');
          next();
        } else {
          next();
        }
      })
    }
    
    if (grunt.option('debug')) {
      connect.logger.format('grunt', ('[D] server :method :url :status ' +
        ':res[content-length] - :response-time ms').magenta);
      server.use(connect.logger('grunt'));
    }
    
    server.use(connect.static(base))
    server.use(connect.directory(base))
    
    grunt.log.writeln('Starting static web server on port ' + port + '.');
    server.listen(port)
  });

};
