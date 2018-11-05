# Neighbourhood Map

'Neighbourhood Map' is a Single Page Application that displays a list of tourist attractions in the Istanbul area.

## Instructions to run the project

##### 1. Clone the project to your local machine

Clone this project into your machine using the following command:

```
git clone https://github.com/w-k-s/NeighbourhoodMap.git
```
This should create a directory udacity-item-catalog with the files:

```
.
├── README.md
├── assets
│   ├── css
│   │   ├── bulma.min.css
│   │   ├── main.css
│   │   └── site.min.css
│   ├── img
│   │   ├── favorite-outline.svg
│   │   └── favorite.svg
│   └── js
│       ├── jquery.js
│       ├── knockout.js
│       ├── main.js
│       ├── models
│       │   └── place.js
│       ├── services
│       │   ├── placesService.js
│       │   └── wikipediaService.js
│       ├── site.min.js
│       └── viewmodels
│           └── place.js
├── gruntfile.js
├── index.html
├── package-lock.json
└── package.json
```
##### 2. Launch the app

After cloning the repo, you can launch the application by clicking on `index.html`. This should open the page on your preferred Web browser.

## Instructions to build the project

##### 1. Clone the project to your local machine

(See instruction 1 in `Instructions to run the project)

##### 1. Install npm

You'll need to make sure you have npm installed on your machine in order to build the project. You can test this by running the following command on terminal:

```
npm -v
```

If npm is installed, the command should print the version of python on your machine. 
If npm is not installed, you can follow the instructions [here](https://www.npmjs.com/get-npm).

##### 3. Install grunt CLI

`grunt` is a build tool for web applications. It is used to reduce the all the css files into a single file and likewise for all the js files. This reduces the content that the website needs to download in order to run. You can check to see if you have grunt installed on your machine using the following command on terminal:
```
grunt -version
```
If grunt is installed, this should print its version. To install grunt, run the following command

```
npm -i grunt-cli -g
```

##### 3. Install dependencies

The `package.json` specifies all the dependencies required by grunt to work.
To install these dependencies, simply run:
```
npm install
```
##### 4. Build the project

You can now use grunt to build the project:
```
grunt
```

## Attributions

- Map data provided by [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial)
- Place information provided by [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)
- Icons made by [Freepik](http://www.freepik.com) from [Flaticon](www.flaticon.com), is licensed by  [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/)