import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent('content/questions/answers/gru-multiple-choice', 'Integration | Component | content/questions/answers/gru multiple choice', {
  integration: true
});

test('Multiple choice answer layout', function(assert) {
  this.render(hbs`{{content/questions/answers/gru-multiple-choice}}`);
  var $component = this.$(); //component dom element
  const $newAnswer = $component.find('div.add-answer a');
  assert.ok($newAnswer.length, "Add new answer choice button missing");
  $newAnswer.click();
  return wait().then(function () {
    const $option = $component.find('.multiple-choice');
    assert.ok($option.length, "New answer missing");
    assert.ok($option.find('.letter-container'), "Answer letter missing");
    assert.ok($option.find('.delete i.delete'), "Delete button missing");
    assert.ok($option.find('.check'), "Correct  button missing");
    const $check = $component.find('.check');
    $check.click();
    return wait().then(function () {
      assert.ok($option.find('.check.correct'), "The answer should be correct");
    });
  });
});

test('Load a list of answers and add new answer', function(assert) {
  const multipleChoiceAnswers = Ember.A([Ember.Object.create({
    'answer': "Option A",
    'isCorrect': true
  }), Ember.Object.create({
    'answer': "Option B",
    'isCorrect': false
  })]);
  this.set('multipleChoiceAnswers', multipleChoiceAnswers);

  this.render(hbs`{{content/questions/answers/gru-multiple-choice multipleChoiceAnswers=multipleChoiceAnswers}}`);
  var $component = this.$(); //component dom element
  var $option = $component.find('.multiple-choice');
  assert.equal($option.length,2, "Incorrect number of answers options");
  const $newAnswer = $component.find('div.add-answer a');
  $newAnswer.click();
  return wait().then(function () {
    var $option = $component.find('.multiple-choice');
    assert.equal($option.length,3, "Incorrect number of answer");
  });
});

test('Delete answer', function(assert) {
  const multipleChoiceAnswers = Ember.A([Ember.Object.create({
    'answer': "Option A",
    'isCorrect': true
  }), Ember.Object.create({
    'answer': "Option B",
    'isCorrect': false
  })]);
  this.set('multipleChoiceAnswers', multipleChoiceAnswers);

  this.render(hbs`{{content/questions/answers/gru-multiple-choice multipleChoiceAnswers=multipleChoiceAnswers}}`);
  var $component = this.$(); //component dom element
  var $option = $component.find('.multiple-choice');
  assert.equal($option.length,2, "Incorrect number of answer options");
  const $delete = $component.find('.multiple-choice:nth-child(1) .delete');
  $delete.click();
  return wait().then(function () {
    var $option = $component.find('.multiple-choice');
    assert.equal($option.length,1, "Incorrect number of answer");
  });
});

test('Correct answer', function(assert) {
  const multipleChoiceAnswers = Ember.A([Ember.Object.create({
    'answer': "Option A",
    'isCorrect': true
  }), Ember.Object.create({
    'answer': "Option B",
    'isCorrect': false
  })]);
  this.set('multipleChoiceAnswers', multipleChoiceAnswers);

  this.render(hbs`{{content/questions/answers/gru-multiple-choice multipleChoiceAnswers=multipleChoiceAnswers}}`);
  var $component = this.$(); //component dom element
  assert.equal($component.find('.check.correct').length,1, "Incorrect number of correct answer");
  var $option = $component.find('.multiple-choice:nth-child(1)');
  const $check = $option.find('.check');
  $check.click();
  return wait().then(function () {
    assert.equal( $component.find('.check.correct').length,1, "Incorrect number of correct answer");
  });
});