TRIPODS.game_state = (function () {
	
	var submod = {
		initialised: 0,
		moves: 0,
		ignore_user_input: 0, // E.g. when foot move is being animated
		level: 0,
		level_win: 0,
		block_coords: []
	},

	$moves_span = $('h2.score span'),
	foot_1_center, foot_2_center, foot_3_center, landing_1_center,
	landing_other_center = [];

	submod.updateMoveCounter = function() {
		submod.moves++;

		if (TRIPODS.events.state.hold) { // If the pivot is being held, don't bother fading
			$moves_span.text(submod.moves);
		} else if (!TRIPODS.events.state.hold) {
			$moves_span.fadeOut(90, function() {
				$(this).text(submod.moves).fadeIn(20);
				submod.pivot_hold = 0;
			});
		}
	}

	submod.getWinCoords = function() { // Store target center points

		landing_other_center.length = 0;		
		landing_1_center = TRIPODS.fun.getCenterPoint($('.landing_1'));

		$('.landing-other').each(function() {
			landing_other_center.push(TRIPODS.fun.getCenterPoint($(this)));
		});
	}

	submod.checkWin = function() {

		var feet_on_target = [];

		foot_1_center = TRIPODS.fun.getCenterPoint($('#foot1'));

		if (foot_1_center.x === landing_1_center.x && foot_1_center.y === landing_1_center.y) { // If foot 1 is on its target spot
			
			feet_on_target.push('foot1');

			foot_2_center = TRIPODS.fun.getCenterPoint($('#foot2'));
			foot_3_center = TRIPODS.fun.getCenterPoint($('#foot3'));

			// Check whether another foot is on target
			$.each(landing_other_center, function() {
				if (this.x === foot_2_center.x && this.y === foot_2_center.y) feet_on_target.push('foot2');
					else if (this.x === foot_3_center.x && this.y === foot_3_center.y) feet_on_target.push('foot3');
			});

			if (feet_on_target.length === 3) { // If all feet are on target
				onWin();
			}
		}
	}

	var onWin = function() { // Function to run on win

		submod.level_win = 1;

		clearTimeout(TRIPODS.events.state.hold_interval); // If user is has pivitor held, stop repeated calls to pivot function

		$('.layer-active').animate({opacity: '0.1'}, 600, function() {
			$(this).animate({opacity: '1'}, 900, function() {
				submod.ignore_user_input = 0;
				TRIPODS.level_builder.showSuccessMessage();				
			});
		});
	}

	return submod;

}());