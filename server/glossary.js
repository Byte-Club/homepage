/** setup our redis database object */
var db = require('redis').createClient();

/** Glossary is the namespace for our module */
Glossary = {

  /** route to get terms */
  index: function(request, response){
    if(request.params.term){
      var cleanTerm = request.params.term.replace(/\_/g,' ');
      db.hget('glossary:terms', cleanTerm, function(err,termDef){
        if(err){ return response.send(500); }
        response.send(termDef, 200);
      });
    } else {
      db.hgetall('glossary:terms', function(err, terms){
        if(err){ return response.send(500); }
        var termList = [], termObj;

        for(var term in terms){
          termObj = {};
          termObj[term] =  terms[term];
          termList.push(termObj);
        }
        termList.sort(function(a,b){
            var aTerm, bTerm;
            for(aTerm in a){ }
            for(bTerm in b){ }            
            if(aTerm.toLowerCase() > bTerm.toLowerCase()) { return 1; }
            if(aTerm.toLowerCase() < bTerm.toLowerCase()) { return -1; }
            else { return 0; }
        });
        response.send(termList,200);
      });
    }
  },


  /** route to create new terms */
  create: function(request, response){
    if(!request.body.term){ return response.send(400); }
    db.hsetnx('glossary:terms', request.body.term, request.body.definition || '', function(err, success){
      if(err){ return response.send(500); }
      response.send(success ? 201 : 400);
    });
  },

  /** route to update terms with new definitions 
      expects spaces in terms to be _
  */
  update: function(request, response){
    var cleanTerm = request.params.term.replace(/\_/g,' ');
    //console.log(cleanTerm);
    db.hexists('glossary:terms', cleanTerm, function(err, exists){
      if(exists){
        db.hset('glossary:terms', cleanTerm, request.body.definition || '', function(err, success){
          if(err){ return response.send(500); }
          response.send(200);
        });
      } else {
        response.send(404);
      }
    });
  }
};

module.exports = Glossary;
