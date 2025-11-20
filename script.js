// ------------------ SELECT OUTPUT WINDOW ------------------

const output = document.getElementById("output");

let history = [];
let historyIndex = 0;
let cwd = "files";


// ------------------ PRINT FUNCTION (Synchronous) ------------------

// ------------------ TYPING ANIMATION FUNCTION (CORRECTED) ------------------

async function type(text, delay = 50) { 
    const chars = text.split("");
    
    // Create a NEW <div class="typed-line"> element (or similar)
    // This will hold the text as it's being typed
    let lineDiv = document.createElement("div"); 
    output.appendChild(lineDiv);
    
    for (const char of chars) {
        // Pause for the specified delay time
        await new Promise(resolve => setTimeout(resolve, delay)); 

        // Append the character to the div's text content
        lineDiv.textContent += char;
        scrollToBottom();
    }
    
    // 🔥 FINAL FIX: Change the div to output the final text cleanly.
    // Since 'lineDiv' is a block element and already on the screen, 
    // we just need to ensure it's a permanent line of text.
    // We don't need to touch output.innerHTML again.
}

// ------------------ PRINT FUNCTION (MODIFIED) ------------------
// This function must now be used ONLY for non-animated, permanent output.
function print(text) {
    // Note: Since text already has \n, just printing the text to the output area
    output.innerHTML += text + "\n";
    scrollToBottom();
}


// ------------------ AUTO SCROLL ------------------

function scrollToBottom() {
    setTimeout(() => {
        output.scrollTop = output.scrollHeight;
    }, 0);
}


// ------------------ CREATE NEW PROMPT (FIXED) ------------------

function createNewPrompt() {

    const div = document.createElement("div");
    div.className = "input-line";

    // Prompt and input are together in the div
    div.innerHTML = `
        <span class="prompt">uzzwal@dev:~$</span> 
        <input class="cmd-input" autofocus autocomplete="off">
    `;

    output.appendChild(div);
    scrollToBottom();

    const newInput = div.querySelector("input");
    newInput.focus();

    newInput.addEventListener("keydown", async (e) => {

        if (e.key === "Enter") {
            let cmd = newInput.value.trim();

            history.push(cmd);
            historyIndex = history.length;

            // Remove the active input line
            div.remove(); 

            // Print the command line once, permanently
            print(`uzzwal@dev:~$ ${cmd}`);

            await handleCommand(cmd);

            // Create next prompt
            createNewPrompt();
        }
        
        // ArrowUp and ArrowDown logic remains the same
        if (e.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                newInput.value = history[historyIndex];
            }
        }

        if (e.key === "ArrowDown") {
            if (historyIndex < history.length) {
                historyIndex++;
                newInput.value = history[historyIndex] || "";
            }
        }
    });
}


// ------------------ COMMAND HANDLER (MODIFIED) ------------------

async function handleCommand(cmd) {
    if (!cmd) return;

    const parts = cmd.split(" ");
    const base = parts[0];

    let success = true;

    if (base === "ls") {
        await type("about-me.txt   skills.md   experience.md   projects.md   contact.txt   resume.pdf");
    }

    else if (base === "cat") {
        let file = parts[1];
        await loadFile(file); 
    }

    else if (base === "clear") {
        output.innerHTML = "";
        success = false; // Prevent blank line after clear
    }

    else if (base === "help") {
        await type("Commands:");
        await type("ls");
        await type("cat <file>");
        await type("show skills");
        await type("clear");
        await type("help");
        await type("sudo");
    }

    else if (base === "sudo") {
        await type("Entering admin mode...");
        await type("Welcome Commander.");

        output.innerHTML += `
            <img src="assets/profile.jpg" 
                 style="width:200px;border-radius:10px;margin-top:15px">
        `;
        scrollToBottom();
    }

    else if (base === "show" && parts[1] === "skills") {
        await showSkillsUI(); // Now await showSkillsUI
    }

    else {
        await type(`Command not found: ${cmd}`);
    }
    
    // Add a blank line after every command that isn't 'clear'
    if (success && base !== "clear") {
        print(""); 
    }
}


// ------------------ LOAD FILES FROM /files FOLDER (MODIFIED) ------------------

async function loadFile(file) {
    try {
        let text = await fetch(`${cwd}/${file}`).then(r => r.text());
        
        // Split by newline and type each line
        const lines = text.split('\n');
        for (const line of lines) {
            // Typing speed for file content (30ms)
            await type(line, 30); 
        }
        
    } catch {
        print(`No such file: ${file}`);
    }
}


// ------------------ NAV BUTTON TRIGGERS (MODIFIED) ------------------

async function runPreset(filename) {
    
    const activeInputLine = output.lastChild;
    if (activeInputLine && activeInputLine.className === "input-line") {
        activeInputLine.remove();
    }
    
    print(`uzzwal@dev:~$ cat ${filename}`);
    
    await loadFile(filename); 

    // Add blank line after button command output
    print("");
    
    createNewPrompt(); 
}

async function runShowSkills() {

    const activeInputLine = output.lastChild;
    if (activeInputLine && activeInputLine.className === "input-line") {
        activeInputLine.remove();
    }
    
    print(`uzzwal@dev:~$ show skills`);
    
    await showSkillsUI();

    // Add blank line after button command output
    print("");
    
    createNewPrompt();
}


// ------------------ SKILLS UI (CORRECTED & MODIFIED) ------------------

async function showSkillsUI() {
    // Typing speed for the loading message (60ms)
    await type("Loading skill modules...", 60); 

    return new Promise(resolve => {
        setTimeout(() => {
            output.innerHTML += `
            <div class="skill-container">

                <div class="skill-card">
                    <div class="skill-title green">Languages / Frameworks</div>
                    <ul>
                        <li>Java</li>
                        <li>Python</li>
                        <li>JavaScript</li>
                        <li>React.js</li>
                        <li>Spring Boot</li>
                        <li>C++</li>
                        <li>Flask</li>
                        <li>Node.js</li>
                    </ul>
                </div>

                <div class="skill-card">
                    <div class="skill-title blue">Tools / Platforms</div>
                    <ul>
                        <li>Docker</li>
                        <li>Kubernetes</li>
                        <li>GCP / AWS</li>
                        <li>Hadoop / Spark</li>
                        <li>Kafka</li>
                        <li>SQL</li>
                        <li>Git / CI-CD</li>
                    </ul>
                </div>

            </div>
            `;
            scrollToBottom();
            resolve();
        }, 600); // The HTML injection delay remains at 600ms
    });
}


// ------------------ START TERMINAL ------------------

createNewPrompt();