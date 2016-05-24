import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'gooru-web/tests/helpers/assert';
import QuestionResult from 'gooru-web/models/result/question';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player/gru-navigator', 'Integration | Component | player/gru navigator', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale","en");
  }
});

test('Player Navigator', function(assert) {

  assert.expect(11);

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
    lastVisitedResource: resourceMockB,
    getResourceById: function(id){
      if(id === '1'){
        return resourceMockA;
      }else if (id ==='2'){ return resourceMockB;}
    }
  });

  const resourceResults = Ember.A([
    QuestionResult.create({ resource: resourceMockA }),
    QuestionResult.create({ resource: resourceMockB })
  ]);

  this.set('collection', collectionMock);
  this.set('resourceResults', resourceResults);

  this.on('itemSelected', function(resource) {
    assert.equal(resource.get("id"), '1', "Incorrect selected resource item id");
  });

  this.render(hbs`{{player.gru-navigator collection=collection
      resourceResults=resourceResults lessonTitle='E-Lesson1'
      selectedResourceId='1' onItemSelected='itemSelected'}}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find(".gru-navigator");
  T.exists(assert, $navigator, "Missing navigator section");

  //$navigatorHeader
  const $navigatorHeader = $component.find(".gru-navigator .navigator-header");
  T.exists(assert, $navigatorHeader.find(".lesson-title"), "Missing lesson title");

  //$navigatorSubheader
  const $navigatorSubheader = $component.find(".gru-navigator .navigator-subheader");
  T.exists(assert, $navigatorSubheader.find(".collection-type"), "Missing collection type");
  T.exists(assert, $navigatorSubheader.find(".collection-title"), "Missing collection title");

  //$collectionResources list
  const $collectionResources = $navigator.find(".resources");
  T.exists(assert, $collectionResources, "Missing collection resources");
  const $resourceItems = $collectionResources.find("li.list-group-item");
  assert.equal($resourceItems.length, 2, "Missing resources with list-group-item class");
  const $firstResourceItem = $collectionResources.find("li.list-group-item:eq(0)");
  T.exists(assert, $firstResourceItem.find(".resources-info"), "Missing resources info");
  T.exists(assert, $firstResourceItem.find(".resources-info .bubble-type.question"), "Missing question class type");
  assert.equal(T.text($firstResourceItem.find(".resources-info .title.visible-sm")), "Resource #1", "Wrong item text");

  //$resourceItem Selected
  let $selected = $navigator.find(".list-group-item:eq(0).selected");
  T.exists(assert, $selected, "Incorrect selected resource 1");


});

test('Layout when navigator is closed', function(assert) {
  assert.expect(2);

  this.on('parentAction', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/gru-navigator onCloseNavigator='parentAction' lessonTitle='E-Lesson1'}}`);
  var $component = this.$(); //component dom element
  var $menuButton = $component.find(".hamburger-icon");

  assert.ok($menuButton, "Missing menu button");
  $menuButton.click();

});

test('Player Navigator keyup on left', function(assert) {

  assert.expect(2);

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
    lastVisitedResource: resourceMockB,
    getResourceById: function(id){
      if(id === '1'){
        return resourceMockA;
      }else if (id ==='2'){ return resourceMockB;}
    },
    nextResource(resource){
      if(resource.id==='1'){
        return resourceMockB;
      }
    },
    prevResource(resource){
      if(resource.id==='2'){
        return resourceMockA;
      }
    }
  });

  this.on('itemSelected', function(resource) {
    assert.equal(resource.get("id"), '1', "Incorrect selected resource item id");
  });

  const resourceResults = Ember.A([
    QuestionResult.create({ resource: resourceMockA }),
    QuestionResult.create({ resource: resourceMockB })
  ]);

  this.set('resourceResults', resourceResults);
  this.set('collection', collectionMock);



  this.render(hbs`{{player.gru-navigator resourceResults=resourceResults
        onItemSelected='itemSelected' lessonTitle='E-Lesson1'
        collection=collection selectedResourceId='2'}}`);

  let $component = this.$(); //component dom element

  const $navigator = $component.find(".gru-navigator");
  let $selected = $navigator.find(".list-group-item:eq(1).selected");
  T.exists(assert, $selected, "Incorrect selected resource 2");
  let e = $.Event('keyup');

  e.which = 37; //Right arrow Character
  $navigator.trigger(e);

});


test('Player Navigator keyup on right', function(assert) {

  assert.expect(2);

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
    lastVisitedResource: resourceMockB,
    getResourceById: function(id){
      if(id === '1'){
        return resourceMockA;
      }else if (id ==='2'){ return resourceMockB;}
    },
    nextResource(resource){
      if(resource.id==='1'){
        return resourceMockB;
      }
    },
    prevResource(resource){
      if(resource.id==='2'){
        return resourceMockA;
      }
    }
  });

  this.on('itemSelected', function(item) {
    assert.equal(item.get("id"), '2', "Incorrect selected resource item id");
  });

  const resourceResults = Ember.A([
    QuestionResult.create({ resource: resourceMockA }),
    QuestionResult.create({ resource: resourceMockB })
  ]);

  this.set('resourceResults', resourceResults);

  this.set('collection', collectionMock);

  this.render(hbs`{{player.gru-navigator resourceResults=resourceResults
        onItemSelected='itemSelected' lessonTitle='E-Lesson1'
        collection=collection selectedResourceId='1'}}`);

  let $component = this.$(); //component dom element

  const $navigator = $component.find(".gru-navigator");
  let $selected = $navigator.find(".list-group-item:eq(0).selected");
  T.exists(assert, $selected, "Incorrect selected resource 1");
  let e = $.Event('keyup');

  e.which = 39; //Right arrow Character
  $navigator.trigger(e);


});
test('Close player', function(assert) {
  assert.expect(1);

  this.on('parentAction', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/gru-navigator onClosePlayer='parentAction' lessonTitle='E-Lesson1'}}`);
  var $component = this.$(); //component dom element
  var $closeButton = $component.find(".gru-navigator .navigator-header div:first-child");
  $closeButton.click();
});

test('See usage report', function(assert) {
  assert.expect(2);

  const collection = Ember.Object.create({
    isCollection: true
  });

  this.set("collection", collection);
  this.on('parentAction', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/gru-navigator collection=collection onFinishCollection='parentAction' lessonTitle='E-Lesson1'}}`);
  var $component = this.$(); //component dom element
  var $seeReportButton = $component.find(".gru-navigator .see-usage-report");
  assert.ok($seeReportButton.length, "Missing button");
  $seeReportButton.click();
});

