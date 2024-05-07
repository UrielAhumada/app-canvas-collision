// Selecciona el elemento canvas del documento HTML
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight; // Altura de la ventana
const window_width = window.innerWidth; // Ancho de la ventana 

canvas.height = window_height; // Establece la altura del lienzo
canvas.width = window_width; // Establece el ancho del lienzo

canvas.style.background = "#ff8"; // Establece el color de fondo del lienzo

// Definición de la clase Circle para representar un círculo
class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x; // Posición en el eje x
        this.posY = y; // Posición en el eje y
        this.radius = radius; // Radio del círculo
        this.color = color; // Color del círculo
        this.text = text; // Texto dentro del círculo
        this.speed = speed; // Velocidad de movimiento

        // Inicializa el desplazamiento en el eje x e y con una dirección aleatoria
        this.dx = Math.random() < 0.5 ? -1 * this.speed : 1 * this.speed;
        this.dy = Math.random() < 0.5 ? -1 * this.speed : 1 * this.speed;
    }

    // Método para dibujar el círculo en el canvas
    draw(context) {
        context.beginPath();

        // Configura el color y el texto del círculo
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        // Dibuja el círculo con el radio especificado
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    // Método para actualizar la posición del círculo
update(context, circles) {
    this.draw(context); // Dibuja el círculo

    let touching = false; // Variable para indicar si el círculo está tocando otro

    // Verifica los límites del canvas para cambiar la dirección del movimiento
    if ((this.posX + this.radius + this.dx) > window_width || (this.posX - this.radius + this.dx) < 0) {
        this.dx = -this.dx; // Invierte la dirección en el eje x
    }

    if ((this.posY - this.radius + this.dy) < 0 || (this.posY + this.radius + this.dy) > window_height) {
        this.dy = -this.dy; // Invierte la dirección en el eje y
    }

    // Actualiza la posición del círculo según el desplazamiento
    this.posX += this.dx;
    this.posY += this.dy;

    // Verifica si hay colisión con otros círculos
    for (let otherCircle of circles) {
        if (otherCircle !== this && this.isColliding(otherCircle)) {
            touching = true; // Marca que este círculo está tocando otro

            // Calcula el ángulo de la colisión
            const dx = otherCircle.posX - this.posX;
            const dy = otherCircle.posY - this.posY;
            const angle = Math.atan2(dy, dx);

            // Calcula el ángulo de reflexión y ajusta la velocidad en consecuencia
            const reflectionAngle = angle + Math.PI;
            const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this.dx = Math.cos(reflectionAngle) * speed;
            this.dy = Math.sin(reflectionAngle) * speed;
        }
    }

    // Cambia el color del círculo según si está tocando otro o no
    this.color = touching ? "red" : "blue";
}

    // Método para verificar si hay colisión con otro círculo
    isColliding(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius; // Devuelve verdadero si hay colisión, falso de lo contrario
    }
}

let circles = []; // Arreglo para almacenar los círculos
const numCircles = 10; // Número de círculos

// Genera círculos aleatorios y los agrega al arreglo
for (let i = 0; i < numCircles; i++) {
    let randomX = Math.random() * window_width;
    let randomY = Math.random() * window_height;
    let randomRadius = Math.floor(Math.random() * 100 + 30);

    let circle = new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), 2);
    circles.push(circle);
}

// Función para dibujar y actualizar todos los círculos
let updateCircles = function () {
    requestAnimationFrame(updateCircles); // Llama a la función recursivamente para animación

    ctx.clearRect(0, 0, window_width, window_height); // Limpia el lienzo en cada fotograma

    // Actualiza y dibuja cada círculo
    for (let circle of circles) {
        circle.update(ctx, circles);
    }
};

updateCircles(); // Inicia la animación