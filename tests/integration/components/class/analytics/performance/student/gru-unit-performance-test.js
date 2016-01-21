import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

// Stub performance service
const performanceServiceStub = Ember.Service.extend({

  findLessonPerformanceByClassAndCourseAndUnit(userId, classId, courseId, unitId) {
    var response;
    var promiseResponse;

    if (userId === 'any-user-id' && classId === '111-333-555' && courseId === '222-444-666' && unitId === '333-555-777') {
      response =
        Ember.A([
          Ember.Object.create({
          title: "lesson-title"
          }),
          Ember.Object.create({
            title: "lesson-2-title"
          })
        ])
      ;
    } else {
      response = [];
    }

    promiseResponse = new Ember.RSVP.Promise(function(resolve) {
      Ember.run.next(this, function() {
        resolve(response);
      });
    });

    return DS.PromiseArray.create({
      promise: promiseResponse
    });
  }
});

moduleForComponent('class/analytics/performance/student/gru-unit-performance', 'Integration | Component | class/analytics/performance/student/gru unit performance', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale","en");
    this.register('service:api-sdk/performance', performanceServiceStub);
    this.inject.service('api-sdk/performance', { as: 'performanceService' });
  }
});

test('Test for unit performance', function(assert) {
  const unit = Ember.Object.create(
    {
      id:'333-555-777',
      title: "Quiz :: Indian History",
      type: "performance/performance",
      score:75,
      completionDone: 0,
      completionTotal: 1,
      timeSpent: 4852359,
      ratingScore: 0,
      attempts: 2,
      isCompleted: false
    });
  const classModel = Ember.Object.create({
    id:'111-333-555',
    course:'222-444-666'
  });

  this.set('userId', "any-user-id");
  this.set('classModel', classModel);
  this.set('unit', unit);
  this.set('index',0);
  this.set('selectedLessonId', 'not-my-id-2');
  this.set('selectedUnitId', 'not-my-id');
  this.set('i',0);
  this.set('onLocationUpdate', function(){
    assert.ok(true, "This should be called 1 time per click");

  });
  this.set('updateSelectedLesson', function(){
    assert.ok(true, "This should be called 1 time per click");

  });

  assert.expect(10);

  this.render(hbs`{{class.analytics.performance.student.gru-unit-performance
    unit=unit
    classModel=classModel
    userId=userId
    localIndex=index
    selectedLessonId=selectedLessonId
    selectedUnitId=selectedUnitId
    onLocationUpdate=onLocationUpdate
    updateSelectedLesson=updateSelectedLesson
  }}`);//
  const $component = this.$();
  const $clickableDiv= $component.find(".gru-unit-performance-container >a"); //component dom element

  T.exists(assert, $component, 'Missing Unit Container');//1

  const $titleSpan = $component.find(".performance-unit-title span");

  assert.equal(T.text($titleSpan), "U1: Quiz :: Indian History", "Wrong title"); //2

  Ember.run(() => {
    $clickableDiv.click();//4
  });

  return wait().then(function() {
    const $lessonsContainer = $component.find(".lessons-container");
    assert.equal($lessonsContainer.hasClass('in'), true, "Lessons container did not open");//5

    const $lessonTitleSpan = $component.find(".lessons-container div div:first-child .lesson-performance-title span");

    T.exists(assert, $lessonTitleSpan, 'Missing Lesson Container');//6

    assert.equal(T.text($lessonTitleSpan), "L1: lesson-title", "Wrong title");//7

    Ember.run(() => {
      $clickableDiv.click();//9
    });

    return wait().then(function() {

      const $lessonsContainer = $component.find(".lessons-container");
      assert.equal($lessonsContainer.hasClass('in'), false, "Lessons container did not close");//10

    });
  });



});
