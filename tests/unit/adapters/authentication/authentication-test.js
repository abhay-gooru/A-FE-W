import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Pretender from 'pretender';
import Env from 'gooru-web/config/environment';

const EndPointsConfig = Env['gooru-endpoints'] || {};

moduleFor('adapter:authentication/authentication', 'Unit | Adapter | authentication/authentication', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('postAuthentication for anonymous account', function(assert) {
  const adapter = this.subject();
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const data = {
    isAnonymous: true
  };
  const routes = function() {
    const protocol = EndPointsConfig.secureProtocol;
    const hostname = EndPointsConfig.hostname;
    const port = EndPointsConfig.securePort ? `:${EndPointsConfig.securePort}` : '';
    this.post(`${protocol}${hostname}${port}/api/nucleus-auth/v1/token`, function(request) {
      let requestBodyJson = JSON.parse(request.requestBody);
      assert.equal('anonymous', requestBodyJson['grant_type']);
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.postAuthentication(data)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('postAuthentication for normal account', function(assert) {
  const adapter = this.subject();
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const data = {
    isAnonymous: false,
    username: 'username',
    password: 'password'
  };
  const encodedCredentials = window.btoa('username:password');
  const routes = function() {
    const protocol = EndPointsConfig.secureProtocol;
    const hostname = EndPointsConfig.hostname;
    const port = EndPointsConfig.securePort ? `:${EndPointsConfig.securePort}` : '';
    this.post(`${protocol}${hostname}${port}/api/nucleus-auth/v1/token`, function(request) {
      let requestBodyJson = JSON.parse(request.requestBody);
      assert.equal('credential', requestBodyJson['grant_type']);
      assert.equal('Basic ' + encodedCredentials, request.requestHeaders['Authorization']);
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.postAuthentication(data)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('postAuthenticationWithToken', function(assert) {
  const adapter = this.subject();
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const data = {
    accessToken: 'access_token'
  };
  const access_token = 'access_token';
  const routes = function() {
    this.get('/api/nucleus-auth/v1/token', function(request) {
      assert.equal('Token ' + access_token, request.requestHeaders['Authorization']);
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.postAuthenticationWithToken(data)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});
