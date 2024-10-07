const url = "https://api.openai.com/v1/completions";

let merging = false;

class Block
{
    constructor(x, y, w, h, element)
    {
        this.pos = createVector(x, y);
        this.size = createVector(w, h);
        this.element = element;
        this.moveOffset = createVector(0, 0);
        this.isDragging = false;
        this.isDuplicated = false
        this.strokeWeight = 0;
        this.isMerged = false;
    }

    display()
    {
        fill(225);
        stroke(0);
        strokeWeight(this.strokeWeight);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y, 5)

        fill(0);
        textAlign(CENTER, CENTER);
        text(this.element, this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2))
    }

    moveBlock() {
        if (
            mouseX < this.pos.x + this.size.x &&
            mouseX > this.pos.x &&
            mouseY < this.pos.y + this.size.y &&
            mouseY > this.pos.y
        ) {
            if (mouseIsPressed && !this.isDragging && !globalDragging) {
                this.isDragging = true;
                globalDragging = true;
                this.moveOffset = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
            }
        }

        if (this.isDragging) {
            this.pos = createVector(mouseX - this.moveOffset.x, mouseY - this.moveOffset.y);
        }

        if (!mouseIsPressed) {
            this.isDragging = false;
            globalDragging = false;
        }
    }

    duplicate()
    {
        if (
            mouseX < this.pos.x + this.size.x &&
            mouseX > this.pos.x &&
            mouseY < this.pos.y + this.size.y &&
            mouseY > this.pos.y
        ) {
            if (mouseIsPressed && !this.isDuplicated)
            {
                this.isDuplicated = true;
                Active.push(new Block(dots[Active.length].pos.x * 2, dots[Active.length].pos.y, this.size.x, this.size.y, this.element))
            }
            else if(!mouseIsPressed)
            {
                this.isDuplicated = false;
            }
        }
    }

    async merge(other) {
        if (this.isMerged || other.isMerged) return;
        if (merging) return;
        let isOverlapping = (
            this.pos.x < other.pos.x + other.size.x &&
            this.pos.x + this.size.x > other.pos.x &&
            this.pos.y < other.pos.y + other.size.y &&
            this.pos.y + this.size.y > other.pos.y
        );

        if (isOverlapping) {
            this.strokeWeight = 2;
            console.log("Blocks are overlapping");

            if (!mouseIsPressed) {
                // Call the AI to get a new element name
                const newElement = await getMergedElement(this.element, other.element);
                merging = true;
                console.log(newElement);

                if (newElement) { // Ensure newElement is valid
                    // Create a new merged block
                    let newX = min(this.pos.x, other.pos.x);
                    let newY = min(this.pos.y, other.pos.y);
                    let newWidth = max(this.size.x, other.size.x);
                    let newHeight = max(this.size.y, other.size.y);

                    Active.push(new Block(newX, newY, newWidth, newHeight, newElement));

                    this.destroy();
                    other.destroy();
                    this.isMerged = true;
                    other.isMerged = true;
                    console.log("Both blocks removed");
                }
            }
        } else {
            this.strokeWeight = 0;
        }
    }

    destroy() {
        let index = Active.indexOf(this);
        if (index > -1) {
            Active.splice(index, 1);
        }
    }
}

async function getMergedElement(element1, element2) {
    let userMessage = `What do you get when you merge a ${element1} and a ${element2}?`;
    let chatResponse = 'Loading...'; // Show loading message

    // Send POST request to OpenAI API
    try {
        console.log('Sending request to OpenAI with message:', userMessage); // Log the message

        // Make sure to include the correct headers and data format
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer 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` // Replace with your actual API key
            },
            body: JSON.stringify({
                model: "text-davinci-003", // Specify the model you want to use
                prompt: userMessage,
                max_tokens: 50 // Adjust the max tokens as needed
            })
        });

        if (!response.ok) {
            console.error('Response status:', response.status); // Log the status
            throw new Error('Network response was not ok');
        }

        let data = await response.json();
        return data.choices[0].text.trim(); // Get the response text

    } catch (error) {
        console.error('Error:', error);
        return 'Error getting merged element'; // Handle error
    }
}