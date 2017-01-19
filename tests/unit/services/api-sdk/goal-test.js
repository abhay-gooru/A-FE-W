import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';
import GoalModel from 'gooru-web/models/goal/goal';

moduleForService('service:api-sdk/goal', 'Unit | Service | api-sdk/goal', {
});

test('createGoal', function(assert) {
  const service = this.subject();
  let goal = GoalModel.create({
    title: "any goal"
  });

  assert.expect(3);

  service.set('serializer', Ember.Object.create({
    serializeCreateGoal: function(goalParam) {
      assert.deepEqual(goalParam, goal, 'Wrong goal parameter');
      return { id: "fake-id" };
    }
  }));

  service.set('adapter', Ember.Object.create({
    createGoal: function(data) {
      assert.deepEqual(data, { id: "fake-id" }, 'Wrong data');
      return Ember.RSVP.resolve(1);
    }
  }));

  var done = assert.async();
  service.createGoal(goal)
    .then(function(goalId) {
      assert.equal(goal.get('id'), goalId, 'Wrong goal id');
      done();
    });
});

test('getGoalsByUser', function(assert) {
  const service = this.subject();
  assert.expect(3);

  service.set('serializer', Ember.Object.create({
    normalizeGetGoals: function(data) {
      assert.equal(data, "fake-data", 'Wrong data');
      return [1,2,3]; //fake response
    }
  }));

  service.set('adapter', Ember.Object.create({
    getGoalsByUser: function(userId) {
      assert.deepEqual(userId, 123, 'Wrong id');
      return Ember.RSVP.resolve("fake-data");
    }
  }));

  var done = assert.async();
  service.getGoalsByUser(123)
    .then(function(goals) {
      assert.deepEqual(goals, [1,2,3], 'Wrong response');
      done();
    });
});
