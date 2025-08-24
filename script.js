// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href'); if (id.length < 2) return;
        e.preventDefault(); document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelector('header .nav')?.classList.remove('open');
    })
});

// Stats counter
const observe = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.num').forEach(n => {
                const target = Number(n.getAttribute('data-count')) || 0;
                let cur = 0;
                const step = Math.max(1, Math.ceil(target / 50));
                const timer = setInterval(() => {
                    cur += step;
                    if (cur >= target) { cur = target; clearInterval(timer); }
                    n.textContent = target === 98 ? cur + '%' : (target === 90 ? cur + '%' : cur + (target > 20 ? '+' : ''));
                }, 20);
            });
            observe.unobserve(e.target);
        }
    })
}, { threshold: .3 });
document.querySelectorAll('.stats').forEach(s => observe.observe(s));

// Intersection reveal
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.transition = 'transform .6s ease, opacity .6s ease';
            e.target.style.transform = 'translateY(0)';
            e.target.style.opacity = '1';
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: .2 });
document.querySelectorAll('section .card, .t-item').forEach(el => {
    el.style.transform = 'translateY(14px)'; el.style.opacity = '.0'; revealObs.observe(el);
});

// Particles background
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w, h, particles = [];
function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
addEventListener('resize', resize); resize();
function init() {
    const count = Math.min(140, Math.floor((wh) / 45000));
    particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * 0.6,
        vy: (Math.random() - .5) * 0.6,
        r: Math.random() * 1.8 + 0.6,
        c: Math.random() < .5 ? 'rgba(0,229,255,.7)' : 'rgba(255,0,168,.5)'
    }));
}
init();
function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx = -1;
        if (p.y < 0 || p.y > h) p.vy = -1;
    }
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
            if (d < 110) {
                ctx.strokeStyle = 'rgba(124,77,255,' + ((1 - d / 110) * 0.25) + ')';
                ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
        }
    }
    for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI2);
        ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12; ctx.fill();
    }
    requestAnimationFrame(step);
}
step();