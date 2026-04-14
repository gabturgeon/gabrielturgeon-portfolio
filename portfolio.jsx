import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  dark: {
    bg:"#080808",bgAlt:"#0e0e0e",bgCard:"#111",
    border:"rgba(255,255,255,0.07)",borderHov:"rgba(192,57,43,0.5)",
    text:"#f0ece4",muted:"rgba(240,236,228,0.38)",sub:"rgba(240,236,228,0.6)",
    accent:"#c0392b",glow:"rgba(192,57,43,0.25)",accentBg:"rgba(192,57,43,0.09)",
    accentBorder:"rgba(192,57,43,0.28)",navBg:"rgba(8,8,8,0.94)",
    chipBg:"rgba(255,255,255,0.04)",chipBorder:"rgba(255,255,255,0.08)",
    grad:"linear-gradient(135deg,#c0392b,#922b21)",
    gradText:"linear-gradient(135deg,#e05040,#c0392b,#922b21)",
    orb1:"rgba(192,57,43,0.13)",orb2:"rgba(146,43,33,0.08)",
    divider:"rgba(192,57,43,0.28)",
    overlay:"rgba(0,0,0,0.82)",
  },
  light: {
    bg:"#faf8f5",bgAlt:"#fff",bgCard:"#fff",
    border:"rgba(0,0,0,0.07)",borderHov:"rgba(192,57,43,0.4)",
    text:"#1a1412",muted:"rgba(26,20,18,0.38)",sub:"rgba(26,20,18,0.58)",
    accent:"#c0392b",glow:"rgba(192,57,43,0.15)",accentBg:"rgba(192,57,43,0.06)",
    accentBorder:"rgba(192,57,43,0.24)",navBg:"rgba(250,248,245,0.94)",
    chipBg:"rgba(0,0,0,0.04)",chipBorder:"rgba(0,0,0,0.08)",
    grad:"linear-gradient(135deg,#c0392b,#922b21)",
    gradText:"linear-gradient(135deg,#c0392b,#922b21)",
    orb1:"rgba(192,57,43,0.06)",orb2:"rgba(146,43,33,0.04)",
    divider:"rgba(192,57,43,0.2)",
    overlay:"rgba(0,0,0,0.6)",
  },
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV = ["About","Skills","Projects","Commissions","Experience","Testimonials","Contact"];

const SKILLS = [
  {name:"React"},{name:"TypeScript"},{name:"Next.js"},{name:"Node.js"},
  {name:"Python"},{name:"PostgreSQL"},{name:"JavaScript"},{name:"Tailwind CSS"},
  {name:"HTML"},{name:"CSS"},{name:"Supabase"},
];

const PROFILE_IMAGE = "assets/profile.jpg";

const PROJECTS = [
  { title:"NeuroFlow AI Dashboard",year:"2024",icon:"analytics",
    image:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    desc:"Real-time analytics platform processing 10M+ events/day with sub-100ms latency.",
    fullDesc:"NeuroFlow is a production-grade analytics platform built for data-intensive applications. Using Apache Kafka for stream processing and a Python ML backend, it delivers anomaly detection, forecasting, and pattern recognition in real time. The React dashboard features a drag-and-drop chart builder, multi-tenant auth, and a WebSocket push layer for live updates.",
    highlights:["10M+ events/day","<100ms P99 latency","Custom ML anomaly detection","Multi-tenant RBAC","Drag-and-drop dashboard builder"],
    tags:["React","Node.js","Python","Kafka","PostgreSQL"],link:null,github:null },
  { title:"DeployHub — CI/CD",year:"2023",icon:"deploy",
    image:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    desc:"Self-hosted multi-cloud deployment platform. Reduced deploy times by 70%.",
    fullDesc:"DeployHub is a self-hosted CI/CD platform that orchestrates deployments across AWS, GCP, and Azure from a single UI. Built with TypeScript and a Kubernetes operator, it manages 200+ microservices with zero-downtime rolling deploys, automatic rollbacks, and Slack notifications. Cut average deploy time from 14 minutes to under 4.",
    highlights:["70% faster deployments","200+ microservices","Zero-downtime rollbacks","Multi-cloud (AWS/GCP/Azure)","Slack & webhook notifications"],
    tags:["TypeScript","Kubernetes","Docker","AWS","Terraform"],link:null,github:null },
  { title:"OpenCart E-Commerce",year:"2023",icon:"commerce",
    image:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    desc:"High-performance backend handling $2M+ monthly transactions.",
    fullDesc:"A headless e-commerce engine powering a retail brand with $2M+ in monthly GMV. Leverages Next.js for the storefront, a GraphQL API layer for flexible data fetching, Redis for cart and session caching, and Stripe for payments. Includes a real-time inventory sync service and a machine-learning recommendation engine trained on purchase history.",
    highlights:["$2M+ monthly GMV","Sub-200ms storefront TTI","ML recommendation engine","Real-time inventory sync","PCI-compliant checkout"],
    tags:["Next.js","GraphQL","Redis","Stripe","Elastic"],link:null,github:null },
  { title:"SyncSpace Collaboration",year:"2022",icon:"collaboration",
    image:"https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    desc:"Conflict-free real-time workspace supporting 1000+ concurrent users per doc.",
    fullDesc:"SyncSpace is a collaborative workspace tool (think Notion + Figma) that uses CRDTs (Conflict-free Replicated Data Types) to enable conflict-free real-time editing across thousands of concurrent sessions. The backend uses Node.js with a custom operational transform engine, and the React frontend renders updates at 60fps even under heavy load.",
    highlights:["1000+ concurrent users/doc","CRDT conflict resolution","60fps real-time rendering","Offline-first with sync","End-to-end encrypted content"],
    tags:["React","WebSockets","CRDTs","Node.js","MongoDB"],link:null,github:null },
  { title:"AuthKit SDK",year:"2022",icon:"security",
    image:"https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
    desc:"Open-source auth library with OAuth2, PKCE, and MFA. 2K+ GitHub stars.",
    fullDesc:"AuthKit is an open-source TypeScript SDK that wraps OAuth2, PKCE, magic links, and TOTP MFA into a single, framework-agnostic package. It integrates natively with Supabase, PostgreSQL-backed sessions, and custom auth providers. Published on npm with full TypeScript generics, tree-shaking, and a zero-dependency core.",
    highlights:["2K+ GitHub stars","Zero-dependency core","OAuth2 + PKCE + MFA","Supabase integration","Full TypeScript generics"],
    tags:["TypeScript","PostgreSQL","Supabase","OAuth2"],link:null,github:null },
  { title:"PulseMetrics",year:"2021",icon:"metrics",
    image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    desc:"Lightweight self-hostable product analytics with funnels and retention.",
    fullDesc:"PulseMetrics is a lightweight, privacy-first analytics tool you can self-host in under 5 minutes. It tracks events, builds funnels, computes retention cohorts, and renders charts — all from a single Next.js app backed by Python. No cookies, no third-party trackers, and a one-click Docker deployment.",
    highlights:["Self-hostable in <5 min","Cookie-free tracking","Funnel & cohort analysis","One-click Docker deploy","Real-time event stream"],
    tags:["Next.js","Python","AWS","PostgreSQL"],link:null,github:null },
];

