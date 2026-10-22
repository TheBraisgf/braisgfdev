const experiments=[
{id:'001',title:'Turn my personal website into a place worth visiting',desc:'Can a personal website become more than a portfolio — a living archive of ideas, experiments and things worth making?',status:'RUNNING',type:'META',year:'2026',href:'#001'},
{id:'002',title:'Build a better digital reader',desc:'I want to understand what a genuinely good digital reading experience could feel like for books and comics.',status:'IDEA',type:'SOFTWARE',year:'2026',href:'#002'},
{id:'003',title:'Learn by building the thing',desc:'Pick a skill I barely have and make something that forces me to learn it instead of watching another tutorial.',status:'PLANNED',type:'LEARNING',year:'2026',href:'#003'},
{id:'004',title:'The next experiment',desc:'This slot belongs to an idea that does not exist yet. Maybe you have one.',status:'OPEN',type:'UNKNOWN',year:'???',href:'#004'}
];
const archive=document.querySelector('#archive');
archive.innerHTML=experiments.map(e=>`<article class="exp" id="${e.id}"><div class="exp-num">#${e.id}</div><a href="${e.href}"><div><h2 class="exp-title">${e.title}</h2><p class="exp-desc">${e.desc}</p></div></a><div class="exp-meta"><strong>${e.status}</strong>${e.type}<br>${e.year}</div></article>`).join('');
