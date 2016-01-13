import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';

moduleForService('service:api-sdk/course', 'Unit | Service | api-sdk/course', {
  needs: ['serializer:course/course', 'model:course/course', 'model:user/user', 'adapter:course/course']
});

test('findById', function (assert) {
  const service = this.subject();
  const response = {
    "summary": {"unitCount": 1},
    "collectionType": "course",
    "collectionId": 24292300,
    "parentGooruOid": "42e2316a-d72d-4aad-a2b4-d54ee676b12d",
    "itemSequence": 25,
    "type": "course",
    "lastModifiedUserUid": "780b6450-a034-4adc-97e2-c3057b10e6b5",
    "title": "Indian History",
    "sharing": "private",
    "collectionItemId": "41d38472-b347-430c-b2bb-133c1e568e9d",
    "lastModified": 1437990694000,
    "gooruOid": "ab925bd9-bb9d-497c-a604-03b43b9d13d6",
    "taxonomyCourse": [{"id": 28, "name": "Earth Science", "subjectId": 2}],
    "user": {
      "username": "profile",
      "gooruUId": "780b6450-a034-4adc-97e2-c3057b10e6b5",
      "profileImageUrl": "http://profile-qa.s3.amazonaws.com/780b6450-a034-4adc-97e2-c3057b10e6b5.png"
    }
  };
  const routes = function () {
      this.get('/gooruapi/rest/v1/course/the-course-id', function () {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
      }, 0);
    };

  this.pretender.map(routes);

  var done = assert.async();
  Ember.run(function() {
    const promise = service.findById('the-course-id');
    promise.then(function (course) {
      assert.equal(course.get('id'), 'ab925bd9-bb9d-497c-a604-03b43b9d13d6', 'Wrong id');
      assert.equal(course.get('title'), 'Indian History', 'Wrong title');
      assert.equal(course.get('totalUnits'), 1, 'Wrong total units');
      assert.equal(course.get('imageUrl'), '/assets/gooru/profile.png', 'Wrong imageUrl value');
      assert.equal(course.get('isPublic'), false, 'Wrong isPublic value');
      assert.equal(course.get('subjects.length'), 1, 'Wrong subjects');
      assert.equal(course.get('remixedBy.length'), 1, 'Wrong remixedBy');
      done();
    });
  });
});
