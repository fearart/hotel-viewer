import{_ as c}from"./Input.bf4f740e.js";import{g as p,r as n,h as a,i as f,w as s,j as g,o as x,b as r,k as w,d as k,l as V}from"./entry.f456d439.js";import{_ as b}from"./Container.7981f569.js";const C="Fearart2!",S={__name:"admin",setup(U){const l=p(),e=n(""),o=n(!1),_=()=>{e.value==C?o.value=!0:l.add({id:"admin_login",title:"Wrong password",description:"Please try again",timeout:4e3})};return(v,t)=>{const d=c,i=V,m=b;return a(o)?g("",!0):(x(),f(m,{key:0,class:"dark:bg-gray-700 rounded-lg w-80 p-3 flex flex-row"},{default:s(()=>[r(d,{placeholder:"Admin password",modelValue:a(e),"onUpdate:modelValue":t[0]||(t[0]=u=>w(e)?e.value=u:null)},null,8,["modelValue"]),r(i,{class:"ml-4",onClick:_},{default:s(()=>[k("Submit")]),_:1})]),_:1}))}}};export{S as default};