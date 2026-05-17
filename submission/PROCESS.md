# Radoslaw Czyzewski - Saily task PROCESS

## Summary



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
My approach was to create some kind of "spec driven development" - I know that it might not be "real" spec driven. Although it's not a big repo and I don't ave any style-quidelines files or etc. creating a plan file helped me creating the app.

I've passed the initial prompt:

> I want to build a small fullstack travel web application focused on personalized eSIM recommendations for travelers. Please help decide what stack to use in my project. For frontend I want to use React, but I also want to implement simple backend which I've never did before.

I sticked to the proposal of using React + Vite and Express.js.

After that, I switched from "Agent" to "Plan" mode and from "Auto" to Opus 4.7 model in Cursor. With those settings I passed a large prompt, with the implementations details like tech stack, UI flow, recommendation logic etc.

> Please help me create a detailed implementation plan, architecture proposal, folder structure, domain logic breakdown, API design, and UI flow for this project. Tech Stack: Frontend: React, TypeScript, TailwindCSS, shadcn/ui Backend: Express.js, Simple REST API, No authentication required, No payments, Backend should stay intentionally lightweight (...) If you are not sure how to implement something then ask me.

📌 "If you are not sure about implementation decision, please ask me" - is a life saver phrase. From my experience this forces the AI to always ask at least one question.
Thanks to this, Cursor asked me multiple questions like how I want to handle the form, what I want to implement first: backend or frontend, what my data set will look like.

The result of this step is plan.md file insisde cursos\plans directory.
AI created whole plan with tables, graphs, code examples and even a to-dos list which I should follow during the process.

After reviewing it I've decided to go on with this plan, but not in "Plan" mode anymore. I switched to "Agent" to have more control over it. Of course Cursor informs us about each step, what went wrong, what he had to change but from my experience when I use the "Build" button in "Plan" mode for bigger tasks it's harder to follow that going through the to-dos list separately.

At this point I had a whole plan for implementation... let's build then!

> Based on our plan.md and created to-dos list I want you to do the first step - Scaffold monorepo.

❌ When I asked for running so many commands Cursor was pretty slow. I've splitted the scaffolding monorepo to smaller steps: init frontend, init backend.

After that I was able to run frontend and backend locally. I asked also for shadcn init from the copied command:

> Please init Shadecn (BaseUI setup) with this command "npx shadcn@latest init --preset b1YnRGLQG --template nex"

✅ Cursor immediately found that I try to init shadcn for next instead of vite, and proposed the change inside command.

### 🧾 Datasets

During this project it was important to me how I can prepare the datasets and backend for a simple app. I wanted to understand the decisions not to just follow them.
Firt  wanted to create simple json files for data but Cursor suggested ts files. So I asked:

> What is the advantage of using .ts files instead of jsons in the context of my app?

✅ Got the full response. In my case, since I didn't had much occasions to prepare datasets, and I work with TS in a small app where each country/region has multiple offers it's easier for me to handle data thanks to type checking.

understandable 🫡

Next step was getting data for countries and eSIM plans. I did that again separately. Getting the countries (name, code, region) went pretty well, I've picked data based on TOP 10 most popular countries on the Saily website.

📌 From my observations splitting the logic into chunks (smaller plans) and starting a NEW chat with Agent helps a lot. It works faster, with a smaller context it's less likely that model will start to hallucinate.

Things were a bit harder for eSIM data.

First, I asked for data only for Poland. I provided a link with offer, and then... the waiting began ☠️

> Now i want you to create esim-plans.ts but for now I only want data for the PL - Poland. Go to the https://saily.com/pl/esim-poland/ and prepare the options for poland based onthe website content conent. There should be 11 offers, because we have 5 basic and one umltimied but we can chose the number of days for it. If you are not sure how to implement this, ask me

I used the prompt from above in Cursor, but also inside ChatGPT (free version). The chat was much faster, BUT it wasn't able to handle the unlimited plans. After a few minutes Cursor created a file, and the Poland offer was exactly the same as one on the website (with all unltimited plans).

After getting for Poland, I asked for the remaining ones and dataset for regions and global:

> I've provided you list of sites on Saily which shows the packages for the remaining countries. Please get the data from there, like you did it for Poland and add them do esim-plans.ts

A few more minutes later the dataset for eSIM was prepared but with some bugs. I had to fix the unltimited offer for UK, Switzerland, Japan, China and Korea.

✅ Model suggested the change to use tables instead of separate object for each eSIM variant
❌ If the agent has to fetch the data on its own, it can take a while to get the results. Sometimes it's faster to just copy data or content directly from websites and only ask for formatting.

### 🧠 Implemeting Backend

"Spec driven development" when building the backend really helped me. The spec from plan.md was a good reference point and guide how to imlement things.

✅ AI models are great at explaining how code works. We can even adjust the style of the anwser or how deeply we want to dive into a topic.

> What are zod schemas and for what we need them for? Give me a short, simple anwser

> What does this mean for example? countries: z.array(z.string().length(2)).min(1).max(10)

