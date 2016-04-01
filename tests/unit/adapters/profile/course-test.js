import { test } from 'ember-qunit';
import moduleForAdapter from 'gooru-web/tests/helpers/module-for-adapter';

moduleForAdapter('adapter:profile/course', 'Unit | Adapter | profile/course', {
  // needs: []
});

test('getCourses', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get('/api/nucleus/v1/profiles/profile-id/courses', function(request) {
      assert.equal(request.queryParams['subject'], 'course-subject', 'Wrong subject');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  });
  adapter.getCourses('profile-id', 'course-subject')
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });

});