const COMMISSIONS = [
  { client:"Verdant Studio",type:"Full-Stack Web App",year:"2024",icon:"studio",
    image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    desc:"End-to-end booking platform for a creative agency built with Next.js and Supabase.",
    fullDesc:"Designed and built a complete client-facing booking and project management platform. Features include a custom CMS, availability calendar, contract e-signing, invoice generation, and a Stripe-powered payment flow. The admin dashboard gives the studio real-time visibility into their pipeline.",
    highlights:["Custom headless CMS","Stripe invoice + payments","Contract e-signing","Availability calendar","Mobile-first responsive UI"],
    tags:["Next.js","Supabase","Tailwind CSS"],link:null,status:"Delivered" },
  { client:"NorthBridge Capital",type:"Internal Dashboard",year:"2024",icon:"finance",
    image:"https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    desc:"Custom portfolio analytics dashboard aggregating data from multiple financial APIs.",
    fullDesc:"Built a secure internal dashboard for a boutique investment firm to track their portfolio in real time. Pulls data from Bloomberg, Refinitiv, and proprietary APIs, normalizes it into a PostgreSQL data warehouse, and serves it through a React dashboard with exportable PDF reports.",
    highlights:["Multi-API data aggregation","PDF reporting engine","Role-based access control","Real-time price feeds","SOC 2 compliant"],
    tags:["React","TypeScript","PostgreSQL"],link:null,status:"Delivered" },
  { client:"Lumière Events",type:"Landing Page + CMS",year:"2023",icon:"events",
    image:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    desc:"High-conversion event marketing site with multilingual support and headless CMS.",
    fullDesc:"Created a visually rich event marketing site with an integrated headless CMS so the client can update content without a developer. Supports English and French, includes custom animations, RSVP flows, and integrates with Mailchimp for attendee nurturing.",
    highlights:["EN/FR multilingual","Custom animation system","RSVP + Mailchimp flows","Headless CMS","PageSpeed 98/100"],
    tags:["Next.js","Tailwind CSS","REST APIs"],link:null,status:"Delivered" },
  { client:"Arcane Labs",type:"API Integration Layer",year:"2023",icon:"integration",
    image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    desc:"Middleware service connecting Shopify, HubSpot, and Slack with automated workflows.",
    fullDesc:"Designed a Node.js middleware service that acts as an event bus between Shopify orders, HubSpot CRM records, and Slack notifications. Includes a no-code workflow builder for the client team, retry queues with exponential backoff, and a monitoring dashboard.",
    highlights:["3-platform integration","No-code workflow builder","Retry queues + backoff","Event replay support","<50ms webhook latency"],
    tags:["Node.js","REST APIs","AWS"],link:null,status:"Delivered" },
  { client:"Maison Dubois",type:"E-Commerce Migration",year:"2022",icon:"migration",
    image:"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
    desc:"Migrated a legacy Magento store to Next.js Commerce with custom checkout.",
    fullDesc:"Full platform migration from a slow, outdated Magento 1 store to a blazing-fast Next.js storefront. Zero data loss, custom checkout flow, persistent cart, and a 12× improvement in Lighthouse performance score. Completed ahead of the holiday shopping season.",
    highlights:["12× Lighthouse improvement","Zero data loss migration","Custom checkout flow","Persistent cart sync","Pre-holiday delivery"],
    tags:["Next.js","PostgreSQL","Stripe"],link:null,status:"Delivered" },
  { client:"Pulse Health",type:"Patient Portal",year:"2022",icon:"health",
    image:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    desc:"HIPAA-compliant patient portal with appointment booking and secure messaging.",
    fullDesc:"Built a HIPAA-compliant patient portal for a telehealth provider. Features include online appointment scheduling, async secure messaging with providers, lab result uploads, and insurance card management. Fully audited for HIPAA compliance and integrated with their existing EHR via HL7 FHIR.",
    highlights:["HIPAA compliant","HL7 FHIR EHR integration","Secure async messaging","Lab result management","Appointment scheduling"],
    tags:["React","Node.js","PostgreSQL"],link:null,status:"Delivered" },
];

const EXPERIENCE = [
  { role:"Senior Software Engineer",company:"Acme Tech Corp",period:"2022 – Present",
    desc:"Led distributed microservices platform serving 5M users. Drove 40% infrastructure cost reduction.",type:"work" },
  { role:"Software Engineer II",company:"Startup Labs Inc.",period:"2020 – 2022",
    desc:"Built core product 0 → 1, scaling to 50K users in 18 months with a GraphQL API layer.",type:"work" },
  { role:"Junior Software Engineer",company:"Digital Agency Co.",period:"2018 – 2020",
    desc:"Full-stack apps for 20+ enterprise clients, specializing in performance optimization.",type:"work" },
  { role:"B.Sc. Computer Science",company:"University of Technology",period:"2014 – 2018",
    desc:"Graduated with Distinction. Algorithms, Distributed Systems & ML. Dean's List.",type:"edu" },
];

const TESTIMONIALS = [
  { name:"Sarah Chen",role:"CTO @ Acme Tech Corp",initials:"SC",color:"#c0392b",
    photo:null,
    text:"One of the most talented engineers I've worked with. Their ability to break down complex distributed systems and deliver clean, scalable code is truly exceptional — a force multiplier on any team." },
  { name:"Marcus Reyes",role:"Engineering Manager @ Startup Labs",initials:"MR",color:"#922b21",
    photo:null,
    text:"Gab shipped our real-time engine three weeks ahead of schedule. They understand both the technical and product side of problems in a way that is genuinely rare." },
  { name:"Priya Nair",role:"Lead Designer @ Startup Labs",initials:"PN",color:"#7b241c",
    photo:null,
    text:"Working with Gab bridged design and engineering perfectly. Always open to feedback, incredibly fast at iteration — results consistently exceeded every expectation." },
];

const ROTATE_MS = 8000;

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useScrollSpy() {
  const [a,setA] = useState("About");
  useEffect(() => {
    const h = () => { for (const id of [...NAV].reverse()) { const el=document.getElementById(id); if(el && window.scrollY>=el.offsetTop-130){setA(id);break;} } };
    window.addEventListener("scroll",h,{passive:true});
    return()=>window.removeEventListener("scroll",h);
  },[]);
  return a;
}

function useInView(ref,threshold=0.12) {
  const [v,setV] = useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold});
    if(ref.current)o.observe(ref.current);
    return()=>o.disconnect();
  },[ref,threshold]);
  return v;
}

function useWidth() {
  const [w,setW] = useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{
    const h=()=>setW(window.innerWidth);
    window.addEventListener("resize",h,{passive:true});
    return()=>window.removeEventListener("resize",h);
  },[]);
  return w;
}

function Reveal({children,delay=0,y=26,x=0,style}) {
  const ref=useRef(null);
  const v=useInView(ref);
  return(
    <div ref={ref} style={{opacity:v?1:0,transform:v?"none":`translate(${x}px,${y}px)`,
      transition:`opacity 0.65s ease ${delay}ms,transform 0.65s ease ${delay}ms`,...style}}>
      {children}
    </div>
  );
}

