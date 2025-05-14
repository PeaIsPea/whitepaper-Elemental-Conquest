const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
let particlesArray = [];
const numberOfParticles = 100;
const particleColor = '#888';
const particleSize = 2;
const connectionDistance = 100;

// Thiết lập kích thước canvas khi cửa sổ thay đổi
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    init();
});

class Particle {
    constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        if (this.x + this.size > width || this.x - this.size < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.size > height || this.y - this.size < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const dx = (Math.random() - 0.5) * 0.5; // Tốc độ chậm hơn
        const dy = (Math.random() - 0.5) * 0.5; // Tốc độ chậm hơn
        particlesArray.push(new Particle(x, y, dx, dy, particleSize, particleColor));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        for (let j = i; j < particlesArray.length; j++) {
            const distance = Math.sqrt(
                Math.pow(particlesArray[i].x - particlesArray[j].x, 2) +
                Math.pow(particlesArray[i].y - particlesArray[j].y, 2)
            );
            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.strokeStyle = particleColor;
                ctx.lineWidth = 0.2;
                ctx.stroke();
            }
        }
    }
}

// Khởi tạo và chạy hiệu ứng
canvas.width = width;
canvas.height = height;
init();
animate();