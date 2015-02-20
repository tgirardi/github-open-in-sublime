# Github Open in Sublime

Content Script for Google Chrome that offers a simple way of opening a file (in
the selected line), when taking a look at a file (or a portion of a file, for
example, in a diff view of a commit) in github.com.

# How to use

**BEFORE YOU CONTINUE**, please notice: this content script **does not work**
"out-of-the-box". Please read the "Dependencies > Use" section.

After installing the content script, go to [chrome://extensions](chrome://extensions).
Look for this content script and click on the "Options" link. A popup window should
appear with a form. In that form you must configure this extension.

When configuring, you need to map each repository, in which you want to be able to use
this extension, to their path in your local machine. Press save once you have finished
configuring the extension.

Open the repository page (in github.com) using Google Crome.

Position the mouse over a line of a file or diff that is displayed in the
repositories page. Two buttons should appear near the line's right border:
clicking on the one on the left will open the file in sublime. The one on the
right will allow to copy a "subl://" URI Scheme for the file which you can use
in several contexts (e.g: in Mac OSX's terminal you can use `open `, followed by
the URI Scheme to open the file in your default text editor).

**IMPORTANT**: this content script uses **"Web Scrapping"** techniques, so
future changes to Github's web app could break this script. Please help me
maintain it :-)... or, if you know of a better way of doing this, don't hesitate
in sharing it with me. Thanks in advance!


## Dependencies

### Building and development

* [Bower](http://bower.io/)
* [NodeJs](http://nodejs.org/) and [npm](https://www.npmjs.com/)
* grunt-cli (`npm install -g grunt-cli`)

Once you have those tools installed, install other dependencies with:

    npm install

... and:

    bower install

You can build using:

    grunt

**Note:** All of the commands above must be run inside the project's folder

### Use

Obviously you will need **Google Chrome** and **Sublime Text**. But also, you
must install the content script as an extension for Google Chrome and then check
the dependencies for your OS:

#### Mac OS X

SublHandler:
https://github.com/asuth/subl-handler

### Linux

You must create a "URI Scheme Handler" for the URI Scheme: "subl://" (if someone
could make a script for that that would be great! :-).

URL Scheme tutorial:

### Windows

Same as linux

## How to Contribute

Any contributions are Welcome! :-)

But please, for the sanity of maintainability, keep in mind this procedure:

1. Fork the repository
2. Make local changes
3. Make tests for new functionalities or issue resolution
4. Tests (old ones and new ones) must pass and the build must complete
   correctly (for both you can run `grunt` command)
5. Be sure to comply with the code style standards (below) and to make
   quality code
6. Commit your changes. The commit message must comply with the "Commit Message"
   standards (below),
7. Push your changes to a remote branch in your github repository (forked
   one). That branch must have a descriptive name.
8. Make a pull request from your branch to the "development" branch of this
   repository. Fill the pull request with a good description.

### Code Style Standard

Please follow Google's [Javascript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).

When in doubt or if there's something that is done differently in this project,
please take a look at the project's javascript files and try to make your code
look like those files.

### Commit Messages Standard

Please follow the rules presented [in this slides](http://www.slideshare.net/TarinGamberini/commit-messages-goodpractices)

