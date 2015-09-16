TeamCity Formatter
==================

## Usage

In the setup of the cucumber test for a project add the formatter like so:

    //in ./support/anyFileWillDoJustFine.js
    var teamCityFormatter = require("teamcity-formatter");
    
    module.exports = function() {
        teamCityFormatter.call(this);
    };
    
And run cucumber test like normally. Possibly add `--format summary` to the arguments for cucumber-js
