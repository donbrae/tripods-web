TRIPODS.events = (function () {

  var submod = {
    state: {
      hold: 0
    }
  };

  submod.state.hold_interval = function () { };

  submod.addEventListeners = function () {

    if (!TRIPODS.game_state.initialised) {

      var interval;

      // Changes to Hammer defaults
      Hammer.gestures.Hold.defaults.hold_timeout = 600;
      Hammer.gestures.Swipe.defaults.swipe_velocity = 0.1;

      // Touch pivitor
      $(document).hammer().on('touch swipe', '.pivitor', function (e) {
        TRIPODS.mvt.pivot(e);
      });

      // Pivotor hold
      $(document).hammer().on('hold', '.pivitor', function (e) {
        submod.state.hold = 1;
        submod.state.hold_interval = setInterval(function () { // Pivot automatically
          TRIPODS.mvt.pivot(e);
        }, 100);
      });

      // Pivot release during hold
      $(document).hammer().on('release', '.pivitor', function (e) {
        var timeout = setTimeout(function () {
          submod.state.hold = 0;
        }, 500); // Timeout for TRIPODS.info_panel.updateMoveCounter()

        clearInterval(submod.state.hold_interval);
      });

      // Level-end buttons
      $(document).hammer().on('touch', '.replay', function (e) {
        TRIPODS.level_builder.reset();
      });

      $(document).hammer().on('touch', '.next-level', function (e) {
        TRIPODS.game_state.level++; // Increment level
        TRIPODS.level_builder.reset();
      });

      // Prevent dragging on other elements
      $(document).hammer().on('drag', '.container:not(.control), .outer-container, .message', function (e) {
        e.gesture.preventDefault();
      });

      // Window resize
      $(window).on('resize', function () {
        TRIPODS.mvt.getMeasurements(); // Recalculate UI measurements on window resize
        TRIPODS.game_state.getWinCoords(); // Recalculate landing spot coords
      });
    }

    // Swipe (listener for swipe needs to be added on creation of each new level)
    $('.foot').hammer().on('swipe touch', function (e) {
      TRIPODS.mvt.swipe(e);
    });

  };

  return submod;

}());
