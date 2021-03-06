var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    User = require('../../app/models/user'),
    Project = require('../../app/models/project'),
    Job = require('../../app/models/job');

// Init sample database info
var sample_data_init = false;

module.exports = function(app, auth, user, project, job, search) {
  if (sample_data_init) {
    return;
  } else {
    sample_data_init = true;
  }
  // Clear database
  collectionsToDrop = [
    'skills',
    'messages',
    'broadcasts',
    'chats',
    'users',
    'projects',
    'jobs']
  for (var i = 0; i<collectionsToDrop.length; i++) {
    mongoose.connection.collections[collectionsToDrop[i]].drop(function(err) {
    });
  }

  User.remove(function(err, removed) {
    Project.remove(function(err, removed) {
      Job.remove(function(err, removed) {
        createSampleDb();
      });
    });
  });

  var createSampleDb = function() {
    // Create users
    var user1 = User({
      username: 'dtrump',
      passwordHash: bcrypt.hashSync('passwordtrump'),
      email: 'dtrump@gmail.com',
      name: 'Donald Trump',
      title: 'Republican Presidential Nominee',
      bio: 'I am the greatest candidate for this position!',
      tags: 'Republican Party',
      avatar: '/images/users/trump.jpg',
      isVerified: true,
      timeVerified: Date.now(),
      url: 'http://www.trump.com/'
    });
    var user2 = User({
      username: 'bsanders',
      passwordHash: bcrypt.hashSync('passwordsanders'),
      email: 'bsanders@gmail.com',
      name: 'Bernie Sanders',
      title: 'Democratic Presidential Nominee Runner-up',
      bio: 'I wish I had gotten that position!',
      isVerified: true,
      avatar: '/images/users/sanders.jpg',
      timeVerified: Date.now(),
      url: 'http://www.sanders.senate.gov/'
    });
    var user3 = User({
      username: 'vputin',
      passwordHash: bcrypt.hashSync('passwordputin'),
      email: 'vputin@gmail.com',
      name: 'Vladimir Putin',
      title: 'Russian Overlord',
      bio: 'I rule Russia forever!!!',
      avatar: '/images/users/putin.jps',
      isVerified: true,
      timeVerified: Date.now(),
      url: 'http://eng.putin.kremlin.ru/'
    });
    var user4 = User({
      username: 'aida',
      passwordHash: bcrypt.hashSync('aidapass'),
      email: 'aidawebapp@gmail.com',
      name: 'AIDA Master',
      bio: 'Hello, I am the adminstrator account for AIDA!',
      isVerified: true,
      timeVerified: Date.now(),
      url: 'https://www.hillaryclinton.com/'
    });
    // Save users
    user1.save(function(err, dtrump) {

      user2.save(function(err, bsanders) {

        user3.save(function(err, vputin) {

          user4.save(function(err, hclinton) {
            // Projects
            var project1 = Project({
              name: 'Trump for President!',
              owner: user1._id,
              tags: [
                'GOP',
                'Republican',
                'USA'
              ],
              members: [
                user3._id
              ],
              showcase: '/images/projects/trump/showcase.jpg',
              status: 'Active',
              basicInfo: 'This is basic information about the project!',
              detailedInfo: 'This is a much much much much much\
                much much much much much much much much much much much much much \
                much much much much much much much much much much much much much \
                much much much much much much much much much much much much much \
                much much much much much much much longer information section \
                for the \'Trump for President!\' job!'
            });
            var project2 = Project({
              name: 'Sanders for President!',
              owner: user2._id,
              tags: [
                'USA',
                'Democratic',
                'DNC'
              ],
              showcase: '/images/projects/bsanders/showcase.jpg',
              status: 'Closed',
              basicInfo: 'This is basic information about the project!',
              detailedInfo: 'This is a much much much \
                much much much much much much much much much much much much much much \
                much much much much much much much much much much much much much much \
                much much much much much much much much much much much much much much \
                much much much much much much much much much longer information section \
                for the \'Sanders for President!\' job!'
            });
            project1.save(function(err, trumpProj) {

              User.findByIdAndUpdate(user1._id,
                { $push: { 'projects': trumpProj._id }},
                function(err, user) {

                });
              project2.save(function(err, sandersProj) {
                
                User.findByIdAndUpdate(user2._id,
                  { $push: { 'projects': project2._id}},
                  function(err, user) {

                  });
                var job1 = Job({
                  name: 'Website Designer',
                  project: project1._id,
                  owner: user1._id,
                  deadline: Date.now(),
                  budget: 1500,
                  intro: 'Need someone to make a great pro-Trump website!',
                  descriptionTags: [
                    'Webdev',
                    'Campaigning'
                  ],
                  details: 'These are the details for the job!',
                  url: 'http://www.trump.com/connect-with-us/'
                });
                var job2 = Job({
                  name: 'Campaign Stumper',
                  project: project1._id,
                  owner: user1._id,
                  deadline: Date.now(),
                  budget: 5000,
                  intro: 'Need someone to stump nay-sayers!',
                  descriptionTags: [
                    'Propoganda',
                    'Campaigning'
                  ],
                  details: 'These are the details for the job!',
                  url: 'http://www.trump.com/connect-with-us'
                });
                job1.save(function(err, job1) {

                  Project.findByIdAndUpdate(project1._id,
                    { $push: { 'jobs' : job1._id }},
                    function(err, project) {

                    });
                });
                job2.save(function(err, job2) {

                  Project.findByIdAndUpdate(project1._id,
                    { $push: { 'jobs' : job2._id }},
                    function(err, project) {

                    });
                });
              });
            });
          });
        });
      });
    });
  }
  /*
  // Create followings
  user.getUserByField('username', 'dtrump', function(err, user) {
    user.getUserByField('username', 'vputin', function(err, otherUser) {
      user.pushUserField(user._id, 'following', otherUser._id);
    });
    user.getUserByField('username', 'vputin', function(err, otherUser) {
      user.pushUserField(user._id, 'contacts', otherUser._id);
    });
    user.getUserByField('username', 'hclinton', function(err, otherUser) {
      user.pushUserField(user._id, 'blocked', otherUser._id);
    });
  });
  module.exports.getUserByField('username', 'bsanders', function(err, user) {
    module.exports.getUserByField('username', 'hclinton', function(err, otherUser) {
      module.exports.pushUserField(user._id, 'following', otherUser._id);
    });
  });
  module.exports.getUserByField('username', 'vputin', function(err, user) {
    module.exports.getUserByField('username', 'dtrump', function(err, otherUser) {
      module.exports.pushUserField(user._id, 'following', otherUser._id);
    });
    module.exports.getUserByField('username', 'dtrump', function(err, otherUser) {
      module.exports.pushUserField(user._id, 'contacts', otherUser._id);
    });
    module.exports.getUserByField('username', 'bsanders', function(err, otherUser) {
      module.exports.pushUserField(user._id, 'blocked', otherUser._id);
    });
  });
  module.exports.getUserByField('username', 'hclinton', function(err, otherUser) {
    module.exports.getUserByField('username', 'bsanders', function(err, user) {
      module.exports.pushUserField(user._id, 'following', otherUser._id);
    });
  });
  */
}
