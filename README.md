# POC Tools

## Requirements

### For end-users

- nodejs
- yarn
- this project downloaded here:

### For developpers

- nodejs
- git  
- this project cloned from github
- an ide (better than notepad)

To work on this project:

```shell
git clone git@github.com:mitch10593/POC-tools.git
cd POC-tools
```

## Basic usage

Simple usage:

```shell
yarn install
node app.js --server
```

Then, open [http://localhost:3000](http://localhost:3000)

For automatic script refresh:

```shell
node_modules\.bin\supervisor.cmd -- app.js  -s
```


### How to build Kneeboard frequencies page

```shell
copy config\radioSettings.yml.dist config\radioSettings.yml
http://localhost:3000/kneeboard/frequencies/save
```

The kneeboard page should be added/refreshed in var/frequencies.png file.