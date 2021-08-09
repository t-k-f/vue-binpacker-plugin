'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _packerMin=require('../lib/packer.min.js'),_packerMin2=_interopRequireDefault(_packerMin),_vue=require('vue');function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}exports.default={install:function b(a){a.component('vueBinpacker',{render:function a(){return(0,_vue.h)('div',{},this.$slots.default())},emits:['layout-done'],props:{gap:{type:Object,default:function a(){return{x:0,y:0}}},rtl:{type:Boolean,required:!1,default:!1},initLayout:{type:Boolean,required:!1,default:!0},toggleLayout:{type:Boolean,required:!1,default:!1}},data:function a(){return{observer:null,observerPause:!1}},beforeUnmount:function a(){window.removeEventListener('resize',this.setPacker)},mounted:function a(){window.addEventListener('resize',this.setPacker),this.$el.style.position='relative',this.setObserver();this.initLayout&&this.setPacker()},methods:{setObserver:function a(){this.observer=new MutationObserver(this.setObserverMutations),this.observer.observe(this.$el,{childList:!0,attributes:!0,subtree:!0})},setObserverMutations:function a(){this.observerPause||!this.initLayout||this.setPacker()},setPacker:function l(){var a=this;this.observerPause=!0;var b={},c=this.$el.querySelectorAll('[data-packer-gap="true"]'),d=this.$el.getBoundingClientRect().width,e=this.$el.querySelectorAll('[data-packer-item="true"]'),f=[];c.length?(b.x=c[0].getBoundingClientRect().width,b.y=getBoundingClientRect().height):(b.x=this.gap.x,b.y=this.gap.y);for(var m,n=0;n<e.length;n++)m=e[n].getBoundingClientRect(),f.push({width:m.width,height:m.height});for(var g={width:d,height:1/0},h=(0,_packerMin2.default)(g,f,{rtl:this.rtl,gap:b}),j=0,k=0;k<e.length;k++){e[k].style.position='absolute',e[k].style.left=0,e[k].style.top=0,e[k].style.transform='translate('+h[k].x+'px, '+h[k].y+'px)';var i=h[k].y+h[k].height;j=i>j?i:j}this.$el.style.height=j+'px',window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){a.observerPause=!1,a.$emit('layout-done',h)})})}},watch:{toggleLayout:function a(){this.setPacker()}}})}};
