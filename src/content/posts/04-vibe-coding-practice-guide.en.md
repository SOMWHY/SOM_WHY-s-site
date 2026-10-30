---
title: "A Practical Guide to Vibe Coding: From Wishful Programming to Spec-Driven Development"
title_zh: Vibe Coding 实践指南：从「许愿式编程」到规格驱动开发
date: 2026-10-30
author: SOM_WHY
summary: What AI coding tools can actually do, and how the intent–spec–implementation loop turns vague wishes into reliable, spec-driven development.
summary_zh: 从「许愿式编程」到规格驱动开发：AI 开发工具到底能做什么，以及如何用「意图—规格—实现」的框架补齐个人能力、可靠地完成开发。
---

> A stage-by-stage summary of how I personally use AI to get work done: what AI development tools can actually do, and how to use AI to fill in your own skill gaps and reliably finish a build.

## What AI development can actually do

AI and Vibe Coding are already hot topics, yet many people still wonder: what do AI development tools have to do with me? This article isn't here to sell anxiety — using AI to work while having no idea how the tools operate is closer to "paying to go to work." If you want to give it a try, start with free platforms or low-cost models such as DeepSeek.

In practice, what AI can build falls into two categories.

### Category one: automation tools that solve repetitive work

First observe how much of your daily life is repetitive, then judge "which tasks can be automated by scripts," and hand those tasks to AI to turn into tools.

Take a small tool I built recently as an example. I like sharing paintings, photography, and videos I find online into chat groups. Sharing requires writing the file, the tweet, and its translation into the clipboard, then pasting with a single click. That used to take several mouse clicks; building a browser extension for such a simple feature wasn't worth the effort either. Now I just describe the requirement and wait a while, and it's done.

There are plenty of similar personal needs:

- A bookkeeping app customized to your own habits;
- Automatically categorizing and archiving email;
- Other highly personalized small tasks that generic software doesn't cover.

### Category two: AI workflows, delegating tasks to models on an ongoing basis

Another newly emerging use case is directly delegating work to AI (or large language models), for example:

- Quickly translating books;
- Quickly sorting and organizing local files;
- Organizing and maintaining a personal knowledge base.

The deciding criterion shifts from "which tasks can be automated by scripts" to "which tasks can be done by a large language model." This kind of usage is far from fully explored — people keep discovering surprising new uses — and as model capabilities evolve, the space left to build keeps widening. **Imagination thus becomes an especially important part of today's development tools** — discovering that a method you imagined actually works is one of the great pleasures of Vibe Coding.

### The essential difference between the two scenarios

There is no profound difference between the two scenarios; they differ mainly in when AI gets involved and in their cost structures:

| Dimension | Automation tool | AI workflow |
| --- | --- | --- |
| Deliverable | A piece of software in the traditional sense | A fixed workflow (skill / SKILL) |
| AI's role | Involved during development, exits after delivery | AI keeps working on every execution |
| Cost structure | Mostly development-time cost | Token cost on every run |
| Ongoing maintenance | Still needs AI assistance when extending or maintaining | Continuously adjusted as models and workflows evolve |

Once this distinction is clear, we can move on to the concrete development method.

## Viewing Vibe Coding through a software-engineering frame

Whether you're building an automation tool or settling on a workflow, Vibe Coding as a production practice is closer to traditional software engineering. Just as the basic unit of military action is the OODA loop (Observe, Orient, Decide, Act), software development follows this pattern:

**Intent – Specification – Implementation**

This is the most important framework for reviewing a development plan. Let's unpack it layer by layer.

## Intent–Implementation: the trap of wishful programming

Most people building tools for their own needs actually operate in "intent–implementation" mode: intent is what you want to achieve, and implementation is making it happen. Many people's first contact with Vibe Coding is exactly "wishful programming":

- "Make me a video of a fat fish eating plain rice"
- "Make me a Slay the Spire–style card game"
- "Prove the Jacobian conjecture for me, or find a counterexample"

Yet humans have long known that "wishing" can hide risks — the fact that stories about "evil wish machines" like the monkey's paw and the wishing willow have stayed popular proves exactly this. Early machine-learning training cases repeatedly revealed the same thing: **there is a gap between intent and implementation.**

Therefore, something must constrain what the wish machine and the large language model produce. That something is the specification.

## Spec: the core work of Vibe Coding

### The boundary of responsibility: "a human can go to jail"

