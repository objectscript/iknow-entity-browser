# iKnow Entity Browser<sup>[development]</sup>

A visualizer of iKnow entities.

Preview
-------

![Screenshot](https://cloud.githubusercontent.com/assets/4989256/21582657/3bb1944c-d06a-11e6-8dc5-e7e637cc5e84.png)
![Screenshot](https://cloud.githubusercontent.com/assets/4989256/20610106/becaeac6-b29d-11e6-987b-670998ac048e.png)

Usage
-----

[Build](#development) the project (or [download](https://github.com/intersystems-ru/iknow-entity-browser/releases) a demo), then open `index.html` file.

+ Click and drag on empty space to move around.
+ Click and drag on a node to move the node.
+ Single-click a node to select it.
+ Shift-click nodes to select nodes and their children.
+ CTRL-click and drag on empty space to select a bunch of nodes.
+ Scroll down or up to scale.
+ Click on menu button to open a table containing information about selected nodes.
+ Click on export button to save the table as a file.
+ Undo/Redo any node operations such as deleting or expanding.
+ Unlink node children by clicking unlink button when nodes selected.
+ Delete selected nodes by clicking delete button.
+ Reset the selection with reset selection button.

Development
-----------

Requires [Node.JS](https://nodejs.org) (v0.10.0-6.2.2+),
[Git](https://git-scm.com) and
[Caché](http://www.intersystems.com/library/software-downloads/) 2017.1+
to be installed.

To install & test, open up a terminal and execute the following set of commands:

```sh
git clone https://github.com/intersystems-ru/iknow-entity-browser
cd iknow-entity-browser
npm install
npm run gulp
```

Then, open `build/static/index.html` file.

To install the REST client, change the constants in the `import.bat` file and then run the
following:

```bash
import
```

This will put `src/cls/EntityBrowser/Router.cls` class into your Caché (change the `import.*`
script), and after you set up a web application, go to configure app settings by clicking setting 
button in the top right corner.
