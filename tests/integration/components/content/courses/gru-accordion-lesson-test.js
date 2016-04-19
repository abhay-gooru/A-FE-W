import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import BuilderItem from 'gooru-web/models/content/builder/item';
import Lesson from 'gooru-web/models/content/lesson';
import LessonItem from 'gooru-web/models/content/lessonItem';
import Ember from 'ember';

const lessonServiceStub = Ember.Service.extend({

  createLesson(courseId, unitId, lesson) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (courseId === 'course-id-fail' || !unitId || !lesson) {
        reject({status: 500});
      } else {
        lesson.set('id', 'lesson-id-123');
        resolve(lesson);
      }
    });
  },

  fetchById(courseId, unitId, lessonId) {
    if (courseId && unitId && lessonId) {
      let lesson = Lesson.create(Ember.getOwner(this).ownerInjection(), {
        id: '123',
        sequence: 1,
        taxonomy: [],
        title: 'Sample Lesson Name',
        children: [
          LessonItem.create({
            id: 'collection-123',
            format: 'collection',
            sequence: 1,
            title: 'Collection Title'
          }),
          LessonItem.create({
            id: 'assessment-456',
            format: 'assessment',
            sequence: 2,
            title: 'Assessment Title'
          })
        ]
      });
      return Ember.RSVP.resolve(lesson);
    } else {
      return Ember.RSVP.reject('Fetch failed');
    }
  }
});

moduleForComponent('content/courses/gru-accordion-lesson', 'Integration | Component | content/courses/gru accordion lesson', {
  integration: true,

  beforeEach: function () {
    this.inject.service('i18n');

    this.register('service:api-sdk/lesson', lessonServiceStub);
    this.inject.service('api-sdk/lesson');
  }
});

test('it renders a form for creating a new lesson', function (assert) {

  const lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: ''
    }),
    isEditing: true
  });

  this.set('lesson', lesson);
  this.set('totalItems', 3);
  this.render(hbs`{{content/courses/gru-accordion-lesson model=lesson totalItems=3}}`);

  const $component = this.$('.content.courses.gru-accordion.gru-accordion-lesson');
  assert.ok($component.length, 'Component');
  assert.ok($component.hasClass('edit'), 'Edit class');

  const $heading = $component.find('.edit .panel-heading');
  assert.ok($heading.find('h3').text(), this.get('i18n').t('common.lesson').string + " " + this.get('totalItems'), 'Header prefix');
  assert.equal($heading.find('.actions button').length, 2, 'Unit header action buttons');
  assert.ok($heading.find('.actions button:eq(0)').hasClass('cancel'), 'First button is cancel');
  assert.ok($heading.find('.actions button:eq(1)').hasClass('save'), 'Second button is save');

  const $panelBody = $component.find('.edit .panel-body');
  assert.ok($panelBody.find('> .data-row.standards').length, 'Standards');
});

test('it can create a new lesson', function (assert) {

  var lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: 0
    }),
    isEditing: true
  });

  this.set('lesson', lesson);
  this.set('unitId', 'unit-id-123');
  this.set('courseId', 'course-id-123');
  this.render(hbs`{{content/courses/gru-accordion-lesson
    courseId=courseId
    unitId=unitId
    model=lesson }}`);

  const $component = this.$('.content.courses.gru-accordion.gru-accordion-lesson');
  assert.ok($component.length, 'Component');

  const $saveButton = $component.find('.edit .panel-heading .actions button:eq(1)');
  $saveButton.click();

  lesson = this.get('lesson');
  assert.equal(lesson.get('data.id'), 'lesson-id-123', 'Lesson ID updated after saving');
  assert.equal(lesson.get('isEditing'), false, 'Lesson is no longer editable');
});

