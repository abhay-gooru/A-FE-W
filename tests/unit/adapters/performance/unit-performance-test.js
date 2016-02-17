import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:performance/unit-performance', 'Unit | Adapter | performance/unit-performance', {});

test('urlForQueryRecord method for unit performance', function (assert) {
  const adapter = this.subject();
  const query = {
    classId: 'the-class-id',
    courseId: 'the-course-id'
  };
  const url = adapter.urlForQueryRecord(query);

  assert.equal(url, '/mocked-api/insights-api-v1/rest/v2/class/the-class-id/course/the-course-id/performance', 'Wrong url');
});