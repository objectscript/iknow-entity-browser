# iKnow Entity Browser<sup>[development]</sup>

A visualizer of iKnow entities.

Preview
-------

![Screenshot](https://cloud.githubusercontent.com/assets/4989256/20325678/5efeecde-ab8e-11e6-8d8d-f4955a1afa4d.png)
![Screenshot](https://cloud.githubusercontent.com/assets/4989256/20610106/becaeac6-b29d-11e6-987b-670998ac048e.png)

Usage
-----

[Build](#development) the project (or [download](https://github.com/intersystems-ru/iknow-entity-browser/releases) a demo), then open `index.html` file.

+ Click and drag on empty space to move around nodes.
+ Click and drag on a node to move the node.
+ Single-click a node to select it.
+ CTRL-click nodes to select many of them.
+ CTRL-click and drag on empty space to select a bunch of nodes.
+ Scroll down or up to scale.
+ Click on menu button to open a table containing information about selected nodes.
+ Click on export button to save the table as a file.

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
gulp
```

Then, open `build/static/index.html` file.

To install test REST client, run the following:

```bash
import
```

This will put `src/cls/EntityBrowser/Router.cls` class into your Caché (change the `import.*`
script), and after you set up a web application, go to configure app settings by clicking setting 
button in the top right corner.