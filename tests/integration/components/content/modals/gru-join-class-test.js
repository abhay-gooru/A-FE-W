import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('content/modals/gru-join-class', 'Integration | Component | content/modals/gru join class', {
  integration: true
});

test('Layout', function (assert) {

  this.render(hbs`{{content/modals/gru-join-class}}`);

  const $component = this.$('.content.modal.gru-join-class');
  assert.ok($component.length, 'Component classes');

  const $header = $component.find('.modal-header');
  assert.ok($header.length, 'Header');
  assert.ok($header.find('h3.modal-title').length, 'Header title');
  assert.ok($header.find('p.lead').length, 'Header message');

  const $body = $component.find('.modal-body');
  assert.ok($body.length, 'Body');

  assert.ok($body.find('.class-code-input-container .control-label').length, 'Class code label');
  assert.ok($body.find('.join-terms-and-conditions').length, 'Terms and conditions field');

  const $footer = $component.find('.modal-footer');


  assert.equal($footer.find('a').length, 2, 'Number of action buttons');
  assert.ok($footer.find('a.back-cta').length, 'Not now button');
  assert.ok($footer.find('a.btn').length, 'Join class button');
});
