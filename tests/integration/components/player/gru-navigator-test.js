import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'gooru-web/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player/gru-navigator', 'Integration | Component | player/gru navigator', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale","en");
  }
});

test('Player Navigator', function(assert) {

  assert.expect(8);

  const resourceMockA = Ember.Object.create({
    id: '1',
    title: '<p>Resource #1</p>',
    resourceFormat: 'question',
    "isQuestion": true
  });

  const resourceMockB = Ember.Object.create({
    id: '2',
    title: 'Resource #2',
    resourceFormat: 'webpage',
    "isQuestion": false
  });

  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    resources: Ember.A([
      resourceMockA,
      resourceMockB
    ]),
    lastVisitedResource: resourceMockB
  });

  this.set('collection', collectionMock);

  this.on('itemSelected', function(item) {
    assert.equal(item.id, '1', "Incorrect selected resource item id");
  });

  this.render(hbs`{{player.gru-navigator collection=collection selectedResourceId='1' onItemSelected='itemSelected'}}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find(".gru-navigator");
  T.exists(assert, $navigator, "Missing navigator section");
  T.exists(assert, $navigator.find("h2"), "Missing collection title");

  //$collectionResources list
  const $collectionResources = $navigator.find(".resources");
  T.exists(assert, $collectionResources, "Missing collection resources");
  const $resourceItems = $collectionResources.find("li.list-group-item");
  assert.equal($resourceItems.length, 2, "Missing resources with list-group-item class");
  const $firstResourceItem = $collectionResources.find("li.list-group-item:eq(0)");
  T.exists(assert, $firstResourceItem.find(".resources-info"), "Missing resources info");
  T.exists(assert, $firstResourceItem.find(".resources-info .bubble-type.question"), "Missing question class type");
  assert.equal(T.text($firstResourceItem.find(".resources-info .title")), "Resource #1", "Wrong item text");

  //$resourceItem Selected
  T.exists(assert, $collectionResources.find("li#item_1.selected"), "Missing selected resource item");


});

test('Layout when navigator is closed', function(assert) {
  assert.expect(2);

  this.on('parentAction', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/gru-navigator onCloseNavigator='parentAction'}}`);
  var $component = this.$(); //component dom element
  var $menuButton = $component.find(".hamburger-icon");

  assert.ok($menuButton, "Missing menu button");
  $menuButton.click();

});