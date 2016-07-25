/* AIDA Source Code */
/* Contributors located at: github.com/2nd47/CSC309-A4 */

// router middleware

var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// change the request methods as required
// refer to express documentation for more details

// if logged in: feed; else: landing page
router.get('/', function (req, res, next) {
  res.send('AIDA Home Page!');
});

router.post('/login', function (req, res, next) {
  res.send('AIDA Home Page!');
});

router.post('/signup', function (req, res, next) {
  res.send('AIDA Home Page!');
});

// list of contracts
router.get('/contracts', function (req, res) {
});

// create a new contract
router.get('/contracts/new', function (req, res) {
});

// details of contract with contract_id
router.get('/contracts/:contract_id', function (req, res) {
	/*
	Contract page:

	{
		id: contract id,
		title: contract title,
		employer_id: employer id,
		employer_name: employer name,
		project_id: project id,
		project_name: project name,
		status: contract status,
		latest_update: date of the latest update,
		tags: [tag names],
		budget: budget level estimation between 1 to 5,
		deadline: contract deadline,
		intro: introduction to the contract details
	}*/
	var json = new Object();
	var contrat_id = req.params.contract_id;
	var contract = db.Contract.findOne({"_id": ObjectId(contract_id)});
	json.id = contract_id;
	json.title = contract.name;
	json.employer_id = contract.owner;
	json.employer_name = db.User.findOne({"_id": ObjectId(contract.owner)},{name: 1}).name;
	json.project_id = contract.project;
	json.project_name = db.Project.findOne({"_id": ObjectId(contract.project)},{name: 1}).name;
	if (contract.taker) {
		json.status = "signed";
	}
	else {
		json.status = "open";
	}
	json.latest_update = contract.updatedAt;
	json.tags = contract.skillTags;
	json.budget = contract.budget;
	json.deadline = contract.deadline;
	json.intro = contract.details;
	res.send(JSON.stringify(json));
});


// list of profiles
router.get('/people', function (req, res) {
});

// details of people with user_id
router.get('/people/:user_id', function (req, res) {
	/*
	{
		id: person id,
		name: person's name,
		title: person's title,
		skills:
		[
			{
				skill_id: skill id,
				skill_name: skill name,
				skill_level: self rating on the skill between 1 to 5
			}
		],
		tags: [tags]
		biography: person's biography,
		projects:
		[
			{
				project_id: project id,
				project_name: project name
			}
		],
		contracts:
		[
			{
				contract_id: contract id,
				contract_name: contract name,
				completion_date: completion date,
				contract_rating: contract_rating,
				contract_comment: comment on the work
			}
		]
	}*/
	var json = new Object();
	var user_id = req.params.user_id;
	var user = db.User.findOne({"_id" : ObjectId(user_id)});
	json.id = user_id;
	json.name = user.name;
	json.title = user.title;
	json.skills = user.skillTags;
	json.tags = user.tags;
	json.biography = user.bio;
	json.projects = [];
	// Where the user is the owner
	var projects = db.Project.find({"ownerUsername": user.username},{name: 1});
	while (projects.hasNext()) {
		var newProject = new Object();
		var current = projects.next();
		newProject.project_id = current._id;
		newProject.project_name = current.name;
		json.projects.push(newProject);
	}
	// Where the user is a member
	var member_projects = db.Project.find({members: {$elemMatch: {"user": ObjectId(user_id)}}});
	while (member_projects.hasNext()) {
		var newProject = new Object();
		var current = member_projects.next();
		newProject.project_id = current._id;
		newProject.project_name = current.name;
		json.projects.push(newProject);
	}
	json.contracts = [];
	var contracts = db.Contract.find({"taker": user_id});
	while (contracts.hasNext()) {
		var newContract = new Object();
		var current = contracts.next();
		newContract.contract_id = current._id;
		newContract.contract_name = current.name;
		newContract.completion_date = current.completion;
		newContract.contract_rating = current.rating;
		newContract.contract_comment = current.comment;
		json.projects.push(newContract);
	}
	
	res.send(JSON.stringify(json));
});

// list of projects
router.get('/projects', function (req, res, next) {
  res.send('AIDA Home Page!');
});

// create a new project
router.get('/projects/new', function (req, res, next) {
  res.send('AIDA Home Page!');
});

