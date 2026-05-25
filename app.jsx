/**
 * SkillSwap — Full React Single-File App
 * ----------------------------------------
 * Stack: React 18 + Hooks (no external deps except lucide-react)
 * All pages, modals, state, routing, and styles in one file.
 *
 * Pages: Landing · Dashboard · Marketplace · Chat · Booking · Profile · Admin · Auth · Onboarding · 404
 * Features: Dark/Light toggle · Role picker (Learner/Earner) · Plan picker (Free/Regular/Advanced)
 *           Skill cards · Marketplace search/filter · Chat with simulated replies
 *           Calendar booking · Session requests · FAQ accordion · Contact form
 *           Toast notifications · Scroll animations · Animated hero · Gamification badges
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS (injected as a <style> tag at mount)
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --void:#030508;--night:#07090f;--deep:#0c0f1a;--dark:#111827;
  --card:#0f1520;--card2:#141d2e;--surface:#1a2240;
  --blue:#3b82f6;--blue-b:#60a5fa;--blue-d:#1d4ed8;
  --cyan:#06b6d4;--cyan-b:#22d3ee;
  --purple:#8b5cf6;--purple-b:#a78bfa;
  --green:#10b981;--green-b:#34d399;
  --amber:#f59e0b;--amber-b:#fbbf24;
  --rose:#f43f5e;
  --t1:#f8faff;--t2:#c8d6ef;--t3:#7b8db0;--t4:#3d4f6e;
  --border:rgba(255,255,255,.07);--border2:rgba(255,255,255,.13);
  --borderB:rgba(59,130,246,.25);
  --ff-disp:'Syne',sans-serif;--ff-body:'DM Sans',sans-serif;
  --r-sm:8px;--r-md:12px;--r-lg:18px;--r-xl:24px;--r-full:9999px;
  --ease-spring:cubic-bezier(.34,1.56,.64,1);
  --ease:cubic-bezier(.4,0,.2,1);
}
.light{
  --void:#f0f2f8;--night:#e8eaf4;--deep:#dde1ef;
  --card:#ffffff;--card2:#f4f6fb;--surface:#eef1fa;
  --border:rgba(0,0,0,.07);--border2:rgba(0,0,0,.12);--borderB:rgba(59,130,246,.3);
  --t1:#0d1221;--t2:#2d3a55;--t3:#5a6a8a;--t4:#8898bb;
}
html{scroll-behavior:smooth}
body{font-family:var(--ff-body);background:var(--void);color:var(--t1);overflow-x:hidden;-webkit-font-smoothing:antialiased;line-height:1.65}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--night)}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--blue),var(--cyan));border-radius:4px}
::selection{background:rgba(59,130,246,.35);color:#fff}

/* ── ANIMATIONS ── */
@keyframes fade-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.75)}}
@keyframes orb-drift{0%{transform:translate(0,0) scale(1)}100%{transform:translate(40px,-30px) scale(1.08)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes toast-in{from{opacity:0;transform:translateX(40px) scale(.9)}to{opacity:1;transform:none}}
@keyframes toast-out{to{opacity:0;transform:translateX(40px) scale(.9)}}
@keyframes typing-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes float-particle{0%{opacity:0;transform:translateY(0) scale(0)}10%{opacity:.6}90%{opacity:.2}100%{opacity:0;transform:translateY(-120px) scale(1.5)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

.anim-fade-up{animation:fade-up .7s var(--ease) both}
.anim-d1{animation-delay:.1s}.anim-d2{animation-delay:.2s}.anim-d3{animation-delay:.3s}.anim-d4{animation-delay:.4s}.anim-d5{animation-delay:.5s}

/* ── LAYOUT ── */
.ss-app{min-height:100vh;display:flex;flex-direction:column}
.container{max-width:1180px;margin:0 auto;padding:0 28px}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:var(--r-md);font-family:var(--ff-body);font-size:14px;font-weight:500;border:none;cursor:pointer;transition:all .2s var(--ease);text-decoration:none;white-space:nowrap;position:relative;overflow:hidden}
.btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08),transparent);opacity:0;transition:opacity .2s}
.btn:hover::after{opacity:1}
.btn-primary{background:linear-gradient(135deg,var(--blue),var(--blue-d));color:#fff;box-shadow:0 4px 20px rgba(59,130,246,.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(59,130,246,.4)}
.btn-ghost{background:rgba(255,255,255,.04);color:var(--t2);border:1px solid var(--border2)}
.btn-ghost:hover{background:rgba(255,255,255,.08);color:var(--t1);border-color:rgba(255,255,255,.25);transform:translateY(-1px)}
.btn-green{background:linear-gradient(135deg,var(--green),#059669);color:#fff}
.btn-green:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(16,185,129,.35)}
.btn-danger{background:rgba(244,63,94,.12);color:#fb7185;border:1px solid rgba(244,63,94,.25)}
.btn-danger:hover{background:rgba(244,63,94,.22)}
.btn-lg{padding:13px 30px;font-size:15px;border-radius:var(--r-lg)}
.btn-sm{padding:6px 14px;font-size:12px;border-radius:var(--r-sm)}
.btn-xs{padding:4px 10px;font-size:11px;border-radius:6px}
.btn-icon{width:38px;height:38px;padding:0;justify-content:center}

/* ── CARDS ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-xl);padding:24px;transition:border-color .25s,transform .25s var(--ease-spring),box-shadow .25s}
.card:hover{border-color:var(--borderB);transform:translateY(-3px);box-shadow:0 20px 50px rgba(0,0,0,.35)}
.card-glass{background:rgba(15,21,32,.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border)}

/* ── BADGES ── */
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:var(--r-full);font-size:11px;font-weight:600}
.badge-blue{background:rgba(59,130,246,.15);color:var(--blue-b);border:1px solid rgba(59,130,246,.25)}
.badge-green{background:rgba(16,185,129,.13);color:var(--green-b);border:1px solid rgba(16,185,129,.22)}
.badge-purple{background:rgba(139,92,246,.13);color:var(--purple-b);border:1px solid rgba(139,92,246,.22)}
.badge-amber{background:rgba(245,158,11,.12);color:var(--amber-b);border:1px solid rgba(245,158,11,.22)}
.badge-cyan{background:rgba(6,182,212,.12);color:var(--cyan-b);border:1px solid rgba(6,182,212,.22)}
.badge-rose{background:rgba(244,63,94,.12);color:#fb7185;border:1px solid rgba(244,63,94,.22)}
.badge-free{background:rgba(16,185,129,.13);color:var(--green-b);border:1px solid rgba(16,185,129,.22)}
.badge-regular{background:rgba(59,130,246,.15);color:var(--blue-b);border:1px solid rgba(59,130,246,.25)}
.badge-advanced{background:rgba(139,92,246,.13);color:var(--purple-b);border:1px solid rgba(139,92,246,.22)}

/* ── TYPOGRAPHY ── */
.disp-xl{font-family:var(--ff-disp);font-size:clamp(44px,7vw,88px);font-weight:800;line-height:1.02;letter-spacing:-.04em}
.disp-lg{font-family:var(--ff-disp);font-size:clamp(30px,4.5vw,54px);font-weight:800;line-height:1.07;letter-spacing:-.025em}
.disp-md{font-family:var(--ff-disp);font-size:clamp(20px,3vw,34px);font-weight:700;line-height:1.15;letter-spacing:-.02em}
.disp-sm{font-family:var(--ff-disp);font-size:18px;font-weight:700}
.label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.grad-blue{background:linear-gradient(135deg,var(--blue-b),var(--cyan),var(--purple-b));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.grad-white{background:linear-gradient(135deg,#fff,var(--t2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* ── ORB BACKGROUNDS ── */
.orb-field{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.orb{position:absolute;border-radius:50%;filter:blur(90px);animation:orb-drift 18s ease-in-out infinite alternate}
.orb1{width:600px;height:600px;background:radial-gradient(circle,rgba(59,130,246,.2),transparent 70%);top:-200px;left:-150px;animation-delay:0s}
.orb2{width:450px;height:450px;background:radial-gradient(circle,rgba(139,92,246,.16),transparent 70%);bottom:-120px;right:-80px;animation-delay:-7s}
.orb3{width:300px;height:300px;background:radial-gradient(circle,rgba(6,182,212,.14),transparent 70%);top:35%;right:8%;animation-delay:-13s}

/* ── GRID BG ── */
.grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 0%,black,transparent 75%);pointer-events:none;z-index:0}
.light .grid-bg{background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px)}

/* ── INPUTS ── */
.input{width:100%;background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:var(--r-md);padding:10px 14px;font-size:13px;font-family:var(--ff-body);color:var(--t1);outline:none;transition:border-color .2s,background .2s}
.input:focus{border-color:var(--blue);background:rgba(59,130,246,.06)}
.input::placeholder{color:var(--t4)}
textarea.input{resize:vertical;min-height:100px;line-height:1.7}
select.input{cursor:pointer}
.form-label{display:block;font-size:11px;font-weight:600;color:var(--t3);margin-bottom:6px;letter-spacing:.01em;text-transform:uppercase}
.form-group{margin-bottom:16px}

/* ── DIVIDERS ── */
.divider{height:1px;background:var(--border);margin:20px 0}
.divider-glow{height:1px;background:linear-gradient(90deg,transparent,var(--blue) 30%,var(--cyan) 60%,transparent);opacity:.6}

/* ── SIDEBAR ── */
.sidebar{width:228px;min-width:228px;background:var(--night);border-right:1px solid var(--border);display:flex;flex-direction:column;height:100vh;position:sticky;top:0;overflow:hidden;transition:.3s}
.sidebar-logo{padding:20px 18px 16px;border-bottom:1px solid var(--border)}
.sidebar-logo-row{display:flex;align-items:center;gap:9px}
.logo-icon{width:34px;height:34px;background:linear-gradient(135deg,var(--blue),var(--cyan));border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:var(--ff-disp);font-size:17px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 4px 14px rgba(59,130,246,.4)}
.logo-text{font-family:var(--ff-disp);font-size:17px;font-weight:700;background:linear-gradient(135deg,var(--t1),var(--t2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sidebar-nav{flex:1;padding:10px 10px;overflow-y:auto}
.nav-section{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:var(--t4);padding:12px 8px 6px}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r-md);cursor:pointer;color:var(--t3);font-size:13px;font-weight:400;transition:all .15s;margin-bottom:2px;position:relative;border:none;background:none;width:100%;text-align:left;font-family:var(--ff-body)}
.nav-item:hover{background:rgba(255,255,255,.04);color:var(--t1)}
.nav-item.active{background:linear-gradient(135deg,rgba(59,130,246,.16),rgba(6,182,212,.08));color:var(--blue-b);font-weight:500}
.nav-item.active::before{content:'';position:absolute;left:0;top:20%;height:60%;width:2.5px;background:var(--blue);border-radius:2px}
.nav-icon{font-size:16px;width:18px;text-align:center;flex-shrink:0}
.nav-badge{margin-left:auto;background:var(--blue);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;font-weight:700}
.sidebar-user{padding:14px;border-top:1px solid var(--border);display:flex;align-items:center;gap:10px;cursor:pointer;transition:.15s}
.sidebar-user:hover{background:rgba(255,255,255,.03)}
.user-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#fff;flex-shrink:0}
.user-name{font-size:12px;font-weight:600}
.user-role{font-size:10px;color:var(--t3)}
.online-dot{width:8px;height:8px;background:var(--green);border-radius:50%;border:1.5px solid var(--night);box-shadow:0 0 6px var(--green)}

/* ── PAGE SHELL ── */
.app-shell{display:flex;height:100vh;overflow:hidden}
.page-main{flex:1;overflow-y:auto;background:var(--void)}
.page-header{background:var(--night);border-bottom:1px solid var(--border);padding:18px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-shrink:0}
.page-title{font-family:var(--ff-disp);font-size:20px;font-weight:700}
.page-sub{font-size:12px;color:var(--t3);margin-top:2px}
.page-content{padding:24px 28px}

/* ── METRIC CARDS ── */
.metric{background:var(--card);border:1px solid var(--border);border-radius:var(--r-xl);padding:20px;transition:all .22s var(--ease-spring)}
.metric:hover{border-color:var(--borderB);transform:translateY(-3px);box-shadow:0 14px 40px rgba(0,0,0,.3)}
.metric-icon{font-size:20px;margin-bottom:10px}
.metric-val{font-family:var(--ff-disp);font-size:28px;font-weight:800;color:var(--t1)}
.metric-label{font-size:11px;color:var(--t3);margin-top:3px}
.metric-change{font-size:10px;color:var(--green-b);margin-top:4px;font-weight:600}

/* ── GRID HELPERS ── */
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-2-1{display:grid;grid-template-columns:1fr 1.3fr;gap:20px}

/* ── SKILL CARDS (marketplace) ── */
.sk-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;cursor:pointer;transition:all .25s var(--ease-spring)}
.sk-card:hover{transform:translateY(-5px);border-color:var(--borderB);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.sk-cover{height:130px;display:flex;align-items:center;justify-content:center;font-size:44px;position:relative;overflow:hidden}
.sk-cover-blur{position:absolute;inset:0;filter:blur(30px);opacity:.75;transform:scale(1.2)}
.sk-cover-icon{position:relative;z-index:1;filter:drop-shadow(0 4px 10px rgba(0,0,0,.5))}
.sk-body{padding:16px 18px}
.sk-name{font-family:var(--ff-disp);font-size:15px;font-weight:700;margin-bottom:4px}
.sk-teacher{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--t3);margin-bottom:10px}
.sk-teacher-dot{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff;flex-shrink:0}
.sk-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px}
.sk-tag{padding:2px 9px;border-radius:var(--r-full);font-size:10px;font-weight:600;background:rgba(255,255,255,.05);border:1px solid var(--border2);color:var(--t3)}
.sk-footer{display:flex;align-items:center;justify-content:space-between}
.sk-rating{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--amber-b)}

/* ── CHAT ── */
.chat-layout{display:flex;height:100%;overflow:hidden}
.chat-sidebar{width:240px;min-width:240px;border-right:1px solid var(--border);background:var(--night);display:flex;flex-direction:column}
.chat-sbar-hdr{padding:16px;border-bottom:1px solid var(--border)}
.chat-list{flex:1;overflow-y:auto}
.chat-item{display:flex;align-items:center;gap:10px;padding:12px 14px;cursor:pointer;transition:.15s;border-left:2.5px solid transparent}
.chat-item:hover{background:rgba(255,255,255,.03)}
.chat-item.active{background:rgba(59,130,246,.07);border-left-color:var(--blue)}
.chat-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;position:relative}
.chat-online{position:absolute;bottom:0;right:0;width:10px;height:10px;background:var(--green);border-radius:50%;border:2px solid var(--night)}
.chat-name{font-size:13px;font-weight:500}
.chat-preview-text{font-size:11px;color:var(--t3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px}
.chat-unread{background:var(--blue);color:#fff;border-radius:10px;font-size:10px;padding:1px 5px;font-weight:700}
.chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.chat-header{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;background:var(--night);flex-shrink:0}
.chat-messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px}
.msg-row{display:flex;gap:10px;align-items:flex-end;max-width:72%}
.msg-row.me{align-self:flex-end;flex-direction:row-reverse}
.msg-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0}
.msg-bubble{background:var(--card2);border:1px solid var(--border);border-radius:14px;border-bottom-left-radius:3px;padding:10px 14px;font-size:13px;line-height:1.65}
.msg-row.me .msg-bubble{background:linear-gradient(135deg,var(--blue-d),var(--blue));border:none;border-radius:14px;border-bottom-right-radius:3px;color:#fff}
.msg-time{font-size:10px;color:var(--t4);margin-top:4px;padding:0 3px}
.typing-dots{display:flex;align-items:center;gap:3px}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--t3);animation:typing-dot .9s infinite}
.typing-dot:nth-child(2){animation-delay:.2s}
.typing-dot:nth-child(3){animation-delay:.4s}
.chat-input-area{padding:12px 18px;border-top:1px solid var(--border);background:var(--night);flex-shrink:0}
.chat-input-row{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:var(--r-xl);padding:8px 14px}
.chat-input{flex:1;background:none;border:none;outline:none;font-size:13px;color:var(--t1);font-family:var(--ff-body)}
.chat-input::placeholder{color:var(--t4)}
.send-btn{width:32px;height:32px;background:linear-gradient(135deg,var(--blue),var(--blue-d));border:none;border-radius:8px;cursor:pointer;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.15s}
.send-btn:hover{transform:scale(1.08)}

