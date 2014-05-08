node-canvas-capture-server
==========================

#####A tool for saving frames rendered in your browser's HTML5 Canvas to PNGs on your local File System.

----

##Installation

0: Install Node.js if you haven't yet.

1: Clone this repo to somewhere convenient on your machine.

2: Using your command line flavor of choice, `cd` into the newly cloned directory. Run the command:

```bash
npm install
```

----

##Usage:

0: Using your command line flavor of choice, `cd` into the folder containing the app.js file. Start the `node` server using following command:

```bash
npm start
```

After starting the server, navigate to `http://localhost:3000/` in your browser.


1: Put your all files you intend to access into the `public` folder. Create an HTML file to host your Canvas element. Put a `<canvas>` tag on that page.

```html
<canvas width="400" height="400" id="myCanvas">
```


2: Load `jQuery` and `capture.js` into the page AFTER your `<canvas>` element. `jQuery` is required because I didn't care to fiddle with writing all of my own XHR wrapping. You may note that `jQuery` was automatically pulled down into the `javascripts` during the `npm install` process.

```html
<script src="javascripts/jquery-2.1.1.js"></script>
<script src="javascripts/capture.js"></script>
```


3: AFTER the the Get access to your `<canvas>` tag in JavaScript, and pass it to the `CanvasCapture` constructor to create a new instance of the `CanvasCapture` object.

```javascript
var myCanvasElement = document.getElementById('myCanvas');
var myCanvasCapture = new CanvasCapture(myCanvasElement);
```


4: Do whatever you feel like with the contents of your canvas. When you are happy with the content of a frame, call the `CanvasCapture.capture` method.

```javascript
//did my rendering, canvas now has some content
myCanvasCapture.capture();
```


5: When you have captured all of the frames you want included in your animation, stop whatever loop you have which was capturing your frames, and call the `CanvasCapture.send` method, with the a string argument describing the path that you want your PNGs saved out to.

```javascript
//whatever loop was capturing frames should have been stopped by now
myCanvasCapture.send('cap-1');
```

The above will save your PNGs into a structure looking like this: `/output/cap-1/(0001 - 9999).png`


6: Wait. Depending on the size of the size and number of frames you sent to the server, the operation may take some time to save all those files to the file system. If the save succeeded, an `alert` dialog will appear and display the path at which you may access your PNG output. Happy exporting!