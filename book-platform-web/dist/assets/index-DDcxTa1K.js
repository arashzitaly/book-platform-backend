(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();class x{constructor(){this.routes=new Map,this.currentRoute=null,this.container=null,window.addEventListener("hashchange",()=>this.handleRoute()),window.addEventListener("load",()=>this.handleRoute())}setContainer(e){this.container=e}register(e,t){this.routes.set(e,t)}navigate(e){window.location.hash=e}getCurrentPath(){return window.location.hash.slice(1)||"/"}async handleRoute(){const e=this.getCurrentPath();let t=this.routes.get(e),s=[];if(!t){const i=e.split("/").filter(Boolean);for(const[o,r]of this.routes)if(o.includes(":")){const d=o.split("/").filter(Boolean);if(d.length===i.length){let p=!0;const u=[];for(let m=0;m<d.length;m++)if(d[m].startsWith(":"))u.push(i[m]);else if(d[m]!==i[m]){p=!1;break}if(p){t=r,s=u;break}}}}if(t&&this.container){this.currentRoute=e;const i=await t(s);this.container.innerHTML=i,window.dispatchEvent(new CustomEvent("route:loaded",{detail:{path:e,params:s}}))}else t||this.navigate("/")}}const n=new x;class ${constructor(){this.state={user:null,isAuthenticated:!1,facilities:[],myBookings:[],notifications:[],unreadCount:0,loading:!1},this.listeners=new Set;const e=localStorage.getItem("user"),t=localStorage.getItem("token");e&&t&&(this.state.user=JSON.parse(e),this.state.isAuthenticated=!0)}getState(){return this.state}setState(e){this.state={...this.state,...e},this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}setUser(e){this.setState({user:e,isAuthenticated:!!e}),e?localStorage.setItem("user",JSON.stringify(e)):localStorage.removeItem("user")}logout(){this.setState({user:null,isAuthenticated:!1}),localStorage.removeItem("user"),localStorage.removeItem("token")}setFacilities(e){this.setState({facilities:e})}setMyBookings(e){this.setState({myBookings:e})}setNotifications(e){this.setState({notifications:e})}setUnreadCount(e){this.setState({unreadCount:e})}setLoading(e){this.setState({loading:e})}}const c=new $,S="/api";class T{constructor(){this.token=localStorage.getItem("token")}setToken(e){this.token=e,e?localStorage.setItem("token",e):localStorage.removeItem("token")}getToken(){return this.token}async request(e,t={}){var o;const s=`${S}${e}`,i={"Content-Type":"application/json",...t.headers};this.token&&(i.Authorization=`Bearer ${this.token}`);try{const r=await fetch(s,{...t,headers:i});if(r.status===401)throw this.setToken(null),window.dispatchEvent(new CustomEvent("auth:logout")),new Error("Unauthorized");const d=(o=r.headers.get("content-type"))!=null&&o.includes("application/json")?await r.json():null;if(!r.ok)throw new Error((d==null?void 0:d.message)||`HTTP error ${r.status}`);return d}catch(r){throw console.error("API Error:",r),r}}async register(e){const t=await this.request("/auth/register",{method:"POST",body:JSON.stringify(e)});return t!=null&&t.token&&this.setToken(t.token),t}async login(e){const t=await this.request("/auth/login",{method:"POST",body:JSON.stringify(e)});return t!=null&&t.token&&this.setToken(t.token),t}logout(){this.setToken(null),window.dispatchEvent(new CustomEvent("auth:logout"))}async getFacilities(e={}){const t=new URLSearchParams(e).toString();return this.request(`/facilities${t?`?${t}`:""}`)}async getFacility(e){return this.request(`/facilities/${e}`)}async getMyFacilities(){return this.request("/facilities/my")}async createFacility(e){return this.request("/facilities",{method:"POST",body:JSON.stringify(e)})}async updateFacility(e,t){return this.request(`/facilities/${e}`,{method:"PUT",body:JSON.stringify(t)})}async getResources(e){return this.request(`/facilities/${e}/resources`)}async createResource(e,t){return this.request(`/facilities/${e}/resources`,{method:"POST",body:JSON.stringify(t)})}async getSlots(e,t={}){const s=new URLSearchParams(t).toString();return this.request(`/facilities/${e}/slots${s?`?${s}`:""}`)}async getAvailableSlots(e,t=50){return this.request(`/facilities/${e}/slots/available?limit=${t}`)}async createSlots(e,t){return this.request(`/facilities/${e}/slots/bulk`,{method:"POST",body:JSON.stringify(t)})}async createSlot(e){const{facilityId:t,...s}=e;return this.request(`/facilities/${t}/slots`,{method:"POST",body:JSON.stringify(s)})}async generateBulkSlots(e){const{facilityId:t,...s}=e;return this.request(`/facilities/${t}/slots/bulk`,{method:"POST",body:JSON.stringify(s)})}async getMyBookings(){return this.request("/bookings")}async getBooking(e){return this.request(`/bookings/${e}`)}async getFacilityBookings(e){return this.request(`/bookings/facility/${e}`)}async getPendingBookings(e){return this.request(`/bookings/facility/${e}/pending`)}async createBooking(e){return this.request("/bookings",{method:"POST",body:JSON.stringify(e)})}async updateBookingStatus(e,t){return this.request(`/bookings/${e}/status`,{method:"PUT",body:JSON.stringify({status:t})})}async rescheduleBooking(e,t){return this.request(`/bookings/${e}/reschedule`,{method:"PUT",body:JSON.stringify(t)})}async getNotifications(e=50){return this.request(`/notifications?limit=${e}`)}async getUnreadNotifications(){return this.request("/notifications/unread")}async getUnreadCount(){return this.request("/notifications/unread/count")}async markNotificationRead(e){return this.request(`/notifications/${e}/read`,{method:"PUT"})}async markAllNotificationsRead(){return this.request("/notifications/read-all",{method:"PUT"})}}const l=new T,v={home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'},h={0:"🏋️",1:"🍽️",2:"☕"},g={0:"Gym",1:"Restaurant",2:"Cafeteria"},w={0:"Requested",1:"Pending",2:"Accepted",3:"Rejected",4:"Cancelled",5:"Completed"},C={0:"badge-warning",1:"badge-warning",2:"badge-success",3:"badge-error",4:"badge-error",5:"badge-primary"};function B(){const a=c.getState(),e=a.isAuthenticated,t=a.user,s=(t==null?void 0:t.role)===1;return`
    <header class="header">
      <div class="header-content">
        <a href="#/" class="logo">
          <div class="logo-icon">📅</div>
          <span>BookPlatform</span>
        </a>
        <nav class="nav">
          <a href="#/" class="nav-link">Browse</a>
          ${e?`
            <a href="#/bookings" class="nav-link">My Bookings</a>
            ${s?'<a href="#/dashboard" class="nav-link">Dashboard</a>':""}
            <a href="#/notifications" class="nav-link">Notifications</a>
            <button class="btn btn-ghost" onclick="window.app.logout()">Logout</button>
          `:`
            <a href="#/login" class="nav-link">Sign In</a>
            <a href="#/register" class="btn btn-primary">Get Started</a>
          `}
        </nav>
      </div>
    </header>
  `}function F(){const a=c.getState(),e=a.isAuthenticated,t=a.unreadCount||0;return e?`
    <nav class="bottom-nav">
      <button class="bottom-nav-item" onclick="window.location.hash='#/'">${v.home}<span>Home</span></button>
      <button class="bottom-nav-item" onclick="window.location.hash='#/bookings'">${v.calendar}<span>Bookings</span></button>
      <button class="bottom-nav-item" onclick="window.location.hash='#/notifications'">
        ${v.bell}
        <span>Alerts${t>0?` (${t})`:""}</span>
      </button>
      <button class="bottom-nav-item" onclick="window.location.hash='#/profile'">${v.user}<span>Profile</span></button>
    </nav>
  `:""}async function P(){let a=[];try{a=await l.getFacilities({limit:20})}catch(t){console.error("Failed to load facilities",t)}const e=a.slice(0,2);return a.slice(2),`
    <div class="page">
      <!-- Hero Section with Split Layout -->
      <section class="hero">
        <div class="hero-content">
          ${e.length>=2?`
          <div class="hero-split">
            <!-- Left Card -->
            <div style="display: flex; justify-content: flex-end;">
              ${y(e[0])}
            </div>
            
            <!-- Center Content -->
            <div class="hero-center">
              <div class="hero-logo-badge">
                ${v.layers}
                <span>BookPlatform</span>
              </div>
              
              <div style="margin: var(--space-8) 0;">
                <div class="stats-panel" style="margin-bottom: var(--space-4);">
                  <div class="stats-label">Booking Rate</div>
                  <div class="stats-value stats-positive">+24.5%</div>
                </div>
                <div class="stats-panel">
                  <div class="stats-label">Time Saved</div>
                  <div class="stats-value stats-positive">+3.2hrs</div>
                </div>
              </div>
            </div>
            
            <!-- Right Card -->
            <div style="display: flex; justify-content: flex-start;">
              ${y(e[1])}
            </div>
          </div>
          `:""}
          
          <div style="text-align: center; margin-top: var(--space-12);">
            <h1 class="hero-title">
              Book Your Perfect <span class="hero-title-gradient">Spot</span>
            </h1>
            <p class="hero-subtitle">
              Reserve at gyms, restaurants, and cafeterias with instant confirmation. 
              Simple booking for modern life.
            </p>
            <div class="flex justify-center gap-4">
              <button class="btn btn-primary btn-lg" onclick="document.getElementById('facilities-section').scrollIntoView({behavior:'smooth'})">
                Browse Facilities
              </button>
              <a href="#/register" class="btn btn-outline btn-lg">
                Create Account
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Trusted By Section -->
      <section class="trusted-section">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <p class="trusted-label">Trusted by fast-growing businesses</p>
          <div class="trusted-logos">
            <span class="trusted-logo">FitLife</span>
            <span class="trusted-logo">CaféBlend</span>
            <span class="trusted-logo">GymPro</span>
            <span class="trusted-logo">DineWell</span>
            <span class="trusted-logo">FlexSpace</span>
          </div>
        </div>
      </section>
      
      <!-- Feature 1 -->
      <section class="feature-section" style="max-width: 1200px; margin: 0 auto; padding: var(--space-24) var(--space-4);">
        <div>
          <p class="feature-number">1. Find Your Spot</p>
          <h2 class="feature-title">Discover venues that match your lifestyle</h2>
          <p class="feature-description">
            Browse through our curated selection of gyms, restaurants, and cafeterias. 
            Filter by location, availability, and amenities to find the perfect match.
          </p>
        </div>
        <div class="isometric-graphic">
          <div style="position: relative; perspective: 1000px;">
            <div style="width: 180px; height: 180px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); transform: rotateX(10deg) rotateY(-10deg); position: relative;">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem;">🔍</div>
            </div>
            <div style="position: absolute; top: -20px; right: -40px; padding: var(--space-2) var(--space-4); background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--text-muted);">
              DETECTS PATTERNS
            </div>
            <div style="position: absolute; bottom: -30px; right: -20px; padding: var(--space-2) var(--space-4); background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--text-muted);">
              SMART MATCHING
            </div>
          </div>
        </div>
      </section>
      
      <!-- Feature 2 -->
      <section class="feature-section reverse" style="max-width: 1200px; margin: 0 auto; padding: var(--space-24) var(--space-4);">
        <div>
          <p class="feature-number">2. Book Instantly</p>
          <h2 class="feature-title">Secure your reservation in seconds</h2>
          <p class="feature-description">
            Select your preferred time slot and confirm your booking with just a few taps. 
            Get instant confirmation and reminders before your visit.
          </p>
        </div>
        <div class="isometric-graphic">
          <div style="position: relative; perspective: 1000px;">
            <div style="width: 180px; height: 180px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); transform: rotateX(10deg) rotateY(10deg); position: relative;">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem;">⚡</div>
            </div>
            <div style="position: absolute; top: -20px; left: -40px; padding: var(--space-2) var(--space-4); background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--text-muted);">
              INSTANT CONFIRM
            </div>
          </div>
        </div>
      </section>
      
      <!-- Facilities Grid Section -->
      <section id="facilities-section" style="padding: var(--space-16) 0;">
        <div class="page-header" style="text-align: center;">
          <h2 class="page-title">Featured Facilities</h2>
          <p class="page-subtitle">Discover and book your next experience</p>
        </div>
        
        <div class="flex justify-center gap-4 mb-8">
          <button class="btn btn-secondary" onclick="window.app.filterCategory(null)">All</button>
          <button class="btn btn-ghost" onclick="window.app.filterCategory(0)">🏋️ Gyms</button>
          <button class="btn btn-ghost" onclick="window.app.filterCategory(1)">🍽️ Restaurants</button>
          <button class="btn btn-ghost" onclick="window.app.filterCategory(2)">☕ Cafeterias</button>
        </div>
        
        <div class="grid grid-auto" id="facilities-grid">
          ${a.length>0?a.map(t=>k(t)).join(""):`
            <div class="card card-dark" style="grid-column: 1 / -1; padding: 3rem; text-align: center;">
              <p class="text-secondary">No facilities available yet. Check back soon!</p>
            </div>
          `}
        </div>
      </section>
      
      <!-- Backed By Section -->
      <div class="backed-by" style="padding-bottom: var(--space-16);">
        <p class="backed-by-label">Backed by</p>
        <div class="backed-by-logos">
          <span>a]6z</span>
          <span>/</span>
          <span style="font-weight: 700;">speedrun</span>
        </div>
      </div>
    </div>
  `}function y(a){return a?`
    <a href="#/facility/${a.id}" class="product-card">
      <div class="product-card-image">
        ${h[a.category]||"📍"}
      </div>
      <div class="product-card-title">${a.name}</div>
      <div class="text-secondary" style="font-size: var(--font-size-sm); margin-bottom: var(--space-1)">
        ${g[a.category]} / Venue
      </div>
      <div class="product-card-rating">
        <span>★★★★★</span>
      </div>
    </a>
  `:""}function k(a){var e,t,s;return`
    <a href="#/facility/${a.id}" class="card">
      <div class="card-image" style="display: flex; align-items: center; justify-content: center; font-size: 3rem;">
        ${h[a.category]||"📍"}
      </div>
      <div class="card-body">
        <span class="badge badge-${(e=g[a.category])==null?void 0:e.toLowerCase()}">${g[a.category]}</span>
        <h3 class="card-title mt-4">${a.name}</h3>
        <p class="card-subtitle">${((t=a.description)==null?void 0:t.slice(0,80))||"No description"}${((s=a.description)==null?void 0:s.length)>80?"...":""}</p>
        <div class="card-meta">
          <span>📍 ${a.address||"Location TBD"}</span>
        </div>
      </div>
    </a>
  `}async function A(a){var i;const e=a[0];let t=null,s=[];try{t=await l.getFacility(e),s=await l.getAvailableSlots(e,30)}catch(o){return console.error("Failed to load facility",o),'<div class="page"><h1>Facility not found</h1></div>'}return`
    <div class="page">
      <div class="card card-dark" style="margin-bottom: var(--space-8);">
        <div class="card-image" style="height: 280px; display: flex; align-items: center; justify-content: center; font-size: 5rem; background: linear-gradient(135deg, var(--primary-500), var(--primary-600));">
          ${h[t.category]||"📍"}
        </div>
        <div class="card-body">
          <span class="badge badge-${(i=g[t.category])==null?void 0:i.toLowerCase()}">${g[t.category]}</span>
          <h1 class="page-title mt-4">${t.name}</h1>
          <p class="text-secondary">${t.description||"Welcome to our facility!"}</p>
          <div class="flex gap-6 mt-4 text-secondary">
            <span>📍 ${t.address||"Location TBD"}</span>
            ${t.phone?`<span>📞 ${t.phone}</span>`:""}
          </div>
        </div>
      </div>
      
      <section>
        <h2 class="page-title">Available Slots</h2>
        <p class="page-subtitle mb-6">Select a time slot to book</p>
        
        ${s.length>0?`
          <div class="slots-grid" id="slots-grid">
            ${s.map(o=>N(o,e)).join("")}
          </div>
        `:`
          <div class="card card-dark" style="padding: 2rem; text-align: center;">
            <p class="text-secondary">No available slots at the moment.</p>
          </div>
        `}
      </section>
    </div>
  `}function N(a,e){const t=new Date(a.startTime),s=t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i=t.toLocaleDateString([],{month:"short",day:"numeric"}),o=a.availableSpots>0;return`
    <div class="slot-card ${o?"":"disabled"}" 
         data-slot-id="${a.id}" 
         data-facility-id="${e}"
         onclick="${o?`window.app.selectSlot('${a.id}', '${e}')`:""}">
      <div class="slot-time">${s}</div>
      <div class="text-secondary" style="font-size: var(--font-size-sm);">${i}</div>
      <div class="slot-spots ${o?"text-success":"text-error"}">
        ${o?`${a.availableSpots} spots left`:"Full"}
      </div>
      ${a.price?`<div class="text-primary font-semibold">$${a.price}</div>`:""}
    </div>
  `}function D(){return`
    <div class="page" style="max-width: 420px; margin: 0 auto; padding-top: var(--space-12);">
      <div class="card card-dark">
        <div class="card-body">
          <h1 class="page-title text-center">Welcome Back</h1>
          <p class="text-secondary text-center mb-6">Sign in to your account</p>
          
          <form id="login-form" onsubmit="window.app.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" name="password" class="form-input" placeholder="••••••••" required>
            </div>
            <div id="login-error" class="form-error hidden"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-4);">
              Sign In
            </button>
          </form>
          
          <p class="text-center text-secondary mt-6">
            Don't have an account? <a href="#/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `}function R(){return`
    <div class="page" style="max-width: 420px; margin: 0 auto; padding-top: var(--space-12);">
      <div class="card card-dark">
        <div class="card-body">
          <h1 class="page-title text-center">Create Account</h1>
          <p class="text-secondary text-center mb-6">Join Book Platform today</p>
          
          <form id="register-form" onsubmit="window.app.handleRegister(event)">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" name="username" class="form-input" placeholder="johndoe" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" name="password" class="form-input" placeholder="••••••••" minlength="6" required>
            </div>
            <div class="form-group">
              <label class="form-label">I am a</label>
              <select name="role" class="form-input">
                <option value="0">Customer</option>
                <option value="1">Facility Owner</option>
              </select>
            </div>
            <div id="register-error" class="form-error hidden"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-4);">
              Create Account
            </button>
          </form>
          
          <p class="text-center text-secondary mt-6">
            Already have an account? <a href="#/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `}async function q(){if(!c.getState().isAuthenticated)return window.location.hash="#/login","";let e=[];try{e=await l.getMyBookings(),c.setMyBookings(e)}catch(i){console.error("Failed to load bookings",i)}const t=e.filter(i=>[0,1,2].includes(i.status)&&new Date(i.slotStartTime)>new Date),s=e.filter(i=>![0,1,2].includes(i.status)||new Date(i.slotStartTime)<=new Date);return`
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">My Reservations</h1>
        <p class="page-subtitle">Manage your bookings</p>
      </div>
      
      <h2 class="font-semibold mb-4">Upcoming</h2>
      <div class="grid gap-4 mb-8">
        ${t.length>0?t.map(i=>b(i)).join(""):`
          <div class="card card-dark" style="padding: 2rem; text-align: center;">
            <p class="text-secondary">No upcoming reservations</p>
            <a href="#/" class="btn btn-primary mt-4">Browse Facilities</a>
          </div>
        `}
      </div>
      
      <h2 class="font-semibold mb-4">Past</h2>
      <div class="grid gap-4">
        ${s.length>0?s.map(i=>b(i)).join(""):`
          <div class="card card-dark" style="padding: 1rem; text-align: center;">
            <p class="text-muted">No past reservations</p>
          </div>
        `}
      </div>
    </div>
  `}function b(a){const e=new Date(a.slotStartTime);return`
    <div class="ticket-wrapper" style="cursor: default;">
      <div class="ticket-main">
        <h3 class="card-title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-4)">${a.facilityName}</h3>
        <div class="flex justify-between mt-4">
          <div>
            <p class="text-muted" style="font-size: var(--font-size-sm); margin-bottom: 0;">When:</p>
            <p class="font-semibold text-primary" style="font-size: var(--font-size-lg)">${e.toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"})}</p>
          </div>
          <div>
            <p class="text-muted" style="font-size: var(--font-size-sm); margin-bottom: 0;">At:</p>
            <p class="font-semibold text-primary" style="font-size: var(--font-size-lg)">${e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>
          </div>
        </div>
        <div class="mt-4" style="border-top: 1px dashed var(--border-default); padding-top: var(--space-4);">
          <div class="flex justify-between">
            <span class="text-secondary">Party Size: </span>
            <span class="font-semibold text-primary">${a.partySize} Persons</span>
          </div>
        </div>
      </div>
      <div class="ticket-divider"></div>
      <div class="ticket-side">
        <div style="writing-mode: vertical-rl; transform: rotate(180deg); font-weight: 700; letter-spacing: 2px; font-size: var(--font-size-lg); text-transform: uppercase;">
          ${w[a.status]}
        </div>
        <div style="margin-top: auto; filter: invert(1); opacity: 0.8;">
          <!-- Fake QR Code purely for ticket aesthetics -->
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" class="mt-4">
            <rect x="0" y="0" width="10" height="10" fill="currentColor"/>
            <rect x="15" y="0" width="10" height="10" fill="currentColor"/>
            <rect x="30" y="0" width="10" height="10" fill="currentColor"/>
            <rect x="0" y="15" width="10" height="10" fill="currentColor"/>
            <rect x="30" y="15" width="10" height="10" fill="currentColor"/>
            <rect x="0" y="30" width="10" height="10" fill="currentColor"/>
            <rect x="15" y="30" width="10" height="10" fill="currentColor"/>
            <rect x="25" y="20" width="15" height="15" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  `}async function I(){if(!c.getState().isAuthenticated)return window.location.hash="#/login","";let e=[];try{e=await l.getNotifications(50),c.setNotifications(e)}catch(t){console.error("Failed to load notifications",t)}return`
    <div class="page">
      <div class="page-header flex justify-between items-center">
        <div>
          <h1 class="page-title">Notifications</h1>
          <p class="page-subtitle">Stay updated on your reservations</p>
        </div>
        ${e.some(t=>!t.isRead)?`
          <button class="btn btn-secondary" onclick="window.app.markAllRead()">Mark all read</button>
        `:""}
      </div>
      
      <div class="grid gap-4">
        ${e.length>0?e.map(t=>L(t)).join(""):`
          <div class="card card-dark" style="padding: 2rem; text-align: center;">
            <p class="text-secondary">No notifications yet</p>
          </div>
        `}
      </div>
    </div>
  `}function L(a){const e=new Date(a.createdAt),t={0:"✅",1:"❌",2:"⏰",3:"📬"};return`
    <div class="card card-dark ${a.isRead?"opacity-60":""}" 
         style="cursor: pointer;" 
         onclick="window.app.markNotificationRead('${a.id}')">
      <div class="card-body">
        <div class="flex gap-4">
          <div style="font-size: 1.5rem;">${t[a.type]||"📢"}</div>
          <div class="flex-1">
            <h3 class="font-semibold">${a.title}</h3>
            <p class="text-secondary">${a.message}</p>
            <p class="text-muted mt-2" style="font-size: var(--font-size-sm);">${e.toLocaleString()}</p>
          </div>
          ${a.isRead?"":'<div class="badge badge-primary">New</div>'}
        </div>
      </div>
    </div>
  `}async function E(){var t;const a=c.getState();if(!a.isAuthenticated||((t=a.user)==null?void 0:t.role)!==1)return window.location.hash="#/","";let e=[];try{e=await l.getMyFacilities()}catch(s){console.error("Failed to load facilities",s)}return`
    <div class="page">
      <div class="page-header flex justify-between items-center">
        <div>
          <h1 class="page-title">Owner Dashboard</h1>
          <p class="page-subtitle">Manage your facilities</p>
        </div>
        <button class="btn btn-primary" onclick="window.app.showCreateFacility()">+ Add Facility</button>
      </div>
      
      <div class="grid grid-auto">
        ${e.length>0?e.map(s=>M(s)).join(""):`
          <div class="card card-dark" style="grid-column: 1 / -1; padding: 3rem; text-align: center;">
            <p class="text-secondary mb-4">You haven't created any facilities yet</p>
            <button class="btn btn-primary" onclick="window.app.showCreateFacility()">Create Your First Facility</button>
          </div>
        `}
      </div>
    </div>
  `}function M(a){var e;return`
    <div class="card card-dark">
      <div class="card-body">
        <span class="badge badge-${(e=g[a.category])==null?void 0:e.toLowerCase()}">${g[a.category]}</span>
        <h3 class="card-title mt-4">${a.name}</h3>
        <p class="card-subtitle">${a.address||"No address"}</p>
        <div class="flex gap-2 mt-4">
          <a href="#/dashboard/facility/${a.id}" class="btn btn-secondary btn-sm">Manage</a>
          <a href="#/dashboard/facility/${a.id}/bookings" class="btn btn-ghost btn-sm">Bookings</a>
        </div>
      </div>
    </div>
  `}function z(){var t,s;const a=c.getState(),e=a.user;return a.isAuthenticated?`
    <div class="page" style="max-width: 500px; margin: 0 auto;">
      <div class="card card-dark">
        <div class="card-body text-center">
          <div style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-4); font-size: 2rem; color: var(--white);">
            ${((s=(t=e==null?void 0:e.username)==null?void 0:t[0])==null?void 0:s.toUpperCase())||"?"}
          </div>
          <h1 class="page-title">${(e==null?void 0:e.username)||"User"}</h1>
          <p class="text-secondary">${(e==null?void 0:e.email)||""}</p>
          <span class="badge ${(e==null?void 0:e.role)===1?"badge-primary":"badge-success"} mt-2">
            ${(e==null?void 0:e.role)===1?"Facility Owner":"Customer"}
          </span>
          
          <div class="mt-8">
            <button class="btn btn-secondary" style="width: 100%;" onclick="window.app.logout()">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  `:(window.location.hash="#/login","")}function O(a,e){return`
    <div class="modal-overlay" onclick="window.app.closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Confirm Booking</h2>
        </div>
        <form id="booking-form" onsubmit="window.app.handleBooking(event, '${a}', '${e}')">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Party Size</label>
              <input type="number" name="partySize" class="form-input" value="1" min="1" max="10" required>
            </div>
            <div class="form-group">
              <label class="form-label">Notes (optional)</label>
              <textarea name="notes" class="form-input" rows="3" placeholder="Any special requests..."></textarea>
            </div>
            <div id="booking-error" class="form-error hidden"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  `}function j(){return`
    <div class="modal-overlay" onclick="window.app.closeModal()">
      <div class="modal" style="max-width: 500px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Create New Facility</h2>
          <p class="text-secondary">Set up your business on Book Platform</p>
        </div>
        <form id="create-facility-form" onsubmit="window.app.handleCreateFacility(event)">
          <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
            <div class="form-group">
              <label class="form-label">Facility Name *</label>
              <input type="text" name="name" class="form-input" placeholder="e.g. Downtown Fitness" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select name="category" class="form-input" required>
                <option value="0">🏋️ Gym / Fitness</option>
                <option value="1">🍽️ Restaurant</option>
                <option value="2">☕ Cafeteria / Café</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea name="description" class="form-input" rows="3" placeholder="Tell customers about your facility..."></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Address *</label>
              <input type="text" name="address" class="form-input" placeholder="123 Main Street, City" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" name="phone" class="form-input" placeholder="(555) 123-4567">
            </div>
            
            <div class="form-group">
              <label class="form-label">Image URL (optional)</label>
              <input type="url" name="imageUrl" class="form-input" placeholder="https://...">
            </div>
            
            <div id="create-facility-error" class="form-error hidden"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Facility</button>
          </div>
        </form>
      </div>
    </div>
  `}async function U(a){var i;const e=a[0],t=c.getState();if(!t.isAuthenticated||((i=t.user)==null?void 0:i.role)!==1)return window.location.hash="#/","";let s=null;try{s=await l.getFacility(e)}catch(o){return console.error("Failed to load facility",o),'<div class="page"><h1>Facility not found</h1></div>'}return`
    <div class="page">
      <div class="page-header">
        <a href="#/dashboard" class="btn btn-ghost">&larr; Back to Dashboard</a>
        <h1 class="page-title mt-4">${s.name}</h1>
        <p class="page-subtitle">Manage your facility settings and slots</p>
      </div>
      
      <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <!-- Facility Info Card -->
        <div class="card card-dark">
          <div class="card-body">
            <h3 class="font-semibold mb-4">Facility Information</h3>
            <div class="grid gap-2">
              <p><strong>Category:</strong> ${h[s.category]} ${g[s.category]}</p>
              <p><strong>Address:</strong> ${s.address||"Not set"}</p>
              <p><strong>Phone:</strong> ${s.phone||"Not set"}</p>
              <p><strong>Status:</strong> <span class="badge ${s.isActive?"badge-success":"badge-error"}">${s.isActive?"Active":"Inactive"}</span></p>
            </div>
          </div>
        </div>
        
        <!-- Add Slots Card -->
        <div class="card card-dark">
          <div class="card-body">
            <h3 class="font-semibold mb-4">Quick Add Slots</h3>
            <form id="add-slot-form" onsubmit="window.app.handleAddSlot(event, '${s.id}')">
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" name="date" class="form-input" required min="${new Date().toISOString().split("T")[0]}">
              </div>
              <div class="grid gap-4" style="grid-template-columns: 1fr 1fr;">
                <div class="form-group">
                  <label class="form-label">Start Time</label>
                  <input type="time" name="startTime" class="form-input" required value="09:00">
                </div>
                <div class="form-group">
                  <label class="form-label">End Time</label>
                  <input type="time" name="endTime" class="form-input" required value="10:00">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Capacity (spots available)</label>
                <input type="number" name="capacity" class="form-input" value="10" min="1" required>
              </div>
              <div class="form-group">
                <label class="form-label">Price ($) - optional</label>
                <input type="number" name="price" class="form-input" value="0" min="0" step="0.01">
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">Add Slot</button>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Bulk Slots -->
      <div class="card card-dark mt-6">
        <div class="card-body">
          <h3 class="font-semibold mb-4">Generate Bulk Slots</h3>
          <p class="text-secondary mb-4">Automatically create multiple time slots for a date range</p>
          <form id="bulk-slots-form" onsubmit="window.app.handleBulkSlots(event, '${s.id}')">
            <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
              <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="date" name="startDate" class="form-input" required min="${new Date().toISOString().split("T")[0]}">
              </div>
              <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="date" name="endDate" class="form-input" required min="${new Date().toISOString().split("T")[0]}">
              </div>
              <div class="form-group">
                <label class="form-label">Opening Time</label>
                <input type="time" name="openTime" class="form-input" required value="09:00">
              </div>
              <div class="form-group">
                <label class="form-label">Closing Time</label>
                <input type="time" name="closeTime" class="form-input" required value="18:00">
              </div>
              <div class="form-group">
                <label class="form-label">Slot Duration (minutes)</label>
                <input type="number" name="duration" class="form-input" value="60" min="15" step="15" required>
              </div>
              <div class="form-group">
                <label class="form-label">Capacity per slot</label>
                <input type="number" name="capacity" class="form-input" value="10" min="1" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-4">Generate Slots</button>
          </form>
        </div>
      </div>
    </div>
  `}async function H(a){var p;const e=a[0],t=c.getState();if(!t.isAuthenticated||((p=t.user)==null?void 0:p.role)!==1)return window.location.hash="#/","";let s=[],i=null;try{i=await l.getFacility(e),s=await l.getFacilityBookings(e)}catch(u){console.error("Failed to load bookings",u)}const o=s.filter(u=>u.status===0),r=s.filter(u=>u.status===2),d=s.filter(u=>![0,2].includes(u.status));return`
    <div class="page">
      <div class="page-header">
        <a href="#/dashboard" class="btn btn-ghost">&larr; Back to Dashboard</a>
        <h1 class="page-title mt-4">${(i==null?void 0:i.name)||"Facility"} - Bookings</h1>
        <p class="page-subtitle">Manage customer reservations</p>
      </div>
      
      <h2 class="font-semibold mb-4">⏳ Pending Approval (${o.length})</h2>
      <div class="grid gap-4 mb-8">
        ${o.length>0?o.map(u=>f(u)).join(""):`
          <div class="card card-dark" style="padding: 1rem; text-align: center;">
            <p class="text-secondary">No pending bookings</p>
          </div>
        `}
      </div>
      
      <h2 class="font-semibold mb-4">✅ Confirmed (${r.length})</h2>
      <div class="grid gap-4 mb-8">
        ${r.length>0?r.map(u=>f(u,!1)).join(""):`
          <div class="card card-dark" style="padding: 1rem; text-align: center;">
            <p class="text-secondary">No confirmed bookings</p>
          </div>
        `}
      </div>
      
      ${d.length>0?`
        <h2 class="font-semibold mb-4">Other (${d.length})</h2>
        <div class="grid gap-4">
          ${d.map(u=>f(u,!1)).join("")}
        </div>
      `:""}
    </div>
  `}function f(a,e=!0){const t=new Date(a.slotStartTime),s=new Date(a.slotEndTime);return`
    <div class="card card-dark">
      <div class="card-body">
        <div class="flex justify-between items-center gap-4">
          <div class="flex-1">
            <h3 class="font-semibold">${a.customerName||"Customer"}</h3>
            <p class="text-secondary">
              ${t.toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"})} 
              ${t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} - 
              ${s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
            </p>
            <p class="text-muted" style="font-size: var(--font-size-sm);">Party of ${a.partySize}</p>
            ${a.notes?`<p class="text-muted mt-2" style="font-size: var(--font-size-sm);"><em>"${a.notes}"</em></p>`:""}
          </div>
          <div class="flex flex-col gap-2 items-end">
            <span class="badge ${C[a.status]}">${w[a.status]}</span>
            ${e&&a.status===0?`
              <div class="flex gap-2 mt-2">
                <button class="btn btn-sm" style="background: var(--accent-green); color: white; border: none;" onclick="window.app.updateBooking('${a.id}', 2)">Accept</button>
                <button class="btn btn-sm" style="background: var(--accent-red); color: white; border: none;" onclick="window.app.updateBooking('${a.id}', 3)">Reject</button>
              </div>
            `:""}
            ${a.status===2?`
              <div class="flex gap-2 mt-2">
                <button class="btn btn-ghost btn-sm" onclick="window.app.showRescheduleModal('${a.id}', '${a.facilityId}')">Reschedule</button>
                <button class="btn btn-ghost btn-sm" style="color: var(--accent-red);" onclick="window.app.cancelBooking('${a.id}')">Cancel</button>
              </div>
            `:""}
          </div>
        </div>
      </div>
    </div>
  `}function J(a,e){return`
    <div class="modal-overlay" onclick="window.app.closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Reschedule Booking</h2>
          <p class="text-secondary">The customer will be notified of the change</p>
        </div>
        <form id="reschedule-form" onsubmit="window.app.handleReschedule(event, '${a}')">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">New Date</label>
              <input type="date" name="newDate" class="form-input" required min="${new Date().toISOString().split("T")[0]}">
            </div>
            <div class="grid gap-4" style="grid-template-columns: 1fr 1fr;">
              <div class="form-group">
                <label class="form-label">New Start Time</label>
                <input type="time" name="newStartTime" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">New End Time</label>
                <input type="time" name="newEndTime" class="form-input" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Message to customer (optional)</label>
              <textarea name="message" class="form-input" rows="2" placeholder="Reason for rescheduling..."></textarea>
            </div>
            <div id="reschedule-error" class="form-error hidden"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Reschedule</button>
          </div>
        </form>
      </div>
    </div>
  `}class G{constructor(){this.init()}async init(){if("serviceWorker"in navigator)try{await navigator.serviceWorker.register("/sw.js"),console.log("Service Worker registered")}catch(e){console.log("Service Worker registration failed:",e)}this.setupRoutes(),window.addEventListener("auth:logout",()=>{c.logout(),this.render(),n.navigate("/")}),window.addEventListener("route:loaded",()=>{this.updateBottomNav()}),this.render(),setTimeout(()=>{var e;(e=document.getElementById("loading-screen"))==null||e.classList.add("hidden")},500),c.getState().isAuthenticated&&this.loadUserData()}setupRoutes(){n.register("/",()=>P()),n.register("/login",()=>D()),n.register("/register",()=>R()),n.register("/facility/:id",e=>A(e)),n.register("/bookings",()=>q()),n.register("/notifications",()=>I()),n.register("/profile",()=>z()),n.register("/dashboard",()=>E()),n.register("/dashboard/facility/:id",e=>U(e)),n.register("/dashboard/facility/:id/bookings",e=>H(e))}render(){const e=document.getElementById("app"),t=c.getState();e.innerHTML=`
      ${B()}
      <main class="app-container" id="main-content"></main>
      ${t.isAuthenticated?F():""}
      <div id="modal-container"></div>
      <div id="toast-container" class="toast-container"></div>
    `,document.body.classList.toggle("has-bottom-nav",t.isAuthenticated),n.setContainer(document.getElementById("main-content")),n.handleRoute()}updateBottomNav(){n.getCurrentPath(),document.querySelectorAll(".bottom-nav-item").forEach(e=>{e.classList.remove("active")})}async loadUserData(){try{const e=await l.getUnreadCount();c.setUnreadCount((e==null?void 0:e.count)||0)}catch(e){console.error("Failed to load user data",e)}}async handleLogin(e){e.preventDefault();const t=e.target,s=t.email.value,i=t.password.value,o=document.getElementById("login-error");try{const r=await l.login({email:s,password:i});c.setUser(r.user),this.showToast("Welcome back!","success"),this.render(),n.navigate("/")}catch(r){o.textContent=r.message||"Login failed",o.classList.remove("hidden")}}async handleRegister(e){e.preventDefault();const t=e.target,s={username:t.username.value,email:t.email.value,password:t.password.value,role:parseInt(t.role.value)},i=document.getElementById("register-error");try{const o=await l.register(s);c.setUser(o.user),this.showToast("Account created successfully!","success"),this.render(),n.navigate("/")}catch(o){i.textContent=o.message||"Registration failed",i.classList.remove("hidden")}}logout(){l.logout(),c.logout(),this.showToast("Logged out successfully","success"),this.render(),n.navigate("/")}selectSlot(e,t){if(!c.getState().isAuthenticated){n.navigate("/login");return}document.getElementById("modal-container").innerHTML=O(e,t)}closeModal(){document.getElementById("modal-container").innerHTML=""}async handleBooking(e,t,s){e.preventDefault();const i=e.target,o={facilityId:s,slotId:t,partySize:parseInt(i.partySize.value),notes:i.notes.value||null},r=document.getElementById("booking-error");try{await l.createBooking(o),this.closeModal(),this.showToast("Booking confirmed!","success"),n.navigate("/bookings")}catch(d){r.textContent=d.message||"Booking failed",r.classList.remove("hidden")}}async markNotificationRead(e){try{await l.markNotificationRead(e);const t=await l.getUnreadCount();c.setUnreadCount((t==null?void 0:t.count)||0),n.getCurrentPath()==="/notifications"&&n.handleRoute()}catch(t){console.error("Failed to mark notification read",t)}}async markAllRead(){try{await l.markAllNotificationsRead(),c.setUnreadCount(0),n.handleRoute(),this.showToast("All notifications marked as read","success")}catch(e){console.error("Failed to mark all read",e)}}async filterCategory(e){try{const t=e!==null?{category:e}:{},s=await l.getFacilities(t);c.setFacilities(s);const i=document.getElementById("facilities-grid");i&&(i.innerHTML=s.length>0?s.map(o=>k(o)).join(""):'<div class="card" style="grid-column: 1 / -1; padding: 2rem; text-align: center;"><p class="text-secondary">No facilities found</p></div>')}catch(t){console.error("Failed to filter",t)}}showCreateFacility(){document.getElementById("modal-container").innerHTML=j()}async handleCreateFacility(e){e.preventDefault();const t=e.target,s={name:t.name.value,category:parseInt(t.category.value),description:t.description.value||"",address:t.address.value,phone:t.phone.value||"",imageUrl:t.imageUrl.value||""},i=document.getElementById("create-facility-error");try{await l.createFacility(s),this.closeModal(),this.showToast("Facility created successfully!","success"),n.navigate("/dashboard")}catch(o){i.textContent=o.message||"Failed to create facility",i.classList.remove("hidden")}}async handleAddSlot(e,t){e.preventDefault();const s=e.target,i=s.date.value,o=s.startTime.value,r=s.endTime.value,d={facilityId:t,startTime:`${i}T${o}:00`,endTime:`${i}T${r}:00`,capacity:parseInt(s.capacity.value),price:parseFloat(s.price.value)||0};try{await l.createSlot(d),this.showToast("Slot added successfully!","success"),s.reset()}catch(p){this.showToast(p.message||"Failed to add slot","error")}}async handleBulkSlots(e,t){e.preventDefault();const s=e.target,i={facilityId:t,startDate:s.startDate.value,endDate:s.endDate.value,openTime:s.openTime.value,closeTime:s.closeTime.value,slotDurationMinutes:parseInt(s.duration.value),capacity:parseInt(s.capacity.value)};try{const o=await l.generateBulkSlots(i);this.showToast(`Created ${o.slotsCreated||"multiple"} slots!`,"success"),s.reset()}catch(o){this.showToast(o.message||"Failed to generate slots","error")}}async updateBooking(e,t){try{await l.updateBookingStatus(e,t),this.showToast(t===2?"Booking accepted!":"Booking rejected","success"),n.handleRoute()}catch(s){this.showToast(s.message||"Failed to update booking","error")}}async cancelBooking(e){if(confirm("Are you sure you want to cancel this booking? The customer will be notified."))try{await l.updateBookingStatus(e,4),this.showToast("Booking cancelled. Customer has been notified.","success"),n.handleRoute()}catch(t){this.showToast(t.message||"Failed to cancel booking","error")}}showRescheduleModal(e,t){document.getElementById("modal-container").innerHTML=J(e)}async handleReschedule(e,t){e.preventDefault();const s=e.target,i=s.newDate.value,o=s.newStartTime.value,r=s.newEndTime.value,d=s.message.value,p={newStartTime:`${i}T${o}:00`,newEndTime:`${i}T${r}:00`,message:d||void 0};try{await l.rescheduleBooking(t,p),this.closeModal(),this.showToast("Booking rescheduled! Customer has been notified.","success"),n.handleRoute()}catch(u){const m=document.getElementById("reschedule-error");m.textContent=u.message||"Failed to reschedule",m.classList.remove("hidden")}}showToast(e,t="success"){const s=document.getElementById("toast-container"),i=Date.now(),o=document.createElement("div");o.className=`toast toast-${t}`,o.id=`toast-${i}`,o.innerHTML=e,s.appendChild(o),setTimeout(()=>{o.remove()},4e3)}}document.addEventListener("DOMContentLoaded",()=>{window.app=new G});
//# sourceMappingURL=index-DDcxTa1K.js.map
