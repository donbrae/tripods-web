var TRIPODS=function(_this){"use strict";function _addElement(el,layer_element,left,top){if(el){const svg=document.createElement("svg");if(el.defs!==undefined)svg.insertAdjacentHTML("beforeend","<defs>".concat(el.defs,"</defs>"));if(el.classes!==undefined){[].concat(el.classes).forEach(item=>{svg.classList.add(item)})}if(el.viewBox!==undefined)svg.setAttribute("viewBox",el.viewBox);if(el.id!==undefined)svg.setAttribute("id",el.id);if(el.shapes){el.shapes.forEach(shape=>{svg.insertAdjacentHTML("afterbegin","<".concat(shape.shape,"></").concat(shape.shape,">"));if(shape.attributes!==undefined){Object.keys(shape.attributes).forEach(function(key){svg.querySelectorAll(shape.shape)[0].setAttribute(key,shape.attributes[key])})}})}else{svg.insertAdjacentHTML("afterbegin","<".concat(el.shape,"></").concat(el.shape,">"));if(el.attributes!==undefined){Object.keys(el.attributes).forEach(function(key){svg.querySelectorAll(el.shape)[0].setAttribute(key,el.attributes[key])})}}if(el.name==="pivotor"){svg.style.filter="opacity(0)"}svg.style.top="".concat(top,"px");svg.style.left="".concat(left,"px");layer_element.insertAdjacentHTML("beforeend",svg.outerHTML)}};function _addLayer(id){const container=document.getElementsByClassName("container")[0];container.insertAdjacentHTML("beforeend","<div class=\"layer\" id=\"".concat(id,"\"></div>"));return container.querySelector(".layer:last-of-type")};function _addControlTouchPadding(){const elements=document.querySelectorAll(".control");Array.prototype.forEach.call(elements,el=>{const side=parseFloat(getComputedStyle(el)["width"]);const left=parseFloat(getComputedStyle(el)["left"]);const top=parseFloat(getComputedStyle(el)["top"]);const new_side=side+_this.ui_attributes.control_padding*2;const shunt=(new_side-side)/2;el.style.width="".concat(new_side,"px");el.style.height="".concat(new_side,"px");el.style.top="".concat(top-shunt,"px");el.style.left="".concat(left-shunt,"px");const circle=el.querySelector("circle");const cx=circle?parseFloat(circle.getAttribute("cx")):null;if(cx&&!isNaN(cx)){const c=cx+_this.ui_attributes.control_padding;const circle=el.querySelector("circle");circle.setAttribute("cx",c);circle.setAttribute("cy",c);const clipPath=el.querySelector("clipPath");if(clipPath){const circle=clipPath.querySelector("circle");circle.setAttribute("cx",c);circle.setAttribute("cy",c)}}})}_this.addElements=function(){_this.ui_attributes.cell_dimensions=Math.round((window.innerWidth-window.innerWidth/8)/_this.levels[_this.game_state.level][2].length);const wide=window.innerWidth>_this.cfg.grid_max_dimensions;const browser_not_tall_enough=_this.cfg.grid_max_dimensions>window.innerHeight-_this.cfg.grid_max_dimensions/3;if(wide&&!browser_not_tall_enough){_this.ui_attributes.cell_dimensions=Math.round((_this.cfg.grid_max_dimensions-90)/_this.levels[_this.game_state.level][2].length)}else if(browser_not_tall_enough&&window.innerWidth>window.innerHeight){_this.ui_attributes.cell_dimensions=Math.round((_this.cfg.grid_max_dimensions-_this.cfg.grid_max_dimensions/3)/_this.levels[_this.game_state.level][2].length)}let top=0;let layer_element=_addLayer("grid");_this.levels[_this.game_state.level].forEach((row,i)=>{if(i>1){let left=0;row.forEach(square=>{if(square===0||square===1||square===2||square===3)_addElement(_this.cfg.svg_elements.grid,layer_element,left,top);left+=_this.ui_attributes.cell_dimensions});top+=_this.ui_attributes.cell_dimensions}});let three_specific_landing_spots=false;top=0;layer_element=_addLayer("blockers-landing-spots");if(!_this.ui_attributes.landing_stroke_width){_this.ui_attributes.landing_stroke_width=_this.cfg.svg_elements.landing_foot1.attributes["stroke-width"]}_this.ui_attributes.control_padding=Math.round(_this.cfg.control_padding*(_this.ui_attributes.cell_dimensions/36));_this.levels[_this.game_state.level].forEach((row,i)=>{if(i>1){let left=0;row.forEach(square=>{if(square===4||square===5||square===6||square===7||square===8){if(square===7)three_specific_landing_spots=true;if(_this.cfg.linking[square]&&_this.cfg.linking[square].attributes&&(square===5||square===6||square===7)){let stroke;switch(square){case 5:stroke=_this.levels[_this.game_state.level][0][0];break;case 6:stroke=_this.levels[_this.game_state.level][0][1];break;case 7:stroke=_this.levels[_this.game_state.level][0][2];break}_this.cfg.linking[square].attributes.stroke=stroke;_this.cfg.linking[square].attributes["stroke-width"]=_this.ui_attributes.landing_stroke_width*(_this.ui_attributes.cell_dimensions/36).toFixed(2)}_addElement(_this.cfg.linking[square],layer_element,left,top)}left+=_this.ui_attributes.cell_dimensions});top+=_this.ui_attributes.cell_dimensions}});top=0;layer_element=_addLayer("interactive");_this.levels[_this.game_state.level].forEach((row,i)=>{if(i>1){let left=0;const stroke_width=_this.ui_attributes.cell_dimensions/4.8;_this.ui_attributes.guide_stroke_width=stroke_width;row.forEach(square=>{if(square===1||square===2||square===3){let fill;switch(square){case 1:fill=_this.levels[_this.game_state.level][0][0];break;case 2:fill=_this.levels[_this.game_state.level][0][1];break;case 3:if(three_specific_landing_spots)fill=_this.levels[_this.game_state.level][0][2];else fill=_this.levels[_this.game_state.level][0][1];break}_this.cfg.linking[square].attributes.fill=fill;_this.cfg.linking[square].attributes["stroke-width"]="".concat(stroke_width,"px");_addElement(_this.cfg.linking[square],layer_element,left,top)}left+=_this.ui_attributes.cell_dimensions});top+=_this.ui_attributes.cell_dimensions}});_addElement(_this.cfg.svg_elements.pivotor,layer_element,0,0);if(_this.tutorials.cfg.levels[_this.game_state.level]){_addElement(_this.cfg.svg_elements.tap,layer_element,0,0)}const dimension=_this.ui_attributes.cell_dimensions*_this.levels[_this.game_state.level][2].length;_this.ui_attributes.grid_dimensions=dimension;const container=document.getElementById("container-grid");container.style.width="".concat(dimension,"px");container.style.height="".concat(dimension,"px");container.style.padding="".concat(Math.round(dimension/75),"px");container.style.borderRadius="".concat(Math.round(dimension/13),"px");Array.prototype.forEach.call(document.querySelectorAll(".layer"),el=>{el.style.width="".concat(dimension,"px");el.style.height="".concat(dimension,"px");Array.prototype.forEach.call(el.querySelectorAll("svg"),svg=>{const cell_width=_this.ui_attributes.cell_dimensions;if(svg.id==="tap"){svg.style.width="".concat(cell_width*0.95,"px");svg.style.height="".concat(cell_width*0.6,"px")}else{svg.style.width="".concat(cell_width,"px");svg.style.height="".concat(cell_width,"px");if(svg.children[0].nodeName==="circle"){const clipPath=svg.querySelector("clipPath");const c=cell_width/2;const r=cell_width/2.375;svg.children[0].setAttribute("cx",c);svg.children[0].setAttribute("cy",c);if(clipPath){const circle=clipPath.querySelector("circle");circle.setAttribute("cx",c);circle.setAttribute("cy",c)}if(svg.id&&svg.id==="pivotor"){svg.children[0].setAttribute("r",cell_width/5)}else if(svg.classList.contains("grid")){svg.children[0].setAttribute("r",cell_width/2.45);svg.children[0].setAttribute("stroke-width",window.innerWidth>414?dimension/600:dimension/450)}else{svg.children[0].setAttribute("r",r);if(clipPath){clipPath.querySelector("circle").setAttribute("r",r)}}}else if(svg.children[0].nodeName==="rect"){svg.children[0].setAttribute("width",cell_width);svg.children[0].setAttribute("height",cell_width)}}})});Array.prototype.forEach.call(document.querySelector(".container-game").children,el=>{if(!el.classList.contains("ingame-title")){el.style.width="".concat(dimension,"px")}});_addControlTouchPadding()};return _this}(TRIPODS||{});