var mongoose = require('mongoose');

var models = require("./models.js");

/*
var dbUser = 'aida-master';
var dbPassword = 'dbpassword';
var url = 'mongodb://' +
  dbUser + ':' +
  dbPassword +
  '@ds029735.mlab.com:29735/heroku_qdmfvghp'
*/

var url = 'mongodb://localhost/appdb';

var connect = function(callback) {
  mongoose.connect(url);

  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    callback();
  });
}

// Generate a custom URL to be used when displaying pages
/*
var generateURL = function() {
  var randURL;
  var isUniqueId = false;
  while (!isUniqueId) {
    var noUserURL = false,
        noProjectURL = false,
        noContractURL = false;
    randURL = Math.Random() * 100000;
  }
  return randURL;
}
*/

// Create a new user given the required fields
module.exports.createUser = function(username, passwordHash, email) {
  var user = new User({
    'username': username,
    'passwordHash': passwordHash,
    'email': email
  });
  user.save();
}

// Create a new project given the required fields
module.exports.createProject = function(name, ownerUsername) {
  var project = new Project();
  project.name = name;
  project.ownerUsername = ownerUsername;
  project.save();
}

// Create a new contract given the required fields
module.exports.createContract = function(name, project, owner, deadline, budget) {
  var contract = new Contract();
  contract.name = name;
  contract.project = project;
  contract.owner = owner;
  contract.deadline = deadline;
  contract.budget = budget;
  contract.save();
}

// Get individual user by searching for ID
module.exports.getUser = function(id) {
  return models.User.findById(id);
}

// Get a field of a user document, searching user by ID
module.exports.getUserField = function(id, field) {
  return models.User.findById(id, field, function(err, user) {});
}

// Get individual user by searching for a field value
module.exports.getUserByField = function(field, value) {
  var query = [];
  query[field] = value;
  return models.User.find(query, function(err, user) {});
}

// Set a user document field, searching user by ID
module.exports.setUserField = function(id, field, value) {
  var query = [];
  query[field] = value;
  return models.User.findByIdAndUpdate(id, {$set: fieldSet}, function(err, user) {});
}

// Get individual project by searching for ID
module.exports.getProject = function(id) {
  return models.Project.findById(id);
}

// Get a field of a project document, searching user by ID
module.exports.getProjectField = function(id, field) {
  return models.Project.findById(id, field, function(err, project) {});
}

// Get individual project by searching for a field value
module.exports.getProjectByField = function(field, value) {
  var query = [];
  query[field] = value;
  return models.Project.find(query, function(err, project) {});
}

// Get individual project by searching for name
module.exports.getProjectByName = function(name) {
  return models.Project.findOne({
    'name' : name
  });
}

// Get the owner of a project given some project id
module.exports.getProjectOwnerByProject = function(id) {
  return models.Project.findById(id).
    select('owner').
    exec();
}

// Get all projects associated with a user
module.exports.getProjectsByUsername = function(user) {
  var userId = user._id;
  var query = { $or: [
      {'owner': userId},
      {'members.user': userId}
    ]
  };
  return Project.find(query).exec();
}

// Get projects by tag
module.exports.getProjectsByTag = function(tagString) {
  return models.Project.find({tags: tagString});
}

// Set a user document field, searching user by ID
module.exports.setProjectField = function(id, field, value) {
  var fieldSet = [];
  fieldSet[field] = value;
  return models.Project.findByIdAndUpdate(id, {$set: fieldSet});
}

// Get individual contract by searching for ID
module.exports.getContract = function(id) {
  return models.Contract.findById(id);
}

// Get individual contract by searching for a field value
module.exports.getContractByField = function(field, value) {
  var query = [];
  query[field] = value;
  return models.Contract.find(query, function(err, contract) {});
}

// Get a field of a contract document, searching user by ID
module.exports.getContractField = function(id, field) {
  return models.Contract.findById(id, field, function(err, contract) {});
}

// Get contracts by price range
module.exports.getContractsByPrice = function(lowlimit, highlimit) {
  return models.Contract.
    find().
    where('budget').gt(lowlimit).lt(highlimit).
    exec();
}

// Get contracts by skill tag
module.exports.getContractsByTag = function(skill) {
  return models.Contract.find({skillTags: skill});
}

// Set a user document field, searching user by ID
module.exports.setContractField = function(id, field, value) {
  var fieldSet = [];
  fieldSet[field] = value;
  return models.Contract.findByIdAndUpdate(id, {$set: fieldSet});
}

module.exports.models = models;
module.exports.connect = connect;
