# MagicMirror Module: MMM-mcfit

### The module displays the following information:

* Zahl der derzeitigen Auslastung
* inkl. Chart

![screenshot](https://github.com/tonimoeckel/MMM-mcfit/blob/main/screenshot/screenshot.png)


### Data Source
https://www.mcfit.com/de/auslastung/antwort/request.json?tx_brastudioprofilesmcfitcom_brastudioprofiles%5BstudioId%5D=1613967360

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/tonimoeckel/MMM-mcfit
````


Configure the module in your `config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: "MMM-mcfit",
        position: "top_left",
        header: "McFit Dresden",
        config: {
            url: "https://www.mcfit.com/de/auslastung/antwort/request.json?tx_brastudioprofilesmcfitcom_brastudioprofiles%5BstudioId%5D=1613967360".
            updateInterval: 10 * 60 * 1000 // 10 min
        }
    },
]
````
