document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const textElement = document.getElementById("text");
    const optionsContainer = document.getElementById("options-container");
    
    let state = {};
    let backgroundMusic = new Audio("websitemusic.mp3");
    backgroundMusic.loop = true;

    function startGame() {
        state = {};
        showTextNode(1);
        backgroundMusic.play().catch(error => console.error("Autoplay prevented."));
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

    function selectOption(option) {
        if (option.nextText === -1) { window.location.href = "distorted.html"; return; }
        if (option.nextText === 7) { triggerJumpScare(); }
        else if (option.nextText === 5) { playHelpMeScream(); }
        else if (option.nextText === 11) { playVideoAndShowChoice(); return; }
        
        const nextTextNodeId = option.nextText;
        if (option.setState) { state = { ...state, ...option.setState }; }
        showTextNode(nextTextNodeId);
    }

    function playVideoAndShowChoice() {
        const videoContainer = document.createElement("div");
        videoContainer.style.position = "fixed";
        videoContainer.style.width = "100vw";
        videoContainer.style.height = "100vh";
        videoContainer.style.zIndex = "9999";
        videoContainer.style.backgroundColor = "black";
        const video = document.createElement("video");
        video.src = "Videowebsite.mp4";
        video.style.width = "100%";
        video.style.height = "100%";
        video.autoplay = true;
        videoContainer.appendChild(video);
        document.body.appendChild(videoContainer);
        video.onended = function () {
            document.body.removeChild(videoContainer);
            showTextNode(12);
        };
    }

    function triggerJumpScare() {
        const jumpScareImage = document.createElement("img");
        jumpScareImage.src = "scary-image.jpg";
        jumpScareImage.style.position = "fixed";
        jumpScareImage.style.width = "100vw";
        jumpScareImage.style.height = "100vh";
        jumpScareImage.style.zIndex = "9999";
        document.body.appendChild(jumpScareImage);
        const screamAudio = new Audio("scream.mp3");
        screamAudio.play();
        setTimeout(() => { document.body.removeChild(jumpScareImage); }, 2000);
    }

    function playHelpMeScream() {
        const helpMeAudio = new Audio("helpme.mp3");
        helpMeAudio.play().catch(error => console.error("Audio playback error:", error));
    }

    const textNodes = [
        { id: 1, text: "You wake up in a dimly lit room...", options: [{ text: "Step through the door", nextText: 2 }, { text: "Look around", nextText: 3 }] },
        { id: 2, text: "You step through but find yourself back...", options: [{ text: "Try again", nextText: 4 }, { text: "Scream for help", nextText: 5 }] },
        { id: 3, text: "You find a mirror. Your face distorts...", options: [{ text: "Touch the mirror", nextText: -1 }, { text: "Turn away", nextText: 2 }] },
        { id: 4, text: "The walls seem closer now...", options: [{ text: "Look behind you", nextText: 7 }, { text: "Ignore it", nextText: 2 }] },
        { id: 7, text: "A shadowy figure appears...", options: [{ text: "Accept the paradox", nextText: 11 }, { text: "Refuse", nextText: 2 }] },
        { id: 12, text: "Was that really worth it?", options: [{ text: "Yes", nextText: 13 }, { text: "No", nextText: 14 }] },
        { id: 13, text: "You have embraced the truth.", options: [{ text: "Continue to Books Page", nextText: "books.html" }, { text: "Turn back", nextText: 1 }] },
        { id: 14, text: "You made the wrong choice.", options: [{ text: "Back to start", nextText: 1 }, { text: "Run blindly", nextText: 15 }] },
        { id: 15, text: "A red door appears before you...", options: [{ text: "Enter", nextText: 16 }, { text: "Ignore", nextText: 4 }] },
        { id: 16, text: "Inside is a chair... and you sitting in it.", options: [{ text: "Approach", nextText: 17 }, { text: "Back away", nextText: 6 }] },
        { id: 17, text: "The walls start whispering your name...", options: [{ text: "Listen", nextText: 18 }, { text: "Run", nextText: 9 }] },
        { id: 18, text: "A note appears: 'Don't trust your choices.'", options: [{ text: "Read it", nextText: 19 }, { text: "Ignore it", nextText: 10 }] },
        { id: 19, text: "You wake up in a laboratory. A man watches you.", options: [{ text: "Speak to him", nextText: 20 }, { text: "Run", nextText: 1 }] },
        { id: 20, text: "'You've finally broken the cycle.'", options: [{ text: "Embrace reality", nextText: 1 }, { text: "Reject it", nextText: 15 }] }
    ];

    document.getElementById("fun-button").addEventListener("click", function() { startGame(); });
});
