<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Галактическая анимация</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            overflow: hidden;
            background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        canvas {
            display: block;
        }

        #cursor {
            position: fixed;
            width: 60px;
            height: 60px;
            border: 2px solid rgba(100, 200, 255, 0.4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 40px rgba(100, 200, 255, 0.2),
                        inset 0 0 20px rgba(100, 200, 255, 0.1);
        }

        #cursor::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: rgba(100, 200, 255, 0.8);
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(100, 200, 255, 0.8);
        }

        #cursor.active {
            transform: translate(-50%, -50%) scale(1.3);
            border-color: rgba(100, 200, 255, 0.7);
            box-shadow: 0 0 60px rgba(100, 200, 255, 0.4),
                        inset 0 0 30px rgba(100, 200, 255, 0.2);
        }

        #info {
            position: fixed;
            top: 30px;
            left: 30px;
            color: rgba(255, 255, 255, 0.95);
            background: rgba(15, 23, 42, 0.5);
            padding: 20px 24px;
            border-radius: 16px;
            font-size: 14px;
            backdrop-filter: blur(30px);
            border: 1px solid rgba(100, 200, 255, 0.15);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                        0 0 40px rgba(100, 200, 255, 0.1);
            z-index: 100;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        #info.hidden {
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
        }

        .info-title {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #64c8ff 0%, #9d7fff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .mode-indicator {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            padding: 8px 14px;
            background: rgba(100, 200, 255, 0.1);
            border-radius: 24px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid rgba(100, 200, 255, 0.2);
            transition: all 0.3s ease;
        }

        .mode-indicator.interactive {
            background: rgba(100, 200, 255, 0.2);
            border-color: rgba(100, 200, 255, 0.4);
            box-shadow: 0 0 20px rgba(100, 200, 255, 0.3);
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }

        .status-dot.active {
            background: #64c8ff;
            box-shadow: 0 0 20px #64c8ff, 0 0 40px rgba(100, 200, 255, 0.5);
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.8;
            }
        }

        #closeBtn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 28px;
            height: 28px;
            border: none;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        #closeBtn:hover {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            transform: scale(1.1);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .hint {
            margin-top: 10px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.5;
        }

        @media (max-width: 768px) {
            #info {
                top: 20px;
                left: 20px;
                right: 20px;
                font-size: 13px;
                padding: 16px 20px;
            }

            #cursor {
                display: none;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>

