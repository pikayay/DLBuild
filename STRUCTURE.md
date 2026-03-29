### Main Pages
- Homepage: acting as the hub for the site, with links to a login/signin page, an items page, and a builds page.
- Login/signin page: Standard login/signin page implemented with Supabase.
- Items page: Displays every item in the game. Clicking on the items will link to that particular item's page, in the /items/[name] design.
- Specific item page: Pulls data from the API to fill out the specific page. This way, we only need one page.tsx file for as many unique items as are in the game. 
- Build browser: Displays all of the builds available on the site.
- Build editor: A page for users to make builds out of the items. Builds can be saved in a Supabase database. 
- Heroes page: Displays every hero in the game. Clicking on the heroes will link to that particular hero's page, in the /heroes/[name] design.
- Specific hero page: Pulls data from the API to fill out the specific hero's stats and information. Same benefits as the item/specific-item page.
