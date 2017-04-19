import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'gooru-web/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Class from 'gooru-web/models/content/class';
import Resource from 'gooru-web/models/content/resource';

const classServiceStub = Ember.Service.extend({

  readClassInfo: function() {
    const aClassInfo = Class.create(Ember.getOwner(this).ownerInjection(), {
      id: 'class-1',
      title: 'MPM-Data Analytics Class',
      code: 'CZHAMO3'
    });

    return new Ember.RSVP.resolve(aClassInfo);
  }
});

const performanceServiceStub = Ember.Service.extend({

  findClassPerformanceSummaryByClassIds: function() {
    const aClassPerformance = Class.create({
      id: 'class-1',
      classId: 'class-1',
      score: 80,
      timeSpent: 3242209,
      total: 10,
      totalCompleted: 5
    });

    return new Ember.RSVP.resolve([aClassPerformance]);
  }
});

const suggestServiceStub = Ember.Service.extend({

  suggestResourcesForCollection: function() {
    const suggestedResources = [
      Resource.create({
      id: 'resource-1',
      title: 'resource1',
      format: 'video'
      }),
      Resource.create({
        id: 'resource-2',
        title: 'resource2',
        format: 'image'
      })
    ];

    return new Ember.RSVP.resolve(suggestedResources);
  }
});

moduleForComponent('player/gru-study-header', 'Integration | Component | player/gru study header', {
  integration: true,
  beforeEach: function () {
    this.i18n = this.container.lookup('service:i18n');
    this.i18n.set('locale','en');
    this.register('service:api-sdk/class', classServiceStub);
    this.inject.service('api-sdk/class');
    this.register('service:api-sdk/performance', performanceServiceStub);
    this.inject.service('api-sdk/performance');
    this.register('service:api-sdk/suggest', suggestServiceStub);
    this.inject.service('api-sdk/suggest');
  }
});