/* ── CALENDAR ── */
.cal-hdr{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px}
.cal-head{text-align:center;font-size:10px;font-weight:600;color:var(--t4);text-transform:uppercase;letter-spacing:.05em}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid transparent;transition:.15s;color:var(--t2);background:none}
.cal-day:hover:not(.empty):not(.taken-day){background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.2);color:var(--blue-b)}
.cal-day.today{background:rgba(59,130,246,.15);border-color:rgba(59,130,246,.3);color:var(--blue-b);font-weight:600}
.cal-day.selected{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600}
.cal-day.has-session{position:relative}
.cal-day.has-session::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--green)}
.cal-day.empty{cursor:default;color:transparent}
.time-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}
.time-slot{padding:9px;border:1px solid var(--border);border-radius:var(--r-md);text-align:center;font-size:12px;cursor:pointer;color:var(--t2);transition:.15s;background:none;font-family:var(--ff-body)}
.time-slot:hover:not(.taken){border-color:var(--blue);color:var(--blue-b);background:rgba(59,130,246,.05)}
.time-slot.selected-slot{background:rgba(59,130,246,.15);border-color:rgba(59,130,246,.4);color:var(--blue-b);font-weight:500}
.time-slot.taken{opacity:.3;cursor:not-allowed}

/* ── MODALS ── */
.modal-overlay{position:fixed;inset:0;z-index:9000;background:rgba(3,5,8,.9);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fade-in .2s}
.modal-box{background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:var(--r-xl);padding:36px 32px;width:100%;max-width:460px;max-height:90vh;overflow-y:auto;position:relative;animation:fade-up .3s var(--ease-spring)}
.modal-close{position:absolute;top:14px;right:14px;width:30px;height:30px;background:rgba(255,255,255,.06);border:1px solid var(--border2);border-radius:var(--r-sm);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:var(--t3);transition:.15s}
.modal-close:hover{background:rgba(255,255,255,.12);color:var(--t1)}

/* ── TOAST ── */
.toast-container{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px}
.toast{background:var(--card2);border:1px solid var(--border2);border-radius:var(--r-lg);padding:12px 18px;font-size:13px;color:var(--t1);display:flex;align-items:center;gap:10px;min-width:260px;max-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:toast-in .35s var(--ease-spring)}
.toast.out{animation:toast-out .3s var(--ease) forwards}

/* ── AUTH ── */
.auth-tabs{display:flex;gap:4px;background:var(--deep);border-radius:var(--r-md);padding:4px;margin-bottom:22px}
.auth-tab{flex:1;padding:9px;border-radius:var(--r-sm);font-size:13px;font-weight:500;cursor:pointer;transition:.2s;border:none;background:none;color:var(--t3);font-family:var(--ff-body)}
.auth-tab.active{background:linear-gradient(135deg,var(--blue),var(--blue-d));color:#fff;box-shadow:0 2px 10px rgba(59,130,246,.3)}
.social-auth{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
.social-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;border-radius:var(--r-md);background:rgba(255,255,255,.04);border:1px solid var(--border2);font-size:13px;font-weight:500;color:var(--t2);cursor:pointer;transition:.18s;font-family:var(--ff-body)}
.social-btn:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:var(--t1)}
.auth-divider{display:flex;align-items:center;gap:12px;margin:16px 0}
.auth-divider-line{flex:1;height:1px;background:var(--border)}
.auth-divider-txt{font-size:11px;color:var(--t4)}
.role-picker{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.role-opt{border:1px solid var(--border2);border-radius:var(--r-md);padding:14px 12px;text-align:center;cursor:pointer;transition:.2s;background:transparent}
.role-opt:hover{border-color:var(--borderB);background:rgba(59,130,246,.04)}
.role-opt.sel{background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.4)}
.role-opt-icon{font-size:22px;margin-bottom:8px;display:block}
.role-opt-label{font-size:13px;font-weight:600;color:var(--t2)}
.role-opt.sel .role-opt-label{color:var(--blue-b)}
.role-opt-desc{font-size:10px;color:var(--t4);margin-top:3px}
.plan-picker-auth{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.plan-opt{border:1px solid var(--border2);border-radius:var(--r-md);padding:10px 6px;text-align:center;cursor:pointer;transition:.2s;background:transparent}
.plan-opt.sel-free{background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.3)}
.plan-opt.sel-regular{background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.3)}
.plan-opt.sel-advanced{background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.3)}
.plan-opt-name{font-size:12px;font-weight:700;margin-bottom:2px}
.plan-opt-price{font-size:10px;color:var(--t4)}

/* ── ONBOARDING ── */
.ob-progress{display:flex;gap:6px;margin-bottom:26px}
.ob-dot{height:4px;border-radius:2px;flex:1;background:rgba(255,255,255,.08);transition:.3s}
.ob-dot.done{background:var(--blue)}
.ob-dot.cur{background:linear-gradient(90deg,var(--blue),var(--cyan))}
.interest-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}
.int-chip{border:1px solid var(--border2);border-radius:var(--r-md);padding:12px 8px;text-align:center;cursor:pointer;transition:.2s;background:transparent;font-family:var(--ff-body)}
.int-chip:hover{border-color:var(--borderB);background:rgba(59,130,246,.04)}
.int-chip.sel{background:rgba(59,130,246,.12);border-color:rgba(59,130,246,.4)}
.int-chip-icon{font-size:20px;display:block;margin-bottom:5px}
.int-chip-label{font-size:11px;font-weight:500;color:var(--t2)}
.int-chip.sel .int-chip-label{color:var(--blue-b)}

/* ── HERO (landing page) ── */
.hero-section{min-height:100vh;display:flex;flex-direction:column;position:relative;overflow:hidden}
.hero-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 40px;position:relative;z-index:10;flex-shrink:0}
.hero-nav-links{display:flex;gap:4px}
.hero-nav-link{padding:7px 14px;font-size:13px;color:var(--t3);cursor:pointer;border-radius:var(--r-sm);transition:.15s;background:none;border:none;font-family:var(--ff-body)}
.hero-nav-link:hover{color:var(--t1);background:rgba(255,255,255,.05)}
.hero-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 28px;position:relative;z-index:2}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:var(--r-full);padding:7px 16px;font-size:12px;font-weight:600;color:var(--blue-b);margin-bottom:28px}
.eyebrow-dot{width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);animation:pulse-dot 2.2s ease-in-out infinite}
.hero-h1{font-family:var(--ff-disp);font-size:clamp(42px,7.5vw,90px);font-weight:800;line-height:1.01;letter-spacing:-.04em;margin-bottom:24px}
.hero-sub{font-size:clamp(15px,2vw,19px);color:var(--t3);max-width:540px;line-height:1.8;margin-bottom:40px}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-bottom:60px}
.plans-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:820px;width:100%}
.plan-card{background:rgba(15,21,32,.88);border:1px solid var(--border);border-radius:var(--r-xl);padding:22px 18px;text-align:left;cursor:pointer;transition:all .25s var(--ease-spring);position:relative;overflow:hidden;backdrop-filter:blur(8px)}
.plan-card:hover{transform:translateY(-6px) scale(1.015);border-color:rgba(255,255,255,.18)}
.plan-card.popular{border-color:rgba(59,130,246,.35);box-shadow:0 0 40px rgba(59,130,246,.12)}
.plan-pop-tag{position:absolute;top:10px;right:10px;background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:var(--r-full)}
.plan-icon-big{font-size:26px;margin-bottom:12px;display:block}
.plan-card-name{font-family:var(--ff-disp);font-size:15px;font-weight:700;margin-bottom:6px}
.plan-card-desc{font-size:12px;color:var(--t3);line-height:1.65;margin-bottom:12px}
.plan-card-price{font-family:var(--ff-disp);font-size:17px;font-weight:800}
.plan-card-features{list-style:none;margin-top:12px;display:flex;flex-direction:column;gap:6px}
.plan-card-features li{font-size:11px;color:var(--t3);display:flex;align-items:flex-start;gap:7px}
.plan-card-features li::before{content:'✓';color:var(--green-b);font-weight:700;flex-shrink:0}

