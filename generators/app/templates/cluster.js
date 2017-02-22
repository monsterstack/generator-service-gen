'use strict';
const config = require('config');
const Cluster = require('core-server').Cluster;

const optimist = require('optimist');
const _ = require('lodash');

const main = () => {
  console.log("Starting Cluster");
  let options = {};
  if(optimist.argv.numWorkers) {
    options.numWorkers = optimist.argv.numWorkers;
  }

  if(optimist.argv.discoveryHost) {
    options.discoveryHost = optimist.argv.discoveryHost;
  }

  if(optimist.argv.overrides) {
    let overrides = require(optimist.argv.overrides);
    _.merge(config, overrides);
    options.overridesPath = optimist.argv.overrides;
  }

  let announcement = require('./announcement.json');
  let cluster = new Cluster(announcement.name, announcement, options);

  cluster.start();

  cluster.onProxyReady((proxy) => {
    console.log("Yeah.. the proxy is bound");
    setInterval(() => {
      cluster.reannounce(config);
    }, 2*60*1000);
  });
}


if(require.main === module) {
  main();
}
