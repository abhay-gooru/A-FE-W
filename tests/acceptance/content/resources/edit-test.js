import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | Edit Resource', {
  beforeEach: function () {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'profile-token',
      user: {
        gooruUId: 'pochita'
      }
    });
  }
});

test('Layout', function (assert) {
  visit('/content/resources/edit/123');

  andThen(function () {
    assert.equal(currentURL(), '/content/resources/edit/123');

    var $container = find(".controller.content.resources.edit");
    assert.ok($container.length, "Container");
    assert.ok($container.find('> article').length, "Article");
    assert.ok($container.find('> aside').length, "Aside");
  });
});