</head>
<body>
    <canvas id="canvas"></canvas>
    <div id="cursor"></div>
    <div id="info">
        <button id="closeBtn" aria-label="Закрыть подсказку">×</button>
        <div class="info-title">✨ Галактическая анимация</div>
        <div class="mode-indicator" id="modeIndicator">
            <span class="status-dot" id="statusDot"></span>
            <span id="mode">Автоматический режим</span>
        </div>
        <div class="hint">Наведите курсор для создания звёздных потоков</div>
    </div>

    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const cursorEl = document.getElementById('cursor');
        const modeEl = document.getElementById('mode');
        const modeIndicator = document.getElementById('modeIndicator');
        const statusDot = document.getElementById('statusDot');
        const infoPanel = document.getElementById('info');
        const closeBtn = document.getElementById('closeBtn');

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouse = {
            x: null,
            y: null,
            radius: isMobile ? 120 : 200,
            active: false
        };

        let lastMouseMove = Date.now();
        const mouseTimeout = 3000;
        let isInteracting = false;

        closeBtn.addEventListener('click', () => {
            infoPanel.classList.add('hidden');
            localStorage.setItem('hideInfo', 'true');
        });

        if (localStorage.getItem('hideInfo') === 'true') {
            setTimeout(() => {
                infoPanel.classList.add('hidden');
            }, 3000);
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
            mouse.active = true;
            lastMouseMove = Date.now();

            cursorEl.style.left = e.x + 'px';
            cursorEl.style.top = e.y + 'px';
            cursorEl.style.display = 'block';

            if (!isInteracting) {
                isInteracting = true;
                cursorEl.classList.add('active');
                modeEl.textContent = 'Интерактивный режим';
                modeIndicator.classList.add('interactive');
                statusDot.classList.add('active');
            }
        });

        window.addEventListener('mousedown', () => {
            cursorEl.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });

        window.addEventListener('mouseup', () => {
            cursorEl.style.transform = 'translate(-50%, -50%) scale(1.3)';
        });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
            cursorEl.style.display = 'none';
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.baseVelocityX = (Math.random() - 0.5) * 0.8;
                this.baseVelocityY = (Math.random() - 0.5) * 0.8;
                this.phase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.baseSize = this.size;
                this.baseVelocityX = (Math.random() - 0.5) * 0.8;
                this.baseVelocityY = (Math.random() - 0.5) * 0.8;

                // Создаём разнообразие в оттенках синего и фиолетового
                const colorVariant = Math.random();
                if (colorVariant < 0.6) {
                    this.hue = Math.random() * 30 + 180; // Голубой
                } else if (colorVariant < 0.9) {
                    this.hue = Math.random() * 40 + 240; // Фиолетовый
                } else {
                    this.hue = Math.random() * 20 + 160; // Циан
                }

                this.saturation = Math.random() * 30 + 70;
                this.lightness = Math.random() * 40 + 50;
                this.opacity = Math.random() * 0.4 + 0.3;
                this.phase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }

            update() {
                if (Date.now() - lastMouseMove > mouseTimeout && mouse.active) {
                    mouse.active = false;
                    isInteracting = false;
                    cursorEl.classList.remove('active');
                    modeEl.textContent = 'Автоматический режим';
                    modeIndicator.classList.remove('interactive');
                    statusDot.classList.remove('active');
                }

                this.phase += this.wobbleSpeed;
                const sizePulse = Math.sin(this.phase) * 0.5;

                if (mouse.active && mouse.x != null && !isMobile) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);

                        // Мощное притяжение с завихрением
                        const attractionForce = force * 5;
                        const tangentialForce = force * 2;

                        this.x += Math.cos(angle) * attractionForce;
                        this.y += Math.sin(angle) * attractionForce;

                        // Добавляем вращательное движение
                        this.x += Math.cos(angle + Math.PI / 2) * tangentialForce * Math.sin(this.phase * 2);
                        this.y += Math.sin(angle + Math.PI / 2) * tangentialForce * Math.sin(this.phase * 2);

                        // Увеличение яркости и размера
                        this.opacity = Math.min(1, 0.4 + force * 0.6);
                        this.size = this.baseSize * (1 + force * 2);
                    } else {
                        this.x += this.baseVelocityX + Math.sin(this.phase) * 0.3;
                        this.y += this.baseVelocityY + Math.cos(this.phase) * 0.3;
                        this.opacity = Math.max(0.2, this.opacity - 0.008);
                        this.size = Math.max(this.baseSize, this.size - 0.05);
                    }
                } else {
                    // Плавное волновое движение
                    this.x += this.baseVelocityX + Math.sin(this.phase) * 0.5;
                    this.y += this.baseVelocityY + Math.cos(this.phase * 1.3) * 0.5;
                    this.opacity = Math.max(0.2, this.opacity - 0.003);
                    this.size = Math.max(this.baseSize, this.size - 0.02);
                }

                // Мягкий отскок от границ
                if (this.x < 0 || this.x > canvas.width) {
                    this.baseVelocityX *= -0.9;
                    this.x = Math.max(0, Math.min(canvas.width, this.x));
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.baseVelocityY *= -0.9;
                    this.y = Math.max(0, Math.min(canvas.height, this.y));
                }

                this.currentSize = this.size + sizePulse;
            }

            draw() {
                // Многослойное свечение для объёма
                const glowSize = this.currentSize * 8;

                // Внешнее свечение
                const outerGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, glowSize
                );
                outerGlow.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness + 20}%, ${this.opacity * 0.8})`);
                outerGlow.addColorStop(0.3, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.4})`);
                outerGlow.addColorStop(0.6, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness - 10}%, ${this.opacity * 0.2})`);
                outerGlow.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness - 20}%, 0)`);

                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                ctx.fill();

                // Яркое ядро
                ctx.fillStyle = `hsla(${this.hue}, ${this.saturation + 10}%, ${this.lightness + 30}%, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
                ctx.fill();

                // Световой блик
                if (this.opacity > 0.5) {
                    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 95%, ${this.opacity * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(this.x - this.currentSize * 0.3, this.y - this.currentSize * 0.3, this.currentSize * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Соединительные линии
                if (mouse.active && mouse.x != null && !isMobile) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const opacity = (1 - distance / mouse.radius) * this.opacity * 0.5;

                        const gradient = ctx.createLinearGradient(this.x, this.y, mouse.x, mouse.y);
                        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, ${opacity})`);
                        gradient.addColorStop(1, `hsla(200, 80%, 70%, ${opacity * 0.3})`);

                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        let particles = [];

        function init() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / (isMobile ? 8000 : 5000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.1 * Math.min(particles[i].opacity, particles[j].opacity);
                        ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            // Глубокое затухание для эффекта следа
            ctx.fillStyle = 'rgba(9, 10, 15, 0.12)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Соединения между частицами
            connectParticles();

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Область влияния курсора
            if (mouse.active && mouse.x != null && !isMobile) {
                const gradient = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, mouse.radius
                );
                gradient.addColorStop(0, 'rgba(100, 200, 255, 0.12)');
                gradient.addColorStop(0.5, 'rgba(100, 200, 255, 0.06)');
                gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animate);
        }

        init();
        animate();
    </script>

</body>
</html>
