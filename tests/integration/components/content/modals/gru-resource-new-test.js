import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Resource from 'gooru-web/models/content/resource';

moduleForComponent('content/modals/gru-resource-new', 'Integration | Component | content/modals/gru resource new', {
  integration: true,
  beforeEach: function () {
    this.inject.service('i18n');

  }
});

test('New Resource Layout', function(assert) {
  this.render(hbs`{{content/modals/gru-resource-new}}`);

  const $component = this.$(".gru-resource-new");
  assert.ok($component, 'Missing Component');
  assert.ok($component.find('h4.modal-title'), 'Missing Title');
  assert.ok($component.find('.icon .link'), 'Missing link icon');
  assert.equal($component.find('h4.modal-title').text(), this.get('i18n').t('common.add-new-resource').string, 'Incorrect Title');
  assert.ok($component.find('label.url-label span').length, 'Missing URL label');
  assert.equal($component.find('.header-add-url span.title').text(), this.get('i18n').t('common.add-from-url').string, 'Incorrect Add URL Label');
  assert.equal($component.find('label.url-label span').text(), this.get('i18n').t('common.enter-url').string, 'Incorrect Enter URL Label');
  assert.ok($component.find('label.url-label input').length, 'Missing Title Input');
  assert.ok($component.find('label.title-label span').length, 'Missing Title label');
  assert.equal($component.find('label.title-label span').text(), this.get('i18n').t('common.resource-title').string, 'Incorrect Resource Title Label');
  assert.ok($component.find('label.title-label input').length, 'Missing Title Input');
  assert.ok($component.find('.actions button.cancel-btn').length, 'Missing Cancel Button');
  assert.ok($component.find('.actions button.more-btn').length, 'Missing More Details Button');
  assert.ok($component.find('.actions button.add-btn').length, 'Missing Add Button');
});

test('New Resource Layout - Existing resource', function(assert) {
  const resource = Resource.create({
    title: "My Resource",
    format: "video"
  });

  this.set("resource", resource);

  this.render(hbs`{{content/modals/gru-resource-new existingResource=resource}}`);

  const $component = this.$(".gru-resource-new");
  assert.ok(!$component.find('.actions button.add-btn').length, 'Add Button should not be visible');
  assert.ok(!$component.find('.actions button.cancel-btn').length, 'Cancel Button should not be visible');
  assert.ok($component.find('.actions button.close-btn').length, 'Missing Close Button');
  assert.ok($component.find('.gru-resource-card').length, 'Missing Resource Card');
});

test('Validate if the resource URL is left blank', function (assert) {
  assert.expect(3);

  this.render(hbs`{{content/modals/gru-resource-new}}`);

  const $component = this.$('.gru-resource-new');
  const $titleField = $component.find(".gru-input.url");

  assert.ok(!$titleField.find(".error-messages .error").length, 'URL error message not visible');

  // Try submitting without filling in data
  $component.find(".actions button[type='submit']").click();

  return wait().then(function () {

    assert.ok($titleField.find(".error-messages .error").length, 'URL error should be visible');
    // Fill in the input field
    $titleField.find("input").val('http://goorutesting.com');
    $titleField.find("input").blur();

    return wait().then(function () {
      assert.ok(!$titleField.find(".error-messages .error").length, 'URL error message was hidden');
    });
  });
});

test('Validate if the resource URL field has only whitespaces', function (assert) {
  assert.expect(3);

  this.render(hbs`{{content/modals/gru-resource-new}}`);

  const $component = this.$('.gru-resource-new');
  const $titleField = $component.find(".gru-input.url");

  assert.ok(!$titleField.find(".error-messages .error").length, 'URL error message not visible');

  // Try submitting without filling in data
  $component.find(".actions button[type='submit']").click();

  return wait().then(function () {

    assert.ok($titleField.find(".error-messages .error").length, 'URL error should be visible');
    // Fill in the input field
    $titleField.find("input").val(' ');
    $component.find(".actions button[type='submit']").click();

    return wait().then(function () {
      assert.ok($titleField.find(".error-messages .error").length, 'URL error message should be visible');
    });
  });
});
test('Validate invalid URL', function (assert) {
  assert.expect(3);

  this.render(hbs`{{content/modals/gru-resource-new}}`);

  const $component = this.$('.gru-resource-new');
  const $titleField = $component.find(".gru-input.url");

  assert.ok(!$titleField.find(".error-messages .error").length, 'URL error message not visible');

  // Try submitting without filling in data
  $component.find(".actions button[type='submit']").click();

  return wait().then(function () {

    assert.ok($titleField.find(".error-messages .error").length, 'URL error should be visible');
    // Fill in the input field
    $titleField.find("input").val('kkkk');
    $component.find(".actions button[type='submit']").click();

    return wait().then(function () {
      assert.ok($titleField.find(".error-messages .error").length, 'URL error message should be visible');
    });
  });
});
test('Validate if the resource Title is left blank', function (assert) {
  assert.expect(3);

  this.render(hbs`{{content/modals/gru-resource-new}}`);

  const $component = this.$('.gru-resource-new');
  const $titleField = $component.find(".gru-input.title");

  assert.ok(!$titleField.find(".error-messages .error").length, 'Title error message not visible');

  // Try submitting without filling in data
  $component.find(".actions button[type='submit']").click();

  return wait().then(function () {

    assert.ok($titleField.find(".error-messages .error").length, 'Title error should be visible');
    // Fill in the input field
    $titleField.find("input").val('Title');
    $titleField.find("input").blur();

    return wait().then(function () {
      assert.ok(!$titleField.find(".error-messages .error").length, 'Title error message was hidden');
    });
  });
});

test('Validate if the resource Title field has only whitespaces', function (assert) {
  assert.expect(3);

  this.render(hbs`{{content/modals/gru-resource-new}}`);

  const $component = this.$('.gru-resource-new');
  const $titleField = $component.find(".gru-input.title");

  assert.ok(!$titleField.find(".error-messages .error").length, 'Title error message not visible');

  // Try submitting without filling in data
  $component.find(".actions button[type='submit']").click();

  return wait().then(function () {

    assert.ok($titleField.find(".error-messages .error").length, 'Title error should be visible');
    // Fill in the input field
    $titleField.find("input").val(' ');
    $component.find(".actions button[type='submit']").click();

    return wait().then(function () {
      assert.ok($titleField.find(".error-messages .error").length, 'Title error message should be visible');
    });
  });
});
test('Validate the character limit in the Resource title field', function (assert) {
  assert.expect(1);

  this.render(hbs`{{content/modals/gru-resource-new}}`);

  const $component = this.$('.gru-resource-new');
  const $titleField = $component.find(".gru-input.title");

  $titleField.find("input").val('123456790123456790123456790123456790123456790extra');
  $titleField.find("input").blur();

  assert.equal($titleField.find("input").val().length,50, "Incorrect number of incorrect characters");
});
