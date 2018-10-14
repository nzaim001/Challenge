#Challenge

This work was done in 4h.

I developed the back-end using node.js and handled the database with MongodDB. For front-end side, I used AngularJs and Bootstrap ( the page is responsive and sensitive to the window's size. By zooming, the page tries to adapt to the new form. 

In addition, I decided to make a single configuration file to define all the global variables so as not to change the parameters on the server.js between several of codes ( for example, the number of top players that we would display on the screen, the number of the recent games ...).

Also, the file LAUNCH.sh is a short script to quickly install the needed and the usual npm modules. [ run it first to prepare the environnement].

A small problem is that my computer failed to load external files inside an HTML file. I tried to fix it in order to independently seperate the css and angularJs from HTML code for better way of coding, but the problem persists.
