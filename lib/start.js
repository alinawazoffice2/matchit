
let score = document.getElementById("score")
let canvas = document.getElementById("screen")
let ctx = canvas.getContext("2d")
let screen = {height: 500, width: 500}


let gen1 = new BoxGenerator()
let gen2 = new BoxGenerator()
let gen3 = new BoxGenerator()
let gen4 = new BoxGenerator()
let gen5 = new BoxGenerator()
let gen6 = new BoxGenerator()
let gen7 = new BoxGenerator()
let gen8 = new BoxGenerator()
let gen9 = new BoxGenerator()
let gen10 = new BoxGenerator()



setInterval(function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    gen1.start(0)
    gen2.start(50)
    gen3.start(100)
    gen4.start(150)
    gen5.start(200)
    gen6.start(250)
    gen7.start(300)
    gen8.start(350)
    gen9.start(400)
    gen10.start(450)
}, 10)

function BoxGenerator()
{
    let me = this
    this.index = -1
    this.boxes = []

    this.start = function(x)
    {
        if(me.index == -1)
        {
            me.make(x)
        }
        // check if last box crossed threshold of new generation
        if(me.getLastOne(x).y > me.getLastOne(x).h)
        {
            // generate new
            me.make(x)
        }
        // animate fall
        let same_color_indexes = []
        let same_color_count = 0
        let last_color = ''
        for (let i = me.boxes.length-1; i > -1; i--) 
        {
            if(me.boxes[i] !== null)
            {
                const box = me.boxes[i]
                box.draw(i == 0 ? (screen.height-box.h) : (me.getNextKin(i, x).y - me.getNextKin(i, x).h))            
            }
        }
        if(me.isAllGrounded(x))
        {
            console.log('last one grounded')
            for (let i = 0; i < me.boxes.length; i++) {
                const box = me.boxes[i]
                if(box !== null)
                {
                    // check if 3 consective colors found
                    if(box.color != last_color)
                    {
                        same_color_count = 0
                        same_color_indexes = []
                        last_color = box.color
                    }else{
                        same_color_count++
                        same_color_indexes.push(i)
                    }
                    if(same_color_count == 2)
                    {
                        console.log('connective 3 found for: ', me.boxes[same_color_indexes[0]].color)
                        same_color_indexes.forEach(index => {
                            me.boxes[index] = null
                        })                    
                        score.innerHTML = parseInt(score.innerHTML) + 10
                        me.ungroundAll(x)
                        break
                    }
                }
            }
        }
    }

    this.randomColor = function()
    {
        // let colors = ['red', 'blue', 'green', 'purple', 'yellow']
        // return colors[Math.floor(Math.random() * 5)]
        let colors = ['red', 'blue']
        return colors[Math.floor(Math.random() * 2)]
    }

    this.ungroundAll = function(x)
    {
        for (let i = 0; i < me.boxes.length; i++)
        {
            if(me.boxes[i] !== null && me.boxes[i].x == x)
                me.boxes[i].grounded = false
        }
    }

    this.isAllGrounded = function(x)
    {
        let all_grounded = true
        for (let i = 0; i < me.boxes.length; i++)
        {
            if(me.boxes[i] !== null && me.boxes[i].x == x)
                if(!me.boxes[i].grounded)
                    all_grounded = false
        }
        return all_grounded
    }

    this.getLastOne = function(x)
    {
        let last = null
        for (let i = 0; i < me.boxes.length; i++)
        {
            if(me.boxes[i] !== null && me.boxes[i].x == x)
                last = me.boxes[i]
        }
        return last
    }

    this.getNextKin = function(index, x)
    {
        let kin = null
        for (let i = index-1; i > -1; i--)
        {
            if(me.boxes[i] !== null && me.boxes[i].x == x)
            {
                kin = me.boxes[i]
                break
            }
        }
        return kin
    }

    this.make = function(x)
    {
        me.index++
        me.boxes[me.index] = new Box()
        me.boxes[me.index].x = x
        me.boxes[me.index].color = me.randomColor()
    }

}

function Box()
{
    let me = this
    this.color = 'red'
    this.x = 0
    this.y = 0
    this.h = 50
    this.w = 50
    this.speed = 1
    this.grounded = false

    this.draw = function(ground)
    {
        ctx.fillStyle = me.color
        ctx.strokeStyle = 'black'
        ctx.fillRect(me.x, me.y, me.w, me.h)
        ctx.strokeRect(me.x, me.y, me.w, me.h)

        // fall
        if(me.y < ground)
        {
            me.y += me.speed
            me.speed += 0.2
        }else{
            me.y = ground
            me.grounded = true
        }
        
    }
}