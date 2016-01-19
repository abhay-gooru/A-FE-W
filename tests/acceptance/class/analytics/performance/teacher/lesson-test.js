import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/analytics/performance/teacher/lesson', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-analytics-performance-teacher-lesson-token',
      user: {
        /* using a pochita, @see classes/class-for-pochita-as-teacher-200-response.js */
        gooruUId: 'pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/fbd76aed-1b8d-4c2c-abc6-c7603eef567q');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/fbd76aed-1b8d-4c2c-abc6-c7603eef567q');

    const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher-lesson");
    T.exists(assert, $performanceContainer.find(".gru-metrics-table"), "Missing metrics table component");

    const $classMenu = find(".controller.class .gru-class-navigation .class-menu");
    T.exists(assert, $classMenu.find(".analytics.selected"), "Missing selected analytics item");

    //assert breadcrumb text
    const $breadcrumb = find(".controller.class .gru-breadcrumb");
    const $breadcrumbItems = $breadcrumb.find("ul li");
    assert.equal($breadcrumbItems.length, 3, "Incorrect number of breadcrumb items");
    assert.equal(T.text($breadcrumb.find("ul li:last-child")), 'The Best Course Ever Made', "Wrong breadcrumb item label");

  });
});

//test('Navigate to collection', function(assert) {
//  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/fbd76aed-1b8d-4c2c-abc6-c7603eef567q');
//
//  andThen(function() {
//    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/fbd76aed-1b8d-4c2c-abc6-c7603eef567q');
//
//    const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher-lesson");
//    const $metricTable = $performanceContainer.find(".gru-metrics-table");
//
//    click($metricTable.find("thead tr:eq(0) th:eq(1)"));
//    andThen(function(){
//      assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/fbd76aed-1b8d-4c2c-abc6-c7603eef567q');
//    });
//
//    //menu is still selected
//    const $classMenu = find(".controller.class .gru-class-navigation .class-menu");
//    T.exists(assert, $classMenu.find(".analytics.selected"), "Missing selected analytics item");
//  });
//});