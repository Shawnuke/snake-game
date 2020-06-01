/* Set up */
const $wrapper: HTMLElement = document.querySelector('.wrapper')
const $canvas: any = document.querySelector('.js-canvas')
const context = $canvas.getContext('2d')

$canvas.focus()

/* Resize */
const frame = 
{ 
    width: $canvas.width, // $canvas.width, 
    height: $canvas.height,// $canvas.height 
    scale: 20
}

let apples = []
const apple = new Apple(
    {
        context: context,
        color: 'white',
        x: 2,
        y: 2,
        canvasSizes: frame
    })
apples.push(apple)


let snakes = []
const snake = new Snake(
    {
        context: context,
        x: 3,
        y: 10,
        color: '#32CE36',
        apples: apples,
        scale: frame.scale
    })
snakes.push(snake)




// controls
document.addEventListener("keydown", (_event) => 
{
    switch (_event.keyCode)
    {
        case 38: // up arrow
        case 90: // Z key
            // if (snake.direction.y == 1) return // prevent the player from going straight back in the opposite direction
            // if (snake.head.x == snake.body[length-1].x && snake.head.y == snake.body[length-1].y + 1) return // works, but ugly
            if (snake.head.x == snake.head.previousX) return
            snake.setDirectionTo(0, -1)
            break
        case 39: // right arrow
        case 68: // D key
            // if (snake.direction.x == -1) return
            if (snake.head.y == snake.head.previousY) return
            snake.setDirectionTo(1, 0)
            break
        case 40: // down arrow
        case 83: // S key
            // if (snake.direction.y == -1) return
            if (snake.head.x == snake.head.previousX) return
            snake.setDirectionTo(0, 1)
            break
        case 37: // left arrow
        case 81: // Q key
            // if (snake.direction.x == 1) return
            if (snake.head.y == snake.head.previousY) return
            snake.setDirectionTo(-1, 0)
            break
        case 71: // G key
            snake.grow()
            break
    }
})



const drawGrid = (_canvas, _color) =>
{
    context.strokeStyle = _color
    context.beginPath()
    for (var x = 0; x <= _canvas.width; x += _canvas.scale) 
    {
        context.moveTo(x, 0)
        context.lineTo(x, _canvas.height)
    }
    for (var y = 0; y <= _canvas.height; y += _canvas.scale) 
    {
        context.moveTo(0, y)
        context.lineTo(_canvas.height, y)
    }
    context.stroke()
}

const drawCheckeredBackground = (_canvas, _color: string) => 
{
    context.fillStyle = _color
    
    let w = _canvas.width
    let h = _canvas.height

    const nCol = w / _canvas.scale
    const nRow = h / _canvas.scale

    w /= nCol            // width of a block
    h /= nRow            // height of a block

    context.beginPath()
    for (let i = 0; i < nRow; ++i) 
    {
        for (let j = 0, col = nCol / 2; j < col; ++j) 
        {
            context.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h)
        }
    }
    context.fill()
}

const fps = 12
const loop = () =>
{
    setTimeout(() => 
    {
        const game = window.requestAnimationFrame(loop)
        // Maths
        for (const _snake of snakes)
        {
            // update snakes positions
            _snake.updatePosition()

            // resolve snakes collisions
            _snake.fatalCollisionDetection(frame)
            if (!_snake.isAlive) 
            {
                window.cancelAnimationFrame(game)
                console.log('you died. max length:', _snake.body.length)
            }

            // resolve snake-apple collisions
            apples = _snake.appleCollisionDetection(apples)
            if (_snake.ate)
            {
                _snake.ate = false
                _snake.grow()
            }

            // Clear canvas
            context.clearRect(0, 0, frame.width, frame.height)

            // Draw
            _snake.draw()
        }

        for (const _apple of apples)
        {
            if (_apple.isEaten)
            {
                _apple.relocate()
            }
            _apple.draw()
        }

        /* style the map */
        // drawGrid(frame, 'black')
        drawCheckeredBackground(frame, '#FFFFFF22')
    }, 1000/fps)

}
loop()