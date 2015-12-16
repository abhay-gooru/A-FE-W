import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/analytics/performance/teacher', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-analytics-performance-teacher-token',
      user: {
        /* using a pochita, @see classes/class-for-pochita-as-teacher-200-response.js */
        gooruUId: 'pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher');

    const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher");
    T.exists(assert, $performanceContainer, "Missing performance container");

    T.exists(assert, $performanceContainer.find(".navigation .performance"), "Missing performance navigation tab");
    T.exists(assert, $performanceContainer.find(".navigation .mastery"), "Missing mastery navigation tab");
    T.exists(assert, $performanceContainer.find(".controls .teacher-breadcrumb"), "Missing performance breadcrumb");
    T.exists(assert, $performanceContainer.find(".controls .teacher-actions"), "Missing performance actions");
    T.exists(assert, $performanceContainer.find(".gru-filters .data-picker"), "Missing data picker");
    T.exists(assert, $performanceContainer.find(".gru-filters .data-picker .gru-data-picker"), "Missing data picker");
    T.exists(assert, $performanceContainer.find(".gru-filters .performance-scale"), "Missing performance scale area");
    T.exists(assert, $performanceContainer.find(".gru-filters .performance-scale .gru-scale-indicator"), "Missing performance scale indicator component");
    T.exists(assert, $performanceContainer.find(".gru-content"), "Missing performance content");
    T.exists(assert, $performanceContainer.find(".controls .teacher-breadcrumb .gru-breadcrumb"), "Missing performance breadcrumb component");
    T.exists(assert, $performanceContainer.find(".controls .teacher-actions .gru-actions-bar"), "Missing performance actions component");

    const $classMenu = find(".controller.class .gru-class-navigation .class-menu");
    T.exists(assert, $classMenu.find(".analytics.selected"), "Missing selected analytics item");

    const $betterExperience = find("div.better-experience.visible-xs");
    T.exists(assert, $betterExperience, "Missing better experience alert");
    T.exists(assert, $betterExperience.find("button.close"), "Missing close button");
    assert.equal(T.text($betterExperience.find("span.better-experience-message")), "For a better Gooru experience, view full Class Analytics in tablet or desktop.", "Incorrect message");

  });
});

test('Navigating from class navigation', function(assert) {
  visit('/class/class-for-pochita-as-teacher');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher');

    const $overviewMenuItem = find(".navigation .class-menu .analytics");

    click($overviewMenuItem);
    andThen(function() {
      //making sure it goes to the teacher view
      assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher');
    });
  });
});

test('When view by both option is selected', function(assert) {
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher');

    const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher");
    const $bothViewOption = $performanceContainer.find(".controls .gru-actions-bar .dropdown-menu .both");

    click($bothViewOption);
    andThen(function() {
      assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher?filterBy=both');

    });
  });
});