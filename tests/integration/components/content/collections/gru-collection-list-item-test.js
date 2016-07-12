import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Question from 'gooru-web/models/content/question';
import Resource from 'gooru-web/models/content/resource';
import { RESOURCE_TYPES } from 'gooru-web/config/config';
import { QUESTION_CONFIG } from 'gooru-web/config/question';

moduleForComponent('content/collections/gru-collection-list-item', 'Integration | Component | content/collections/gru collection list item', {
  integration: true,

  beforeEach: function () {
    this.inject.service('i18n');
  }
});

test('it renders resources correctly', function (assert) {

  const resource = Resource.create({
    title: 'Resource Title'
  });

  this.set('resource', resource);
  this.set('index', 0);
  this.set('isSorting', false);
  this.render(hbs`{{content/collections/gru-collection-list-item model=resource index=index isSorting=isSorting}}`);

  const $component = this.$('li.content.collections.gru-collection-list-item');
  assert.ok($component.length, 'Component');

  const $container = $component.find('.panel-heading');
  assert.ok($container.find('> h3').text(), 1, 'Index');
  assert.ok($container.find('> a strong').text(), this.get('resource.title'), 'Resource title');
  assert.notOk($container.find('.drag-icon .drag_handle').length, 'Drag icon should be hidden');

  //TODO: check when there are standards
  assert.ok($container.find('> .detail > span').text(), this.get('i18n').t('common.add-standard').string, 'No standards text');

  const $actions = $container.find('> .detail > .actions');
  assert.ok($actions.length, 'Actions container');

  assert.ok($actions.find('button:eq(0)').hasClass('add-item'), 'First action button');
  assert.ok($actions.find('button:eq(1)').hasClass('narration'), 'Second action button');
  assert.ok($actions.find('button:eq(2)').hasClass('delete-item'), 'Third action button');
  assert.ok($actions.find('button:eq(3)').hasClass('copy-to'), 'Fourth action button');
  assert.ok($actions.find('button:eq(4)').hasClass('move-item'), 'Fifth action button');
  assert.ok($actions.find('button:eq(5)').hasClass('copy-item'), 'Sixth action button');
  assert.ok($actions.find('button:eq(6)').hasClass('edit-item'), 'Seventh action button');

  RESOURCE_TYPES.forEach(function(type_string) {

    // Check icons and subtitles specific to each resource type
    Ember.run(() => {
      this.set('resource.format', type_string);
    });
    assert.ok($container.find('> a > i').hasClass(type_string + '-icon'), 'Resource icon');
    assert.ok($container.find('> a span').text(),
      this.get('i18n').t('common.resource').string + ' | ' + this.get('i18n').t('common.resource-format.' + type_string).string, 'Resource subtitle');

  }.bind(this));

  this.set('isSorting', true);
  assert.ok($container.find('.drag-icon .drag_handle').length, 'Drag icon should be appear');

});

test('it renders questions correctly', function (assert) {

  const question = Question.create({
    title: 'Question Title',
    format: 'question'
  });

  this.set('question', question);
  this.set('index', 0);
  this.render(hbs`{{content/collections/gru-collection-list-item model=question index=index}}`);

  const $component = this.$('li.content.collections.gru-collection-list-item');
  assert.ok($component.length, 'Component');

  const $container = $component.find('.panel-heading');
  assert.ok($container.find('> h3').text(), 1, 'Index');
  assert.ok($container.find('> a > i').hasClass('question-icon'), 'Question icon');
  assert.ok($container.find('> a strong').text(), this.get('question.title'), 'Question title');

  //TODO: check when there are standards
  assert.ok($container.find('> .detail > span').text(), this.get('i18n').t('common.add-standard').string, 'No standards text');

  const $actions = $container.find('> .detail > .actions');
  assert.ok($actions.length, 'Actions container');

  assert.ok($actions.find('button:eq(0)').hasClass('add-item'), 'First action button');
  assert.ok($actions.find('button:eq(1)').hasClass('narration'), 'Second action button');
  assert.ok($actions.find('button:eq(2)').hasClass('delete-item'), 'Third action button');
  assert.ok($actions.find('button:eq(3)').hasClass('copy-to'), 'Fourth action button');
  assert.ok($actions.find('button:eq(4)').hasClass('move-item'), 'Fifth action button');
  assert.ok($actions.find('button:eq(5)').hasClass('copy-item'), 'Sixth action button');
  assert.ok($actions.find('button:eq(6)').hasClass('edit-item'), 'Seventh action button');

  Object.keys(QUESTION_CONFIG).forEach(function(question_type) {
    // Check subtitle specific to each question type
    Ember.run(() => {
      this.set('question.type', question_type);
    });

    assert.ok($container.find('> a span').text(),
      this.get('i18n').t('common.question').string + ' | ' + this.get('i18n').t('common.question-type.' + question_type).string, 'Question subtitle');
  }.bind(this));

});

