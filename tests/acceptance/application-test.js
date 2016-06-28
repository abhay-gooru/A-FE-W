import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | application', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'token-value',
      user: {
        gooruUId: 'anonymous'
      }
    });
  }
});

test('searchTerm: Search box navigation', function(assert) {
  visit('/');

  andThen(function() {
    assert.expect(2); //making sure all asserts are called

    assert.equal(currentURL(), '/');

    const $appHeader = find('.gru-header');
    const $searchInput = $appHeader.find(".search-input");

    fillIn($searchInput, 'europe');
    $searchInput.val('europe');
    $searchInput.change();

    $appHeader.find('form').submit();

    andThen(function(){

      assert.equal(currentURL(), '/search/collections?term=europe');
    });
  });
});

test('Theme support - no theme', function(assert) {
  visit('/');

  andThen(function() {
    assert.expect(3); //making sure all asserts are called

    assert.equal(currentURL(), '/');

    assert.ok(!Ember.$("html").attr("id"), "Html element should have no id");

    const $styleLink = Ember.$("#theme-style-link");
    T.notExists(assert, $styleLink, "Link element should not be added");

  });
});

test('Theme support - Having translations and styles url', function(assert) {
  visit('/?themeId=edify');

  andThen(function() {
    assert.expect(4); //making sure all asserts are called

    assert.equal(currentURL(), '/?themeId=edify');

    T.exists(assert, Ember.$("#edify"), "Missing html element having theme id");

    const $styleLink = Ember.$("#theme-style-link");
    T.exists(assert, $styleLink, "Missing link element having theme style");
    assert.equal($styleLink.attr("href"), "themes/edify/styles.css", "Wrong style url");

  });
});

test('Legacy uri collection-play with no content id', function (assert) {
  visit("/#collection-play&id=76cb53df-1f6a-41f2-a31d-c75876c6bcf9");
  andThen(function() {
    assert.equal(currentURL(), '/player/76cb53df-1f6a-41f2-a31d-c75876c6bcf9?resourceId=9ddc7da1-bcb1-4ba6-9bfd-b703999f6ec1');
  });
});

test('Legacy uri collection-play with content id', function (assert) {
  visit("/#collection-play&id=76cb53df-1f6a-41f2-a31d-c75876c6bcf9&cid=f86f874c-efc9-4100-9cf7-55eb86ec95ae");
  andThen(function() {
    assert.equal(currentURL(), '/player/76cb53df-1f6a-41f2-a31d-c75876c6bcf9?resourceId=f86f874c-efc9-4100-9cf7-55eb86ec95ae');
  });
});

test('Legacy uri assessment-play with no content id', function (assert) {
  visit("/#assessment-play&id=76cb53df-1f6a-41f2-a31d-c75876c6bcf9");
  andThen(function() {
    assert.equal(currentURL(), '/player/76cb53df-1f6a-41f2-a31d-c75876c6bcf9?resourceId=9ddc7da1-bcb1-4ba6-9bfd-b703999f6ec1');
  });
});

test('Legacy uri assessment-play with content id', function (assert) {
  visit("/#assessment-play&id=76cb53df-1f6a-41f2-a31d-c75876c6bcf9&cid=f86f874c-efc9-4100-9cf7-55eb86ec95ae");
  andThen(function() {
    assert.equal(currentURL(), '/player/76cb53df-1f6a-41f2-a31d-c75876c6bcf9?resourceId=f86f874c-efc9-4100-9cf7-55eb86ec95ae');
  });
});

test('Legacy uri resource-play', function (assert) {
  visit("/#resource-play&id=76cb53df-1f6a-41f2-a31d-c75876c6bcf9");
  andThen(function() {
    assert.equal(currentURL(), '/content/resources/play/76cb53df-1f6a-41f2-a31d-c75876c6bcf9');
  });
});

test('Legacy uri profile', function (assert) {
  visit("/#id-for-pochita");
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/courses');
  });
});

test('Trying the google sign in url', function (assert) {
  visit("/?access_token=google-sign-token");
  andThen(function() {
    assert.equal(currentURL(), '/sign-up-finish');
  });
});
