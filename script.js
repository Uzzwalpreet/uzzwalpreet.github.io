// ------------------ SELECT OUTPUT WINDOW ------------------

const output = document.getElementById("output");

let history = [];
let historyIndex = 0;
let cwd = "files";


// ------------------ PRINT FUNCTION ------------------

function print(text) {
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

    // -------------------------------------------------------------
    // ❌ REMOVED: output.innerHTML += `<span class="prompt">uzzwal@dev:~$</span> `;
    // -------------------------------------------------------------

    const div = document.createElement("div");
    div.className = "input-line";

    // MODIFICATION: The prompt is now part of the input-line div
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

            // This correctly removes the entire line (Prompt + Input)
            div.remove(); 

            // This prints the command line once, permanently
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

// ------------------ COMMAND HANDLER ------------------

async function handleCommand(cmd) {
    if (!cmd) return;

    const parts = cmd.split(" ");
    const base = parts[0];

    if (base === "ls") {
        print("about-me.txt   skills.md   experience.md   projects.md   contact.txt   resume.pdf");
    }

    else if (base === "cat") {
        let file = parts[1];
        await loadFile(file);
    }

    else if (base === "clear") {
        output.innerHTML = "";
    }

    else if (base === "help") {
        print("Commands:\nls\ncat <file>\nshow skills\nclear\nhelp\nsudo");
    }

    else if (base === "sudo") {
        print("Entering admin mode...\n");
        print("Welcome Commander.\n");

        output.innerHTML += `
            <img src="assets/profile.jpg" 
                 style="width:200px;border-radius:10px;margin-top:15px">
        `;
        scrollToBottom();
    }

    else if (base === "show" && parts[1] === "skills") {
        showSkillsUI();
    }

    else {
        print(`Command not found: ${cmd}`);
    }
}


// ------------------ LOAD FILES FROM /files FOLDER ------------------

async function loadFile(file) {
    try {
        let text = await fetch(`${cwd}/${file}`).then(r => r.text());
        print(text);
    } catch {
        print(`No such file: ${file}`);
    }
}


// ------------------ NAV BUTTON TRIGGERS ------------------

// ------------------ NAV BUTTON TRIGGERS (FINAL FIX) ------------------

async function runPreset(filename) {
    
    // 1. Find the currently active input line (the one with the cursor).
    // It should be the last child of the output element.
    const activeInputLine = output.lastChild;
    
    // 2. CRITICAL FIX: Remove the active input line before printing the command.
    if (activeInputLine && activeInputLine.className === "input-line") {
        activeInputLine.remove();
    }
    
    // 3. Print the executed command line in its place.
    print(`uzzwal@dev:~$ cat ${filename}`);
    
    // 4. Wait for file content to load.
    await loadFile(filename); 

    // 5. Create the next input prompt line.
    createNewPrompt(); 
}

async function runShowSkills() {

    // 1. Find the currently active input line (the one with the cursor).
    // It should be the last child of the output element.
    const activeInputLine = output.lastChild;
    
    // 2. CRITICAL FIX: Remove the active input line before printing the command.
    if (activeInputLine && activeInputLine.className === "input-line") {
        activeInputLine.remove();
    }
    
    // 1. Print the executed command line
    print(`uzzwal@dev:~$ show skills`);
    
    // 2. Execute the command (displays the skills UI)
    await showSkillsUI();

    // 3. CRITICAL FIX: Create the next input prompt line
    createNewPrompt();
}


// ------------------ SKILLS UI ------------------

function showSkillsUI() {
    print("Loading skill modules...\n");
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
    }, 600);
})
}


// ------------------ START TERMINAL ------------------

createNewPrompt();
