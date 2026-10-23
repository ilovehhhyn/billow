/* Reveal treatment adapted for this non-React site from React Bits AnimatedContent,
 * David Haz (2026), MIT + Commons Clause. See vendor/REACT-BITS-LICENSE.txt.
 * Source: https://github.com/DavidHDev/react-bits/blob/main/src/content/Animations/AnimatedContent/AnimatedContent.jsx
 * Uses GSAP for translate/opacity reveals; Lenis handles document scrolling only.
 */
(function(root){let lenis=null,lastView=null,ambient=null,hero=null,loading=null,activeAmbient=false;const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function load(src){return new Promise((resolve,reject)=>{let s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
function refresh(view,enableAmbient){activeAmbient=!!enableAmbient;if(!reduced()&&!lenis&&root.Lenis){lenis=new root.Lenis({autoRaf:true,anchors:true,smoothWheel:true,prevent:node=>!!node.closest?.('.cal-scroll,dialog,textarea,[data-lenis-prevent]')})}if(reduced()&&lenis){lenis.destroy();lenis=null}if(lastView!==view&&!reduced()&&root.gsap){root.gsap.fromTo(document.querySelectorAll('main .hero, main .page-top, main .phase-heading'),{y:18,opacity:.3},{y:0,opacity:1,duration:.55,stagger:.06,ease:'power3.out',clearProps:'transform,opacity'})}lastView=view;
if(ambient){ambient.destroy();ambient=null}hero=document.querySelector('.hero');if(!hero||!enableAmbient||reduced())return;let target=hero;loading??=load('vendor/three.min.js').then(()=>load('vendor/vanta.fog.min.js'));loading.then(()=>{if(target!==document.querySelector('.hero')||!activeAmbient||reduced())return;try{ambient=root.VANTA.FOG({el:target,THREE:root.THREE,mouseControls:false,touchControls:false,gyroControls:false,highlightColor:0xf6f3e9,midtoneColor:0xe4e8d9,lowlightColor:0xf0ddd9,baseColor:0xf6f3e9,blurFactor:.65,speed:.35,zoom:1.5});target.querySelector('canvas')?.setAttribute('aria-hidden','true')}catch{}}).catch(()=>{loading=null})}
function pulse(el){if(el&&!reduced()&&root.gsap)root.gsap.fromTo(el,{opacity:.65},{opacity:1,duration:.25,ease:'power2.out'})}
matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change',()=>refresh(lastView,!!activeAmbient));
root.SiteMotion={refresh,pulse,pause:()=>lenis?.stop(),resume:()=>lenis?.start()};
})(window);
