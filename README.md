# iKnow Entity Browser<sup>[development]</sup>

A visualizer of iKnow entities.

Preview
-------

![2017-03-24_235057](https://cloud.githubusercontent.com/assets/4989256/24314970/11139e7e-10ed-11e7-913b-e156c253c820.png)
![2017-03-24_234839](https://cloud.githubusercontent.com/assets/4989256/24314971/112bbd2e-10ed-11e7-8dfb-66daafb6d430.png)
<p align="center">
    <img src="https://cloud.githubusercontent.com/assets/4989256/24315541/3c8b39ec-10f0-11e7-88a4-f0b62980858b.png" width="430" align="center">
    <img src="https://cloud.githubusercontent.com/assets/4989256/24322376/d1d40878-116b-11e7-98fe-f1b86ff2085a.png" width="430" align="center">
</p>

Usage
-----

[Build](#development) the project (or [download](https://github.com/intersystems-ru/iknow-entity-browser/releases) 
the latest demo), then open `index.html` file. Make sure you set up [EntityBrowser.Router](src/cls/EntityBrowser/Router.cls)
class correctly before using the tool.

+ Click and drag on empty space to move around.
+ Click and drag on a node to move the node.
+ Single-click a node to select it.
+ Shift-click nodes to select nodes and their children.
+ Ctrl-click and drag on empty space to select a bunch of nodes.
+ Click the `X more` node to see the less relevant nodes.
+ Scroll down or up to scale.
+ Click on menu button to open a table containing information about selected nodes.
+ Click on export button to save the table as a file.
+ Undo/Redo any node operations such as deleting or expanding.
+ Unlink node children by clicking unlink button when nodes selected.
+ Delete selected nodes by clicking delete button.
+ Reset the selection with reset selection button.

Settings and Embedding
----------------------

You can change different settings to control application behavior. All settings are stored in
browser's local storage. Also, you can overwrite any option by passing its name and a value as an
URL parameter (make sure all URL parameters are properly encoded). The list of supported options is 
represented in the table below.

| URL Parameter | Default | Description |
|---|---|---|
| `host` | `http://hostname` | The host name of the server. |
| `port` | `57772` | The port of the server. |
| `webAppName` | `EntityBrowser` | Caché web application name. |
| `domain` | `1` | iKnow domain name. |
| `queryType` | `related` | iKnow query type. Can be `related` or `similar`. |
| `seed` | `crew` | Seed string. |
| `keepSeedInView` | `false` | A `boolean` value determining whether the `queryType` and `seed` settings will be displayed on the screen all the time. |
| `tabularShowHiddenNodes` | `false` | A `boolean` value determining whether to show entities hidden behind `X more` node in the table. |

URL example: `http://.../index.html?domain=1&queryType=similar&seed=plane`

Development
-----------

Requires [Node.JS](https://nodejs.org) (v4.0.0-7.5.0+) (but may work on previous versions),
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
