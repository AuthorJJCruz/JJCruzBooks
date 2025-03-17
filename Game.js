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

        // **Ensure options are displayed**
        optionsContainer.style.display = "block";
        optionsContainer.innerHTML = ""; // Clear old buttons

        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement("button");
                button.innerText = option.text;
                button.classList.add("btn");
                button.style.display = "inline-block"; // **Ensure visibility**
                button.style.margin = "10px"; // Spacing for buttons
                button.addEventListener("click", () => selectOption(option));
                optionsContainer.appendChild(button);
            }
        });
    }

    function selectOption(option) {
        if (option.nextText === -1) { 
            window.location.href = "distorted.html"; 
            return; 
        }
        if (option.nextText === 7) { 
            triggerJumpScare(); 
            return; 
        }
        if (option.nextText === 5) { 
            playHelpMeScream(); 
            return; 
        }
        if (option.nextText === 11) { 
            playVideoAndShowChoice(); 
            return; 
        }

        const nextTextNodeId = option.nextText;
        if (option.setState) { 
            state = { ...state, ...option.setState }; 
        }
        showTextNode(nextTextNodeId);
    }

    function playVideoAndShowChoice() {
        console.log("Playing Video Full Screen!");

        // **Ensure video exists and loads**
        const videoContainer = document.createElement("div");
        videoContainer.style.position = "fixed";
        videoContainer.style.top = "0";
        videoContainer.style.left = "0";
        videoContainer.style.width = "100vw";
        videoContainer.style.height = "100vh";
        videoContainer.style.zIndex = "9999";
        videoContainer.style.backgroundColor = "black";

        const video = document.createElement("video");
        video.src = "Videowebsite.mp4";  // **Ensure this file is uploaded**
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.autoplay = true;
        video.controls = false;
        video.setAttribute("playsinline", ""); 

        videoContainer.appendChild(video);
        document.body.appendChild(videoContainer);

        // **Ensure autoplay works after user clicks once**
        video.play().catch(error => {
            console.error("Autoplay blocked. Waiting for user click.");
            alert("Click anywhere to start the video.");
            document.body.addEventListener("click", () => video.play(), { once: true });
        });

        // **Remove video and continue game**
        video.onended = function () {
            document.body.removeChild(videoContainer);
            showTextNode(12);
        };
    }

    function triggerJumpScare() {
        console.log("Jump Scare Triggered!");
        const jumpScareImage = document.createElement("img");
        jumpScareImage.src = "scary-image.jpg";
        jumpScareImage.style.position = "fixed";
        jumpScareImage.style.width = "100vw";
        jumpScareImage.style.height = "100vh";
        jumpScareImage.style.zIndex = "9999";
        document.body.appendChild(jumpScareImage);

        const screamAudio = new Audio("scream.mp3");
        screamAudio.play();

        setTimeout(() => { 
            document.body.removeChild(jumpScareImage);
            showTextNode(1); // Restart game
        }, 2000);
    }

    function playHelpMeScream() {
        console.log("HELP ME! scream triggered.");
        const helpMeAudio = new Audio("helpme.mp3");

        helpMeAudio.play().catch(error => console.error("Audio error:", error));
    }

    const textNodes = [
        { id: 1, text: "You wake up in a dimly lit room...", options: [{ text: "Step through the door", nextText: 2 }, { text: "Look around", nextText: 3 }] },
        { id: 2, text: "You step through but find yourself back...", options: [{ text: "Try again", nextText: 4 }, { text: "Scream for help", nextText: 5 }] },
        { id: 3, text: "You find a mirror. Your face distorts...", options: [{ text: "Touch the mirror", nextText: -1 }, { text: "Turn away", nextText: 2 }] },
        { id: 4, text: "The walls seem closer now...", options: [{ text: "Look behind you", nextText: 7 }, { text: "Ignore it", nextText: 2 }] },
        { id: 7, text: "A shadowy figure appears...", options: [{ text: "Accept the paradox", nextText: 11 }, { text: "Refuse", nextText: 2 }] },
        { id: 12, text: "Was that really worth it?", options: [{ text: "Yes", nextText: 13 }, { text: "No", nextText: 14 }] },
        { id: 13, text: "You have embraced the truth.", options: [{ text: "Continue to Books Page", nextText: "books.html" }] },
        { id: 14, text: "You made the wrong choice.", options: [{ text: "Back to start", nextText: 1 }] }
    ];

    document.getElementById("fun-button").addEventListener("click", function() { 
        startGame(); 
    });
});
