Package.describe({
  name: 'youiest:recommend',
  version: '0.0.4',
  summary: ' for reactive network triggers with a simple ui',
  git: 'https://github.com/youiest/youiest-unionize.git',
  documentation: 'README.md'
});


// add grounddb here
Package.on_use(function (api) {
  api.versionsFrom('1.0.3.1');
  api.use([
    'matb33:collection-hooks',
    'coffeescript',
    'mongo',
    'accounts-base',
    'session',
    ], ['client', 'server']);

  api.export(["W","WI","Unionize"], ['client','server']);
  
  api.add_files([
    'lib.js'
  ], ['client','server']);

  api.add_files([
    'client.js'
  ], ['client']);

  api.add_files([
    'server.js',
    'rules.js',
    'methods.js',
    'publish.js'
  ], ['server']);

});

Package.on_test(function (api) {
  // api.versionsFrom('1.0.3.1');
  api.use(
    [
      'underscore',
      'ground:db',
      'aldeed:console-me',
      'matb33:collection-hooks',
      'tracker', 
      'tinytest', 
      'test-helpers', 
      'coffeescript', 
      'insecure', 
      'accounts-base', 
      'accounts-password', 
      'underscore', 
      'random', 
      'pedrohenriquerls:reactjs',
      'mongo',
      'session'
    ], 
    [
      'client', 
      'server'
    ]);

  api.export(["W","WI","Unionize"], ['client','server']);

  api.add_files([
    'lib.js'
  ], ['client','server']);

  api.add_files([
    'client.js'
  ], ['client']);

  api.add_files([
    'server.js'
  ], ['server']);

  api.add_files([
    'test.js'
  ], ['client','server']);


});
