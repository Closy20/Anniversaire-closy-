
const countdownDate = new Date("September 2, 2024 00:00:00").getTime();

const countdownTimer = setInterval(function() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown-timer").innerHTML = days + "J " + hours + "h "
    + minutes + "m " + seconds + "s ";

    if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown-timer").innerHTML = "C'est aujourd'hui !";
    }
}, 1000);

// Fonction pour gérer les cadeaux
function offerGift(type) {
    if (type === 'souhait') {
        document.getElementById("gift-response").innerText = "Merci ! J'ai hâte de découvrir votre souhait.";
    } else if (type === 'argent') {
        document.getElementById("gift-response").innerText = "Merci ! Vous pouvez m'offrir de l'argent comme cadeau.";
    }
}

// Fonction pour soumettre des messages
function submitMessage() {
    const message = document.getElementById("message-input").value;
    if (message) {
        const messagesContainer = document.getElementById("messages-container");
        const messageElement = document.createElement("p");
        messageElement.innerText = message;
        messagesContainer.appendChild(messageElement);
        document.getElementById("message-input").value = ""; // Efface la zone de texte
    }
}

// Feux d'artifice en arrière-plan
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

class Firework {
    constructor() {
        this.x = random(0, canvas.width);
        this.y = canvas.height;
        this.radius = random(4, 8); // Augmentation de la taille des particules
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocityX = random(-3, 3);
        this.velocityY = random(-12, -6); // Réduction de la vitesse pour une dispersion plus large
        this.alpha = 1;
        this.explosionRadius = random(50, 150); // Plus grand rayon d'explosion
        this.particles = [];
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    explode() {
        const particleCount = 100; // Augmenter le nombre de particules pour chaque feu d'artifice
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2) / particleCount;
            const x = Math.cos(angle * i) * this.explosionRadius;
            const y = Math.sin(angle * i) * this.explosionRadius;
            this.particles.push(new Particle(this.x, this.y, x, y, this.color));
        }
    }

    update() {
        if (this.y <= canvas.height / 2) {
            this.explode();
            this.alpha = 0;
        }
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= 0.01;
    }
}

class Particle {
    constructor(x, y, velocityX, velocityY, color) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= 0.01;
    }
}

let fireworks = [];

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.1) { // Augmenter la fréquence des feux d'artifice
        fireworks.push(new Firework());
    }

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();

        firework.particles.forEach((particle, pIndex) => {
            particle.update();
            particle.draw();

            if (particle.alpha <= 0) {
                firework.particles.splice(pIndex, 1);
            }
        });

        if (firework.alpha <= 0 && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
}

animate();
