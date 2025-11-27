<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NANO Particle Logo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            overflow: hidden;
            background: #0a0e27;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        canvas {
            display: block;
        }

        #cursor {
            position: fixed;
            width: 50px;
            height: 50px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translate(-50%, -50%);
        }

        @media (max-width: 768px) {
            #cursor {
                display: none;
            }
        }
    </style>

</head>
<body>
    <canvas id="canvas"></canvas>
    <canvas id="textCanvas" style="display: none;"></canvas>
    <div id="cursor"></div>

    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const textCanvas = document.getElementById('textCanvas');
        const textCtx = textCanvas.getContext('2d');
        const cursorEl = document.getElementById('cursor');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        textCanvas.width = 1000;
        textCanvas.height = 300;

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        let mouse = {
            x: null,
            y: null,
            radius: 250,
            active: false
        };

        let textParticles = [];

        // Управление курсором
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
            mouse.active = true;

            cursorEl.style.left = e.x + 'px';
            cursorEl.style.top = e.y + 'px';
            cursorEl.style.display = 'block';
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

        // Создаём текстовую маску для букв NANO
        function createTextParticles() {
            textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            textCtx.fillStyle = 'white';
            textCtx.font = 'bold 200px Arial';
            textCtx.textAlign = 'center';
            textCtx.textBaseline = 'middle';
            textCtx.letterSpacing = '5px';
            textCtx.fillText('NANO', textCanvas.width / 2, textCanvas.height / 2);

            const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
            const pixels = imageData.data;

            textParticles = [];

            // Собираем координаты белых пикселей (текст)
            const gap = 3; // Увеличиваем расстояние между частицами для четкости
            for (let y = 0; y < textCanvas.height; y += gap) {
                for (let x = 0; x < textCanvas.width; x += gap) {
                    const index = (y * textCanvas.width + x) * 4;
                    const alpha = pixels[index + 3];

                    if (alpha > 128) {
                        // Масштабируем координаты под размер экрана
                        const scaleX = canvas.width / textCanvas.width;
                        const scaleY = canvas.height / textCanvas.height;
                        const scale = Math.min(scaleX, scaleY) * 0.7;

                        const offsetX = (canvas.width - textCanvas.width * scale) / 2;
                        const offsetY = (canvas.height - textCanvas.height * scale) / 2;

                        textParticles.push({
                            targetX: x * scale + offsetX,
                            targetY: y * scale + offsetY
                        });
                    }
                }
            }
        }

        // Класс частицы
        class Particle {
            constructor(index) {
                this.index = index;

                // Случайная начальная позиция
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;

                // Целевая позиция (из букв SR)
                if (textParticles[index]) {
                    this.targetX = textParticles[index].targetX;
                    this.targetY = textParticles[index].targetY;
                } else {
                    this.targetX = this.x;
                    this.targetY = this.y;
                }

                // Случайные скорости для автономного движения
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;

                this.size = Math.random() * 1 + 0.8;
                this.baseSize = this.size;

                // Единый минималистичный цвет - чистый белый
                this.color = '#FFFFFF';

                this.opacity = 0.9;
                this.phase = Math.random() * Math.PI * 2;
            }

            update() {
                this.phase += 0.02;

                if (mouse.active && mouse.x != null) {
                    // Расстояние до мыши
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

                    if (distanceToMouse < mouse.radius) {
                        // В зоне влияния мыши - двигаемся к целевой позиции (буквы SR)
                        const force = (mouse.radius - distanceToMouse) / mouse.radius;

                        const targetDx = this.targetX - this.x;
                        const targetDy = this.targetY - this.y;

                        // Сильное притяжение к целевой позиции
                        this.x += targetDx * force * 0.2;
                        this.y += targetDy * force * 0.2;

                        this.size = this.baseSize * (1 + force * 0.3);
                        this.opacity = 0.9 + force * 0.1;
                    } else {
                        // Вне зоны влияния - автономное движение
                        this.x += this.vx;
                        this.y += this.vy;

                        this.size += (this.baseSize - this.size) * 0.05;
                        this.opacity += (0.7 - this.opacity) * 0.05;
                    }
                } else {
                    // Мышь неактивна - свободное движение
                    this.x += this.vx;
                    this.y += this.vy;

                    this.size += (this.baseSize - this.size) * 0.05;
                    this.opacity += (0.7 - this.opacity) * 0.05;
                }

                // Отскок от границ
                if (this.x < 0 || this.x > canvas.width) {
                    this.vx *= -1;
                    this.x = Math.max(0, Math.min(canvas.width, this.x));
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.vy *= -1;
                    this.y = Math.max(0, Math.min(canvas.height, this.y));
                }
            }

            draw() {
                // Минималистичный стиль - без свечения, только чистая форма
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let particles = [];

        function init() {
            createTextParticles();
            particles = [];

            // Создаём частицу для каждой точки в буквах SR
            for (let i = 0; i < textParticles.length; i++) {
                particles.push(new Particle(i));
            }

            console.log(`Создано ${particles.length} частиц`);
        }

        function connectNearbyParticles() {
            if (!mouse.active) return;

            // Соединяем только ближайшие частицы для производительности
            for (let i = 0; i < particles.length; i += 4) {
                const p1 = particles[i];

                // Проверяем только если частица близко к мыши
                const dxToMouse = mouse.x - p1.x;
                const dyToMouse = mouse.y - p1.y;
                const distToMouse = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse);

                if (distToMouse > mouse.radius) continue;

                for (let j = i + 1; j < Math.min(i + 8, particles.length); j++) {
                    const p2 = particles[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 30) {
                        const opacity = (1 - distance / 30) * 0.15 * Math.min(p1.opacity, p2.opacity);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            // Затухающий след
            ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Обновление и отрисовка частиц
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Соединительные линии
            connectNearbyParticles();

            // Минималистичная область влияния курсора - без градиента
            if (mouse.active && mouse.x != null && !isMobile) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        }

        init();
        animate();
    </script>

</body>
</html>
