import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

// Stub performance service

moduleForComponent('class/analytics/performance/student/gru-lesson-performance', 'Integration | Component | class/analytics/performance/student/gru lesson performance', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale","en");
  }
});

test('Test for lesson performance', function(assert) {
  const lesson = Ember.Object.create(
    {
      id:'333-555-777',
      title: "Quiz :: Indian History",
      type: "lesson",
      score:75,
      completionDone: 0,
      completionTotal: 1,
      timeSpent: 4852359,
      ratingScore: 0,
      isCompleted: false,
      collections:Ember.A([
        Ember.Object.create({
          id:'first-collection-id',
          title: "Indian History Collection",
          type: "collection",
          score:75,
          completionDone: 0,
          completionTotal: 1,
          timeSpent: 4852359,
          ratingScore: 0,
          isCompleted: false,
          isCollection: true
        }),
        Ember.Object.create({
          id:'second-collection-id',
          title: "Indian History Assessment",
          type: "assessment",
          score:75,
          completionDone: 0,
          completionTotal: 1,
          timeSpent: 442359,
          ratingScore: 0,
          isCompleted: false,
          isAssesment: true
        })
      ])
    });
  const classModel = Ember.Object.create({
    id:'111-333-555',
    course:'222-444-666'
  });

  this.set('userId', "any-user-id");
  this.set('classModel', classModel);
  this.set('lesson', lesson);
  this.set('index',0);
  this.render(hbs`{{class.analytics.performance.student.gru-lesson-performance
    lesson=lesson
    localIndex=index
    index=index
  }}`);
  const $component = this.$();

  T.exists(assert, $component, 'Missing Lesson Container');



  const $lessonTitle = $component.find(".lesson-performance-title span");

  assert.equal(T.text($lessonTitle), "L1: Quiz :: Indian History", "Wrong title");

  const $clickableAnchor= $component.find(".gru-lesson-performance-container a"); //component dom element
  T.exists(assert, $clickableAnchor, 'Missing Clickable Anchor');

  Ember.run(() => {
    $clickableAnchor.click();
  });

  return wait().then(function() {
    const $collectionsContainer = $component.find(".collections-container");
    assert.equal($collectionsContainer.hasClass('in'), true, "Collections container did not open");

    const $firstCollection = $component.find("div.collections-container div.collection-performance:first-child");
    T.exists(assert, $firstCollection, 'Missing First collection');

    const $collectionTitle = $component.find(".collections-container div:first-child .collection-performance-title span");
    T.exists(assert, $collectionTitle, 'Missing collection Title');

    assert.equal(T.text($collectionTitle), "C1: Indian History Collection", "Wrong title");

  });
  });
