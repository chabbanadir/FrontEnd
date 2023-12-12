import go from "gojs";
import {PortShiftingTool} from "../exts/PortShiftingTool";
import {DimensioningLink} from "../exts/DimensioningLink";
import {Step4Component} from "../step4.component";
import {ComponentModel} from "../../../../../../../../Domain/Entities/MasterData/Component.model";
import {environment} from "../../../../../../../../../environments/environment";
import {Inspector} from "../exts/DataInspector";
import {HomeComponent} from "../../home.component";


export class Sketch {

    alphabets: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    static cables: any = [];
    constructor() {

        Sketch.cables = [];

        go.Diagram.licenseKey = "73f946e2b56328a800ca0d2b113f69ed1bb37f3b9e8c1ef5595441f0ea08681d3089ef7a01d58bc081ff19fd1829c4ddd4cd6c7b9e4e016fe164d1d945b285ade26376e1435b448da30373c3ccfd2fa0ac2a63e2c4e027a4da2adcf3f9b8c09d5fe9ecdd57ca0e";
        console.log(HomeComponent.config.cables)

        HomeComponent.config.cables.forEach((cable: any) => {
            Sketch.cables.push(cable.name)
        });

    }
    // initialize diagram
    initDiagram(): go.Diagram {



        const $ = go.GraphObject.make;

        let inspector: any;
        Step4Component.myDiagram = $(go.Diagram, {
            click: function () {
                new Inspector("details", Step4Component.myDiagram,
                    {
                        includesOwnProperties: false,
                        inspectSelection: false,
                        properties: {
                            lead: {show: Inspector.showIfLink},
                            fromPort: {readOnly: true, show: Inspector.showIfLink},
                            toPort: {readOnly: true, show: Inspector.showIfLink},
                            length: {type: "number", show: Inspector.showIfLink},
                            cableType: {type: "select", choices: Sketch.cables, show: Inspector.showIfLink},
                        }
                    });
            },
            'undoManager.isEnabled': true,
            contentAlignment: go.Spot.Center,
            'draggingTool.isCopyEnabled': false,
            model: $(go.GraphLinksModel,
                {
                    nodeKeyProperty: 'key',
                    linkToPortIdProperty: 'toPort',
                    linkFromPortIdProperty: 'fromPort',
                    linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                }
            ),
            // override the link creation process
            "linkingTool.insertLink": function (fromnode, fromport, tonode, toport) {
                let lead = parseInt(Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking' || item.category === "fakelink").length) + 1;
                
                Step4Component.myDiagram.model.startTransaction("add link dim");
                Step4Component.myDiagram.model.addLinkData(
                    {
                        from: fromnode.key, to: tonode.key, category: "Dimensioning",
                        fromSpot: "TopLeft",
                        toSpot: "TopRight",
                        color: "black",
                        type: "jacketslit",
                        cat: "PD",
                        length: "L" + lead,
                        extension: 15,
                        direction: 0,
                        gap: 0,
                        inset: 0

                    }
                );
                Step4Component.myDiagram.model.addLinkData(
                    {
                        from: fromnode.key , to: tonode.key , category: "Dimensioning",
                        fromSpot: "TopRight",
                        toSpot: "TopLeft",
                        color: "black",
                        type: "jacketslit",
                        cat: "CD",
                        length: "L" + lead,
                        extension: 15,
                        direction: 0,
                        gap: 0,
                        inset: 0,
                    
                    }
                );
                Step4Component.myDiagram.model.commitTransaction("add link dim");

                // to control what kind of Link is created,
                // change the LinkingTool.archetypeLinkData's category
                Step4Component.myDiagram.model.setCategoryForLinkData(this.archetypeLinkData, "linking");

                return go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
            },

        });
        Step4Component.myDiagram.toolManager.mouseMoveTools.insertAt(0, new PortShiftingTool());
        Step4Component.myDiagram.commandHandler.archetypeGroupData = {key: 'Group', isGroup: true};

        const stayInViewport = function (part, pt) {
            const diagram = part.diagram;
            if (diagram === null) return pt;
            // compute the area inside the viewport
            const v = diagram.viewportBounds.copy();
            v.subtractMargin(diagram.padding);
            // get the bounds of the part being dragged
            const b = part.actualBounds;
            const loc = part.location;
            // now limit the location appropriately
            const x = Math.max(v.x + 1, Math.min(pt.x, v.right - b.width - 2)) + (loc.x - b.x);
            const y = Math.max(v.y + 1, Math.min(pt.y, v.bottom - b.height - 2)) + (loc.y - b.y);
            return new go.Point(x, y);
        }

        const nodeSelectionAdornmentTemplate =
            $(go.Adornment, "Auto",
                $(go.Shape, {fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2]}),
                $(go.Placeholder)
            );

        const nodeRotateAdornmentTemplate =
            $(
                go.Adornment,
                {locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE"},
                $(go.Shape, "Ellipse", {
                    name: "ELLIPSE",
                    cursor: "pointer",
                    desiredSize: new go.Size(7, 7),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    geometryString: "M3.5 7 L3.5 30",
                    isGeometryPositioned: true,
                    stroke: "deepskyblue",
                    strokeWidth: 1.5,
                    strokeDashArray: [4, 2]
                })
            );

        const portSize = new go.Size(20, 20);

        function CountLead(lead) {
            if (lead) {
                return lead;
            }

            const arr = Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking' || item.category === "fakelink");

            return "L" + arr.length;
        }

        const nodeResizeAdornmentTemplate =
            $(go.Adornment, "Spot",
                {locationSpot: go.Spot.Right},
                $(go.Placeholder),
                $(go.Shape, {
                    alignment: go.Spot.TopLeft,
                    cursor: "nw-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    alignment: go.Spot.Top,
                    cursor: "n-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    alignment: go.Spot.TopRight,
                    cursor: "ne-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    alignment: go.Spot.Left,
                    cursor: "w-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    alignment: go.Spot.Right,
                    cursor: "e-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    alignment: go.Spot.BottomLeft,
                    cursor: "se-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    alignment: go.Spot.Bottom,
                    cursor: "s-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
                $(go.Shape, {
                    alignment: go.Spot.BottomRight,
                    cursor: "sw-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                })
            );

    let i = 1;
    console.log("Step4Component.myDiagram.model.nodeDataArray Skeetch" + JSON.stringify(Step4Component.myDiagram.model.linkDataArray))
        Step4Component.myDiagram.groupTemplate =
            $(go.Group, "Table",
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape,
                    {
                        rowSpan: 9999, columnSpan: 3,
                        stretch: go.GraphObject.Fill, margin: new go.Margin(0, 24),
                        fill: "transparent"
                    }),
                $(go.Panel, "Table",
                    {column: 0, stretch: go.GraphObject.Vertical, minSize: new go.Size(50, 50)},
                    new go.Binding("itemArray", "leftports"),
                    {
                        itemTemplate:
                            $(go.Panel, "TableRow",
                                $(go.Panel, "Auto",
                                    {width: 50, height: 50},
                                    new go.Binding("portId", "id"),
                                    $(go.Shape, "Circle", {fill: "lightblue"}),
                                    $(go.TextBlock,
                                        new go.Binding("text", "id"))
                                )
                            )
                    }
                ),
                $(go.Placeholder, {column: 1, padding: new go.Margin(20, 10, 10, 10)}),
                $(go.TextBlock, {column: 1, alignment: go.Spot.Top},
                    new go.Binding("text")),
                $(go.Panel, "Table",
                    {column: 2, stretch: go.GraphObject.Vertical, minSize: new go.Size(50, 50)},
                    new go.Binding("itemArray", "rightports"),
                    {
                        itemTemplate:
                            $(go.Panel, "TableRow",
                                $(go.Panel, "Auto",
                                    {width: 50, height: 50},
                                    new go.Binding("portId", "id"),
                                    $(go.Shape, "Circle", {fill: "lightblue"}),
                                    $(go.TextBlock,
                                        new go.Binding("text", "id"))
                                )
                            )
                    }
                )
            );

        // define the Node template
        Step4Component.myDiagram.nodeTemplate =
            $(go.Node, "Table",
                {
                    dragComputation: stayInViewport,
                    locationObjectName: "BODY",
                    locationSpot: go.Spot.Center,
                    selectionObjectName: "BODY",
                    linkValidation: function (fromNode, fromPort, toNode, toPort) {
                        return fromNode.findLinksConnected(fromPort.portId).count +
                            toNode.findLinksConnected(toPort.portId).count < 1;
                    },
                    linkConnected: function (node, link, port) {
                        let lead;
                        Step4Component.myDiagram.commit(function (d) {
                            if (link.data) {
                                if (link.data.category == "linking") {
                                    lead = CountLead(link.data.lead)
                                    link.data.lead = lead;
                                    port.desiredSize = new go.Size(0, 0);
                                }

                                if (link.data.category == "ringlinkRight") {
                                    port.desiredSize = new go.Size(0, 0);
                                }

                            }
                        }, "lead to link");

                    },
                },
                new go.Binding("width", "nodewidth"),
                new go.Binding("height", "nodeheight"),
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("zOrder", "zOrder"),
                {selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate},
                {rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate},
                {resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate},

                // the Panel holding the left port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.leftArray
                $(go.Panel, "Spot",
                    $(go.Panel, "Spot",
                        $(go.Shape, "Rectangle", {
                            stroke: null,
                            width: 0,
                            background: "transparent",
                            fill: null,
                            margin: new go.Margin(0, 0, 0, 0)
                        })
                    ),
                    new go.Binding("itemArray", "leftArray"),
                    {
                        row: 1, column: 0, alignment: go.Spot.Center,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "left",  // internal property to make it easier to tell which side it's on
                                    fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer",
                                    fromLinkableDuplicates: false,
                                    toLinkableDuplicates: false,
                                    toMaxLinks: 1,
                                    fromMaxLinks: 1
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Rectangle",
                                    {
                                        stroke: null,
                                        desiredSize: portSize,
                                        margin: new go.Margin(0, 0, 0, 0),
                                        cursor: "pointer"
                                    },
                                    new go.Binding("fill", "portColor"),
                                    new go.Binding("desiredSize", "desiredSize")
                                ),
                                $(go.TextBlock, "",  // the label text
                                    {
                                        margin: go.Margin.parse("5 0 0 0"),
                                        font: "bold 15px Segoe UI,sans-serif",
                                        editable: false
                                    },
                                    // editing the text automatically updates the model data
                                    new go.Binding("text", "text"))
                            )  // end itemTemplate
                    }
                ),  // end Vertical Panel

                // the Panel holding the top port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.topArray

                $(go.Panel, "Horizontal",
                    new go.Binding("itemArray", "topArray"),
                    {
                        row: 0, column: 1,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "top",
                                    fromSpot: go.Spot.TopRight, toSpot: go.Spot.TopRight,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer"
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Rectangle",
                                    {
                                        stroke: null, strokeWidth: 0,
                                        desiredSize: portSize,
                                        margin: new go.Margin(0, 0, 0, 0)
                                    },
                                    new go.Binding("fill", "portColor"))
                            )  // end itemTemplate
                    }
                ),  // end Horizontal Panel

                // the Panel holding the right port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.rightArray
                $(go.Panel, "Spot",
                    $(go.Panel, "Spot",
                        $(go.Shape, "Rectangle", {stroke: null, width: 0, background: "transparent", fill: null})
                    ),
                    new go.Binding("itemArray", "rightArray"),
                    {
                        row: 1, column: 2, alignment: go.Spot.Center,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "right",
                                    fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer",

                                    /*                                fromLinkableDuplicates: false,
                                                                    toLinkableDuplicates:false,
                                                                    toMaxLinks: 1,
                                                                    fromMaxLinks:1*/
                                    //contextMenu: portMenu
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Rectangle",
                                    {
                                        stroke: null, strokeWidth: 0,
                                        desiredSize: portSize,
                                        margin: 0
                                    },
                                    new go.Binding("fill", "portColor")),
                                $(go.TextBlock, "",  // the label text
                                    {
                                        margin: go.Margin.parse("5 0 0 0"),
                                        font: "bold 15px Segoe UI,sans-serif",
                                        editable: false
                                    },
                                    // editing the text automatically updates the model data
                                    new go.Binding("text").makeTwoWay())
                            )  // end itemTemplate
                    }
                ),  // end Vertical Panel

