document.addEventListener("DOMContentLoaded", function () {
    console.log("Game script loaded!"); // Debugging

    const gameContainer = document.getElementById("game-container");
    const textElement = document.getElementById("text");
    const optionsContainer = document.getElementById("options-container");
    const funButton = document.getElementById("fun-button");
    const searchLabel = document.querySelector("label.AppHeader-searchInput");
    const searchInput = document.querySelector("input.AppHeader-searchField");

    if (!gameContainer || !textElement || !optionsContainer || !funButton) {
        console.error("One or more necessary elements are missing from the DOM.");
        return;
    }

    if (searchLabel && searchInput) {
        searchLabel.setAttribute("for", searchInput.id || "dynamic-search-input");
        if (!searchInput.id) searchInput.id = "dynamic-search-input"; // Assign ID if missing
    } else {
        console.warn("Search label or input field not found.");
    }

    console.log("All necessary elements found!");

    let state = {};
    let backgroundMusic = new Audio("websitemusic.mp3");
    backgroundMusic.loop = true;

    function startGame() {
        console.log("Game started!");
        state = {};
        showTextNode(1);

        backgroundMusic.play().catch(error => {
            console.error("Autoplay prevented:", error);
        });
    }

    function showTextNode(nodeIndex) {
        console.log(`Displaying text node ${nodeIndex}`);

        const textNode = textNodes.find(node => node.id === nodeIndex);
        if (!textNode) {
            console.error(`Text node with ID ${nodeIndex} not found.`);
            return;
        }

        textElement.innerText = textNode.text;
        optionsContainer.innerHTML = ""; // Clear options

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
        console.log(`Option selected: ${option.text}, nextText: ${option.nextText}`);

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
                console.log("Executing playVideoAndShowChoice()...");
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
        video.muted = true; // Ensures autoplay works

        videoContainer.appendChild(video);
        document.body.appendChild(videoContainer);

        video.play().then(() => {
            video.muted = false; // Unmute after playback starts
        }).catch(error => {
            console.error("Autoplay blocked. Waiting for user click.");
            alert("Click anywhere to start the video.");
            document.body.addEventListener("click", () => {
                video.muted = false;
                video.play();
            }, { once: true });
        });

        video.onerror = function () {
            console.error("Video file failed to load. Check the file path.");
        };

        video.onended = function () {
            document.body.removeChild(videoContainer);
            showTextNode(12);
        };
    }

    if (funButton) {
        funButton.addEventListener("click", () => {
            console.log("Fun button clicked!");
            startGame();
        });
    } else {
        console.warn("fun-button not found on the page.");
    }
});