Jiang Yanyan uses "a human can go to jail" to describe the role of the spec. The phrase isn't just a joke — it also points out the value humans still have in front of current AI: **humans need to — and are obligated to — take responsibility for the implemented result.**

Today's AI cannot read minds, and it won't gain mind-reading in the foreseeable future. On top of that, humans often don't know what they want themselves (client: "the first version was better after all"). Nor will the situation where one goal has many possible implementations disappear. So when it comes to pinning down the spec, humans will always have to take part.

### How it gets implemented: whatever you don't say, AI decides for you

AI won't maliciously distort your intent the way an evil wish machine would, but it will **quietly decide many things you never said**. Note: not saying something doesn't mean it's none of your business — this is exactly where Vibe Coding's responsibility lies.

Take "build a Slay the Spire–style card game" as an example. Give such an order directly, and AI will often decide everything for you: which engine? Pick any. What art style? Pixel art, I guess. How complete? One playable floor is about right... Each place seems to deviate from your idea only a little, yet the finished product ends up miles off.

Take "recognize text in images" as another example. Decisions that need to be pinned down include at least:

1. Use an OCR (optical character recognition) tool, or the model's vision capability?
2. If OCR, which specific tool?
3. If a vision model, which specific model?

If the user doesn't specify, AI picks any of these, and the consequences you may bear include: software that is hard to use and produces lots of recognition errors; software that lags and runs inefficiently; or a model that is slow and poor, and drains your token balance.

The good news is that human users don't need to master every detail of software development — testing, contracts, pipelines and the rest. Post-trained AI has already mastered these methods and will even proactively add a whole defensive suite: hash checks, baselines, smoke tests, backups, rollbacks. You can at least say "we don't need this much testing" and trim as needed, rather than having no idea which processes are needed.

### Extension and maintenance: why wishful programming is ultimately untenable

Extension and maintenance are an important part of traditional software development. Two examples make it clear:

- **Extension**: you build a school-wide student information system, and then the school enrolls a few international students without ID numbers. If you previously required every student to have a unique ID number, the system can only be rewritten from scratch.
- **Maintenance**: your tool depends on two upstream tools that got along fine, but after an update they start conflicting. Maintenance is the work of fixing it.

These two kinds of work won't disappear in the foreseeable future. Even if you don't want to extend your tool, it may still break with some future environment update. Therefore, wishful programming is ultimately untenable.

How to leave room for extension and maintenance in a project is a deep design philosophy that a short article can't cover. But Vibe Coders can have an answer in their own style: with the **grill-me** skill (SKILL), have AI repeatedly cross-check the project details with you — including questions about future extension and maintenance work. With it, you can complete much of the work of pinning down a spec without thinking through and writing large amounts of instructions yourself.

### Version control: the last insurance for long-term development

When you extend a tool over the long term, maintain a growing library of tools, or yourself turn into the client who says "I think the first version was better," version control becomes a must. It lets you:

- Create experimental branches when needed and test new features;
- Roll back to a clean version promptly when AI generates too much low-quality content;
- Restore project files when AI catastrophically deletes the entire project by mistake.

The basic tool for version control is Git. In the AI age there's an AI-age way to learn it: you can verbally ask AI to record every change with Git, so you don't need to memorize commands at all — you only need a rough idea of what Git can do. Pair it with any introductory tutorial or a little Git-learning game, and reaching the level of "oh, so this is version control" is enough. (There are also tools like Jujutsu that claim to suit the AI age better; I'm not familiar with them, so I won't elaborate.)

## A reusable combined workflow

There's also a skill well suited to brainstorming a project: **superpowers**. To some extent it's a lighter alternative to grill-me — it doesn't ask in as much detail and is better for brainstorming — and it also offers project-planning suggestions.

The two skills and Git can be combined into the following flow:

1. Provide a rough intent and let AI follow superpowers' instructions to recommend a project structure;
2. Use different Git branches to manage different pieces of content;
3. In each branch, use grill-me to pin down one by one what that branch should do;
4. During development, ask AI to commit every change to Git and roll back when necessary.

## Conclusion

The key to Vibe Coding isn't "wishing" — it's turning intent into a clear spec: pin down how it gets implemented, leave room for extension and maintenance, and back everything up with version control. Don't get impatient with AI's repeated questions — AI can't read minds, and the process of turning intent into a spec is indispensable. Start exploring with a light heart, and leave the rest to this loop.