test('it shows an error message if it fails to create a new lesson', function (assert) {
  assert.expect(2);

  const context = this;

  // Mock notifications service
  this.register('service:notifications', Ember.Service.extend({
    error(message) {
      assert.equal(message, context.get('i18n').t('common.errors.lesson-not-created').string, 'Notification displayed');
    }
  }));
  this.inject.service('notifications');

  var lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: ''
    }),
    isEditing: true
  });

  this.set('lesson', lesson);
  this.set('unitId', 'unit-id-123');
  this.set('courseId', 'course-id-fail');
  this.render(hbs`{{content/courses/gru-accordion-lesson
    courseId=courseId
    unitId=unitId
    model=lesson }}`);

  const $component = this.$('.content.courses.gru-accordion.gru-accordion-lesson');
  assert.ok($component.length, 'Component');

  const $saveButton = $component.find('.edit .panel-heading .actions button:eq(1)');
  $saveButton.click();
});

test('it renders a form when editing an existing lesson', function (assert) {

  // Unit model
  const lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: '123',
      title: 'Sample Lesson Name',
      taxonomy: [],
      sequence: 3
    }),
    isEditing: true
  });

  this.set('lesson', lesson);
  this.set('index', 2);
  this.render(hbs`{{content/courses/gru-accordion-lesson model=lesson }}`);

  const $component = this.$('.content.courses.gru-accordion.gru-accordion-lesson');
  assert.ok($component.length, 'Component');
  assert.ok($component.hasClass('edit'), 'Edit class');

  const $heading = $component.find('.edit .panel-heading');
  assert.ok($heading.find('h3').text(), this.get('i18n').t('common.lesson').string + " " + this.get('index'), 'Header prefix');
  assert.ok($heading.find('.gru-input.title').text(), lesson.get('data.title'), 'Lesson title');
  assert.equal($heading.find('.actions button').length, 2, 'Lesson header action buttons');
  assert.ok($heading.find('.actions button:eq(0)').hasClass('cancel'), 'First button is cancel');
  assert.ok($heading.find('.actions button:eq(1)').hasClass('save'), 'Second button is save');

  const $panelBody = $component.find('.edit .panel-body');
  assert.ok($panelBody.find('> .data-row.standards').length, 'Standards');
});

test('it triggers an external event when clicking cancel on a new unsaved lesson', function (assert) {
  assert.expect(1);

  const lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: ''
    }),
    isEditing: true
  });

  this.on('externalAction', function () {
    assert.ok(true);
  });

  this.set('lesson', lesson);
  this.render(hbs`{{content/courses/gru-accordion-lesson model=lesson onCancelAddLesson=(action 'externalAction')}}`);

  const $component = this.$('.content.courses.gru-accordion.gru-accordion-lesson');
  $component.find('.edit .actions button.cancel').click();
});

