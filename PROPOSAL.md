### 1- Project Overview
This web application is aimed at providing a more in-depth and data-driven app for Deadlock players to use when considering what items to buy and what builds to run. The app will center on the items, but provide auxiliary support on hero information and game statistics.

Target users are Deadlock players, specifically the nerdy kind that get really into the build-making aspect of the game. There is a good amount of information in game as is, but meta-information about previous versions of items, winrates, community consensus, etc is lacking. It's also just helpful to have a separate space to think about higher-level buildcrafting, outside of the game. 

Core user experience is being able to make theoretical builds and access data about items, view statistics for the investment rewards, and whatever other small features I find interesting enough to include. Users will be able to thoroughly comment their builds and share them with the community, which will require the typical socmed implementations of accounts, a dashboard, public vs private sharing, etc.

### 2- Planned Features and Tasks
#### Buildcrafting
Users will be able to view every item currently in the game, and add them to a custom build, much like they can in the actual game. Builds can be saved to a database (likely as a list of IDs). This will be one page, with the interactivity managed through React. This section might use API pulls for the item data, or I may replicate the data locally depending on how much functionality the API has. Probably API calls. 

#### Social Features
Users can make an account and do limited customization, similar to the last assignment (pfp, bio, etc). Registered users can publish their builds to be viewable on the site with their commentary. Published builds can be commented on and liked/disliked. 

#### Additional Item Data
The API I'm pulling from has a lot of meta-statistics on items, such as winrate, net worth at purchase, time usually purchased, etc. Similar to the pokedex assignment, the site will have individual pages for each item with the most useful additional data. This will be accessible through a menu. Data will be visualized appropriately with graphs and similar representations when necessary. 

#### Additional Hero Data
While not the focus of this app, information on the kits of various heroes is useful when considering buildcrafting (which heroes does this item counter? what do I need to be looking out for? what's my panic buy when a Haze is 7/0 10 minutes in?). As such, individual pages, similar to the Additional Item Data pages, will be available for every hero. These pages will display their stats, kits, upgrades, and potentially most common items.

#### Minigame
This isn't high priority, but I think it would be fun to have a page for a little web game where the user compares two items and guesses which one has the higher winrate, or which two items are more often bought together. Stuff like that. Would require the same API pulls as additional item data, and a little game interface probably done in React.

#### Minimap
Another low priority potential feature if I have extra time is to implement a page dedicated to the minimap, with extra features and information available. For instance, the in-game minimap provides icons for most important things, but doesn't actually explain them, which can make it difficult for a new player to understand what's going on. This minimap page could provide some hover-over text on the icons that explains what each of them mean (tier 1 camp, shop, bridge buff, and what these things actually mean / are useful for).

### 3- Technical Requirements and Tech Choices
The **database** will be some implementation of SQL (likely Postgres) through Supabase, since that's what I know how to integrate easily. User data will be stored, as well as the builds from each user. Builds will have their own table, and each build will link to a user ID, so a user can have many builds but a build's got one user (the author). If I implement comments, those can be stored as another table with a relation to a build and a user with a many-to-one relationship (each comment is under one build and from one user, but builds may have multiple comments and users may leave multiple comments). That should be all that's required on the database end, unless I add more features. 

The **background worker system** will be done through a scheduler. Asynchronous work will include sending emails to users on a weekly basis (top items for this week! etc), and maybe updating the game if I choose to implement a wordle-style daily puzzle. Background work shouldn't be too much of a concern for this project.

**LLM integration** is not something that I would typically implement in a project like this. It is difficult to ensure the reliability of such a tool in niche, frequently-changing settings like an early alpha game that's constantly updated. I think the best way to implement it would be to have a page with a chatbot that spits out some summarized community sentiments on a particular item (with a query like "Sourcing from the Deadlock subreddit and forums, what items are most complained about?"). Users could query the LLM for more information along those lines. Essentially serving as a centralized summary of community sentiment, which plays to the strengths of LLMs as chatbots and summarizing tools. 

To do that I'll probably need to set up a smaller API system to scrape the Deadlock subreddit/forums, to give the LLM a proper source to pull from. If that's too difficult I'll probably scale back the LLM integration to a chatbot interface that can answer questions about the game in general without relying on specific input data, which should still be useful to some degree.

#### New Tech

- Data visualizations as implemented in the Additional Item Data pages haven't been used in class. There's a few different ways that I can implement that - from a quick search, the D3 JS library seems quite useful. Whatever library I pick it will be used to visualize additional data on individual items to provide more information to the user. Graphing winrate compared to the time an item was purchased in-game could be useful, for example.
- I want to put more effort into the look and feel of this site than previous projects, and so I'm thinking of using new tech like Framer Motion to create a more unique look. This is an animation library that works with React/JS/VUE and has many different options to animate content. These will be useful both for nonfunctional flavor and enhancing the feel of the UI, like animating between different layouts when clicking on an item.
- The coding behind the minigame will be new technology for me. It will likely use React and interactive JS/TS in similar ways that have been covered in class, but the particular form of a game is different enough to be called new. 
- LLM integration is new tech that I haven't used before, but I assume that doesn't qualify for this category. Ditto for the email subscription system done through the background worker. If either of those count, great!
Hopefully two of those count, if not I'll think of something. Most of my webdev experience is from this class, and I haven't done a ton of outside research, so it's a little difficult for me to think of what I should implement here.

#### Web Application
I think I'll use React + NextJS with Supabase handling the database, simply because they're what I'm familiar with. For a background worker I'll use BullMQ with Redis queues, mostly for the emails. My LLM provider will be Google AIStudio, assuming I can get it to work on the free tier. Obviously I'd need to upscale for a real app but it will serve for this project. 

### 4- New Knowledge and Open Questions
I'll need to learn more about background workers (particularly email jobs, scheduling them, etc) and LLM integrations for this project, since I haven't coded them before. I'll also need to learn the details of how to query the Deadlock API (thankfully documentation seems pretty good). Depending on what's included in the API, I may need to provide key art for the items or heroes myself. This shouldn't be too difficult, and I could likely rip the files straight from my game installation if necessary.

I'm concerned about running into paywalls along the way, either with the LLM integrations or the API calls. As far as I can tell, both services should be free to the extent that I'll be using them. The API calls may be slower (the website names "prioritized fetching" as one of its paid features), but that's fine for the current project. The scaling for both of those is theoretically there, if I decided to upscale the project and actually deploy it eventually.

I'll need to research more about the data visualization libraries I plan on using, and how to integrate them with the data from the APIs I'll be pulling. It should be doable - it's not like the data is super complex or the visualizations too complicated. 

It's somewhat lower priority than the rest of these concerns, but I would like the website to look nice and have a visual identity in line with the game it's pulling from. Deadlock's art direction is one of my favorite things about it, and customizing the layout and look of the site to pay proper homage would be great. This would require me to learn more about styling than I've had to in previous projects, which have generally been focused more so on functionality than form. 

Finally, because Deadlock is in early alpha, the API does not exactly have an expectation of stability. It's very functional and has a lot of features, but simply due to the nature of development it may be unreliable. Valve is known to drop game-defining updates on random Tuesday evenings. I may have to pull from saved game assets/data when necessary, and design the website with the knowledge that an API failure is very possible. I think it's worth the risk, though, because it's easily my favorite game and has been for months, and I would much rather work on a project that I'm actually interested in than some standard implementation of a mock social media site or something.

If anything, the experience of working under that instability will be valuable for my career, haha.

### Notes
- Working on this solo.
- Praying I haven't drastically overestimated my capabilities and free time to work on this.


### TODO
- add a Tips and Tricks page