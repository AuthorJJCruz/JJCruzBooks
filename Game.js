document.addEventListener("DOMContentLoaded", function () {
    console.log("Game script loaded!"); // Debugging

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
                console.error("Autoplay prevented or audio file missing:", error);
            });
        } catch (error) {
            console.error("Background music error:", error);
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

        textElement.innerText = textNode.text;
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

    if (funButton) {
        funButton.disabled = false;
        funButton.addEventListener("click", function () {
            console.log("Fun button clicked!");
            startGame();
        });
    } else {
        console.warn("fun-button not found on the page.");
    }
});
