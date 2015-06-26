Recommend = new Mongo.Collection("recommend");

var WIModel = function(options){
	return {
  "_id": options._id,
  "inbox": [],
  "outbox": [],
  "follow": [],
  "big": [],
  "seen": [],
  "vote": [],
  "feed": [],
  "recommend": [],
  "profile": {
  	"profile_picture": "http://i.imgur.com/vaCjg.jpg"
  }
}
}
var getimages = function(options){
	return {
    "XP": 92,
    "YP": 5,
    "_id": options._id,
    "clientUpdate": true,
    "cycleComplete": false,
    "from": "nicolsondsouza",
    "imageId": "eRH8i6MTWJG9XtsptfTGqfe34JLs2ZDmvbfrShs3cdyi3JZLtqo",
    "image_low": "http://i.imgur.com/P96QpsF.jpg",
    "journey": "Arra",
    "key": "",
    "profile_picture": "http://i.imgur.com/vaCjg.jpg",
    "startTime": 1431521396599,
    "to": "eRH8i6MTWJG9XtsptfTGqfe34JLs2ZDmvbfrShs3cdyi3JZLtqo",
    "userId": "nicolsondsouza",
    "source": "instagram"
  }
}






Unionize = {};
WI = new Mongo.Collection("wi");
W = new Mongo.Collection("w");
log = console.log.bind(console);
// var keys = {};
// keys.outbox = "inbox";
// keys.follow = "follower";
// Unionize.keys = keys;


Unionize.hooks = {};
Unionize.afterhooks = {};

// Unionize.hooks.outbox = function(){

// }



// this.modModifier = {};

// modModifier.outbox = function(modifier, userId) {
//   var from, inserted, new_key, old_key, to;
//   old_key = 'outbox';
//   new_key = 'sending';
//   if (old_key !== new_key) {
//     smite(modifier, 'needs a new agenda', eval(s));
//     smite(eval(Object.defineProperty(modifier.$push, new_key, Object.getOwnPropertyDescriptor(modifier.$push, old_key))));
//     smite(eval(delete modifier.$push[old_key], 'deleted key', eval(s)));
//   }
//   smite('did we insert into W?', modifier, modifier.$push, from = modifier.$push.sending.from, to = modifier.$push.sending.to, eval(s));
//   inserted = W.insert({
//     to: to,
//     from: from
//   });
//   smite(inserted, 'how long did the insert hook take? usually 30ms', eval(s));
//   return modifier;
// };




Unionize.getUTC = function(){
	return new Date().getTime();
}
Unionize.exists = function(userId){
	return WI.find(userId).count()
}
Unionize.prepare = function(userId){
	if(Unionize.exists(userId) == 0){
		var wiModel = new WIModel({"_id": userId});
		WI.insert(wiModel);
		return false;
	}
	return true;
}
Unionize.validateDocs = function(docs){
  if(!docs)
    throw new Meteor.Error("Please check information provided undefined", "404");
  if(!docs.from){
    throw new Meteor.Error("Source is not defined from", "404");   
  }
  if(!docs.to)
    throw new Meteor.Error("Target is not defined to", "404");
}
Unionize.connect = function(docs){
	Unionize.validateDocs(docs);
	
	Unionize.prepare(docs.from);
  
  docs.startTime = Unionize.getUTC();
	docs.journey = [{"onConnect": Unionize.getUTC()- docs.startTime}];
  var update = {};
  update["outbox"] = docs;
	WI.update(docs.from,{$push: update});
}

Unionize.sampleFollow = function(){
  WI.update(userId, {$push: {"follow": {
			  "_id": Random.id(),
			  "from": "eliasmoosman",
			  "to": "nicolsondsouza",
			  "image_low": "http://i.imgur.com/EAyLXgp.jpg"
			}}});
}
Unionize.samplefeed = function(){
  WI.update(userId, {$push: {"feed": {
			  "_id": Random.id(),
			  "from": "eliasmoosman",
			  "to": "nicolsondsouza",
			  "image_low": "http://i.imgur.com/EAyLXgp.jpg"
			}}});
}

Unionize.sampleInbox = function(docs){
  var update = new getimages({"_id": Random.id()});
   update.source = "";
	WI.update(userId,{$push: {"inbox":update}});
}


Unionize.getNewInagesInbox = function(docs){
  var update = new getimages({"_id": Random.id()});
	WI.update(userId,{$push: {"inbox":update}});
}
Unionize.getNewInagesRecommend = function(docs){
  var update = new getimages({"_id": Random.id()});
	WI.update(userId,{$push: {"recommend":update}});
}





// depricated
// Unionize.connectF = function(docs){
//   Unionize.validateDocs(docs);
  
//   Unionize.prepare(docs.from);
  
//   docs.startTime = Unionize.getUTC();
//   docs.journey = [{"onConnect": Unionize.getUTC()- docs.startTime}];
//   WI.update(docs.from,{$push: {"follow": docs}});
// }
// hooks



// Unionize.onWUpdateHookFollow = function(userId, docs){

// }
// WI.insert.before(function(docs){
  
// });

// WI.insert.after(function(docs){
  
// });

// log(W.before.insert())
// W.before.insert(function(userId, docs){
//   // Unionize.onWInsertHook(userId, docs);
// });

WI.after.update(function(userId, doc, fieldNames, modifier, options){
    try{
        var key = fieldNames[0];
        console.log(key)
        if(key && Unionize.afterhooks[key] && modifier["$push"]){ // && modifier["$push"][key]
        var docs = modifier["$push"][key];
        if(key == "inbox"){
            if(docs.source == "instagram"){
                Unionize.afterhooks["frominstagram"](userId, docs);
            }
            else if(docs.source == "facebook"){
                Unionize.afterhooks["fromFacebook"](userId, docs);
            }else{
                Unionize.afterhooks["inbox"](userId, docs);
            }
        }else{
            Unionize.afterhooks[key](userId, docs);
        }
          docs = modifier["$push"][key];
        }
    }
    catch(error){
      console.error(error);
    }
});


