# Radoslaw Czyzewski - Saily task PROCESS

## My background working with AI tools

I am an developer with 3+ years of experience with creating frontend for web applications.
Since the begining of my joruney the AI was the part of workflow, some of my first projects were already created with a ChatGPT help.
Today, when I'm working on a production projects in my current company I use AI tools on daily basis.
The main tool is Kiro - AI Agent from AWS.
❌
✅
📌


## Creating Waypoint - Travel Connectivity Assistant

### 🤔 Idea

First things first - every app starts with an idea. 
After reading the README.md I've started to think about an app which I would use myself during a trip preparation.
When we are talking about connectivity my biggest problems were always:

- should I buy just one plan for me and friend(s)?
- how much data am I going to use anyway?
- what if I want to visit multiple countries?

Waypoint is an answer to all those questions. I've decided to create assistant that will help me calculate my data usage based on my habits and travel plans.
Ok, but did I use any AI on this step? 🫣

Of course!

I've used ChatGPT to talk about how I want my app to work and feel.

> I want to create an eSIM assistant app which will help user find the best plan for their trip plans and data usage habits. I want the user to feel like we guide it through the process, to feel safe. Can you give me some tips how to achieve that "feel" in my app?

> Can you create a list of 10 potential names for my app?

Including such prompts I was able to create a vision of app in my head, how I exactly want it to look, what the user should see, and what to avoid.
AI suggested creating not just a calculator for data usage, but to create a "journey" through the process.
I'e decided that app will recommend the eSIM plan based on:

- traveler type: causal/explorer/adventurer
- visited countries
- travel dates
- number of devices
- internet activity brakdown

✅ Very helpful during brainstorming. It can prepare options for app name, copy for the website or even how UI should look.
📌 I think it works the best if we ask for a small, limited set of proposals, like up to 10. The more we ask for, the bigger chance that the options will be too similar to each other.

### 💻 Project setup

I've decided to use Cursor for the recruitment task, because I've already had the subscription and worked with it.
My approach was to create some kind of "spec driven development". Although it's not a big repo and I don't ave any style-quidelines files or etc. creating a plan file could help me implementing the app.

I've passed the initial prompt:

> I want to build a small fullstack travel web application focused on personalized eSIM recommendations for travelers. Please help decide what stack to use in my project. For frontend I want to use React, but I also want to implement simple backend which I've never did before.

I sticked to the proposal of using React + Vite and Express.js.

After that, I switched from "Agent" to "Plan" mode and from "Auto" to Opus 4.7 model in Cursor. With those settings I passed a large prompt, with the implementations details like tech stack, UI flow, recommendation logic etc.

> Please help me create a detailed implementation plan, architecture proposal, folder structure, domain logic breakdown, API design, and UI flow for this project. Tech Stack: Frontend: React, TypeScript, TailwindCSS, shadcn/ui Backend: Express.js, Simple REST API, No authentication required, No payments, Backend should stay intentionally lightweight (...) If you are not sure how to implement something then ask me.

📌 "If you are not sure about implementation decision, please ask me" - is a life saver phrase. From my experience this forces the AI to always ask at least one question.
Thanks to this, Cursor asked me multiple questions like how I want to handle the form, what I want to implement first: backend or frontend, what my data set will look like.

The result of this step is plan.md file insisde cursos\plans directory.
AI created whore plan with tables, graphs, code examples and even a to-dos list which I should follow during the process.

After reviewing it I've decided to go on with this plan, but not in "Plan" mode anymore. I switched to "Agent" to have more control over it. Of course Cursor informs us about each step, what went wrong, what he had to change but from my experience when I use the "Build" button in "Plan" mode for bigger tasks it's harder to follow that going through the to-dos list separately.

At this point I had a whole plan for implementation... let's build then!

> Based on our plan.md and created to-dos list I want you to do the first step - Scaffold monorepo.

❌ When I asked for running so many commands Cursor was pretty slow. I've splitted the scaffolding monorepo to smaller steps: init frontend, init backend.

After that I was able to run frontend and backend locally. I asked also for shadcn init from the copied command:

> Please init Shadecn (BaseUI setup) with this command "npx shadcn@latest init --preset b1YnRGLQG --template nex"

✅ Cursor immediately found that I try to init shadcn for next instead of vite, and proposed the change inside command.

### 🧾 Datasets

During this project it was important to me how I can prepare the datasets and backend for a simple app. I wanted to understand the decisions not to just follow them.
Firt  wanted to create simple json files for data but Cursor suggested ts files. So i asked:

> What is the advantage of using .ts files instead of jsons in the context of my app?

✅ Got the full response. In my case, since I didn't had much occasions to prepare datasets, and I work with TS in a small app where each country/region has multiple offers it's easier for me to handle data thanks to type checking.

understandable 🫡

Next step was getting data for countries and eSIM plans. I did that again separately. Getting the countries (name, code, region) went pretty well, I've picked data based on TOP 10 most popular countries on the Saily website.

📌 From my observations splitting the logic into chunks and starting a NEW chat with Agent helps a lot. It works faster, with a smaller context it's less likely that model will start to hallucinate.

Things were a bit harder for eSIM data.

First, I asked for data only for Poland. I provided a link with offer, and then... the waiting began ☠️

> Now I want you to create an esim-plans.ts file, but for now I only need data for Poland (PL). Go to https://saily.com/pl/esim-poland/ and prepare the options for Poland based on the website content. There should be 11 offers, because we have 5 basic plans and one unlimited plan, but we can choose different durations.

I used the prompt from above in Cursor, but also inside ChatGPT (free version). The chat was much faster, BUT it wasn't able to handle the unlimited plans. After a few minutes Cursor created a file, and the Poland offer was exactly the same as one on the website (with all unltimited plans).

After getting for Poland, I asked for the remaining ones and dataset for regions and global:

> I've provided you list of sites on Saily with packages for each country. Please get the data from there, like you did it for Poland and add them to esim-plans.ts

A few more minutes later the dataset for eSIM was prepared but with some bugs. I had to fix the unltimited offer for UK, Switzerland, Japan, China and Korea.

❌ If the agent has to fetch the data on its own, it can take a while to get the results. Sometimes it's faster to just copy data or content directly from websites and only ask for formatting.

### 🧠 Implemeting Backend



