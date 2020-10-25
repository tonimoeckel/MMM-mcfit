function resolve(obj, path){
    var r=path.split(".");
    if(path){return resolve(obj[r.shift()], r.join("."));}
    return obj
}

Module.register("MMM-mcfit", {

    // Module config defaults.
    defaults: {
        useHeader: true,
        header: "McFit Auslastung",
        updateInterval: 10 * 60 * 1000, // 1 hour = 100 clues per call
        url: "https://www.mcfit.com/de/auslastung/antwort/request.json?tx_brastudioprofilesmcfitcom_brastudioprofiles%5BstudioId%5D=1613967360"
    },

    getStyles: function() {
        return ["MMM-corona-dresden.css"];
    },

    getScripts: function () {
        return [
            this.file("js/lodash.min.js"),
            this.file("js/gauge.min.js"),
        ];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        this.url = this.config.url;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Lade...";
            return wrapper;
        }


        wrapper.innerHTML = "";

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        if (!this.data){
            var error = document.createElement("div");
            error.innerHTML = "Es konnten keine Daten geladen werden";
            wrapper.appendChild(error);
        }else {

            const rows = [
                {
                    keypath: 'items',
                    default: 0,
                    custom: (wrapper, items) => {

                        const item = _.find(items,{
                            isCurrent: true
                        })
                        const value = _.get(item,'percentage');

                        var wrapper = document.createElement("div");

                        var valueDiv = document.createElement("div");
                        valueDiv.innerHTML = `Auslastung: ${value} %`
                        wrapper.appendChild(valueDiv);

                        var target = document.createElement("canvas");
                        var opts = {
                            angle: 0.1, // The span of the gauge arc
                            lineWidth: 0.55, // The line thickness
                            radiusScale: 1, // Relative radius
                            pointer: {
                                length: 0.67, // // Relative to gauge radius
                                strokeWidth: 0.035, // The thickness
                                color: '#FFFFFF' // Fill color
                            },
                            staticZones: [
                                {strokeStyle: "#004e1c", min: 0, max: 5}, // Red from 100 to 130
                                {strokeStyle: "#008000", min: 5, max: 20}, // Red from 100 to 130
                                {strokeStyle: "#9bff00", min: 20, max: 25},
                                {strokeStyle: "#ffff00", min: 25, max: 35},
                                {strokeStyle: "#ffa500", min: 35, max: 50},
                                {strokeStyle: "#ff0000", min: 50, max: 60}
                            ],
                            limitMax: false,     // If false, max value increases automatically if value > maxValue
                            limitMin: false,     // If true, the min value of the gauge will be fixed
                            colorStart: '#6FADCF',   // Colors
                            colorStop: '#8FC0DA',    // just experiment with them
                            strokeColor: '#E0E0E0',  // to see which ones work best for you
                            generateGradient: true,
                            highDpiSupport: true,     // High resolution support

                        };
                        setTimeout(() => {
                            var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                            gauge.maxValue = 60; // set max gauge value
                            gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
                            gauge.animationSpeed = 32; // set animation speed (32 is default value)
                            gauge.set(value); // set actual value
                        }, 0)


                        wrapper.appendChild(target);
                        return wrapper;
                    }

                }
            ]

            rows.forEach((item) => {
                const value = window._.get(this.data,item.keypath,item.default)
                var valueDiv = document.createElement("div");

                if (item.text){
                    valueDiv.innerHTML = item.text.replace("{{value}}",value);
                }

                if (item.custom){
                    valueDiv = item.custom(valueDiv, value, this.data)
                }

                wrapper.appendChild(valueDiv);
            })


        }


        return wrapper;
    },


    processData: function(data) {
        this.data = data;

        this.loaded = true;
    },

    scheduleUpdate: function() {

        var self = this;
        setInterval(() => {
            self.fetchData();
        }, this.config.updateInterval);
        this.fetchData();

    },

    fetchData: function() {
        this.sendSocketNotification('FETCH_MCFIT', this.config.url);
    },

    socketNotificationReceived: function(notification, payload) {

        if (notification === "MCFIT_RESULT") {

            this.processData(payload);
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
