class Snake {
    constructor(_options) {
        this.context = _options.context;
        // this.x = _options.x
        // this.y = _options.y
        this.color = _options.color;
        this.apples = _options.apples;
        this.head =
            {
                x: _options.x,
                y: _options.y
            };
        this.direction =
            {
                x: 1,
                y: 0
            };
        this.body = [];
        this.isAlive = true;
        this.ate = false;
        this.scale = _options.scale;
        this.grow();
        this.grow();
        this.grow();
    }
    updatePosition() {
        // keep trace of previous head position (for collision management)
        this.head.previousX = this.head.x;
        this.head.previousY = this.head.y;
        // update head position relative to direction
        this.head.x += this.direction.x;
        this.head.y += this.direction.y;
        this.body.push({ x: this.head.x, y: this.head.y }); // add a block ahead of the snake
        this.body.shift(); // remove the last block of its tail
    }
    fatalCollisionDetection(_canvas) {
        /* outer ring */
        if (this.head.x < 0
            || this.head.x > (_canvas.width - this.scale) / this.scale
            || this.head.y < 0
            || this.head.y > (_canvas.height - this.scale) / this.scale)
            this.isAlive = false;
        /* self collision detection */
        if (this.body.length <= 4)
            return; // no need to test self-collision if snake length < 4
        const max = this.body.length - 4;
        const verifyArray = this.body.slice(0, max);
        for (const _bodyPart of verifyArray) {
            if (this.head.x == _bodyPart.x && this.head.y == _bodyPart.y) {
                this.isAlive = false;
            }
        }
    }
    appleCollisionDetection(list) {
        this.apples = list;
        for (const _apple of this.apples) {
            if (this.head.x == _apple.position.x && this.head.y == _apple.position.y) {
                this.ate = true;
                _apple.isEaten = true;
            }
        }
        return this.apples;
    }
    draw() {
        /* draw the snake */
        this.context.fillStyle = this.color;
        this.context.beginPath();
        for (const _bodyPart of this.body) {
            const x = _bodyPart.x * this.scale;
            const y = _bodyPart.y * this.scale;
            const width = 1 * this.scale;
            const height = 1 * this.scale;
            this.context.fillRect(x, y, width, height);
        }
        /* color the head when the snake dies */
        if (!this.isAlive) {
            this.context.fillStyle = 'red';
            const x = this.head.x * this.scale;
            const y = this.head.y * this.scale;
            const width = 1 * this.scale;
            const height = 1 * this.scale;
            this.context.fillRect(x, y, width, height);
        }
        const centerOf = (_cell, _scale) => {
            return _cell * _scale + _scale / 2;
        };
        // highlight the head
        // create gradient
        this.context.beginPath();
        const gradient = context.createRadialGradient(centerOf(this.head.x, this.scale), // inner x
        centerOf(this.head.y, this.scale), // inner y
        0, // inner radius
        centerOf(this.head.x, this.scale), // outer x
        centerOf(this.head.y, this.scale), // outer y
        2 * this.scale // outer radius
        );
        if (this.isAlive) {
            gradient.addColorStop(0, '#32CE3699');
            gradient.addColorStop(1, '#32CE3600');
        }
        else {
            gradient.addColorStop(0, '#CE323699');
            gradient.addColorStop(1, '#CE323600');
        }
        /* draw the gradient */
        this.context.fillStyle = gradient;
        this.context.arc(centerOf(this.head.x, this.scale), // x
        centerOf(this.head.y, this.scale), // y 
        10 * this.scale, // radius
        0, // start angle
        Math.PI * 2 // theta
        );
        this.context.fill();
    }
    setDirectionTo(a, b) {
        this.direction.x = a;
        this.direction.y = b;
    }
    grow() {
        this.body.push({ x: this.head.x, y: this.head.y });
    }
}