test('it expands/collapses the narration panel', function (assert) {

  const question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question Title',
    format: 'question'
  });

  this.set('question', question);
  this.set('index', 0);
  this.render(hbs`{{content/collections/gru-collection-list-item model=question index=index}}`);

  const $panel = this.$('li.content.collections.gru-collection-list-item > .panel');
  assert.ok($panel.length, 'Panel');
  assert.ok($panel.hasClass('collapsed'), 'Panel collapsed');

  $panel.find('.detail.visible .actions button.narration i').click();

  assert.ok($panel.hasClass('expanded'), 'Narration Panel expanded after clicking narration button');

  assert.ok($panel.find('> .panel-body').length, 'panel body');

  assert.ok($panel.find('> .panel-body .narration .gru-textarea').length, 'Narration Field');

  $panel.find('.detail .actions .narration').click();
  assert.ok($panel.hasClass('collapsed'), 'Narration Panel collapsed after clicking narration button');

});

test('it expands/collapses the edit question inline panel', function (assert) {

  const question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question Title',
    format: 'question'
  });

  this.set('question', question);
  this.set('index', 0);
  this.render(hbs`{{content/collections/gru-collection-list-item model=question index=index}}`);

  const $panel = this.$('li.content.collections.gru-collection-list-item > .panel');
  assert.ok($panel.length, 'Panel');
  assert.ok($panel.hasClass('collapsed'), 'Panel collapsed');

  $panel.find('.detail.visible .actions button.edit-item i').click();

  assert.ok($panel.hasClass('expanded'), 'Edit Question Panel expanded after clicking edit button');

  const $panelBody = $panel.find('> .panel-body');

  assert.ok($panelBody.length, 'panel body');

  assert.ok($panelBody.find('.question h3').length, "Missing Question label");
  assert.ok($panelBody.find('.question textarea').length, "Missing text area");
  assert.ok($panelBody.find('.question .add-image').length, "Missing add image button");
  assert.ok($panelBody.find('.answers h3').length, "Missing Answer label");
  assert.ok($panelBody.find('.answers .instructions').length, "Missing Answer Instructions");

  const $actions = $panelBody.find('.actions');
  assert.ok($actions.length, 'Actions container');

  assert.ok($actions.find('button:eq(0)').hasClass('cancel'), 'First action button');
  assert.ok($actions.find('button:eq(1)').hasClass('save'), 'Second action button');

  $panel.find('.detail .actions .cancel').click();
  assert.ok($panel.hasClass('collapsed'), 'Edit Question Panel collapsed after clicking cancel button');

});

test('it expands/collapses the edit resource inline panel', function (assert) {

  const resource = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question Title',
    format: 'resource'
  });

  this.set('resource', resource);
  this.set('index', 0);
  this.render(hbs`{{content/collections/gru-collection-list-item model=resource index=index}}`);

  const $panel = this.$('li.content.collections.gru-collection-list-item > .panel');
  assert.ok($panel.length, 'Panel');
  assert.ok($panel.hasClass('collapsed'), 'Panel collapsed');

  $panel.find('.detail.visible .actions button.edit-item i').click();

  assert.ok($panel.hasClass('expanded'), 'Edit Resource Panel expanded after clicking edit button');

  const $panelBody = $panel.find('> .panel-body');

  assert.ok($panelBody.length, 'panel body');

  assert.ok($panelBody.find('.narration .gru-textarea').length, 'Narration Field');

  const $actions = $panelBody.find('.actions');
  assert.ok($actions.length, 'Actions container');

  assert.ok($actions.find('button:eq(0)').hasClass('cancel'), 'First action button');
  assert.ok($actions.find('button:eq(1)').hasClass('save'), 'Second action button');

  $panel.find('.detail .actions .cancel').click();
  assert.ok($panel.hasClass('collapsed'), 'Edit Resource Panel collapsed after clicking cancel button');

});
