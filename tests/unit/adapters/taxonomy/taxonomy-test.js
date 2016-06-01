import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForAdapter from 'gooru-web/tests/helpers/module-for-adapter';

moduleForAdapter('adapter:taxonomy/taxonomy', 'Unit | Adapter | taxonomy/taxonomy', {
  // needs: []
});

test('Fetch Taxonomy Subjects for K-12', function(assert) {
  const adapter = this.subject();
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  this.pretender.map(function() {
    this.get('/api/nucleus/v1/taxonomy/subjects', function(request) {
      assert.equal(request.queryParams.classification_type, 'k_12', 'Wrong classification type value');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  });
  adapter.fetchSubjects('k_12')
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('Fetch Taxonomy Subjects for Higher Education', function(assert) {
  const adapter = this.subject();
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  this.pretender.map(function() {
    this.get('/api/nucleus/v1/taxonomy/subjects', function(request) {
      assert.equal(request.queryParams.classification_type, 'higher_education', 'Wrong classification type value');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  });
  adapter.fetchSubjects('higher_education')
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('Fetch Taxonomy Subjects for Professional Learning', function(assert) {
  const adapter = this.subject();
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  this.pretender.map(function() {
    this.get('/api/nucleus/v1/taxonomy/subjects', function(request) {
      assert.equal(request.queryParams.classification_type, 'professional_learning', 'Wrong classification type value');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  });
  adapter.fetchSubjects('professional_learning')
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});
