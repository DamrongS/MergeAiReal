class Dot
{
    constructor(x, y, size)
    {
        this.pos = createVector(x, y);
        this.previousSize = size;
        this.r = size;
    }

    display()
    {
        fill(255);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    behavior()
    {
        let distance = dist(this.pos.x, this.pos.y, mouseX, mouseY)

        if(distance < 200)
        {
            distance = map(distance, 0, 200, this.previousSize*2, this.previousSize);
            this.r = distance;
        }
        else
        {
            this.r = this.previousSize;
        }
    }

}