test('Layout', function(assert) {

  this.set('session', {
    userId: 'user-id'
  });

  this.set('collection', {
    id: 'collection-id',
    isCollection: true
  });

  this.set('breadcrumbs', ['unit 1', 'lesson 1', 'collection 1']);

  this.set('classId', 'class-1');

  this.set('courseTitle', 'Marine Biology');

  this.render(hbs`{{player/gru-study-header classId=classId collection=collection session=session courseTitle=courseTitle breadcrumbs=breadcrumbs}}`);

  var $component = this.$(); //component dom element
  const $header = $component.find('.gru-study-header');
  T.exists(assert, $header, 'Missing header section');

  const $courseInfo = $header.find('.course-info');
  T.exists(assert, $courseInfo, 'Missing course-info');
  T.exists(assert, $courseInfo.find('.course-title'), 'Missing course title');
  T.exists(assert, $courseInfo.find('.course-title i'), 'Missing course title icon');
  assert.equal(T.text($courseInfo.find('.course-title .title')), 'Marine Biology', 'Wrong course title text');
  T.exists(assert, $courseInfo.find('.breadcrumbs'), 'Missing breadcrumbs');
  assert.equal($courseInfo.find('.breadcrumb-title').length, 3, 'Wrong breadcrumb-titles');
  assert.equal(T.text($courseInfo.find('.breadcrumb-title:eq(0)')), 'unit 1', 'Wrong first breadcrumb title');
  assert.equal(T.text($courseInfo.find('.breadcrumb-title:eq(1)')), 'lesson 1', 'Wrong second breadcrumb title');
  assert.equal(T.text($courseInfo.find('.breadcrumb-title:eq(2)')), 'collection 1', 'Wrong third breadcrumb title');

  T.exists(assert, $courseInfo.find('.actions .course-map'), 'Missing course map button');

  const $performanceInfo = $header.find('.performance-info');
  T.exists(assert, $performanceInfo, 'Missing performance-info');

  const $scoreChart = $performanceInfo.find('.graphic.performance .gru-bubble-chart');
  T.exists(assert, $scoreChart, 'Missing score chart');
  T.exists(assert, $performanceInfo.find('.graphic.performance .legend'), 'Missing performance chart legend');
  assert.equal(T.text($scoreChart.find('.bubble-circle span')), '80%', 'Wrong score text');

  T.exists(assert, $performanceInfo.find('.bar-charts .completion-chart .gru-x-bar-chart'), 'Missing completion chart');
  T.exists(assert, $performanceInfo.find('.bar-charts .completion-chart .legend'), 'Missing completion chart');

  T.exists(assert, $performanceInfo.find('.resources'), 'Missing resources section');
  T.exists(assert, $performanceInfo.find('.resources .count-resources .counter'), 'Missing counter of resources');
  assert.equal(T.text($performanceInfo.find('.resources .count-resources .counter')), '0', 'Wrong counter of resources');

  T.exists(assert, $performanceInfo.find('.resources .count-resources button'), 'Missing button of resources');
  assert.equal(T.text($performanceInfo.find('.resources .count-resources button')), this.get('i18n').t('common.resources').string, 'Wrong button text');
  T.exists(assert, $performanceInfo.find('.resources .navigation'), 'Missing resources navigation');

  T.exists(assert, $performanceInfo.find('.suggestions'), 'Missing suggestions section');
  T.exists(assert, $performanceInfo.find('.suggestions .description'), 'Missing suggestions description');
  T.exists(assert, $performanceInfo.find('.suggestions .suggested-resources'), 'Missing suggested resources');
  assert.equal($performanceInfo.find('.suggestions .suggested-resources .btn-resource').length, 2, 'Wrong suggested resource buttons');
  T.exists(assert, $performanceInfo.find('.suggestions .suggested-resources .btn-resource:eq(0) .video-icon'), 'Missing resource video icon');
  T.exists(assert, $performanceInfo.find('.suggestions .suggested-resources .btn-resource:eq(0) .title'), 'Missing resource title');
  assert.equal(T.text($performanceInfo.find('.suggestions .suggested-resources .btn-resource:eq(0) .title')), 'resource1', 'Wrong title text');

  T.exists(assert, $performanceInfo.find('.suggestions .collapse-expand'), 'Missing collapse-expand link');
});

test('Layout-Resources in Assessment', function(assert) {

  this.set('session', {
    userId: 'user-id'
  });

  this.set('collection', {
    id: 'collection-id',
    isCollection: false,
    resources: [
      Ember.Object.create({
        id: 'resource-1'
      }),
      Ember.Object.create({
        id: 'resource-2'
      })
    ]
  });

  this.set('classId', 'class-1');

  this.render(hbs`{{player/gru-study-header classId=classId collection=collection session=session resourceSequence=1}}`);

  var $component = this.$(); //component dom element
  const $header = $component.find('.gru-study-header');

  const $performanceInfo = $header.find('.performance-info');

  T.exists(assert, $performanceInfo.find('.resources'), 'Missing resources section');
  T.exists(assert, $performanceInfo.find('.resources .count-resources .counter'), 'Missing counter of resources');
  assert.equal(T.text($performanceInfo.find('.resources .count-resources .counter')), '1/2', 'Wrong counter of resources');

  T.exists(assert, $performanceInfo.find('.resources .count-resources button'), 'Missing button of resources');
  assert.equal(T.text($performanceInfo.find('.resources .count-resources button')), this.get('i18n').t('common.questions').string, 'Wrong button text');
});