WI.before.update(function(userId, doc, fieldNames, modifier, options){
  // what if outox and feed are updated in the same call? -elias
  try{
    console.time('beforeHook')
    // var fieldName, modifier, _i, _len;
    // for (_i = 0, _len = fieldNames.length; _i < _len; _i++) {
    //   fieldName = fieldNames[_i];
    //   if (_.has(afterModifier, fieldName)) {
    //     // smite(fieldName, 'spinning afterModifier', eval(s));
    //     modifier = afterModifier[fieldName](modifier, doc, userId);
    //   }
    // }
    // log(fieldNames, modifier)
    var key = fieldNames[0];
    console.log(key)
    if(key && Unionize.hooks[key] && modifier["$push"]){ // && modifier["$push"][key]
      var docs = modifier["$push"][key];
      if(docs.cycleComplete)
        return;
        if(key == "inbox"){
            // nope, this needs to be done in the next step, not here
            // and an instagram picture will be W.from=instagram , don't make a new atribute
            // in here you are where you are from
            if(docs.source == "instagram"){
              Unionize.hooks["frominstagram"](userId, docs);
            }
            else if(docs.source == "facebook"){
              Unionize.hooks["fromFacebook"](userId, docs);
            }else{
              Unionize.hooks["inbox"](userId, docs);
            }
        }else{
            Unionize.hooks[key](userId, docs);
        }
      
      // modifier["$push"][key] = Unionize.onWUpdateHook(userId, docs, keys[key]);
      docs = modifier["$push"][key];
      // docs.journey.push({"onInsertWIInbox": Unionize.getUTC() - docs.startTime});
    }
    return docs;
    // else if(fieldNames[0] == "follow"){
    //   modifier["$push"].follow = Unionize.onWUpdateHookFollow(userId, modifier["$push"].follow);
    //   var docs = modifier["$push"].follow;
    // }
  }
  catch(error){
    console.error(error);
  }
  finally{
    console.timeEnd('beforeHook')
  }
});
// W.after.update(function(){
  
// });

Unionize.hooks.outbox = Unionize.onWUpdateHook = function(userId, docs, key){
  log("Unionize.onWInsertHook");
  // log(docs.clientUpdate,Meteor.isServer)
  if(docs.clientUpdate && Meteor.isServer)
   return docs;

  if(Meteor.isClient){
    if(!Unionize.exists(docs.to))
      return docs;
    docs.clientUpdate = true;
  }
  
  Unionize.prepare(docs.to);
  
  // docs.journey.push({"onWUpdateHook": Unionize.getUTC()- docs.startTime});

  // console.log(docs._id,Meteor.isClient,Meteor.isServer)
  docs.key = key;
  docs.cycleComplete = true;
  W.insert(docs);

  // docs.journey.push({"onInsertW": Unionize.getUTC()- docs.startTime});

  
  var update = {};
  update["inbox"] = docs;
  WI.update(docs.to,{$push: update});
  // docs.journey.push({"onInsertWIInbox": Unionize.getUTC()- docs.startTime});
  // if(WI.find(docs.to).count()){
  //   // log("to updated");
  // }
  return docs;
  
  // replicated on W collection
}

Unionize.afterhooks.outbox = function(userId, docs, key){
  log("afterhooks_inbox");
  // log(userId, docs, key);
}



Unionize.hooks.inbox = function(userId, docs, key){
  log("hooks_inbox");
  // log(userId, docs, key);
}

Unionize.afterhooks.inbox = function(userId, docs, key){
  log("afterhooks_inbox");
  // log(userId, docs, key);
}

Unionize.hooks.feed = function(userId, docs, key){
  log("hooks_feed");
  // log(userId, docs, key);
}

Unionize.afterhooks.feed = function(userId, docs, key){
  log("afterhooks_feed");
  // log(userId, docs, key);
}

Unionize.hooks.follow = function(userId, docs, key){
  log("hooks_follows");
  // log(userId, docs, key);
}

Unionize.afterhooks.follow = function(userId, docs, key){
  log("afterhooks_recommended");
  // log(userId, docs, key);
}

Unionize.hooks.recommend = function(userId, docs, key){
  log("hooks_recommended");
  // log(userId, docs, key);
}

Unionize.afterhooks.recommend = function(userId, docs, key){
  log("afterhookss_recommended");
  // log(userId, docs, key);
}

Unionize.hooks.seen = function(userId, docs, key){
  log("hooks_seen");
  // log(userId, docs, key);
}
Unionize.afterhooks.seen = function(userId, docs, key){
  log("afterhooks_seen");
  // log(userId, docs, key);
}


Unionize.hooks.vote = function(userId, docs, key){
  log("hooks_vote");
  // log(userId, docs, key);
}
Unionize.afterhooks.vote = function(userId, docs, key){
  log("afterhooks_vote");
  // log(userId, docs, key);
}

Unionize.hooks.fromFacebook = function(userId, docs, key){
  log("hooks_fromFacebook");
  // log(userId, docs, key);
}

Unionize.afterhooks.fromFacebook = function(userId, docs, key){
  log("afterhooks_fromFacebook");
  // log(userId, docs, key);
}

Unionize.hooks.frominstagram = function(userId, docs, key){
  log("hooks_fromFacebook");
  // log(userId, docs, key);
}

Unionize.afterhooks.frominstagram = function(userId, docs, key){
  log("afterhooks_fromFacebook");
  // log(userId, docs, key);
}
