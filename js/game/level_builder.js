TRIPODS.level_builder = (function () {

    var submod = {};

    submod.runLevel = function () {
        TRIPODS.mvt.getMeasurements(); // Set UI measurements
        TRIPODS.mvt.calculatePivotState();
        TRIPODS.game_state.getWinCoords();
        TRIPODS.mvt.repositionPivot();

        if (!TRIPODS.game_state.initialised) TRIPODS.game_state.initialised = 1; // Set initialised flag

        $('.layer-active').animate({ opacity: '0.1' }, 500, 'easeInOutBack', function () { // Draw attention to tripod
            $(this).animate({ opacity: '1' }, 400, 'easeInOutBack');
        });
    }

    submod.addUI = function () {
        TRIPODS.addElements(); // Add elements to grid
        TRIPODS.events.addEventListeners(); // Add event handlers

        $('h2.level span').text(TRIPODS.game_state.level + 1); // Add level
        $('h2.score span').text(TRIPODS.game_state.moves); // Add number of moves

        $('.container').children('.layer:last').addClass('layer-active'); // Add 'layer-active' class to top layer
        $('.message').fadeOut(function () {
            $('.outer-container').fadeIn(function () {
                $('.layer-active').fadeIn(200, function () { // Show active layer
                    submod.runLevel();
                });
            });
        });
    }

    submod.reset = function () {

        $('.outer-container').fadeOut(function () {
            TRIPODS.game_state.moves = 0; // Reset move count
            TRIPODS.game_state.block_coords.length = 0; // Reset block data
            TRIPODS.game_state.level_win = 0;

            $('.layer:not(.layer0)').remove();

            submod.addUI();
        });
    }

    submod.showSuccessMessage = function () {
        var t = setTimeout(function () {
            $('.message h2 span').text(TRIPODS.game_state.moves); // Print number of moves

            if (TRIPODS.game_state.level === TRIPODS.levels.length - 1) $('.next-level').remove();
            $('.message').fadeIn();
        }, 500);
    }

    return submod;

}());