// ─── SVG TECH ICONS ──────────────────────────────────────────────────────────
const TechIcon = ({name,size=26})=>{
  const s=size;
  switch(name){
    case"React":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><circle cx="25" cy="25" r="4.5" fill="#61DAFB"/><ellipse cx="25" cy="25" rx="22" ry="8.5" stroke="#61DAFB" strokeWidth="2.5"/><ellipse cx="25" cy="25" rx="22" ry="8.5" stroke="#61DAFB" strokeWidth="2.5" transform="rotate(60 25 25)"/><ellipse cx="25" cy="25" rx="22" ry="8.5" stroke="#61DAFB" strokeWidth="2.5" transform="rotate(-60 25 25)"/></svg>;
    case"TypeScript":return<svg width={s} height={s} viewBox="0 0 50 50"><rect x="1" y="1" width="48" height="48" rx="7" fill="#3178C6"/><text x="6" y="38" fill="white" style={{fontSize:24,fontWeight:"900",fontFamily:"Arial,sans-serif"}}>TS</text></svg>;
    case"Next.js":return<svg width={s} height={s} viewBox="0 0 50 50"><circle cx="25" cy="25" r="24" fill="#000" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/><path d="M14 14L14 36L18 36L18 20L32 36L36 36L36 14L32 14L32 30L18 14Z" fill="white"/></svg>;
    case"Node.js":return<svg width={s} height={s} viewBox="0 0 50 50"><polygon points="25,3 46,14.5 46,35.5 25,47 4,35.5 4,14.5" fill="#539E43"/><text x="13" y="32" fill="white" style={{fontSize:15,fontWeight:"900",fontFamily:"Arial,sans-serif"}}>JS</text></svg>;
    case"Python":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><path d="M25 4C17 4 13 8 13 14L13 19L25 19L25 22L10 22C6 22 3 26 3 34C3 41 6 46 13 46L18 46L18 41C18 38 20 36 25 36L35 36C39 36 42 33 42 28L42 19C42 11 38 4 25 4Z" fill="#3776AB"/><path d="M25 46C33 46 37 42 37 36L37 31L25 31L25 28L40 28C44 28 47 24 47 16C47 9 44 4 37 4L32 4L32 9C32 12 30 14 25 14L15 14C11 14 8 17 8 22L8 31C8 39 12 46 25 46Z" fill="#FFD343"/><circle cx="19" cy="12" r="2.5" fill="white"/><circle cx="31" cy="38" r="2.5" fill="#3776AB"/></svg>;
    case"PostgreSQL":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><ellipse cx="25" cy="12" rx="18" ry="7" fill="#4a90c4"/><rect x="7" y="12" width="36" height="20" fill="#336791"/><ellipse cx="25" cy="32" rx="18" ry="7" fill="#336791"/><ellipse cx="25" cy="12" rx="18" ry="7" fill="#4a90c4"/><ellipse cx="25" cy="22" rx="18" ry="7" fill="none" stroke="#4a90c4" strokeWidth="1.5"/></svg>;
    case"REST APIs":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><circle cx="10" cy="25" r="6" fill="#c0392b"/><circle cx="40" cy="14" r="6" fill="#c0392b"/><circle cx="40" cy="36" r="6" fill="#c0392b"/><line x1="16" y1="23" x2="34" y2="16" stroke="#c0392b" strokeWidth="2.2"/><line x1="16" y1="27" x2="34" y2="34" stroke="#c0392b" strokeWidth="2.2"/></svg>;
    case"Tailwind CSS":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><path d="M12 20C14 13 19 9 26 9C20 13 19 19 22 23C25 27 30 25 34 21C32 28 27 32 20 32C26 28 27 22 24 18C21 14 16 16 12 20Z" fill="#38BDF8"/><path d="M28 32C30 25 35 21 42 21C36 25 35 31 38 35C41 39 46 37 50 33C48 40 43 44 36 44C42 40 43 34 40 30C37 26 32 28 28 32Z" fill="#38BDF8"/></svg>;
    case"JavaScript":return<svg width={s} height={s} viewBox="0 0 50 50"><rect x="1" y="1" width="48" height="48" rx="5" fill="#F7DF1E"/><text x="4" y="38" fill="#000" style={{fontSize:22,fontWeight:"900",fontFamily:"Arial,sans-serif"}}>JS</text></svg>;
    case"HTML":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><rect x="1" y="1" width="48" height="48" rx="5" fill="#E34F26"/><path d="M14 13L25 13L25 21L18 21L18.5 27L25 27L25 35L17 33L16.5 28L14 28L14.7 36L25 40L25 13Z" fill="white"/><path d="M25 13L36 13L35.3 21L25 21L25 27L34.5 27L33 38L25 40L25 35L31 33L31.5 28L25 28Z" fill="white"/></svg>;
    case"CSS":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><rect x="1" y="1" width="48" height="48" rx="5" fill="#1572B6"/><text x="7" y="38" fill="white" style={{fontSize:20,fontWeight:"900",fontFamily:"Arial,sans-serif"}}>CSS</text></svg>;
    case"AWS":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><path d="M8 28C5 27 3 24 4 21C5 18 8 17 11 18C11 14 14 11 18 11C19 11 20 11 21 12C22 8 26 5 31 6C36 7 39 12 38 17C40 17 43 19 43 22C43 25 41 28 38 28Z" fill="#FF9900"/><path d="M17 37Q25 41 33 37" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>;
    case"Supabase":return<svg width={s} height={s} viewBox="0 0 50 50" fill="none"><defs><linearGradient id="sbg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3FCF8E"/><stop offset="100%" stopColor="#1EA672"/></linearGradient></defs><path d="M27 5L6 30L20 30L23 45L44 20L30 20Z" fill="url(#sbg2)"/></svg>;
    default:return<svg width={s} height={s} viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="#c0392b"/></svg>;
  }
};

