import { useState, useEffect, useRef, useCallback } from "react";

// ── STORAGE ───────────────────────────────────────────────────────────────────
const SK="doise_p",SS="doise_s",SE="doise_emails",AP="doise2025";
const loadP=()=>{try{const r=localStorage.getItem(SK);return r?JSON.parse(r):{}}catch{return{}}};
const saveP=d=>{try{localStorage.setItem(SK,JSON.stringify(d))}catch{}};
const loadEmails=()=>{try{const r=localStorage.getItem(SE);return r?JSON.parse(r):[]}catch{return[]}};
const saveEmails=d=>{try{localStorage.setItem(SE,JSON.stringify(d))}catch{}};
const isAuth=()=>{try{return localStorage.getItem(SS)==="1"}catch{return false}};
const setAuth=v=>{try{v?localStorage.setItem(SS,"1"):localStorage.removeItem(SS)}catch{}};
const fmt=v=>Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function getRoute(){
  const p=window.location.pathname,q=new URLSearchParams(window.location.search);
  if(p==="/admin"||p==="/admin/") return{page:"admin"};
  if(q.get("proposta")) return{page:"proposal",id:q.get("proposta")};
  const s=q.get("servico");
  if(s) return{page:"service",slug:s};
  if(p==="/blog"||p==="/blog/") return{page:"blog"};
  return{page:"home"};
}
function nav(path){window.history.pushState({},"",path);window.dispatchEvent(new PopStateEvent("popstate"))}

// ── ICONS ─────────────────────────────────────────────────────────────────────
const I=({n,s=20})=>{
  const m={
    ig:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>,
    tk:<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.77 0 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 000 12.68 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>,
    li:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    ar:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M7 7h10v10"/></svg>,
    pl:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>,
    tr:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>,
    cp:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    ey:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    ok:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
    cl:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>,
    ed:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    lk:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    lo:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    ho:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    fi:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
    ch:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    dl:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    cl2:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    us:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    st:<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    wa:<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.126 1.527 5.855L.057 23.09a.75.75 0 00.92.921l5.356-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.722 9.722 0 01-4.964-1.358l-.355-.212-3.683 1.004 1.022-3.574-.232-.368A9.722 9.722 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>,
    bk:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    tg:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    ck:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    mg:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  };
  return m[n]||null;
};

// ── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({end,suffix="",prefix="",duration=2000}){
  const [val,setVal]=useState(0);
  const ref=useRef();
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        let start=0,step=end/60,t=duration/60;
        const timer=setInterval(()=>{
          start+=step;
          if(start>=end){setVal(end);clearInterval(timer);}
          else setVal(Math.floor(start));
        },t);
        obs.disconnect();
      }
    },{threshold:0.5});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[end,duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("pt-BR")}{suffix}</span>;
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const injectCSS=()=>{
  if(document.getElementById("ds-css")) return;
  const el=document.createElement("style");
  el.id="ds-css";
  el.textContent=`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0a0a0a;--ink2:#141414;--ink3:#1e1e1e;
  --lilac:#b47fe8;--lilac2:#c99cf0;--lilac3:#7c3dbf;
  --lbg:rgba(180,127,232,.10);--lborder:rgba(180,127,232,.22);
  --cream:#f7f5f0;--cream2:#ede9e1;--w:#fff;--w60:rgba(255,255,255,.6);--w15:rgba(255,255,255,.08);
  --serif:'Instrument Serif',serif;--sans:'Outfit',sans-serif;
}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--w);font-family:var(--sans);font-weight:300;overflow-x:hidden}
::selection{background:var(--lilac);color:var(--ink)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--ink)}::-webkit-scrollbar-thumb{background:var(--lilac3)}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:22px 56px;display:flex;align-items:center;justify-content:space-between;transition:all .4s}
.nav.stuck{background:rgba(10,10,10,.95);backdrop-filter:blur(24px);border-bottom:1px solid var(--lborder);padding:15px 56px}
.nav-logo{font-family:var(--serif);font-size:24px;font-style:italic;cursor:pointer;color:var(--w);border:none;background:none}
.nav-logo span{color:var(--lilac);font-style:normal}
.nav-links{display:flex;gap:36px;align-items:center}
.nav-a{background:none;border:none;font-family:var(--sans);font-size:13px;font-weight:400;color:var(--w60);cursor:pointer;transition:color .2s;letter-spacing:.3px}
.nav-a:hover{color:var(--w)}
.nav-btn{background:var(--w);color:var(--ink);border:none;padding:10px 22px;border-radius:100px;font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
.nav-btn:hover{background:var(--lilac2);transform:translateY(-1px)}

/* TICKER */
.ticker{background:var(--lilac);padding:11px 0;overflow:hidden;white-space:nowrap;margin-top:64px}
.ticker-inner{display:inline-flex;animation:tick 22s linear infinite}
.ticker-item{font-family:var(--sans);font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--ink);padding:0 28px}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* HERO — UNCODE EDITORIAL */
.hero{min-height:calc(100vh - 108px);position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:0 0 0 0}
.hero-noise{position:absolute;inset:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:180px;pointer-events:none}
.hero-orb{position:absolute;top:5%;right:-8%;width:520px;height:520px;background:radial-gradient(circle,rgba(180,127,232,.14) 0%,transparent 65%);pointer-events:none}
.hero-orb2{position:absolute;bottom:10%;left:-5%;width:360px;height:360px;background:radial-gradient(circle,rgba(124,61,191,.08) 0%,transparent 65%);pointer-events:none}

/* hero top bar */
.hero-topbar{display:flex;justify-content:space-between;align-items:flex-start;padding:44px 56px 0;position:relative;z-index:2}
.hero-topbar-tag{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--w60);display:flex;align-items:center;gap:10px}
.hero-topbar-tag::before{content:'';width:20px;height:1px;background:var(--w60)}
.hero-topbar-right{font-size:11px;color:var(--w60);letter-spacing:1px;text-align:right;line-height:1.8}
.hero-topbar-right strong{color:var(--lilac);font-style:italic;font-family:var(--serif);font-size:13px;display:block}

/* hero giant title */
.hero-title-wrap{padding:20px 56px 0;position:relative;z-index:2}
.hero-h1{font-family:var(--serif);font-size:clamp(72px,11vw,160px);line-height:.95;letter-spacing:-4px;font-weight:400;margin:0}
.hero-h1 .line1{display:block;color:var(--w)}
.hero-h1 .line2{display:block;color:var(--w);padding-left:clamp(40px,8vw,120px)}
.hero-h1 .line3{display:block;font-style:italic;color:var(--lilac2);padding-left:clamp(80px,15vw,220px)}

/* hero bottom bar */
.hero-bottom{display:grid;grid-template-columns:1fr auto 1fr;align-items:end;padding:32px 56px 52px;position:relative;z-index:2;gap:40px;margin-top:32px;border-top:1px solid rgba(255,255,255,.07)}
.hero-sub{font-size:15px;color:var(--w60);max-width:340px;line-height:1.85;font-weight:300}
.hero-cta-center{display:flex;flex-direction:column;align-items:center;gap:14px}
.hero-scroll-hint{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.25);display:flex;flex-direction:column;align-items:center;gap:8px}
.hero-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(255,255,255,.25),transparent);animation:scrollpulse 2s ease infinite}
@keyframes scrollpulse{0%,100%{opacity:.3}50%{opacity:.8}}
.hero-stats-right{display:flex;gap:32px;justify-content:flex-end;align-items:flex-end}
.hero-stat{text-align:right}
.hero-stat-n{font-family:var(--serif);font-size:36px;font-style:italic;color:var(--lilac2);line-height:1}
.hero-stat-l{font-size:10px;color:var(--w60);margin-top:3px;letter-spacing:.5px}

/* hero deco number */
.hero-deco{position:absolute;right:52px;top:50%;transform:translateY(-50%);font-family:var(--serif);font-size:clamp(160px,18vw,240px);font-style:italic;color:rgba(255,255,255,.02);line-height:1;pointer-events:none;letter-spacing:-8px;z-index:1;user-select:none}

/* BTNS */
.btn-dark{display:inline-flex;align-items:center;gap:10px;background:var(--w);color:var(--ink);border:none;padding:14px 28px;border-radius:100px;font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;transition:all .25s;text-decoration:none}
.btn-dark:hover{background:var(--lilac2);transform:translateY(-2px);box-shadow:0 10px 28px rgba(180,127,232,.25)}
.btn-outline{display:inline-flex;align-items:center;gap:10px;background:transparent;color:var(--w);border:1px solid rgba(255,255,255,.2);padding:14px 28px;border-radius:100px;font-family:var(--sans);font-size:14px;font-weight:500;cursor:pointer;transition:all .25s}
.btn-outline:hover{border-color:var(--lilac);color:var(--lilac)}
.btn-lilac{display:inline-flex;align-items:center;gap:10px;background:var(--lilac);color:var(--ink);border:none;padding:14px 28px;border-radius:100px;font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;transition:all .25s;text-decoration:none}
.btn-lilac:hover{background:var(--lilac2);transform:translateY(-2px);box-shadow:0 10px 28px rgba(180,127,232,.3)}
.btn-sm{padding:10px 20px;font-size:13px}
.btn-icon{background:none;border:1px solid rgba(255,255,255,.12);color:var(--w60);border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0}
.btn-icon:hover{border-color:var(--lilac);color:var(--lilac)}
.btn-icon.del:hover{border-color:#ef4444;color:#ef4444}

/* LOGOS BAND */
.logos-band{background:var(--cream);padding:44px 56px}
.logos-band-label{font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:rgba(10,10,10,.4);margin-bottom:24px;text-align:center}
.logos-track{overflow:hidden}
.logos-inner{display:flex;animation:scroll 20s linear infinite}
.logo-item{display:flex;align-items:center;justify-content:center;padding:0 40px;font-family:var(--serif);font-size:17px;font-style:italic;color:rgba(10,10,10,.3);white-space:nowrap}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* STICKERS — decorative floating badges */
.stk{position:absolute;pointer-events:none;display:flex;align-items:center;justify-content:center;text-align:center}
.stk-star{width:72px;height:72px;background:var(--lilac);clip-path:polygon(50% 0%,61% 25%,88% 12%,75% 38%,100% 50%,75% 62%,88% 88%,61% 75%,50% 100%,39% 75%,12% 88%,25% 62%,0% 50%,25% 38%,12% 12%,39% 25%);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink);line-height:1.2}
.stk-circle{width:56px;height:56px;background:var(--cream2);border-radius:50%;border:1.5px solid rgba(10,10,10,.15);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--lilac3)}
.stk-pill{background:var(--ink);border-radius:12px;padding:10px 14px;font-size:10px;font-weight:600;color:var(--w);line-height:1.4;max-width:120px}

/* SECTIONS */
.sec{padding:100px 56px}
.sec-cream{background:var(--cream);color:var(--ink)}
.sec-ink2{background:var(--ink2)}
.sec-label{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--lilac);margin-bottom:16px;display:flex;align-items:center;gap:10px}
.sec-label::before{content:'';width:24px;height:1px;background:var(--lilac)}
.sec-label-dark{color:rgba(10,10,10,.4)}.sec-label-dark::before{background:rgba(10,10,10,.3)}
.sec-h2{font-family:var(--serif);font-size:clamp(36px,4.5vw,58px);font-weight:400;line-height:1.08;letter-spacing:-1px}
.sec-h2 em{font-style:italic;color:var(--lilac)}
.sec-h2-dark{color:var(--ink)}.sec-h2-dark em{color:var(--lilac3)}

/* SERVICES — Uncode numbered cards (cream bg) */
.svc-header{margin-bottom:56px;position:relative}
.svc-big-num{font-family:var(--serif);font-size:clamp(120px,14vw,200px);font-style:italic;color:rgba(10,10,10,.04);line-height:1;position:absolute;right:-20px;top:-40px;pointer-events:none;letter-spacing:-6px}
.svc-intro{font-size:15px;color:rgba(10,10,10,.5);line-height:1.8;max-width:360px}
.svc-two-col{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
.svc-list{display:flex;flex-direction:column;gap:12px}
.svc-row{display:flex;align-items:center;gap:18px;border:1.5px solid rgba(10,10,10,.12);border-radius:16px;padding:16px 24px 16px 16px;background:transparent;cursor:pointer;transition:all .35s;position:relative;overflow:hidden;width:100%;text-align:left;font-family:var(--sans)}
.svc-row::before{content:'';position:absolute;inset:0;background:var(--lilac);transform:translateX(-102%);transition:transform .45s cubic-bezier(.16,1,.3,1);z-index:0}
.svc-row:hover::before{transform:translateX(0)}
.svc-row:hover .svc-row-name{color:var(--ink)}
.svc-row:hover .svc-row-desc{color:rgba(10,10,10,.6)}
.svc-row:hover .svc-badge{background:var(--ink);color:var(--lilac2)}
.svc-row:hover .svc-row-arrow{color:var(--ink);transform:rotate(45deg)}
.svc-badge{width:42px;height:42px;background:var(--lilac);clip-path:polygon(50% 0%,61% 25%,88% 12%,75% 38%,100% 50%,75% 62%,88% 88%,61% 75%,50% 100%,39% 75%,12% 88%,25% 62%,0% 50%,25% 38%,12% 12%,39% 25%);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--ink);flex-shrink:0;transition:all .35s;position:relative;z-index:1}
.svc-row-body{flex:1;position:relative;z-index:1}
.svc-row-name{font-family:var(--serif);font-size:22px;font-weight:400;color:var(--ink);transition:color .3s;line-height:1.1}
.svc-row-desc{font-size:12px;color:rgba(10,10,10,.45);margin-top:2px;transition:color .3s}
.svc-row-arrow{color:rgba(10,10,10,.25);flex-shrink:0;transition:all .35s;position:relative;z-index:1}
/* (keep svc-name etc for service page use) */
.svc-name{font-family:var(--serif);font-size:clamp(20px,2vw,26px);font-weight:400;margin-bottom:14px;line-height:1.15}
.svc-desc{font-size:13px;color:var(--w60);line-height:1.8}

/* SERVICE PAGE */
.sp-wrap{min-height:100vh;background:var(--ink);padding-top:64px}
.sp-hero{padding:80px 56px 60px;max-width:900px}
.sp-back{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--w60);background:none;border:none;cursor:pointer;margin-bottom:36px;transition:color .2s;font-family:var(--sans)}
.sp-back:hover{color:var(--w)}
.sp-h1{font-family:var(--serif);font-size:clamp(44px,6vw,72px);font-weight:400;font-style:italic;line-height:1.05;letter-spacing:-1px;margin-bottom:24px}
.sp-desc{font-size:17px;color:var(--w60);max-width:560px;line-height:1.85;margin-bottom:48px}
.sp-body{padding:0 56px 80px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;max-width:1100px}
.sp-includes{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:40px}
.sp-inc-title{font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:24px}
.sp-inc-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.sp-inc-item:last-child{border-bottom:none}
.sp-inc-dot{width:6px;height:6px;background:var(--lilac);border-radius:50%;margin-top:7px;flex-shrink:0}
.sp-sidebar{display:flex;flex-direction:column;gap:16px}
.sp-side-box{background:var(--lbg);border:1px solid var(--lborder);border-radius:20px;padding:28px}
.sp-side-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);margin-bottom:14px}
.sp-process-steps{display:flex;flex-direction:column;gap:0}
.sp-step{display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.sp-step:last-child{border-bottom:none}
.sp-step-n{width:28px;height:28px;background:var(--lbg);border:1px solid var(--lborder);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--lilac);flex-shrink:0}
.sp-step-t{font-size:14px;font-weight:600;margin-bottom:3px}
.sp-step-d{font-size:12px;color:var(--w60);line-height:1.6}

/* PROCESS — editorial big numbers on cream bg */
.process-wrap{margin-top:56px}
.process-intro{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;gap:40px}
.process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid rgba(10,10,10,.1)}
.proc-card{padding:44px 28px 44px 0;position:relative;border-right:1px solid rgba(10,10,10,.1)}
.proc-card:last-child{border-right:none}
.proc-num{font-family:var(--serif);font-size:clamp(80px,8vw,110px);font-style:italic;color:rgba(10,10,10,.06);line-height:1;margin-bottom:16px;letter-spacing:-3px}
.proc-title{font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:10px;letter-spacing:-.5px;color:var(--ink)}
.proc-desc{font-size:13px;color:rgba(10,10,10,.5);line-height:1.8}
.proc-tag{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--lilac3);margin-bottom:14px;display:block}

/* CASES — editorial with big number overlay */
.cases-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px}
.cases-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.case-card{border-radius:20px;overflow:hidden;cursor:pointer;position:relative;transition:all .4s}
.case-card:hover{transform:translateY(-6px)}
.case-visual{height:260px;position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:24px}
.case-visual-bg{position:absolute;inset:0;transition:transform .6s ease}
.case-card:hover .case-visual-bg{transform:scale(1.06)}
.case-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,10,.9) 0%,rgba(10,10,10,.2) 60%,transparent 100%)}
.case-big-num{position:absolute;top:-10px;right:-8px;font-family:var(--serif);font-size:120px;font-style:italic;color:rgba(255,255,255,.06);line-height:1;pointer-events:none;letter-spacing:-4px}
.case-tag-vis{position:relative;z-index:1;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.7);background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);padding:4px 12px;border-radius:100px;backdrop-filter:blur(4px)}
.case-body{padding:22px;background:var(--ink2);border:1px solid rgba(255,255,255,.06);border-top:none;border-radius:0 0 20px 20px}
.case-client{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);margin-bottom:6px}
.case-title{font-family:var(--serif);font-size:20px;font-weight:400;margin-bottom:8px}
.case-desc{font-size:12px;color:var(--w60);line-height:1.7}
.case-meta{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}
.case-stat{font-size:11px;font-weight:700;color:var(--lilac);background:var(--lbg);border:1px solid var(--lborder);padding:3px 10px;border-radius:100px}

/* BEFORE/AFTER */
.ba-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
.ba-card{border-radius:20px;overflow:hidden;background:var(--ink2);border:1px solid rgba(255,255,255,.07)}
.ba-visual{display:grid;grid-template-columns:1fr 1fr;height:180px;position:relative}
.ba-before{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);display:flex;align-items:center;justify-content:center;position:relative}
.ba-after{background:linear-gradient(135deg,#2d1b69 0%,#4a1a7a 100%);display:flex;align-items:center;justify-content:center;position:relative}
.ba-label{position:absolute;top:8px;left:8px;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 8px;border-radius:100px}
.ba-label.b{background:rgba(255,255,255,.1);color:rgba(255,255,255,.5)}
.ba-label.a{background:var(--lbg);color:var(--lilac);border:1px solid var(--lborder)}
.ba-num{font-family:var(--serif);font-size:28px;font-style:italic}
.ba-arrow{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:28px;height:28px;background:var(--lilac);border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;font-size:14px;color:var(--ink);font-weight:700}
.ba-body{padding:18px 20px}
.ba-seg{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);margin-bottom:5px}
.ba-name{font-family:var(--serif);font-size:18px;font-weight:400;margin-bottom:4px}
.ba-period{font-size:11px;color:var(--w60)}

/* MARQUEE */
.marquee-sec{padding:60px 0;background:var(--ink2);border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05);overflow:hidden}
.marquee-track{display:flex;white-space:nowrap}
.marquee-inner{display:flex;animation:marquee 30s linear infinite}
.marquee-item{font-family:var(--serif);font-size:clamp(42px,5vw,64px);font-style:italic;font-weight:400;color:rgba(255,255,255,.06);padding:0 40px;white-space:nowrap;flex-shrink:0}
.marquee-item.accent{color:var(--lilac);opacity:.35}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.about-vals{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--cream2);border-radius:16px;overflow:hidden;margin-top:36px}
.about-val{padding:20px;background:var(--cream)}
.about-val-t{font-family:var(--serif);font-size:17px;font-weight:400;color:var(--ink);margin-bottom:5px}
.about-val-d{font-size:12px;color:rgba(10,10,10,.5);line-height:1.6}
.about-block{background:var(--ink);border-radius:24px;padding:48px;position:relative;overflow:hidden}
.about-block::before{content:'';position:absolute;top:-40%;right:-30%;width:300px;height:300px;background:radial-gradient(circle,rgba(180,127,232,.15) 0%,transparent 70%)}
.about-big{font-family:var(--serif);font-size:52px;font-style:italic;font-weight:400;color:var(--w);line-height:1;margin-bottom:8px}
.about-big span{color:var(--lilac)}
.about-sub-role{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);margin-bottom:20px}
.about-bio{font-size:14px;color:var(--w60);line-height:1.85}
.about-stats{display:flex;gap:32px;margin-top:32px;padding-top:32px;border-top:1px solid rgba(255,255,255,.07)}
.about-stat-n{font-family:var(--serif);font-size:32px;font-style:italic;color:var(--lilac2)}
.about-stat-l{font-size:11px;color:var(--w60);margin-top:2px}

/* TESTIMONIALS */
.test-intro{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:end;margin-bottom:52px}
.test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.test-card{padding:32px;background:var(--w);border-radius:20px;transition:all .3s;position:relative;overflow:hidden}
.test-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:var(--lilac3)}
.test-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(10,10,10,.12)}
.test-quote{font-family:var(--serif);font-size:15px;font-style:italic;color:rgba(10,10,10,.75);line-height:1.8;margin-bottom:24px}
.test-author{display:flex;align-items:center;gap:12px}
.test-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--lilac3),var(--lilac));display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-style:italic;font-size:16px;color:var(--w);flex-shrink:0}
.test-name{font-size:13px;font-weight:600;color:var(--ink)}
.test-co{font-size:11px;color:rgba(10,10,10,.45)}

/* FAQ */
.faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;margin-top:56px}
.faq-list{display:flex;flex-direction:column;gap:0}
.faq-item{border-bottom:1px solid rgba(10,10,10,.1)}
.faq-q{display:flex;justify-content:space-between;align-items:center;padding:20px 0;cursor:pointer;font-size:15px;font-weight:500;color:var(--ink);gap:16px;background:none;border:none;width:100%;text-align:left;font-family:var(--sans)}
.faq-q:hover{color:var(--lilac3)}
.faq-ico{width:24px;height:24px;border-radius:50%;border:1px solid rgba(10,10,10,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .3s;font-size:14px;color:rgba(10,10,10,.5)}
.faq-ico.open{background:var(--lilac3);border-color:var(--lilac3);color:var(--w);transform:rotate(45deg)}
.faq-a{font-size:14px;color:rgba(10,10,10,.6);line-height:1.8;padding-bottom:18px;max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s}
.faq-a.open{max-height:300px}
.faq-cta{background:var(--ink);border-radius:24px;padding:44px;color:var(--w);position:sticky;top:88px}
.faq-cta-t{font-family:var(--serif);font-size:28px;font-weight:400;font-style:italic;margin-bottom:14px;line-height:1.2}
.faq-cta-d{font-size:14px;color:var(--w60);line-height:1.75;margin-bottom:28px}

/* BLOG */
.blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:52px}
.blog-card{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:20px;overflow:hidden;cursor:pointer;transition:all .3s}
.blog-card:hover{border-color:var(--lborder);transform:translateY(-4px)}
.blog-img{height:180px;position:relative;overflow:hidden}
.blog-img-bg{position:absolute;inset:0;transition:transform .5s}
.blog-card:hover .blog-img-bg{transform:scale(1.05)}
.blog-body{padding:24px}
.blog-tag{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);background:var(--lbg);border:1px solid var(--lborder);padding:3px 10px;border-radius:100px;display:inline-block;margin-bottom:12px}
.blog-title{font-family:var(--serif);font-size:19px;font-weight:400;margin-bottom:10px;line-height:1.3}
.blog-excerpt{font-size:13px;color:var(--w60);line-height:1.7}
.blog-meta{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:rgba(255,255,255,.3)}

/* BLOG PAGE */
.blog-pg{min-height:100vh;background:var(--ink);padding-top:64px}
.blog-pg-inner{max-width:1100px;margin:0 auto;padding:60px 56px 80px}
.blog-pg-header{margin-bottom:60px}
.blog-full-grid{display:grid;grid-template-columns:2fr 1fr;gap:48px;align-items:start}
.blog-main-card{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:24px;overflow:hidden;margin-bottom:28px}
.blog-main-img{height:340px;position:relative;overflow:hidden}
.blog-main-body{padding:36px}
.blog-main-t{font-family:var(--serif);font-size:clamp(28px,3.5vw,42px);font-weight:400;margin-bottom:14px;line-height:1.15}
.blog-main-exc{font-size:15px;color:var(--w60);line-height:1.85}
.blog-sidebar{display:flex;flex-direction:column;gap:16px;position:sticky;top:88px}
.blog-side-card{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;cursor:pointer;transition:all .2s}
.blog-side-card:hover{border-color:var(--lborder)}
.blog-side-tag{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);margin-bottom:8px}
.blog-side-t{font-family:var(--serif);font-size:16px;font-weight:400;line-height:1.3;margin-bottom:6px}
.blog-side-d{font-size:12px;color:var(--w60)}

/* CONTACT */
.contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.contact-detail{display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.07)}
.contact-ic{width:38px;height:38px;background:var(--lbg);border:1px solid var(--lborder);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--lilac);flex-shrink:0}
.contact-lbl{font-size:10px;color:var(--w60);letter-spacing:.5px;margin-bottom:3px;text-transform:uppercase}
.contact-val{font-size:14px;font-weight:500}
.contact-form-box{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:40px}
.fl{margin-bottom:18px}
.fl label{display:block;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--w60);margin-bottom:8px}
.fi,.fta{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 16px;color:var(--w);font-family:var(--sans);font-size:14px;outline:none;transition:border-color .2s}
.fi:focus,.fta:focus{border-color:var(--lilac)}
.fta{min-height:110px;resize:vertical}
.fi::placeholder,.fta::placeholder{color:rgba(255,255,255,.25)}

/* FOOTER */
.footer{background:var(--ink);border-top:1px solid rgba(255,255,255,.06);padding:52px 56px}
.footer-top{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px}
.footer-brand{font-family:var(--serif);font-size:22px;font-style:italic;margin-bottom:14px}
.footer-brand span{color:var(--lilac);font-style:normal}
.footer-tagline{font-size:13px;color:var(--w60);line-height:1.7;margin-bottom:24px;max-width:240px}
.footer-socials{display:flex;gap:10px}
.footer-soc{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:var(--w60);cursor:pointer;transition:all .2s;background:none}
.footer-soc:hover{border-color:var(--lilac);color:var(--lilac)}
.footer-col-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--w60);margin-bottom:16px}
.footer-link{display:block;font-size:13px;color:rgba(255,255,255,.4);margin-bottom:10px;cursor:pointer;transition:color .2s;background:none;border:none;text-align:left;font-family:var(--sans)}
.footer-link:hover{color:var(--w)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:28px;border-top:1px solid rgba(255,255,255,.06);flex-wrap:wrap;gap:12px}
.footer-copy{font-size:12px;color:rgba(255,255,255,.3)}

/* WA FLOAT */
.wa-float{position:fixed;bottom:28px;right:28px;z-index:300;width:54px;height:54px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(37,211,102,.35);transition:all .25s;border:none;animation:pulse-wa 3s infinite}
.wa-float:hover{transform:scale(1.1);box-shadow:0 8px 28px rgba(37,211,102,.5)}
@keyframes pulse-wa{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.35)}50%{box-shadow:0 4px 32px rgba(37,211,102,.55)}}
.wa-tooltip{position:absolute;right:64px;background:var(--ink2);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:8px 14px;font-size:12px;white-space:nowrap;opacity:0;transition:opacity .2s;pointer-events:none}
.wa-float:hover .wa-tooltip{opacity:1}

/* POPUP */
.popup-overlay{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein .3s}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.popup-box{background:var(--ink2);border:1px solid var(--lborder);border-radius:24px;max-width:480px;width:100%;padding:48px;position:relative;overflow:hidden}
.popup-box::before{content:'';position:absolute;top:-30%;right:-20%;width:280px;height:280px;background:radial-gradient(circle,rgba(180,127,232,.12) 0%,transparent 70%)}
.popup-tag{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);background:var(--lbg);border:1px solid var(--lborder);padding:4px 12px;border-radius:100px;display:inline-block;margin-bottom:20px}
.popup-t{font-family:var(--serif);font-size:30px;font-weight:400;font-style:italic;line-height:1.15;margin-bottom:10px}
.popup-d{font-size:14px;color:var(--w60);line-height:1.75;margin-bottom:28px}
.popup-close{position:absolute;top:16px;right:16px;width:32px;height:32px;background:rgba(255,255,255,.05);border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--w60);transition:all .2s}
.popup-close:hover{background:rgba(255,255,255,.1);color:var(--w)}
.popup-success{text-align:center;padding:20px 0}
.popup-success-ic{font-family:var(--serif);font-size:56px;font-style:italic;color:var(--lilac2);display:block;margin-bottom:16px}
.popup-success-t{font-family:var(--serif);font-size:24px;font-style:italic;margin-bottom:8px}
.popup-success-d{font-size:14px;color:var(--w60);line-height:1.7}

/* MODAL */
.overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.85);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--ink2);border:1px solid rgba(255,255,255,.1);border-radius:24px;width:100%;max-width:720px;max-height:90vh;overflow-y:auto;padding:40px}
.modal-t{font-family:var(--serif);font-size:28px;font-weight:400;letter-spacing:-.5px;margin-bottom:6px}
.modal-s{font-size:13px;color:var(--w60);margin-bottom:28px}
.ms-t{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac);margin-bottom:14px;margin-top:24px}
.irow{display:grid;grid-template-columns:1fr 68px 88px 34px;gap:10px;align-items:center;margin-bottom:10px}
.ii{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:9px 12px;color:var(--w);font-family:var(--sans);font-size:13px;outline:none;width:100%}
.ii:focus{border-color:var(--lilac)}
.ii.c{text-align:center}
.add-btn{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.12);color:var(--w60);border-radius:9px;padding:9px 14px;font-size:12px;cursor:pointer;transition:all .2s;width:100%;justify-content:center;margin-bottom:20px;font-family:var(--sans)}
.add-btn:hover{border-color:var(--lilac);color:var(--lilac)}
.total-b{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;margin:18px 0}
.total-l{font-size:13px;color:var(--w60)}
.total-v{font-family:var(--serif);font-size:28px;font-style:italic;color:var(--lilac2)}
.modal-acts{display:flex;gap:10px;justify-content:flex-end;margin-top:24px;flex-wrap:wrap}

/* ADMIN */
.login-pg{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.login-bg{position:absolute;inset:0;background:radial-gradient(ellipse 50% 60% at 50% 40%,rgba(180,127,232,.12) 0%,transparent 70%)}
.login-box{background:var(--ink2);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:52px;width:100%;max-width:420px;position:relative;z-index:1}
.login-logo{font-family:var(--serif);font-size:36px;font-style:italic;text-align:center;margin-bottom:6px}
.login-logo span{color:var(--lilac);font-style:normal}
.login-sub{text-align:center;font-size:13px;color:var(--w60);margin-bottom:40px}
.login-err{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:10px 14px;font-size:13px;color:#ef4444;margin-bottom:16px;text-align:center}
.adm-wrap{display:flex;min-height:100vh}
.sidebar{width:228px;background:var(--ink2);border-right:1px solid rgba(255,255,255,.06);padding:28px 16px;display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh}
.sb-logo{font-family:var(--serif);font-size:22px;font-style:italic;margin-bottom:36px;padding:0 8px}
.sb-logo span{color:var(--lilac);font-style:normal}
.sb-sec{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--w60);padding:0 8px;margin-bottom:6px;margin-top:20px}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:13px;color:var(--w60);cursor:pointer;transition:all .2s;border:none;background:none;width:100%;text-align:left;font-family:var(--sans)}
.sb-item:hover{background:rgba(255,255,255,.05);color:var(--w)}
.sb-item.on{background:var(--lbg);color:var(--lilac);border:1px solid var(--lborder)}
.sb-bot{margin-top:auto}
.adm-main{flex:1;padding:40px;overflow-y:auto;min-height:100vh}
.adm-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;flex-wrap:wrap;gap:14px}
.adm-title{font-family:var(--serif);font-size:32px;font-weight:400;letter-spacing:-.5px}
.adm-sub{font-size:13px;color:var(--w60);margin-top:4px}
.stat-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:28px}
.sc{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:22px}
.sc-ic{width:36px;height:36px;background:var(--lbg);border:1px solid var(--lborder);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--lilac);margin-bottom:14px}
.sc-val{font-family:var(--serif);font-size:28px;font-style:italic;margin-bottom:3px}
.sc-lbl{font-size:12px;color:var(--w60)}
.ptable{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:18px;overflow:hidden}
.pt-hd{display:grid;grid-template-columns:1fr 1.2fr 100px 130px 80px 130px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,.06);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--w60)}
.pt-row{display:grid;grid-template-columns:1fr 1.2fr 100px 130px 80px 130px;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.04);align-items:center;transition:background .2s}
.pt-row:last-child{border-bottom:none}
.pt-row:hover{background:rgba(255,255,255,.03)}
.pt-client{font-weight:600;font-size:14px}
.pt-hl{font-size:12px;color:var(--w60);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
.pt-date{font-size:12px;color:var(--w60)}
.pt-total{font-family:var(--serif);font-style:italic;font-size:16px;color:var(--lilac2)}
.pt-acts{display:flex;gap:5px}
.badge{display:inline-block;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:600}
.badge.active{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);color:#22c55e}
.badge.viewed{background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);color:#3b82f6}
.badge.accepted{background:var(--lbg);border:1px solid var(--lborder);color:var(--lilac)}
.emails-table{background:var(--ink2);border:1px solid rgba(255,255,255,.07);border-radius:18px;overflow:hidden}
.em-hd{display:grid;grid-template-columns:1fr 1fr 120px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,.06);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--w60)}
.em-row{display:grid;grid-template-columns:1fr 1fr 120px;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.04);font-size:13px}
.em-row:last-child{border-bottom:none}

/* PROPOSAL VIEW */
.pv-nav{position:sticky;top:0;background:rgba(10,10,10,.94);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.07);padding:16px 56px;display:flex;align-items:center;justify-content:space-between;z-index:50}
.pv-wrap{min-height:100vh;background:var(--ink)}
.pv-inner{max-width:860px;margin:0 auto;padding:64px 56px 80px}
.pv-badge{display:inline-flex;align-items:center;gap:8px;background:var(--lbg);border:1px solid var(--lborder);border-radius:100px;padding:5px 14px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--lilac2);margin-bottom:32px}
.pv-to{font-size:11px;color:var(--w60);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.pv-client{font-family:var(--serif);font-size:clamp(44px,6vw,72px);font-weight:400;font-style:italic;line-height:1;margin-bottom:16px;letter-spacing:-1px}
.pv-hl{font-size:17px;color:var(--w60);max-width:520px;line-height:1.75;margin-bottom:28px}
.pv-div{height:1px;background:rgba(255,255,255,.07);margin:36px 0}
.pv-items-t{font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:20px}
.pv-item{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.pv-item-n{font-size:14px}.pv-item-q{font-size:12px;color:var(--w60);margin-left:12px}
.pv-item-p{font-family:var(--serif);font-style:italic;font-size:16px;color:var(--lilac2)}
.pv-total-box{background:var(--lbg);border:1px solid var(--lborder);border-radius:24px;padding:40px;margin-top:40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px}
.pv-total-v{font-family:var(--serif);font-size:clamp(44px,6vw,68px);font-style:italic;font-weight:400;color:var(--lilac2);line-height:1}
.pv-chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
.pv-chip{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:100px;padding:7px 16px;font-size:12px}
.pv-cta{display:flex;gap:14px;justify-content:center;margin-top:40px;flex-wrap:wrap}
.pv-valid{text-align:center;font-size:12px;color:var(--w60);margin-top:24px;font-style:italic;font-family:var(--serif)}

/* TOAST */
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:rgba(180,127,232,.12);border:1px solid var(--lilac);border-radius:100px;padding:11px 22px;font-size:13px;z-index:9999;backdrop-filter:blur(12px);white-space:nowrap;animation:tin .3s ease;font-family:var(--sans)}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.toast.err{background:rgba(239,68,68,.08);border-color:#ef4444}

/* RESPONSIVE */
@media(max-width:960px){
  .hero-topbar,.hero-bottom,.hero-title-wrap{padding-left:24px;padding-right:24px}
  .hero-h1{font-size:clamp(52px,14vw,88px);letter-spacing:-2px}
  .hero-h1 .line2{padding-left:28px}.hero-h1 .line3{padding-left:56px}
  .hero-bottom{grid-template-columns:1fr;gap:28px}
  .hero-stats-right{justify-content:flex-start}
  .hero-deco{display:none}
  .svc-two-col{grid-template-columns:1fr}.cases-grid,.test-grid,.blog-grid,.ba-grid{grid-template-columns:1fr}
  .about-grid,.contact-wrap,.faq-grid,.blog-full-grid{grid-template-columns:1fr;gap:40px}
  .footer-top{grid-template-columns:1fr 1fr}.sec{padding:64px 24px}.logos-band{padding:36px 24px}
  .nav,.nav.stuck{padding:14px 24px}.nav-links{display:none}
  .process-grid{grid-template-columns:1fr 1fr}.process-intro{flex-direction:column;gap:20px}
  .adm-wrap{flex-direction:column}.sidebar{width:100%;height:auto;position:static;padding:14px}
  .adm-main{padding:20px}
  .pt-hd{display:none}.pt-row{grid-template-columns:1fr 110px;gap:6px}
  .pv-inner{padding:40px 20px 60px}.pv-nav{padding:14px 20px}
  .pv-total-box{flex-direction:column}
  .sp-body,.sp-hero{padding-left:24px;padding-right:24px}
  .sp-body{grid-template-columns:1fr}
  .svc-header{gap:16px}
  .blog-pg-inner{padding:40px 24px}
  .proc-card{padding:32px 16px 32px 0}
  .stk{display:none}
}
@media(max-width:600px){
  .svc-two-col,.process-grid{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr}
  .hero-stats-right{gap:20px}
  .hero-h1{letter-spacing:-1px}
}
  `;
  document.head.appendChild(el);
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const SVCS=[
  {slug:"gestao-redes",n:"Gestão de Redes Sociais",short:"Social Media",d:"Estratégia, criação e publicação para Instagram, TikTok e LinkedIn — com consistência e identidade de marca em cada entrega.",includes:["Planejamento editorial mensal","Criação de arte e copy","Publicação e agendamento","Gestão de stories e reels","Monitoramento de comentários","Relatório mensal completo"],process:[{t:"Briefing",d:"Entendemos sua marca, público e objetivos antes de tudo."},{t:"Estratégia",d:"Definimos pauta, tom de voz e calendário editorial."},{t:"Produção",d:"Criamos as artes e copies alinhados ao posicionamento."},{t:"Publicação",d:"Agendamos e publicamos nos melhores horários."}]},
  {slug:"ads",n:"Social Media Ads",short:"Ads",d:"Campanhas pagas no Meta e TikTok Ads focadas em conversão real, alcance qualificado e retorno mensurável.",includes:["Configuração e estrutura de campanhas","Segmentação de público avançada","Criação de criativos para anúncios","Testes A/B contínuos","Otimização e escala de budget","Relatório de ROAS e conversões"],process:[{t:"Diagnóstico",d:"Auditamos suas campanhas atuais e identificamos oportunidades."},{t:"Estrutura",d:"Configuramos campanhas, conjuntos e anúncios corretamente."},{t:"Criativos",d:"Produzimos artes e vídeos otimizados para conversão."},{t:"Otimização",d:"Monitoramos e escalamos o que funciona."}]},
  {slug:"conteudo",n:"Estratégia de Conteúdo",short:"Conteúdo",d:"Planejamento editorial completo: posicionamento, tom de voz, calendário e diretrizes de publicação para cada canal.",includes:["Posicionamento e linha editorial","Definição de tom de voz","Calendário editorial 30 dias","Guia de conteúdo por canal","Pesquisa de tendências e concorrência","Templates e diretrizes visuais"],process:[{t:"Imersão",d:"Estudamos seu mercado, concorrência e público-alvo."},{t:"Posicionamento",d:"Definimos onde e como sua marca deve falar."},{t:"Calendário",d:"Planejamos os temas e formatos de cada publicação."},{t:"Entrega",d:"Você recebe um guia completo e acionável."}]},
  {slug:"identidade",n:"Identidade Visual Digital",short:"Design",d:"Criação de identidade para redes: templates, paletas, tipografia e guidelines de aplicação visual consistente.",includes:["Paleta de cores e tipografia","Templates de feed e stories","Ícones e elementos gráficos","Manual de identidade digital","Pack de 20+ templates editáveis","Suporte para adaptações"],process:[{t:"Referências",d:"Coletamos referências e briefing visual detalhado."},{t:"Conceito",d:"Desenvolvemos a identidade visual da marca."},{t:"Templates",d:"Criamos todos os templates para aplicação."},{t:"Manual",d:"Entregamos o guia de uso da identidade."}]},
  {slug:"comunidade",n:"Gestão de Comunidade",short:"Comunidade",d:"Monitoramento, respostas e engajamento ativo com a audiência — transformando seguidores em clientes fiéis.",includes:["Resposta a comentários e DMs","Monitoramento de menções","Engajamento com contas parceiras","Gestão de crises online","Moderação de grupos","Relatório de engajamento"],process:[{t:"Mapeamento",d:"Identificamos sua audiência e comunidade atual."},{t:"Protocolo",d:"Criamos respostas padrão e diretrizes de atendimento."},{t:"Engajamento",d:"Interagimos diariamente em nome da marca."},{t:"Análise",d:"Reportamos sentimento e crescimento da comunidade."}]},
  {slug:"relatorios",n:"Relatórios & Análise",short:"Análise",d:"Reports mensais com métricas reais, insights acionáveis e recomendações estratégicas baseadas em dados.",includes:["Dashboard de métricas personalizadas","Análise de alcance e engajamento","Performance de conteúdo","Comparativo mensal","Insights e recomendações","Apresentação executiva"],process:[{t:"Configuração",d:"Definimos os KPIs relevantes para seus objetivos."},{t:"Coleta",d:"Integramos as fontes de dados e dashboards."},{t:"Análise",d:"Interpretamos os dados com contexto estratégico."},{t:"Entrega",d:"Apresentamos o report com ações prioritárias."}]},
];

const CASES=[
  {cl:"Moda & Lifestyle",t:"300% de crescimento orgânico",d:"Estratégia de reels e stories que triplicou o alcance em 4 meses.",g:"linear-gradient(160deg,#1a0a2e 0%,#4a1a7a 100%)",tags:["Instagram","Reels"],stats:["↑ 300% alcance","↑ 180% seguidores","↑ 220% engajamento"]},
  {cl:"Gastronomia",t:"Do zero ao reconhecimento",d:"Criação de presença digital completa para restaurante recém-inaugurado.",g:"linear-gradient(160deg,#0a1928 0%,#1a3a5a 100%)",tags:["Branding","Meta Ads"],stats:["15K seguidores em 3 meses","↑ 400% reservas online","ROAS 4.2x"]},
  {cl:"Fitness & Saúde",t:"Comunidade de 50K",d:"Conteúdo educativo que transformou seguidores em uma comunidade engajada.",g:"linear-gradient(160deg,#0f1a0a 0%,#1a3a14 100%)",tags:["TikTok","Comunidade"],stats:["50K seguidores","↑ 8% taxa engajamento","200K views/mês"]},
];

const BA=[
  {seg:"E-commerce",n:"Loja de Roupas",period:"4 meses",bv:"1.2K",av:"18K",bl:"seguidores",al:"seguidores"},
  {seg:"Restaurante",n:"Bistrô Urbano",period:"3 meses",bv:"0.8%",av:"6.4%",bl:"engajamento",al:"engajamento"},
  {seg:"Consultora",n:"Personal Stylist",period:"6 meses",bv:"R$0",av:"R$14K",bl:"vendas/mês via IG",al:"vendas/mês via IG"},
];

const TESTS=[
  {q:"A doisE transformou nossa presença digital. Em 3 meses dobramos o engajamento e as vendas pelo Instagram cresceram 80%. Cada entrega com profissionalismo e criatividade.",n:"Ana Costa",c:"Boutique Estilo"},
  {q:"Equipe dedicada, estratégia clara e resultados que aparecem nos números. Nosso restaurante hoje tem fila de espera — parte disso veio da gestão deles.",n:"Carlos Mendes",c:"Bistrô Urbano"},
  {q:"Finalmente uma agência que entende de conteúdo de verdade. Não é só postar bonito — é ter estratégia, e isso a doisE tem de sobra.",n:"Rafaela Lima",c:"Studio RF Fitness"},
];

const FAQS=[
  {q:"Quanto custa contratar a doisE?",a:"Nossos planos começam a partir de R$1.200/mês para gestão básica de uma rede social. O valor varia conforme o escopo, número de redes e serviços incluídos. Solicite um diagnóstico gratuito para receber uma proposta personalizada."},
  {q:"Vocês atendem marcas de qualquer segmento?",a:"Sim! Trabalhamos com marcas de diferentes segmentos — moda, gastronomia, saúde, educação, beleza, serviços e muito mais. Nossa metodologia se adapta a cada nicho."},
  {q:"Quanto tempo para ver resultados?",a:"Os primeiros resultados aparecem entre 30 e 60 dias — aumento de alcance e engajamento. Resultados em vendas costumam ser mais sólidos entre 3 e 6 meses de trabalho consistente."},
  {q:"Vocês criam os conteúdos ou eu preciso fornecer?",a:"Nós cuidamos de tudo: estratégia, criação de arte, copy e publicação. Você apenas revisa antes de publicar. Para foto e vídeo original da sua empresa, trabalhamos junto com você num calendário de captura."},
  {q:"Vocês atendem empresas de outras cidades?",a:"Sim! Trabalhamos 100% remoto com clientes em todo o Brasil. Nossas reuniões de alinhamento são por videochamada e toda comunicação é pelo Slack ou WhatsApp."},
  {q:"O que está incluso nos relatórios mensais?",a:"Nossos reports incluem: alcance, impressões, engajamento, crescimento de seguidores, performance de cada publicação, análise de audiência e recomendações para o próximo mês — tudo em formato visual e fácil de entender."},
  {q:"Preciso assinar um contrato de fidelidade?",a:"Trabalhamos com contratos mensais renováveis. Entendemos que resultados levam tempo, então recomendamos pelo menos 3 meses para avaliar com consistência — mas não há multa ou fidelidade obrigatória."},
  {q:"Vocês também fazem anúncios pagos?",a:"Sim! Gerenciamos campanhas no Meta Ads (Instagram e Facebook) e TikTok Ads. O investimento em anúncios é à parte e pode ser a partir de R$500/mês de verba, dependendo dos seus objetivos."},
];

const POSTS=[
  {tag:"Estratégia",t:"Como dobrar o engajamento do seu Instagram em 30 dias",exc:"Descubra as 5 práticas que nossos clientes usam para aumentar organicamente o alcance e as interações nas redes sociais.",date:"10 mar 2025",read:"5 min",g:"linear-gradient(135deg,#1a0a2e 0%,#4a1a7a 100%)"},
  {tag:"Ads",t:"ROAS acima de 4x: o que os melhores anúncios têm em comum",exc:"Análise de mais de 200 campanhas mostra os padrões que separam anúncios que convertem dos que desperdiçam verba.",date:"28 fev 2025",read:"7 min",g:"linear-gradient(135deg,#0a1928 0%,#1a4a6a 100%)"},
  {tag:"Conteúdo",t:"O calendário editorial que usamos com todos os nossos clientes",exc:"A estrutura de planejamento de conteúdo que simplifica a criação e garante consistência semana após semana.",date:"15 fev 2025",read:"4 min",g:"linear-gradient(135deg,#0f1a0a 0%,#1a4a14 100%)"},
  {tag:"TikTok",t:"Por que o TikTok ainda é a maior oportunidade orgânica de 2025",exc:"O algoritmo do TikTok ainda favorece contas pequenas. Veja como aproveitar essa janela antes que feche.",date:"5 fev 2025",read:"6 min",g:"linear-gradient(135deg,#1a0a14 0%,#4a0a3a 100%)"},
  {tag:"Métricas",t:"Quais métricas realmente importam (e quais são só vaidade)",exc:"Alcance, curtidas, visualizações: o que monitorar de verdade para saber se sua estratégia está funcionando.",date:"22 jan 2025",read:"5 min",g:"linear-gradient(135deg,#0a1a1a 0%,#0a3a3a 100%)"},
  {tag:"Cases",t:"Como geramos R$14K/mês em vendas via Instagram para uma consultora",exc:"O passo a passo de como transformamos o perfil de uma personal stylist em canal de vendas consistente.",date:"10 jan 2025",read:"8 min",g:"linear-gradient(135deg,#1a1000 0%,#3a2800 100%)"},
];

const LOGOS=["Boutique Estilo","Bistrô Urbano","Studio RF","Café Central","Moda Única","Wellness Co","Urban Store","Fit Life"];

// ── HOOKS ─────────────────────────────────────────────────────────────────────
function useToast(){
  const [t,st]=useState(null);
  const show=(m,tp="ok")=>{st({m,tp});setTimeout(()=>st(null),3000)};
  return [t,show];
}

// ── POPUP ─────────────────────────────────────────────────────────────────────
function LeadPopup({onClose}){
  const [email,setEmail]=useState("");
  const [nome,setNome]=useState("");
  const [done,setDone]=useState(false);
  const submit=()=>{
    if(!email) return;
    const list=loadEmails();
    list.push({email,nome,date:new Date().toLocaleDateString("pt-BR"),source:"popup"});
    saveEmails(list);
    setDone(true);
  };
  return(
    <div className="popup-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="popup-box">
        <button className="popup-close" onClick={onClose}><I n="cl" s={13}/></button>
        {done?(
          <div className="popup-success">
            <span className="popup-success-ic">✓</span>
            <div className="popup-success-t">Checklist enviado!</div>
            <div className="popup-success-d">Você receberá no e-mail em instantes.<br/>Bons resultados nas redes! 🚀</div>
          </div>
        ):(
          <>
            <div className="popup-tag">Download Gratuito</div>
            <div className="popup-t">Checklist de Social Media para 2025</div>
            <div className="popup-d">27 pontos essenciais que toda marca precisa ter antes de postar — do perfil à estratégia de conteúdo.</div>
            <div className="fl"><label>Seu nome</label><input className="fi" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Como podemos te chamar?"/></div>
            <div className="fl"><label>Seu melhor e-mail</label><input className="fi" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@empresa.com.br" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
            <button className="btn-lilac" style={{width:"100%",justifyContent:"center"}} onClick={submit}>
              Quero o checklist grátis <I n="ar" s={15}/>
            </button>
            <div style={{textAlign:"center",marginTop:14,fontSize:11,color:"var(--w60)"}}>Sem spam. Cancele quando quiser.</div>
          </>
        )}
      </div>
    </div>
  );
}

// ── FAQ COMPONENT ─────────────────────────────────────────────────────────────
function FaqItem({q,a}){
  const [open,setOpen]=useState(false);
  return(
    <div className="faq-item">
      <button className="faq-q" onClick={()=>setOpen(!open)}>
        {q}
        <span className={`faq-ico${open?" open":""}`}>+</span>
      </button>
      <div className={`faq-a${open?" open":""}`}>{a}</div>
    </div>
  );
}

// ── SERVICE PAGE ──────────────────────────────────────────────────────────────
function ServicePage({slug}){
  const svc=SVCS.find(s=>s.slug===slug)||SVCS[0];
  useEffect(()=>{window.scrollTo(0,0)},[slug]);
  const scroll=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return(
    <div className="sp-wrap">
      <div className="sp-hero">
        <button className="sp-back" onClick={()=>nav("/")}><I n="ar" s={14} style={{transform:"rotate(180deg)"}}/> Voltar</button>
        <div className="sec-label">{svc.short}</div>
        <h1 className="sp-h1">{svc.n}</h1>
        <p className="sp-desc">{svc.d}</p>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <button className="btn-dark" onClick={()=>{nav("/");setTimeout(()=>scroll("contato"),300)}}>Quero contratar <I n="ar" s={15}/></button>
          <button className="btn-outline" onClick={()=>nav("/")}>← Outros serviços</button>
        </div>
      </div>
      <div className="sp-body">
        <div>
          <div className="sp-includes">
            <div className="sp-inc-title">O que está incluso</div>
            {svc.includes.map((it,i)=>(
              <div key={i} className="sp-inc-item">
                <div className="sp-inc-dot"/>
                <div style={{fontSize:14,lineHeight:1.6}}>{it}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:20,padding:"28px",background:"var(--lbg)",border:"1px solid var(--lborder)",borderRadius:16}}>
            <div style={{fontSize:12,color:"var(--w60)",marginBottom:8}}>A partir de</div>
            <div style={{fontFamily:"var(--serif)",fontSize:36,fontStyle:"italic",color:"var(--lilac2)"}}>R$1.200<span style={{fontSize:16,color:"var(--w60)"}}>/mês</span></div>
            <div style={{fontSize:12,color:"var(--w60)",marginTop:6}}>Proposta personalizada após diagnóstico gratuito</div>
          </div>
        </div>
        <div className="sp-sidebar">
          <div style={{fontFamily:"var(--serif)",fontSize:22,fontStyle:"italic",marginBottom:20}}>Como funciona</div>
          <div className="sp-process-steps">
            {svc.process.map((s,i)=>(
              <div key={i} className="sp-step">
                <div className="sp-step-n">{i+1}</div>
                <div><div className="sp-step-t">{s.t}</div><div className="sp-step-d">{s.d}</div></div>
              </div>
            ))}
          </div>
          <div className="sp-side-box" style={{marginTop:8}}>
            <div className="sp-side-title">Resultado esperado</div>
            <div style={{fontSize:14,color:"var(--w60)",lineHeight:1.8}}>Nossos clientes de {svc.short} reportam em média <strong style={{color:"var(--w)"}}>↑ 180% no engajamento</strong> e <strong style={{color:"var(--w)"}}>↑ 120% no alcance</strong> em 90 dias.</div>
          </div>
          <button className="btn-lilac" style={{justifyContent:"center"}} onClick={()=>{nav("/");setTimeout(()=>scroll("contato"),300)}}>
            Solicitar proposta gratuita <I n="ar" s={15}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BLOG PAGE ─────────────────────────────────────────────────────────────────
function BlogPage(){
  useEffect(()=>{window.scrollTo(0,0)},[]);
  return(
    <div className="blog-pg">
      <div className="blog-pg-inner">
        <button className="sp-back" onClick={()=>nav("/")}><I n="ar" s={14}/> Voltar ao site</button>
        <div className="blog-pg-header">
          <div className="sec-label">Blog</div>
          <h1 className="sec-h2">Conteúdo que <em>educa</em> e converte</h1>
          <p style={{fontSize:15,color:"var(--w60)",marginTop:14,maxWidth:520,lineHeight:1.8}}>Estratégia, conteúdo e análise de dados para marcas que levam social media a sério.</p>
        </div>
        <div className="blog-full-grid">
          <div>
            {POSTS.slice(0,1).map((p,i)=>(
              <div key={i} className="blog-main-card">
                <div className="blog-main-img"><div style={{position:"absolute",inset:0,background:p.g}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"var(--serif)",fontSize:64,fontStyle:"italic",color:"rgba(255,255,255,.08)"}}>doisE</span></div></div>
                <div className="blog-main-body">
                  <span className="blog-tag">{p.tag}</span>
                  <div className="blog-main-t">{p.t}</div>
                  <div className="blog-main-exc" style={{marginTop:12}}>{p.exc}</div>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginTop:24}}>
                    <button className="btn-lilac btn-sm">Ler artigo <I n="ar" s={14}/></button>
                    <span style={{fontSize:12,color:"var(--w60)"}}>{p.date} · {p.read} leitura</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {POSTS.slice(1,5).map((p,i)=>(
                <div key={i} className="blog-card">
                  <div className="blog-img"><div className="blog-img-bg" style={{background:p.g,position:"absolute",inset:0}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"var(--serif)",fontSize:28,fontStyle:"italic",color:"rgba(255,255,255,.07)"}}>doisE</span></div></div>
                  <div className="blog-body">
                    <span className="blog-tag">{p.tag}</span>
                    <div className="blog-title">{p.t}</div>
                    <div className="blog-meta"><span>{p.date}</span><span>{p.read}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="blog-sidebar">
            <div style={{fontFamily:"var(--serif)",fontSize:20,fontStyle:"italic",marginBottom:4}}>Mais recentes</div>
            {POSTS.slice(4).map((p,i)=>(
              <div key={i} className="blog-side-card">
                <div className="blog-side-tag">{p.tag}</div>
                <div className="blog-side-t">{p.t}</div>
                <div className="blog-side-d">{p.date} · {p.read}</div>
              </div>
            ))}
            <div style={{background:"var(--lbg)",border:"1px solid var(--lborder)",borderRadius:16,padding:24,marginTop:8}}>
              <div style={{fontFamily:"var(--serif)",fontSize:18,fontStyle:"italic",marginBottom:10}}>Newsletter semanal</div>
              <div style={{fontSize:13,color:"var(--w60)",marginBottom:16,lineHeight:1.7}}>Receba dicas de social media toda semana no seu e-mail.</div>
              <input className="fi" placeholder="seu@email.com" style={{marginBottom:10}}/>
              <button className="btn-lilac btn-sm" style={{width:"100%",justifyContent:"center"}}>Assinar <I n="ar" s={13}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BUILDER MODAL ─────────────────────────────────────────────────────────────
function BuilderModal({init,onClose,onSave}){
  const[cn,setCn]=useState(init?.clientName||"");
  const[hl,setHl]=useState(init?.headline||"");
  const[nt,setNt]=useState(init?.notes||"");
  const[vl,setVl]=useState(init?.validity||"15");
  const[its,setIts]=useState(init?.items||[{d:"",q:1,p:""}]);
  const[pay,setPay]=useState(init?.payment||[{l:"Entrada",v:""},{l:"Saldo final",v:""}]);
  const updI=(i,f,v)=>{const n=[...its];n[i]={...n[i],[f]:v};setIts(n)};
  const updP=(i,f,v)=>{const n=[...pay];n[i]={...n[i],[f]:v};setPay(n)};
  const total=its.reduce((s,it)=>s+(parseFloat(it.p)||0)*(parseInt(it.q)||1),0);
  const save=()=>{
    const id=init?.id||(Date.now().toString(36)+Math.random().toString(36).slice(2));
    onSave({id,clientName:cn,headline:hl,notes:nt,validity:vl,items:its,payment:pay,total,createdAt:init?.createdAt||new Date().toLocaleDateString("pt-BR"),status:init?.status||"active"});
  };
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div className="modal-t">{init?"Editar":"Nova"} Proposta</div>
          <button className="btn-icon" onClick={onClose}><I n="cl" s={14}/></button>
        </div>
        <div className="modal-s">Preencha os dados e gere um link exclusivo para o cliente</div>
        <div className="ms-t">Cliente</div>
        <div className="fl"><label>Nome / Empresa</label><input className="fi" value={cn} onChange={e=>setCn(e.target.value)} placeholder="Ex: Boutique Estilo"/></div>
        <div className="fl"><label>Headline da proposta</label><input className="fi" value={hl} onChange={e=>setHl(e.target.value)} placeholder="Ex: Gestão completa de redes sociais para 2025"/></div>
        <div className="ms-t">Itens & Serviços</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 68px 88px 34px",gap:10,marginBottom:8}}>
          {["Descrição","Qtd","Valor R$",""].map((h,i)=><div key={i} style={{fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--w60)",textAlign:i>0?"center":"left"}}>{h}</div>)}
        </div>
        {its.map((it,i)=>(
          <div key={i} className="irow">
            <input className="ii" value={it.d} onChange={e=>updI(i,"d",e.target.value)} placeholder="Descrição do serviço"/>
            <input className="ii c" type="number" min="1" value={it.q} onChange={e=>updI(i,"q",e.target.value)}/>
            <input className="ii c" type="number" value={it.p} onChange={e=>updI(i,"p",e.target.value)} placeholder="0"/>
            <button className="btn-icon del" onClick={()=>setIts(its.filter((_,j)=>j!==i))}><I n="tr" s={13}/></button>
          </div>
        ))}
        <button className="add-btn" onClick={()=>setIts([...its,{d:"",q:1,p:""}])}><I n="pl" s={13}/> Adicionar item</button>
        <div className="total-b"><span className="total-l">Total do projeto</span><span className="total-v">{fmt(total)}</span></div>
        <div className="ms-t">Condições de Pagamento</div>
        {pay.map((p,i)=>(
          <div key={i} className="irow" style={{gridTemplateColumns:"1fr 1fr 34px"}}>
            <input className="ii" value={p.l} onChange={e=>updP(i,"l",e.target.value)} placeholder="Ex: Entrada"/>
            <input className="ii" type="number" value={p.v} onChange={e=>updP(i,"v",e.target.value)} placeholder="Valor R$"/>
            <button className="btn-icon del" onClick={()=>setPay(pay.filter((_,j)=>j!==i))}><I n="tr" s={13}/></button>
          </div>
        ))}
        <button className="add-btn" onClick={()=>setPay([...pay,{l:"",v:""}])}><I n="pl" s={13}/> Adicionar parcela</button>
        <div className="fl"><label>Observações</label><textarea className="fta" style={{minHeight:80}} value={nt} onChange={e=>setNt(e.target.value)} placeholder="Detalhes adicionais, escopo, exclusões..."/></div>
        <div className="fl"><label>Validade (dias)</label><input className="fi" style={{maxWidth:100}} type="number" value={vl} onChange={e=>setVl(e.target.value)}/></div>
        <div className="modal-acts">
          <button className="btn-outline btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn-lilac btn-sm" onClick={save}><I n="ok" s={14}/> Salvar Proposta</button>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
function AdminLogin({onSuccess}){
  const[p,setP]=useState("");const[err,setErr]=useState(false);
  const go=()=>{if(p===AP){setAuth(true);onSuccess();}else{setErr(true);setP("");setTimeout(()=>setErr(false),2500);}};
  return(
    <div className="login-pg"><div className="login-bg"/>
      <div className="login-box">
        <div className="login-logo">dois<span>E</span></div>
        <div className="login-sub">Painel Administrativo · Acesso restrito</div>
        {err&&<div className="login-err">Senha incorreta. Tente novamente.</div>}
        <div className="fl"><label>Senha</label><input className="fi" type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" autoFocus/></div>
        <button className="btn-lilac" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={go}><I n="lk" s={15}/> Entrar no painel</button>
        <div style={{textAlign:"center",marginTop:20}}><button className="nav-a" onClick={()=>nav("/")}>← Voltar ao site</button></div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({onViewP}){
  const[props,setProps]=useState(loadP);
  const[tab,setTab]=useState("dash");
  const[build,setBuild]=useState(false);
  const[edit,setEdit]=useState(null);
  const[toast,show]=useToast();
  const[emails]=useState(loadEmails);
  const list=Object.values(props).sort((a,b)=>b.id.localeCompare(a.id));
  const rev=list.reduce((s,p)=>s+p.total,0);
  const saveProposal=p=>{const nx={...props,[p.id]:p};setProps(nx);saveP(nx);setBuild(false);setEdit(null);show("Proposta salva!");};
  const delP=id=>{if(!confirm("Excluir esta proposta?"))return;const nx={...props};delete nx[id];setProps(nx);saveP(nx);show("Removida","err")};
  const copyL=id=>{navigator.clipboard.writeText(`${window.location.origin}/?proposta=${id}`).then(()=>show("Link copiado!"))};
  const updStatus=(id,status)=>{const nx={...props,[id]:{...props[id],status}};setProps(nx);saveP(nx);show("Status atualizado!")};
  const logout=()=>{setAuth(false);window.location.reload()};
  const statusBadge=s=>{
    const m={active:{cls:"active",l:"Enviada"},viewed:{cls:"viewed",l:"Visualizada"},accepted:{cls:"accepted",l:"Aceita"}};
    return m[s]||m.active;
  };
  return(
    <div className="adm-wrap">
      {toast&&<div className={`toast${toast.tp==="err"?" err":""}`}>{toast.m}</div>}
      {build&&<BuilderModal init={edit} onClose={()=>{setBuild(false);setEdit(null)}} onSave={saveProposal}/>}
      <aside className="sidebar">
        <div className="sb-logo">dois<span>E</span></div>
        <div className="sb-sec">Menu</div>
        <button className={`sb-item${tab==="dash"?" on":""}`} onClick={()=>setTab("dash")}><I n="ch" s={15}/> Dashboard</button>
        <button className={`sb-item${tab==="props"?" on":""}`} onClick={()=>setTab("props")}><I n="fi" s={15}/> Propostas</button>
        <button className={`sb-item${tab==="emails"?" on":""}`} onClick={()=>setTab("emails")}><I n="mg" s={15}/> Leads <span style={{marginLeft:"auto",background:"var(--lbg)",border:"1px solid var(--lborder)",borderRadius:100,padding:"1px 7px",fontSize:10,color:"var(--lilac)"}}>{emails.length}</span></button>
        <div className="sb-bot">
          <div className="sb-sec">Ações</div>
          <button className="sb-item" onClick={()=>nav("/")}><I n="ho" s={15}/> Ver site</button>
          <button className="sb-item" style={{color:"#ef4444"}} onClick={logout}><I n="lo" s={15}/> Sair</button>
        </div>
      </aside>
      <main className="adm-main">
        {tab==="dash"&&(<>
          <div className="adm-hd">
            <div><div className="adm-title">Dashboard</div><div className="adm-sub">Visão geral das suas propostas e leads</div></div>
            <button className="btn-lilac btn-sm" onClick={()=>{setEdit(null);setBuild(true)}}><I n="pl" s={14}/> Nova Proposta</button>
          </div>
          <div className="stat-cards">
            {[{i:"fi",v:list.length,l:"Total propostas"},{i:"dl",v:fmt(rev),l:"Volume gerado"},{i:"mg",v:emails.length,l:"Leads capturados"},{i:"ck",v:list.filter(p=>p.status==="accepted").length,l:"Propostas aceitas"}].map((s,i)=>(
              <div key={i} className="sc"><div className="sc-ic"><I n={s.i} s={17}/></div><div className="sc-val">{s.v}</div><div className="sc-lbl">{s.l}</div></div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"var(--serif)",fontSize:20,fontStyle:"italic"}}>Propostas recentes</div>
            <button className="nav-a" style={{color:"var(--lilac)",fontSize:13}} onClick={()=>setTab("props")}>Ver todas →</button>
          </div>
          <div className="ptable">
            <div className="pt-hd"><div>Cliente</div><div>Headline</div><div>Data</div><div>Total</div><div>Status</div><div>Ações</div></div>
            {list.slice(0,5).map(p=>{const sb=statusBadge(p.status);return(
              <div key={p.id} className="pt-row">
                <div><div className="pt-client">{p.clientName||"—"}</div></div>
                <div><div className="pt-hl">{p.headline||"—"}</div></div>
                <div className="pt-date">{p.createdAt}</div>
                <div className="pt-total">{fmt(p.total)}</div>
                <div><span className={`badge ${sb.cls}`}>{sb.l}</span></div>
                <div className="pt-acts">
                  <button className="btn-icon" onClick={()=>copyL(p.id)} title="Copiar link"><I n="cp" s={13}/></button>
                  <button className="btn-icon" onClick={()=>onViewP(p.id)} title="Visualizar"><I n="ey" s={13}/></button>
                </div>
              </div>
            )})}
            {!list.length&&<div style={{padding:"48px",textAlign:"center",color:"var(--w60)",fontSize:14}}>Nenhuma proposta ainda.<br/><button className="btn-lilac btn-sm" style={{marginTop:16}} onClick={()=>setBuild(true)}><I n="pl" s={14}/> Criar agora</button></div>}
          </div>
          {emails.length>0&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"28px 0 16px"}}>
              <div style={{fontFamily:"var(--serif)",fontSize:20,fontStyle:"italic"}}>Últimos leads</div>
              <button className="nav-a" style={{color:"var(--lilac)",fontSize:13}} onClick={()=>setTab("emails")}>Ver todos →</button>
            </div>
            <div className="emails-table">
              <div className="em-hd"><div>E-mail</div><div>Nome</div><div>Data</div></div>
              {emails.slice(-3).reverse().map((e,i)=><div key={i} className="em-row"><div>{e.email}</div><div style={{color:"var(--w60)"}}>{e.nome||"—"}</div><div style={{color:"var(--w60)"}}>{e.date}</div></div>)}
            </div>
          </>}
        </>)}
        {tab==="props"&&(<>
          <div className="adm-hd">
            <div><div className="adm-title">Propostas</div><div className="adm-sub">{list.length} proposta{list.length!==1?"s":""}</div></div>
            <button className="btn-lilac btn-sm" onClick={()=>{setEdit(null);setBuild(true)}}><I n="pl" s={14}/> Nova Proposta</button>
          </div>
          <div className="ptable">
            <div className="pt-hd"><div>Cliente</div><div>Headline</div><div>Data</div><div>Total</div><div>Status</div><div>Ações</div></div>
            {list.map(p=>{const sb=statusBadge(p.status);return(
              <div key={p.id} className="pt-row">
                <div><div className="pt-client">{p.clientName||"—"}</div></div>
                <div><div className="pt-hl">{p.headline||"—"}</div></div>
                <div className="pt-date">{p.createdAt}</div>
                <div className="pt-total">{fmt(p.total)}</div>
                <div>
                  <select style={{background:"var(--ink3)",border:"1px solid rgba(255,255,255,.1)",color:"var(--w)",borderRadius:8,padding:"4px 8px",fontSize:12,cursor:"pointer",fontFamily:"var(--sans)"}} value={p.status||"active"} onChange={e=>updStatus(p.id,e.target.value)}>
                    <option value="active">Enviada</option>
                    <option value="viewed">Visualizada</option>
                    <option value="accepted">Aceita</option>
                  </select>
                </div>
                <div className="pt-acts">
                  <button className="btn-icon" onClick={()=>copyL(p.id)} title="Copiar link"><I n="cp" s={13}/></button>
                  <button className="btn-icon" onClick={()=>onViewP(p.id)} title="Visualizar"><I n="ey" s={13}/></button>
                  <button className="btn-icon" onClick={()=>{setEdit(p);setBuild(true)}} title="Editar"><I n="ed" s={13}/></button>
                  <button className="btn-icon del" onClick={()=>delP(p.id)} title="Excluir"><I n="tr" s={13}/></button>
                </div>
              </div>
            )})}
            {!list.length&&<div style={{padding:"64px",textAlign:"center",color:"var(--w60)",fontSize:14}}>Nenhuma proposta criada.<br/><button className="btn-lilac btn-sm" style={{marginTop:16}} onClick={()=>setBuild(true)}><I n="pl" s={14}/> Criar primeira</button></div>}
          </div>
        </>)}
        {tab==="emails"&&(<>
          <div className="adm-hd">
            <div><div className="adm-title">Leads</div><div className="adm-sub">{emails.length} lead{emails.length!==1?"s":""} capturado{emails.length!==1?"s":""}</div></div>
            <button className="btn-outline btn-sm" onClick={()=>{const csv="Email,Nome,Data\n"+emails.map(e=>`${e.email},${e.nome||""},${e.date}`).join("\n");const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="leads-doise.csv";a.click();}} ><I n="fi" s={14}/> Exportar CSV</button>
          </div>
          <div className="emails-table">
            <div className="em-hd"><div>E-mail</div><div>Nome</div><div>Data</div></div>
            {[...emails].reverse().map((e,i)=><div key={i} className="em-row"><div>{e.email}</div><div style={{color:"var(--w60)"}}>{e.nome||"—"}</div><div style={{color:"var(--w60)"}}>{e.date}</div></div>)}
            {!emails.length&&<div style={{padding:"48px",textAlign:"center",color:"var(--w60)"}}>Nenhum lead ainda. Eles aparecerão aqui quando alguém baixar o checklist.</div>}
          </div>
        </>)}
      </main>
    </div>
  );
}

// ── PROPOSAL VIEW ─────────────────────────────────────────────────────────────
function ProposalView({id,onBack}){
  const p=loadP()[id];
  const[cp,setCp]=useState(false);
  useEffect(()=>{
    window.scrollTo(0,0);
    if(p){const ps=loadP();ps[id]={...ps[id],status:"viewed"};saveP(ps);}
  },[id]);
  const copy=()=>{navigator.clipboard.writeText(window.location.href);setCp(true);setTimeout(()=>setCp(false),2000)};

  if(!p) return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:16,padding:24,background:"var(--ink)"}}>
      <div style={{fontFamily:"var(--serif)",fontSize:24,fontStyle:"italic"}}>Proposta não encontrada</div>
      <div style={{fontSize:14,color:"var(--w60)"}}>O link pode ter expirado ou sido removido.</div>
      <button className="btn-outline btn-sm" onClick={onBack}>← Voltar</button>
    </div>
  );

  const total=p.total||p.items?.reduce((s,it)=>s+(parseFloat(it.p)||0)*(parseInt(it.q)||1),0)||0;

  const S={
    wrap:{minHeight:"100vh",background:"var(--ink)",fontFamily:"var(--sans)"},
    // NAV
    nav:{position:"sticky",top:0,background:"rgba(10,10,10,.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.07)",padding:"14px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:50},
    navLogo:{fontFamily:"var(--serif)",fontSize:20,fontStyle:"italic",color:"var(--w)",background:"none",border:"none",cursor:"pointer"},
    navActs:{display:"flex",gap:10},
    // HERO
    hero:{background:"linear-gradient(160deg,#0d0d0d 0%,#130a1f 60%,#0d0d0d 100%)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"72px 40px 64px",textAlign:"center",position:"relative",overflow:"hidden"},
    heroBg:{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 70% at 50% 0%,rgba(180,127,232,.12) 0%,transparent 70%)",pointerEvents:"none"},
    heroBadge:{display:"inline-flex",alignItems:"center",gap:8,background:"var(--lbg)",border:"1px solid var(--lborder)",borderRadius:100,padding:"5px 16px",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--lilac)",marginBottom:32},
    heroDot:{width:6,height:6,background:"var(--lilac)",borderRadius:"50%"},
    heroTo:{fontSize:11,color:"var(--w60)",letterSpacing:2,textTransform:"uppercase",marginBottom:10},
    heroClient:{fontFamily:"var(--serif)",fontSize:"clamp(44px,7vw,80px)",fontWeight:400,lineHeight:1,letterSpacing:-2,marginBottom:16},
    heroHeadline:{fontSize:"clamp(15px,2vw,20px)",color:"var(--lilac2)",fontFamily:"var(--serif)",fontStyle:"italic",marginBottom:24,lineHeight:1.4},
    heroMeta:{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap",marginBottom:32},
    heroMetaItem:{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"var(--w60)"},
    heroMetaDot:{width:4,height:4,background:"var(--lilac)",borderRadius:"50%"},
    heroBy:{fontSize:12,color:"var(--w60)",marginTop:8},
    // SECTION
    sec:{padding:"60px 40px",maxWidth:900,margin:"0 auto"},
    secNum:{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--lilac)",display:"flex",alignItems:"center",gap:10,marginBottom:14},
    secNumLine:{width:20,height:1,background:"var(--lilac)"},
    secTitle:{fontFamily:"var(--serif)",fontSize:"clamp(26px,3.5vw,40px)",fontWeight:400,letterSpacing:-1,marginBottom:8},
    secDesc:{fontSize:14,color:"var(--w60)",lineHeight:1.85,marginBottom:32},
    divider:{height:1,background:"rgba(255,255,255,.06)",margin:"0"},
    // ITEMS GRID
    itemsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginTop:24},
    itemCard:{background:"var(--ink2)",border:"1px solid rgba(255,255,255,.07)",borderRadius:14,padding:"18px 20px",display:"flex",gap:12,alignItems:"flex-start"},
    itemDot:{width:6,height:6,background:"var(--lilac)",borderRadius:"50%",marginTop:7,flexShrink:0},
    itemName:{fontSize:13,lineHeight:1.6,flex:1},
    itemPrice:{fontSize:12,color:"var(--lilac2)",fontFamily:"var(--serif)",fontStyle:"italic",marginTop:4},
    // TIMELINE
    timeline:{display:"flex",flexDirection:"column",gap:0,marginTop:28,position:"relative"},
    tlItem:{display:"flex",gap:20,position:"relative",paddingBottom:32},
    tlLine:{position:"absolute",left:15,top:32,bottom:0,width:1,background:"rgba(180,127,232,.2)"},
    tlDot:{width:32,height:32,borderRadius:"50%",background:"var(--lbg)",border:"2px solid var(--lborder)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"var(--lilac)",flexShrink:0,zIndex:1},
    tlBody:{flex:1,paddingTop:4},
    tlTitle:{fontSize:15,fontWeight:600,marginBottom:4},
    tlDesc:{fontSize:13,color:"var(--w60)",lineHeight:1.75},
    // INVESTMENT
    invWrap:{background:"var(--ink2)",border:"1px solid rgba(255,255,255,.07)",borderRadius:20,overflow:"hidden"},
    invTop:{padding:"36px 36px 28px",borderBottom:"1px solid rgba(255,255,255,.06)"},
    invLabel:{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--w60)",marginBottom:8},
    invVal:{fontFamily:"var(--serif)",fontSize:"clamp(48px,7vw,80px)",fontStyle:"italic",color:"var(--lilac2)",lineHeight:1,letterSpacing:-2},
    invGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0},
    invCol:{padding:"28px 36px"},
    invColTitle:{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--lilac)",marginBottom:16},
    inclItem:{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)"},
    inclDot:{width:16,height:16,borderRadius:"50%",background:"var(--lbg)",border:"1px solid var(--lborder)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2},
    inclDotInner:{width:5,height:5,borderRadius:"50%",background:"var(--lilac)"},
    inclText:{fontSize:13,color:"var(--w60)",lineHeight:1.6},
    payItem:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,.05)"},
    payLabel:{fontSize:13,color:"var(--w60)"},
    payVal:{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:18,color:"var(--lilac2)"},
    // CTA
    ctaWrap:{background:"linear-gradient(135deg,#130a1f 0%,#0d0d0d 100%)",borderTop:"1px solid rgba(255,255,255,.06)",padding:"64px 40px",textAlign:"center"},
    ctaTitle:{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,48px)",fontStyle:"italic",fontWeight:400,marginBottom:16,lineHeight:1.15},
    ctaDesc:{fontSize:15,color:"var(--w60)",marginBottom:36,lineHeight:1.8,maxWidth:480,margin:"0 auto 36px"},
    ctaBtns:{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"},
    // FOOTER
    pvFooter:{padding:"24px 40px",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12},
    pvFooterText:{fontSize:11,color:"rgba(255,255,255,.25)"},
  };

  return(
    <div style={S.wrap}>
      {/* NAV */}
      <nav style={S.nav}>
        <button style={S.navLogo} onClick={onBack}>dois<span style={{color:"var(--lilac)",fontStyle:"normal"}}>E</span></button>
        <div style={S.navActs}>
          <button className="btn-outline btn-sm" onClick={copy}><I n="cp" s={13}/>{cp?"Copiado!":"Copiar link"}</button>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="btn-lilac btn-sm" style={{textDecoration:"none"}}><I n="wa" s={14}/> Aceitar</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={S.hero}>
        <div style={S.heroBg}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={S.heroBadge}><div style={S.heroDot}/> Proposta Exclusiva</div>
          <div style={S.heroTo}>Apresentado para</div>
          <div style={S.heroClient}>{p.clientName||"Cliente"}</div>
          {p.headline&&<div style={S.heroHeadline}>{p.headline}</div>}
          <div style={S.heroMeta}>
            <div style={S.heroMetaItem}><div style={S.heroMetaDot}/>{p.createdAt}</div>
            {p.validity&&<div style={S.heroMetaItem}><div style={S.heroMetaDot}/>Válido por {p.validity} dias</div>}
            <div style={S.heroMetaItem}><div style={S.heroMetaDot}/>{p.items?.length||0} entregáveis</div>
          </div>
          <div style={S.heroBy}>Apresentado por <strong style={{color:"var(--lilac)",fontFamily:"var(--serif)",fontStyle:"italic"}}>doisE Agency</strong></div>
        </div>
      </div>

      {/* ESCOPO */}
      <div style={S.divider}/>
      <div style={S.sec}>
        <div style={S.secNum}><div style={S.secNumLine}/>Seção 01</div>
        <div style={S.secTitle}>Escopo e Entregáveis</div>
        <div style={S.secDesc}>Tudo o que está incluído nesta proposta — cada item acordado e detalhado abaixo.</div>
        <div style={S.itemsGrid}>
          {p.items?.map((it,i)=>(
            <div key={i} style={S.itemCard}>
              <div style={S.itemDot}/>
              <div>
                <div style={S.itemName}>{it.d||`Item ${i+1}`}{it.q>1&&<span style={{color:"var(--w60)",fontSize:11,marginLeft:6}}>× {it.q}</span>}</div>
                {it.p&&<div style={S.itemPrice}>{fmt((parseFloat(it.p)||0)*(parseInt(it.q)||1))}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRONOGRAMA — só se tiver notes */}
      {p.notes&&<>
        <div style={S.divider}/>
        <div style={S.sec}>
          <div style={S.secNum}><div style={S.secNumLine}/>Seção 02</div>
          <div style={S.secTitle}>Observações</div>
          <div style={{...S.invWrap,padding:"28px 32px"}}>
            <div style={{fontSize:15,color:"var(--w60)",lineHeight:1.9,fontFamily:"var(--serif)",fontStyle:"italic"}}>{p.notes}</div>
          </div>
        </div>
      </>}

      {/* INVESTIMENTO */}
      <div style={S.divider}/>
      <div style={{...S.sec}}>
        <div style={S.secNum}><div style={S.secNumLine}/>Seção {p.notes?"03":"02"}</div>
        <div style={S.secTitle}>Investimento e Condições</div>
        <div style={S.secDesc}>Valores e formas de pagamento acordados para este projeto.</div>
        <div style={S.invWrap}>
          <div style={S.invTop}>
            <div style={S.invLabel}>Valor total do investimento</div>
            <div style={S.invVal}>{fmt(total)}</div>
          </div>
          <div style={{...S.invGrid,gridTemplateColumns:p.payment?.length?"1fr 1fr":"1fr"}}>
            <div style={{...S.invCol,borderRight:p.payment?.length?"1px solid rgba(255,255,255,.06)":"none"}}>
              <div style={S.invColTitle}>O que está incluso</div>
              {p.items?.map((it,i)=>(
                <div key={i} style={S.inclItem}>
                  <div style={S.inclDot}><div style={S.inclDotInner}/></div>
                  <div style={S.inclText}>{it.d}{it.q>1?` (× ${it.q})`:""}</div>
                </div>
              ))}
            </div>
            {p.payment?.length>0&&(
              <div style={S.invCol}>
                <div style={S.invColTitle}>Condições de Pagamento</div>
                {p.payment.map((py,i)=>(
                  <div key={i} style={S.payItem}>
                    <div style={S.payLabel}>{py.l}</div>
                    <div style={S.payVal}>{fmt(py.v)}</div>
                  </div>
                ))}
                {p.validity&&(
                  <div style={{marginTop:20,background:"var(--lbg)",border:"1px solid var(--lborder)",borderRadius:10,padding:"12px 16px",fontSize:12,color:"var(--w60)"}}>
                    ⏳ Proposta válida por <strong style={{color:"var(--w)"}}>{p.validity} dias</strong> a partir de {p.createdAt}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={S.ctaWrap}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={S.ctaTitle}>Vamos transformar sua<br/>marca em realidade?</div>
          <div style={S.ctaDesc}>Esta proposta foi preparada exclusivamente para {p.clientName||"você"}. Estamos prontos para começar assim que der o sinal.</div>
          <div style={S.ctaBtns}>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="btn-dark" style={{textDecoration:"none"}}><I n="wa" s={16}/> Aceitar via WhatsApp</a>
            <button className="btn-outline" onClick={copy}><I n="cp" s={15}/>{cp?"Copiado!":"Copiar link"}</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={S.pvFooter}>
        <div style={S.pvFooterText}>doisE Agency · @ag.doise · Proposta gerada em {p.createdAt}</div>
        <div style={S.pvFooterText}>© {new Date().getFullYear()} doisE Agency</div>
      </div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage(){
  const[stuck,setStuck]=useState(false);
  const[sent,setSent]=useState(false);
  const[form,setForm]=useState({n:"",e:"",em:"",m:""});
  const[showPopup,setShowPopup]=useState(false);
  useEffect(()=>{
    const h=()=>setStuck(window.scrollY>60);
    window.addEventListener("scroll",h);
    const t=setTimeout(()=>setShowPopup(true),12000);
    return()=>{window.removeEventListener("scroll",h);clearTimeout(t)};
  },[]);
  const scroll=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const ticks=["Social Media","Conteúdo","Estratégia","Resultados","Engajamento","Identidade"];

  return(
    <>
      {showPopup&&<LeadPopup onClose={()=>setShowPopup(false)}/>}

      {/* WA FLOAT */}
      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="wa-float">
        <div className="wa-tooltip">Fale conosco agora</div>
        <I n="wa" s={24}/>
      </a>

      {/* NAV */}
      <nav className={`nav${stuck?" stuck":""}`}>
        <button className="nav-logo">dois<span>E</span></button>
        <div className="nav-links">
          <button className="nav-a" onClick={()=>scroll("servicos")}>Serviços</button>
          <button className="nav-a" onClick={()=>scroll("processo")}>Processo</button>
          <button className="nav-a" onClick={()=>scroll("cases")}>Cases</button>
          <button className="nav-a" onClick={()=>nav("/blog")}>Blog</button>
          <button className="nav-a" onClick={()=>scroll("sobre")}>Sobre</button>
          <button className="nav-btn" onClick={()=>scroll("contato")}>Falar conosco</button>
        </div>
      </nav>

      {/* TICKER */}
      <div className="ticker" style={{marginTop:64}}>
        <div className="ticker-inner">
          {[...ticks,...ticks,...ticks,...ticks].map((t,i)=>(
            <span key={i} className="ticker-item">{t}<span style={{opacity:.4,padding:"0 4px"}}> ✦ </span></span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-noise"/><div className="hero-orb"/><div className="hero-orb2"/>
        <div className="hero-deco">doisE</div>

        {/* top bar */}
        <div className="hero-topbar">
          <div className="hero-topbar-tag">Agência de Social Media</div>
          <div className="hero-topbar-right">
            <strong>©{new Date().getFullYear()}</strong>
            Piracaia, SP — Brasil
          </div>
        </div>

        {/* giant title */}
        <div className="hero-title-wrap">
          <h1 className="hero-h1">
            <span className="line1">Sua marca</span>
            <span className="line2">no lugar</span>
            <span className="line3">certo.</span>
          </h1>
        </div>

        {/* bottom bar */}
        <div className="hero-bottom">
          <p className="hero-sub">Estratégia, conteúdo e gestão de redes sociais para marcas que querem crescer de verdade — com consistência e resultado que aparece nos números.</p>
          <div className="hero-cta-center">
            <button className="btn-dark" onClick={()=>scroll("contato")}>Quero crescer <I n="ar" s={16}/></button>
            <div className="hero-scroll-hint">
              <div className="hero-scroll-line"/>
              scroll
            </div>
          </div>
          <div className="hero-stats-right">
            <div className="hero-stat"><div className="hero-stat-n"><Counter end={50} suffix="+"/></div><div className="hero-stat-l">clientes ativos</div></div>
            <div className="hero-stat"><div className="hero-stat-n"><Counter end={98} suffix="%"/></div><div className="hero-stat-l">satisfação</div></div>
            <div className="hero-stat"><div className="hero-stat-n"><Counter end={3} suffix="M+"/></div><div className="hero-stat-l">impressões/mês</div></div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <div className="logos-band">
        <div className="logos-band-label">Algumas marcas que confiam na doisE</div>
        <div className="logos-track">
          <div className="logos-inner">
            {[...LOGOS,...LOGOS].map((l,i)=><div key={i} className="logo-item">{l}</div>)}
          </div>
        </div>
      </div>

      {/* SERVICES — cream bg, Uncode numbered cards */}
      <section className="sec sec-cream" id="servicos" style={{position:"relative",overflow:"hidden"}}>
        {/* floating stickers */}
        <div className="stk stk-star" style={{top:32,right:64,transform:"rotate(12deg)",opacity:.7,fontSize:9}}><span style={{textAlign:"center",lineHeight:1.2,padding:6}}>Resultados<br/>reais</span></div>
        <div className="stk stk-circle" style={{bottom:60,right:120}}>→</div>

        <div style={{position:"relative",marginBottom:52}}>
          <div className="svc-big-num">06</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:40,flexWrap:"wrap"}}>
            <div>
              <div className="sec-label sec-label-dark">O que fazemos</div>
              <h2 className="sec-h2 sec-h2-dark">Serviços que <em>geram resultado</em></h2>
            </div>
            <p className="svc-intro">Cada serviço foi pensado para entregar resultado real — não apenas métricas de vaidade.</p>
          </div>
        </div>

        <div className="svc-two-col">
          <div className="svc-list">
            {SVCS.slice(0,3).map((s,i)=>(
              <button key={i} className="svc-row" onClick={()=>nav(`/?servico=${s.slug}`)}>
                <div className="svc-badge">0{i+1}</div>
                <div className="svc-row-body">
                  <div className="svc-row-name">{s.n}</div>
                  <div className="svc-row-desc">{s.d.substring(0,52)}…</div>
                </div>
                <I n="ar" s={18} className="svc-row-arrow"/>
              </button>
            ))}
          </div>
          <div className="svc-list">
            {SVCS.slice(3).map((s,i)=>(
              <button key={i} className="svc-row" onClick={()=>nav(`/?servico=${s.slug}`)}>
                <div className="svc-badge">0{i+4}</div>
                <div className="svc-row-body">
                  <div className="svc-row-name">{s.n}</div>
                  <div className="svc-row-desc">{s.d.substring(0,52)}…</div>
                </div>
                <I n="ar" s={18} className="svc-row-arrow"/>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — cream bg, Uncode big number style */}
      <section className="sec sec-cream" id="processo" style={{borderTop:"1px solid rgba(10,10,10,.08)"}}>
        <div className="process-intro">
          <div>
            <div className="sec-label sec-label-dark">Como trabalhamos</div>
            <h2 className="sec-h2 sec-h2-dark">Processo <em>transparente</em>,<br/>resultado previsível</h2>
          </div>
          <p style={{fontSize:14,color:"rgba(10,10,10,.5)",maxWidth:300,lineHeight:1.85,paddingBottom:4}}>Do primeiro briefing ao relatório mensal — você sabe exatamente o que está acontecendo em cada etapa.</p>
        </div>
        <div className="process-grid">
          {[
            {n:"01",t:"Diagnóstico",d:"Analisamos sua presença atual, concorrência e público. Sem achismo — só dados."},
            {n:"02",t:"Estratégia",d:"Definimos posicionamento, canais, tom de voz e plano de conteúdo personalizado."},
            {n:"03",t:"Produção",d:"Criamos artes, copies e vídeos alinhados à identidade. Você aprova antes de publicar."},
            {n:"04",t:"Análise",d:"Monitoramos métricas em tempo real e entregamos report mensal com próximos passos."},
          ].map((s,i)=>(
            <div key={i} className="proc-card">
              <span className="proc-tag">{s.n}</span>
              <div className="proc-num">{s.n}</div>
              <div className="proc-title">{s.t}</div>
              <div className="proc-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE — dark bg, lilás accent */}
      <div className="marquee-sec" style={{background:"var(--ink)",borderTop:"1px solid rgba(255,255,255,.05)",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div className="marquee-track"><div className="marquee-inner">
          {[...Array(2)].flatMap(()=>["Social Media","✦","Conteúdo","✦","Estratégia","✦","Resultados","✦","Engajamento","✦","Identidade","✦"]).map((t,i)=>(
            <span key={i} className={`marquee-item${t==="✦"?" accent":""}`}>{t}</span>
          ))}
        </div></div>
      </div>

      {/* CASES — dark bg editorial */}
      <section className="sec" id="cases" style={{background:"var(--ink2)"}}>
        <div className="cases-header">
          <div><div className="sec-label">Cases</div><h2 className="sec-h2">Resultados que <em>falam por si</em></h2></div>
          <div style={{fontSize:13,color:"var(--w60)",maxWidth:260,lineHeight:1.7,textAlign:"right"}}>Marcas que cresceram de verdade com estratégia e consistência.</div>
        </div>
        <div className="cases-grid">
          {CASES.map((c,i)=>(
            <div key={i} className="case-card">
              <div className="case-visual">
                <div className="case-visual-bg" style={{background:c.g,position:"absolute",inset:0}}/>
                <div className="case-overlay"/>
                <div className="case-big-num">0{i+1}</div>
                <div className="case-tag-vis" style={{position:"relative",zIndex:1}}>{c.tags.join(" · ")}</div>
              </div>
              <div className="case-body">
                <div className="case-client">{c.cl}</div>
                <div className="case-title">{c.t}</div>
                <div className="case-desc">{c.d}</div>
                <div className="case-meta">{c.stats.map((s,j)=><span key={j} className="case-stat">{s}</span>)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* BEFORE/AFTER — within dark section */}
        <div style={{marginTop:72}}>
          <div><div className="sec-label">Antes & Depois</div><h2 className="sec-h2">Veja a <em>transformação</em> na prática</h2></div>
          <div className="ba-grid">
            {BA.map((b,i)=>(
              <div key={i} className="ba-card">
                <div className="ba-visual">
                  <div className="ba-before">
                    <span className="ba-label b">Antes</span>
                    <div style={{textAlign:"center"}}><div className="ba-num" style={{color:"rgba(255,255,255,.35)"}}>{b.bv}</div><div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:4}}>{b.bl}</div></div>
                  </div>
                  <div className="ba-arrow">→</div>
                  <div className="ba-after">
                    <span className="ba-label a">Depois</span>
                    <div style={{textAlign:"center"}}><div className="ba-num" style={{color:"var(--lilac2)"}}>{b.av}</div><div style={{fontSize:10,color:"var(--lilac)",marginTop:4}}>{b.al}</div></div>
                  </div>
                </div>
                <div className="ba-body">
                  <div className="ba-seg">{b.seg}</div>
                  <div className="ba-name">{b.n}</div>
                  <div className="ba-period">{b.period} de trabalho</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="sec sec-cream" id="sobre">
        <div className="about-grid">
          <div>
            <div className="sec-label sec-label-dark">Sobre nós</div>
            <h2 className="sec-h2 sec-h2-dark">Feita para marcas que não querem ser <em>medianas</em></h2>
            <p style={{fontSize:15,color:"rgba(10,10,10,.6)",lineHeight:1.85,marginBottom:16}}>A doisE nasceu da vontade de fazer social media com propósito. Combinamos estratégia, criatividade e análise de dados para entregar presença digital que converte.</p>
            <p style={{fontSize:15,color:"rgba(10,10,10,.6)",lineHeight:1.85}}>Cada projeto começa com escuta ativa e termina com resultados que aparecem nos números. Somos parceiros, não fornecedores.</p>
            <div className="about-vals">
              {[{t:"Estratégia Real",d:"Cada post tem um porquê. Planejamos com objetivo claro."},{t:"Dados + Criatividade",d:"Decisões baseadas em métricas, entregues com identidade."},{t:"Transparência",d:"Reports completos todo mês, sem surpresas."},{t:"Parceria",d:"Crescemos junto com você. Seu sucesso é o nosso."}].map((v,i)=>(
                <div key={i} className="about-val"><div className="about-val-t">{v.t}</div><div className="about-val-d">{v.d}</div></div>
              ))}
            </div>
          </div>
          <div>
      {/* ABOUT — cream with stickers */}
      <section className="sec sec-cream" id="sobre" style={{position:"relative",overflow:"hidden"}}>
        {/* stickers */}
        <div className="stk stk-star" style={{bottom:48,left:52,transform:"rotate(-15deg)",opacity:.65,fontSize:8}}><span style={{textAlign:"center",lineHeight:1.2,padding:4}}>Social<br/>Media</span></div>
        <div className="stk stk-pill" style={{top:60,right:80,transform:"rotate(6deg)"}}><span>Estratégia<br/>+ Criatividade</span></div>

        <div className="about-grid">
          <div>
            <div className="sec-label sec-label-dark">Sobre nós</div>
            <h2 className="sec-h2 sec-h2-dark">Feita para marcas que não querem ser <em>medianas</em></h2>
            <p style={{fontSize:15,color:"rgba(10,10,10,.6)",lineHeight:1.85,marginBottom:16}}>A doisE nasceu da vontade de fazer social media com propósito. Combinamos estratégia, criatividade e análise de dados para entregar presença digital que converte.</p>
            <p style={{fontSize:15,color:"rgba(10,10,10,.6)",lineHeight:1.85}}>Cada projeto começa com escuta ativa e termina com resultados que aparecem nos números. Somos parceiros, não fornecedores.</p>
            <div className="about-vals">
              {[{t:"Estratégia Real",d:"Cada post tem um porquê. Planejamos com objetivo claro."},{t:"Dados + Criatividade",d:"Decisões baseadas em métricas, entregues com identidade."},{t:"Transparência",d:"Reports completos todo mês, sem surpresas."},{t:"Parceria",d:"Crescemos junto com você. Seu sucesso é o nosso."}].map((v,i)=>(
                <div key={i} className="about-val"><div className="about-val-t">{v.t}</div><div className="about-val-d">{v.d}</div></div>
              ))}
            </div>
          </div>
          <div>
            <div className="about-block">
              <div className="about-big">dois<span>E</span></div>
              <div className="about-sub-role">Agência de Social Media</div>
              <div className="about-bio">Especialistas em transformar marcas em referências digitais. Do planejamento à execução, somos seus parceiros em cada etapa — com estratégia, criatividade e dados.</div>
              <div className="about-stats">
                <div><div className="about-stat-n"><Counter end={50} suffix="+"/></div><div className="about-stat-l">Clientes atendidos</div></div>
                <div><div className="about-stat-n"><Counter end={4} suffix="+"/></div><div className="about-stat-l">Anos de mercado</div></div>
                <div><div className="about-stat-n"><Counter end={98} suffix="%"/></div><div className="about-stat-l">Satisfação</div></div>
              </div>
              <div style={{marginTop:28,display:"flex",gap:10}}>{["ig","tk","li"].map(s=><button key={s} className="footer-soc"><I n={s} s={15}/></button>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — cream bg with Uncode card style */}
      <section className="sec sec-cream" style={{borderTop:"1px solid rgba(10,10,10,.08)",paddingTop:72,position:"relative",overflow:"hidden"}}>
        <div className="stk stk-star" style={{top:24,right:40,transform:"rotate(20deg)",opacity:.55,fontSize:8}}><span style={{textAlign:"center",lineHeight:1.2,padding:4}}>+50<br/>clientes</span></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,gap:40,flexWrap:"wrap"}}>
          <div><div className="sec-label sec-label-dark">Depoimentos</div><h2 className="sec-h2 sec-h2-dark">O que nossos <em>clientes</em> dizem</h2></div>
          <p style={{fontSize:14,color:"rgba(10,10,10,.55)",lineHeight:1.8,maxWidth:260}}>Histórias reais de quem escolheu crescer com estratégia.</p>
        </div>
        <div className="test-grid">
          {TESTS.map((t,i)=>(
            <div key={i} className="test-card">
              <div style={{display:"flex",gap:3,marginBottom:16,color:"var(--lilac3)"}}>{[1,2,3,4,5].map(s=><I key={s} n="st" s={13}/>)}</div>
              <div className="test-quote">"{t.q}"</div>
              <div className="test-author">
                <div className="test-av">{t.n[0]}</div>
                <div><div className="test-name">{t.n}</div><div className="test-co">{t.c}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="sec sec-ink2">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:0,flexWrap:"wrap",gap:16}}>
          <div><div className="sec-label">Blog</div><h2 className="sec-h2">Conteúdo que <em>educa</em> e converte</h2></div>
          <button className="btn-outline btn-sm" onClick={()=>nav("/blog")}>Ver todos os artigos <I n="ar" s={14}/></button>
        </div>
        <div className="blog-grid">
          {POSTS.slice(0,3).map((p,i)=>(
            <div key={i} className="blog-card">
              <div className="blog-img" style={{position:"relative"}}>
                <div className="blog-img-bg" style={{background:p.g,position:"absolute",inset:0}}/>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"var(--serif)",fontSize:32,fontStyle:"italic",color:"rgba(255,255,255,.07)"}}>doisE</span></div>
              </div>
              <div className="blog-body">
                <span className="blog-tag">{p.tag}</span>
                <div className="blog-title">{p.t}</div>
                <div className="blog-excerpt">{p.exc}</div>
                <div className="blog-meta"><span>{p.date}</span><span>{p.read} leitura</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="sec sec-cream" id="faq">
        <div><div className="sec-label sec-label-dark">FAQ</div><h2 className="sec-h2 sec-h2-dark">Dúvidas? Temos as <em>respostas</em></h2></div>
        <div className="faq-grid">
          <div className="faq-list">{FAQS.map((f,i)=><FaqItem key={i} q={f.q} a={f.a}/>)}</div>
          <div className="faq-cta">
            <div style={{fontFamily:"var(--serif)",fontSize:13,fontStyle:"italic",color:"var(--lilac)",marginBottom:8,letterSpacing:1,textTransform:"uppercase",fontSize:10,fontStyle:"normal",fontWeight:700}}>Ainda com dúvidas?</div>
            <div className="faq-cta-t">Converse com a gente sem compromisso</div>
            <div className="faq-cta-d">Nossa equipe responde em até 2 horas. Diagnóstico inicial sempre gratuito.</div>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="btn-lilac" style={{textDecoration:"none",justifyContent:"center"}}><I n="wa" s={16}/> Falar no WhatsApp</a>
            <div style={{marginTop:14,fontSize:12,color:"var(--w60)"}}>ou <button className="nav-a" style={{color:"var(--lilac)"}} onClick={()=>scroll("contato")}>preencha o formulário</button></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sec" id="contato">
        <div className="contact-wrap">
          <div>
            <div className="sec-label">Contato</div>
            <h2 className="sec-h2">Vamos construir algo <em>incrível</em> juntos?</h2>
            <p style={{fontSize:15,color:"var(--w60)",lineHeight:1.8,marginBottom:36,marginTop:16}}>Conta pra gente sobre o seu projeto. Respondemos em até 24h com um diagnóstico inicial sem custo.</p>
            {[{i:"wa",l:"WhatsApp",v:"(11) 9 9999-9999"},{i:"mg",l:"E-mail",v:"oi@doise.com.br"},{i:"ig",l:"Instagram",v:"@ag.doise"}].map((c,i)=>(
              <div key={i} className="contact-detail">
                <div className="contact-ic"><I n={c.i} s={16}/></div>
                <div><div className="contact-lbl">{c.l}</div><div className="contact-val">{c.v}</div></div>
              </div>
            ))}
          </div>
          <div>
            {sent?(
              <div className="contact-form-box" style={{textAlign:"center",padding:"64px 40px"}}>
                <div style={{fontFamily:"var(--serif)",fontSize:52,fontStyle:"italic",color:"var(--lilac2)",marginBottom:16}}>✓</div>
                <div style={{fontFamily:"var(--serif)",fontSize:24,fontStyle:"italic",marginBottom:10}}>Mensagem enviada!</div>
                <div style={{fontSize:14,color:"var(--w60)"}}>Retornamos em até 24h via e-mail ou WhatsApp.</div>
              </div>
            ):(
              <div className="contact-form-box">
                {[{f:"n",l:"Nome",p:"Seu nome completo"},{f:"e",l:"E-mail",p:"seu@email.com"},{f:"em",l:"Empresa",p:"Nome da empresa"}].map(({f,l,p})=>(
                  <div key={f} className="fl"><label>{l}</label><input className="fi" value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={p}/></div>
                ))}
                <div className="fl"><label>Mensagem</label><textarea className="fta" value={form.m} onChange={e=>setForm({...form,m:e.target.value})} placeholder="Conte um pouco sobre o seu projeto..."/></div>
                <button className="btn-lilac" style={{width:"100%",justifyContent:"center"}} onClick={()=>setSent(true)}>Enviar mensagem <I n="ar" s={15}/></button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand">dois<span>E</span></div>
            <div className="footer-tagline">Agência de social media para marcas que querem crescer com estratégia e identidade.</div>
            <div className="footer-socials">{["ig","tk","li"].map(s=><button key={s} className="footer-soc"><I n={s} s={15}/></button>)}</div>
          </div>
          <div>
            <div className="footer-col-title">Serviços</div>
            {SVCS.map((s,i)=><button key={i} className="footer-link" onClick={()=>nav(`/?servico=${s.slug}`)}>{s.n}</button>)}
          </div>
          <div>
            <div className="footer-col-title">Empresa</div>
            {[["Sobre nós","sobre"],["Cases","cases"],["Blog","blog"],["FAQ","faq"],["Contato","contato"]].map(([l,id],i)=>(
              <button key={i} className="footer-link" onClick={()=>id==="blog"?nav("/blog"):scroll(id)}>{l}</button>
            ))}
          </div>
          <div>
            <div className="footer-col-title">Contato</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:8}}>oi@doise.com.br</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:8}}>(11) 9 9999-9999</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:20}}>@ag.doise</div>
            <button className="btn-lilac btn-sm" onClick={()=>setShowPopup(true)}>📋 Checklist grátis</button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} doisE Agency. Todos os direitos reservados.</div>
          <div className="footer-copy">Feito com estratégia e propósito.</div>
        </div>
      </footer>
    </>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App(){
  const[route,setRoute]=useState(getRoute);
  const[auth,setAuth2]=useState(isAuth);
  const[vid,setVid]=useState(null);
  useEffect(()=>{
    injectCSS();
    const h=()=>{setRoute(getRoute());setVid(null)};
    window.addEventListener("popstate",h);
    return()=>window.removeEventListener("popstate",h);
  },[]);
  if(route.page==="proposal") return <ProposalView id={route.id} onBack={()=>{nav("/");setRoute({page:"home"})}}/>;
  if(route.page==="service") return <ServicePage slug={route.slug}/>;
  if(route.page==="blog") return <BlogPage/>;
  if(route.page==="admin"){
    if(!auth) return <AdminLogin onSuccess={()=>setAuth2(true)}/>;
    if(vid) return <ProposalView id={vid} onBack={()=>setVid(null)}/>;
    return <AdminPanel onViewP={id=>setVid(id)}/>;
  }
  return <HomePage/>;
}