test('it renders the lesson correctly, if the lesson has no collections/assessments -view mode', function (assert) {

  const lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: '123',
      title: 'Sample Lesson Name'
    }),
    isEditing: false
  });

  this.set('lesson', lesson);
  this.set('index', 2);
  this.render(hbs`{{content/courses/gru-accordion-lesson model=lesson index=index}}`);

  const $component = this.$('.content.courses.gru-accordion.gru-accordion-lesson');
  assert.ok($component.length, 'Component');
  assert.ok($component.hasClass('view'), 'View class');

  const $heading = $component.find('.view .panel-heading');
  assert.ok($heading.find('h3').text(), this.get('i18n').t('common.lesson').string + " " + this.get('index'), 'Header prefix');
  assert.ok($heading.find('strong').text(), lesson.get('title'), 'Unit title');
  assert.equal($heading.find('.detail > span').text(), this.get('i18n').t('common.add').string, 'Lesson text');
  assert.equal($heading.find('.actions button').length, 6, 'Unit header action buttons');
  assert.ok($heading.find('.actions button:eq(0)').hasClass('add-item'), 'First button is for adding a lesson');

  // Add dropdown menu
  const $addDropdown = $heading.find('.actions > .dropdown');
  assert.ok($addDropdown.length, 'Add dropdown');
  assert.ok(!$addDropdown.hasClass('open'), 'Add dropdown is closed by default');

  // Click on the add button to open the dropdown menu
  $heading.find('.actions .add-item').click();
  assert.ok($addDropdown.hasClass('open'), 'Add dropdown is open');
  assert.equal($addDropdown.find('.dropdown-menu li').length, 4, 'Dropdown options');

  $heading.find('.actions .add-item').click();
  assert.ok(!$addDropdown.hasClass('open'), 'Add dropdown is closed');

  assert.ok($heading.find('.actions button:eq(1)').hasClass('sort-items'), 'Second button is for reordering the lessons');
  assert.ok($heading.find('.actions button:eq(2)').hasClass('edit-item'), 'Third button is for editing the lesson');
  assert.ok($heading.find('.actions button:eq(3)').hasClass('copy-item'), 'Fourth button is for copying the lesson');
  assert.ok($heading.find('.actions button:eq(4)').hasClass('move-item'), 'Fifth button is for moving the lesson');
  assert.ok($heading.find('.actions button:eq(5)').hasClass('delete-item'), 'Sixth button is for deleting the lesson');

  const $lessonList = $component.find('.view .panel-body ol.accordion-lesson');
  assert.ok($lessonList.length, 'Lesson items list');
  assert.ok(!$lessonList.find('> li.gru-accordion-lesson-item').length, 'No lesson items by default');

  const $addActions = $component.find('.view .panel-body > div');
  assert.ok($addActions.length, 'Add actions container');
  assert.equal($addActions.find('button').length, 4, 'Number of add buttons');
});

test('it expands/collapses the lesson -view mode', function (assert) {

  const lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: '123'
    }),
    isEditing: false,
    isExpanded: false
  });

  this.set('courseId', 'course-id-123');
  this.set('unitId', 'unit-id-123');
  this.set('lesson', lesson);
  this.render(hbs`
    {{content/courses/gru-accordion-lesson
      courseId=courseId
      unitId=unitId
      model=lesson }}
    `);

  const $container = this.$('.content.courses.gru-accordion.gru-accordion-lesson > .view');
  assert.ok($container.length, 'Container');
  assert.ok($container.hasClass('collapsed'), 'Container collapsed');

  $container.find('.panel-heading > h3 > a').click();
  assert.ok($container.hasClass('expanded'), 'Container expanded after clicking header prefix');

  $container.find('.panel-heading > h3 > a').click();
  assert.ok($container.hasClass('collapsed'), 'Container collapsed after clicking header prefix');

  $container.find('.panel-heading > strong > a').click();
  assert.ok($container.hasClass('expanded'), 'Container expanded after clicking header title');

  $container.find('.panel-heading > strong > a').click();
  assert.ok($container.hasClass('collapsed'), 'Container collapsed after clicking header title');
});

test('it loads lesson items and renders them after clicking on the lesson name', function (assert) {
  const lesson = BuilderItem.create({
    data: Lesson.create(Ember.getOwner(this).ownerInjection(), {
      id: '123',
      assessmentCount: 1,
      collectionCount: 1
    }),
    isEditing: false,
    isExpanded: false
  });

  this.set('courseId', 'course-id-123');
  this.set('unitId', 'unit-id-123');
  this.set('lesson', lesson);
  this.set('isLoaded', false);  // Binding to check on the state
  this.render(hbs`
    {{content/courses/gru-accordion-lesson
      courseId=courseId
      unitId=unitId
      model=lesson
      isLoaded=isLoaded }}
    `);

  const $container = this.$('.content.courses.gru-accordion.gru-accordion-lesson > .view');
  assert.ok($container.hasClass('collapsed'), 'Container collapsed');
  assert.ok(!this.get('isLoaded'), 'Data not loaded');

  $container.find('> .panel-heading > strong > a').click();
  assert.ok($container.hasClass('expanded'), 'Container expanded');
  assert.equal($container.find('.accordion-lesson > li.gru-accordion-lesson-item').length, 2, 'Number of lesson items loaded');
  assert.ok(this.get('isLoaded'), 'Data was loaded');
});