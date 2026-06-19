// JavaScript for 科技應用與創意實作 期末成果展 (相片展示版)

// ==========================================
// 1. 全域變數與載入設定
// ==========================================
// 預期嘗試載入的最大照片數量
const MAX_PHOTOS = 16;
// 儲存成功載入的照片清單，用於 Lightbox 切換
let loadedPhotos = [];
let currentPhotoIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadGalleryImages();
    initNavbarScroll();
    initMobileMenu();
    initScrollReveal();
    initLightbox();
    initParticleBackground();
});

// ==========================================
// 2. 智慧照片載入器 (自動隱藏不存在的照片)
// ==========================================
function loadGalleryImages() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    
    grid.innerHTML = ""; // 清空容器
    
    for (let i = 1; i <= MAX_PHOTOS; i++) {
        const item = document.createElement("div");
        item.className = "gallery-item reveal";
        item.style.display = "none"; // 預設隱藏，載入成功才顯示
        item.style.transitionDelay = `${(i - 1) * 0.05}s`;
        
        const img = document.createElement("img");
        img.className = "gallery-img";
        img.src = `assets/photo${i}.jpg`;
        img.alt = `課堂紀錄照片 ${i}`;
        
        // 載入成功處理
        img.onload = () => {
            item.style.display = "block"; // 顯示該卡片
            
            // 記錄這張照片的資訊
            const photoInfo = {
                src: img.src,
                alt: img.alt,
                index: loadedPhotos.length
            };
            loadedPhotos.push(photoInfo);
            
            // 綁定點擊事件開啟 Lightbox
            item.addEventListener("click", () => {
                openLightbox(photoInfo.index);
            });
            
            // 重新初始化滾動漸顯，確保新顯示的元件能正常觸發
            setTimeout(triggerScrollReveal, 100);
        };
        
        // 載入失敗處理（例如檔案不存在）
        img.onerror = () => {
            item.remove(); // 直接從 DOM 中移除
        };
        
        // 懸停覆蓋層
        const hoverOverlay = document.createElement("div");
        hoverOverlay.className = "gallery-hover-overlay";
        hoverOverlay.innerHTML = `
            <span class="gallery-hover-title">課堂紀錄照片 ${i}</span>
            <svg class="gallery-hover-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
        `;
        
        item.appendChild(img);
        item.appendChild(hoverOverlay);
        grid.appendChild(item);
    }
}

// ==========================================
// 3. 互動燈箱效果 (Lightbox)
// ==========================================
function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    
    if (!lightbox) return;
    
    // 關閉燈箱
    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    };
    
    // 顯示特定索引的照片
    window.openLightbox = (index) => {
        if (index < 0 || index >= loadedPhotos.length) return;
        
        currentPhotoIndex = index;
        const photo = loadedPhotos[index];
        
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxCaption = document.getElementById("lightbox-caption");
        
        lightboxImg.src = photo.src;
        lightboxCaption.textContent = photo.alt;
        
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // 避免底層背景滾動
    };
    
    // 上一張
    const showPrev = (e) => {
        if (e) e.stopPropagation();
        let newIndex = currentPhotoIndex - 1;
        if (newIndex < 0) newIndex = loadedPhotos.length - 1; // 循環到最後一張
        openLightbox(newIndex);
    };
    
    // 下一張
    const showNext = (e) => {
        if (e) e.stopPropagation();
        let newIndex = currentPhotoIndex + 1;
        if (newIndex >= loadedPhotos.length) newIndex = 0; // 循環到第一張
        openLightbox(newIndex);
    };
    
    // 事件監聽
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", closeLightbox); // 點擊背景關閉
    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);
    
    // 鍵盤控制 (左右鍵切換，Esc 關閉)
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
    });
}

// ==========================================
// 4. 導覽列與選單控制
// ==========================================
function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

function initMobileMenu() {
    const btn = document.querySelector(".mobile-menu-btn");
    const drawer = document.querySelector(".mobile-nav");
    const links = document.querySelectorAll(".mobile-nav-link");
    
    if (!btn || !drawer) return;
    
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        drawer.classList.toggle("active");
        btn.classList.toggle("open");
        
        const spans = btn.querySelectorAll("span");
        if (btn.classList.contains("open")) {
            spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
            spans[1].style.opacity = "0";
            spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
        } else {
            spans[0].style.transform = "none";
            spans[1].style.opacity = "1";
            spans[2].style.transform = "none";
        }
    });
    
    links.forEach(link => {
        link.addEventListener("click", () => {
            closeDrawer();
        });
    });
    
    document.addEventListener("click", () => {
        closeDrawer();
    });
    
    function closeDrawer() {
        if (drawer.classList.contains("active")) {
            drawer.classList.remove("active");
            btn.classList.remove("open");
            const spans = btn.querySelectorAll("span");
            spans[0].style.transform = "none";
            spans[1].style.opacity = "1";
            spans[2].style.transform = "none";
        }
    }
}

// ==========================================
// 5. 滾動漸顯動畫 (Scroll Reveal)
// ==========================================
function initScrollReveal() {
    window.addEventListener("scroll", triggerScrollReveal);
    // 初始延遲執行一次，讓首頁動畫先跑
    setTimeout(triggerScrollReveal, 300);
}

function triggerScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const triggerBottom = window.innerHeight * 0.85;
    
    reveals.forEach(el => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < triggerBottom) {
            el.classList.add("active");
        }
    });
}

// ==========================================
// 6. 科技感粒子背景 (Canvas Particles)
// ==========================================
function initParticleBackground() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let numberOfParticles = 40;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", () => {
        resizeCanvas();
        particlesArray = [];
        createParticles();
    });
    
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.color = Math.random() > 0.5 ? "rgba(0, 242, 254, 0.4)" : "rgba(181, 23, 158, 0.3)";
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function createParticles() {
        numberOfParticles = Math.floor((canvas.width * canvas.height) / 30000);
        if (numberOfParticles > 60) numberOfParticles = 60;
        
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    opacityValue = 1 - (distance / 150);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
}
