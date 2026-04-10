# Project Plan

<!--
  This file is your team's shared brain.
  Fill it in together during brainstorming. Save it.

  - Claude Code reads this automatically. It will know what you're building.
  - Your marketing/pitch team uses this to build the pitch deck.
  - One file, everyone's on the same page.
-->

## Product

**Name:** VERITAS

**One sentence:** this product, helps people nail their interaction with a specific individual in a very short time, by web scraping their social media and other links to get tailored information about them.

**Problem:** help people nail their interaction with any person when they have a very short time to prepare for it

## Target Audience

**Who is this for?** this is for Master's and PhD students who are looking for academic supervisors.

**Why would they use it?** the alternative now is too look for supervisors one by one on Google Scholar and check thousands of their research papers to find ones that match their profile most, which is very time consuming. our product let you do all that search in one simple input, in a very short time.

## Pages & User Flow

<!-- List every page. Describe what the user sees and does on each. -->

1. `/login` and `/signup` — email + password authentication
2. `/` — when they login they are gonna see a basic LLM like screen (just like claude). where they can input the names of the people they are looking for. underneath this they will find three buttons to help their search which are three verticals: job interview, where you will get tailored information about the interviewer. cold call, where they will find tailored information about a potential client (their interest, projects..) to land a deal with them successfully. and lastly our main focus vertical. academics, where sudents will get tailored information about academic profiles/professors for when they are looking for matching prfiles and potential supervisors
3. the output of the search/prompt will give us tailored information about the person we searched about according to the vertical we have chosen
4. feature: in the academic vertical if a person has chosen research fields (like AI, software engineering..) in the drop down section next to the input field. this feature will help input a matching percentage with the people put in the search, to see which people match our search most, as potential supervisors

**User flow:**

1. User signs up or logs in
2. they prompt/search people's name and choose specific filters
3. they get tailored intformation they need about the seached people according to the selected filter/vertical

## Data Model

TODO: more tables are created as we progress in adding more features

<!-- What are you storing? Keep it to 1-2 tables for an MVP. -->

**Table: [name]**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| | | |
| | | |
| user_id | uuid | Owner of this row |
| created_at | timestamp | Auto-set |

## Scope Check

<!-- Can you build this in 2 hours? Answer honestly. -->

- [yes] We have 3 pages or fewer
- [yes] We have 1-2 database tables
- [yes] We can explain the core feature in one sentence
- [yes] We've cut everything that isn't essential for the demo

## Pitch Outline

<!-- Your marketing team uses this section to build the pitch deck. -->

**The problem:** when having an important interaction with a person or a group of people, the search can be very time consuming, especially when there's little time to prepare.

**Our solution:** our product let's you search a person or a group of people in matter of seconds.

**Key differentiator:** search multiple sources, multiple people, in a matter of seconds

**Demo moment:** quick search time, multiple souces, in a matter of seconds, tailored to your specific interaction

**Target market:** few millions, mainly pdh and masters students

**The ask:** we aim for 90% of: 117 algerian universities, and around 1.5 million students, and funding for marketing
