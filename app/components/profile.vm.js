module.exports = function(ko, repo, params) {
  var that = this;
  
  that.status = ko.observable('view');
  
  that.signalWork = new Audio('app/resources/En-us-work.ogg');
  that.signalRest = new Audio('app/resources/En-us-rest.ogg');
  
  that.setRepetitionCnt = ko.observable(2);
  that.setRepetitionCntr = ko.observable(1);
  that.setRepetitionGap = 5;
  that.steps = ko.observableArray([{
    description: "Step 1",
    duration: 5,
    gap: 2,
    repetitions: 1
  }, {
    description: "Step 2",
    duration: 3,
    gap: 2,
    repetitions: 2
  }, {
    description: "Step 3",
    duration: 2,
    gap: 2,
    repetitions: 4
  }]);
  
  that.stepCntr = 0;
  that.stepSecondsLeft = ko.observable(0);
  that.interval = null;
  that.phase = ko.observable('');
  that.phaseDescription = ko.observable('');
  that.stepRepetitionCntr = ko.observable(0);
  that.stepRepetitionCnt = ko.observable(0);
  
  that.start = function() {
    that.status('run');
    initSet();
    
    that.interval = setInterval(function() {
      that.stepSecondsLeft(that.stepSecondsLeft() - 1);
      if (that.stepSecondsLeft() === 0) {
        if (that.phase() === 'Gap') {
          initSet();
        } else if (that.phase() === 'Work') {
          that.signalRest.play();
          that.phase('Rest');
          that.stepSecondsLeft(that.currProfile().steps[that.stepCntr].gap);
        } else {
          if (that.stepRepetitionCntr() < that.stepRepetitionCnt()) {
            that.stepRepetitionCntr(that.stepRepetitionCntr() + 1);
            that.signalWork.play();
            that.phase('Work');
            that.phaseDescription(that.currProfile().steps[that.stepCntr].description);
            that.stepSecondsLeft(that.currProfile().steps[that.stepCntr].duration);
          } else {
            that.stepCntr += 1;
            
            if (that.stepCntr < that.currProfile().steps.length) {
              that.signalWork.play();
              that.phase('Work');
              that.phaseDescription(that.currProfile().steps[that.stepCntr].description);
              that.stepSecondsLeft(that.currProfile().steps[that.stepCntr].duration);
              that.stepRepetitionCnt(that.currProfile().steps[that.stepCntr].repetitions);
              that.stepRepetitionCntr(1);
            } else {
              if (that.setRepetitionCntr() < that.setRepetitionCnt()) {
                that.phase('Gap');
                that.setRepetitionCntr(that.setRepetitionCntr() + 1);
                that.stepSecondsLeft(that.setRepetitionGap);
              } else {
                that.stop();
              }
            }
          }
        }
      }
    }, 1000);
  };
  
  that.stop = function() {
    clearInterval(that.interval);
    that.interval = null;
    that.status('view');
  };
  
  that.profileTitles = ko.observableArray([]);
  that.selectedProfileTitle = ko.observable();
  
  that.newProfile = {};
  that.currProfile = ko.observable(null);
  
  that.selectedProfileTitle.subscribe(function(profile) {
    if (!that.selectedProfileTitle()) {
      that.currProfile(null);
      return;
    }
    
    repo.getProfileById(that.selectedProfileTitle().id).then(function(p) {
      that.currProfile(p);
    }).done();
  });
  
  that.profileCreate = function() {
    that.newProfile = {};
    that.status('edit');
  };
  
  that.profileDelete = function() {
    repo.deleteProfile(that.currProfile()).then(function(res) {
      updateProfileList();
    }).done();
  };
  
  that.profileEdit = function() {
    that.newProfile = JSON.parse(JSON.stringify(that.currProfile()));
    that.newProfile.steps = ko.observableArray(that.newProfile.steps);
    that.status('edit');
  };
  
  that.profileEditCancel = function() {
    that.newProfile = {};
    that.status('view');
  };

  that.profileEditSave = function() {
    var prom;
    
    if (that.newProfile.steps) {
      that.newProfile.steps = that.newProfile.steps();
    }
    
    if (that.newProfile._id) {
      prom = repo.updateProfile(that.newProfile);
    } else {
      prom = repo.createNewProfile(that.newProfile);
    }
    
    prom.then(function(res) {
      updateProfileList(res.id);
    }).fail(function(error) {
      console.log(error);
    }).fin(function() {
      that.status('view');
    }).done();
  };
  
  that.profileEditAddStep = function() {
    if (!that.newProfile.steps) {
      that.newProfile.steps = ko.observableArray([]);
    }
    
    that.newProfile.steps.push({
      description: "",
      duration: 10,
      gap: 5,
      repetitions: 1
    });
  };
  
  that.profileEditRemoveStep = function(step) {
    console.log(step);
    that.newProfile.steps.remove(step);
  };
  
  function updateProfileList(id) {
    repo.getAllProfileTitles().then(function(titles) {
      that.profileTitles(titles);
      
      if (id) {
        var idx;
        
        titles.forEach(function(elem, index) {
          if (elem.id === id) {
            idx = index;
          }
        });
        
        if (typeof idx !== 'undefined') {
          that.selectedProfileTitle(titles[idx]);
        }
      }
    });
  }
  
  function initSet() {
    that.stepCntr = 0;
    that.signalWork.play();
    that.phase('Work');
    that.phaseDescription(that.currProfile().steps[that.stepCntr].description);
    that.stepSecondsLeft(that.currProfile().steps[that.stepCntr].duration);
    that.stepRepetitionCnt(that.currProfile().steps[that.stepCntr].repetitions);
    that.stepRepetitionCntr(1);
  }
  
  updateProfileList();
};
