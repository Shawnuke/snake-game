// type apple =
// {
//     context: HTMLElement,
//     color: string
//     position: location
// }
class Apple {
    constructor(_options) {
        this.context = _options.context;
        this.color = _options.color;
        this.position =
            {
                x: _options.x,
                y: _options.y
            };
        this.isEaten = false;
        this.canvasSizes = _options.canvasSizes;
    }
    relocate() {
        this.isEaten = false;
        this.position =
            {
                x: Math.floor(Math.random() * this.canvasSizes.width / 20),
                y: Math.floor(Math.random() * this.canvasSizes.width / 20),
            };
    }
    draw() {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.position.x * 20 + 10, // x
        this.position.y * 20 + 10, // y 
        1 * 8, // radius
        0, // start angle
        Math.PI * 2 // theta
        );
        this.context.fill();
    }
}
