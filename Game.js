document.addEventListener("DOMContentLoaded", function () {
    console.log("Game script loaded!");

    const gameContainer = document.getElementById("game-container");
    const textElement = document.getElementById("text");
    const optionsContainer = document.getElementById("options-container");
    const funButton = document.getElementById("fun-button");

    if (!gameContainer || !textElement || !optionsContainer || !funButton) {
        console.error("One or more necessary elements are missing from the DOM.");
        return;
    }

    console.log("All necessary elements found!");

    let state = {};
    let backgroundMusic = new Audio("websitemusic.mp3");
    backgroundMusic.loop = true;

    function startGame() {
        console.log("Game started!");
        state = {};
        showTextNode(1);

        try {
            backgroundMusic.play().catch(error => {
                console.error("Autoplay prevented:", error);
            });
        } catch (error) {
            console.error("Audio playback error:", error);
        }
    }

    function showTextNode(nodeIndex) {
        console.log(`Displaying text node ${nodeIndex}`);

        if (typeof textNodes === "undefined" || !Array.isArray(textNodes)) {
            console.error("Error: textNodes is not defined or is not an array.");
            return;
        }

        const textNode = textNodes.find(node => node.id === nodeIndex);
        if (!textNode) {
            console.error(`Text node with ID ${nodeIndex} not found.`);
            return;
        }

        textElement.innerHTML = `<span style="font-size: 24px; color: white;">${textNode.text}</span>`;
        optionsContainer.innerHTML = "";

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
        return option.requiredState == null || option.requiredState(state);
    }

    function selectOption(option) {
        console.log(`Option selected: ${option.text}`);

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
                playScaryScream();
                return;
            case 11:
                playVideoAndRedirect();
                return;
        }

        if (option.setState && typeof option.setState === "object") {
            state = { ...state, ...option.setState };
        }
        showTextNode(option.nextText);
    }

    if (funButton) {
        funButton.disabled = false;
        funButton.addEventListener("click", function () {
            console.log("Fun button clicked!");
            startGame();
        });
    } else {
        console.warn("fun-button not found on the page.");
    }

    function playVideoAndRedirect() {
        let videoElement = document.createElement("video");
        videoElement.src = "Videowebsite.mp4";
        videoElement.autoplay = true;
        videoElement.controls = false;
        videoElement.style.position = "fixed";
        videoElement.style.top = "0";
        videoElement.style.left = "0";
        videoElement.style.width = "100vw";
        videoElement.style.height = "100vh";
        videoElement.style.zIndex = "9999";
        document.body.appendChild(videoElement);

        videoElement.onended = function () {
            document.body.removeChild(videoElement);
            window.location.href = "index.html"; // Redirect to the first question
        };
    }

    function triggerJumpScare() {
        let jumpScareImage = document.createElement("img");
        jumpScareImage.src = "jumpscare.png";
        jumpScareImage.style.position = "fixed";
        jumpScareImage.style.top = "0";
        jumpScareImage.style.left = "0";
        jumpScareImage.style.width = "100vw";
        jumpScareImage.style.height = "100vh";
        jumpScareImage.style.zIndex = "9999";
        document.body.appendChild(jumpScareImage);

        setTimeout(() => {
            document.body.removeChild(jumpScareImage);
            showTextNode(1);
        }, 2000);
    }

    function playScaryScream() {
        let scream = new Audio("Scream.mp3");
        scream.play();
        setTimeout(() => {
            showTextNode(1);
        }, 2000);
    }

    const textNodes = [
        {
            id: 1,
            text: "If you met another version of yourself from a parallel timeline, would you shake hands… or eliminate the anomaly?",
            options: [
                { text: "I would shake hands", nextText: 2 },
                { text: "I would eliminate the anomaly", nextText: 11 }
            ]
        },
        {
            id: 2,
            text: "What if your entire life was just a loop—how would you know if this wasn’t your first time reading this?",
            options: [
                { text: "This question is dumb as fuck", nextText: -1 },
                { text: "I don’t know because I am just an ant in this galaxy", nextText: 3 }
            ]
        },
        {
            id: 3,
            text: "If you could erase one event in history, would you risk the consequences of the paradox?",
            options: [
                { text: "Hell Yes", nextText: -1 },
                { text: "Hell No", nextText: 4 }
            ]
        },
        {
            id: 4,
            text: "If your childhood home was haunted, would you rather move… or stay and find out why it’s haunted?",
            options: [
                { text: "I'd rather move", nextText: 7 },
                { text: "I’ll stay", nextText: 7 }
            ]
        },
        {
            id: 5,
            text: "Imagine the worst nightmare you’ve ever had. Are you sure it wasn’t real?",
            options: [
                { text: "Yes, I'm sure", nextText: 11 },
                { text: "No, I'm not sure", nextText: -1 }
            ]
        }
    ];
});