/* ── STATS BAR ── */
.stats-bar{background:linear-gradient(90deg,var(--deep),var(--card));border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:26px 0}
.stats-inner{display:grid;grid-template-columns:repeat(5,1fr);gap:0}
.stat-item{text-align:center;padding:0 16px;border-right:1px solid var(--border)}
.stat-item:last-child{border-right:none}
.stat-num{font-family:var(--ff-disp);font-size:clamp(24px,3.5vw,38px);font-weight:800;background:linear-gradient(135deg,var(--blue-b),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px}
.stat-label{font-size:12px;color:var(--t4);font-weight:500}

/* ── MARQUEE ── */
.marquee-wrap{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:12px 0}
.marquee-track{display:flex;gap:16px;animation:marquee 30s linear infinite;width:max-content}
.marquee-chip{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:var(--r-full);padding:6px 14px;font-size:12px;font-weight:500;color:var(--t3);white-space:nowrap;cursor:pointer;transition:.18s}
.marquee-chip:hover{background:rgba(59,130,246,.08);border-color:var(--borderB);color:var(--blue-b)}
.marquee-dot{width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0}

/* ── HOW IT WORKS ── */
.steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;position:relative}
.step-card{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 16px}
.step-num-wrap{width:82px;height:82px;border-radius:50%;background:var(--deep);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;margin-bottom:20px;position:relative;transition:all .3s var(--ease-spring)}
.step-num-wrap::before{content:'';position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(from 0deg,var(--blue),var(--cyan),var(--blue));z-index:-1;opacity:0;transition:opacity .3s}
.step-card:hover .step-num-wrap::before{opacity:1}
.step-card:hover .step-num-wrap{transform:scale(1.1)}
.step-num{font-family:var(--ff-disp);font-size:26px;font-weight:800;background:linear-gradient(135deg,var(--blue-b),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.step-title{font-family:var(--ff-disp);font-size:14px;font-weight:700;margin-bottom:8px}
.step-desc{font-size:12px;color:var(--t3);line-height:1.7}

/* ── TESTIMONIALS ── */
.testi-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-xl);padding:26px;transition:all .25s var(--ease-spring)}
.testi-card:hover{transform:translateY(-4px);border-color:var(--borderB)}
.testi-stars{color:var(--amber-b);font-size:14px;letter-spacing:1px;margin-bottom:14px}
.testi-quote{font-size:13px;color:var(--t2);line-height:1.8;margin-bottom:18px;font-style:italic}
.testi-author{display:flex;align-items:center;gap:12px}
.testi-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
.testi-name{font-size:13px;font-weight:600}
.testi-role{font-size:11px;color:var(--t4);margin-top:2px}

/* ── ACHIEVEMENT BADGES ── */
.ach-badge{background:var(--card);border:1px solid var(--border);border-radius:var(--r-xl);padding:20px;text-align:center;cursor:pointer;transition:all .25s var(--ease-spring)}
.ach-badge:hover{transform:translateY(-5px) scale(1.04);border-color:var(--borderB);box-shadow:0 16px 40px rgba(0,0,0,.35)}
.ach-badge.locked{opacity:.3;filter:grayscale(.8)}
.ach-badge.locked:hover{opacity:.5}
.ach-emoji{font-size:34px;display:block;margin-bottom:8px}
.ach-name{font-family:var(--ff-disp);font-size:12px;font-weight:700;margin-bottom:4px}
.ach-desc{font-size:10px;color:var(--t4);line-height:1.5}

/* ── PROFILE ── */
.profile-hero{background:linear-gradient(135deg,rgba(59,130,246,.1),rgba(139,92,246,.07));border-bottom:1px solid var(--border);padding:28px}
.profile-pic{width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:flex;align-items:center;justify-content:center;font-family:var(--ff-disp);font-size:26px;font-weight:800;color:#fff;border:3px solid rgba(255,255,255,.1);flex-shrink:0;cursor:pointer}
.profile-stats-row{display:flex;gap:20px;margin-top:10px}
.profile-stat-num{font-family:var(--ff-disp);font-size:18px;font-weight:700}
.profile-stat-label{font-size:10px;color:var(--t3)}
.skill-chip{background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:4px 12px;font-size:12px;color:var(--blue-b);display:inline-block;margin:3px}
.skill-chip.want{background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.2);color:var(--purple-b)}

/* ── ADMIN ── */
.admin-table{background:var(--card);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden}
.admin-table table{width:100%;border-collapse:collapse}
.admin-table th{padding:10px 16px;text-align:left;font-size:10px;font-weight:600;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border)}
.admin-table td{padding:11px 16px;font-size:12px;color:var(--t2);border-bottom:1px solid rgba(255,255,255,.03)}
.admin-table tr:last-child td{border-bottom:none}
.admin-table tr:hover td{background:rgba(255,255,255,.02)}
.status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px}
.chart-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.chart-label-txt{font-size:11px;color:var(--t3);width:80px;text-align:right}
.chart-track{flex:1;height:8px;background:rgba(255,255,255,.05);border-radius:4px;overflow:hidden}
.chart-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--blue),var(--cyan));transition:width .5s var(--ease)}
.chart-val-txt{font-size:11px;color:var(--t2);width:38px}

/* ── CONTACT PAGE ── */
.contact-icon-box{width:42px;height:42px;background:rgba(59,130,246,.1);border:1px solid var(--borderB);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}

/* ── PROGRESS BAR ── */
.progress-bar{height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin-top:6px}
.progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--blue),var(--cyan));transition:width .6s var(--ease)}

/* ── STREAK / GAMIFICATION ── */
.streak-box{background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(139,92,246,.06));border:1px solid rgba(245,158,11,.2);border-radius:var(--r-xl);padding:18px;display:flex;align-items:center;gap:16px;margin-bottom:20px}
.streak-num{font-family:var(--ff-disp);font-size:38px;font-weight:800;color:var(--amber-b)}

/* ── FAQ ACCORDION ── */
.faq-item{border:1px solid var(--border);border-radius:var(--r-md);margin-bottom:8px;overflow:hidden}
.faq-q{padding:13px 16px;font-size:13px;font-weight:500;display:flex;justify-content:space-between;align-items:center;cursor:pointer;background:transparent;border:none;width:100%;text-align:left;color:var(--t1);font-family:var(--ff-body);gap:12px}
.faq-a{padding:0 16px 13px;font-size:12px;color:var(--t3);line-height:1.75}

