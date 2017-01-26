'use strict';
let Generator = require('yeoman-generator');
let chalk = require('chalk');
let yosay = require('yosay');
let mkdirp = require('mkdirp');
let _ = require('lodash');

let userConfigs;

module.exports = Generator.extend({

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the striking ' + chalk.red('service-gen') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'serviceName',
        message: 'What\'s the NAME of the service that you want to create right now?',
        store: false
      },
      {
        type: 'input',
        name: 'serviceDescription',
        message: 'What\'s the DESCRIPTION of the service that you want to create right now?',
        store: false
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      userConfigs = props;
    }.bind(this));
  },

  writing: function () {

    let serviceNameValid = userConfigs.serviceName.replace(/\W+/g,"");
    let serviceRootPath = '../outputs/' + serviceNameValid;

    mkdirp.sync(serviceRootPath);
    mkdirp.sync(serviceRootPath + '/api');
    mkdirp.sync(serviceRootPath + '/api/swagger');
    mkdirp.sync(serviceRootPath + '/api/v1');
    mkdirp.sync(serviceRootPath + '/api/v1/controllers');
    mkdirp.sync(serviceRootPath + '/api/v1/routes');
    mkdirp.sync(serviceRootPath + '/config');
    // mkdirp.sync(serviceRootPath + '/libs');


    //rootPath
    this.fs.copyTpl(//template
      this.templatePath('announcement.json'),
      this.destinationPath(serviceRootPath+'/announcement.json'),
      {
        serviceName: userConfigs.serviceName
      }
    );
    this.fs.copy(
      this.templatePath('typeQuery.json'),
      this.destinationPath(serviceRootPath+'/typeQuery.json')
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(serviceRootPath+'/package.json'),
      {
        serviceName: userConfigs.serviceName,
        serviceDescription: userConfigs.serviceDescription
      }
    );
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath(serviceRootPath+'/README.md')
    );
    this.fs.copy(
      this.templatePath('server.js'),
      this.destinationPath(serviceRootPath+'/server.js')
    );

    //config
    this.fs.copy(
      this.templatePath('default.json'),
      this.destinationPath(serviceRootPath+'/config/default.json')
    );

    //swagger
    this.fs.copyTpl(
      this.templatePath('info.js'),
      this.destinationPath(serviceRootPath+'/api/swagger/info.js'),
      {
        serviceName: userConfigs.serviceName,
        serviceDescription: userConfigs.serviceDescription
      }
    );
    this.fs.copy(
      this.templatePath('model-schema.js'),
      this.destinationPath(serviceRootPath+'/api/swagger/model-schema.js')
    );
    this.fs.copy(
      this.templatePath('swagger.json'),
      this.destinationPath(serviceRootPath+'/api/swagger/swagger.json')
    );

    //controller
    this.fs.copy(
      this.templatePath('thisService.controller.js'),
      this.destinationPath(serviceRootPath+'/api/v1/controllers/'+ serviceNameValid +'.controller.js')
    );
    this.fs.copy(
      this.templatePath('health.controller.js'),
      this.destinationPath(serviceRootPath+'/api/v1/controllers/health.controller.js')
    );
    this.fs.copy(
      this.templatePath('proxyCache.controller.js'),
      this.destinationPath(serviceRootPath+'/api/v1/controllers/proxyCache.controller.js')
    );
    this.fs.copy(
      this.templatePath('swagger.controller.js'),
      this.destinationPath(serviceRootPath+'/api/v1/controllers/swagger.controller.js')
    );

    //routes
    this.fs.copy(
      this.templatePath('thisService.routes.js'),
      this.destinationPath(serviceRootPath+'/api/v1/routes/'+ serviceNameValid +'.routes.js')
    );
    this.fs.copy(
      this.templatePath('health.routes.js'),
      this.destinationPath(serviceRootPath+'/api/v1/routes/health.routes.js')
    );
    this.fs.copy(
      this.templatePath('proxyCache.routes.js'),
      this.destinationPath(serviceRootPath+'/api/v1/routes/proxyCache.routes.js')
    );
    this.fs.copy(
      this.templatePath('swagger.routes.js'),
      this.destinationPath(serviceRootPath+'/api/v1/routes/swagger.routes.js')
    );


    // this.fs.copy(
    //   this.templatePath('cluster.js'),
    //   this.destinationPath(serviceRootPath+'/cluster.js')
    // );

    // this.fs.copy(
    //   this.templatePath('error.js'),
    //   this.destinationPath(serviceRootPath+'/api/error.js')
    // );

    // this.fs.copy(
    //   this.templatePath('startup.js'),
    //   this.destinationPath(serviceRootPath+'/libs/startup.js')
    // );

  },

  install: function () {
    this.installDependencies();
  }
});
