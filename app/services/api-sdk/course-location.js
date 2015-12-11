import Ember from 'ember';
import DS from 'ember-data';
import StoreMixin from '../../mixins/store';

export default Ember.Service.extend(StoreMixin, {

  /**
   * Returns the current user course location.
   * @param user the user id
   * @returns {Location}
   */
  findOneByUser: function(user) {
    const users = Ember.A([Ember.Object.create({
      isActive: true,
      user: Ember.Object.create({
          id: user,
          firstName: 'firstname-1',
          lastName: 'lastname-1',
          fullName: 'lastname-1, firstname-1',
          email: 'user_1@test.com',
          username: 'username-1',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      })
    ]);

    const response = Ember.Object.create({
      unit: 'unit-1',
      lesson: 'lesson-1',
      collection: 'collection-1',
      locationUsers: DS.PromiseArray.create({
        promise: new Ember.RSVP.Promise(function(resolve) {
          resolve(users);
        })
      })
    });

    return DS.PromiseObject.create({
      promise: new Ember.RSVP.Promise(function(resolve) {
        resolve(response);
      })
    });
  },

  /**
   * Returns all the locations for a specific course.
   * @param course the course id
   * @returns {Location[]}
   */
  findByCourse: function(course) {
    const users1 = Ember.A([
      Ember.Object.create({
        isActive: false,
        user: Ember.Object.create({
          id: 'id-3',
          firstName: 'firstname-3',
          lastName: 'lastname-3',
          fullName: 'lastname-3, firstname-3',
          email: 'user_3@test.com',
          username: 'username-3',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      }),
      Ember.Object.create({
        isActive: false,
        user: Ember.Object.create({
          id: 'id-4',
          firstName: 'firstname-4',
          lastName: 'lastname-4',
          fullName: 'lastname-4, firstname-4',
          email: 'user_4@test.com',
          username: 'username-4',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      })
    ]);

    const users2 = Ember.A([
      Ember.Object.create({
        isActive: true,
        user: Ember.Object.create({
          id: 'id-5',
          firstName: 'firstname-5',
          lastName: 'lastname-5',
          fullName: 'lastname-5, firstname-5',
          email: 'user_5@test.com',
          username: 'username-5',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      }),
      Ember.Object.create({
        isActive: true,
        user: Ember.Object.create({
          id: 'id-6',
          firstName: 'firstname-6',
          lastName: 'lastname-6',
          fullName: 'lastname-6, firstname-6',
          email: 'user_6@test.com',
          username: 'username-6',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      })
    ]);

    const response = Ember.A([
      Ember.Object.create({
        unit: 'unit-1',
        locationUsers: this.createStudents(course)
      }),
      Ember.Object.create({
        unit: 'unit-2',
        locationUsers: DS.PromiseArray.create({
          promise: new Ember.RSVP.Promise(function(resolve) {
            resolve(users1);
          })
        })
      }),
      Ember.Object.create({
        unit: 'unit-3',
        locationUsers: DS.PromiseArray.create({
          promise: new Ember.RSVP.Promise(function(resolve) {
            resolve(users2);
          })
        })
      })
    ]);

    return DS.PromiseArray.create({
      promise: new Ember.RSVP.Promise(function(resolve) {
        resolve(response);
      })
    });
  },

  /**
   * Returns all the locations for a specific course and unit.
   * @param course the course id
   * @param unit the unit id
   * @returns {Location[]}
   */
  findByCourseAndUnit: function(course, unit) {
    const users = Ember.A([
      Ember.Object.create({
        isActive: false,
        user: Ember.Object.create({
          id: 'id-3',
          firstName: 'firstname-3',
          lastName: 'lastname-3',
          fullName: 'lastname-3, firstname-3',
          email: 'user_3@test.com',
          username: 'username-3',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      }),
      Ember.Object.create({
        isActive: false,
        user: Ember.Object.create({
          id: 'id-4',
          firstName: 'firstname-4',
          lastName: 'lastname-4',
          fullName: 'lastname-4, firstname-4',
          email: 'user_4@test.com',
          username: 'username-4',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      })
    ]);

    const response = Ember.A([
      Ember.Object.create({
        unit: unit,
        lesson: 'lesson-1',
        locationUsers: this.createStudents(course)
      }),
      Ember.Object.create({
        unit: unit,
        lesson: 'lesson-2',
        locationUsers: DS.PromiseArray.create({
          promise: new Ember.RSVP.Promise(function(resolve) {
            resolve(users);
          })
        })
      })
    ]);

    return DS.PromiseArray.create({
      promise: new Ember.RSVP.Promise(function(resolve) {
        resolve(response);
      })
    });
  },

  /**
   * Returns all the locations for a specific course, unit and lesson.
   * @param course the course id
   * @param unit the unit id
   * @param lesson the lesson id
   * @returns {UserLocation[]}
   */
  findByCourseAndUnitAndLesson: function(course, unit, lesson) {
    const users1 = Ember.A([
      Ember.Object.create({
        isActive: false,
        user: Ember.Object.create({
          id: 'id-3',
          firstName: 'firstname-3',
          lastName: 'lastname-3',
          fullName: 'lastname-3, firstname-3',
          email: 'user_3@test.com',
          username: 'username-3',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      }),
      Ember.Object.create({
        isActive: false,
        user: Ember.Object.create({
          id: 'id-4',
          firstName: 'firstname-4',
          lastName: 'lastname-4',
          fullName: 'lastname-4, firstname-4',
          email: 'user_4@test.com',
          username: 'username-4',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      })
    ]);

    const users2 = Ember.A([
      Ember.Object.create({
        isActive: true,
        user: Ember.Object.create({
          id: 'id-5',
          firstName: 'firstname-5',
          lastName: 'lastname-5',
          fullName: 'lastname-5, firstname-5',
          email: 'user_5@test.com',
          username: 'username-5',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      }),
      Ember.Object.create({
        isActive: true,
        user: Ember.Object.create({
          id: 'id-6',
          firstName: 'firstname-6',
          lastName: 'lastname-6',
          fullName: 'lastname-6, firstname-6',
          email: 'user_6@test.com',
          username: 'username-6',
          profileImageUrl: '/assets/gooru/profile.png'
        })
      })
    ]);


    const response = Ember.A([
      Ember.Object.create({
        unit: unit,
        lesson: lesson,
        collection: 'collection-1',
        locationUsers: this.createStudents(course)
      }),
      Ember.Object.create({
        unit: unit,
        lesson: lesson,
        collection: 'collection-2',
        locationUsers: DS.PromiseArray.create({
          promise: new Ember.RSVP.Promise(function(resolve) {
            resolve(users1);
          })
        })
      }),
      Ember.Object.create({
        unit: unit,
        lesson: lesson,
        collection: 'collection-3',
        locationUsers: DS.PromiseArray.create({
          promise: new Ember.RSVP.Promise(function(resolve) {
            resolve(users2);
          })
        })
      })
    ]);

    return DS.PromiseArray.create({
      promise: new Ember.RSVP.Promise(function(resolve) {
        resolve(response);
      })
    });
  },

  // TODO: remove this method that is only a temporal helper
  createStudents: function(course) {
    var totalUsers = 0;

    if (course === 'course-with-1-user') {
      totalUsers = 1;
    } else if (course === 'course-with-3-users') {
      totalUsers = 3;
    } else if (course === 'course-with-4-users') {
      totalUsers = 4;
    } else if (course === 'course-with-30-users') {
      totalUsers = 30;
    } else if (course === 'course-with-45-users') {
      totalUsers = 45;
    }

    if (totalUsers > 0) {
      var students = Ember.A();
      for (var i = 1; i <= totalUsers; i++) {
        students.push(Ember.Object.create({
          isActive: true,
          user: Ember.Object.create({
            id: 'id-' + i,
            firstName: 'firstname-' + i,
            lastName: 'lastname-' + i,
            fullName: 'lastname-' + i + ', ' + 'firstname-' + i,
            email: 'user_' + i + '@test.com',
            username: 'username-' + i,
            profileImageUrl: '/assets/gooru/profile.png'
          })
        }));
      }
      return DS.PromiseArray.create({
        promise: new Ember.RSVP.Promise(function(resolve) {
          resolve(students);
        })
      });

    } else {
      return DS.PromiseArray.create({
        promise: new Ember.RSVP.Promise(function(resolve) {
          resolve(Ember.A([
            Ember.Object.create({
              isActive: true,
              user: Ember.Object.create({
                id: 'id-1',
                firstName: 'firstname-1',
                lastName: 'lastname-1',
                fullName: 'lastname-1, firstname-1',
                email: 'user_1@test.com',
                username: 'username-1',
                profileImageUrl: '/assets/gooru/profile.png'
              })
            }),
            Ember.Object.create({
              isActive: false,
              user: Ember.Object.create({
                id: 'id-2',
                firstName: 'firstname-2',
                lastName: 'lastname-2',
                fullName: 'lastname-2, firstname-2',
                email: 'user_2@test.com',
                username: 'username-2',
                profileImageUrl: '/assets/gooru/profile.png'
              })
            })
          ]));
        })
      });
    }
  }

});
