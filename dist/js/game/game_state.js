TRIPODS.game_state=function(_module){"use strict";const _this={initialised:false,moves_made:[],ignore_user_input:false,level:0,level_running:false,block_center_coords:[],vortex_center_coords:[],tutorial_running:false,element_tapped:"",moves:[],sound:undefined,guides:undefined};const moves_span=document.querySelector("h2.moves span");const landing_2_3=[];let landing_1_xy;let landing_2_xy;let landing_3_xy;_this.updateMoveCounter=function(){_module.game_state.moves_made.push(_module.game_state.element_tapped);if(_module.events.state.hold){moves_span.innerText=_this.moves_made.length}else if(!_module.events.state.hold){moves_span.innerText=_this.moves_made.length;_this.pivot_hold=0}};_this.getWinCoords=function(){if(!document.querySelectorAll(".landing").length){return false}landing_2_3.length=0;landing_1_xy=_module.utils.getCenterPoint(document.querySelector(".landing-1"));const landing_3=document.querySelector(".landing-3");if(landing_3){landing_2_xy=_module.utils.getCenterPoint(document.querySelector(".landing-2"));landing_3_xy=_module.utils.getCenterPoint(landing_3)}else{Array.prototype.forEach.call(document.querySelectorAll(".landing-2"),function(el){landing_2_3.push(_module.utils.getCenterPoint(el))})}};_this.getBlockerCoords=function(){_module.game_state.block_center_coords.length=0;Array.prototype.forEach.call(document.getElementsByClassName("block"),block=>{_module.game_state.block_center_coords.push(_module.utils.getCenterPoint(block))})};_this.getVortexCoords=function(){_module.game_state.vortex_center_coords.length=0;Array.prototype.forEach.call(document.getElementsByClassName("vortex"),vortex=>{_module.game_state.vortex_center_coords.push(_module.utils.getCenterPoint(vortex))})};_this.checkWin=function(){let win=false;const foot_1_xy=_module.utils.getCenterPoint(document.getElementById("foot1"));const foot_2_xy=_module.utils.getCenterPoint(document.getElementById("foot2"));const foot_3_xy=_module.utils.getCenterPoint(document.getElementById("foot3"));function landed(foot,landing){return Math.abs(foot.x-landing.x)<=10&&Math.abs(foot.y-landing.y)<=10}if(!landing_2_3.length&&landed(foot_1_xy,landing_1_xy)&&landed(foot_2_xy,landing_2_xy)&&landed(foot_3_xy,landing_3_xy)){win=true}else if(landing_2_3.length&&landed(foot_1_xy,landing_1_xy)&&(landed(foot_2_xy,landing_2_3[0])||landed(foot_2_xy,landing_2_3[1]))&&(landed(foot_3_xy,landing_2_3[1])||landed(foot_3_xy,landing_2_3[0]))){win=true}if(win){_this.ignore_user_input=true;setTimeout(onWin,60)}};function onWin(){_this.level_running=false;function addWinEffect(){let delay=100;Array.prototype.forEach.call(document.querySelectorAll(".landing"),el=>{setTimeout(function(){el.querySelector(":first-child").classList.add("rainbow");if(window.confetti){confetti({particleCount:75,spread:360,startVelocity:20,useWorker:true,colors:["#ff331c","#fffc36","#00f92f","#002bfb","#ff40fc","#00fbfe"],disableForReducedMotion:true,origin:{x:_module.utils.getCenterPoint(el).x/window.innerWidth*100/100,y:_module.utils.getCenterPoint(el).y/window.innerHeight*100/100}})}},delay);delay+=100});_module.sound.play("win",delay*0.5)}function removeWinEffect(){confetti.reset();Array.prototype.forEach.call(document.querySelectorAll(".landing > :first-child"),el=>{el.classList.remove("rainbow")})}setTimeout(()=>{_module.utils.fadeOut(".layer-active")},100);_module.utils.fadeOut("#pivotor");_module.utils.fadeOutAndDisable(".info-panel .hame");_module.utils.fadeOut("#sound",100);_module.utils.fadeOut("#guides",100);addWinEffect();const moves=_module.game_state.moves_made.length;const previous_best_moves=_module.game_state.moves[_this.level];if(previous_best_moves&&moves<previous_best_moves||!previous_best_moves){_module.game_state.moves[_this.level]=moves}window.localStorage.setItem("TRIPODS_moves",_module.game_state.moves);if(_module.game_state.level<_module.levels.length-1){window.localStorage.setItem("TRIPODS_level",_module.game_state.level+1)}setTimeout(function(){_this.ignore_user_input=false;_module.level_builder.showWinScreen(previous_best_moves);setTimeout(removeWinEffect,1000)},1750)}return _this}(TRIPODS||{});