/* ── 404 PAGE ── */
.not-found{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:60px;background:var(--void);position:relative;overflow:hidden}
.nf-num{font-family:var(--ff-disp);font-size:120px;font-weight:800;line-height:1;background:linear-gradient(135deg,rgba(59,130,246,.25),rgba(6,182,212,.15));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.skeleton{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:var(--r-md)}

/* ── SCROLLBAR INSIDE FLEX ── */
.overflow-y-auto{overflow-y:auto}
.overflow-y-auto::-webkit-scrollbar{width:3px}
.overflow-y-auto::-webkit-scrollbar-track{background:transparent}
.overflow-y-auto::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .sidebar{display:none}
  .plans-row,.grid-3,.grid-4,.steps-grid,.stats-inner{grid-template-columns:1fr 1fr}
  .grid-2-1,.grid-2,.chat-layout{grid-template-columns:1fr}
  .chat-sidebar{display:none}
}
@media(max-width:600px){
  .plans-row,.grid-4,.grid-3,.grid-2,.stats-inner{grid-template-columns:1fr}
  .hero-h1{font-size:44px}
  .hero-cta{flex-direction:column}
  .hero-nav-links{display:none}
  .social-auth,.role-picker{grid-template-columns:1fr}
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const SKILLS = [
  { id:1,emoji:"⚛️",cover:"linear-gradient(135deg,#1e40af,#0e7490)",name:"React & Next.js Mastery",teacher:"Sneha Malhotra",initials:"SM",avColor:"linear-gradient(135deg,#3b82f6,#06b6d4)",tags:["Frontend","TypeScript"],rating:"4.9",sessions:"142",mode:"regular",cat:"tech" },
  { id:2,emoji:"🤖",cover:"linear-gradient(135deg,#6d28d9,#7c3aed)",name:"Machine Learning & Python",teacher:"Vikram Rao",initials:"VR",avColor:"linear-gradient(135deg,#8b5cf6,#ec4899)",tags:["Python","AI"],rating:"5.0",sessions:"88",mode:"advanced",cat:"tech" },
  { id:3,emoji:"🎨",cover:"linear-gradient(135deg,#065f46,#0e7490)",name:"Figma UI/UX Design Pro",teacher:"Aisha Khan",initials:"AK",avColor:"linear-gradient(135deg,#10b981,#06b6d4)",tags:["Design","Figma"],rating:"4.8",sessions:"210",mode:"regular",cat:"design" },
  { id:4,emoji:"📊",cover:"linear-gradient(135deg,#92400e,#b45309)",name:"Data Science & Analytics",teacher:"Aryan Gupta",initials:"AG",avColor:"linear-gradient(135deg,#f59e0b,#ef4444)",tags:["Python","SQL"],rating:"4.7",sessions:"65",mode:"free",cat:"tech" },
  { id:5,emoji:"🌍",cover:"linear-gradient(135deg,#9f1239,#be123c)",name:"Spanish A1 to C2 Full",teacher:"Maria Lopez",initials:"ML",avColor:"linear-gradient(135deg,#f43f5e,#f59e0b)",tags:["Language","Grammar"],rating:"4.9",sessions:"320",mode:"regular",cat:"language" },
  { id:6,emoji:"🎵",cover:"linear-gradient(135deg,#4c1d95,#1e3a8a)",name:"Music Production & Beats",teacher:"Rohan DJ",initials:"RD",avColor:"linear-gradient(135deg,#8b5cf6,#3b82f6)",tags:["FL Studio","Ableton"],rating:"4.6",sessions:"44",mode:"advanced",cat:"design" },
  { id:7,emoji:"📈",cover:"linear-gradient(135deg,#14532d,#065f46)",name:"Growth Marketing & SEO",teacher:"Kavya Reddy",initials:"KR",avColor:"linear-gradient(135deg,#10b981,#84cc16)",tags:["Marketing","SEO"],rating:"4.8",sessions:"97",mode:"regular",cat:"business" },
  { id:8,emoji:"☁️",cover:"linear-gradient(135deg,#1e3a8a,#1e40af)",name:"AWS Cloud Architecture",teacher:"Amit Sharma",initials:"AS",avColor:"linear-gradient(135deg,#3b82f6,#a855f7)",tags:["AWS","DevOps"],rating:"4.9",sessions:"156",mode:"advanced",cat:"tech" },
  { id:9,emoji:"✍️",cover:"linear-gradient(135deg,#7c2d12,#9a3412)",name:"Copywriting & Content",teacher:"Nisha Patel",initials:"NP",avColor:"linear-gradient(135deg,#f97316,#ef4444)",tags:["Writing","Branding"],rating:"4.7",sessions:"73",mode:"free",cat:"business" },
];

const TRENDING = ["AI / Prompt Eng","Solidity & Web3","Figma Pro","System Design","SwiftUI","Spanish A1-C2","Video Editing","React Native","Rust Lang","Motion Design","DSA & LeetCode","Personal Branding"];

const FAQS = [
  {q:"What exactly is SkillSwap?",a:"SkillSwap is a peer-to-peer platform where you teach skills you know and learn skills you want — for free or through paid collaboration with verified experts."},
  {q:"Free vs Regular vs Advanced?",a:"Free gives 24/7 AI chatbot + community. Regular ($19/mo) adds live 1:1 video with experts. Advanced ($79/mo) adds in-person tutoring at your location, certifications, and a dedicated mentor."},
  {q:"How do I earn money as an Earner?",a:"List your skills, set your rates, accept bookings. Payments via Stripe, deposited weekly. Top earners make $2,000+/month."},
  {q:"Is SkillSwap available worldwide?",a:"Yes! Fully global for AI & video sessions. In-person Advanced sessions in 40+ cities and growing."},
  {q:"Can I be both Learner and Earner?",a:"Absolutely — most power users do both. Teach what you know, learn what you want. Switch modes anytime."},
];

const CONVERSATIONS = [
  {id:1,name:"Sneha Malhotra",initials:"SM",color:"linear-gradient(135deg,#3b82f6,#06b6d4)",online:true,preview:"Can we sync tomorrow?",unread:2,msgs:[
    {me:false,text:"Hey! I reviewed your React code — great work with hooks 💪",time:"10:24 AM"},
    {me:true,text:"Thanks! Quick question — useMemo vs useCallback?",time:"10:26 AM"},
    {me:false,text:"useMemo caches a computed value; useCallback caches a function ref. Use useMemo for expensive calcs, useCallback for stable callbacks to children.",time:"10:28 AM"},
    {me:true,text:"Crystal clear! Can we do a session tomorrow 4pm to practice?",time:"10:30 AM"},
  ]},
  {id:2,name:"Vikram Rao",initials:"VR",color:"linear-gradient(135deg,#8b5cf6,#ec4899)",online:true,preview:"ML notebook is ready",unread:1,msgs:[
    {me:false,text:"The ML notebook is ready for your review 📊",time:"9:00 AM"},
    {me:true,text:"Perfect! I'll check it out before our session.",time:"9:15 AM"},
  ]},
  {id:3,name:"Aisha Khan",initials:"AK",color:"linear-gradient(135deg,#10b981,#06b6d4)",online:false,preview:"Friday 3pm works!",unread:0,msgs:[
    {me:false,text:"Friday 3pm works for me! See you then 🎨",time:"Yesterday"},
    {me:true,text:"Great, confirmed! Looking forward to the Figma session.",time:"Yesterday"},
  ]},
  {id:4,name:"Priya Mehta",initials:"PM",color:"linear-gradient(135deg,#f59e0b,#ef4444)",online:false,preview:"Can you teach Python basics?",unread:0,msgs:[
    {me:false,text:"Hi! Can you teach Python basics to my team?",time:"2d ago"},
  ]},
];

const CHAT_REPLIES = [
  "Great question! Let me explain that...",
  "That makes total sense. Here's what I think...",
  "Absolutely! We can cover that in our next session.",
  "I'll prepare some resources for you on that topic.",
  "Let me send you a code snippet that demonstrates this perfectly.",
  "Yes! That's one of the most important concepts to understand.",
];

const ACHIEVEMENTS = [
  {emoji:"🥇",name:"First Swap",desc:"Complete your first skill exchange",locked:false},
  {emoji:"🔗",name:"Connector",desc:"Send 10 session requests",locked:false},
  {emoji:"⭐",name:"Top Rated",desc:"Maintain a 4.8+ star average",locked:false},
  {emoji:"🚀",name:"Early Adopter",desc:"Join in the first 10,000 users",locked:false},
  {emoji:"🔥",name:"Iron Learner",desc:"20-day learning streak",locked:false},
  {emoji:"🎓",name:"Certified",desc:"Complete Advanced certification",locked:true},
  {emoji:"🧠",name:"Mentor",desc:"Teach 50+ sessions",locked:true},
  {emoji:"👑",name:"Legendary",desc:"Reach global top 100",locked:true},
];

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "blue") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600);
  }, []);
  return { toasts, show };
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function LogoMark({ size = "md" }) {
  const s = size === "lg" ? { icon: 40, iFont: 20, tFont: 20 } : { icon: 34, iFont: 17, tFont: 17 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div className="logo-icon" style={{ width: s.icon, height: s.icon, fontSize: s.iFont }}>S</div>
      <span className="logo-text" style={{ fontSize: s.tFont }}>SkillSwap</span>
    </div>
  );
}

function Avatar({ initials, color, size = 36, fontSize = 12 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Divider({ glow = false }) {
  return <div className={glow ? "divider-glow" : "divider"} />;
}

function Tag({ children }) {
  return <span style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--border2)", borderRadius: "var(--r-full)", padding: "3px 10px", fontSize: 10, fontWeight: 600, color: "var(--t3)", display: "inline-block", margin: "2px" }}>{children}</span>;
}

function ModeBadge({ mode }) {
  const styles = {
    free: { bg: "rgba(16,185,129,.15)", color: "var(--green-b)", border: "rgba(16,185,129,.25)" },
    regular: { bg: "rgba(59,130,246,.15)", color: "var(--blue-b)", border: "rgba(59,130,246,.25)" },
    advanced: { bg: "rgba(139,92,246,.13)", color: "var(--purple-b)", border: "rgba(139,92,246,.3)" },
  };
  const s = styles[mode] || styles.free;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: "var(--r-full)", fontSize: 10, fontWeight: 700, padding: "2px 9px" }}>
      {mode.charAt(0).toUpperCase() + mode.slice(1)}
    </span>
  );
}