// details of project with project_id
router.get('/projects/:project_id', function (req, res, next) {
	/*
	{
		id: project id,
		title: project title,
		publisher:
		{
			publisher_id: id of owner,
			publisher_name: name of project owner
		},
		members:
		[
			{
				member_id: id of owner,
				member_name: name of project owner
			}
		],
		short_intro: short description, 300 characters max,
		long_intro: longer intro with no character limit,
		showcase:
		[
			{
				path: path to the file,
				type: type of the file
			}
		]
		latest_update: date of the latest update, in seconds,
		status: project status,
		tags: [list of tags],
		open_contracts:
		[
			{
				contract_id: contract id,
				contract_title: contract title,
				contract_tags: [list of skill names with ratings],
				contract_budget: budget level estimation between 1 to 5,
				contract_deadline: contract deadline
			}
		],
	}*/
	var json = new Object();
	var project_id = req.params.project_id;
	var project = db.Project.findOne({"_id" : ObjectId(project_id)});
	// Build the file
	json.id = project_id;
	json.title = project.name;
	json.publisher = new Object();
	json.publisher.publisher_id = project.ownerUsername;
	var publisher_info = db.User.findOne({"username": project.ownerUsername}, {name: 1});
	json.publisher.publisher_name = publisher_info.name;
	json.members = [];
	var i;
	var numMembers = project.members.length;
	for (i=0;i<numMembers;i++) {
		var newMember = new Object();
		newMember.member_id = project.members[i].user;
		var memberName = db.User.findOne({"_id": project.members[i].user}, {name: 1});
		newMember.member_name = memberName.name;
		json.members.push(newMember);
	}
	json.short_intro = project.basicInfo;
	json.long_intro = project.detailedInfo;
	/*json.long_intro = [];
	var numParagraph = project.detailedInfo.length;
	for (i=0;i<numParagraph;i++) {
		var newParagraph = new Object();
		newParagraph.paragraph_title = project.detailedInfo[i].title;
		newParagraph.paragraph_content = project.detailedInfo[i].content;
		json.long_intro.push(newParagraph);
	}*/
	json.showcase = [];
	var numShowcase = project.showcase.assetPaths.length;
	for (i=0;i<numShowcase;i++) {
		var current_path = project.showcase.assetPaths[i];
		var current_type = project.showcase.mediaTypes[i];
		var newShowcase = new Object();
		newShowcase.path = current_path;
		newShowcase.type = currentcurrent_type;
	}
	json.latest_update = project.updatedAt;
	json.status = project.status;
	json.tags = project.tags;
	var contracts = db.Contract.find({"project": ObjectId(project_id)});
	json.open_contracts = [];
	while (contracts.hasNext()) {
		var newContract = new Object();
		var current = contracts.next();
		newContract.contract_id = current._id;
		newContract.contract_title = current.name;
		newContract.contract_tags = current.skillTags;
		newContract.contract_budget = current.budget;
		newContract.contract_deadline = current.deadline;
	}
	res.send(JSON.stringify(json));
  //res.send('AIDA Home Page!');
});

// message inbox
router.get('/inbox', function (req, res) {
});