Thanks to asking questions throughout the whole process, I was able to better understand the backend logic. I asked for a simple step-by-step list on how to implement third step from todo list. I prompted it to implement list points in order, asking after each one if we could proceed.

The biggest challenge on the backend side of project was to create the UsageCalucaltorService and RecommendationService - todo plan assumes that we will create two separate services.
At first I thought that's a great idea. I switched the model to Sonnet 4.6 and asked for creating the each service separately. As usuall asked to explain the code for me after that, but on Auto plan.

📌 Switching model depending on task complexity can save tokens, Auto is great for simple tasks or questions.

> Ok I need you to tell step by step why we implement each method, type, function etc. inside usage-caluclator and recommendation. Start with explaining usage-calculator, after each step ask me if we can proceed into another explanation

While explaining, I found out that the usage calculator will not work as I initially intended. I decided to make some changes:

- intsead of caluclating GB usage for each person, I wanted to use sharing-factor multiplier
- fixed the Data Usage Model beacuse at first I didn't realized it was using values not from the Saily usage calucaltor (as I had asked) but from blog
- removed safet buffor, decided it will be a part of traveler type

I wanted to help it understand which data I will show to user, and for what i nead each change. So I used this prompt:

> In the UI i want to show a diagam which will show: summed up usage, and breakdown per: socials, work, nav, streaming, surfing and somehow inform about safety buffor (which depens on archetype) and sharing factor

... and somehow it was a killer for it 😅

❌ Even though model in its code changes removed safety buffer and understand that now safety factor is inisde traveler type, it decided that we need a new buffer. That's one of the examples how to much context in chat might complicate things. I had to revert the changes and start a new chat.

After reviewing the changes again in both files I realized that we don't really need two separate services. The code for calulacting the GB usage was duplicated in both services. 

> What would you recommend in my situation? I want to make it more optimal, right now it looks like we could write one service that will handle whole recommendation and gb usage calculation

AI suggested creating new service, merge two existing into one. I also asked to simplify the backend logic to always reutrn only one recommendation. With help of Cursor I managed to simplify reccomendtion logic.

I've never created a backend flow before. As I mentioned important aspect of working with AI agent on backend for me is creating lists, tabels, graphss that show how the logic in my app works.

Prompts like the ones below, help me understand what I've created with AI.

> In short words and in a form of a single graph can you show me how recommendation service works>

> How works whole BE flow of my app? Step by step, for what we need dto, middleware, servies, types etc. Use simple words, anwser in a form of table: left - step, right - descripiton

### 🎨 Frontend and UI

At this point I've decided to create a frontend and UI without spec. Because it's my main field of interests and specialization, I wanted to just vibe code this part and see how this will work.

I have implemented frontend in order:

- App view
- Archetypes view
- Trip view
- Usage view
- Results view

On each step I used the similar set of prompts.

> I want you to implement the view for step 1 archetypes. The main content should be placed inside Card omponetn from ui directory...

> For selecting traveler type use RadioGroup from the shadcn documentation: https://ui.shadcn.com/docs/components/radix/radio-group. Each traveler radio button should have: on top travelers type name, under display description...

📌 For me, the key to flawless vibe coding the UI is to be very specific about what we want to add/change/remove, is it on desktop/mobile view, and doing only ONE 1️⃣ change at a time. 

❌ But sometimes even when I was being very specific about a change, for example:

> Inside CountrySelector on mobile view I want to make country ComboboxItem height to be 2x bigger

model decided to change also the height of ComboboxItem on desktop view to... smaller then it was. 

✅ Cursor is great at implementing components into your project if you provide a source code. Sometimes even the components name or URL for website where we found it are enough.

For activity usage breakdown I used shadcn pie chart. Because shadcn website gets pretty laggy when rendering whole charts library (at least on my machine 🫣) I had to found the chart on different website. I found the name of chart I wanted to use "Pie Chart - Donut with Text" and asked:

> Can you help me implement the Pie Chart - Donut with Text component from the shadcn charts library?

It worked almost perfectly - I only had to change the position of the text inside becaufe it wasn't centered.

✅ As I mentioned at the beggining AI is great at creating content. Every copy on my app is created with help of the agent.
You don't have to think exactly what you want to write. You can simply describe how you want the user to feel when reading it.

Prompt example:

> I want the header and description for the first step to feel like we are taking the user by the hand and starting a new adventure

After creating each view I asked for a refactor. I was changing the model to Sonnet 4.6 or GPT-5.5 and used the boiler prompt:

> I want you to go through the ..... file. Check if we can apply any refactor to the logic so the code follow best practices in React, styling, and to make this code look cleaner. For now create only list with suggestions. If you are not sure about implementation aske me.

Asking for refactors at the end of creating a view helped me avoid multiple small mistakes. But even with higher models, you should always review the changes. Sometimes modal don't find piece of code worth refactoring but your intuiotion tells you differenty. For example, inline handlers are not conisdered a bug, but (in my opinion) creating separate handlers can make code cleaner.









