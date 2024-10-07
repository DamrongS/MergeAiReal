let globalDragging = false

let chatResponse = '';

let dots = [];
let dotsSpacing = 50;

let Inventory = [];
let Active = [];

function setup() 
{
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i < width / dotsSpacing; i++)
  {
    for(let j = 0; j < height / dotsSpacing; j++)
    {
      dots.push(new Dot(i * dotsSpacing, j * dotsSpacing, 5))
    }
  }
  

  Inventory[0] = new Block(200, 200, 100, 50, "Fire")

}

function draw()
{
  background(200);

  for(let i = 0; i < dots.length; i++)
  {
    dots[i].behavior();
    dots[i].display();
  }

  for(let i = 0; i < Inventory.length; i++)
  {
    Inventory[i].display();
    Inventory[i].duplicate();
  }

  for(let i = 0; i < Active.length; i++)
  {
    Active[i].display();
    Active[i].moveBlock();
  }

  for(let i = 0; i < Active.length; i++)
  {
    for(let j = 0; j < Active.length; j++)
    {
      if (Active[i] != Active[j])
      {
        Active[i].merge(Active[j])
      }
    }
  }

  //console.log(Inventory)
  //console.log(Active)

}
