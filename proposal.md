# Tree-Markable Proposal

## Project Goal
Tree-Markable is designed to meet a need for increasing community engagement with the urban forest within my local community of Port Angeles, WA. The [Clallam Tree Alliance](https://www.facebook.com/clallamtreealliance) has discussed the possibility of creating a way for citizens to submit their favorite trees so that other people can enjoy the remarkable trees that exist in our community. The goal of this project is to enable that by allowing users to create and join groups (such as for the City of Port Angeles, or Clallam County) submit their tree, and have all submitted trees appear on an interactive map. By making this accessible, we hope to encourage people to think more about their local greenspaces, urban forest, and how their local government manages those resources.

## Project Focus
The focus for this project will be full-stack, as opposed to primarily front-end or back-end. The Leaflet library, which allows for interactive maps, will be one of the primary focuses of the project. This is an important front-end component that will be emphasised when visiting the site, but that will also require a well constructed back-end to retrieve the correct data for display, depending on the user and filters set. 

## Target Users
The original intent of this project was to meet the needs of the City of Port Angeles, or potentially Clallam County. However there is no reason to limit the use of the web app, and so any user will be able to create a group and use the web app anywhere the basemaps cover. The target users will be those with an interest in discovering and sharing trees with their local community. This could also be used by local municipalities to increase citizen engagement with their urban forest and greenspaces. 

## Platform
Tree-Markable will be best viewed on as a website, as it will make viewing the map easier. However tapping into phones location data for submitting a tree would be very convenient for users, so an effort will be made to make the site responsive and usable on mobile platforms.

## Tech Stack
- Node.js
- Express
- PostgreSQL
- React
- Redux
- Leaflet
- Material-UI

## Data and APIs
The primary API for this project will be [Leaflet](https://leafletjs.com/), which allows for interactive maps. The raw data will come from user submissions, though will be initially stocked with examples already gathered for my local community. 

Depending on time and usefulness, I may use another API for basic tree species to allow users to choose from a list or some autocomplete functionality, as well as to display basic facts about species selected.

### Potential API Issues
Leaflet is a very well established library for JavaScript, so I do not anticipate any issues using their API. If I incorporate generic tree data, I will likely use [Trefle](https://trefle.io/), a plant API that I have experience with and, while it is still being developed, has been actively addressing bugs, adding features, and has been responsive to questions. Potential issues display and interacting with the map could still arise if Leaflet is used improperly. Issues retrieving generic tree species data could arise if the Trefle API goes down, or I run into a yet undiscovered bug.


## Project Approach
### Database Schema
The primary data that will need to be stored will be related to **Trees**, **Users**, and **Groups**. Users can create Groups. Users and Groups will have a many-to-many relationship. Trees must be submitted to a Group by a User, so will have a many-to-one relationship with Groups, and many-to-one relationship with Users. A User can create as many Trees as they want, and a Group can contain as many Trees as they want, but each Tree will be owned by only one User, and one instance of the Tree will relate only to that one Group.

### Sensitive Information
The only sensitive information that will need to be secured will be User passwords, which will be secured with hashing via Bcrypt. There will likely need to be admins for groups, so authentication/authorization will be implemented via JWTs.

### User Flow
Visiting the site for the first time will prompt a request for geolocation, or to manually enter a zip code. If they choose to do so, the interactive map will display their location, with any publically available trees shown on the map. If they are not logged in they will have the option to login/signup. If they are logged in the map will display their last shown map extent/filters. The map can be used to search areas via an address/location input. 

The navigation bar will have a way to access their submitted trees, a page to search Groups/create Groups, view existing Groups, and their account. Group pages will show a map of existing trees, and an option for submitting a new tree. 

### Stretch Goals
A few features that will be implemented if time allows:
- Allow Users to comment on trees
- Allow Users to post within Groups, with moderation control from admin Users.
- Allow Trees to be shared between Groups, which would create a new instance of that tree so any edits would be kept separate.
- A section for posting news/events related to remarkable trees, urban forests, and similar topics. 
- Allow Users to create custom "tree walks", which would be paths on the map.