test('Layout - Pre Test', function(assert) {

  this.set('session', {
    userId: 'user-id'
  });

  this.set('collection', {
    id: 'collection-id',
    isCollection: true
  });

  this.set('breadcrumbs', ['unit 1', 'lesson 1', 'collection 1']);

  this.set('classId', 'class-1');

  this.set('courseTitle', 'Marine Biology');

  this.render(hbs`{{player/gru-study-header classId=classId collection=collection session=session courseTitle=courseTitle breadcrumbs=breadcrumbs isPreTest=true}}`);

  var $component = this.$(); //component dom element
  const $header = $component.find('.gru-study-header');
  T.exists(assert, $header, 'Missing header section');

  const $performanceInfo = $header.find('.performance-info');
  T.exists(assert, $performanceInfo, 'Missing performance-info');

  T.exists(assert, $performanceInfo.find('.resources'), 'Missing resources section');
  T.exists(assert, $performanceInfo.find('.resources .lesson-info'), 'Missing lesson info');
  assert.equal(T.text($performanceInfo.find('.resources .lesson-info')), this.get('i18n').t('gru-study-header.lesson-legend').string+' lesson 1', 'Wrong lesson title');

  T.notExists(assert, $performanceInfo.find('.resources .count-resources'), 'Counter of resources should not be visible');
  T.notExists(assert, $performanceInfo.find('.resources .navigation'), 'Resources navigation should not be visible');
});

test('Layout-Collection Resources from Collection Report', function(assert) {

  this.set('session', {
    userId: 'user-id'
  });

  this.set('collection', {
    id: 'collection-id',
    isCollection: true,
    resources: [
      Ember.Object.create({
        id: 'resource-1'
      }),
      Ember.Object.create({
        id: 'resource-2'
      })
    ]
  });

  this.set('classId', 'class-1');

  this.render(hbs`{{player/gru-study-header classId=classId collection=collection session=session resourceSequence=1 fromReport=true}}`);

  var $component = this.$(); //component dom element
  const $header = $component.find('.gru-study-header');

  const $performanceInfo = $header.find('.performance-info');

  T.exists(assert, $performanceInfo.find('.resources'), 'Missing resources section');
  T.exists(assert, $performanceInfo.find('.resources .count-resources'), 'Missing counter of resources');
  assert.equal(T.text($performanceInfo.find('.resources .count-resources')), this.get('i18n').t('gru-study-header.resources-collection-report').string, 'Wrong resources collection report text');

});

test('Layout-Assessment Resources from Collection Report', function(assert) {

  this.set('session', {
    userId: 'user-id'
  });

  this.set('collection', {
    id: 'collection-id',
    isCollection: false,
    resources: [
      Ember.Object.create({
        id: 'resource-1'
      }),
      Ember.Object.create({
        id: 'resource-2'
      })
    ]
  });

  this.set('classId', 'class-1');

  this.render(hbs`{{player/gru-study-header classId=classId collection=collection session=session resourceSequence=1 fromReport=true}}`);

  var $component = this.$(); //component dom element
  const $header = $component.find('.gru-study-header');

  const $performanceInfo = $header.find('.performance-info');

  T.exists(assert, $performanceInfo.find('.resources'), 'Missing resources section');
  T.exists(assert, $performanceInfo.find('.resources .count-resources'), 'Missing counter of resources');
  assert.equal(T.text($performanceInfo.find('.resources .count-resources')), this.get('i18n').t('gru-study-header.resources-assessment-report').string, 'Wrong resources collection report text');

});

test('Collapse-expand performance information', function(assert) {

  this.on('parentAction', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/gru-study-header onToggleHeader='parentAction'}}`);
  var $component = this.$(); //component dom element
  const $header = $component.find('.gru-study-header');
  const $courseInfo = $header.find('.course-info');
  const $performanceInfo = $header.find('.performance-info');
  const $performanceInfoButton = $performanceInfo.find('.suggestions a.collapse-expand');

  assert.ok($performanceInfo.hasClass('visible'), 'Performance Info container has visible class by default');
  assert.ok($performanceInfoButton, 'Missing expand-collapse button');
  $performanceInfoButton.click();
  return wait().then(function () {
    assert.ok($performanceInfo.hasClass('hidden'), 'Performance Info container should be hidden');

    const $courseTitleLink = $courseInfo.find('.course-title');
    $courseTitleLink.click();
    return wait().then(function () {
      assert.ok($performanceInfo.hasClass('visible'), 'Performance Info container is expanded');
    });
  });
});