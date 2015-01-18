if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {
  return function(params) {
    var that = this;
    
    that.signalWork = new Audio('app/resources/En-us-work.ogg');
    that.signalRest = new Audio('app/resources/En-us-rest.ogg');
    
    that.ko = params.ko;
    that.repo = params.repo;
    that.pubsub = params.pubsub;

    that.profileName = that.ko.observable("Test");
    that.setRepetitionCnt = that.ko.observable(2);
    that.setRepetitionCntr = that.ko.observable(1);
    that.setRepetitionGap = 5;
    that.steps = that.ko.observableArray([{
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
    that.stepSecondsLeft = that.ko.observable(0);
    that.running = that.ko.observable(false);
    that.interval = null;
    that.phase = that.ko.observable('');
    that.phaseDescription = that.ko.observable('');
    that.stepRepetitionCntr = that.ko.observable(0);
    that.stepRepetitionCnt = that.ko.observable(0);
    
    that.start = function() {
      that.running(true);
      initSet();
      
      that.interval = setInterval(function() {
        that.stepSecondsLeft(that.stepSecondsLeft() - 1);
        if (that.stepSecondsLeft() === 0) {
          if (that.phase() === 'Gap') {
            initSet();
          } else if (that.phase() === 'Work') {
            that.signalRest.play();
            that.phase('Rest');
            that.stepSecondsLeft(that.steps()[that.stepCntr].gap);
          } else {
            if (that.stepRepetitionCntr() < that.stepRepetitionCnt()) {
              that.stepRepetitionCntr(that.stepRepetitionCntr() + 1);
              that.signalWork.play();
              that.phase('Work');
              that.phaseDescription(that.steps()[that.stepCntr].description);
              that.stepSecondsLeft(that.steps()[that.stepCntr].duration);
            } else {
              that.stepCntr += 1;
              
              if (that.stepCntr < that.steps().length) {
                that.signalWork.play();
                that.phase('Work');
                that.phaseDescription(that.steps()[that.stepCntr].description);
                that.stepSecondsLeft(that.steps()[that.stepCntr].duration);
                that.stepRepetitionCnt(that.steps()[that.stepCntr].repetitions);
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
      that.running(false);
    };
    
    function initSet() {
      that.stepCntr = 0;
      that.signalWork.play();
      that.phase('Work');
      that.phaseDescription(that.steps()[that.stepCntr].description);
      that.stepSecondsLeft(that.steps()[that.stepCntr].duration);
      that.stepRepetitionCnt(that.steps()[that.stepCntr].repetitions);
      that.stepRepetitionCntr(1);
    }
  };
});
