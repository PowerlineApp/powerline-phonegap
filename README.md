# Introduction
Powerline is an open, social, streamlined mobile app and web platform that makes it easier for people to change their world through individual or collective action at the local and global levels. Think of it as Twitter/Yammer for democracy or as a community network for civil society (a.k.a. the non-profit and activist space).

Learn more through the [Detailed Overview](https://assembly.com/powerline/posts/the-detailed-overview).
For new contributors and general questions, check out the [FAQ](https://assembly.com/powerline/posts/faq)

## Open Source
Powerline is open sourced under the AGPL license for the development community. Powerline runs as a SaaS application – there is a free “mission” tier as well as paid upgrade plans.

By contributing to Powerline, you’re making a difference for a fun open source project with a real world-changing mission and, unlike traditional OSS, you’re earning your fair share of the profits, too. To get started simply join us on our [Assembly Project Page](https://assembly.com/powerline).

##PhoneGap Build Instructions

### Dependencies
You may need to setup your environment first before you can emulate/build the mobile app

#### Android
1. Install [Android SDK](https://developer.android.com/sdk/index.html)
  * You may need `ant` as well. On Ubuntu `sudo apt-get install ant`
2. Confirm `java`, `$ANDROID/tools` and `$ANDROID/platform-tools` are in your $PATH
3. Or set `$ANDROID_HOME=<path_to_sdk>`

#### IOS
1. [xcode](https://developer.apple.com/xcode/)

### Setup
* `npm` should be installed
* Install tools
  * `npm install -g grunt-cli`
* Install APP Dependencies
  * `npm install`

### Build / Emulate
Use `grunt` to build or emulate the code

*Usage:*
```
    grunt <action>:<platform>:[config]

    actions
        build       Build powerline for android or ios
        emulate     Run powerline in emulator mode  

    platform 
        android     Actions performed against android platform
        ios         Actions performed against ios platform

    config (Optional)
        If left blank, default is use src/js/app/config.js 
        
        prod        Use prod config.js
        staging     Use staging config.js
```

*Build Android Using Staging Config example:*

`grunt build:android:staging`

*Emulate Android Using Default Config Example:*

`grunt emulate:android`

### Browser Debug
* Copy src/config/local.js.sample to src/js/app/config.js
* Change the url parameter using local server address, staging or prod

*Start the Local Server*

`grunt less && grunt server`

Open web browser to [http://localhost:9000](http://localhost:900)

##API Reference Documentation
Work in Progress

## Contributing
Want to help build an amazing product? Check out our [Powerline Assembly Project](https://assembly.com/powerline) for all the latest bounties and roadmap. We follow the [GitHub Flow](https://guides.github.com/introduction/flow/index.html) model so pull requests are easy! Although you don’t have to create a feature branch, it helps streamline the merge process.


## Branching
Our branching strategy is straightforward and well documented . For a detailed look please see [A successful Branching Model](http://nvie.com/posts/a-successful-git-branching-model/). 

### Branches
* develop - Our main branch for all features
* master - Production ready code
* feature - Your feature branch (temporary branch)
* release-*, hotfix-* - temporary branches 


## Documentation
**Work in progress. Please help us build our documentation!**
Check out all of our documentation for more details include our API [PowerlineApp Documentation](http://powerlineapp.github.io/).

 
## Pull Request & Claiming your Bounty
When your code is ready and on GitHub, create a pull request via the GitHub UI. Once your pull request is created, it is best practice to go to the bounty on Assembly and submit your work with a link to the pull request. If the feature you created does not have a bounty created yet, simply create one explaining what you've done and why. The core team will award the bounty after confirming and merging the contribution. We recommend you include the appropriate unit tests to make things easier for everyone. 

After the bounty or work is submitted, add a comment to the pull request with a link to the bounty. This keeps the code review and merging process quick and easy.
