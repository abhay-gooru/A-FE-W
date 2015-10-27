import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent('collection-results', 'Integration | Component | collection results', {
    integration: true,
    beforeEach: function () {
        this.container.lookup('service:i18n').set("locale","en");
    }
});

test('collections layout', function(assert) {

    const results = Ember.A();

    const itemsResources = Ember.A();
    itemsResources.addObject(Ember.Object.create({ name: "Preparing the Learner", image: "http://cdn.goorulearning.org/prod1/f000/2137/8066/b9396c20-90f6-4bc1-b434-a39386f5e7b3_0480a001-2070-40b9-b211-ef67638a33d0.jpg", type: "text"}));
    itemsResources.addObject(Ember.Object.create({ name: "Activity 2and 3", image:"", type: "text"}));

    const itemsStandards = Ember.A();
    itemsStandards.addObject(Ember.Object.create({ name: "CCSS.ELA-Literacy.RI.9-10.6", description: "Demostrate command of the conventions"}));
    itemsStandards.addObject(Ember.Object.create({ name: "CCSS.ELA-Literacy.RI.9-10.2", description: "Demostrate command of the conventions"}));

    results.addObject(Ember.Object.create({
        id: 1,
        remixes: 4,
        views: 53,
        title: "1.1 Variables and Expressions",
        image: "http://www.goorulearning.org/images/default-collection-image-160x120.png",
        url: "http://www.goorulearning.org/#collection-play&id=e6e392e5-e025-4458-9e7e-c4d148eb6b1b",
        author: "TCPMathLab",
        authorImage: "http://profile-images.goorulearning.org.s3.amazonaws.com/2341faae-16db-4f59-8418-f8c83a3e845b.png",
        profilePageUrl: "http://www.goorulearning.org/#collection-play&id=e6e392e5-e025-4458-9e7e-c4d148eb6b1b",
        description: "The summative assessment for this unit has students analyzing the use of irony in a short story, summarizing an opinion ...",
        resources: itemsResources,
        standards: ''
    }));
    results.addObject(Ember.Object.create({
        id: 2,
        remixes: 6,
        views: 253,
        title: "Types of Poetry",
        image: "http://cdn.goorulearning.org/prod1/f000/2084/1115/009621fb-2a5f-499f-9d85-d119a92bf9c6_696302d8-b2ef-4691-9363-2e9e09b6ba83-160x120.jpg",
        url: "http://www.goorulearning.org/#collection-play&id=e6e392e5-e025-4458-9e7e-c4d148eb6b1b",
        author: "vbowley and",
        authorImage: " http://profile-images.goorulearning.org.s3.amazonaws.com/a8fc5310-c296-49d1-9fc8-8d34b54f9ad8.png",
        profilePageUrl: "http://www.goorulearning.org/#profilepage&id=a8fc5310-c296-49d1-9fc8-8d34b54f9ad8&user=vbowley",
        description: "Students will review the literary element of satire. Students will use the information in this collection to synthesize ...",
        resources: itemsResources,
        standards: itemsStandards
    }));

    this.set('results', results);
    assert.expect(17);

    this.render(hbs`{{collection-results results=results}}`); //render the component
    var $component = this.$(); //component dom element
    const $collectionResults = $component.find(".collection-results");

    T.exists(assert, $collectionResults, "Missing collection results");

    const $searchResults =$component.find('.search-results');
    T.exists(assert, $searchResults, "Missing search results");

    const $collectionRemixes =$component.find('.remixes:eq(0)');
    T.exists(assert, $collectionRemixes, "Missing collection remix");

    assert.equal(T.text($collectionRemixes), results[0].remixes, "Incorrect remix text");

    const $collectionView =$component.find(".views:eq(0)");
    T.exists(assert, $collectionView, "Missing collection view");

    assert.equal(T.text($collectionView), results[0].views, "Incorrect view text");

    const $remixButton =$component.find('#btnRemix');
    T.exists(assert, $remixButton, "Missing remix button");
    assert.equal(T.text($remixButton), "Remix", "Incorrect remix button text");

    const $imgCollection =$component.find('.collection-img a img');
    T.exists(assert, $imgCollection, "Missing image collection");

    const $collectionDescription =$component.find('.collection-desc:eq(0)');
    T.exists(assert, $collectionDescription, "Missing collection description");

    const $collectionDescriptionTitle = $collectionDescription.find(".title:eq(0)");
    T.exists(assert, $collectionDescriptionTitle, "Missing collection description title");

    assert.equal(T.text($collectionDescriptionTitle), results[0].title, "Incorrect title text");

    const $collectionDetails = $collectionDescription.find(".details");
    T.exists(assert, $collectionDetails, "Missing collection details");

    const $collectionDetailsImage = $collectionDetails.find("img");
    T.exists(assert, $collectionDetailsImage, "Missing collection details image");

    const $collectionDetailsAuthorName = $collectionDetails.find(".author-name-link a");
    T.exists(assert, $collectionDetailsAuthorName, "Missing collection author name");

    const $collectionDetailsAuthorNameTeam = $collectionDetails.find(".author-name-team");
    T.exists(assert, $collectionDetailsAuthorNameTeam, "Missing collection author name team");

    const $searchStandard = $component.find('.standard-container');
    T.exists(assert, $searchStandard, "Missing standards");

});
