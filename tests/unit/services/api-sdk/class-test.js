import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';

moduleForService('service:api-sdk/class', 'Unit | Service | api-sdk/class', {
  needs: ['serializer:class/class', 'model:class/class', 'adapter:class/class']
});

test('findClassesIJoined', function (assert) {
  const service = this.subject();

  const
    response = {
      'searchResult': [{
        'classUid': '90d82226-5d0d-4673-a85d-f93aa0cbddf2',
        'visibility': true,
        'name': 'Class A1',
        'classCode': '2WZ8IJA',
        'courseGooruOid': '75366215-f9d5-424c-8a90-2cabdfeb3ffa',
        'grades': 'K',
        'user': {
          'username': 'JeffreyTeacher01',
          'gooruUId': '88638002-deb6-4f8d-b319-4a7ae18d0efe',
          'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/88638002-deb6-4f8d-b319-4a7ae18d0efe.png'
        },
        'memberCount': 1
      }], 'totalHitCount': 1
    },
    routes = function () {
      this.get('/gooruapi/rest/v3/class/study', function () {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
      }, 0);
    };

  this.pretender.map(routes);

  var done = assert.async();
  const promise = service.findClassesIJoined();
  promise.then(function(classes){
    assert.equal(classes.get('length'), 1, 'Missing classes');
    const firstClass = classes.get('firstObject');
    assert.equal(firstClass.get('id'), '90d82226-5d0d-4673-a85d-f93aa0cbddf2', 'Wrong id');
    assert.equal(firstClass.get('name'), 'Class A1', 'Wrong name');
    assert.equal(firstClass.get('code'), '2WZ8IJA', 'Wrong code');
    assert.equal(firstClass.get('grades'), 'K', 'Wrong grades');
    assert.equal(firstClass.get('greetings'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Wrong greetings');
    assert.equal(firstClass.get('teachers')[0].username, 'JeffreyTeacher01', 'Wrong teacher username');
    done();
  });
});

test('findClassesITeach', function (assert) {
  const service = this.subject();

  const
    response = {
      'searchResult': [{
        'classUid': '67a96ec1-7383-4164-8068-5415621b7a34',
        'visibility': true,
        'name': 'Class A2',
        'classCode': 'JR48FMF',
        'courseGooruOid': '75366215-f9d5-424c-8a90-2cabdfeb3ffa',
        'grades': 'K,6,7,8',
        'user': {
          'username': 'JeffreyTeacher01',
          'gooruUId': '88638002-deb6-4f8d-b319-4a7ae18d0efe',
          'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/88638002-deb6-4f8d-b319-4a7ae18d0efe.png'
        },
        'memberCount': 0
      }, {
        'classUid': '90d82226-5d0d-4673-a85d-f93aa0cbddf2',
        'visibility': true,
        'name': 'Class A1',
        'classCode': '2WZ8IJA',
        'grades': 'K',
        'user': {
          'username': 'JeffreyTeacher01',
          'gooruUId': '88638002-deb6-4f8d-b319-4a7ae18d0efe',
          'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/88638002-deb6-4f8d-b319-4a7ae18d0efe.png'
        },
        'memberCount': 1
      }], 'totalHitCount': 2
    },
    routes = function () {
      this.get('/gooruapi/rest/v3/class/teach', function () {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
      }, 0);
    };

  this.pretender.map(routes);

  var done = assert.async();
  const promise = service.findClassesITeach();
  promise.then(function(classes){
    assert.equal(classes.get('length'), 2, 'Missing classes');
    const firstClass = classes.get('firstObject');
    assert.equal(firstClass.get('id'), '67a96ec1-7383-4164-8068-5415621b7a34', 'Wrong id');
    assert.equal(firstClass.get('name'), 'Class A2', 'Wrong name');
    assert.equal(firstClass.get('code'), 'JR48FMF', 'Wrong code');
    assert.equal(firstClass.get('grades'), 'K,6,7,8', 'Wrong grades');
    assert.equal(firstClass.get('greetings'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Wrong greetings');
    assert.equal(firstClass.get('teachers')[0].username, 'JeffreyTeacher01', 'Wrong teacher username');
    const otherClass = classes.objectAt(1);
    assert.equal(otherClass.get('id'), '90d82226-5d0d-4673-a85d-f93aa0cbddf2', 'Wrong id');
    assert.equal(otherClass.get('name'), 'Class A1', 'Wrong name');
    assert.equal(otherClass.get('code'), '2WZ8IJA', 'Wrong code');
    assert.equal(otherClass.get('grades'), 'K', 'Wrong grades');
    assert.equal(otherClass.get('greetings'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Wrong greetings');
    assert.equal(otherClass.get('teachers')[0].username, 'JeffreyTeacher01', 'Wrong teacher username');
    done();
  });
});

test('findById', function (assert) {
  const service = this.subject();

  const
    response = {
      'status': 'not-invited',
      'visibility': true,
      'courseGooruOid': '75366215-f9d5-424c-8a90-2cabdfeb3ffa',
      'memberCount': 0,
      'classUid': '67a96ec1-7383-4164-8068-5415621b7a34',
      'name': 'Class A2',
      'classCode': 'JR48FMF',
      'grades': 'K,6,7,8',
      'user': {
        'username': 'JeffreyTeacher01',
        'gooruUId': '88638002-deb6-4f8d-b319-4a7ae18d0efe',
        'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/88638002-deb6-4f8d-b319-4a7ae18d0efe.png'
      }
    },
    routes = function () {
      this.get('/gooruapi/rest/v3/class/67a96ec1-7383-4164-8068-5415621b7a34', function () {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
      }, 0);
    };

  this.pretender.map(routes);

  var done = assert.async();
  Ember.run(function () {
    const promise = service.findById('67a96ec1-7383-4164-8068-5415621b7a34');
    promise.then(function (classItem) {
      assert.equal(classItem.get('id'), '67a96ec1-7383-4164-8068-5415621b7a34', 'Wrong id');
      assert.equal(classItem.get('name'), 'Class A2', 'Wrong name');
      assert.equal(classItem.get('code'), 'JR48FMF', 'Wrong code');
      assert.equal(classItem.get('grades'), 'K,6,7,8', 'Wrong grades');
      assert.equal(classItem.get('greetings'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Wrong greetings');
      assert.equal(classItem.get('teachers')[0].username, 'JeffreyTeacher01', 'Wrong teacher username');
      done();
    });
  });
});

test('findStudentsByClass', function (assert) {
  const service = this.subject();

  const
    response = {
      'searchResult': [{
        'associationDate': 1448412441000,
        'lastname': 'Bermudez',
        'emailId': 'jeffreystudent02@test.com',
        'username': 'JeffreyStudent02',
        'firstname': 'Jeffrey',
        'gooruUId': '7c74a27d-3748-49bd-83b4-4a3523ff370a'
      }],
      'totalHitCount': 1
    },
    routes = function () {
      this.get('/gooruapi/rest/v3/class/67a96ec1-7383-4164-8068-5415621b7a34/member', function () {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
      }, 0);
    };

  this.pretender.map(routes);

  //var done = assert.async();
  //Ember.run(function () {
    const students = service.findStudentsByClass('67a96ec1-7383-4164-8068-5415621b7a34');
    //promise.then(function (students) {
      assert.equal(students.get('length'), 2, 'Missing students');
      const student = students.get('firstObject');
      assert.equal(student.get('id'), '7c74a27d-3748-49bd-83b4-4a3523ff370a', 'Wrong id');
      assert.equal(student.get('username'), 'JeffreyStudent02', 'Wrong username');
      assert.equal(student.get('firstname'), 'Jeffrey', 'Wrong firstname');
      assert.equal(student.get('lastname'), 'Bermudez', 'Wrong lastname');
      assert.equal(student.get('email'), 'jeffreystudent02@test.com', 'Wrong email');
      //done();
    //});
  //});
});
