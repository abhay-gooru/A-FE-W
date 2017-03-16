import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent('content/rubric/gru-scoring-levels', 'Integration | Component | content/rubric/gru scoring levels', {
  integration: true
});

test('Layout', function(assert) {
  this.render(hbs`{{content/rubric/gru-scoring-levels}}`);
  var $component = this.$();
  assert.ok($component.find('.content.rubric.gru-scoring-levels').length,'Missing scoring levels component');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level span').length,'Missing levels title');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .gru-switch').length,'Missing levels switch');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels .scale').length,'Missing scale');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels .scale span.best').length,'Missing best label');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels .scale .line').length,'Missing line');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels .scale .arrow-down').length,'Missing arrow');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels .scale .worst').length,'Missing worst label');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels .scale .worst').length,'Missing worst label');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels .level-list').length,'Missing level list');
  assert.equal($component.find('.content.rubric.gru-scoring-levels .level .levels .level-list .gru-input').length,4,'Should have 4 levels');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .btn-new-level').length,'Missing add new level button');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .points').length,'Missing points section');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .points span').length,'Missing points title');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .points .gru-switch').length,'Missing points switch');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .points .point-list').length,'Missing points list');
  assert.equal($component.find('.content.rubric.gru-scoring-levels .points .point-list .gru-input').length,4,'Should have 4 point inputs');
});

test('Delete Scoring Level', function(assert) {
  this.render(hbs`{{content/rubric/gru-scoring-levels}}`);
  var $component = this.$();
  assert.ok($component.find('.content.rubric.gru-scoring-levels').length,'Missing scoring levels component');
  assert.equal($component.find('.content.rubric.gru-scoring-levels .delete-levels .btn.delete').length,4,'Should have 4 delete buttons');
  var $firstLevelDeleteBtn = $component.find('.content.rubric.gru-scoring-levels .delete-levels .btn.delete:eq(0)');
  var done = assert.async();
  Ember.run.later(function(){
    $firstLevelDeleteBtn.click();
    done();
  }, 300);
  return wait().then(function () {
    assert.equal($component.find('.content.rubric.gru-scoring-levels .points .point-list .gru-input').length,3,'Should have 3 levels');
  });
});

test('Disabled scoring', function(assert) {
  this.render(hbs`{{content/rubric/gru-scoring-levels}}`);
  var $component = this.$();
  assert.ok($component.find('.content.rubric.gru-scoring-levels').length,'Missing scoring levels component');
  var $scoringSwitch = $component.find('.content.rubric.gru-scoring-levels .points .gru-switch a input');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .points .point-list').length,'Scoring should appear');
  var done = assert.async();
  Ember.run.later(function(){
    $scoringSwitch.click();
    done();
  }, 300);
  return wait().then(function () {
    assert.notOk($component.find('.content.rubric.gru-scoring-levels .points .point-list').length,'Scoring should not appear');
  });
});

test('Disabled level', function(assert) {
  this.render(hbs`{{content/rubric/gru-scoring-levels}}`);
  var $component = this.$();
  assert.ok($component.find('.content.rubric.gru-scoring-levels').length,'Missing scoring levels component');
  var $levelSwitch = $component.find('.content.rubric.gru-scoring-levels .level .gru-switch a input');
  assert.ok($component.find('.content.rubric.gru-scoring-levels .level .levels').length,'Levels should appear');
  var done = assert.async();
  Ember.run.later(function(){
    $levelSwitch.click();
    done();
  }, 300);
  return wait().then(function () {
    assert.notOk($component.find('.content.rubric.gru-scoring-levels .level .levels').length,'Levels should not appear');
  });
});
