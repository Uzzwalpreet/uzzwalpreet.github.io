const output = document.getElementById("output");
const input = document.getElementById("terminal-input");

let cwd = "files";
let history = [];
let historyIndex = 0;

input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        let cmd = input.value.trim();
        history.push(cmd);
        historyIndex = history.length;

        print(`uzzwal@dev:~$ ${cmd}`);
        input.value = "";

        await handleCommand(cmd);
    }

    if (e.key === "ArrowUp") {
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
    }

    if (e.key === "ArrowDown") {
        if (historyIndex < history.length) {
            historyIndex++;
            input.value = history[historyIndex] || "";
        }
    }
});

function print(text) {
    output.innerHTML += text + "\n";
    output.scrollTop = output.scrollHeight;
}

async function handleCommand(cmd) {
    const parts = cmd.split(" ");
    const base = parts[0];

    if (base === "ls") {
        print("about-me.txt   skills.md   experience.md   projects.md   contact.txt   resume.pdf");
    }

    else if (base === "cat") {
        let file = parts[1];
        loadFile(file);
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
        output.innerHTML += `<img src="assets/profile.jpg" style="width:200px;border-radius:10px;margin-top:15px">`;
    }

    else if (base === "show" && parts[1] === "skills") {
        showSkillsUI();
    }

    else {
        print(`Command not found: ${cmd}`);
    }
}

async function loadFile(file) {
    try {
        let text = await fetch(`${cwd}/${file}`).then(r => r.text());
        print(text);
    } catch {
        print(`No such file: ${file}`);
    }
}

function runPreset(filename) {
    print(`uzzwal@dev:~$ cat ${filename}`);
    loadFile(filename);
}

function runShowSkills() {
    print(`uzzwal@dev:~$ show skills`);
    showSkillsUI();
}

function showSkillsUI() {
    print("Loading skill modules...\n");

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
        output.scrollTop = output.scrollHeight;
    }, 600);
}