function SectionHeader({ label, title, sub, center = true }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 48 }}>
      {label && <div className="label" style={{ marginBottom: 12, display: "block" }}>{label}</div>}
      <h2 className="disp-lg grad-blue">{title}</h2>
      {sub && <p style={{ fontSize: 16, color: "var(--t3)", maxWidth: 500, margin: center ? "14px auto 0" : "14px 0 0", lineHeight: 1.75 }}>{sub}</p>}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  const icons = { green: "✅", blue: "ℹ️", amber: "⚠️", rose: "❌" };
  const borders = { green: "var(--green-b)", blue: "var(--blue-b)", amber: "var(--amber-b)", rose: "#fb7185" };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast" style={{ borderLeft: `3px solid ${borders[t.type] || borders.blue}` }}>
          <span>{icons[t.type] || "ℹ️"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AuthModal({ onClose, defaultTab = "signup", defaultPlan = "free", onSuccess }) {
  const [tab, setTab] = useState(defaultTab);
  const [role, setRole] = useState("learner");
  const [plan, setPlan] = useState(defaultPlan);
  const [form, setForm] = useState({ name: "", email: "", pass: "" });
  const [forgotMode, setForgotMode] = useState(false);

  const handleSignup = () => {
    if (!form.name || !form.email || !form.pass) return alert("Please fill all fields");
    if (!form.email.includes("@")) return alert("Invalid email");
    if (form.pass.length < 8) return alert("Password must be 8+ chars");
    onClose();
    onSuccess && onSuccess();
  };

  const handleLogin = () => {
    if (!form.email || !form.pass) return alert("Enter credentials");
    onClose();
    onSuccess && onSuccess("login");
  };

  if (forgotMode) return (
    <Modal onClose={onClose}>
      <LogoMark />
      <h2 className="disp-md" style={{ textAlign: "center", margin: "20px 0 6px" }}>Reset Password</h2>
      <p style={{ textAlign: "center", color: "var(--t4)", fontSize: 13, marginBottom: 24 }}>We'll send a reset link to your email</p>
      <div className="form-group"><label className="form-label">Email Address</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
      <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 13 }} onClick={() => { onClose(); }}>Send Reset Link 📧</button>
      <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "var(--t4)", cursor: "pointer" }} onClick={() => setForgotMode(false)}>← Back to login</p>
    </Modal>
  );

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 20 }}><LogoMark /></div>
      <div className="auth-tabs">
        <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
        <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Log In</button>
      </div>

      {tab === "signup" ? (
        <>
          <h2 className="disp-md" style={{ textAlign: "center", marginBottom: 4 }}>Create Account</h2>
          <p style={{ textAlign: "center", color: "var(--t4)", fontSize: 13, marginBottom: 20 }}>Join 47,000+ learners worldwide</p>
          <div className="social-auth">
            <button className="social-btn" onClick={() => { onClose(); onSuccess && onSuccess(); }}>🔵 Google</button>
            <button className="social-btn" onClick={() => { onClose(); onSuccess && onSuccess(); }}>⚫ GitHub</button>
          </div>
          <div className="auth-divider"><div className="auth-divider-line" /><span className="auth-divider-txt">or with email</span><div className="auth-divider-line" /></div>

          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--t3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Join as:</div>
          <div className="role-picker">
            {[["learner", "📚", "Learner", "I want to learn"], ["earner", "💡", "Earner", "I want to teach & earn"]].map(([val, icon, label, desc]) => (
              <div key={val} className={`role-opt ${role === val ? "sel" : ""}`} onClick={() => setRole(val)}>
                <span className="role-opt-icon">{icon}</span>
                <div className="role-opt-label">{label}</div>
                <div className="role-opt-desc">{desc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--t3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Choose plan:</div>
          <div className="plan-picker-auth">
            {[
              ["free", "🤖", "Free", "AI chatbot", "green"],
              ["regular", "🎥", "Regular", "$19/month", "blue"],
              ["advanced", "🎓", "Advanced", "$79/month", "purple"],
            ].map(([val, icon, name, price, col]) => (
              <div key={val} className={`plan-opt ${plan === val ? `sel-${val}` : ""}`} onClick={() => setPlan(val)}>
                <span style={{ fontSize: 18, display: "block", marginBottom: 5 }}>{icon}</span>
                <div className="plan-opt-name" style={{ color: plan === val ? (col === "green" ? "var(--green-b)" : col === "blue" ? "var(--blue-b)" : "var(--purple-b)") : "var(--t2)" }}>{name}</div>
                <div className="plan-opt-price">{price}</div>
              </div>
            ))}
          </div>

          <div className="form-group"><label className="form-label">Full Name</label><input className="input" placeholder="Arjun Kapoor" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="input" type="password" placeholder="8+ characters" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 14 }} onClick={handleSignup}>Create Account →</button>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "var(--t4)" }}>By signing up you agree to our <span style={{ color: "var(--blue-b)", cursor: "pointer" }}>Terms</span></p>
        </>
      ) : (
        <>
          <h2 className="disp-md" style={{ textAlign: "center", marginBottom: 4 }}>Welcome Back 👋</h2>
          <p style={{ textAlign: "center", color: "var(--t4)", fontSize: 13, marginBottom: 20 }}>Sign in to continue learning</p>
          <div className="social-auth">
            <button className="social-btn" onClick={() => { onClose(); onSuccess && onSuccess("login"); }}>🔵 Google</button>
            <button className="social-btn" onClick={() => { onClose(); onSuccess && onSuccess("login"); }}>⚫ GitHub</button>
          </div>
          <div className="auth-divider"><div className="auth-divider-line" /><span className="auth-divider-txt">or</span><div className="auth-divider-line" /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="input" type="password" placeholder="Your password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} /></div>
          <div style={{ textAlign: "right", marginTop: -10, marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: "var(--blue-b)", cursor: "pointer" }} onClick={() => setForgotMode(true)}>Forgot password?</span>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 14 }} onClick={handleLogin}>Sign In →</button>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "var(--t4)" }}>
            New? <span style={{ color: "var(--blue-b)", cursor: "pointer" }} onClick={() => setTab("signup")}>Create free account →</span>
          </p>
        </>
      )}
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING MODAL
// ─────────────────────────────────────────────────────────────────────────────
const INTERESTS = ["💻 Coding", "🎨 Design", "📈 Business", "🌍 Languages", "🎵 Music", "📸 Photography", "🤖 AI / ML", "📊 Data Science", "✍️ Writing", "🎥 Video Edit", "💪 Fitness", "🍳 Cooking"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function OnboardingModal({ onClose, onFinish }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [skill, setSkill] = useState("");
  const [bio, setBio] = useState("");

  const toggle = (item, arr, setArr) => {
    setArr(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const steps = [
    { title: "What do you want to learn? 🎯", sub: "Pick your interests — we'll find perfect matches" },
    { title: "What can you teach? 💡", sub: "Share your skills — earn while others learn" },
    { title: "When are you available? 📅", sub: "Set your weekly schedule so learners can book you" },
  ];

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 20 }}><LogoMark /></div>
      <div className="ob-progress">
        {[1, 2, 3].map(i => <div key={i} className={`ob-dot ${i < step ? "done" : i === step ? "cur" : ""}`} />)}
      </div>
      <h2 className="disp-md" style={{ marginBottom: 4 }}>{steps[step - 1].title}</h2>
      <p style={{ fontSize: 12, color: "var(--t4)", marginBottom: 18 }}>Step {step} of 3 · {steps[step - 1].sub}</p>

      {step === 1 && (
        <div className="interest-grid">
          {INTERESTS.map(item => (
            <div key={item} className={`int-chip ${selected.includes(item) ? "sel" : ""}`} onClick={() => toggle(item, selected, setSelected)}>
              <span className="int-chip-icon">{item.split(" ")[0]}</span>
              <span className="int-chip-label">{item.split(" ").slice(1).join(" ")}</span>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Primary Skill</label><input className="input" placeholder="e.g. React, Figma" value={skill} onChange={e => setSkill(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Level</label><select className="input"><option>Beginner</option><option>Intermediate</option><option>Expert</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">Bio</label><textarea className="input" placeholder="Tell learners about your teaching style..." value={bio} onChange={e => setBio(e.target.value)} style={{ minHeight: 90 }} /></div>
          <div className="form-group"><label className="form-label">Session Rate (for Regular/Advanced)</label><input className="input" type="number" placeholder="e.g. 25 (USD per hour)" /></div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
            {DAYS.map(d => (
              <div key={d} className={`int-chip ${selectedDays.includes(d) ? "sel" : ""}`} onClick={() => toggle(d, selectedDays, setSelectedDays)}>
                <span className="int-chip-label" style={{ fontSize: 13 }}>{d}</span>
              </div>
            ))}
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">From</label><select className="input"><option>9:00 AM</option><option>10:00 AM</option><option selected>11:00 AM</option></select></div>
            <div className="form-group"><label className="form-label">To</label><select className="input"><option>4:00 PM</option><option selected>6:00 PM</option><option>9:00 PM</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">Session Duration</label><select className="input"><option>30 min</option><option selected>1 hour</option><option>2 hours</option></select></div>
          <div style={{ background: "rgba(16,185,129,.07)", border: "1px solid rgba(16,185,129,.2)", borderRadius: "var(--r-md)", padding: 14, fontSize: 13, color: "var(--green-b)", display: "flex", gap: 10, alignItems: "center" }}>
            <span>✅</span><span>Almost ready — click Launch to go live!</span>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", opacity: step === 1 ? .4 : 1, cursor: step === 1 ? "not-allowed" : "pointer" }} onClick={() => step > 1 && setStep(s => s - 1)}>← Back</button>
        <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }} onClick={() => step < 3 ? setStep(s => s + 1) : onFinish()}>
          {step === 3 ? "🚀 Launch My Profile!" : "Continue →"}
        </button>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage }) {
  const nav = [
    { key: "landing", icon: "🏠", label: "Home" },
    { key: "dashboard", icon: "⚡", label: "Dashboard" },
    { key: "marketplace", icon: "🛍️", label: "Marketplace" },
    { key: "chat", icon: "💬", label: "Messages", badge: 3 },
    { key: "booking", icon: "📅", label: "Sessions" },
    { key: "profile", icon: "👤", label: "Profile" },
    { key: "onboarding", icon: "🚀", label: "Onboarding" },
    { key: "admin", icon: "🛡️", label: "Admin Panel" },
    { key: "contact", icon: "📬", label: "Contact" },
    { key: "auth", icon: "🔐", label: "Auth Pages" },
    { key: "notfound", icon: "🔮", label: "404 Page" },
  ];
  const sections = [
    { title: "Main", items: nav.slice(0, 5) },
    { title: "Account", items: nav.slice(5, 7) },
    { title: "More", items: nav.slice(7) },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-logo"><div className="sidebar-logo-row"><LogoMark /></div></div>
      <div className="sidebar-nav overflow-y-auto">
        {sections.map(sec => (
          <div key={sec.title}>
            <div className="nav-section">{sec.title}</div>
            {sec.items.map(item => (
              <button key={item.key} className={`nav-item ${page === item.key ? "active" : ""}`} onClick={() => setPage(item.key)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-user" onClick={() => setPage("profile")}>
        <div className="user-av">AK</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-name">Arjun Kapoor</div>
          <div className="user-role">🎯 Learner · Advanced</div>
        </div>
        <div className="online-dot" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LandingPage({ setPage, showAuth }) {
  const plans = [
    { key: "free", cls: "", name: "Free", color: "var(--green-b)", icon: "🤖", desc: "AI chatbot guidance, community forums, and self-paced learning with full resource library", price: "Free", priceSub: "forever", features: ["24/7 AI chatbot assistant", "Community Q&A forum", "Self-paced skill library", "Basic profile + matching"] },
    { key: "regular", cls: "popular", name: "Regular", color: "var(--blue-b)", icon: "🎥", desc: "Live video conferencing with verified domain experts. Flexible scheduling, recorded replays", price: "$19", priceSub: "/month", features: ["Everything in Free", "Live 1:1 video with experts", "Session recordings & notes", "Priority AI matching"] },
    { key: "advanced", cls: "", name: "Advanced", color: "var(--purple-b)", icon: "🎓", desc: "Expert tutor comes to your home/office. Industry certifications, dedicated mentorship included", price: "$79", priceSub: "/month", features: ["Everything in Regular", "In-person home/office sessions", "Industry certifications", "Dedicated mentor assigned"] },
  ];
  const stats = [["47K+", "Active Learners"], ["8,200", "Expert Earners"], ["320+", "Skill Categories"], ["98%", "Satisfaction Rate"], ["12K", "Sessions / Week"]];
  const steps = [
    { n: "01", icon: "✍️", title: "Sign Up & Choose Role", desc: "Register as Learner, Earner, or both. Pick Free, Regular, or Advanced." },
    { n: "02", icon: "🧠", title: "Build Your Profile", desc: "Showcase skills, portfolio, and goals. AI finds your ideal skill-swap partners." },
    { n: "03", icon: "🔗", title: "Connect & Book", desc: "Browse marketplace, send requests, chat real-time, book sessions in one tap." },
    { n: "04", icon: "🏆", title: "Learn, Earn & Certify", desc: "Complete sessions, earn badges, collect certifications, grow your reputation." },
  ];
  const testimonials = [
    { stars: "★★★★★", quote: "SkillSwap changed my career. I taught Python and learned UX Design from a Google designer. The Advanced plan sent a tutor home — got a startup job in 3 months.", name: "Priya Mehta", role: "Software Engineer, Bangalore", plan: "Advanced", planCls: "badge-purple", av: "PM", avColor: "linear-gradient(135deg,#3b82f6,#06b6d4)" },
    { stars: "★★★★★", quote: "The AI chatbot answered every question at 2am during exam prep. Then I upgraded to Regular for live ML sessions. The quality is insane for the price. Genuinely impressed.", name: "Rahul Singh", role: "CS Student, IIT Delhi", plan: "Regular", planCls: "badge-blue", av: "RS", avColor: "linear-gradient(135deg,#8b5cf6,#ec4899)" },
    { stars: "★★★★★", quote: "As a freelance designer I earn $800/month teaching Figma while learning content marketing. Best side income I've found. The platform is genuinely beautiful to use.", name: "Aisha Khan", role: "Freelance Designer, Mumbai", plan: "Earner", planCls: "badge-green", av: "AK", avColor: "linear-gradient(135deg,#10b981,#06b6d4)" },
  ];

  return (
    <div>
      {/* HERO */}
      <div className="hero-section">
        <div className="orb-field">
          <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        </div>
        <div className="grid-bg" />
        <nav className="hero-nav">
          <LogoMark />
          <div className="hero-nav-links">
            {[["How it works", "how"], ["Explore", "marketplace"], ["Contact", "contact"]].map(([l, p]) => (
              <button key={p} className="hero-nav-link" onClick={() => setPage(p)}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => showAuth("login")}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={() => showAuth("signup")}>Get Started ↗</button>
          </div>
        </nav>
        <div className="hero-body">
          <div className="hero-eyebrow anim-fade-up">
            <div className="eyebrow-dot" />
            Now in public beta · <strong style={{ marginLeft: 3 }}>47,000+</strong> learners worldwide
          </div>
          <h1 className="hero-h1 anim-fade-up anim-d1">
            <span className="grad-white">Learn. Teach.</span><br />
            <span className="grad-blue">Grow Together.</span>
          </h1>
          <p className="hero-sub anim-fade-up anim-d2">
            The world's first peer-to-peer skill exchange platform. Trade knowledge, book expert sessions, and unlock your potential — with AI, video coaching, or in-person tutoring.
          </p>
          <div className="hero-cta anim-fade-up anim-d3">
            <button className="btn btn-primary btn-lg" onClick={() => showAuth("signup")}>🚀 Start for Free</button>
            <button className="btn btn-ghost btn-lg" onClick={() => setPage("marketplace")}>Browse 8,200+ Skills ↓</button>
          </div>
          <div className="plans-row anim-fade-up anim-d4">
            {plans.map(p => (
              <div key={p.key} className={`plan-card ${p.cls}`} onClick={() => showAuth("signup", p.key)}>
                {p.cls === "popular" && <div className="plan-pop-tag">✦ Popular</div>}
                <span className="plan-icon-big">{p.icon}</span>
                <div className="plan-card-name" style={{ color: p.color }}>{p.name}</div>
                <div className="plan-card-desc">{p.desc}</div>
                <div className="plan-card-price" style={{ color: p.color }}>{p.price} <span style={{ fontSize: 12, color: "var(--t4)", fontFamily: "var(--ff-body)", fontWeight: 400 }}>{p.priceSub}</span></div>
                <ul className="plan-card-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-inner">
            {stats.map(([n, l]) => (
              <div key={l} className="stat-item">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...TRENDING, ...TRENDING].map((t, i) => (
            <div key={i} className="marquee-chip" onClick={() => showAuth("signup")}>
              <div className="marquee-dot" />{t}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: "linear-gradient(180deg,var(--void),var(--night) 60%,var(--void))", padding: "90px 0" }}>
        <div className="container">
          <SectionHeader label="Step by step" title="How SkillSwap Works" sub="From zero to skilled in four simple steps. Choose your mode. Connect. Learn. Level up." />
          <div className="steps-grid">
            {steps.map(s => (
              <div key={s.n} className="step-card">
                <div className="step-num-wrap"><div className="step-num">{s.n}</div></div>
                <span style={{ fontSize: 22, marginBottom: 4, display: "block" }}>{s.icon}</span>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: "80px 0" }}>
        <div className="container">
          <SectionHeader label="Real stories" title="Loved by Learners Worldwide" sub="From students to startup founders — real people, real results." />
          <div className="grid-3">
            {testimonials.map(t => (
              <div key={t.name} className="testi-card">
                <div className="testi-stars">{t.stars}</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-author">
                  <Avatar initials={t.av} color={t.avColor} size={38} />
                  <div style={{ flex: 1 }}>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                  <span className={`badge ${t.planCls}`}>{t.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div style={{ padding: "80px 0", background: "var(--night)" }}>
        <div className="container">
          <SectionHeader label="Gamification" title="Earn Badges & XP" sub="Learning is more fun when you level up. Unlock achievements, streaks, and global rankings." />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            {ACHIEVEMENTS.map(a => (
              <div key={a.name} className={`ach-badge ${a.locked ? "locked" : ""}`} style={{ minWidth: 130 }}>
                <span className="ach-emoji">{a.emoji}</span>
                <div className="ach-name">{a.name}</div>
                <div className="ach-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg,rgba(59,130,246,.1),rgba(6,182,212,.06),rgba(139,92,246,.09))", borderTop: "1px solid rgba(59,130,246,.15)", borderBottom: "1px solid rgba(59,130,246,.15)", padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <div className="label" style={{ marginBottom: 16, display: "block" }}>Ready to start?</div>
          <h2 className="disp-lg" style={{ marginBottom: 14 }}>Your Next Skill is <span className="grad-blue">One Swap Away</span></h2>
          <p style={{ fontSize: 17, color: "var(--t3)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>Join 47,000+ learners and earners. Start free. Upgrade anytime.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => showAuth("signup")}>Create Free Account →</button>
            <button className="btn btn-ghost btn-lg" onClick={() => setPage("marketplace")}>Explore Skills</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "var(--night)", borderTop: "1px solid var(--border)", padding: "50px 0 28px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr repeat(3,1fr)", gap: 40, marginBottom: 40 }}>
            <div>
              <LogoMark />
              <p style={{ fontSize: 13, color: "var(--t4)", lineHeight: 1.8, marginTop: 14, maxWidth: 230 }}>The world's first peer-to-peer skill exchange platform. Learn, teach, and grow together.</p>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
                <span style={{ fontSize: 12, color: "var(--t4)" }}>All systems operational</span>
              </div>
            </div>
            {[
              ["Product", ["Marketplace", "For Learners", "For Earners", "Pricing", "Enterprise"]],
              ["Company", ["About Us", "Blog", "Careers 🔥", "Press Kit", "Contact"]],
              ["Legal", ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"]],
            ].map(([col, links]) => (
              <div key={col}>
                <div style={{ fontFamily: "var(--ff-disp)", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{col}</div>
                {links.map(l => <div key={l} style={{ fontSize: 13, color: "var(--t4)", marginBottom: 10, cursor: "pointer" }}>{l}</div>)}
              </div>
            ))}
          </div>
          <Divider />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 20 }}>
            <div style={{ fontSize: 12, color: "var(--t4)" }}>© 2025 SkillSwap, Inc. All rights reserved. Made with ❤️ in Mumbai & SF.</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["𝕏", "in", "⌥", "◎", "⌘"].map(s => (
                <div key={s} style={{ width: 34, height: 34, background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPage({ setPage, showAuth }) {
  const metrics = [
    { icon: "📚", val: "12", label: "Skills Learning", change: "↑ 3 this month" },
    { icon: "🎯", val: "8", label: "Sessions Booked", change: "↑ 2 this week" },
    { icon: "⭐", val: "4.9", label: "Your Rating", change: "Top 5% earner" },
    { icon: "💰", val: "$420", label: "Earned (month)", change: "↑ $120 vs last" },
  ];
  const recommendations = [
    { name: "Sneha Malhotra", skills: "React · TypeScript · System Design", match: "94%", plan: "Regular", color: "linear-gradient(135deg,#3b82f6,#06b6d4)", initials: "SM" },
    { name: "Vikram Rao", skills: "ML · Python · Data Science", match: "89%", plan: "Advanced", color: "linear-gradient(135deg,#8b5cf6,#ec4899)", initials: "VR" },
    { name: "Aisha Khan", skills: "Figma · Motion Design · Branding", match: "85%", plan: "Regular", color: "linear-gradient(135deg,#10b981,#06b6d4)", initials: "AK" },
  ];
  const activity = [
    { color: "var(--green)", text: "Session with Sneha completed — React Hooks", time: "2h ago" },
    { color: "var(--blue)", text: "New message from Vikram Rao", time: "4h ago" },
    { color: "var(--amber)", text: "Session request from Priya Mehta (Python)", time: "Yesterday" },
    { color: "var(--purple)", text: "New badge unlocked: Connector 🏅", time: "2d ago" },
    { color: "var(--cyan)", text: "Skill verified: JavaScript (Advanced)", time: "3d ago" },
  ];
  const sessions = [
    { color: "rgba(59,130,246,.08)", border: "rgba(59,130,246,.15)", label: "TODAY · 4:00 PM", labelColor: "var(--blue-b)", title: "React Performance", with: "Sneha Malhotra", badge: "badge-blue", badgeLabel: "🎥 Video Call" },
    { color: "rgba(16,185,129,.06)", border: "rgba(16,185,129,.15)", label: "TOMORROW · 11:00 AM", labelColor: "var(--green-b)", title: "Python for ML", with: "Vikram Rao", badge: "badge-green", badgeLabel: "🤖 AI Session" },
    { color: "rgba(139,92,246,.06)", border: "rgba(139,92,246,.12)", label: "FRI · 3:00 PM", labelColor: "var(--purple-b)", title: "Figma Workshop", with: "Aisha Khan", badge: "badge-purple", badgeLabel: "🏠 In-Person" },
  ];
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Good morning, Arjun 👋</div>
          <div className="page-sub">You have 2 sessions today and 3 new matches</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm">🔔 <span className="nav-badge" style={{ marginLeft: 4 }}>5</span></button>
          <button className="btn btn-primary btn-sm" onClick={() => setPage("marketplace")}>Browse Skills</button>
        </div>
      </div>
      <div className="page-content">
        {/* Profile complete */}
        <div style={{ background: "linear-gradient(135deg,rgba(59,130,246,.1),rgba(6,182,212,.05))", border: "1px solid rgba(59,130,246,.2)", borderRadius: "var(--r-xl)", padding: 18, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Complete your profile · <span style={{ color: "var(--blue-b)" }}>72%</span></div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("profile")}>Complete Now</button>
          </div>
          <ProgressBar value={72} />
          <div style={{ fontSize: 11, color: "var(--t4)", marginTop: 6 }}>Add portfolio + 2 more skills to unlock AI matching</div>
        </div>

        {/* Metrics */}
        <div className="grid-4" style={{ marginBottom: 20 }}>
          {metrics.map(m => (
            <div key={m.label} className="metric">
              <div className="metric-icon">{m.icon}</div>
              <div className="metric-val">{m.val}</div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-change">{m.change}</div>
            </div>
          ))}
        </div>

        {/* Streak */}
        <div className="streak-box">
          <div className="streak-num">🔥 14</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Day Learning Streak</div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 4 }}>Keep going! 6 more days for Iron Learner badge</div>
          </div>
          <div style={{ marginLeft: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[["🥇", "First Swap"], ["💬", "Connector"], ["🔥", "Iron Learner", true], ["🎓", "Certified", true]].map(([e, n, locked]) => (
              <div key={n} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: 10, textAlign: "center", opacity: locked ? .3 : 1 }}>
                <div style={{ fontSize: 20 }}>{e}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--t2)", marginTop: 4 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recs + Activity */}
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="disp-sm" style={{ marginBottom: 4 }}>🤖 AI Recommendations</div>
            <div style={{ fontSize: 12, color: "var(--t4)", marginBottom: 14 }}>Based on your skills & goals</div>
            {recommendations.map(r => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "rgba(255,255,255,.02)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", cursor: "pointer", marginBottom: 8, transition: ".15s" }} onClick={() => setPage("profile")}>
                <Avatar initials={r.initials} color={r.color} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>{r.skills}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "var(--cyan-b)", fontWeight: 600 }}>{r.match}</div>
                  <div style={{ fontSize: 10, color: "var(--t4)" }}>{r.plan}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div className="disp-sm" style={{ marginBottom: 4 }}>📡 Recent Activity</div>
            <div style={{ fontSize: 12, color: "var(--t4)", marginBottom: 14 }}>Your last 5 actions</div>
            {activity.map(a => (
              <div key={a.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,.02)", marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "var(--t2)", flex: 1 }}>{a.text}</div>
                <div style={{ fontSize: 10, color: "var(--t4)", flexShrink: 0 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="card" style={{ padding: 18 }}>
          <div className="disp-sm" style={{ marginBottom: 14 }}>📅 Upcoming Sessions</div>
          <div className="grid-3">
            {sessions.map(s => (
              <div key={s.title} style={{ background: s.color, border: `1px solid ${s.border}`, borderRadius: "var(--r-md)", padding: 14 }}>
                <div style={{ fontSize: 11, color: s.labelColor, fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: "var(--t3)" }}>with {s.with}</div>
                <div style={{ marginTop: 8 }}><span className={`badge ${s.badge}`}>{s.badgeLabel}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKETPLACE PAGE
// ─────────────────────────────────────────────────────────────────────────────
function MarketplacePage({ showAuth }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const cats = [["all", "All"], ["tech", "💻 Tech"], ["design", "🎨 Design"], ["business", "📈 Business"], ["language", "🌍 Language"]];

  const filtered = SKILLS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.teacher.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
    const matchCat = cat === "all" || s.cat === cat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Skill Marketplace</div>
          <div className="page-sub">8,200+ experts across 320 categories</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => showAuth("signup")}>+ List My Skill</button>
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 28px", background: "var(--night)", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        <div style={{ position: "relative", maxWidth: 320, flex: 1 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--t4)" }}>🔍</span>
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search skills, experts, topics..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {cats.map(([val, label]) => (
            <button key={val} onClick={() => setCat(val)} style={{ padding: "6px 14px", borderRadius: "var(--r-full)", fontSize: 12, cursor: "pointer", border: "1px solid", fontFamily: "var(--ff-body)", transition: ".15s", background: cat === val ? "rgba(59,130,246,.15)" : "transparent", borderColor: cat === val ? "rgba(59,130,246,.4)" : "var(--border2)", color: cat === val ? "var(--blue-b)" : "var(--t3)", fontWeight: cat === val ? 500 : 400 }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div style={{ padding: "14px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 10 }}>🔥 Trending right now</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TRENDING.slice(0, 8).map(t => (
            <div key={t} onClick={() => setSearch(t)} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.03)", border: "1px solid var(--border2)", borderRadius: "var(--r-full)", padding: "5px 14px", fontSize: 12, color: "var(--t3)", cursor: "pointer" }}>
              <span style={{ fontSize: 10, color: "var(--green-b)" }}>↑</span>{t}
            </div>
          ))}
        </div>
      </div>

      {/* Skills grid */}
      <div style={{ padding: "22px 28px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--t4)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: "var(--ff-disp)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No skills found</div>
            <div style={{ fontSize: 13 }}>Try a different search or category</div>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(s => (
              <div key={s.id} className="sk-card" onClick={() => showAuth("signup")}>
                <div className="sk-cover" style={{ background: s.cover }}>
                  <div className="sk-cover-blur" style={{ background: s.cover }} />
                  <div className="sk-cover-icon">{s.emoji}</div>
                </div>
                <div className="sk-body">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <ModeBadge mode={s.mode} />
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--amber-b)" }}>★ {s.rating}</span>
                  </div>
                  <div className="sk-name">{s.name}</div>
                  <div className="sk-teacher">
                    <div className="sk-teacher-dot" style={{ background: s.avColor }}>{s.initials}</div>
                    {s.teacher}
                  </div>
                  <div className="sk-tags">{s.tags.map(t => <span key={t} className="sk-tag">{t}</span>)}</div>
                  <div className="sk-footer">
                    <span style={{ fontSize: 11, color: "var(--t4)" }}>{s.sessions} sessions</span>
                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); showAuth("signup"); }}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ChatPage() {
  const [activeConv, setActiveConv] = useState(0);
  const [messages, setMessages] = useState(CONVERSATIONS.map(c => [...c.msgs]));
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  const conv = CONVERSATIONS[activeConv];

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { me: true, text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => { const n = [...prev]; n[activeConv] = [...n[activeConv], newMsg]; return n; });
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = { me: false, text: CHAT_REPLIES[Math.floor(Math.random() * CHAT_REPLIES.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages(prev => { const n = [...prev]; n[activeConv] = [...n[activeConv], reply]; return n; });
    }, 1400);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, activeConv]);

  return (
    <div className="chat-layout" style={{ height: "calc(100vh - 0px)" }}>
      {/* Conversation list */}
      <div className="chat-sidebar">
        <div className="chat-sbar-hdr">
          <div className="disp-sm" style={{ marginBottom: 10 }}>Messages</div>
          <input className="input" placeholder="Search conversations..." style={{ fontSize: 12 }} />
        </div>
        <div className="chat-list overflow-y-auto">
          {CONVERSATIONS.map((c, i) => (
            <div key={c.id} className={`chat-item ${activeConv === i ? "active" : ""}`} onClick={() => setActiveConv(i)}>
              <div className="chat-av" style={{ background: c.color }}>
                {c.initials}
                {c.online && <div className="chat-online" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="chat-name">{c.name}</div>
                <div className="chat-preview-text">{c.preview}</div>
              </div>
              {c.unread > 0 && <span className="chat-unread">{c.unread}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-av" style={{ background: conv.color, width: 36, height: 36, fontSize: 12 }}>{conv.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{conv.name}</div>
            <div style={{ fontSize: 11, color: conv.online ? "var(--green-b)" : "var(--t4)" }}>
              {conv.online ? "● Online" : "○ Last seen 3h ago"}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm">📅 Book Session</button>
          <button className="btn btn-ghost btn-icon btn-sm">🎥</button>
        </div>

        <div className="chat-messages overflow-y-auto">
          {messages[activeConv].map((m, i) => (
            <div key={i} className={`msg-row ${m.me ? "me" : ""}`}>
              {!m.me && <div className="msg-av" style={{ background: conv.color }}>{conv.initials}</div>}
              <div>
                <div className="msg-bubble">{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
              {m.me && <div className="msg-av" style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)" }}>AK</div>}
            </div>
          ))}
          {typing && (
            <div className="msg-row">
              <div className="msg-av" style={{ background: conv.color }}>{conv.initials}</div>
              <div>
                <div className="msg-bubble" style={{ padding: "12px 16px" }}>
                  <div className="typing-dots">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <div className="chat-input-row">
            <span style={{ fontSize: 18, cursor: "pointer", opacity: .5 }}>😊</span>
            <input className="chat-input" placeholder={`Message ${conv.name}...`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
            <span style={{ fontSize: 16, cursor: "pointer", opacity: .5 }}>📎</span>
            <button className="send-btn" onClick={sendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function BookingPage({ showToast }) {
  const [selectedDay, setSelectedDay] = useState(20);
  const [selectedSlot, setSelectedSlot] = useState("9:00 AM");
  const sessions = [5, 12, 19, 26];
  const days = [...Array(6).fill(null), ...Array(31).keys()].map((d, i) => d === null ? null : d + 1);
  const slots = [
    { time: "9:00 AM", taken: false }, { time: "10:00 AM", taken: false }, { time: "11:00 AM", taken: true },
    { time: "12:00 PM", taken: false }, { time: "2:00 PM", taken: false }, { time: "3:00 PM", taken: false },
    { time: "4:00 PM", taken: true }, { time: "5:00 PM", taken: false }, { time: "6:00 PM", taken: false },
  ];

  const ModeBox = ({ icon, name, desc, color, active }) => (
    <div style={{ background: `rgba(${active ? "59,130,246" : "255,255,255"},.${active ? "08" : "02"})`, border: `${active ? 2 : 1}px solid rgba(${active ? "59,130,246" : "255,255,255"},.${active ? "3" : "06"})`, borderRadius: "var(--r-md)", padding: 12, cursor: "pointer", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: 13, color }}>{name}</span>
        {active && <span className="badge badge-blue">Active</span>}
      </div>
      <div style={{ fontSize: 11, color: "var(--t4)" }}>{desc}</div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Session Booking</div>
          <div className="page-sub">Schedule, manage, and track your learning sessions</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, padding: "24px 28px" }}>
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="disp-sm">📅 May 2025</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-ghost btn-sm">◀</button>
                <button className="btn btn-ghost btn-sm">▶</button>
              </div>
            </div>
            <div className="cal-hdr">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="cal-head">{d}</div>)}
            </div>
            <div className="cal-grid">
              {days.map((d, i) => (
                <button key={i} className={`cal-day ${d === null ? "empty" : ""} ${d === 20 ? "today" : ""} ${d === selectedDay ? "selected" : ""} ${sessions.includes(d) ? "has-session" : ""}`} onClick={() => d && setSelectedDay(d)}>
                  {d || ""}
                </button>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div className="disp-sm" style={{ marginBottom: 4 }}>🕐 Available Slots</div>
            <div style={{ fontSize: 11, color: "var(--t4)", marginBottom: 12 }}>May {selectedDay}, 2025 · Sneha Malhotra</div>
            <div className="time-slots">
              {slots.map(s => (
                <button key={s.time} className={`time-slot ${s.taken ? "taken" : ""} ${!s.taken && selectedSlot === s.time ? "selected-slot" : ""}`} onClick={() => !s.taken && setSelectedSlot(s.time)} disabled={s.taken}>
                  {s.time}{s.taken ? " ✕" : ""}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => showToast && showToast(`✅ Session booked: ${selectedSlot} on May ${selectedDay}`, "green")}>
              Confirm Booking
            </button>
          </div>
        </div>
        <div>
          <div className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div className="disp-sm" style={{ marginBottom: 12 }}>📬 Incoming Requests</div>
            {[
              { name: "Priya Mehta", init: "PM", color: "linear-gradient(135deg,#f59e0b,#ef4444)", skill: "Python · 1hr · Free", date: "May 22 · 11:00 AM", status: "Pending", statusCls: "badge-amber" },
              { name: "Rohan Kumar", init: "RK", color: "linear-gradient(135deg,#10b981,#06b6d4)", skill: "JavaScript · 2hr · Regular", date: "May 25 · 3:00 PM", status: "Confirmed", statusCls: "badge-green" },
            ].map(r => (
              <div key={r.name} style={{ background: "rgba(255,255,255,.02)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Avatar initials={r.init} color={r.color} size={34} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "var(--t4)" }}>{r.skill}</div>
                  </div>
                  <span className={`badge ${r.statusCls}`}>{r.status}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--t4)", marginBottom: 10 }}>📅 {r.date}</div>
                {r.status === "Pending" ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-green btn-xs">✓ Accept</button>
                    <button className="btn btn-danger btn-xs">✗ Decline</button>
                  </div>
                ) : (
                  <button className="btn btn-ghost btn-xs">View Details</button>
                )}
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="disp-sm" style={{ marginBottom: 12 }}>🎯 Session Mode</div>
            <ModeBox icon="🤖" name="Free — AI Chat" color="var(--green-b)" desc="24/7 AI chatbot, community Q&A, self-paced resources" active={false} />
            <ModeBox icon="🎥" name="Regular — Video Conf" color="var(--blue-b)" desc="Live 1:1 video with verified experts, recorded sessions" active={true} />
            <ModeBox icon="🎓" name="Advanced — In-Person" color="var(--purple-b)" desc="Tutor at your location, certifications, full resources" active={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ProfilePage({ setPage }) {
  const offerSkills = ["JavaScript", "React", "Node.js", "TypeScript", "CSS / Tailwind", "Git & GitHub"];
  const wantSkills = ["Machine Learning", "System Design", "Python Advanced", "Figma", "DSA"];
  const reviews = [
    { init: "SM", color: "linear-gradient(135deg,#3b82f6,#06b6d4)", name: "Sneha Malhotra", stars: "★★★★★", ago: "2 days ago", text: "Arjun is an excellent teacher. His React explanations are clear and practical. Highly recommended!" },
    { init: "VK", color: "linear-gradient(135deg,#f59e0b,#ef4444)", name: "Varun Khanna", stars: "★★★★★", ago: "1 week ago", text: "Great Node.js session. Very patient. The in-person Advanced session taught me more in 3 hours than months online." },
  ];

  return (
    <div>
      <div className="profile-hero">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 18 }}>
          <div className="profile-pic">AK</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--ff-disp)", fontSize: 22, fontWeight: 800 }}>Arjun Kapoor</div>
              <span className="badge badge-blue">Learner</span>
              <span className="badge badge-purple">Advanced Plan</span>
              <span className="badge badge-amber">🔥 14-day streak</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--t3)", marginTop: 4 }}>Full-Stack Developer · Mumbai, India · Joined Jan 2025</div>
            <div style={{ fontSize: 12, color: "var(--t2)", marginTop: 8, maxWidth: 460, lineHeight: 1.7 }}>Building products at the intersection of AI and education. Open to collaborating, teaching JS, and learning ML/AI.</div>
            <div className="profile-stats-row">
              {[["12", "Skills"], ["47", "Sessions"], ["4.9", "Rating"], ["23", "Reviews"], ["$420", "Earned"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div className="profile-stat-num">{n}</div>
                  <div className="profile-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm">✉️ Message</button>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("booking")}>📅 Book Session</button>
          </div>
        </div>
        <div>{["💻 JavaScript", "⚛️ React", "🟢 Node.js", "📘 TypeScript", "🐍 Python", "🎨 CSS"].map(t => <span key={t}><Tag>{t}</Tag></span>)}</div>
      </div>

      <div style={{ padding: "24px 28px" }}>
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="disp-sm" style={{ marginBottom: 4 }}>💡 Skills I Offer</div>
            <div style={{ fontSize: 12, color: "var(--t4)", marginBottom: 12 }}>What I can teach</div>
            <div>{offerSkills.map(s => <span key={s} className="skill-chip">{s}</span>)}</div>
          </div>
          <div className="card">
            <div className="disp-sm" style={{ marginBottom: 4 }}>📖 Skills I Want</div>
            <div style={{ fontSize: 12, color: "var(--t4)", marginBottom: 12 }}>What I'm learning</div>
            <div>{wantSkills.map(s => <span key={s} className="skill-chip want">{s}</span>)}</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="disp-sm" style={{ marginBottom: 14 }}>🏅 Achievements</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
            {ACHIEVEMENTS.map(a => (
              <div key={a.name} style={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: 12, textAlign: "center", opacity: a.locked ? .3 : 1 }}>
                <div style={{ fontSize: 22 }}>{a.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--t2)", marginTop: 5 }}>{a.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="disp-sm" style={{ marginBottom: 14 }}>⭐ Reviews</div>
          {reviews.map(r => (
            <div key={r.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: 18, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Avatar initials={r.init} color={r.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ color: "var(--amber-b)", fontSize: 12 }}>{r.stars}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--t4)" }}>{r.ago}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.75 }}>{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function AdminPage() {
  const users = [
    { name: "Sneha Malhotra", plan: "Regular", planCls: "badge-blue", role: "Earner", status: "Active", dotColor: "#10b981" },
    { name: "Vikram Rao", plan: "Advanced", planCls: "badge-purple", role: "Both", status: "Active", dotColor: "#10b981" },
    { name: "Priya Mehta", plan: "Free", planCls: "badge-green", role: "Learner", status: "Pending", dotColor: "#f59e0b" },
    { name: "Rohan Kumar", plan: "Regular", planCls: "badge-blue", role: "Earner", status: "Active", dotColor: "#10b981" },
    { name: "Zara Ali", plan: "Free", planCls: "badge-green", role: "Learner", status: "Flagged", dotColor: "#f43f5e" },
  ];
  const cats = [["Coding", 88], ["Design", 65], ["Business", 52], ["Languages", 41], ["Music", 28]];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🛡️ Admin Panel</div>
          <div className="page-sub">Platform overview · Last updated 5 min ago</div>
        </div>
        <button className="btn btn-primary btn-sm">+ Invite Admin</button>
      </div>
      <div className="page-content">
        <div className="grid-4" style={{ marginBottom: 20 }}>
          {[["👥", "47,284", "Total Users", "↑ 1,240 this week"], ["📅", "12,190", "Sessions / Week", "↑ 8% vs last"], ["🚨", "14", "Active Reports", "↑ 3 new today", "#f43f5e"], ["💳", "$92K", "MRR", "↑ $12K vs last"]].map(([icon, val, label, change, changeColor]) => (
            <div key={label} className="metric">
              <div className="metric-icon">{icon}</div>
              <div className="metric-val">{val}</div>
              <div className="metric-label">{label}</div>
              <div className="metric-change" style={{ color: changeColor || "var(--green-b)" }}>{change}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="admin-table">
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="disp-sm">Recent Users</div>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <table>
              <thead><tr><th>Name</th><th>Plan</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.name}>
                    <td>{u.name}</td>
                    <td><span className={`badge ${u.planCls}`}>{u.plan}</span></td>
                    <td>{u.role}</td>
                    <td><span className="status-dot" style={{ background: u.dotColor }} />{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="disp-sm" style={{ marginBottom: 16 }}>Top Skill Categories</div>
            {cats.map(([label, pct]) => (
              <div key={label} className="chart-row">
                <div className="chart-label-txt">{label}</div>
                <div className="chart-track"><div className="chart-fill" style={{ width: `${pct}%` }} /></div>
                <div className="chart-val-txt">{Math.round(pct * 100)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-table">
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="disp-sm">🚨 Flagged Reports</div>
            <button className="btn btn-ghost btn-sm">Mark All Read</button>
          </div>
          <table>
            <thead><tr><th>Reporter</th><th>Against</th><th>Reason</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>Priya M.</td><td>Zara Ali</td><td>No-show session</td><td>May 18</td><td><button className="btn btn-green btn-xs">Resolve</button></td></tr>
              <tr><td>Ankit S.</td><td>Unknown</td><td>Inappropriate chat</td><td>May 17</td><td><button className="btn btn-danger btn-xs">Ban User</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ContactPage({ showToast }) {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", topic: "", msg: "" });
  const [openFaq, setOpenFaq] = useState(null);

  const submit = () => {
    if (!form.fname || !form.email || !form.msg) { showToast && showToast("⚠️ Please fill required fields", "amber"); return; }
    showToast && showToast("✅ Message sent! We'll reply within 24h.", "green");
    setForm({ fname: "", lname: "", email: "", topic: "", msg: "" });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Get in Touch</div>
          <div className="page-sub">We'd love to hear from you</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40, padding: "32px 28px", alignItems: "start" }}>
        <div>
          <div className="disp-md" style={{ marginBottom: 14 }}>Let's <span className="grad-blue">Connect</span></div>
          <p style={{ fontSize: 14, color: "var(--t3)", lineHeight: 1.8, marginBottom: 32 }}>Whether you're a student, creator, investor, or just curious — we reply within 24 hours.</p>
          {[["📧", "Email", "hello@skillswap.io"], ["🐦", "Twitter / X", "@SkillSwapHQ"], ["💼", "Partnerships", "partners@skillswap.io"], ["📍", "Headquarters", "Mumbai, India · San Francisco, CA"]].map(([icon, label, detail]) => (
            <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
              <div className="contact-icon-box">{icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, color: "var(--t3)" }}>{detail}</div>
              </div>
            </div>
          ))}
          <Divider />
          <div className="disp-sm" style={{ marginBottom: 14, marginTop: 14 }}>Frequently Asked</div>
          {FAQS.map((f, i) => (
            <div key={i} className="faq-item">
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span style={{ fontSize: 16, color: "var(--t3)", transform: openFaq === i ? "rotate(45deg)" : "none", transition: ".2s", flexShrink: 0 }}>+</span>
              </button>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div className="disp-sm" style={{ marginBottom: 6 }}>Send a Message</div>
          <div style={{ fontSize: 13, color: "var(--t4)", marginBottom: 22 }}>We reply within 24 hours · No spam, ever.</div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">First Name</label><input className="input" placeholder="Arjun" value={form.fname} onChange={e => setForm({ ...form, fname: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input className="input" placeholder="Kapoor" value={form.lname} onChange={e => setForm({ ...form, lname: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Email Address</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group">
            <label className="form-label">Topic</label>
            <select className="input" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}>
              <option value="">Select a topic</option>
              <option>Partnership / Investment</option><option>Technical Support</option>
              <option>Billing Query</option><option>Report a User</option><option>General Feedback</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Message</label><textarea className="input" placeholder="Tell us how we can help..." value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 13 }} onClick={submit}>Send Message ✉️</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGE (standalone view)
// ─────────────────────────────────────────────────────────────────────────────
function AuthPage({ showAuth }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40, position: "relative", overflow: "hidden" }}>
      <div className="orb-field"><div className="orb orb1" style={{ opacity: .15 }} /><div className="orb orb2" style={{ opacity: .1 }} /></div>
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 400 }}>
        <LogoMark size="lg" />
        <h1 className="disp-lg" style={{ margin: "28px 0 14px" }}>Join <span className="grad-blue">SkillSwap</span></h1>
        <p style={{ fontSize: 15, color: "var(--t3)", lineHeight: 1.8, marginBottom: 36 }}>The world's first peer-to-peer skill exchange. Sign up as a Learner, Earner, or both.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          <button className="btn btn-primary btn-lg" onClick={() => showAuth("signup")}>Create Free Account →</button>
          <button className="btn btn-ghost btn-lg" onClick={() => showAuth("login")}>Sign In</button>
        </div>
        <p style={{ fontSize: 12, color: "var(--t4)" }}>No credit card required · Free forever plan available</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING PAGE (standalone)
// ─────────────────────────────────────────────────────────────────────────────
function OnboardingPage({ showToast, setPage }) {
  const [show, setShow] = useState(true);
  if (!show) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
      <h2 className="disp-md">Profile Launched!</h2>
      <p style={{ color: "var(--t3)", marginTop: 10, marginBottom: 24 }}>You're all set. Let's find your skill matches.</p>
      <button className="btn btn-primary" onClick={() => setPage("dashboard")}>Go to Dashboard →</button>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40 }}>
      <OnboardingModal onClose={() => setShow(false)} onFinish={() => { setShow(false); showToast && showToast("🎉 Welcome to SkillSwap!", "green"); setPage("dashboard"); }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 404 PAGE
// ─────────────────────────────────────────────────────────────────────────────
function NotFoundPage({ setPage }) {
  return (
    <div className="not-found">
      <div className="orb-field"><div className="orb orb2" style={{ opacity: .1 }} /></div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <div className="nf-num">404</div>
        <h2 className="disp-md" style={{ marginBottom: 10 }}>Skill Not Found</h2>
        <p style={{ fontSize: 14, color: "var(--t4)", marginBottom: 28 }}>Looks like this page took a detour. Let's get you back to learning.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
          <button className="btn btn-primary" onClick={() => setPage("landing")}>← Go Home</button>
          <button className="btn btn-ghost" onClick={() => setPage("marketplace")}>Browse Skills</button>
        </div>
        {/* Skeleton loader preview */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <div className="skeleton" style={{ width: 110, height: 110, borderRadius: "var(--r-xl)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="skeleton" style={{ width: 200, height: 14, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: 160, height: 10, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: 180, height: 10, borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--t4)", marginTop: 12 }}>↑ Skeleton loader preview</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [isDark, setIsDark] = useState(true);
  const [authModal, setAuthModal] = useState(null); // null | { tab, plan }
  const [showOnboard, setShowOnboard] = useState(false);
  const { toasts, show: showToast } = useToast();

  // Inject CSS once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Dark/light body class
  useEffect(() => {
    document.body.className = isDark ? "" : "light";
  }, [isDark]);

  const showAuth = (tab = "signup", plan = "free") => {
    setAuthModal({ tab, plan });
  };

  const handleAuthSuccess = (type) => {
    setAuthModal(null);
    if (type === "login") {
      showToast("✅ Welcome back! Loading your dashboard...", "green");
      setTimeout(() => setPage("dashboard"), 800);
    } else {
      setTimeout(() => setShowOnboard(true), 300);
    }
  };

  // Pages that use the app shell (sidebar layout)
  const shellPages = ["dashboard", "marketplace", "chat", "booking", "profile", "admin", "contact"];
  const useShell = shellPages.includes(page);

  const renderPage = () => {
    switch (page) {
      case "landing": return <LandingPage setPage={setPage} showAuth={showAuth} />;
      case "dashboard": return <DashboardPage setPage={setPage} showAuth={showAuth} />;
      case "marketplace": return <MarketplacePage showAuth={showAuth} />;
      case "chat": return <ChatPage />;
      case "booking": return <BookingPage showToast={showToast} />;
      case "profile": return <ProfilePage setPage={setPage} />;
      case "admin": return <AdminPage />;
      case "contact": return <ContactPage showToast={showToast} />;
      case "auth": return <AuthPage showAuth={showAuth} />;
      case "onboarding": return <OnboardingPage showToast={showToast} setPage={setPage} />;
      case "notfound": return <NotFoundPage setPage={setPage} />;
      default: return <NotFoundPage setPage={setPage} />;
    }
  };

  return (
    <div className="ss-app">
      {/* Theme + quick-nav bar (visible on non-shell pages) */}
      {!useShell && page !== "landing" && (
        <div style={{ position: "fixed", top: 16, right: 20, z: 800, display: "flex", gap: 8, zIndex: 800 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setIsDark(d => !d)} style={{ fontSize: 16 }}>{isDark ? "🌙" : "☀️"}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage("landing")}>← Home</button>
        </div>
      )}

      {useShell ? (
        <div className="app-shell">
          <Sidebar page={page} setPage={setPage} />
          <div className="page-main">
            {/* Theme toggle in shell */}
            <div style={{ position: "absolute", top: 14, right: 20, zIndex: 100, display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsDark(d => !d)} title="Toggle theme">{isDark ? "🌙" : "☀️"}</button>
            </div>
            {renderPage()}
          </div>
        </div>
      ) : (
        renderPage()
      )}

      {/* AUTH MODAL */}
      {authModal && (
        <AuthModal
          defaultTab={authModal.tab}
          defaultPlan={authModal.plan}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* ONBOARDING MODAL */}
      {showOnboard && (
        <OnboardingModal
          onClose={() => setShowOnboard(false)}
          onFinish={() => {
            setShowOnboard(false);
            showToast("🎉 Profile created! Welcome to SkillSwap!", "green");
            setTimeout(() => showToast("🤖 AI is finding your perfect matches...", "blue"), 1600);
            setPage("dashboard");
          }}
        />
      )}

      {/* TOASTS */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
