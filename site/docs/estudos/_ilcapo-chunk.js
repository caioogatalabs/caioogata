(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52055,e=>{"use strict";var t=e.i(43476),s=e.i(71645),i=e.i(90072),l=e.i(8560),r=e.i(3847),o=e.i(64978);let n=`
uniform sampler2D uTexture;
uniform sampler2D uGrid;
varying vec2 vUv;

uniform vec2 uContainerResolution;
uniform vec2 uImageResolution;
uniform float uDisplacement;

vec2 coverUvs(vec2 imageRes, vec2 containerRes) {
    float imageAspectX = imageRes.x / imageRes.y;
    float imageAspectY = imageRes.y / imageRes.x;
    
    float containerAspectX = containerRes.x / containerRes.y;
    float containerAspectY = containerRes.y / containerRes.x;

    vec2 ratio = vec2(
        min(containerAspectX / imageAspectX, 1.0),
        min(containerAspectY / imageAspectY, 1.0)
    );

    vec2 newUvs = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    return newUvs;
}

void main() {
    // Sample the displacement grid first to decide if we need expensive calculations
    vec4 displacement = texture2D(uGrid, vUv);
    float displacementStrength = length(displacement.rg);
    
    // Performance optimization: skip all calculations if no displacement
    if (displacementStrength < 0.001) {
        vec2 simpleUvs = coverUvs(uImageResolution, uContainerResolution);
        gl_FragColor = texture2D(uTexture, simpleUvs);
        return;
    }

    vec2 newUvs = coverUvs(uImageResolution, uContainerResolution);
    vec2 finalUvs = newUvs - displacement.rg * 0.01;
    
    // Sample the base image
    vec4 originalImage = texture2D(uTexture, finalUvs);

    // Calculate shift specifically for the red channel
    vec2 shift = displacement.rg * 0.001;
    
    // Calculate the 3 identical shift layers used for the original density
    float dStr = clamp(displacementStrength, 0.0, 2.0);
    float str1 = 1.0 + dStr * 0.25;
    float str2 = 1.0 + dStr * 1.5;
    float str3 = 1.0 + dStr * 2.0;

    vec3 color1 = texture2D(uTexture, finalUvs + shift * str1).rgb;
    vec3 color2 = texture2D(uTexture, finalUvs + shift * str2).rgb;
    vec3 color3 = texture2D(uTexture, finalUvs + shift * str3).rgb;

    // Use luminance to find where edges have shifted
    vec3 lumaCoef = vec3(0.299, 0.587, 0.114);
    float lumaBase = dot(originalImage.rgb, lumaCoef);
    float luma1 = dot(color1, lumaCoef);
    float luma2 = dot(color2, lumaCoef);
    float luma3 = dot(color3, lumaCoef);

    // Accumulate the "ghosting" intensity by comparing shifted luma to base luma
    float ghost1 = abs(luma1 - lumaBase) * 1.2;
    float ghost2 = abs(luma2 - lumaBase) * 1.2;
    float ghost3 = abs(luma3 - lumaBase) * 1.2;

    float totalGhost = clamp(ghost1 + ghost2 + ghost3, 0.0, 1.0);
    
    // Target brand color #D60001
    vec3 brandRed = vec3(0.839, 0.0, 0.004);
    
    // Blend the target brand red purely as a ghost over the normal image
    vec3 tintedColor = mix(originalImage.rgb, brandRed, totalGhost);
    vec4 finalImage = vec4(tintedColor, originalImage.a);

    vec4 visualDisplacement = displacement;
    visualDisplacement *= 0.5;
    visualDisplacement += 0.5;    
    
    vec4 finalOut = step(0.5, uDisplacement) * visualDisplacement + (1.0 - step(0.5, uDisplacement)) * finalImage;
    gl_FragColor = finalOut;
}
`,a=`
varying vec2 vUv;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;    
    vUv = uv;
}
`,u=`
uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uMouseMove;
uniform vec2 uGridAspect;
uniform float uDistance;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 color = texture2D(uGrid, uv);

    // Apply aspect ratio correction so the mouse interaction radius is circular on screen
    vec2 aspectUv = uv * uGridAspect;
    vec2 aspectMouse = uMouse * uGridAspect;

    float dist = distance(aspectUv, aspectMouse);
    dist = 1.0 - smoothstep(0.0, uDistance, dist);

    vec2 delta = uDeltaMouse;
    color.rg += delta * dist;
    color.rg *= min(0.965, uMouseMove); // uRelaxation hardcoded to 0.965
    
    gl_FragColor = color;
}
`;function c({src:e,poster:c,className:d,onVideoRef:m,isActive:f,initialTime:v}){let p=(0,s.useRef)(null),h=(0,s.useRef)(null),[x,g]=s.default.useState(!1),w=(0,o.useIsPresent)(),y=(f??!0)||!w,b=(0,s.useRef)(y),j=(0,s.useRef)(!1),[T,M]=s.default.useState(!1);(0,s.useEffect)(()=>{M(window.matchMedia("(pointer: coarse)").matches||"ontouchstart"in window||navigator.maxTouchPoints>0)},[]);let R=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let e;if(!p.current)return;let t=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting?(clearTimeout(e),g(!0)):e=setTimeout(()=>{b.current||g(!1)},2e3)})},{threshold:0,rootMargin:"400px 0px"});return t.observe(p.current),()=>{t.disconnect(),clearTimeout(e)}},[]),(0,s.useEffect)(()=>{if(b.current=y,y)g(!0);else{let e=setTimeout(()=>{b.current||g(!1)},2e3);return()=>clearTimeout(e)}},[y]),(0,s.useEffect)(()=>{if(!x||!p.current||!h.current||!e)return;let t=h.current,s=p.current;if(m&&m(t),T){let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?b.current&&t.paused&&t.play().catch(()=>{}):t.paused||t.pause()})},{threshold:0,rootMargin:"400px 0px"});return e.observe(s),()=>e.disconnect()}let o=new i.Scene,c=s.clientWidth||window.innerWidth,d=s.clientHeight||window.innerHeight,f=new i.OrthographicCamera(-c/2,c/2,d/2,-d/2,.1,10);f.position.z=1;let v=new l.WebGLRenderer({alpha:!0,antialias:!1,powerPreference:"low-power",stencil:!1,depth:!1});v.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),v.setSize(c,d),s.appendChild(v.domElement),v.domElement.style.width="100%",v.domElement.style.height="100%",v.domElement.style.position="absolute",v.domElement.style.top="0",v.domElement.style.left="0",v.domElement.style.zIndex="10";let w=Math.max(2,Math.floor(c/70)),y=Math.max(2,Math.floor(d/20)),j=new r.GPUComputationRenderer(w,y,v),M=j.createTexture(),E=j.addVariable("uGrid",u,M);E.material.uniforms.uTime={value:0},E.material.uniforms.uGridAspect={value:new i.Vector2(c/d,1)},E.material.uniforms.uMouse={value:new i.Vector2(0,0)},E.material.uniforms.uDeltaMouse={value:new i.Vector2(0,0)},E.material.uniforms.uMouseMove={value:0},E.material.uniforms.uDistance={value:.08},j.setVariableDependencies(E,[E]),j.init();let N=new i.PlaneGeometry(1,1),S=new i.VideoTexture(t);S.minFilter=i.LinearFilter,S.magFilter=i.LinearFilter,S.colorSpace=i.SRGBColorSpace;let C=new i.ShaderMaterial({vertexShader:a,fragmentShader:n,uniforms:{uTexture:{value:S},uGrid:{value:null},uContainerResolution:{value:new i.Vector2(c,d)},uImageResolution:{value:new i.Vector2(t.videoWidth||1920,t.videoHeight||1080)},uDisplacement:{value:0}}}),D=new i.Mesh(N,C);D.scale.set(c,d,1),o.add(D);let P=new i.Vector2(0,0),U=new i.Vector2(0,0),L=e=>{E.material.uniforms.uMouseMove.value=1;let t=s.getBoundingClientRect(),i=(e.clientX-t.left)/t.width,l=1-(e.clientY-t.top)/t.height,r="pointerdown"===e.type;P.set(i,l);let o=E.material.uniforms.uMouse.value;if(r){E.material.uniforms.uMouse.value.copy(P);let e=Math.random()*Math.PI*2;U.set(100*Math.cos(e),100*Math.sin(e)),E.material.uniforms.uDeltaMouse.value.copy(U)}else P.distanceTo(o)>.002&&(U.subVectors(P,o).multiplyScalar(80),E.material.uniforms.uDeltaMouse.value.copy(U),E.material.uniforms.uMouse.value.copy(P));$=F};s.addEventListener("pointermove",L),s.addEventListener("pointerdown",L);let V=()=>{C.uniforms.uImageResolution.value.set(t.videoWidth,t.videoHeight)};t.addEventListener("loadedmetadata",V);let I=()=>{c=s.clientWidth,d=s.clientHeight,f.left=-c/2,f.right=c/2,f.top=d/2,f.bottom=-d/2,f.updateProjectionMatrix(),v.setSize(c,d),D.scale.set(c,d,1),C.uniforms.uContainerResolution.value.set(c,d)};window.addEventListener("resize",I);let k=new i.Timer,z=0,A=!1,G=!1,$=0,F=60,W=()=>{if(A)return;if(!G||!b.current&&$<=0){z=0;return}z=requestAnimationFrame(W),k.update();let e=k.getElapsed();if(E.material.uniforms.uTime.value=e,(E.material.uniforms.uMouseMove.value>1e-4||E.material.uniforms.uDeltaMouse.value.length()>1e-4)&&($=F),$>0){E.material.uniforms.uMouseMove.value*=.95,E.material.uniforms.uDeltaMouse.value.multiplyScalar(.965),j.compute();let e=j.getCurrentRenderTarget(E),t=e.textures?e.textures[0]:e.texture;C.uniforms.uGrid.value=t,$--}v.render(o,f)};R.current=W;let H=e=>{e.preventDefault(),console.warn("WebGL Context Lost for DistortedVideo"),z&&cancelAnimationFrame(z),A=!0},B=()=>{console.log("WebGL Context Restored for DistortedVideo"),g(!1),setTimeout(()=>g(!0),100)},O=v.domElement;O.addEventListener("webglcontextlost",H,!1),O.addEventListener("webglcontextrestored",B,!1);let Y=new IntersectionObserver(e=>{e.forEach(e=>{let s=G;(G=e.isIntersecting)?(b.current&&t.paused&&t.play().catch(()=>{}),s||!b.current||z||W()):t.paused||t.pause()})},{threshold:0,rootMargin:"400px 0px"});return Y.observe(s),W(),()=>{A=!0,R.current=null,Y.disconnect(),z&&cancelAnimationFrame(z),window.removeEventListener("resize",I),s.removeEventListener("pointermove",L),s.removeEventListener("pointerdown",L),t.removeEventListener("loadedmetadata",V),O.removeEventListener("webglcontextlost",H),O.removeEventListener("webglcontextrestored",B),j&&j.variables&&j.variables.forEach(e=>{e.renderTargets&&e.renderTargets.forEach(e=>e.dispose()),e.material&&e.material.dispose()}),M&&M.dispose(),S.dispose(),N.dispose(),C.dispose(),v.dispose(),v.forceContextLoss(),s.contains(v.domElement)&&s.removeChild(v.domElement),o.clear()}},[x,e,T]),(0,s.useEffect)(()=>{v&&!j.current&&h.current&&(h.current.currentTime=v,j.current=!0)},[v]),(0,s.useEffect)(()=>{b.current=y;let e=h.current;if(e)if(y){e.play().catch(()=>{});let t=R.current;t&&t()}else e.pause()},[y,x]),(0,t.jsxs)("div",{ref:p,className:`relative overflow-hidden w-full h-full ${d||""}`,children:[c&&(0,t.jsx)("img",{src:c,alt:"",className:"absolute inset-0 w-full h-full object-cover z-0"}),(0,t.jsx)("video",{ref:h,src:e,poster:c,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,crossOrigin:"anonymous",className:T?"absolute inset-0 w-full h-full object-cover z-10":"hidden"})]})}e.s(["DistortedVideo",()=>c])},87392,e=>{"use strict";var t=e.i(43476),s=e.i(21705),i=e.i(46932),l=e.i(10542),r=e.i(95420),o=e.i(93208),n=e.i(71645),a=e.i(33151),u=e.i(47163),c=e.i(18566),d=e.i(22790),m=e.i(33159),f=e.i(72414);function v({backgroundColor:e="#000000",textColor:v,scrollProgress:p}){let h=(0,d.useSettings)(),{isMenuOpen:x}=(0,m.useMenu)(),{isTransitioning:g,isVideoFullscreen:w,scrollWrapperRef:y}=(0,s.useUI)(),b="#D60001"===e.toUpperCase(),j=v??(b?"#000000":"#D60001"),T=(0,c.usePathname)(),M=function(e){let[t,s]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{let i=window.matchMedia(e);i.matches!==t&&s(i.matches);let l=()=>s(i.matches);return i.addEventListener("change",l),()=>i.removeEventListener("change",l)},[e,t]),t}("(min-width: 1024px)"),[R,E]=(0,n.useState)(!1),N=(0,n.useRef)(null);(0,n.useEffect)(()=>{E(M)},[M]);let{scrollYProgress:S}=(0,l.useScroll)({target:N,offset:["start end","end end"],container:y}),C=p??S,D=(0,f.useLenis)();(0,n.useEffect)(()=>{let e;if(!D||!R||x||g||w)return;let t=()=>{clearTimeout(e),e=setTimeout(()=>{if(window.innerWidth<1024)return;let e=C.get();if(e>.001&&e<.7){let t=N.current?.offsetHeight||0;if(0===t)return;let s=D.scroll;D.scrollTo(s+-e*t,{duration:1.2,easing:e=>1-Math.pow(1-e,5)})}},200)};return D.on("scroll",t),()=>{D.off("scroll",t),clearTimeout(e)}},[D,C,R,x,g,w]);let P=(0,r.useTransform)(C,[0,1],["-60vh","0vh"]),U=(0,r.useTransform)(C,[0,1],[.8,1]),L=(0,r.useTransform)(C,[.13,1],["-60vh","0vh"]),V=(0,r.useTransform)(C,[.26,1],["-60vh","0vh"]),I=(0,r.useTransform)(C,[.35,1],[80,0]),k=(0,r.useTransform)(C,[.42,1],[80,0]);return(0,t.jsxs)(i.motion.footer,{ref:N,className:`relative w-full flex flex-col justify-between px-6 lg:px-12 py-8 transition-colors duration-700 z-30 h-auto overflow-hidden ${"/"===T?"mt-[-15dvh]":""}`,style:{backgroundColor:e,color:j},children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row justify-around items-center md:items-start w-full gap-8",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 md:gap-4 text-center",children:[(0,t.jsx)(i.motion.div,{style:R?{y:V}:{},children:(0,t.jsx)("span",{className:"text-[32px] md:text-[45px] font-ivar uppercase leading-none block",children:"Contacts"})}),(0,t.jsx)(i.motion.div,{style:R?{y:L}:{},children:(0,t.jsx)(a.RollingLink,{href:`mailto:${h.mail}`,className:"text-[15px] md:text-[21px] font-helvetica uppercase",withUnderline:!0,children:h.mail})})]}),(0,t.jsxs)("div",{className:"flex flex-col gap-2 md:gap-4 text-center",children:[(0,t.jsx)(i.motion.div,{style:R?{y:V}:{},children:(0,t.jsx)("span",{className:"text-[32px] md:text-[45px] font-ivar uppercase leading-none block",children:"Follow"})}),(0,t.jsx)(i.motion.div,{style:R?{y:L}:{},children:(0,t.jsx)(a.RollingLink,{href:h.IGlink,target:"_blank",rel:"noopener noreferrer",className:"text-[15px] md:text-[21px] font-helvetica uppercase",withUnderline:!0,children:h.IGlabel})})]})]}),(0,t.jsx)("div",{className:"flex-1 flex items-center justify-center w-full py-8",children:(0,t.jsx)(i.motion.div,{className:"w-full aspect-[4.5/1]",style:R?{y:P,scale:U}:{},children:(0,t.jsx)(o.BrandSvg,{src:(0,u.getAssetPath)("/logo-text.svg"),color:j,className:"w-full h-full",maskSize:"contain"})})}),(0,t.jsxs)("div",{className:"flex flex-col md:flex-row justify-between items-center md:items-end w-full gap-2 md:gap-4",children:[(0,t.jsx)(i.motion.div,{className:"text-[15px] md:text-[21px] font-helvetica uppercase",style:R?{y:I}:{},children:(0,t.jsx)("p",{children:"©2026 - P.IVA 02793910395"})}),(0,t.jsx)("div",{children:(0,t.jsx)(i.motion.div,{style:R?{y:k}:{},children:(0,t.jsx)(a.RollingLink,{as:"a",href:"https://auge-xp.com/",target:"_blank",rel:"noopener noreferrer",className:"text-[15px] md:text-[21px] font-helvetica uppercase",withUnderline:!0,children:"Credits"})})})]})]},`${T}-${R}`)}e.s(["Footer",()=>v],87392)},7885,e=>{"use strict";var t=e.i(43476),s=e.i(48548),i=e.i(21705),l=e.i(33159),r=e.i(93208),o=e.i(47163),n=e.i(39544),a=e.i(1612),u=e.i(45438),c=e.i(46932),d=e.i(10542),m=e.i(95420),f=e.i(33768),v=e.i(71645),p=e.i(22790),h=e.i(52055);function x(){let e=(0,p.useSettings)(),{isLoaded:x,isMenuAnimating:g,isTransitioning:w,isVideoFullscreen:y,showHomeHeroLogo:b,scrollWrapperRef:j,loaderVideoTime:T}=(0,i.useUI)(),{isMenuOpen:M}=(0,l.useMenu)(),{isMobile:R}=(0,u.useDevice)(),{setCursorType:E}=(0,a.useCursor)(),{textLogoScale:N}=(0,n.useLogoScale)(),[S]=(0,v.useState)(x),C=(0,v.useRef)(null),D=(0,v.useRef)(null),[P,U]=(0,v.useState)(!1),L=(0,v.useRef)(x);(0,v.useEffect)(()=>{U(!1);let e=1600;if(!L.current&&x&&(e=2900),x){let t=setTimeout(()=>{U(!0),L.current=!0},e);return()=>clearTimeout(t)}},[x]);let[V,I]=(0,v.useState)(!S);(0,v.useEffect)(()=>{if(S){let e=setTimeout(()=>{I(!0)},950);return()=>clearTimeout(e)}},[S]);let{scrollY:k}=(0,d.useScroll)({container:j}),[z,A]=(0,v.useState)(!0);(0,f.useMotionValueEvent)(k,"change",e=>{{let t=e<window.innerHeight;t!==z&&A(t)}});let G=(0,v.useRef)(R);(0,v.useEffect)(()=>{G.current=R},[R]);let $=(0,m.useTransform)(k,e=>{let t=Math.max(0,e);return G.current?0:.7*t}),F=(0,m.useTransform)(k,e=>{let t=Math.max(0,e)/window.innerHeight;return t<.5?1:t>1?0:1-(t-.5)*2}),W=(0,m.useTransform)(k,e=>{if(!G.current)return 1;let t=Math.max(0,e)/window.innerHeight;return t<.1?1:t>.9?0:1-(t-.1)*1.25}),[H,B]=(0,v.useState)(0);return(0,v.useEffect)(()=>{(0,s.preloadVideo)(e.videoReel);let t=D.current;if(t){if(M||g)return void t.pause();t.play().catch(()=>{})}},[M,g]),(0,t.jsx)("section",{ref:C,onMouseEnter:()=>E("scroll"),onMouseLeave:()=>E("default"),className:"relative h-dvh w-full overflow-hidden z-0",children:(0,t.jsxs)(c.motion.div,{style:{opacity:F,y:$},className:"absolute inset-0 w-full h-full z-0",children:[(0,t.jsx)("div",{className:"absolute inset-0",children:(0,t.jsxs)(c.motion.div,{className:"absolute inset-0 z-0",children:[(0,t.jsx)(h.DistortedVideo,{onVideoRef:e=>{D.current=e},src:e.videoReel,poster:e.imageReel,className:"w-full h-full",isActive:z&&!M&&!w,initialTime:T}),(0,t.jsx)("div",{className:"absolute inset-0 bg-black/20 pointer-events-none"})]})}),(0,t.jsx)(c.motion.div,{className:"absolute top-[calc(100dvh-40px)] left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none origin-bottom",initial:{scale:N.entrance,y:S?"200%":"-25%"},animate:{scale:b?N.final:N.entrance,y:b&&V?0:S?"200%":0},transition:{duration:1.2,ease:[.83,0,.17,1]},style:{width:624,height:145,opacity:W},children:(0,t.jsx)(r.BrandSvg,{src:(0,o.getAssetPath)("/logo-text.svg"),color:"#D60001",className:"w-full h-full"})})]})})}e.s(["HomeHero",()=>x])},44976,e=>{"use strict";var t=e.i(43476),s=e.i(46932),i=e.i(10542),l=e.i(95420),r=e.i(33768),o=e.i(86427),n=e.i(65468),a=e.i(71645),u=e.i(65866),c=e.i(33159),d=e.i(21705),m=e.i(48548),f=e.i(18566),v=e.i(87392),p=e.i(35382),h=e.i(1612),x=e.i(72414),g=e.i(52055),w=e.i(6573);function y({projects:e,footerBackgroundColor:s,footerTextColor:l}){let r=(0,a.useMemo)(()=>e.filter(e=>e.inHome).sort((e,t)=>{let s=e.date?new Date(e.date).getTime():0;return(t.date?new Date(t.date).getTime():0)-s}),[e]),n=(0,a.useRef)(null),u=(0,a.useRef)(null),{isMenuAnimating:f,isTransitioning:p,isVideoFullscreen:h,scrollWrapperRef:g}=(0,d.useUI)(),{isMenuOpen:w}=(0,c.useMenu)(),{scrollYProgress:y}=(0,i.useScroll)({target:n,offset:["start start","end end"],container:g}),{scrollYProgress:j}=(0,i.useScroll)({target:u,offset:["start end","end end"],container:g}),{scrollYProgress:T}=(0,i.useScroll)({target:u,offset:["start end","end end"],container:g}),M=(0,a.useRef)(r.map(()=>new o.MotionValue(0))).current,R=(0,x.useLenis)();return(0,a.useEffect)(()=>{let e;if(!R||w||p)return;let t=()=>{clearTimeout(e),e=setTimeout(()=>{window.innerWidth<1024||M.forEach(e=>{let t=e.get();if(t>=.15&&t<=.75){let e=R.scroll,s=(.82-t)*window.innerHeight;R.scrollTo(e+s,{duration:1.5,easing:e=>1-Math.pow(1-e,5)})}})},200)};return R.on("scroll",t),()=>{R.off("scroll",t),clearTimeout(e)}},[R,M,w,p]),(0,a.useEffect)(()=>{r.forEach(e=>{e.videos[0]?.reel&&(0,m.preloadVideo)(e.videos[0].reel)})},[r]),(0,t.jsxs)("div",{ref:n,className:"relative z-10",style:{position:"relative",zIndex:10},children:[r.map((e,s)=>(0,t.jsx)(b,{project:e,index:s,totalProjects:r.length,globalScrollYProgress:y,progressMV:M[s],nextProgressMV:s===r.length-1?j:M[s+1],isMenuOpen:w,isMenuAnimating:f,isTransitioning:p,isVideoFullscreen:h},e.slug)),(0,t.jsx)("div",{className:"h-[5dvh] w-full"}),(0,t.jsx)("div",{ref:u,className:"relative z-[60]",children:(0,t.jsx)(v.Footer,{backgroundColor:s,textColor:l,scrollProgress:T})})]})}function b({project:e,index:c,totalProjects:v,globalScrollYProgress:x,progressMV:y,nextProgressMV:b,isMenuOpen:j,isMenuAnimating:T,isTransitioning:M,isVideoFullscreen:R}){let E=(0,a.useRef)(null),N=(0,f.useRouter)(),{scrollWrapperRef:S}=(0,d.useUI)(),{scrollYProgress:C}=(0,i.useScroll)({target:E,offset:["start end","start start"],container:S}),D=(0,p.useMotionValue)(0),[P,U]=(0,a.useState)(!1),[L,V]=(0,a.useState)(!1),[I,k]=(0,a.useState)(!1),[z,A]=(0,a.useState)(!1),G=c===v-1,[$,F]=(0,a.useState)(!1),W=(0,l.useTransform)(G?x:b||new o.MotionValue(0),G?[.82,.96]:[0,1],[0,1]),H=(e,t)=>{if(j||T||M||R)return;D.set(e),y.set(e);let s=e>.1&&!(t>.05),i=e>.3&&!(t>.15),l=e>.35&&!(t>.15),r=e>.75&&!(t>.55);s!==P&&U(s),i!==L&&V(i),l!==I&&k(l),r!==z&&A(r);let o=e>0&&t<.99;o!==$&&F(o)};(0,r.useMotionValueEvent)(C,"change",e=>{H(e,W.get())}),(0,r.useMotionValueEvent)(W,"change",e=>{H(C.get(),e)});let B=(0,l.useTransform)(D,[0,.8,1],[`${85}%`,`${85}%`,"100%"]),O=(0,l.useTransform)(D,[0,.8,1],[`${70}%`,`${90}%`,"100%"]),Y=(0,l.useTransform)(D,[0,.8,1],[`${70}%`,`${90}%`,"100%"]),_=n.useMotionTemplate`inset(0 0 ${B} 0)`,X=n.useMotionTemplate`inset(0 ${Y} 0 0)`,K=n.useMotionTemplate`inset(0 0 0 ${O})`,q=(0,l.useTransform)(W,[.3,.8],[0,.4]),J=c%2!=0,Q=J?"#D60001":"#000000",Z=J?"#000000":"#D60001",ee=(c+1).toString().padStart(2,"0"),et=(0,a.useRef)(null);(0,a.useEffect)(()=>{let e=et.current;if(e){if(j||T||R)return void e.pause();e.play().catch(()=>{})}},[j,T]);let{setCursorType:es}=(0,h.useCursor)();return(0,t.jsx)("div",{ref:E,className:"relative sticky top-0 h-dvh w-full overflow-hidden flex items-center justify-center transition-colors duration-700 z-10",style:{backgroundColor:Q,marginTop:0===c?"0":"-10dvh",position:"relative"},children:(0,t.jsx)("div",{className:"relative h-full w-full flex items-center justify-center",children:(0,t.jsxs)(u.TransitionLink,{href:`/project/${e.slug}`,transitionLabel:e.projectName,className:"relative h-full w-full flex items-center justify-center group",onMouseEnter:()=>{es("view"),N.prefetch(`/project/${e.slug}`),e.videos.forEach(e=>{e.reel&&(0,m.preloadVideo)(e.reel)})},onMouseLeave:()=>{es("default")},children:[(0,t.jsxs)("div",{className:"absolute inset-0 z-20",children:[(0,t.jsx)(g.DistortedVideo,{onVideoRef:e=>{et.current=e},src:e.videos[0]?.reel,poster:e.videos[0]?.image,className:"w-full h-full",isActive:$&&!j&&!M}),(0,t.jsx)("div",{className:"absolute inset-0 bg-black/20 pointer-events-none z-10"})]}),(0,t.jsx)("div",{className:"absolute inset-0 z-25 pointer-events-none flex items-center justify-center text-center w-full px-4 max-w-[80%] md:max-w-[70%] mx-auto -translate-y-[20dvh]",children:(0,t.jsx)("div",{className:"py-[0.1em] px-[0.4em]",children:(0,t.jsx)("h3",{className:"text-[48px] md:text-[80px] lg:text-[120px] font-ivar uppercase leading-[0.8] text-[#D60001]",children:(0,t.jsx)(w.WaveTextReveal,{text:e.projectName,isTriggered:I})})})}),e.subtitle&&(0,t.jsx)("div",{className:"absolute bottom-45 md:bottom-65 left-0 right-0 z-25 pointer-events-none flex justify-center px-4 overflow-hidden py-[0.2em] md:py-[0.3em] max-w-[60%] md:max-w-[70%] mx-auto",children:(0,t.jsx)("h4",{className:"text-[15px] md:text-[21px] font-helvetica text-[#D60001] uppercase leading-[1.1] text-center",children:(0,t.jsx)(w.WaveTextReveal,{text:e.subtitle,isTriggered:z})})}),(0,t.jsx)(s.motion.div,{style:{opacity:q},className:"absolute inset-0 bg-black z-[28] pointer-events-none"}),(0,t.jsxs)("div",{className:"absolute inset-0 z-30 pointer-events-none",children:[(0,t.jsx)(s.motion.div,{style:{clipPath:_,backgroundColor:Q,willChange:"clip-path"},className:"absolute top-0 left-0 w-full h-full overflow-hidden",children:(0,t.jsxs)("div",{className:"absolute top-[7dvh] md:top-[5dvh] lg:top-[9dvh] left-1/2 -translate-x-1/2 text-center whitespace-nowrap flex items-center",children:[(0,t.jsx)("div",{className:"inline-block",children:(0,t.jsx)("div",{className:"text-[15px] md:text-[21px] font-helvetica pr-4 inline-block md:hidden leading-[1.1] py-[0.1em]",style:{color:Z},children:(0,t.jsx)(w.WaveTextReveal,{text:ee,isTriggered:P})})}),(0,t.jsx)("div",{className:"inline-block py-[0.1em]",children:(0,t.jsx)("div",{className:"block text-[15px] md:text-[21px] uppercase font-helvetica leading-[1.1]",style:{color:Z},children:(0,t.jsx)(w.WaveTextReveal,{text:e.client,isTriggered:P,delay:.1})})})]})}),(0,t.jsx)(s.motion.div,{style:{clipPath:X,backgroundColor:Q,willChange:"clip-path"},className:"absolute top-0 left-0 w-full h-full overflow-hidden",children:(0,t.jsx)("div",{className:"absolute left-4 md:left-6 lg:left-12 top-[calc(50%-19dvh)] -translate-y-1/2",children:(0,t.jsx)("div",{children:(0,t.jsx)("div",{className:"block text-[15px] md:text-[21px] font-helvetica hidden md:block leading-[1.1] py-[0.1em]",style:{color:Z},children:(0,t.jsx)(w.WaveTextReveal,{text:ee,isTriggered:L})})})})}),(0,t.jsx)(s.motion.div,{style:{clipPath:K,backgroundColor:Q,willChange:"clip-path"},className:"absolute top-0 right-0 w-full h-full"})]})]})})})}e.s(["ProjectsGrid",()=>y])}]);