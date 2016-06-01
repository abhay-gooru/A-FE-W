import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import TaxonomyItem from 'gooru-web/models/taxonomy/taxonomy-item';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';

moduleForComponent('taxonomy/gru-taxonomy-tag', 'Integration | Component | taxonomy/gru taxonomy tag', {
  integration: true
});

test('it renders a taxonomy tag correctly', function(assert) {

  var taxonomyTag = TaxonomyTag.create({
    isActive: false,
    isReadonly: false,
    isRemovable: false,
    taxonomyItem: TaxonomyItem.create({
      id: "term-123",
      label: "Taxonomy item text",
      caption: "Text caption"
    })
  });
  this.set('taxonomyTag', taxonomyTag);

  this.render(hbs`{{taxonomy/gru-taxonomy-tag model=taxonomyTag}}`);

  const $component = this.$('.taxonomy.gru-taxonomy-tag');
  assert.ok($component.length, 'Component');

  assert.notOk($component.hasClass('active'), 'Active class by default');
  assert.notOk($component.hasClass('read-only'), 'Read only class by default');
  assert.notOk($component.find('button.remove').length, 'Remove button by default');
  assert.ok($component.find('button.toggle').length, 'Toggle button by default');
  assert.equal($component.find('button.toggle > div > b').text(), 'Taxonomy item text', 'Tag label -button');
  assert.equal($component.find('button.toggle > div > span').text(), 'Text caption', 'Tag caption -button');

  this.set('taxonomyTag.isActive', true);
  assert.ok($component.hasClass('active'), 'Active');

  this.set('taxonomyTag.isReadonly', true);
  assert.ok($component.hasClass('read-only'), 'Read-only');
  assert.notOk($component.find('button.toggle').length, 'Toggle button -read-only');
  assert.equal($component.find('> div > b').text(), 'Taxonomy item text', 'Tag label -read-only');
  assert.equal($component.find('> div > span').text(), 'Text caption', 'Tag caption -read-only');

  this.set('taxonomyTag.isRemovable', true);
  assert.ok($component.find('button.remove').length, 'Removable');
});

test('if it is not read-only, it toggles its state and calls an external action when the tag is clicked', function(assert) {
  assert.expect(4);

  var taxonomyTag = TaxonomyTag.create({
    isActive: false,
    taxonomyItem: TaxonomyItem.create({
      id: "term-123",
      label: "Taxonomy item text",
      caption: "Text caption"
    })
  });
  this.set('taxonomyTag', taxonomyTag);

  this.on('externalAction', function(model) {
    assert.ok(true, 'External action called');
    assert.equal(model instanceof TaxonomyTag, true, 'Action parameter');
  });

  this.render(hbs`{{taxonomy/gru-taxonomy-tag model=taxonomyTag onSelect=(action 'externalAction')}}`);

  const $component = this.$('.taxonomy.gru-taxonomy-tag');

  assert.notOk($component.hasClass('active'), 'Active class');

  // Toggle tag's state
  $component.find('button.toggle').click();

  assert.ok($component.hasClass('active'), 'Active class -after toggle');
});

test('it calls an external action when its remove button is clicked', function(assert) {
  assert.expect(2);

  var taxonomyTag = TaxonomyTag.create({
    isRemovable: true,
    taxonomyItem: TaxonomyItem.create({
      id: "term-123",
      label: "Taxonomy item text",
      caption: "Text caption"
    })
  });
  this.set('taxonomyTag', taxonomyTag);

  this.on('externalAction', function(model) {
    assert.ok(true, 'External action called');
    assert.equal(model instanceof TaxonomyTag, true, 'Action parameter');
  });

  this.render(hbs`{{taxonomy/gru-taxonomy-tag model=taxonomyTag onRemove=(action 'externalAction')}}`);

  const $component = this.$('.taxonomy.gru-taxonomy-tag');
  $component.find('button.remove').click();
});