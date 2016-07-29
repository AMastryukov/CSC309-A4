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
  var user = new User();
  user.username = username;
  user.passwordHash = passwordHash;
  user.email = email;
  user.save();
}

// Create a new project given the required fields
module.exports.createProject = function(name, owner) {
  var project = new Project();
  project.name = name;
  project.owner = owner;
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

// Create a new message
module.exports.createMessage = function(sender, text) {
  var message = new Message();
  message.sender = sender;
  message.text = text;
  message.save();
}

// Create a new contact
module.exports.createContact = function(contacter, contactee) {
  var contact = new Contact();
  contact.contacter = contacter;
  contact.contactee = contactee;
  contact.save();
}

// Create a new skill
module.exports.createSkill = function(name, rating) {
  var skill = new Skill();
  skill.name = name;
  skill.rating = rating;
  skill.save();
}

// Adds a skill by ID to a user by ID
module.exports.addUserSkill = function(user, skillToAdd) {
  return;
}

// Adds a skill by ID to a contract by ID
module.exports.addContractSkill = function(contract, skillToAdd) {
  return;
}

// Adds a user by ID to a project by ID
module.exports.addProjectMember = function(project, userToAdd) {
  return;
}

// Adds a showcase item to a project showcase
module.exports.addShowcaseItem = function(project, itemPath) {
  return;
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
module.exports.setUserField = function(id, field, value) {
  var query = [];
  query[field] = value;
  return models.User.findByIdAndUpdate(id, {$set: query}, function(err, user) {});
}

// Set a user document field, searching user by ID
module.exports.setProjectField = function(id, field, value) {
  var query = [];
  query[field] = value;
  return models.Project.findByIdAndUpdate(id, {$set: query});
}

// Set a user document field, searching user by ID
module.exports.setContractField = function(id, field, value) {
  var query = [];
  query[field] = value;
  return models.Contract.findByIdAndUpdate(id, {$set: query});
}

module.exports.models = models;
module.exports.connect = connect;
