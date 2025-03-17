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

        // Ensure options container is visible
        optionsContainer.style.display = "block";
        
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }

        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement("button");
                button.innerText = option.text;
                button.classList.add("btn");
                button.style.display = "inline-block"; // Ensure visible
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
        console.log("Video function triggered!");

        // Create full-screen video container
        const videoContainer = document.createElement("div");
        videoContainer.style.position = "fixed";
        videoContainer.style.top = "0";
        videoContainer.style.left = "0";
        videoContainer.style.width = "100vw";
        videoContainer.style.height = "100vh";
        videoContainer.style.zIndex = "9999";
        videoContainer.style.backgroundColor = "black";

        // Create video element
        const video = document.createElement("video");
        video.src = "Videowebsite.mp4"; // Ensure this file exists and is accessible
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.autoplay = true;
        video.controls = false;
        video.setAttribute("playsinline", "");
        
        // Append video to container
        videoContainer.appendChild(video);
        document.body.appendChild(videoContainer);

        // Ensure video plays after user interaction
        video.play().catch(error => {
            console.error("Autoplay blocked! Requiring user interaction.");
            alert("Click anywhere to play the video.");
            document.body.addEventListener("click", () => {
                video.play();
            }, { once: true });
        });

        // Remove video and continue to next ID when finished
        video.onended = function () {
            document.body.removeChild(videoContainer);
            console.log("Video ended. Moving to ID 12.");
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
        { id: 7, text: "A shadowy figure appears...", options: [{ text: "Accept the paradox", nextText: 11 }, { text: "Refuse", nextText: 2 }] },
        { id: 12, text: "Was that really worth it?", options: [{ text: "Yes", nextText: 13 }, { text: "No", nextText: 14 }] },
        { id: 13, text: "You have embraced the truth.", options: [{ text: "Continue to Books Page", nextText: "books.html" }] },
        { id: 14, text: "You made the wrong choice.", options: [{ text: "Back to start", nextText: 1 }] }
    ];

    document.getElementById("fun-button").addEventListener("click", function() { 
        startGame(); 
    });
});