// search page
router.get('/search', function (req, res) {
	/*
	Probable Queries:
	- page
	  - page number (default=1)
	- perpage
		- number of results per page (default = 10)
	- category
	  - all (default)
		- projects
		- people
		- contracts: open contracts only
	- keywords
		- the key word(s) for the search (e.g. hello,world,python)
	
	If it were a project, get
	_id: {
		type: project,
		title: project title,
		short_intro: short description, 300 characters max,
		latest_update: date of the latest update, in seconds,
		status: project status,
		tags: [list of tags],
		priority: accumulating as encountering the object
	}
	
	If it were a person, get
	_id: {
		type: person,
		name: person's name,
		title: person's title,
		skills:
		[
			{
				skill_id: skill id,
				skill_name: skill name,
				skill_level: self rating on the skill between 1 to 5
			}
		]
		tags: [list of tags]
		priority: accumulating as encountering the object
	}
	*/
	
	////////////////////////////////////////////////////
	//                                                //
	// TODO: using the user id stored in the login    //
	// session, adjust the search results based on    //
	// common tags between the user and the search    //
	// results                                        //
	//                                                //
	////////////////////////////////////////////////////
	var userId = req.session.userId;
	var userTags = [];
	var userSkills = [];
	var userProjectTags = [];
	var userContractSkills = [];
	if (userName) {
		var user = db.User.findOne({"_id": ObjectId(userId)});
		var userProjects = db.Project.find({"ownerUsername": user.username});
		var userContracts = db.Contract.find({"owner": ObjectId(userId)});
		// User's tags on themselves
		userTags = user.tags;
		// User's skills
		var i;
		var numSkills = user.skillTags.length;
		for (i=0;i<numSkills;i++) {
			userSkills.push(user.skillTags[i].name);
		}
		// User's tags on ongoing projects
		while (userProjects.hasNext()) {
			var current = userProjects.next();
			var tags = current.tags;
			var j;
			for (j=0;j<tags.length;j++) {
				userProjectTags.push(tags[j]);
			}
		}
		// User's contracts' required skills
		while ()
	}
	
	var results = new Object; //Store object_id: {...,priority_level:number}
	var queries = url.parse(req.url, true).query;
	
	// Parse the queries
	var category;
	if (queries.category) {
		category = queries.category;
	}
	else {
		category = "all";
	}
	
	var keywords = queries.keywords.split(",");
	/*
	var time;
	if (queries.time) {
		time = queries.time;
	}
	else {
		time = "all";
	}*/
	
	var page;
	if (queries.page) {
		page = queries.page;
	}
	else {
		page = 1;
	}
	
	var perpage;
	if (queries.perpage) {
		perpage = queries.perpage;
	}
	else {
		perpage = 1;
	}
	
	// Priority: match name: +4 match tag: +2 match content: +1
	// for each keyword:
	var i;
	var numKeywords = keywords.length;
	for (i=0;i<numKeywords;i++) {
		var keyword = keywords[i];
		// Get projects
		if (category === "all" || category === "projects") {
			var projectsByName = db.Project.find({"name": {$regex: ".*" + keyword + ".*/i"}});
			var projectsByTags = db.Project.find({"tags": {$elemMatch: {$regex: ".*" + keyword + ".*/i"}}});
			var projectsByIntro = db.Project.find({"basicInfo": {$regex: ".*" + keyword + ".*/i"}});
			var projectsByDetail = db.Project.find({"detailedInfo": {$regex: ".*" + keyword + ".*/i"}});
			
			// match projects by name
			while (projectsByName.hasNext()) {
				var newProject = new Object();
				var current = projectsByName.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 4;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 4;
				}
			}
			
			// match projects by tags
			while (projectsByTags.hasNext()) {
				var newProject = new Object();
				var current = projectsByTags.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 2;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 2;
				}
			}
			
			// match projects by intro
			while (projectsByIntro.hasNext()) {
				var newProject = new Object();
				var current = projectsByIntro.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 1;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 1;
				}
			}
			
			// match projects by detail
			while (projectsByDetail.hasNext()) {
				var newProject = new Object();
				var current = projectsByDetail.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 1;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 1;
				}
			}
		}
		
		
		// Get people
		if (category === "all" || category === "people") {
			var peopleByName = db.Project.find({"name": {$regex: ".*" + keyword + ".*/i"}});
			var peopleByTags = db.Project.find({"tags": {$elemMatch: {$regex: ".*" + keyword + ".*/i"}}});
			var peopleBySkill = db.Project.find({"skillTags": {$elemMatch: {"name": {$regex: ".*" + keyword + ".*/i"}}}});
			var peopleByTitle = db.Project.find({"title": {$regex: ".*" + keyword + ".*/i"}});
			var peopleByBio = db.Project.find({"bio": {$regex: ".*" + keyword + ".*/i"}});
			
			// match people by name
			while (peopleByName.hasNext()) {
				var newProject = new Object();
				var current = peopleByName.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 4;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 4;
				}
			}
			
			// match people by tags
			while (peopleByTags.hasNext()) {
				var newProject = new Object();
				var current = peopleByTags.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 2;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 2;
				}
			}
			
			// match people by skill
			while (peopleBySkill.hasNext()) {
				var newProject = new Object();
				var current = peopleBySkill.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 2;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 2;
				}
			}
			
			// match people by title
			while (peopleByTitle.hasNext()) {
				var newProject = new Object();
				var current = peopleByTitle.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 2;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 2;
				}
			}
			
			// match people by bio
			while (peopleByBio.hasNext()) {
				var newProject = new Object();
				var current = peopleByBio.next();
				if (current_id in results) {
					// The object is found before
					results[current._id].priority += 1;
				}
				else {
					// The object is found in current iteration
					results[current._id] = new Object();
					results[current._id].type = "project";
					results[current._id].title = current.name;
					results[current._id].short_intro = current.basicInfo;
					results[current._id].latest_update = current.updatedAt;
					results[current._id].status =  current.status;
					results[current._id].tags = current.tags;
					results[current._id].priority = 1;
				}
			}
		}
		
		var resultArray = [];
		for (var id in results) {
			if (results.hasOwnProperty(id)) {
				resultArray.push(results[id]);
			}
		}
		
		// sort by priority
		resultArray.sort(
			function(a, b) {
				if (a.priority > b.priority) {
					return -1;
				}
				if (a.priority < b.priority) {
					return 1;
				}
				return 0;
			}
		);
		
		res.send(JSON.stringify(resultArray.slice((page-1)*perpage,page*perpage)));
	}	
	
});

// etc...

module.exports = router;