                // the Panel holding the bottom port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.bottomArray
                $(go.Panel, "Horizontal",
                    new go.Binding("itemArray", "bottomArray"),
                    {
                        row: 2, column: 1, alignment: go.Spot.Center,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "bottom",
                                    fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer",
                                    toMaxLinks: 1
                                    // contextMenu: portMenu
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Rectangle",
                                    {
                                        stroke: null, strokeWidth: 0,
                                        desiredSize: portSize,
                                        margin: new go.Margin(0, 0)
                                    },
                                    new go.Binding("fill", "portColor")),
                                $(go.TextBlock, "",  // the label text
                                    {
                                        margin: go.Margin.parse("5 0 0 0"),
                                        font: "bold 15px Segoe UI,sans-serif",
                                        editable: false
                                    },
                                    // editing the text automatically updates the model data
                                    new go.Binding("text").makeTwoWay())
                            )  // end itemTemplate
                    }
                ),  // end Horizontal Panel
                //PIC SIZE HEREE
                // PIC
                $(go.Picture,
                    {
                        row: 1,
                        name: "BODY",
                        column: 1,
                        maxSize: new go.Size(200,250),
                        _isNodeLabel: true,
                        stretch: go.GraphObject.UniformToFill,
                        sourceCrossOrigin: function () {
                            return "anonymous";
                        }
                    },
                    

                    new go.Binding("flip", "component_orientation", function (data) {

                        if (data.Side == 'LEFT') {
                            if (data.Orientation == 2) {
                                return go.GraphObject.None;
                            } else {
                                return go.GraphObject.FlipHorizontal;
                            }
                        }

                        if (data.Side == 'RIGHT') {
                            if (data.Orientation == 1) {
                                return go.GraphObject.None;
                            } else {
                                return go.GraphObject.FlipHorizontal;
                            }
                        }

                    }),
                    new go.Binding("source", "img", function (s) {
                        return s.toLowerCase();
                    }),
                    new go.Binding("width", "width"),
                    new go.Binding("height", "height")),

                    $(go.Picture,
                        {
                            row: 1,
                            name: "BODY",
                            column: 1,
                            maxSize: new go.Size(250,80),
                            _isNodeLabel: true,
                            stretch: go.GraphObject.Fill,
                            sourceCrossOrigin: function () {
                                return "anonymous";
                            }
                        },
                        
    
                        new go.Binding("flip", "component_orientation", function (data) {
    
                            if (data.Side == 'LEFT') {
                                if (data.Orientation == 2) {
                                    return go.GraphObject.None;
                                } else {
                                    return go.GraphObject.FlipHorizontal;
                                }
                            }
    
                            if (data.Side == 'RIGHT') {
                                if (data.Orientation == 1) {
                                    return go.GraphObject.None;
                                } else {
                                    return go.GraphObject.FlipHorizontal;
                                }
                            }
    
                        }),
                        new go.Binding("source", "img1", function (s) {
                            return s.toLowerCase();
                        }),
                        new go.Binding("width", "width"),
                        new go.Binding("height", "height"))





                    
            );  // end Node

        function colorFunc() {
            return 'black';
        }

        function makeButton(text, action) {
            return $("ContextMenuButton",
                $(go.TextBlock, text),
                {click: action});
        }

        var partContextMenu =
            $("ContextMenu",
                makeButton("TOP",
                    function (e, obj) {  // OBJ is this Button
                        var part = obj.part.adornedPart;

                        Step4Component.myDiagram.model.startTransaction("dim position")

                        if (part.data.cat == "CD") {
                            Step4Component.myDiagram.model.setDataProperty(part.data, "fromSpot", "TopRight");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "toSpot", "TopLeft");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "direction", 0);
                        } else {
                            Step4Component.myDiagram.model.setDataProperty(part.data, "fromSpot", "TopLeft");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "toSpot", "TopRight");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "direction", 0);
                        }

                        Step4Component.myDiagram.model.commitTransaction("dim position");

                    }),
                makeButton("Bottom",
                    function (e, obj) {  // OBJ is this Button

                        var part = obj.part.adornedPart;

                        Step4Component.myDiagram.model.startTransaction("dim position")

                        if (part.data.cat == "CD") {
                            Step4Component.myDiagram.model.setDataProperty(part.data, "fromSpot", "BottomRight");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "toSpot", "BottomLeft");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "direction", 180);
                        } else {
                            Step4Component.myDiagram.model.setDataProperty(part.data, "fromSpot", "BottomLeft");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "toSpot", "BottomRight");
                            Step4Component.myDiagram.model.setDataProperty(part.data, "direction", 180);
                        }

                        Step4Component.myDiagram.model.commitTransaction("dim position");
                    }),
            );

        Step4Component.myDiagram.linkTemplateMap.add("Dimensioning",
            $(DimensioningLink, {

                    reshapable: true, resegmentable: true, curve: go.Link.Link, adjusting: go.Link.Stretch,
                    contextMenu: partContextMenu
                },
                new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                new go.Binding("toSpot", "toSpot", go.Spot.parse),
                new go.Binding("direction"),
                new go.Binding("extension"),
                new go.Binding("inset"),

                // new go.Binding("points").ofModel(),
                $(go.Shape, {stroke: "gray"},
                    new go.Binding("stroke", "color")),
                $(go.Shape, {fromArrow: "BackwardOpenTriangle", segmentIndex: 2, stroke: "gray"},
                    new go.Binding("stroke", "color")),
                $(go.Shape, {toArrow: "OpenTriangle", segmentIndex: -3, stroke: "gray"},
                    new go.Binding("stroke", "color")),
                $(go.TextBlock,
                    // leave some space around larger-than-normal text
                    {
                        isMultiline: false,
                        editable: false,
                        segmentOffset: new go.Point(NaN, 0),
                        segmentIndex: 2,
                        segmentFraction: 0.5,
                        segmentOrientation: go.Link.OrientUpright,
                        alignmentFocus: go.Spot.Bottom,
                        stroke: "gray",
                        font: "8pt sans-serif",
                        textEdited: function (textBlock, previousText, currentText) {
                            if (currentText.length == 0 || isNaN(currentText)) {
                                textBlock.text = previousText;
                            }
                        }

                    },
                    // the TextBlock.text comes from the Node.data.key property
                    new go.Binding("text", "length").makeTwoWay()),

                $(go.TextBlock,
                    // leave some space around larger-than-normal text
                    {
                        visible: false
                    },
                    // the TextBlock.text comes from the Node.data.key property
                    new go.Binding("text", "lead").makeTwoWay())
            ));

        Step4Component.myDiagram.linkTemplateMap.add("identification",
            // if the BalloonLink class has been loaded from the Extensions directory, use it
            $(go.Link,
                $(go.Shape,  // the Shape.geometry will be computed to surround the comment node and
                    // point all the way to the commented node
                    {stroke: "black", strokeWidth: 1, fill: "lightyellow"})
            ));

        Step4Component.myDiagram.nodeTemplateMap.add("identification", $(go.Node, "Spot",
            $(go.Shape, "Circle",
                {name: "SEATSHAPE", desiredSize: new go.Size(20, 20), fill: "white", stroke: "black", strokeWidth: 1},
                new go.Binding("fill")),
            $(go.TextBlock,
                {font: "10pt Verdana, sans-serif"},
                new go.Binding("text"),
                new go.Binding("angle", "angle", function (n) {
                    return -n;
                })),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
        ));

        // Link templates
        Step4Component.myDiagram.linkTemplateMap.add("linking",
            $(go.Link,  // defined below
                {
                    corner: 100,
                    routing: go.Link.Orthogonal,  // may be either Orthogonal or AvoidsNodes
                    curve: go.Link.None,
                    reshapable: true, resegmentable: true,
                    layerName: "Background",
                    click: function (e, obj) {
                              // Extract the lead and cableType values from your link data
                        let inspector = new Inspector("details", Step4Component.myDiagram,
                            {
                                includesOwnProperties: false,
                                inspectSelection: false,
                                properties: {
                                    lead: {show: Inspector.showIfLink},
                                    fromPort: {readOnly: true, show: Inspector.showIfLink},
                                    toPort: {readOnly: true, show: Inspector.showIfLink},
                                    length: {type: "number", show: Inspector.showIfLink},
                                    cableType: {type: "select", choices: Sketch.cables, show: Inspector.showIfLink},
                                    /*    color: { type: "select", choices: ColorNames },
                                        text: {t: { show: Inspector.showIfNode },
                                        caption: { show: Inspector.showIfNode },
                                        imgsrc: { show: Inspector.showIfNode },
                                        from: { show: false },
                                        to: { show: false },
                                        points: { show: false },
                                        fromSpot: { show: Inspector.showIfLink, type: "select", choices: SpotNames },
                                        toSpot: { show: Inspector.showIfLink, type: "select", choices: SpotNames }*/
                                    }
                                });
                               
                                inspector.inspectObject(obj)
                    },
                    
                },
                
                // make sure links come in from the proper direction and go out appropriately
                new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                new go.Binding("toSpot", "toSpot", go.Spot.parse),
                new go.Binding("points").makeTwoWay(),
                // mark each Shape to get the link geometry with isPanelMain: true
                $(go.Shape, {isPanelMain: true, stroke: "black", strokeWidth: 20},
                    // get the default stroke color from the fromNode
                    new go.Binding("stroke", "fromNode", function (n) {
                        return go.Brush.lighten("black");
                    }).ofObject(),
                    // but use the link's data.color if it is set
                    new go.Binding("stroke", "color", colorFunc)),
                $(go.Shape, {isPanelMain: true, stroke: "white", strokeWidth: 17, name: "PIPE"}),

                $(go.TextBlock,
                    // leave some space around larger-than-normal text
                    {
                        textAlign: "center",
                        font: "bold 14px sans-serif",
                        stroke: "#000000",
                        visible: true,
                        segmentIndex: -1,
                        editable: true,
                        segmentOffset: new go.Point(NaN, 0),
                        segmentOrientation: go.Link.OrientUpright
                    },
                    // the TextBlock.text comes from the Node.data.key property
                    new go.Binding("text", "lead").makeTwoWay()),
                $(go.TextBlock, new go.Binding("text", "cableType").ofModel()),
                $(go.TextBlock, new go.Binding("text", "length").ofModel()),
/*
                $(go.Shape, "Rectangle", { width: 70, height: 25, fill: "white", strokeWidth: 1 })
*/

            )
        );

        return Step4Component.myDiagram;
    }

    getAlphabets(id): string {
        return this.alphabets[id];
    }

    getPortColor() {
        const portColors = ["#fae3d7", "#d6effc", "#ebe3fc", "#eaeef8", "#fadfe5", "#6cafdb", "#66d6d1"];
        return portColors[Math.floor(Math.random() * portColors.length)];
    }

    // Affichage Connector
    getCDN(component: ComponentModel) {

        try {
            if (component.picture)
                return environment.cdnUrl + component.picture.picPath;

            if (component.config)
                return environment.cdnUrl + component.config.picture.picPath;
        } catch (e) {
            return 'assets/images/connectors/default-image.jpg';
        }

    }
    getCD(component: ComponentModel) {

        try {
            if (component.picture)
                return environment.cdnUrl + component.picture.picPath;

            if (component.config)
                return environment.cdnUrl + component.config.picture.picPath;
        } catch (e) {
            return 'assets/images/connectors/default-image.jpg';
        }

    }
    // When the diagram model changes, update app data to reflect those changes. Be sure to use immer's "produce" function to preserve immutability
    diagramModelChange = function (changes: go.IncrementalData) {
        //console.log(changes);

    };

}