const IconGlyph=({name,size=24,color="currentColor"})=>{
  const common={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:color,strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"};
  switch(name){
    case"analytics":return<svg {...common}><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15l3-4 3 2 4-6"/><path d="M18 7h2v2"/></svg>;
    case"deploy":return<svg {...common}><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 16v3h14v-3"/><path d="M8 19h8"/></svg>;
    case"commerce":return<svg {...common}><path d="M6 7h15l-2 8H8L6 7Z"/><path d="M6 7 5 4H2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>;
    case"collaboration":return<svg {...common}><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 20c.8-3.3 2.7-5 5-5s4.2 1.7 5 5"/><path d="M11 16c1-.7 2.2-1 3.5-1 2.3 0 4.2 1.7 5 5"/></svg>;
    case"security":return<svg {...common}><path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.8 1.8 3.7-4"/></svg>;
    case"metrics":return<svg {...common}><path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/></svg>;
    case"studio":return<svg {...common}><path d="M4 20h16"/><path d="M6 17V7l6-3 6 3v10"/><path d="M9 17v-6h6v6"/></svg>;
    case"finance":return<svg {...common}><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 14 4-4 3 3 5-7"/></svg>;
    case"events":return<svg {...common}><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/><path d="M9 15h6"/></svg>;
    case"integration":return<svg {...common}><path d="M8 12h8"/><path d="M6 8a4 4 0 0 0 0 8"/><path d="M18 8a4 4 0 0 1 0 8"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>;
    case"migration":return<svg {...common}><path d="M5 5h10v6H5z"/><path d="M9 15h10v4H9z"/><path d="M15 8h3a3 3 0 0 1 0 6H9"/><path d="m11 12-2 2 2 2"/></svg>;
    case"health":return<svg {...common}><path d="M20.5 9.5c0 5-8.5 10-8.5 10s-8.5-5-8.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 2.5Z"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>;
    case"work":return<svg {...common}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 12h18"/></svg>;
    case"education":return<svg {...common}><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 11v5c2.8 2 7.2 2 10 0v-5"/><path d="M21 9v6"/></svg>;
    case"sun":return<svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
    case"moon":return<svg {...common}><path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>;
    case"user":return<svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.8-4 4.4-6 8-6s6.2 2 8 6"/></svg>;
    default:return<svg {...common}><rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 12h6"/></svg>;
  }
};

// Social SVG icons
const GithubIcon=({size=18,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill={color||"currentColor"}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const LinkedInIcon=({size=18,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill={color||"currentColor"}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const MailIcon=({size=18,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;
const InstagramIcon=({size=18,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill={color||"currentColor"}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const YouTubeIcon=({size=18,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill={color||"currentColor"}><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>;

const SOCIALS = [
  {label:"GitHub",   Icon:GithubIcon,   href:"https://github.com/gvbs"},
  {label:"LinkedIn", Icon:LinkedInIcon, href:"https://linkedin.com/in/gvbs"},
  {label:"Instagram",Icon:InstagramIcon,href:"https://instagram.com/gvbs"},
  {label:"YouTube",  Icon:YouTubeIcon,  href:"https://youtube.com/@gvbs"},
  {label:"Email",    Icon:MailIcon,     href:"mailto:hello@gvbs.dev"},
];

// ─── SHARED UI ───────────────────────────────────────────────────────────────
function BoldLabel({t,children}) {
  return(
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,justifyContent:"center"}}>
      <div style={{flex:1,maxWidth:56,height:1,background:t.divider}}/>
      <span style={{fontFamily:"'Inter',sans-serif",fontSize:10,fontWeight:800,
        color:t.accent,letterSpacing:"0.22em",textTransform:"uppercase"}}>{children}</span>
      <div style={{flex:1,maxWidth:56,height:1,background:t.divider}}/>
    </div>
  );
}
function Ornament({t}) {
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:8}}>
      <div style={{width:28,height:1,background:t.divider}}/>
      <div style={{width:4,height:4,background:t.accent,transform:"rotate(45deg)",opacity:0.7}}/>
      <div style={{width:28,height:1,background:t.divider}}/>
    </div>
  );
}
function DisplayHead({t,children,align="center"}) {
  const words=children.split(" ");const last=words.pop();
  return(
    <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:600,
      fontSize:"clamp(2rem,4.5vw,3.4rem)",lineHeight:1.08,letterSpacing:"-0.01em",
      marginBottom:6,textAlign:align,color:t.text}}>
      {words.join(" ")}{" "}
      <em style={{WebkitTextFillColor:"transparent",WebkitBackgroundClip:"text",
        backgroundClip:"text",backgroundImage:t.gradText,fontStyle:"italic"}}>{last}</em>
    </h2>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({item,t,onClose,isCommission}) {
  const w=useWidth();
  const isMobile=w<640;
  useEffect(()=>{
    const h=e=>{if(e.key==="Escape")onClose();};
    document.body.style.overflow="hidden";
    window.addEventListener("keydown",h);
    return()=>{document.body.style.overflow="";window.removeEventListener("keydown",h);};
  },[onClose]);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:3000,
      background:t.overlay,backdropFilter:"blur(10px)",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:isMobile?"12px":"24px",overflowY:"auto"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:t.bgCard,borderRadius:8,border:`1px solid ${t.accentBorder}`,
          width:"100%",maxWidth:720,maxHeight:"90vh",overflowY:"auto",
          boxShadow:`0 40px 80px ${t.glow},0 0 0 1px ${t.border}`,
          animation:"modalIn 0.28s cubic-bezier(0.34,1.4,0.64,1)"}}>
        {/* Header */}
        <div style={{padding:isMobile?"20px 20px 16px":"28px 32px 20px",
          borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:6,background:t.accentBg,
              border:`1px solid ${t.accentBorder}`,display:"flex",alignItems:"center",
              justifyContent:"center",flexShrink:0,color:t.accent}}>
              <IconGlyph name={item.icon} size={25}/>
            </div>
            <div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,
                fontSize:isMobile?"20px":"24px",color:t.text,lineHeight:1.2}}>{item.title||item.client}</h3>
              {isCommission&&<div style={{fontFamily:"'Inter',sans-serif",color:t.accent,
                fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:3}}>{item.type}</div>}
              {!isCommission&&<div style={{fontFamily:"'Cormorant Garamond',serif",color:t.muted,
                fontSize:14,fontStyle:"italic",marginTop:2}}>{item.year}</div>}
            </div>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${t.border}`,
            color:t.muted,width:32,height:32,borderRadius:4,cursor:"pointer",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            transition:"all 0.2s"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor=t.accentBorder;e.currentTarget.style.color=t.accent;}}
            onMouseOut={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.muted;}}>×</button>
        </div>
        {/* Body */}
        <div style={{padding:isMobile?"20px":"28px 32px"}}>
          {item.image&&(
            <div style={{height:isMobile?180:240,borderRadius:6,overflow:"hidden",
              border:`1px solid ${t.border}`,marginBottom:24,background:t.bgAlt}}>
              <img src={item.image} alt={`${item.title||item.client} visual`} loading="lazy"
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
                  filter:"saturate(0.9) contrast(1.05)"}}/>
            </div>
          )}
          <p style={{fontFamily:"'Inter',sans-serif",color:t.sub,fontSize:14,
            lineHeight:1.8,marginBottom:24,fontWeight:300}}>{item.fullDesc}</p>
          {/* Highlights */}
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:10,
              fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>
              Key Highlights
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {item.highlights.map(h=>(
                <div key={h} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:4,height:4,background:t.accent,borderRadius:"50%",flexShrink:0}}/>
                  <span style={{fontFamily:"'Inter',sans-serif",color:t.sub,fontSize:13,fontWeight:300}}>{h}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Tags */}
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:24}}>
            {item.tags.map(tag=>(
              <span key={tag} style={{fontFamily:"'Inter',sans-serif",padding:"3px 10px",borderRadius:3,
                background:t.accentBg,border:`1px solid ${t.accentBorder}`,
                color:t.accent,fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>{tag}</span>
            ))}
          </div>
          {/* Links */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {item.link&&(
              <a href={item.link} target="_blank" rel="noreferrer"
                style={{padding:"10px 24px",borderRadius:4,background:t.grad,color:"#fff",
                  fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:11,
                  letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none",
                  transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:6}}
                onMouseOver={e=>e.currentTarget.style.transform="translateY(-1px)"}
                onMouseOut={e=>e.currentTarget.style.transform="none"}>
                {isCommission?"View Live Site ↗":"Live Demo ↗"}
              </a>
            )}
            {!isCommission&&item.github&&item.github!=="#"&&(
              <a href={item.github} target="_blank" rel="noreferrer"
                style={{padding:"10px 24px",borderRadius:4,border:`1px solid ${t.border}`,
                  color:t.sub,fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:11,
                  letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none",transition:"all 0.2s"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=t.accentBorder;e.currentTarget.style.color=t.accent;}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.sub;}}>
                GitHub
              </a>
            )}
            {!item.link&&(!item.github||item.github==="#")&&(
              <span style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:11,
                letterSpacing:"0.08em",textTransform:"uppercase"}}>
                Case study available on request
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANIMATED BACKGROUND ─────────────────────────────────────────────────────
function AnimBg({t}) {
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",width:580,height:580,borderRadius:"50%",
        background:`radial-gradient(circle,${t.orb1} 0%,transparent 70%)`,
        top:"-6%",left:"-10%",animation:"floatA 16s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:420,height:420,borderRadius:"50%",
        background:`radial-gradient(circle,${t.orb2} 0%,transparent 70%)`,
        bottom:"8%",right:"-8%",animation:"floatB 20s ease-in-out infinite"}}/>
      <div style={{position:"absolute",inset:0,
        backgroundImage:`linear-gradient(${t.border} 1px,transparent 1px),linear-gradient(90deg,${t.border} 1px,transparent 1px)`,
        backgroundSize:"58px 58px",opacity:0.35}}/>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({t,dark,toggle}) {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  const active=useScrollSpy();
  const w=useWidth();
  const isMobile=w<900;

  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>30);
    window.addEventListener("scroll",h,{passive:true});
    return()=>window.removeEventListener("scroll",h);
  },[]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setOpen(false);};

  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:62,padding:"0 20px",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background:scrolled?t.navBg:"transparent",
      backdropFilter:scrolled?"blur(20px)":"none",
      borderBottom:scrolled?`1px solid ${t.border}`:"none",
      transition:"all 0.3s ease"}}>

      <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}
        onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
        <div style={{width:32,height:32,borderRadius:7,background:t.grad,display:"flex",
          alignItems:"center",justifyContent:"center",
          fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:17,color:"#fff",
          boxShadow:`0 0 16px ${t.glow}`}}>G</div>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:19,color:t.text}}>
          gab<em style={{color:t.accent}}>.dev</em>
        </span>
      </div>

      {!isMobile&&(
        <div style={{display:"flex",gap:1,alignItems:"center"}}>
          {NAV.map(link=>(
            <button key={link} onClick={()=>go(link)} style={{background:active===link?t.accentBg:"transparent",
              border:"none",color:active===link?t.accent:t.muted,padding:"5px 12px",borderRadius:6,
              cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:500,
              letterSpacing:"0.08em",textTransform:"uppercase",transition:"all 0.2s"}}
              onMouseOver={e=>{if(active!==link)e.currentTarget.style.color=t.text;}}
              onMouseOut={e=>{if(active!==link)e.currentTarget.style.color=t.muted;}}>
              {link}
            </button>
          ))}
          <button onClick={toggle} style={{marginLeft:6,width:32,height:32,borderRadius:7,
            background:t.chipBg,border:`1px solid ${t.chipBorder}`,cursor:"pointer",
            color:t.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IconGlyph name={dark?"sun":"moon"} size={16}/>
          </button>
          <button onClick={()=>go("Contact")} style={{marginLeft:6,padding:"7px 18px",borderRadius:6,
            background:t.grad,border:"none",color:"#fff",fontFamily:"'Inter',sans-serif",
            fontWeight:600,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",
            cursor:"pointer",boxShadow:`0 0 14px ${t.glow}`,transition:"all 0.2s"}}
            onMouseOver={e=>e.currentTarget.style.transform="translateY(-1px)"}
            onMouseOut={e=>e.currentTarget.style.transform="none"}>
            Hire Me
          </button>
        </div>
      )}

      {isMobile&&(
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={toggle} style={{width:32,height:32,borderRadius:7,background:t.chipBg,
            border:`1px solid ${t.chipBorder}`,cursor:"pointer",color:t.sub,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IconGlyph name={dark?"sun":"moon"} size={16}/>
          </button>
          <button onClick={()=>setOpen(o=>!o)} style={{width:32,height:32,borderRadius:7,
            background:t.chipBg,border:`1px solid ${t.chipBorder}`,cursor:"pointer",
            color:t.text,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {open?"×":"☰"}
          </button>
        </div>
      )}

      {isMobile&&(
        <div style={{position:"absolute",top:62,left:0,right:0,background:t.navBg,
          backdropFilter:"blur(20px)",borderBottom:`1px solid ${t.border}`,
          padding:open?"12px 20px 16px":"0 20px",display:"flex",flexDirection:"column",gap:2,
          maxHeight:open?520:0,opacity:open?1:0,overflow:"hidden",
          transform:open?"translateY(0)":"translateY(-8px)",
          pointerEvents:open?"auto":"none",
          transition:"max-height 0.32s ease, opacity 0.22s ease, transform 0.32s ease, padding 0.32s ease"}}>
          {NAV.map(link=>(
            <button key={link} onClick={()=>go(link)} style={{background:"transparent",border:"none",
              color:active===link?t.accent:t.sub,padding:"10px 4px",cursor:"pointer",textAlign:"left",
              fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:active===link?700:400,
              letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`1px solid ${t.border}`}}>
              {link}
            </button>
          ))}
          <button onClick={()=>go("Contact")} style={{marginTop:8,padding:"11px",borderRadius:6,
            background:t.grad,border:"none",color:"#fff",fontFamily:"'Inter',sans-serif",
            fontWeight:600,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>
            Hire Me
          </button>
        </div>
      )}
    </nav>
  );
}

function ProfilePortrait({t,isMobile}) {
  const [ready,setReady]=useState(true);
  return(
    <Reveal delay={260} x={isMobile?0:24} y={isMobile?18:0}
      style={{position:isMobile?"relative":"absolute",right:isMobile?"auto":"7vw",
        top:isMobile?"auto":"19%",width:isMobile?"100%":"min(34vw,420px)",
        maxWidth:isMobile?340:"none",margin:isMobile?"22px auto 0":0,zIndex:2}}>
      <div style={{aspectRatio:"4 / 5",borderRadius:8,overflow:"hidden",
        border:`1px solid ${t.accentBorder}`,background:t.bgCard,
        boxShadow:`0 28px 90px ${t.glow}`,position:"relative"}}>
        {ready?(
          <img src={PROFILE_IMAGE} alt="Gabriel Turgeon" onError={()=>setReady(false)}
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
              filter:"saturate(0.95) contrast(1.03)"}}/>
        ):(
          <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",gap:14,padding:28,textAlign:"center"}}>
            <div style={{width:68,height:68,borderRadius:8,display:"flex",alignItems:"center",
              justifyContent:"center",background:t.accentBg,border:`1px solid ${t.accentBorder}`,
              color:t.accent}}>
              <IconGlyph name="user" size={34}/>
            </div>
            <div style={{fontFamily:"'Inter',sans-serif",color:t.sub,fontSize:12,
              lineHeight:1.7,letterSpacing:"0.06em",textTransform:"uppercase"}}>
              Portrait ready
            </div>
          </div>
        )}
        <div style={{position:"absolute",inset:0,boxShadow:"inset 0 -80px 120px rgba(0,0,0,0.28)",
          pointerEvents:"none"}}/>
      </div>
    </Reveal>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero({t}) {
  const [typed,setTyped]=useState("");
  const [cur,setCur]=useState(true);
  const TITLES=["Software Engineer","Full-Stack Developer","Systems Architect","Open Source Contributor"];
  const st=useRef({ti:0,ci:0,del:false,pause:0});
  const w=useWidth();const isMobile=w<640;

  useEffect(()=>{
    const tick=()=>{const s=st.current,c=TITLES[s.ti];if(s.pause>0){s.pause--;return;}
      if(!s.del){setTyped(c.slice(0,++s.ci));if(s.ci>=c.length){s.del=true;s.pause=16;}}
      else{setTyped(c.slice(0,--s.ci));if(s.ci<=0){s.del=false;s.ti=(s.ti+1)%TITLES.length;s.pause=5;}}};
    const id=setInterval(tick,85);return()=>clearInterval(id);
  },[]);
  useEffect(()=>{const id=setInterval(()=>setCur(v=>!v),520);return()=>clearInterval(id);},[]);

  return(
    <section id="About" style={{minHeight:isMobile?"auto":"100vh",display:"flex",alignItems:"center",
      padding:`${isMobile?"76px":"80px"} ${isMobile?"20px":"40px"} ${isMobile?"36px":"50px"}`,position:"relative",zIndex:2}}>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%",paddingRight:isMobile?0:"34%"}}>

        <Reveal delay={0} y={14}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:26}}>
            <div style={{height:1,width:40,background:t.divider}}/>
            <span style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:10,
              fontWeight:600,letterSpacing:"0.16em",textTransform:"uppercase"}}>Open to opportunities</span>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",
              boxShadow:"0 0 8px #22c55e",animation:"greenPulse 2.5s infinite"}}/>
          </div>
        </Reveal>

        <Reveal delay={80} y={22}>
          <h1 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:`clamp(4.5rem,${isMobile?"18":"12"}vw,9rem)`,
            fontWeight:700,lineHeight:0.95,letterSpacing:"-0.03em",marginBottom:14,
            WebkitTextFillColor:"transparent",WebkitBackgroundClip:"text",
            backgroundClip:"text",backgroundImage:t.gradText}}>Gab</h1>
        </Reveal>

        <Reveal delay={150} y={16}>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:`clamp(1rem,${isMobile?"4":"2.4"}vw,1.4rem)`,
            fontWeight:300,color:t.sub,marginBottom:22,minHeight:"1.8em",
            display:"flex",alignItems:"center",gap:2}}>
            <span style={{color:t.muted}}>— </span>
            <span style={{color:t.text}}>{typed}</span>
            <span style={{color:t.accent,opacity:cur?1:0,transition:"opacity 0.1s"}}>|</span>
          </div>
        </Reveal>

        <Reveal delay={210} y={10}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{width:44,height:1,background:t.divider}}/>
            <div style={{width:4,height:4,background:t.accent,transform:"rotate(45deg)",opacity:0.6}}/>
          </div>
        </Reveal>

        <Reveal delay={250} y={14}>
          <p style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(0.9rem,1.6vw,1.05rem)",
            color:t.sub,maxWidth:isMobile?"100%":520,width:"100%",lineHeight:1.85,
            marginBottom:34,fontWeight:300,overflowWrap:"break-word"}}>
            I craft high-performance, scalable applications that solve real problems —
            with clean architecture, sharp developer experience, and code that ships.
          </p>
        </Reveal>

        <Reveal delay={300} y={12}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:50}}>
            <HeroBtn primary t={t} onClick={()=>document.getElementById("Projects")?.scrollIntoView({behavior:"smooth"})}>View My Work</HeroBtn>
            <HeroBtn t={t} onClick={()=>document.getElementById("Contact")?.scrollIntoView({behavior:"smooth"})}>Let's Talk</HeroBtn>
          </div>
        </Reveal>

        <Reveal delay={350} y={10}>
          <div style={{display:"flex",gap:isMobile?"28px":"44px",flexWrap:"wrap"}}>
            {[["6+","Years Exp"],["30+","Projects"],["10M+","Users"],["99%","Satisfaction"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,
                  fontSize:`clamp(1.6rem,${isMobile?"7":"4"}vw,2.6rem)`,lineHeight:1,
                  WebkitTextFillColor:"transparent",WebkitBackgroundClip:"text",
                  backgroundClip:"text",backgroundImage:t.gradText}}>{n}</div>
                <div style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:9,
                  fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
        {isMobile&&<ProfilePortrait t={t} isMobile={isMobile}/>}
      </div>
      {!isMobile&&<ProfilePortrait t={t} isMobile={isMobile}/>}
    </section>
  );
}

function HeroBtn({children,primary,t,onClick}) {
  const [h,setH]=useState(false);
  return(
    <button onClick={onClick} onMouseOver={()=>setH(true)} onMouseOut={()=>setH(false)} style={{
      padding:"12px 30px",borderRadius:4,
      background:primary?t.grad:"transparent",
      border:primary?"none":`1px solid ${h?t.accent:t.border}`,
      color:primary?"#fff":(h?t.accent:t.sub),
      fontFamily:"'Inter',sans-serif",fontWeight:500,fontSize:11,
      letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
      boxShadow:primary?`0 0 ${h?30:16}px ${t.glow}`:"none",
      transform:h?"translateY(-2px)":"none",
      transition:"all 0.25s cubic-bezier(0.34,1.4,0.64,1)"}}>
      {children}
    </button>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────
function Skills({t}) {
  return(
    <section id="Skills" style={{padding:`${typeof window!=="undefined"&&window.innerWidth<640?"54px":"80px"} 20px`,position:"relative",zIndex:2}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:48}}>
            <BoldLabel t={t}>Technical Skills</BoldLabel>
            <Ornament t={t}/>
            <DisplayHead t={t}>What I Work With</DisplayHead>
            <p style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:13,
              maxWidth:420,margin:"12px auto 0",lineHeight:1.8,fontWeight:300}}>
              A refined stack built through years of production engineering
            </p>
          </div>
        </Reveal>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {SKILLS.map((s,i)=><SkillCard key={s.name} skill={s} t={t} delay={i*50}/>)}
        </div>
      </div>
    </section>
  );
}

function SkillCard({skill,t,delay}) {
  const [h,setH]=useState(false);
  return(
    <Reveal delay={delay}>
      <div onMouseOver={()=>setH(true)} onMouseOut={()=>setH(false)}
        style={{padding:"14px 18px",borderRadius:4,background:h?t.accentBg:t.bgCard,
          border:`1px solid ${h?t.accentBorder:t.border}`,
          transition:"all 0.25s ease",transform:h?"translateY(-3px)":"none",
          boxShadow:h?`0 8px 24px ${t.glow}`:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <TechIcon name={skill.name} size={22}/>
          <span style={{fontFamily:"'Inter',sans-serif",color:t.text,fontWeight:500,fontSize:13}}>{skill.name}</span>
        </div>
        {/* Full solid bar — no percentage */}
        <div style={{height:2,background:t.grad,borderRadius:999,
          boxShadow:`0 0 6px ${t.glow}`}}/>
      </div>
    </Reveal>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function Projects({t}) {
  const [modal,setModal]=useState(null);
  return(
    <section id="Projects" style={{padding:"80px 20px",background:"transparent",position:"relative",zIndex:2}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:48}}>
            <BoldLabel t={t}>Portfolio</BoldLabel>
            <Ornament t={t}/>
            <DisplayHead t={t}>Featured Projects</DisplayHead>
            <p style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:13,
              maxWidth:420,margin:"12px auto 0",lineHeight:1.8,fontWeight:300}}>
              Click any project to explore the full story
            </p>
          </div>
        </Reveal>
        <div style={{columns:"3 260px",columnGap:"14px"}}>
          {PROJECTS.map((p,i)=>(
            <Reveal key={p.title} delay={i*65} style={{breakInside:"avoid",marginBottom:"14px",display:"block"}}>
              <ProjectCard p={p} t={t} onClick={()=>setModal(p)}/>
            </Reveal>
          ))}
        </div>
      </div>
      {modal&&<Modal item={modal} t={t} onClose={()=>setModal(null)} isCommission={false}/>}
    </section>
  );
}

function ProjectCard({p,t,onClick}) {
  const [h,setH]=useState(false);
  return(
    <div onMouseOver={()=>setH(true)} onMouseOut={()=>setH(false)} onClick={onClick}
      style={{borderRadius:4,overflow:"hidden",background:t.bgCard,cursor:"pointer",
        border:`1px solid ${h?t.accentBorder:t.border}`,
        transform:h?"translateY(-5px)":"none",
        transition:"all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow:h?`0 16px 40px ${t.glow}`:"none"}}>
      <div style={{height:2,background:t.grad,transform:h?"scaleX(1)":"scaleX(0)",
        transformOrigin:"left",transition:"transform 0.4s ease"}}/>
      <div style={{padding:"20px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:4,background:t.accentBg,
            border:`1px solid ${t.accentBorder}`,display:"flex",alignItems:"center",
            justifyContent:"center",color:t.accent,
            transform:h?"rotate(-6deg) scale(1.08)":"none",
            transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <IconGlyph name={p.icon} size={22}/>
          </div>
          <span style={{fontFamily:"'Cormorant Garamond',serif",color:t.muted,fontSize:14,fontStyle:"italic"}}>{p.year}</span>
        </div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,
          fontSize:18,color:t.text,marginBottom:7,lineHeight:1.2}}>{p.title}</h3>
        <p style={{fontFamily:"'Inter',sans-serif",color:t.sub,fontSize:12,
          lineHeight:1.75,marginBottom:14,fontWeight:300}}>{p.desc}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
          {p.tags.map(tag=>(
            <span key={tag} style={{padding:"2px 8px",borderRadius:3,background:t.accentBg,
              border:`1px solid ${t.accentBorder}`,color:t.accent,
              fontFamily:"'Inter',sans-serif",fontSize:9,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>{tag}</span>
          ))}
        </div>
        <div style={{fontFamily:"'Inter',sans-serif",color:t.accent,fontSize:10,
          fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
          display:"flex",alignItems:"center",gap:6}}>
          View Details <span style={{fontSize:14}}>→</span>
        </div>
      </div>
    </div>
  );
}

// ─── COMMISSIONS ─────────────────────────────────────────────────────────────
function Commissions({t}) {
  const [modal,setModal]=useState(null);
  return(
    <section id="Commissions" style={{padding:"80px 20px",position:"relative",zIndex:2}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:48}}>
            <BoldLabel t={t}>Client Work</BoldLabel>
            <Ornament t={t}/>
            <DisplayHead t={t}>Commissions</DisplayHead>
            <p style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:13,
              maxWidth:420,margin:"12px auto 0",lineHeight:1.8,fontWeight:300}}>
              Bespoke work built to spec — click to explore each case study
            </p>
          </div>
        </Reveal>
        <div style={{columns:"3 260px",columnGap:"14px"}}>
          {COMMISSIONS.map((c,i)=>(
            <Reveal key={c.client} delay={i*65} style={{breakInside:"avoid",marginBottom:"14px",display:"block"}}>
              <CommCard c={c} t={t} onClick={()=>setModal(c)}/>
            </Reveal>
          ))}
        </div>
      </div>
      {modal&&<Modal item={modal} t={t} onClose={()=>setModal(null)} isCommission={true}/>}
    </section>
  );
}

function CommCard({c,t,onClick}) {
  const [h,setH]=useState(false);
  return(
    <div onMouseOver={()=>setH(true)} onMouseOut={()=>setH(false)} onClick={onClick}
      style={{borderRadius:4,overflow:"hidden",background:t.bgCard,cursor:"pointer",
        border:`1px solid ${h?t.accentBorder:t.border}`,
        transform:h?"translateY(-5px)":"none",
        transition:"all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow:h?`0 16px 40px ${t.glow}`:"none"}}>
      <div style={{height:2,background:t.grad,transform:h?"scaleX(1)":"scaleX(0)",
        transformOrigin:"left",transition:"transform 0.4s ease"}}/>
      <div style={{padding:"20px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:4,background:t.accentBg,
            border:`1px solid ${t.accentBorder}`,display:"flex",alignItems:"center",
            justifyContent:"center",color:t.accent,
            transform:h?"rotate(-6deg) scale(1.08)":"none",
            transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <IconGlyph name={c.icon} size={22}/>
          </div>
          <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",
            borderRadius:3,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.22)",
            fontFamily:"'Inter',sans-serif",color:"#4ade80",fontSize:9,fontWeight:600,letterSpacing:"0.08em"}}>
            ✓ {c.status}
          </span>
        </div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,
          fontSize:18,color:t.text,lineHeight:1.2,marginBottom:2}}>{c.client}</h3>
        <div style={{fontFamily:"'Inter',sans-serif",color:t.accent,fontSize:9,
          fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>{c.type}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{height:1,flex:1,background:t.border}}/>
          <span style={{fontFamily:"'Cormorant Garamond',serif",color:t.muted,fontSize:13,fontStyle:"italic"}}>{c.year}</span>
        </div>
        <p style={{fontFamily:"'Inter',sans-serif",color:t.sub,fontSize:12,
          lineHeight:1.75,marginBottom:12,fontWeight:300}}>{c.desc}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
          {c.tags.map(tag=>(
            <span key={tag} style={{padding:"2px 8px",borderRadius:3,background:t.accentBg,
              border:`1px solid ${t.accentBorder}`,color:t.accent,
              fontFamily:"'Inter',sans-serif",fontSize:9,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>{tag}</span>
          ))}
        </div>
        <div style={{fontFamily:"'Inter',sans-serif",color:t.accent,fontSize:10,
          fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
          display:"flex",alignItems:"center",gap:6}}>
          View Project <span style={{fontSize:14}}>→</span>
        </div>
      </div>
    </div>
  );
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
function Experience({t}) {
  return(
    <section id="Experience" style={{padding:"80px 20px",background:"transparent",position:"relative",zIndex:2}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:48}}>
            <BoldLabel t={t}>Career</BoldLabel>
            <Ornament t={t}/>
            <DisplayHead t={t}>Experience & Education</DisplayHead>
          </div>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
          {EXPERIENCE.map((item,i)=><ExpCard key={item.role} item={item} t={t} delay={i*80}/>)}
        </div>
      </div>
    </section>
  );
}

function ExpCard({item,t,delay}) {
  const [h,setH]=useState(false);
  return(
    <Reveal delay={delay}>
      <div onMouseOver={()=>setH(true)} onMouseOut={()=>setH(false)}
        style={{padding:"20px 22px",borderRadius:4,background:h?t.accentBg:t.bgCard,
          border:`1px solid ${h?t.accentBorder:t.border}`,
          transition:"all 0.25s ease",transform:h?"translateY(-3px)":"none",
          boxShadow:h?`0 8px 26px ${t.glow}`:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:4,background:h?t.grad:t.accentBg,
              border:`1px solid ${t.accentBorder}`,display:"flex",alignItems:"center",
              justifyContent:"center",transition:"all 0.25s",flexShrink:0,color:h?"#fff":t.accent}}>
              <IconGlyph name={item.type==="edu"?"education":"work"} size={17}/>
            </div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",color:t.text,
                fontWeight:600,fontSize:16,lineHeight:1.2}}>{item.role}</div>
              <div style={{fontFamily:"'Inter',sans-serif",color:t.accent,
                fontSize:10,fontWeight:500,marginTop:2,letterSpacing:"0.04em"}}>{item.company}</div>
            </div>
          </div>
          <span style={{fontFamily:"'Cormorant Garamond',serif",padding:"2px 8px",borderRadius:3,
            background:t.accentBg,border:`1px solid ${t.accentBorder}`,
            color:t.accent,fontSize:12,fontStyle:"italic",flexShrink:0,whiteSpace:"nowrap"}}>{item.period}</span>
        </div>
        <p style={{fontFamily:"'Inter',sans-serif",color:t.sub,fontSize:12,lineHeight:1.7,fontWeight:300}}>{item.desc}</p>
      </div>
    </Reveal>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
function Testimonials({t}) {
  const [active,setActive]=useState(0);
  const [fade,setFade]=useState(true);
  const w=useWidth();const isMobile=w<640;

  const goTo=useCallback(i=>{
    setFade(false);
    setTimeout(()=>{setActive(i);setFade(true);},220);
  },[]);

  // Random shuffle
  useEffect(()=>{
    const id=setInterval(()=>{
      let next;
      do{next=Math.floor(Math.random()*TESTIMONIALS.length);}while(next===active&&TESTIMONIALS.length>1);
      goTo(next);
    },ROTATE_MS);
    return()=>clearInterval(id);
  },[active,goTo]);

  const item=TESTIMONIALS[active];
  return(
    <section id="Testimonials" style={{padding:"80px 20px",position:"relative",zIndex:2}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:48}}>
            <BoldLabel t={t}>Testimonials</BoldLabel>
            <Ornament t={t}/>
            <DisplayHead t={t}>What People Say</DisplayHead>
          </div>
        </Reveal>

        <Reveal>
          <div style={{padding:isMobile?"24px 20px":"44px 48px",borderRadius:4,background:t.bgCard,
            border:`1px solid ${t.accentBorder}`,position:"relative",overflow:"hidden",
            marginBottom:18,boxShadow:`0 0 44px ${t.glow}`,
            opacity:fade?1:0,transition:"opacity 0.22s ease"}}>
            {/* Large quote glyph */}
            <div style={{position:"absolute",top:-8,left:32,
              fontFamily:"'Cormorant Garamond',serif",fontSize:130,
              color:t.accent,opacity:0.06,lineHeight:1,userSelect:"none"}}>"</div>

            <div style={{display:"flex",gap:isMobile?"20px":"36px",
              flexDirection:isMobile?"column":"row",alignItems:isMobile?"flex-start":"center"}}>
              {/* Left: stars + quote */}
              <div style={{flex:1,position:"relative",zIndex:1}}>
                <div style={{display:"flex",gap:3,marginBottom:18}}>
                  {[1,2,3,4,5].map(s=><span key={s} style={{color:t.accent,fontSize:16}}>★</span>)}
                </div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,
                  fontSize:"clamp(1rem,2vw,1.2rem)",color:t.sub,
                  lineHeight:1.9,fontStyle:"italic",marginBottom:0}}>
                  "{item.text}"
                </p>
              </div>

              {/* Right: avatar photo (no name) */}
              <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <div style={{width:isMobile?"60px":"80px",height:isMobile?"60px":"80px",
                  borderRadius:"50%",background:`linear-gradient(135deg,${item.color},${item.color}80)`,
                  border:`2px solid ${t.accentBorder}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Cormorant Garamond',serif",fontWeight:700,
                  fontSize:isMobile?"22px":"28px",color:"#fff",
                  boxShadow:`0 0 20px ${t.glow}`}}>
                  {item.initials}
                </div>
                <div style={{fontFamily:"'Inter',sans-serif",color:t.muted,
                  fontSize:10,letterSpacing:"0.06em",textAlign:"center",maxWidth:120}}>{item.role}</div>
              </div>
            </div>

            {/* Progress dots */}
            <div style={{display:"flex",gap:6,marginTop:24}}>
              {TESTIMONIALS.map((_,i)=>(
                <div key={i} onClick={()=>goTo(i)} style={{width:i===active?18:6,height:6,
                  borderRadius:999,background:i===active?t.accent:t.border,
                  transition:"all 0.3s ease",cursor:"pointer"}}/>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact({t}) {
  const [form,setForm]=useState({name:"",email:"",message:""});
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState("");
  const [focused,setFocused]=useState(null);
  const w=useWidth();const isMobile=w<540;

  const iStyle=field=>({
    padding:"12px 14px",borderRadius:3,width:"100%",boxSizing:"border-box",
    background:focused===field?t.accentBg:t.bgCard,
    border:`1px solid ${focused===field?t.accentBorder:t.border}`,
    color:t.text,fontSize:13,fontFamily:"'Inter',sans-serif",fontWeight:300,
    outline:"none",transition:"all 0.22s ease",
    boxShadow:focused===field?`0 0 0 3px ${t.glow}`:"none",
  });
  const submit = async e => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...form,source:"portfolio"})});
      if(!res.ok)throw new Error("Message could not be saved");
      setSent(true);
      setForm({name:"",email:"",message:""});
    } catch {
      setError("The message could not be saved yet. Email me directly at hello@gvbs.dev.");
    } finally {
      setSending(false);
    }
  };

  return(
    <section id="Contact" style={{padding:"80px 20px",background:"transparent",position:"relative",zIndex:2}}>
      <div style={{maxWidth:620,margin:"0 auto",textAlign:"center"}}>
        <Reveal>
          <BoldLabel t={t}>Get In Touch</BoldLabel>
          <Ornament t={t}/>
          <DisplayHead t={t}>Let's Work Together</DisplayHead>
          <p style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:13,
            marginBottom:36,lineHeight:1.85,fontWeight:300}}>
            Have a project in mind or just want to connect? I'm always happy to hear from you.
          </p>
        </Reveal>

        <Reveal delay={80}>
          {sent?(
            <div style={{padding:44,borderRadius:4,background:"rgba(34,197,94,0.07)",
              border:"1px solid rgba(34,197,94,0.2)",animation:"modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,color:t.accent,marginBottom:10}}>✓</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:t.text,marginBottom:6}}>Message Sent</h3>
              <p style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontWeight:300,fontSize:13}}>I'll get back to you within 24 hours.</p>
            </div>
          ):(
            <form onSubmit={submit}
              style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10}}>
                <input required placeholder="Your Name" value={form.name}
                  onChange={e=>setForm({...form,name:e.target.value})}
                  onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)}
                  style={iStyle("name")}/>
                <input required type="email" placeholder="your@email.com" value={form.email}
                  onChange={e=>setForm({...form,email:e.target.value})}
                  onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}
                  style={iStyle("email")}/>
              </div>
              <textarea required placeholder="Tell me about your project..." rows={5}
                value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)}
                style={{...iStyle("message"),resize:"vertical"}}/>
              {error&&<div style={{padding:"10px 12px",borderRadius:4,background:"rgba(192,57,43,0.09)",
                border:`1px solid ${t.accentBorder}`,color:t.sub,fontFamily:"'Inter',sans-serif",
                fontSize:12,lineHeight:1.6}}>{error}</div>}
              <button type="submit" disabled={sending} style={{padding:"13px 36px",borderRadius:3,background:t.grad,
                border:"none",color:"#fff",fontFamily:"'Inter',sans-serif",fontWeight:600,
                fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
                opacity:sending?0.72:1,boxShadow:`0 0 20px ${t.glow}`,transition:"all 0.22s ease"}}
                onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 0 36px ${t.glow}`;}}
                onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 0 20px ${t.glow}`;}}>
                {sending?"Sending...":"Send Message"}
              </button>
            </form>
          )}
        </Reveal>

        <Reveal delay={160}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginTop:32}}>
            {SOCIALS.map(({label,Icon,href})=>(
              <SocialBtn key={label} label={label} Icon={Icon} href={href} t={t}/>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SocialBtn({label,Icon,href,t}) {
  const [h,setH]=useState(false);
  return(
    <a href={href} target="_blank" rel="noreferrer"
      onMouseOver={()=>setH(true)} onMouseOut={()=>setH(false)}
      style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:3,
        background:h?t.accentBg:t.bgCard,border:`1px solid ${h?t.accentBorder:t.border}`,
        color:h?t.accent:t.muted,fontFamily:"'Inter',sans-serif",fontSize:10,fontWeight:500,
        letterSpacing:"0.08em",textTransform:"uppercase",textDecoration:"none",
        transition:"all 0.2s",transform:h?"translateY(-2px)":"none"}}>
      <Icon size={14} color={h?t.accent:t.muted}/>{label}
    </a>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer({t}) {
  const w=useWidth();const isMobile=w<640;
  return(
    <footer style={{borderTop:`1px solid ${t.border}`,padding:"22px 24px",
      display:"flex",justifyContent:"space-between",alignItems:"center",
      flexWrap:"wrap",gap:10,background:"transparent",position:"relative",zIndex:2,
      flexDirection:isMobile?"column":"row",textAlign:isMobile?"center":"left"}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:18,color:t.text}}>
        gab<em style={{color:t.accent}}>.dev</em>
      </span>
      <span style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:11,letterSpacing:"0.06em"}}>
        Made and realized by <span style={{color:t.accent,fontWeight:600}}>Gab Dev</span>
      </span>
      <span style={{fontFamily:"'Inter',sans-serif",color:t.muted,fontSize:11}}>
        {new Date().getFullYear()} · Made with <span style={{color:t.accent}}>♥</span>
      </span>
    </footer>
  );
}

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
function GlobalCSS({t}) {
  return<style dangerouslySetInnerHTML={{__html:`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap');
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;background:${t.bg};color:${t.text}}
    ::selection{background:rgba(192,57,43,0.2)}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:${t.bg}}
    ::-webkit-scrollbar-thumb{background:${t.accent};border-radius:2px}
    input::placeholder,textarea::placeholder{color:${t.muted};font-family:'Inter',sans-serif;font-weight:300}
    @keyframes floatA{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(22px,-30px) scale(1.04)}70%{transform:translate(-14px,12px) scale(0.97)}}
    @keyframes floatB{0%,100%{transform:translate(0,0)}50%{transform:translate(-26px,20px) scale(1.05)}}
    @keyframes greenPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.55;transform:scale(1.35)}}
    @keyframes modalIn{from{opacity:0;transform:scale(0.93) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @media (max-width:640px){
      section{padding-left:16px!important;padding-right:16px!important}
    }
  `}}/>;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [dark,setDark]=useState(true);
  const t=dark?T.dark:T.light;
  return(
    <div style={{background:t.bg,color:t.text,minHeight:"100vh",transition:"background 0.3s,color 0.3s"}}>
      <GlobalCSS t={t}/>
      <AnimBg t={t}/>
      <Navbar t={t} dark={dark} toggle={()=>setDark(d=>!d)}/>
      <main>
        <Hero t={t}/>
        <Skills t={t}/>
        <Projects t={t}/>
        <Commissions t={t}/>
        <Experience t={t}/>
        <Testimonials t={t}/>
        <Contact t={t}/>
      </main>
      <Footer t={t}/>
    </div>
  );
}
