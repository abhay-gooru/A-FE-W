import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';

moduleForService('service:api-sdk/library', 'Unit | Service | api-sdk/library', {

});

test('fetchLibraries', function(assert) {
  const service = this.subject();

  assert.expect(1);
  service.set('libraryAdapter', Ember.Object.create({
    fetchLibraries: function(){
      return Ember.RSVP.resolve([]);
    }
  }));

  service.set('librarySerializer', Ember.Object.create({
    normalizeFetchLibraries: function(librariesPayload) {
      assert.deepEqual(librariesPayload, [], 'Wrong libraries payload');
      return [];
    }
  }));

  var done = assert.async();
  service.fetchLibraries()
    .then(function() {
      done();
    });
});
