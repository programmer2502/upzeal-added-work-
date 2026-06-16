document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("mentor-form");
    const input = document.getElementById("mentor-input");
    const sendButton = document.getElementById("mentor-send");
    const chat = document.getElementById("mentor-chat");
    const status = document.getElementById("mentor-status");
    const suggestionButtons = document.querySelectorAll(".mentor-suggestions button");

    if (!form || !input || !sendButton || !chat) return;

    const mentorMemory = {
        name: "Hruday",
        currentSkills: ["React", "Node.js", "JavaScript"],
        goal: "build a strong developer profile",
        history: []
    };

    const topicAnswers = [
        {
            match: ["react", "hook", "component", "jsx", "state", "props", "useeffect", "usestate"],
            answer: `React mentor view:

Start with the mental model: UI is a function of state. Components describe what should appear, hooks manage changing data, and props pass information down.

Small example:
const [count, setCount] = useState(0);

When count changes, React re-renders the component and updates only the needed DOM parts.

Practice next: build a small task tracker with add, complete, filter, and localStorage. That covers state, lists, events, and effects.`
        },
        {
            match: ["node", "express", "api", "backend", "server", "npm", "middleware"],
            answer: `Node.js mentor view:

Think of Node as JavaScript running outside the browser. For backend work, the important pieces are routing, middleware, async I/O, validation, and database access.

A strong starter project: build a REST API for coding challenges with login, challenge CRUD, submissions, and leaderboard scoring.

Practice next: create three endpoints, add request validation, and handle errors with one shared error middleware.`
        },
        {
            match: ["javascript", "js", "closure", "promise", "async", "event loop", "scope"],
            answer: `JavaScript mentor view:

Focus on the core engine topics: scope, closures, promises, async/await, array methods, objects, and the event loop.

Quick explanation: a closure is when a function remembers variables from the scope where it was created, even after that outer function has finished.

Practice next: write debounce, throttle, deepClone, and a promise-based retry function. These make interview answers much sharper.`
        },
        {
            match: ["dsa", "algorithm", "leetcode", "array", "linked list", "tree", "graph", "dp", "dynamic programming"],
            answer: `DSA mentor plan:

Do not solve random problems first. Follow patterns:
1. Arrays and strings
2. Two pointers and sliding window
3. Hash maps
4. Stack and queue
5. Binary search
6. Trees and graphs
7. Dynamic programming basics

For interviews, explain brute force first, then optimize. The interviewer wants your thinking, not just the final code.`
        },
        {
            match: ["interview", "placement", "resume", "prepare", "prep", "hr"],
            answer: `Interview prep mentor plan:

Use a 3-part routine each day:
1. One DSA pattern problem
2. One JavaScript or React concept
3. One project explanation out loud

For project questions, answer in this order: problem, users, architecture, tradeoffs, bugs you solved, and what you would improve next.

Practice next: prepare a 60-second explanation of your best project.`
        },
        {
            match: ["project", "portfolio", "github", "build", "idea", "profile"],
            answer: `Project mentor suggestion:

Build something that proves real engineering skill, not just UI. A great Upzeal-style project would be:

Developer Challenge Arena
- users can join coding challenges
- submit solutions
- get XP
- view leaderboard
- receive AI mentor feedback

Tech stack: React, Node.js, Supabase, and a small AI feedback layer. This connects directly to your profile story.`
        },
        {
            match: ["sql", "database", "db", "supabase", "postgres", "schema"],
            answer: `Database mentor view:

Start by modeling the nouns: users, skills, challenges, submissions, feedback, and XP events. Then define relationships between them.

For Supabase/Postgres, practice:
- primary keys and foreign keys
- indexes for frequently searched columns
- row level security
- simple joins

Practice next: design tables for challenges and submissions, then write a query that returns leaderboard rankings.`
        },
        {
            match: ["system design", "architecture", "scale", "scalable", "design"],
            answer: `System design mentor view:

Start with requirements before tools. For an AI mentor feature, the simple architecture is:

Frontend chat -> API route -> AI provider -> response formatter -> saved conversation history.

For the pitch, say the current demo proves the student workflow. The full version can add personalization from skills, submissions, and challenge history.`
        }
    ];

    const fallbackAnswers = [
        `Good question. I would break it into three steps: understand the concept, build a tiny example, then explain the tradeoff in your own words. Share a specific topic like React hooks, Node APIs, DSA, or interview prep and I can go deeper.`,
        `Here is the mentor approach: first identify what problem this solves, then learn the syntax, then practice it inside a small project. For your profile, always connect the concept to something you have built.`,
        `I can help with that. Try asking it as: "explain this concept", "give me a project idea", "prepare me for interview questions", or "review my learning plan".`
    ];

    const escapeHtml = (value) => value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    const addMessage = (message, sender, extraClass = "") => {
        const bubble = document.createElement("div");
        bubble.className = `mentor-msg ${sender} ${extraClass}`.trim();
        bubble.innerHTML = escapeHtml(message).replace(/\n/g, "<br>");
        chat.appendChild(bubble);
        chat.scrollTop = chat.scrollHeight;
        return bubble;
    };

    const getAnswer = (question) => {
        const normalized = question.toLowerCase();
        const matchedTopic = topicAnswers.find((topic) =>
            topic.match.some((keyword) => normalized.includes(keyword))
        );

        if (matchedTopic) return matchedTopic.answer;

        const index = Math.abs([...normalized].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % fallbackAnswers.length;
        return fallbackAnswers[index];
    };

    const askGroqMentor = async (question) => {
        const response = await fetch("/api/mentor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question,
                history: mentorMemory.history
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Groq mentor is unavailable");
        }

        const data = await response.json();
        return data.answer;
    };

    const setLoading = (isLoading) => {
        sendButton.disabled = isLoading;
        input.disabled = isLoading;
        if (status) status.textContent = isLoading ? "Thinking through your question..." : "Ready to help you learn";
    };

    const askMentor = async (question) => {
        const trimmed = question.trim();
        if (!trimmed) return;

        addMessage(trimmed, "user");
        input.value = "";
        setLoading(true);

        const thinkingBubble = addMessage("Thinking like a mentor...", "bot", "thinking");

        try {
            const answer = await askGroqMentor(trimmed);
            thinkingBubble.remove();
            addMessage(answer, "bot");
            mentorMemory.history.push({ role: "user", content: trimmed }, { role: "assistant", content: answer });
            setLoading(false);
            input.focus();
        } catch (error) {
            console.warn("AI Mentor is using local fallback:", error.message);
            window.setTimeout(() => {
                thinkingBubble.remove();
                const answer = getAnswer(trimmed);
                addMessage(answer, "bot");
                mentorMemory.history.push({ role: "user", content: trimmed }, { role: "assistant", content: answer });
                setLoading(false);
                if (status) status.textContent = error.message.includes("GROQ_API_KEY") ? "Using local demo: add GROQ_API_KEY and restart" : "Using local demo fallback";
                input.focus();
            }, 350);
        }
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        askMentor(input.value);
    });

    suggestionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            askMentor(button.dataset.prompt || button.textContent);
        });
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") input.blur();
    });
});
