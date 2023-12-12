import * as pdfjsLib from 'pdfjs-dist';
import {fabric} from 'fabric';
import $ from 'jquery';
import * as jspdf from "jspdf";
import { HomeComponent } from '../../home.component';


export class TEPDF {

    static inst: any;
    number_of_pages: number;
    pages_rendered: number;
    active_tool: number;
    fabricObjects: any[];
    fabricObjectsData: any[];
    color: string;
    borderColor: string;
    borderSize: number;
    font_size: number;
    active_canvas: number;
    container_id: any;
    url: any;
    pageImageCompression: string;
    textBoxText: string;
    format: any;
    orientation: any;
    Arrow: (canvas, color, callback) => void;

    constructor(container_id, url, options: any = {}) {
        this.number_of_pages = 0;
        this.pages_rendered = 0;
        this.active_tool = 1; // 1 - Free hand, 2 - Text, 3 - Arrow, 4 - Rectangle
        this.fabricObjects = [];
        this.fabricObjectsData = [];
        this.color = '#212121';
        this.borderColor = '#000000';
        this.borderSize = 1;
        this.font_size = 16;
        this.active_canvas = 0;
        this.container_id = container_id;
        this.url = url;
        this.pageImageCompression = options.pageImageCompression ?
            options.pageImageCompression.toUpperCase() :
            'NONE';
        this.textBoxText = 'Sample Text';
        TEPDF.inst = this;
        this.loading(options);
    }
    loading(options) {
        var loadingTask = pdfjsLib.getDocument(this.url);
        loadingTask.promise.then(
            function (pdf) {

                const scale = options.scale ? options.scale : 1.3;
                TEPDF.inst.number_of_pages = pdf.numPages;

                for (let i = 1; i <= pdf.numPages; i++) {
                    pdf.getPage(i).then(function (page) {
                        if (typeof TEPDF.inst.format === 'undefined' ||
                            typeof TEPDF.inst.orientation === 'undefined') {
                            const originalViewport = page.getViewport({scale: 1});
                            TEPDF.inst.format = [originalViewport.width, originalViewport.height];
                            TEPDF.inst.orientation =
                                originalViewport.width > originalViewport.height ?
                                    'landscape' :
                                    'portrait';
                        }

                        const viewport = page.getViewport({scale: scale});
                        const canvas = document.createElement('canvas');
                        document.getElementById(TEPDF.inst.container_id).appendChild(canvas);
                        canvas.className = 'pdf-canvas';
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        canvas.style.width = "50%";
                        canvas.style.height = "50%";
                        let context = canvas.getContext('2d');
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        var renderTask = page.render(renderContext);
                        renderTask.promise.then(function () {
                            $('.pdf-canvas').each(function (index, el) {
                                $(el).attr('id', 'page-' + (index + 1) + '-canvas');
                            });
                            TEPDF.inst.pages_rendered++;
                            if (TEPDF.inst.pages_rendered == TEPDF.inst.number_of_pages) TEPDF.inst.initFabric(options);
                        });
                    });
                }
            },
            function (reason) {
                console.error(reason);
            });

    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    initFabric = function (options) {
        var inst = TEPDF.inst;
        let canvases = $('#' + inst.container_id + ' canvas');
        canvases.each(function (index, el:any) {
            const background = el.toDataURL('image/png');
            const fabricObj = new fabric.Canvas(el.id, {
                freeDrawingBrush: {
                    width: 1,
                    color: inst.color,
                },
            });
            inst.fabricObjects.push(fabricObj);
            if (typeof options.onPageUpdated == 'function') {
                fabricObj.on('object:added', function () {
                    var oldValue = Object.assign({}, inst.fabricObjectsData[index]);
                    inst.fabricObjectsData[index] = fabricObj.toJSON();
                    options.onPageUpdated(
                        index + 1,
                        oldValue,
                        inst.fabricObjectsData[index]
                    );
                });
            }
            fabricObj.setBackgroundImage(
                background,
                fabricObj.renderAll.bind(fabricObj)
            );
            $(fabricObj.upperCanvasEl).click(function (event) {
                inst.active_canvas = index;
                inst.fabricClickHandler(event, fabricObj);
            });
            fabricObj.on('after:render', function () {
                inst.fabricObjectsData[index] = fabricObj.toJSON();
                fabricObj.off('after:render');
            });

            if (index === canvases.length - 1 && typeof options.ready === 'function') {
                options.ready();
            }
        });
    };
    getImageDimensions(file) {
        return new Promise (function (resolved, rejected) {
            const i = new Image();
            i.onload = function(){
                resolved({width: i.width, height: i.height})
            };
            i.src = file
        })
    }
    fabricClickHandler = function (event, fabricObj) {
        const inst = TEPDF.inst;
        let toolObj;
        if (inst.active_tool == 2) {
            toolObj = new fabric.IText(inst.textBoxText, {
                left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
                top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
                fill: inst.color,
                fontSize: inst.font_size,
                selectable: true,
            });
        } else if (inst.active_tool == 4) {
            toolObj = new fabric.Rect({
                left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
                top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
                width: 100,
                height: 100,
                fill: inst.color,
                stroke: inst.borderColor,
                strokeSize: inst.borderSize,
            });
        }

        if (toolObj) {
            fabricObj.add(toolObj);
        }
    };
    addImageToCanvas (insert,type) {
        const inst = TEPDF.inst;
        const self = this;
        const fabricObj = inst.fabricObjects[inst.active_canvas];
        if (fabricObj) {
            const image = new Image();
            image.onload = function () {

                let options;
                let aCoords = null;
                switch (type){
                    case "bom":
                        options = {
                            name: "bom",
                            left: 1889.837509905812,
                            top: fabricObj.height - image.height - 353,
                            originX:"left",
                            originY:"top",
                            scaleX: 1.2016460739163335,
                            scaleY: 1.2016460739163335
                        }
                        break;
                    case "picture":
                        options = {
                            left:  117,
                            top: (fabricObj.height - image.height) - 1200,
                            originX:"left",
                            originY:"top",
                            name:"picture",
                            scaleX: 1.74,
                            scaleY: 1.74
                        }
                        break;
                    case "lengths":

                         aCoords = {
                            tl: new fabric.Point(840.9375984682351, 725.1247317781997),
                            br: new fabric.Point(1379.264604180486, 864.4736842105262),
                            bl: new fabric.Point(840.9375984682351,864.4736842105262)
                        }

                        options = {
                            left: aCoords.tl.lerp(aCoords.br).x,
                            top: aCoords.tl.lerp(aCoords.br).y,
                            originX:"center",
                            originY:"center",
                            scaleX:1.46,
                            scaleY:1.46,
                            name:"lengths",
                        }
                        break;
                    case "pinning":
                        options = {
                            left: ((fabricObj.width -image.width) / 2) + 50,
                            top: fabricObj.height - image.height - 500,
                            originX:"left",
                            originY:"top"
                        }
                        break;
                    case "notes":

                          aCoords = {
                            tl: new fabric.Point(107.88049906143749, 1277.8167309336282),
                            br: new fabric.Point(713.5388123712803, 1723.6142105263152),
                            bl: new fabric.Point(107.88049906143749,1723.6142105263152)
                        }

                        options = {
                            left: aCoords.tl.lerp(aCoords.br).x,
                            top: aCoords.tl.lerp(aCoords.br).y,
                            originX:"center",
                            originY:"center",
                            scaleX:0.82,
                            scaleY:0.82,
                            name:"notes",
                        }
                        break;
                    case "packaging":

                          aCoords = {
                            tl: new fabric.Point(707.573829286991, 1196.3792742863316),
                            br: new fabric.Point(1155.1386326806482, 1413.348628624709),
                            bl: new fabric.Point(707.573829286991,1413.348628624709)
                        }

                        options = {
                            left: aCoords.tl.lerp(aCoords.br).x,
                            top: aCoords.tl.lerp(aCoords.br).y,
                            originX:"center",
                            originY:"center",
                            scaleX:1.04,
                            scaleY:1.04,
                            name:"packaging",
                        }
                        break;
                }

                fabricObj.add(new fabric.Image(image).set(options));
            };

            image.src = insert;
        }
    };

    /**
     * Item name is unique
     */
    getObjectByName (name) {
        const inst = TEPDF.inst;
        let object = null;
        let objects = inst.fabricObjects[inst.active_canvas].getObjects();

        for (let i = 0, len = objects.length; i < len; i++) {
            if (objects[i].name && objects[i].name === name) {
                object = objects[i];
                break;
            }
        }

        return object;
    };
    enableSelector() {
        const inst = TEPDF.inst;
        inst.active_tool = 0;
        if (inst.fabricObjects.length > 0) {
            $.each(inst.fabricObjects, function (index, fabricObj) {
                fabricObj.isDrawingMode = false;
            });
        }
    };
    enablePencil() {
        var inst = TEPDF.inst;
        inst.active_tool = 1;
        if (inst.fabricObjects.length > 0) {
            $.each(inst.fabricObjects, function (index, fabricObj) {
                fabricObj.isDrawingMode = true;
            });
        }
    };
    enableAddText(text) {
        const inst = TEPDF.inst;
        inst.active_tool = 2;
        if (typeof text === 'string') {
            inst.textBoxText = text;
        }
        if (inst.fabricObjects.length > 0) {
            $.each(inst.fabricObjects, function (index, fabricObj) {
                fabricObj.isDrawingMode = false;
            });
        }
    };
    enableRectangle = function () {
        const inst = TEPDF.inst;
        const fabricObj = inst.fabricObjects[inst.active_canvas];
        inst.active_tool = 4;
        if (inst.fabricObjects.length > 0) {
            $.each(inst.fabricObjects, function (index, fabricObj) {
                fabricObj.isDrawingMode = false;
            });
        }
    };
    deleteSelectedObject = function () {
        var inst = TEPDF.inst;
        var activeObject = inst.fabricObjects[inst.active_canvas].getActiveObject();
        if (activeObject) {
            if (confirm('Are you sure ?')) {
                inst.fabricObjects[inst.active_canvas].remove(activeObject);
            }
        }
    };
    savePdf (fileName) {

        if(false){
            console.log(this.getObjectByName("bom"));
        }


        const inst = TEPDF.inst;
        const format = inst.format || 'a4';
        const orientation = inst.orientation || 'portrait';
        if (!inst.fabricObjects.length) return;
        const doc = new jspdf.jsPDF({format, orientation});
        if (typeof fileName === 'undefined') {
            fileName = `${new Date().getTime()}.pdf`;
        }

        inst.fabricObjects.forEach(function (fabricObj, index) {

            if (index != 0) {
                doc.addPage(format, orientation);
                doc.setPage(index + 1);
            }

            doc.addImage(
                fabricObj.toDataURL({
                    format: 'png',
                }),
                inst.pageImageCompression == 'NONE' ? 'PNG' : 'JPEG',
                0,
                0,
                doc.internal.pageSize.getWidth(),
                doc.internal.pageSize.getHeight(),
                `page-${index + 1}`,
                ['FAST', 'MEDIUM', 'SLOW'].indexOf(inst.pageImageCompression) >= 0 ?
                    inst.pageImageCompression :
                    undefined
            );
            if (index === inst.fabricObjects.length - 1) {
                const blob = doc.output('blob'); // Get the PDF as a Blob object

                const file = new File([blob], fileName, { type: 'application/pdf' });

               

                console.log("File"+ file);

                HomeComponent.dataSaving.p_pdf = file;
                doc.save(fileName);
            }
        });
    };
    setBrushSize = function (size) {
        var inst = TEPDF.inst;
        $.each(inst.fabricObjects, function (index, fabricObj) {
            fabricObj.freeDrawingBrush.width = parseInt(size, 10) || 1;
        });
    };
    setColor = function (color) {
        var inst = TEPDF.inst;
        inst.color = color;
        $.each(inst.fabricObjects, function (index, fabricObj) {
            fabricObj.freeDrawingBrush.color = color;
        });
    };
    setBorderColor = function (color) {
        var inst = TEPDF.inst;
        inst.borderColor = color;
    };
    setFontSize = function (size) {
        this.font_size = size;
    };
    setBorderSize = function (size) {
        this.borderSize = size;
    };
    clearActivePage = function () {
        var inst = TEPDF.inst;
        var fabricObj = inst.fabricObjects[inst.active_canvas];
        var bg = fabricObj.backgroundImage;
        if (confirm('Are you sure?')) {
            fabricObj.clear();
            fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
        }
    };
    serializePdf = function (callback) {
        var inst = TEPDF.inst;
        var pageAnnotations = [];
        inst.fabricObjects.forEach(function (fabricObject) {
            fabricObject.clone(function (fabricObjectCopy) {
                fabricObjectCopy.setBackgroundImage(null);
                fabricObjectCopy.setBackgroundColor('');
                pageAnnotations.push(fabricObjectCopy);
                if (pageAnnotations.length === inst.fabricObjects.length) {
                    var data = {
                        page_setup: {
                            format: inst.format,
                            orientation: inst.orientation,
                        },
                        pages: pageAnnotations,
                    };
                    callback(JSON.stringify(data));
                }
            });
        });
    };
    loadFromJSON = function (jsonData) {
        var inst = TEPDF.inst;
        var {page_setup, pages} = jsonData;
        if (typeof pages === 'undefined') {
            pages = jsonData;
        }
        if (
            typeof page_setup === 'object' &&
            typeof page_setup.format === 'string' &&
            typeof page_setup.orientation === 'string'
        ) {
            inst.format = page_setup.format;
            inst.orientation = page_setup.orientation;
        }
        $.each(inst.fabricObjects, function (index: any, fabricObj) {
            if (pages.length > index) {
                fabricObj.loadFromJSON(pages[index], function () {
                    inst.fabricObjectsData[index] = fabricObj.toJSON();
                });
            }
        });
    };
    setDefaultTextForTextBox = function (text) {
        var inst = TEPDF.inst;
        if (typeof text === 'string') {
            inst.textBoxText = text;
        }
    };

    /*       const canvasJson = JSON.stringify(fabricObj);
            console.log(canvasJson);*/
}
