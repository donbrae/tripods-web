TRIPODS.utils=function(_module){"use strict";const _this={};_this.getLineDistance=function(point1,point2){let xs=0;let ys=0;xs=point2.x-point1.x;xs=xs*xs;ys=point2.y-point1.y;ys=ys*ys;return Math.sqrt(xs+ys)};_this.getCenterPoint=function(el){const el_rect=el.getBoundingClientRect();const center_x=el_rect.x+el_rect.width/2;const center_y=el_rect.y+el_rect.height/2;return{x:center_x,y:center_y}};_this.getLineDistanceEl=function(obj1,obj2){return this.getLineDistance(this.getCenterPoint(obj1),this.getCenterPoint(obj2))};_this.getAngle=function(x1,y1,x2,y2){const dx=x2-x1;const dy=y2-y1;return Math.atan2(dy,dx)*(180/Math.PI)};_this.getAngleEl=function(obj1,obj2){const obj1_coords=this.getCenterPoint(obj1);const obj2_coords=this.getCenterPoint(obj2);return this.getAngle(obj1_coords.x,obj1_coords.y,obj2_coords.x,obj2_coords.y)};_this.getTranslateXY=function(element){const style=window.getComputedStyle(element);const matrix=new DOMMatrixReadOnly(style.transform);return{tX:matrix.m41,tY:matrix.m42}};_this.extend=function(out){out=out||{};for(let i=1;i<arguments.length;i++){if(!arguments[i])continue;for(let key in arguments[i]){if(arguments[i].hasOwnProperty(key))out[key]=arguments[i][key]}}return out};_this.animate=function(element,keyframes,{duration=1000,easing="linear",delay=0,iterations=1,direction="normal",fill="forwards"},callback=null){const animation=element.animate(keyframes,{duration:duration,easing:easing,delay:delay,iterations:iterations,direction:direction,fill:fill});if(typeof callback=="function"){animation.onfinish=callback}return animation};_this.fadeIn=function(selector,duration=180,delay=0,callback){const element=document.querySelector(selector);let animation=undefined;if(element){element.classList.remove("hide","opacity-0");element.style.filter="opacity(0)";animation=_module.utils.animate(element,[{filter:getComputedStyle(element).filter},{filter:"opacity(1)"}],{duration:duration,easing:"ease-in",delay:delay},callback)}return animation};_this.fadeOut=function(selector,duration=180,hide=false,callback){const element=document.querySelector(selector);if(element){_module.utils.animate(element,[{filter:getComputedStyle(element).filter},{filter:"opacity(0)"}],{duration:duration,easing:"ease-out"},()=>{if(hide){element.classList.add("hide")}if(typeof callback=="function"){callback()}})}};_this.fadeOutAndDisable=function(selector){_this.fadeOut(selector,100,false);document.querySelector(selector).disabled=true};_this.log=function(msg){if(navigator.maxTouchPoints){document.querySelector(".log").innerHTML="".concat(msg," [").concat(Math.round(new Date().getTime()/1000),"]<br>").concat(document.querySelector(".log").innerHTML)}else{console.log(msg)}};_this.is_iOS=function(){const user_agent=navigator.userAgent.toLowerCase();return user_agent.indexOf("iphone")>-1||user_agent.indexOf("ipod")>-1||user_agent.indexOf("ipad")>-1||navigator.maxTouchPoints&&/Mac/.test(navigator.platform)};_this.handleOrientation=function(){if(!navigator.maxTouchPoints){return false}const landscape=window.innerHeight<window.innerWidth;const max_width_portrait=1024;if(landscape&&window.innerWidth<=max_width_portrait){Array.prototype.forEach.call(document.querySelectorAll(".full-screen:not(.screen-landscape)"),screen=>{screen.classList.add("landscape-hidden");document.querySelector(".container-game").classList.add("landscape-hidden")});_this.fadeIn(".screen-landscape",80)}else{_this.fadeOut(".screen-landscape",80,true);Array.prototype.forEach.call(document.querySelectorAll(".landscape-hidden"),screen=>{screen.classList.remove("landscape-hidden")});_this.setLevelSelectGridHeight()}};_this.isScrolledToBottom=function(element,threshold=0){const scrollTop=element.scrollTop;const scrollHeight=element.scrollHeight;const clientHeight=element.clientHeight;return scrollHeight-Math.round(scrollTop+clientHeight)<=threshold};_this.setLevelSelectGridHeight=function(){const level_buttons_container=document.getElementById("level-buttons");level_buttons_container.style.maxHeight=0;level_buttons_container.style.maxHeight="".concat(window.innerHeight-level_buttons_container.getBoundingClientRect().y-_module.cfg.level_buttons_container_spacing_bottom,"px");if(Math.round(window.innerHeight-document.getElementById("level-buttons").getBoundingClientRect().bottom-_module.cfg.level_buttons_container_spacing_bottom)){document.querySelector("footer").classList.add("relative")}else{document.querySelector("footer").classList.remove("relative")}if(document.querySelector("footer").classList.contains("relative")&&!_this.isVisible("footer")){_this.fadeIn("footer",80)}};_this.isVisible=function(selector){const el=document.querySelector(selector);return!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)};_this.invertElements=function(selector){document.querySelectorAll(selector).forEach(el=>{const color_scheme=_module.game_state.color_scheme;if(color_scheme==="light"){_module.utils.animate(el,[{filter:"invert(0)"}],{duration:0})}else{_module.utils.animate(el,[{filter:"invert(1)"}],{duration:0})}})};_this.sendStats=function(querystring){fetch("https://donbrae.co.uk/tripods-stats/write-log.php?".concat(querystring)).then(response=>{if(response.ok)return response.json();return Promise.reject(response)}).then(json=>{}).catch(error=>{console.warn(error)})};return _this}(TRIPODS||{});