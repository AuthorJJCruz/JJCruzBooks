document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const textElement = document.getElementById("text");
    const optionsContainer = document.getElementById("options-container");
    
    let state = {};

    function startGame() {
        state = {};
        showTextNode(1);
    }

    function showTextNode(nodeIndex) {
        const textNode = textNodes.find(node => node.id === nodeIndex);
        textElement.innerText = textNode.text;
        
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
        
        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement("button");
                button.innerText = option.text;
                button.classList.add("btn");
                button.addEventListener("click", () => selectOption(option));
                optionsContainer.appendChild(button);
            }
        });
    }

    function showOption(option) {
        return option.requiredState == null || option.requiredState(state);
    }

    function selectOption(option) {
        if (option.nextText === 7) {
            triggerJumpScare();
        } else if (option.nextText === 5) {
            playHelpMeScream();
        }
        const nextTextNodeId = option.nextText;
        if (option.setState) {
            state = { ...state, ...option.setState };
        }
        showTextNode(nextTextNodeId);
    }

    function triggerJumpScare() {
        const jumpScareImage = document.createElement("img");
        jumpScareImage.src = "scary-image.jpg";
        jumpScareImage.style.position = "fixed";
        jumpScareImage.style.top = "0";
        jumpScareImage.style.left = "0";
        jumpScareImage.style.width = "100vw";
        jumpScareImage.style.height = "100vh";
        jumpScareImage.style.zIndex = "9999";
        document.body.appendChild(jumpScareImage);

        const screamAudio = new Audio("scream.mp3");
        screamAudio.play();

        setTimeout(() => {
            document.body.removeChild(jumpScareImage);
        }, 2000);
    }

    function playHelpMeScream() {
        console.log("HELP ME! scream function triggered"); // Debugging
        const helpMeAudio = new Audio("helpme.mp3");

        helpMeAudio.play()
            .then(() => console.log("Audio played successfully"))
            .catch(error => console.error("Audio playback error:", error));
    }

    const textNodes = [
        {
            id: 1,
            text: "You wake up in a dimly lit room. You don't remember how you got here. A door stands in front of you, slightly ajar.",
            options: [
                { text: "Step through the door", nextText: "distorted" },
                { text: "Look around for clues", nextText: 3 }
            ]
        },
        {
            id: 2,
            text: "You step through the door, but suddenly find yourself back in the same room. Something feels... wrong.",
            options: [
                { text: "Try again", nextText: 4 },
                { text: "Scream for help", nextText: 5 }
            ]
        },
        {
            id: 3,
            text: "You find a mirror. As you look at your reflection, your face distorts. You hear a whisper: 'Remember.'",
            options: [
                { text: "Touch the mirror", nextText: 6 },
                { text: "Turn away", nextText: 2 }
            ]
        },
        {
            id: 4,
            text: "You keep stepping through, looping back. The walls seem closer now. A phrase is written in blood: 'THEY ARE WATCHING.'",
            options: [
                { text: "Look behind you", nextText: 7 },
                { text: "Ignore it", nextText: 2 }
            ]
        },
        {
            id: 5,
            text: "Your scream echoes, but something answers back in your own voice: 'Shhh. They’ll hear you.'",
            options: [
                { text: "Run", nextText: 2 },
                { text: "Ask who’s there", nextText: 8 }
            ]
        },
        {
            id: 6,
            text: "Your hand touches the mirror. A surge of memories flood your mind: experiments, time loops, Project Crucifix. The mirror cracks. You are not alone.",
            options: [
                { text: "Step through the broken mirror", nextText: 9 },
                { text: "Run away", nextText: 2 }
            ]
        },
        {
            id: 7,
            text: "You turn around. A shadowy figure stands in the corner. It has your face. It smiles. 'We meet again.'",
            options: [
                { text: "Accept the paradox", nextText: 10 },
                { text: "Refuse to believe it", nextText: 2 }
            ]
        },
        {
            id: 8,
            text: "A voice whispers: 'You already know.' Your past choices have been leading to this moment.",
            options: [
                { text: "Open the next door", nextText: 10 },
                { text: "Wake up", nextText: 1 }
            ]
        },
        {
            id: 9,
            text: "You step through and suddenly wake up... but in another version of yourself. The cycle continues.",
            options: [
                { text: "Restart", nextText: 1 }
            ]
        },
        {
            id: 10,
            text: "Reality distorts. You see flashes of different timelines. The experiment is complete. But was it yours, or theirs?",
            options: [
                { text: "Embrace the truth", nextText: 1 }
            ]
        }
    ];

    // Ensure this runs when the 'Fun Button' is clicked and the page loads
    document.getElementById("fun-button").addEventListener("click", function() {
        startGame();
    });
});
