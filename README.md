# node-web
<p>Prototypical node webserver.</p>
<p>I spent three days developing this before I felt it had become functional and usable.</p>
<p>It's still in active development, and I'll work on it whenever I can.</p>
<br><br>
<p>Before I started working on this, I used separate node processes for all of my domains, all running on different ports.</p>
<p>After registering <a href="https://this-is-a.site/">https://this-is-a.site/</a> and trying to get a backend app set up for it, I had the idea to create a node app that can run in a single process on a single port while serving pages for different sites.</p>
<p>I created libraries for configuration, etc, and quickly started to put the pieces together. I had finally got everything working. It could serve pages for all of my sites, but only static pages.</p>
<p>One thing that I had learned from my previous attempt at creating a node app to serve dynamic pages was that it did <b>not</b> work well with images and other static files. It was definitely better to learn this from experience than to learn it the hard way while working on something I was passionate about.</p>
<p>I spent ages writing the code to parse and execute JavaScript code on pages, but after some coffee and some lost hours of sleep, I finally finished it. JavaScript code could be used on the pages as if it were PHP - except the benefit here is that it's not PHP.</p>
<p>I decided that it would be a waste to stop there. I created code to parse and modify something between a few characters and I was just going to use it for dynamic JS? That's when I had the idea to create serverside tags that looked plain and simple in the code but turned into something a lot more complex when served to the client.</p>

# Features #

* The ability to easily configure stuff with a single json file.
* The ability to run any amount of sites you want on a single process and a single port.
* The ability to use serverside tags, and the ability to create your own easily with enough JS experience.
* The ability to run serverside JavaScript on a page as if it were PHP - except it's not PHP, thank fuck!
* The ability to blacklist any IP from accessing content on your sites.
* The ability to log requests so that you can monitor potential malicious activity and debug issues.
* The ability to show all files inside a directory if no `index.html` file is found.

# Dependencies
<p><a href="http://www.collectionsjs.com/map">collections/map</a> is required for configuration to work.</p>
