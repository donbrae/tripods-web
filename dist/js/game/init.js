var TRIPODS=function(_this){"use strict";_this.cfg={svg_elements:{empty:null,grid:{name:"empty",shape:"circle",classes:"grid",attributes:{"stroke-width":1,"fill-opacity":0,stroke:"#fff"}},foot1:{control:1,name:"foot1",id:"foot1",shape:"circle",classes:["control","foot"],attributes:{}},foot2:{name:"foot2",id:"foot2"},foot3:{name:"foot3",id:"foot3"},block:{name:"block",shape:"path",classes:["block"],viewBox:"0 0 24 24",attributes:{fill:"#5496ff",d:"M12 0l-11 6v12.131l11 5.869 11-5.869v-12.066l-11-6.065zm7.91 6.646l-7.905 4.218-7.872-4.294 7.862-4.289 7.915 4.365zm-6.91 14.554v-8.6l8-4.269v8.6l-8 4.269z",opacity:0.9}},vortex:{name:"vortex",shape:"path",classes:["vortex","swirl"],viewBox:"0 0 24 24",attributes:{fill:"#fff",d:"M13.66,5.79A13.73,13.73,0,0,1,24,8.36C22.26,4.08,17.55,1,12,1,7.1,1,2.92,4.08,2.14,8.27s2.16,8.83,8.21,9.92A13.76,13.76,0,0,1,0,15.61C1.73,19.91,6.45,23,12,23h.3c4.83-.1,8.89-3.17,9.64-7.3S19.75,6.88,13.66,5.79Z"},lose_message:"Ach, the tripod was souked into a vortex.<br><br>Make sure to avoid the vortices as you move to the landing spots."},landing_foot1:{name:"landing_foot1",shape:"circle",classes:[],attributes:{"stroke-width":4,"fill-opacity":0,opacity:0.7}},landing_foot2:{name:"landing_foot2",classes:[]},landing_foot3:{name:"landing_foot3",classes:[]},pivotor:{name:"pivotor",id:"pivotor",shape:"path",classes:["control","pivotor"],viewBox:"-13 -14 50 50",attributes:{d:"M4.115 5.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.819-2.706-7.297-2.676-10.074.1-2.992 2.993-2.664 7.684.188 10.319l-3.314 3.5c-4.716-4.226-5.257-12.223-.267-17.213z",fill:"#fff",opacity:"0.55"}},tap:{name:"tap",id:"tap",classes:["opacity-0"],viewBox:"0 0 20.7 14.6",shapes:[{shape:"text",attributes:{x:3.9,y:9.3,fill:"#222","font-size":"8px","font-weight":500}},{shape:"path",attributes:{fill:"#edeaa8",d:"M20.6,10.3V0.2H0.1v10.1l10.3,4.2L20.6,10.3z"}}]},star:"<svg viewBox=\"0 0 201 190\" class=\"star\"><path id=\"Star\" d=\"M100.5 5 L69.276 61.524 5.87 73.753 49.979 120.915 42.015 184.997 100.5 157.621 158.985 184.997 151.021 120.915 195.13 73.753 131.724 61.524 Z\" fill=\"#fffa8a\" stroke=\"#fffa8a\" stroke-width=\"10\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>",star_outline:"<svg viewBox=\"0 0 201 190\" class=\"star\"><path id=\"Star\" d=\"M100.5 5 L69.276 61.524 5.87 73.753 49.979 120.915 42.015 184.997 100.5 157.621 158.985 184.997 151.021 120.915 195.13 73.753 131.724 61.524 Z\" fill=\"none\" stroke=\"#fffa8a\" stroke-width=\"10\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>"},animation:{jump_duration:210},grid_max_dimensions:700,control_padding:8,sound:true,logging:false};_this.ui_attributes={cell_dimensions:0,control_padding:0,landing_stroke_width:0};_this.init=function(){function _extendConfig(){_this.cfg.svg_elements.foot2=_this.utils.extend({},_this.cfg.svg_elements.foot1,_this.cfg.svg_elements.foot2);_this.cfg.svg_elements.foot2.attributes=_this.utils.extend({},_this.cfg.svg_elements.foot1.attributes,_this.cfg.svg_elements.foot2.attributes);_this.cfg.svg_elements.foot3=_this.utils.extend({},_this.cfg.svg_elements.foot1,_this.cfg.svg_elements.foot3);_this.cfg.svg_elements.foot3.attributes=_this.utils.extend({},_this.cfg.svg_elements.foot1.attributes,_this.cfg.svg_elements.foot3.attributes);_this.cfg.svg_elements.landing_foot2=_this.utils.extend({},_this.cfg.svg_elements.landing_foot1,_this.cfg.svg_elements.landing_foot2);_this.cfg.svg_elements.landing_foot2.attributes=_this.utils.extend({},_this.cfg.svg_elements.landing_foot1.attributes,_this.cfg.svg_elements.landing_foot2.attributes);_this.cfg.svg_elements.landing_foot3=_this.utils.extend({},_this.cfg.svg_elements.landing_foot1,_this.cfg.svg_elements.landing_foot3);_this.cfg.svg_elements.landing_foot3.attributes=_this.utils.extend({},_this.cfg.svg_elements.landing_foot1.attributes,_this.cfg.svg_elements.landing_foot3.attributes);_this.cfg.svg_elements.landing_foot1.classes.push("landing","landing-1");_this.cfg.svg_elements.landing_foot2.classes.push("landing","landing-2");_this.cfg.svg_elements.landing_foot3.classes.push("landing","landing-3");_this.cfg.linking=[_this.cfg.svg_elements.empty,_this.cfg.svg_elements.foot1,_this.cfg.svg_elements.foot2,_this.cfg.svg_elements.foot3,_this.cfg.svg_elements.block,_this.cfg.svg_elements.landing_foot1,_this.cfg.svg_elements.landing_foot2,_this.cfg.svg_elements.landing_foot3,_this.cfg.svg_elements.vortex]};function _initConfettiCanvas(){const canvas=document.getElementById("confetti-canvas");canvas.confetti=canvas.confetti||confetti.create(canvas,{resize:true})}if(!document.querySelector("body").animate){const screen_landscape=document.querySelector(".screen-landscape");screen_landscape.innerHTML="<h2>Sorry, Tripods requires a more modern browser in order to run.</h2>";document.querySelector(".screen-landscape").classList.remove("hide");return false}_extendConfig();_initConfettiCanvas();_this.sound.init();_this.utils.fadeOut(".blank-overlay",undefined,true,function(){_this.utils.fadeIn(".screen-level-select",undefined,true);_this.events.addEventListeners();_this.utils.handleOrientation()});const stored_moves=window.localStorage.getItem("TRIPODS_moves");if(stored_moves){_this.game_state.moves=stored_moves.split(",")}const sound=window.localStorage.getItem("TRIPODS_sound");if(sound&&sound=="false"){_this.game_state.sound=false}else if(sound&&sound=="true"){_this.game_state.sound=true}else{_this.game_state.sound=_this.cfg.sound}if(_this.game_state.sound){document.getElementById("sound").classList.add("sound-on")}else{document.getElementById("sound").classList.add("sound-off")}const level=parseInt(window.localStorage.getItem("TRIPODS_level"));let index;if(level){_this.game_state.level=level;index=level+1}else{index=1}_this.addLevelSelect(index);if(_this.cfg.logging){document.querySelector(".log").innerHTML=""}if(_this.cfg.logging)_this.utils.log("Test log message")};_this.addLevelSelect=function(){const level_buttons_container=document.getElementById("level-buttons");const level_buttons=level_buttons_container.querySelectorAll("button");const tutorial_1_complete=_this.game_state.moves[0];const tutorial_2_complete=_this.game_state.moves[1];_this.levels.forEach((_,i)=>{const moves=parseInt(_this.game_state.moves[i]);const threshold=_this.levels[i][1];let rating;if(!isNaN(moves)&&moves<=threshold){rating="\u2605\u2605\u2605"}else if(!isNaN(moves)&&moves<=threshold*2){rating="\u2605\u2605\u2606"}else if(!isNaN(moves)&&moves){rating="\u2605\u2606\u2606"}else{rating=""}if(level_buttons.length){level_buttons[i].querySelector(".rating").innerHTML=rating;if(tutorial_1_complete&&i===1||tutorial_1_complete&&tutorial_2_complete){level_buttons[i].disabled=false;level_buttons[i].classList.remove("disabled")}else if(i){level_buttons[i].disabled=true;level_buttons[i].classList.add("disabled")}}else{const disabled=!tutorial_1_complete&&i||!tutorial_2_complete&&i>1?" disabled":"";level_buttons_container.insertAdjacentHTML("beforeend","<button class=\"flex-grid-item subtle start".concat(disabled,"\" data-level=\"").concat(i,"\"").concat(disabled,"><div class=\"level\">").concat(i+1,"</div><div class=\"rating\">").concat(rating,"</div></button>"))}})};return _this}(TRIPODS||{});