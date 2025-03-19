document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const textElement = document.getElementById("text");
    const optionsContainer = document.getElementById("options-container");
    const funButton = document.getElementById("fun-button");
    
    if (!gameContainer || !textElement || !optionsContainer || !funButton) {
        console.error("One or more necessary elements are missing from the DOM.");
        return;
    }

    let state = {};
    let backgroundMusic = new Audio("websitemusic.mp3");  
    backgroundMusic.loop = true;

    function startGame() {
        state = {};
        showTextNode(1);
        backgroundMusic.play().catch(error => console.error("Autoplay prevented.", error));
    }

    function showTextNode(nodeIndex) {
        const textNode = textNodes.find(node => node.id === nodeIndex);
        
        if (!textNode) {
            console.error(`Text node with ID ${nodeIndex} not found.`);
            return;
        }
        
        textElement.innerText = textNode.text;
        optionsContainer.innerHTML = ""; // Clear previous options

        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement("button");
                button.innerText = option.text;
                button.classList.add("btn");
                button.addEventListener("click", () => selectOption(option));
                optionsContainer.appendChild(button);
            }
        });
        
        optionsContainer.style.display = "block";
    }

    function showOption(option) {
        return !option.requiredState || option.requiredState(state);
    }

    function selectOption(option) {
        if (typeof option.nextText === "string") {
            window.location.href = option.nextText;
            return;
        }

        switch (option.nextText) {
            case -1:
                window.location.href = "distorted.html";
                return;
            case 7:
                triggerJumpScare();
                return;
            case 5:
                playHelpMeScream();
                return;
            case 11:
                playVideoAndShowChoice();
                return;
        }
        
        if (option.setState && typeof option.setState === "object") {
            state = { ...state, ...option.setState };
        }
        showTextNode(option.nextText);
    }

    function playVideoAndShowChoice() {
        console.log("Playing Video Full Screen!");

        const videoContainer = document.createElement("div");
        Object.assign(videoContainer.style, {
            position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh", zIndex: "9999", backgroundColor: "black"
        });

        const video = document.createElement("video");
        video.src = "Videowebsite.mp4";
        Object.assign(video.style, { width: "100%", height: "100%", objectFit: "cover" });
        video.autoplay = true;
        video.controls = false;
        video.muted = false;
        video.setAttribute("playsinline", "");

        videoContainer.appendChild(video);
        document.body.appendChild(videoContainer);

        video.play().catch(error => {
            console.error("Autoplay blocked. Waiting for user click.");
            alert("Click anywhere to start the video.");
            document.body.addEventListener("click", () => video.play(), { once: true });
        });

        video.onended = function () {
            document.body.removeChild(videoContainer);
            showTextNode(12);
        };
    }

    function triggerJumpScare() {
        const jumpScareImage = document.createElement("img");
        jumpScareImage.src = "scary-image.jpg";
        Object.assign(jumpScareImage.style, {
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100vw", height: "100vh", objectFit: "contain", zIndex: "9999"
        });

        document.body.appendChild(jumpScareImage);

        const screamAudio = new Audio("scream.mp3");
        screamAudio.play().catch(error => console.error("Audio playback error:", error));

        setTimeout(() => {
            document.body.removeChild(jumpScareImage);
            showTextNode(1);
        }, 2000);
    }

    function playHelpMeScream() {
        console.log("HELP ME! scream function triggered");
        const helpMeAudio = new Audio("helpme.mp3");
        
        helpMeAudio.play()
            .then(() => console.log("Audio played successfully"))
            .catch(error => console.error("Audio playback error:", error));

        helpMeAudio.onended = function () {
            showTextNode(8);
        };
    }

    const textNodes = [
        { id: 1, text: "You wake up in a dimly lit room...", options: [{ text: "Step through the door", nextText: 2 }, { text: "Look around", nextText: 3 }] },
        { id: 2, text: "You step through but find yourself back...", options: [{ text: "Try again", nextText: 4 }, { text: "Scream for help", nextText: 5 }] },
        { id: 3, text: "You find a mirror. Your face distorts...", options: [{ text: "Touch the mirror", nextText: -1 }, { text: "Turn away", nextText: 2 }] },
        { id: 4, text: "The walls seem closer now...", options: [{ text: "Look behind you", nextText: 7 }, { text: "Ignore it", nextText: 2 }] },
        { id: 7, text: "A shadowy figure appears...", options: [{ text: "Accept the paradox", nextText: 11 }, { text: "Refuse", nextText: 2 }] },
        { id: 8, text: "A voice whispers: 'You already know...'", options: [{ text: "Open the next door", nextText: 10 }, { text: "Wake up", nextText: 1 }] },
        { id: 10, text: "Reality distorts. You see flashes of timelines.", options: [{ text: "Embrace the truth", nextText: 1 }] }
    ];

    if (funButton) {
        funButton.addEventListener("click", startGame);
    } else {
        console.warn("fun-button not found on the page.");
    }
});
