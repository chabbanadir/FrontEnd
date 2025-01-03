import { ProjectModel } from './../../../../../../../Domain/Entities/DrawingGenerator/Project.model';
import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DiagramComponent} from 'gojs-angular';
import {EMPTY, Subject} from "rxjs";
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {BomModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Bom.model";
import {BomCModel} from "../../../../../../../Domain/Entities/DrawingGenerator/BomC.model";
import {BomCDModel} from "../../../../../../../Domain/Entities/DrawingGenerator/BomCD.model";
import {BomPModel} from "../../../../../../../Domain/Entities/DrawingGenerator/BomP.model";
import {PinningModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Pinning.model";
import {ConfigurationNotesService} from "../../../../notes/configuration/services/configuration.service";
import {HomeComponent} from "../home.component";
import {ComponentModel} from "../../../../../../../Domain/Entities/MasterData/Component.model";
import {NodeModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Sketch/Node.model";
import {PortModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Sketch/Port.model";
import {catchError, map, takeUntil, withLatestFrom} from "rxjs/operators";
import {NoteType} from "../../../../../../../Domain/Enums/NoteType";
import {HarnessMakerModel} from "../../../../../../../Domain/Entities/MasterData/HarnessMaker.model";
import {HarnessMakerService} from "../../../../data/harness-maker/services/harness-maker.service";
import {DrawingService} from "../../services/drawing.service";
import html2canvas from "html2canvas";
import {Sketch} from "./sketch/sketch";
import {ToastrService} from "ngx-toastr";
import go from "gojs";
import {PackagingService} from "../../../../notes/packaging/services/packaging.service";
import {PackageModel} from "../../../../../../../Domain/Entities/MasterData/Package.model";
import {RingInputModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Sketch/ringinput.model";
import {JacketInputModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Sketch/jacketinput.model";
import {RingModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Sketch/Ring.model";
import {RingFakeData} from "./data/ring.data";
import { IMPLICIT_REFERENCE } from '@angular/compiler/src/render3/view/util';
import { ComponentService } from 'app/WebUI/administration/PE/data/component/services/component.service';
import { InfoService } from 'app/WebUI/administration/PE/data/info/services/info.service';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";

import {InfoModel} from "../../../../../../../Domain/Entities/MasterData/Info.model";
import * as XLSX from 'xlsx';
import { LeadsModel } from 'app/Domain/Entities/DrawingGenerator/Leads.model';
import { PinningSavingModel } from 'app/Domain/Entities/DrawingGenerator/PinningSaving.model';
import { Step1Component } from '../step1/step1.component';
import { Console } from 'console';
import { stringify } from 'querystring';
import { DrawingConnectorModel } from 'app/Domain/Entities/DrawingGenerator/DrawingConnector.model';
@Component({
    selector: 'app-step4',
    templateUrl: './step4.component.html',
    styleUrls: ['./step4.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class Step4Component implements OnInit , AfterViewInit {
    info: InfoModel;
    ems: OemModel[];
    formData : FormData =  new FormData();
    static myDiagram: any;
    @ViewChild('myDiagram', {static: true}) public myDiagramComponent: DiagramComponent;

    Cable: LeadsModel[] = [];

    pinning: PinningSavingModel[] = [];
    // models
    left : ComponentModel[];
    right : ComponentModel[];
    valid: boolean;
    components: ComponentModel[];
    bom: BomModel[] = [];
    bom_cd: BomCModel[] = [];    
    bom_b: BomCDModel[] = [];  
    bom_p: BomPModel[] = [];
   // PDMLINK : BomModel[] = [];
    // cd_bom: BomModel[] = [];
    // pd_bom: BomModel[] = [];
    pinningData: PinningModel[] = [];
    harnessMaker: HarnessMakerModel;
    comp_Parts: ComponentModel[];
    notes: NoteModel[];
    packaging: PackageModel[];
    customerNotes: NoteModel[];
    productionNotes: NoteModel[];
    configurationNotes: NoteModel[];
    componentsNotes: NoteModel[] = [];
    sketch: Sketch;
    leftArray: [];
    cmp: number = 0;
    count: number = 0;
    count1: number = 0;
    count2: number = 0;
    isNotGood:boolean = true;
    isModelLoaded:boolean = false;

    ringTongues: RingInputModel[] = [];
    jacketSlits: JacketInputModel[] = [];

    ringTongTerminals: RingModel[];
    ringTongCables: RingModel[];
    ringTongMasseschelles: RingModel[];
    ringTongTubes: RingModel[];
    ringTongs: RingModel[] = RingFakeData.data;

    connectors:DrawingConnectorModel[] = [];

    // private
    private _unsubscribeAll: Subject<any>;
    

    constructor(private _configurationNotesService: ConfigurationNotesService,
                private _harnessmakerService: HarnessMakerService,
                private _packagingService: PackagingService,
                private _infoService: InfoService,
                private _drawingService: DrawingService,
                private _toasterService: ToastrService,
                private _componentService: ComponentService
    ) {
        console.log("step 4");

        this.sketch = new Sketch();
        this._unsubscribeAll = new Subject();
        console.log("HomeComponent.config.left" + JSON.stringify(HomeComponent.config.left))
        console.log("HomeComponent.config.right" + JSON.stringify(HomeComponent.config.right))
        for (const item of HomeComponent.config.left) {
            const leftConnector = new DrawingConnectorModel();
            leftConnector.id_connector = item.id;
            leftConnector.id_config = item.config.id;
            leftConnector.id_note = item.config.note.id;
            leftConnector.PDMLink_connector = item.pdM_LINK_PN;
            leftConnector.side = "LEFT";
            leftConnector.position = item.position;
            this.connectors.push(leftConnector);
        }
        
        for (const item of HomeComponent.config.right) {
            const rightConnector = new DrawingConnectorModel();
            rightConnector.id_connector = item.id;
            rightConnector.id_config = item.config.id;
            rightConnector.id_note = item.config.note.id;
            rightConnector.PDMLink_connector = item.pdM_LINK_PN;
            rightConnector.side = "RIGHT";
            rightConnector.position = item.position;
            this.connectors.push(rightConnector);
        }
        
        HomeComponent.dataSaving.connectors = this.connectors;
        

        this.load(HomeComponent.config.left, "LEFT");
        this.load(HomeComponent.config.right, "RIGHT");
        
    }

    ngAfterViewInit(): void {
       this.isModelLoaded = true;
    }


    ngOnInit() {
        this._configurationNotesService.onItemsChange.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: NoteModel[]) => {
                this.customerNotes = response.filter(item => item.noteType == NoteType.CD);
                this.customerNotes = this.customerNotes.sort((a, b) => (a.order < b.order ? -1 : 1));

                this.productionNotes = response.filter(item => item.noteType == NoteType.PD);
                this.productionNotes = this.productionNotes.sort((a, b) => (a.order < b.order ? -1 : 1));

                this.configurationNotes = response.filter(item => item.noteType == NoteType.CONFIG);
            });
        this._packagingService.onItemsChange.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: PackageModel[]) => {
                this.packaging = response;
                this.packaging = this.packaging.sort((a, b) => (a.order < b.order ? -1 : 1));
            });
        this._harnessmakerService.GetByIdAsync(HomeComponent.config.harnessMakerId);
        this._harnessmakerService.onItemChange.subscribe(res => {
            this.harnessMaker = res;
        });

        this.ringTongTerminals = this.ringTongs.filter(item => item.Ring_Tongue === 'RT-T');
        this.ringTongCables = this.ringTongs.filter(item => item.Ring_Tongue === 'RT-C');
        this.ringTongMasseschelles = this.ringTongs.filter(item => item.Ring_Tongue === 'RT-S');
        this.ringTongTubes = this.ringTongs.filter(item => item.Ring_Tongue === 'RT-F');

        console.log(this.ringTongTerminals);



        /*        this.state.diagramNodeData =  [
            {"leftArray":[],"rightArray":[{"portId":"A","text":"A","portColor":"#eaeef8"}],"topArray":[],"bottomArray":[],"alphabet":"A","key":"LEFT_a6cd8208-4eac-ec11-a470-a029191869f6_0","img":"https://localhost:5001/images/configurations\\a6aed7e9-fe84-40aa-a19e-71061653c37b.JPG","DATA":{"id":"a6cd8208-4eac-ec11-a470-a029191869f6","name":"180 1P Male Code B","tE_PN":"1452727-2","customer_PN":"6Q0 035 575 A","pdM_LINK_PN":"1452727CA-B.ASM","rev":"B","description":"JACK HOUSING CODE B CREAM, 1WAY, FAKRA 2","length":0,"position":1,"fK_OemId":"6ce091a6-4bac-ec11-a470-a029191869f6","fK_CategoryId":"72e091a6-4bac-ec11-a470-a029191869f6","fK_ConfigId":"550dbd47-4dac-ec11-a470-a029191869f6","fK_CableId":null,"picture":null,"orientation":1,"showIn":3,"status":1,"category":{"id":"72e091a6-4bac-ec11-a470-a029191869f6","name":"Connector","hasNote":true,"hasCable":false,"hasConfig":true},"config":{"id":"550dbd47-4dac-ec11-a470-a029191869f6","name":"180 1P Male","type":null,"length":26,"position":1,"status":1,"orientation":2,"picture":{"id":"65bf8602-f6ad-ec11-a473-a029191869f6","picPath":"configurations\\a6aed7e9-fe84-40aa-a19e-71061653c37b.JPG"},"note":{"id":"0de5ecd7-4cac-ec11-a470-a029191869f6","name":"180 Male","description":"APPLICATION SPECIFICATION FOR 180° CONNECTOR IS 114-18622\nPRODUCT SPECIFICATION FOR 180° CONNECTOR IS 108-2129","order":0}},"cables":[],"parts":[{"fK_PartId":"edd68194-4eac-ec11-a470-a029191869f6"},{"fK_PartId":"eed68194-4eac-ec11-a470-a029191869f6"}]},"component_orientation":{"Side":"LEFT","Orientation":2},"loc":"0 0"},
            {"leftArray":[{"portId":"B","text":"B","portColor":"#6cafdb"}],"rightArray":[],"topArray":[],"bottomArray":[],"alphabet":"B","key":"RIGHT_98cd8208-4eac-ec11-a470-a029191869f6_0","img":"https://localhost:5001/images/configurations\\44ad35cc-f575-44c0-9f96-93956a5faca7.JPG","DATA":{"id":"98cd8208-4eac-ec11-a470-a029191869f6","name":"180 1P Female Code B","tE_PN":"1452728-2","customer_PN":"6Q0 035 576 A","pdM_LINK_PN":"1452728CA-B.ASM","rev":"E","description":"PLUG HOUSING CODE B CREAM, 1WAY, FAKRA 2","length":0,"position":1,"fK_OemId":"6ce091a6-4bac-ec11-a470-a029191869f6","fK_CategoryId":"72e091a6-4bac-ec11-a470-a029191869f6","fK_ConfigId":"510dbd47-4dac-ec11-a470-a029191869f6","fK_CableId":null,"picture":null,"orientation":1,"showIn":3,"status":1,"category":{"id":"72e091a6-4bac-ec11-a470-a029191869f6","name":"Connector","hasNote":true,"hasCable":false,"hasConfig":true},"config":{"id":"510dbd47-4dac-ec11-a470-a029191869f6","name":"180 1P Female","type":null,"length":26,"position":1,"status":1,"orientation":1,"picture":{"id":"03ba08f5-f5ad-ec11-a473-a029191869f6","picPath":"configurations\\44ad35cc-f575-44c0-9f96-93956a5faca7.JPG"},"note":{"id":"08e5ecd7-4cac-ec11-a470-a029191869f6","name":"180 Female","description":"APPLICATION SPECIFICATION FOR 180° CONNECTOR IS 114-18622\nPRODUCT SPECIFICATION FOR 180° CONNECTOR IS 108-2129","order":0}},"cables":[],"parts":[{"fK_PartId":"e9d68194-4eac-ec11-a470-a029191869f6"},{"fK_PartId":"ead68194-4eac-ec11-a470-a029191869f6"}]},"component_orientation":{"Side":"RIGHT","Orientation":1},"loc":"800 0"}
        ];

        this.state.diagramLinkData =[
            {"from":"LEFT_a6cd8208-4eac-ec11-a470-a029191869f6_0","to":"RIGHT_98cd8208-4eac-ec11-a470-a029191869f6_0","category":"Dimensioning","fromSpot":"TopLeft","toSpot":"TopRight","color":"black","type":"jacketslit","cat":"PD","length":"L1","extension":15,"direction":0,"gap":0,"inset":0,"key":-1},
            {"from":"LEFT_a6cd8208-4eac-ec11-a470-a029191869f6_0","to":"RIGHT_98cd8208-4eac-ec11-a470-a029191869f6_0","category":"Dimensioning","fromSpot":"TopRight","toSpot":"TopLeft","color":"black","type":"jacketslit","cat":"CD","length":"L1","extension":15,"direction":0,"gap":0,"inset":0,"key":-2},
            {"category":"linking","from":"LEFT_a6cd8208-4eac-ec11-a470-a029191869f6_0","to":"RIGHT_98cd8208-4eac-ec11-a470-a029191869f6_0","fromPort":"A","toPort":"B","key":-3,"lead":"L1","points":[100.5,0,110.5,0,400,0,400,0,689.5,0,699.5,0],"text":"RTK 031 (2b2b7320-4cac-ec11-a470-a029191869f6)","length":"1500"}
        ];*/
    }

    removeKits() {
        for (let node of Step4Component.myDiagram.model.nodeDataArray.filter(item => item.category === 'kit')) {
            let nodeToBeSelected = Step4Component.myDiagram.findNodeForKey(node.key);
            Step4Component.myDiagram.remove(nodeToBeSelected);
        }
    }

    generateKit(){
        const oemId = HomeComponent.config.oemId;
        // wrong KIT Category ID const categoryId = '7a0817cb-1313-ed11-a509-a029191869f6';
        const categoryId = '77EBA1AB-85AE-EC11-B887-005056873C66';
        let  sideName : string;
        const cableId = HomeComponent.config.cableId || '';
        console.log(HomeComponent.config.oemId);
        //let cableId = Step4Component.myDiagram.model.linkDataArray.find(o => o.category === 'linking' && o.hasOwnProperty('cableType'))?.cableType || '';
        // let lengthIssue = Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').find(o => o.hasOwnProperty('length'))?.length;

        let k=0;
        let inc =0;
        let diff = 0;
        let imgBool = true;

        this.removeKits();
        
        console.log("CableTypeData" +JSON.stringify(HomeComponent.config.CableTypeData));
       this._componentService.QueryAsync(oemId, cableId, categoryId)
       .pipe(
        map((kits: ComponentModel[]) => {
            if(!kits.length) {
                // TODO: display error message to the user.
                throw new Error("Kit not found");
            }
            for (let node of Step4Component.myDiagram.model.nodeDataArray) {
                
                const connectorCmp = node.DATA as ComponentModel;
                const kit = kits.find(k => connectorCmp.parts.some(p => p.fK_PartId === k.id))
               
                console.log("Connector name  : " + node.DATA.name);
                console.log("bool opre  : " + node.DATA.name.startsWith("90"),  "inc : " + inc);
                if (diff >= HomeComponent.config.left.length) diff = 0;
                if (node.DATA.name.startsWith("90")){
                if(kit != null)
                {
                

                    k=0;
                    imgBool = true;
                    if (inc >= HomeComponent.config.CableTypeData.length) inc = 0;
                    while(k < node.DATA.config.position){
                        if(node.DATA.config.position == 2){
                            if(node.component_orientation.Side == "LEFT"){
                            if(HomeComponent.config.CableTypeData[inc].from.startsWith("LEFT_"+node.DATA.id+"_"+diff)) {
                                k = parseInt(HomeComponent.config.CableTypeData[inc].fromPort.match(/\d+/)?.[0] || '', 10) - 1;
                            }else{
                                imgBool = false;
                            }
                        }else{
                            if(HomeComponent.config.CableTypeData[inc].to.startsWith("RIGHT_"+node.DATA.id+"_"+diff)){
                                k = parseInt(HomeComponent.config.CableTypeData[inc].toPort.match(/\d+/)?.[0] || '', 10) - 1;
                            }else{
                                imgBool = false;
                            }
                        }
                    } 
                    console.log(imgBool)
                    if(imgBool == true){

                        let kitNode = new NodeModel();
                        kitNode.leftArray = [];
                        kitNode.rightArray = [];
                        kitNode.topArray = [];
                        kitNode.key = node.key + kit.id;
                        /*Step4Component.myDiagram.model.linkDataArray.*/


   
                       
                            if (HomeComponent.config.CableTypeData[inc].cableType== "RTK 031"){

                                kitNode.img1 = "https://162.109.85.69:1198/images/components/67205caa-6fc4-44f9-9a06-872f2dc2c44d.png"; 
                              }
                            else if (HomeComponent.config.CableTypeData[inc].cableType== "RG 174" || HomeComponent.config.CableTypeData[inc].cableType== "DACAR 462") {
                              kitNode.img1 = "https://162.109.85.69:1198/images/components/67752722-b59f-4ecb-bc14-6fdce4e29f09.png" ;
                              } 

                        
                        
                        kitNode.zOrder = node.zOrder - 1;
                        kitNode.category = 'kit';
                        kitNode.bottomArray = [];
                        //kitNode.alphabet = this.sketch.getAlphabets(this.cmp);
                        
                        kitNode.component_orientation = node.component_orientation;
                        const locArray = node.loc.split(' ');

                        // Convert the strings to numbers
                        let x = parseInt(locArray[0], 10);
                        let y = parseInt(locArray[1], 10);

                        if(node.component_orientation.Side == "LEFT"){
                            console.log("Side : " + node.component_orientation.Side);
                            console.log("Cable type  : " + HomeComponent.config.CableTypeData[inc].cableType);
                            x = x + 105;
                                if(node.DATA.config.position == 2){
                                    
                                    if(k==0){
                                        console.log("k == 0 ? " + k);
                                        y = y - 50;
                                    }else if(k==1){
                                        console.log("k == 1 ? " + k);
                                        y = y + 50;
                                      
                                    }
                                }else{
                                    y = y;
                                }
                        }else{
                            console.log("Side : " + node.component_orientation.Side);
                            console.log("Cable type  : " + HomeComponent.config.CableTypeData[inc].cableType);
                            x = x - 105;
                            if(node.DATA.config.position == 2){
                               
                                if(k==0){

                                    console.log("k == 0 ? " + k);
                                    y = y - 50;
                                }else if(k==1){
                                    console.log("k == 1 ? " + k);
                                    y = y + 50;
                                   
                                }
                            }else{  
                                y = y;
                            }
                        }
                        kitNode.loc = x.toString()+" "+y.toString();
                        k++;
                        inc++;
                        
                            Step4Component.myDiagram.model.addNodeData(kitNode);
                    }else{
                        k=0;
                        break;
                    }
                }
                diff++;
            }
            }else{
                inc++;
                diff++;
            }
            }
            
        }),
        catchError(err => {
            // display error message to the user
            return EMPTY;
        })
       )
       .subscribe();
     }
    

    load(side: any, sideName: string) {
        
        side.forEach((component: ComponentModel, index) => {

            let node = new NodeModel();
            const key = sideName + "_" + component.id + "_" + index;

            node.leftArray = [];
            node.rightArray = [];
            node.topArray = [];
            node.bottomArray = [];
            node.alphabet = this.sketch.getAlphabets(this.cmp);
            node.key = key;
            node.img = this.sketch.getCDN(component);
            node.DATA = component;
            node.zOrder = 0;

            let x, y;
            //here the display of it
            if (sideName == "LEFT") {
                x = 0;
                y = index * 250;
            } else {
                x = 800;
                y = index * 250;
            }

            if (component.config) {
                node.component_orientation = {"Side": sideName, 'Orientation': component.config.orientation};
                for (let i = 0; i < component.config.position; i++) {
                    let newport = new PortModel();
                    newport.portId = component.config.position >= 2 ? node.alphabet + (i + 1) : node.alphabet;
                    newport.text = newport.portId;
                    newport.portColor = this.sketch.getPortColor();

                    if (sideName == "LEFT") {
                        node.rightArray.push(newport);
                    } else {
                        node.leftArray.push(newport);
                    }
                }
            } else {
                node.component_orientation = {"Side": sideName, 'Orientation': component.orientation};

                for (let i = 0; i < component.position; i++) {
                    let newport = new PortModel();
                    newport.portId = component.position >= 2 ? node.alphabet + (i + 1) : node.alphabet;
                    newport.text = newport.portId;
                    newport.portColor = this.sketch.getPortColor();

                    if (sideName == "LEFT") {
                        node.rightArray.push(newport);
                    } else {
                        node.leftArray.push(newport);
                    }
                }
            }

            node.loc = x.toString() + ' ' + y.toString();
            console.log("loccc" + node.loc)

            this.state.diagramNodeData.push(node);

            this.cmp++;
        });
    }

    //gojs
    public diagramDivClassName: string = 'TESketch';
    public state = {
        // Diagram state props
        diagramNodeData: [],
        diagramLinkData: [],
        diagramModelData: {prop: 'value'},
        skipsDiagramUpdate: false,
        selectedNodeData: null, // used by InspectorComponent
    };


    removeIdentifications(){
        for (let node of Step4Component.myDiagram.model.nodeDataArray.filter(item => item.category === 'identification')) {
            let nodeToBeSelected = Step4Component.myDiagram.findNodeForKey(node.key);
            Step4Component.myDiagram.remove(nodeToBeSelected);
        }
    }

    //Sketch
    generateIdentifications()
    {
        HomeComponent.config.CableTypeData = [];
        let alreadyGenerated =  Step4Component.myDiagram.model.nodeDataArray.filter(item => item.category === 'identification');

        if(alreadyGenerated.length>0){
            this.removeIdentifications();
        }

        console.log("Step4Component.myDiagram" + JSON.stringify(Step4Component.myDiagram.model))

        let cableIssue = Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').some(o => !o.hasOwnProperty('cableType'));
        let lengthIssue = Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').some(o => !o.hasOwnProperty('length'));

        if(cableIssue)
        {
            setTimeout(() => {
                this._toasterService.warning(
                    'Cable Issue  ! <br/> please select cables',
                    'Warning',
                    {toastClass: 'toast ngx-toastr', closeButton: true, enableHtml: true}
                );
            }, 1000);
            return;
        }

        if(lengthIssue)
        {
            setTimeout(() => {
                this._toasterService.warning(
                    'Length Issue  ! <br/> please insert cable lengths',
                    'Warning',
                    {toastClass: 'toast ngx-toastr', closeButton: true, enableHtml: true}
                );
            }, 1000);
            return;
        }

        //alphabets a b digramm dou
        Step4Component.myDiagram.model.nodeDataArray.forEach((value: NodeModel) => {
            Step4Component.myDiagram.model.addNodeData({
                key: value.key + "_id",
                text: value.alphabet,
                category: "identification",
                type: 'connectorIdentification',
                loc: value.loc
            });
            Step4Component.myDiagram.model.addLinkData({
                from: value.key + "_id",
                to: value.key,
                category: "identification"
            });
        });
// generate les nombres dou
        this.generateBom();
        this.generateBomC();
        this.generateBomCD();
        this.generateBomP();

        for (let l of Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking' || item.category === 'Dimensioning' || item.category == 'Dimensioning_2')) {
            if (l.cableType != null ){
            HomeComponent.config.CableTypeData.push({
                                cableType: l.cableType,
                                lead : l.lead,
                                fromPort: l.fromPort,
                                toPort: l.toPort,
                                from: l.from,
                                to: l.to,
                            }) ;
            }
        }
    }





    //sync works
    async getPart(id)
    {
        return await this._drawingService.GetParts(id);
    }
    async generatePartsIdentifications(components: any[], node)
    {
        const self = this;
        for (let i = 0; i < components.length; i++) {

            let part = components[i];
            let part_id = (part.customer_PN || part.tE_PN);
            let bom_item = self.bom.find(i => i.Id == part_id);
            let showIn;

            switch (part.showIn) {
                case 0 :
                    showIn = 'None';
                    break;
                case 1 :
                    showIn = 'CD';
                    break;
                case 2 :
                    showIn = 'PD';
                    break;
                case 3 :
                    showIn = 'CD_And_PD';
                    break;
            }

            let key = part_id + "_id_" + node.key;
            let node_sub = Step4Component.myDiagram.findNodeForKey(key);
            if (!node_sub) {

                if (bom_item) {
                    bom_item.Qte = bom_item.Qte + 1;
                } else {
                    self.count++;

                    bom_item = new BomModel();
                    bom_item.Id = part_id;
                    bom_item.Customer_PN = part.customer_PN;
                    bom_item.TE_PN = part.tE_PN;
                    bom_item.PDMLINK = part.pdM_LINK_PN;
                    bom_item.Rev = part.rev;
                    bom_item.Description = part.description;
                    bom_item.Qte = 1;
                    bom_item.Count = self.count;
                    bom_item.Type = showIn;
                    bom_item.UM = 'PC';
                    self.bom.push(bom_item);

                }

                Step4Component.myDiagram.model.addNodeData({
                    key: key,
                    text: bom_item.Count,
                    category: "identification",
                    type: showIn,
                    id: part_id,
                    loc: node.loc
                });
                Step4Component.myDiagram.model.addLinkData({
                    from: key,
                    to: node.key,
                    category: "identification"
                });
            }

            if (part.parts) {
                let comp_Parts = self.comp_Parts = [];

                for (let j = 0; j < part.parts.length; j++) {
                    const inPart = part.parts[j];
                    await self.getPart(inPart.fK_PartId).then((res: any) => {
                        comp_Parts.push(res);
                    });
                }



                await self.generatePartsIdentifications(comp_Parts, node);
            }

        }


    }




    //BOM generator
    async generateBom()
    {
        const self = this;
        this.bom = [];
        this.count = 0;

        this.isNotGood = false;

        await this.generateSideIdentifications(HomeComponent.config.left, "LEFT");
        await this.generateSideIdentifications(HomeComponent.config.right, "RIGHT");

        Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').forEach((l) => {


            let cable = HomeComponent.config.cables.find(item => item.name == l.cableType);
            let cableFound = self.bom.find(i => i.TE_PN == cable.tE_PN);
            if (!cableFound)
            {
                let newCable = new BomModel();

                newCable.Customer_PN = cable.customer_PN;
                newCable.TE_PN = cable.tE_PN;
                newCable.PDMLINK = cable.tE_PN;
                newCable.Description = cable.description;
                newCable.Qte = 'See Table';
                newCable.Id = cable.id;
                newCable.Count = l.lead;
                newCable.UM = 'MR';
                newCable.Type = 'CD_And_PD';

                self.bom.push(newCable);
            }
            else
            {
                cableFound.Count += '/' + l.lead;
            }

        });

        HomeComponent.config.BOM = this.bom;

    }
    async generateSideIdentifications(sideComponents: ComponentModel[], sideName: string)
    {
         const self = this;
         for (let i = 0; i < sideComponents.length; i++) {

             let component = sideComponents[i];
             let comp_Parts = self.comp_Parts = [];
             let showIn;

             const index = sideComponents.indexOf(component);

             for (let j = 0; j < component.parts.length; j++) {
                 const part = component.parts[j];
                 await self.getPart(part.fK_PartId).then((res: any) => {
                     comp_Parts.push(res);
                 });
             }



             let key = sideName + "_" + component.id + "_" + index;
             let node = Step4Component.myDiagram.findNodeForKey(key).data;
             let component_id = (component.customer_PN || component.tE_PN);
             let bom_item = self.bom.find(i => i.Id == component_id);

             switch (component.showIn) {
                 case 0 :
                     showIn = 'None';
                     break;
                 case 1 :
                     showIn = 'CD';
                     break;
                 case 2 :
                     showIn = 'PD';
                     break;
                 case 3 :
                     showIn = 'CD_And_PD';
                     break;
             }

             if (bom_item)
             {
                 bom_item.Qte = bom_item.Qte + 1;
             }
             else
             {
                 self.count++;

                 bom_item = new BomModel();
                 bom_item.Id = component_id;
                 bom_item.Customer_PN = component.customer_PN;
                 bom_item.TE_PN = component.tE_PN;
                 bom_item.Rev = component.rev;
                 bom_item.Description = component.description;
                 bom_item.Qte = 1;
                 bom_item.Count = self.count;
                 bom_item.Type = showIn;
                 bom_item.UM = 'PC';
                 bom_item.PDMLINK = component.pdM_LINK_PN;

                 self.bom.push(bom_item);


                 if (component.category.hasNote) {
                     let exists = this.componentsNotes.find(i => i.id == component.config.note.id);
                     if (!exists) {
                         this.componentsNotes.push(component.config.note);
                     }
                 }
             }


             Step4Component.myDiagram.model.addNodeData({
                 key: component.id + "_id" + bom_item.Qte,
                 text: bom_item.Count,
                 category: "identification",
                 type: showIn,
                 id: component_id,
                 loc: node.loc
             });
             Step4Component.myDiagram.model.addLinkData({
                 from: component.id + "_id" + bom_item.Qte,
                 to: node.key,
                 category: "identification"
             });

             let Linked_children = comp_Parts.filter(item => item.cables != null);
             let linked_child;

             if (Linked_children.length > 0) {
                 Step4Component.myDiagram.findNodeForKey(key).findLinksConnected().filter(item => item.category === 'linking').each(
                     function (link) {
                         link = link.data;


                         let cableFound = HomeComponent.config.cables.find(item => item.name == link.cableType);
                         linked_child = Linked_children.find(item => item.cables.find(cable => cable.fK_CableId == cableFound.id));

                         try {
                             let child_id = (linked_child.customer_PN || linked_child.tE_PN);
                             let bom_item = self.bom.find(i => i.Id == child_id);

                             switch (linked_child.showIn) {
                                 case 0 :
                                     showIn = 'None';
                                     break;
                                 case 1 :
                                     showIn = 'CD';
                                     break;
                                 case 2 :
                                     showIn = 'PD';
                                     break;
                                 case 3 :
                                     showIn = 'CD_And_PD';
                                     break;
                             }

                             if (bom_item) {
                                 bom_item.Qte = bom_item.Qte + 1;
                             }
                             else
                             {
                                 self.count++;

                                 bom_item = new BomModel();
                                 bom_item.Id = child_id;
                                 bom_item.Customer_PN = linked_child.customer_PN;
                                 bom_item.TE_PN = linked_child.tE_PN;
                                 bom_item.PDMLINK = linked_child.pdM_LINK_PN;
                                 bom_item.Rev = linked_child.rev;
                                 bom_item.Description = linked_child.description;
                                 bom_item.Qte = 1;
                                 bom_item.Count = self.count;
                                 bom_item.Type = showIn;
                                 bom_item.UM = 'PC';

                                 self.bom.push(bom_item);
                             }

                             let key = child_id + "_id_" + node.key;
                             let node_sub = Step4Component.myDiagram.findNodeForKey(key);

                             if (!node_sub) {
                                 Step4Component.myDiagram.model.addNodeData({
                                     key: key,
                                     text: bom_item.Count,
                                     category: "identification",
                                     type: showIn,
                                     id: child_id,
                                     loc: node.loc
                                 });
                                 Step4Component.myDiagram.model.addLinkData({
                                     from: key,
                                     to: node.key,
                                     category: "identification"
                                 });
                             }

                             comp_Parts = comp_Parts.filter(obj => obj == linked_child);

                         }catch{
                             setTimeout(() => {
                                 self._toasterService.warning(
                                     'Config Issue  ! <br/> please check your config and try again !',
                                     'Warning',
                                     {toastClass: 'toast ngx-toastr', closeButton: true, enableHtml: true}
                                 );
                             }, 1000);

                             self.isNotGood = true;
                             return;
                         }
                     });
             }

             if (comp_Parts.length > 0) {
                 await this.generatePartsIdentifications(comp_Parts, node);
             }
         }
     }


     async generatePartsIdentificationsP(components: any[], node)
     {
         const self = this;
         for (let i = 0; i < components.length; i++) {
 
             let part = components[i];
             let part_id = (part.customer_PN);
             let bom_item = self.bom_p.find(i => i.Id == part_id);
             let showIn;
 
             switch (part.showIn) {
                 case 0 :
                     showIn = 'None';
                     break;
                 case 1 :
                     showIn = 'CD';
                     break;
                 case 2 :
                     showIn = 'PD';
                     break;
                 case 3 :
                     showIn = 'CD_And_PD';
                     break;
             }
 
             let key = part_id + "_id_" + node.key;
             let node_sub = Step4Component.myDiagram.findNodeForKey(key);
             if (!node_sub) {
 
                 if (bom_item) {
                     bom_item.Qte = bom_item.Qte + 1;
                 } else {
                     self.count2++;
 
                     bom_item = new BomPModel();
                     bom_item.Qte = 1;
                      bom_item.Id = part_id;
                    
                   // bom_item.Customer_PN = part.customer_PN;
                     //bom_item.TE_PN = part.tE_PN;
                     //bom_item.PDMLINK = part.pdM_LINK_PN;
                    // bom_item.Rev = part.rev;
                     bom_item.Description = part.description;
                     bom_item.Count2 = self.count2;
                    // bom_item.Type = showIn;
                     //bom_item.UM = 'PC';
                     self.bom_p.push(bom_item);
 
                 }
 
                 // Step4Component.myDiagram.model.addNodeData({
                 //     key: key,
                 //     text: bom_item.Count,
                 //     category: "identification",
                 //     type: showIn,
                 //     id: part_id,
                 //     loc: node.loc
                 // });
                 // Step4Component.myDiagram.model.addLinkData({
                 //     from: key,
                 //     to: node.key,
                 //     category: "identification"
                 // });
             }
 
             if (part.parts) {
                let comp_Parts = self.comp_Parts = [];

                for (let j = 0; j < part.parts.length; j++) {
                    const inPart = part.parts[j];
                    await self.getPart(inPart.fK_PartId).then((res: any) => {
                        comp_Parts.push(res);
                    });
                }



                await self.generatePartsIdentificationsP(comp_Parts, node);
            }
         }
 
 
     }
     async generateBomP()
     {
         const self = this;
         this.bom_p = [];
         this.count2 = 0;
 
         this.isNotGood = false;
 
         await this.generateSideIdentificationsP(HomeComponent.config.left, "LEFT");
         await this.generateSideIdentificationsP(HomeComponent.config.right, "RIGHT");
 
         Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').forEach((l) => {
 
 
             let cable = HomeComponent.config.cables.find(item => item.name == l.cableType);
             let cableFound = self.bom_p.find(i => i.TE_PN == cable.tE_PN);
             if (!cableFound)
             {
                 let newCable = new BomPModel();
 
                 
                 newCable.Qte = 'See Table';
                 newCable.Customer_PN = cable.customer_PN;
                 //newCable.TE_PN = cable.tE_PN;
                 //newCable.PDMLINK = cable.tE_PN;
                 newCable.Description = cable.description;
                 
                // newCable.Id = cable.id;
                 newCable.Count2 = l.lead;
                 //newCable.UM = 'MR';
                 //newCable.Type = 'CD_And_PD';
 
                 self.bom_p.push(newCable);
             }
             else
             {
                 cableFound.Count2 += '/' + l.lead;
             }
 
         });
 
         HomeComponent.config.BOMP = this.bom_p;
 
     }
     async generateSideIdentificationsP(sideComponents: ComponentModel[], sideName: string)
     {
          const self = this;
          for (let i = 0; i < sideComponents.length; i++) {
 
              let component = sideComponents[i];
              let comp_Parts = self.comp_Parts = [];
              let showIn;
 
              const index = sideComponents.indexOf(component);
 
              for (let j = 0; j < component.parts.length; j++) {
                  const part = component.parts[j];
                  await self.getPart(part.fK_PartId).then((res: any) => {
                      comp_Parts.push(res);
                  });
              }
 
 
 
              let key = sideName + "_" + component.id + "_" + index;
              let node = Step4Component.myDiagram.findNodeForKey(key).data;
              let component_id = (component.customer_PN);
              let bom_item = self.bom_p.find(i => i.Id == component_id);
 
              switch (component.showIn) {
                  case 0 :
                      showIn = 'None';
                      break;
                  case 1 :
                      showIn = 'CD';
                      break;
                  case 2 :
                      showIn = 'PD';
                      break;
                  case 3 :
                      showIn = 'CD_And_PD';
                      break;
              }
 
              if (bom_item)
              {
                  bom_item.Qte = bom_item.Qte + 1;
              }
              else
              {
                  self.count2++;
 
                  bom_item = new BomPModel();
                  bom_item.Qte = 1;
                   bom_item.Id = component_id;
               
                  //bom_item.Customer_PN = component.customer_PN;
                 // bom_item.TE_PN = component.tE_PN;
                  //bom_item.Rev = component.rev;
                  bom_item.Description = component.description;
                  bom_item.Count2 = self.count2;
                  //bom_item.Type = showIn;
                  //bom_item.UM = 'PC';
                  //bom_item.PDMLINK = component.pdM_LINK_PN;
 
                  self.bom_p.push(bom_item);
 
 
                  if (component.category.hasNote) {
                      let exists = this.componentsNotes.find(i => i.id == component.config.note.id);
                      if (!exists) {
                          this.componentsNotes.push(component.config.note);
                      }
                  }
              }
 
 
            //   Step4Component.myDiagram.model.addNodeData({
            //       key: component.id + "_id" + bom_item.Qte,
            //       text: bom_item.Count,
            //       category: "identification",
            //       type: showIn,
            //       id: component_id,
            //       loc: node.loc
            //   });
            //   Step4Component.myDiagram.model.addLinkData({
            //       from: component.id + "_id" + bom_item.Qte,
            //       to: node.key,
            //       category: "identification"
            //   });
 
              let Linked_children = comp_Parts.filter(item => item.cables != null);
              let linked_child;
 
              if (Linked_children.length > 0) {
                  Step4Component.myDiagram.findNodeForKey(key).findLinksConnected().filter(item => item.category === 'linking').each(
                      function (link) {
                          link = link.data;
 
 
                          let cableFound = HomeComponent.config.cables.find(item => item.name == link.cableType);
                          linked_child = Linked_children.find(item => item.cables.find(cable => cable.fK_CableId == cableFound.id));
 
                          try {
                              let child_id = (linked_child.customer_PN);
                              let bom_item = self.bom_p.find(i => i.Id == child_id);
 
                              switch (linked_child.showIn) {
                                  case 0 :
                                      showIn = 'None';
                                      break;
                                  case 1 :
                                      showIn = 'CD';
                                      break;
                                  case 2 :
                                      showIn = 'PD';
                                      break;
                                  case 3 :
                                      showIn = 'CD_And_PD';
                                      break;
                              }
 
                              if (bom_item) {
                                  bom_item.Qte = bom_item.Qte + 1;
                              }
                              else
                              {
                                  self.count2++;
 
                                  bom_item = new BomPModel();
                                  bom_item.Qte = 1; 
                                  bom_item.Id = child_id;
                                 
                                  //bom_item.Customer_PN = linked_child.customer_PN;
                                  //bom_item.TE_PN = linked_child.tE_PN;
                                  //bom_item.PDMLINK = linked_child.pdM_LINK_PN;
                                 //bom_item.Rev = linked_child.rev;
                                  bom_item.Description = linked_child.description;
                                 
                                  //bom_item.Type = showIn;
                                  //bom_item.UM = 'PC';
                                  bom_item.Count2 = self.count2;
                                  self.bom_p.push(bom_item);
                              }
 
                              let key = child_id + "_id_" + node.key;
                              let node_sub = Step4Component.myDiagram.findNodeForKey(key);
 
                            //   if (!node_sub) {
                            //       Step4Component.myDiagram.model.addNodeData({
                            //           key: key,
                            //           text: bom_item.Count,
                            //           category: "identification",
                            //           type: showIn,
                            //           id: child_id,
                            //           loc: node.loc
                            //       });
                            //       Step4Component.myDiagram.model.addLinkData({
                            //           from: key,
                            //           to: node.key,
                            //           category: "identification"
                            //       });
                            //   }
 
                              comp_Parts = comp_Parts.filter(obj => obj == linked_child);
 
                          }catch{
                              setTimeout(() => {
                                  self._toasterService.warning(
                                      'Config Issue  ! <br/> please check your config and try again !',
                                      'Warning',
                                      {toastClass: 'toast ngx-toastr', closeButton: true, enableHtml: true}
                                  );
                              }, 1000);
 
                              self.isNotGood = true;
                              return;
                          }
                      });
              }
 
              if (comp_Parts.length > 0) {
                  await this.generatePartsIdentificationsP(comp_Parts, node);
              }
          }
      }
 
 

    async generatePartsIdentificationsC(components: any[], node)
    {
        const self = this;
        for (let i = 0; i < components.length; i++) {

            let part = components[i];
            let part_id = (part.tE_PN || part.customer_PN);
            let bom_item = self.bom_cd.find(i => i.Id == part_id);
            let showIn;

            switch (part.showIn) {
                case 0 :
                    showIn = 'None';
                    break;
                case 1 :
                    showIn = 'CD';
                    break;
                case 2 :
                    showIn = 'PD';
                    break;
                case 3 :
                    showIn = 'CD_And_PD';
                    break;
            }

            let key = part_id + "_id_" + node.key;
            let node_sub = Step4Component.myDiagram.findNodeForKey(key);
            if (!node_sub) {

                if (bom_item) {
                    bom_item.Qte = bom_item.Qte + 1;
                } else {
                    self.count1++;

                    bom_item = new BomCModel();
                    bom_item.Qte = 1;
                    //bom_item.TE_PN = part.tE_PN;
                    bom_item.Id = part_id;
                    //bom_item.Customer_PN = part.customer_PN;
                    
                    //bom_item.PDMLINK = part.pdM_LINK_PN;
                    bom_item.Rev = part.rev;
                    bom_item.Description = part.description;
                    bom_item.Count1 = self.count1;
                    
                    
                   // bom_item.Type = showIn;
                    //bom_item.UM = 'PC';
                    self.bom_cd.push(bom_item);

                }

                // Step4Component.myDiagram.model.addNodeData({
                //     key: key,
                //     text: bom_item.Count,
                //     category: "identification",
                //     type: showIn,
                //     id: part_id,
                //     loc: node.loc
                // });
                // Step4Component.myDiagram.model.addLinkData({
                //     from: key,
                //     to: node.key,
                //     category: "identification"
                // });
            }

            if (part.parts) {
                let comp_Parts = self.comp_Parts = [];

                for (let j = 0; j < part.parts.length; j++) {
                    const inPart = part.parts[j];
                    await self.getPart(inPart.fK_PartId).then((res: any) => {
                        comp_Parts.push(res);
                    });
                }



                await self.generatePartsIdentificationsC(comp_Parts, node);
            }

        }

    }
    async generateBomC()
    {
        const self = this;
        this.bom_cd = [];
        this.count1 = 0;

        this.isNotGood = false;

        await this.generateSideIdentificationsC(HomeComponent.config.left, "LEFT");
        await this.generateSideIdentificationsC(HomeComponent.config.right, "RIGHT");

        Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').forEach((l) => {


            let cable = HomeComponent.config.cables.find(item => item.name == l.cableType);
            let cableFound = self.bom_cd.find(i => i.TE_PN == cable.tE_PN);
            if (!cableFound)
            {
                let newCable = new BomCModel();
                newCable.Qte = 'See Table';
                newCable.TE_PN = cable.tE_PN;
                newCable.Rev = cable.rev;
                //newCable.Customer_PN = cable.customer_PN;
                newCable.Description = cable.description;
                //newCable.PDMLINK = cable.pdM_LINK_PN;
                
               
                //newCable.Id = cable.id;
                newCable.Count1 = l.lead;
                //newCable.UM = 'MR';
                //newCable.Type = 'CD_And_PD';

                self.bom_cd.push(newCable);
            }
            else
            {
                cableFound.Count1 += '/' + l.lead;
            }

        });

        HomeComponent.config.BOMC = this.bom_cd;

    }



    async generateSideIdentificationsC(sideComponents: ComponentModel[], sideName: string)
    {
         const self = this;
         for (let i = 0; i < sideComponents.length; i++) {

             let component = sideComponents[i];
             let comp_Parts = self.comp_Parts = [];
             let showIn;

             const index = sideComponents.indexOf(component);

             for (let j = 0; j < component.parts.length; j++) {
                 const part = component.parts[j];
                 await self.getPart(part.fK_PartId).then((res: any) => {
                     comp_Parts.push(res);
                 });
             }



             let key = sideName + "_" + component.id + "_" + index;
             let node = Step4Component.myDiagram.findNodeForKey(key).data;
             let component_id = (component.tE_PN || component.customer_PN);
             let bom_item = self.bom_cd.find(i => i.Id == component_id);

             switch (component.showIn) {
                 case 0 :
                     showIn = 'None';
                     break;
                 case 1 :
                     showIn = 'CD';
                     break;
                 case 2 :
                     showIn = 'PD';
                     break;
                 case 3 :
                     showIn = 'CD_And_PD';
                     break;
             }

             if (bom_item)
             {
                 bom_item.Qte = bom_item.Qte + 1;
             }
             else
             {
                 self.count1++;

                 bom_item = new BomCModel();
                 bom_item.Qte = 1;
                 bom_item.Id = component_id;
                
                 //bom_item.Customer_PN = component.customer_PN;
                 //bom_item.TE_PN = component.tE_PN;
                 bom_item.Rev = component.rev;
                 bom_item.Description = component.description;
                 bom_item.Count1 = self.count1;
                
                 //bom_item.Type = showIn;
                 //bom_item.UM = 'PC';
                 //bom_item.PDMLINK = component.pdM_LINK_PN;

               
                

                 self.bom_cd.push(bom_item);


                 if (component.category.hasNote) {
                     let exists = this.componentsNotes.find(i => i.id == component.config.note.id);
                     if (!exists) {
                         this.componentsNotes.push(component.config.note);
                     }
                 }
             }


            //  Step4Component.myDiagram.model.addNodeData({
            //      key: component.id + "_id" + bom_item.Qte,
            //      text: bom_item.Count,
            //      category: "identification",
            //      type: showIn,
            //      id: component_id,
            //      loc: node.loc
            //  });
            //  Step4Component.myDiagram.model.addLinkData({
            //      from: component.id + "_id" + bom_item.Qte,
            //      to: node.key,
            //      category: "identification"
            //  });

             let Linked_children = comp_Parts.filter(item => item.cables != null);
             let linked_child;

             if (Linked_children.length > 0) {
                 Step4Component.myDiagram.findNodeForKey(key).findLinksConnected().filter(item => item.category === 'linking').each(
                     function (link) {
                         link = link.data;


                         let cableFound = HomeComponent.config.cables.find(item => item.name == link.cableType);
                         linked_child = Linked_children.find(item => item.cables.find(cable => cable.fK_CableId == cableFound.id));

                         try {
                             let child_id = (linked_child.tE_PN || linked_child.customer_PN);
                             let bom_item = self.bom_cd.find(i => i.Id == child_id);

                             switch (linked_child.showIn) {
                                 case 0 :
                                     showIn = 'None';
                                     break;
                                 case 1 :
                                     showIn = 'CD';
                                     break;
                                 case 2 :
                                     showIn = 'PD';
                                     break;
                                 case 3 :
                                     showIn = 'CD_And_PD';
                                     break;
                             }

                             if (bom_item) {
                                 bom_item.Qte = bom_item.Qte;
                             }
                             else
                             {
                                 self.count1++;

                                 bom_item = new BomCModel();
                                 bom_item.Qte = 0;
                                  bom_item.Id = child_id;
                                 
                                // bom_item.TE_PN = linked_child.tE_PN;
                                 //bom_item.Customer_PN = linked_child.customer_PN;
                                 bom_item.Rev = linked_child.rev;
                                 bom_item.Description = linked_child.description;
                                 //bom_item.PDMLINK = linked_child.pdM_LINK_PN;
                                
                                 bom_item.Count1 = self.count1;
                                
                              
                              
                                 //bom_item.Type = showIn;
                                 //bom_item.UM = 'PC';

                                 self.bom_cd.push(bom_item);
                             }

                             let key = child_id + "_id_" + node.key;
                             let node_sub = Step4Component.myDiagram.findNodeForKey(key);

                            //  if (!node_sub) {
                            //      Step4Component.myDiagram.model.addNodeData({
                            //          key: key,
                            //          text: bom_item.Count,
                            //          category: "identification",
                            //          type: showIn,
                            //          id: child_id,
                            //          loc: node.loc
                            //      });
                            //      Step4Component.myDiagram.model.addLinkData({
                            //          from: key,
                            //          to: node.key,
                            //          category: "identification"
                            //      });
                            //  }

                             comp_Parts = comp_Parts.filter(obj => obj == linked_child);

                         }catch{
                             setTimeout(() => {
                                 self._toasterService.warning(
                                     'Config Issue  ! <br/> please check your config and try again !',
                                     'Warning',
                                     {toastClass: 'toast ngx-toastr', closeButton: true, enableHtml: true}
                                 );
                             }, 1000);

                             self.isNotGood = true;
                             return;
                         }
                     });
             }

             if (comp_Parts.length > 0) {
                 await this.generatePartsIdentificationsC(comp_Parts, node);
             }
         }
     }

    async generatePartsIdentificationsCD(components: any[], node)
    {
        const self = this;
        for (let i = 0; i < components.length; i++) {

            let part = components[i];
            let part_id = (part.customer_PN || part.tE_PN);
            let bom_item = self.bom_b.find(i => i.Id == part_id);
            let orientation;

            switch (part.orientation) {
                case 0 :
                    orientation = 'Left';
                    break;
                case 1 :
                    orientation = 'Right';
                    break;
                case 2 :
                    orientation = 'PD';
                    break;
                case 3 :
                    orientation = 'CD_And_PD';
                    break;
            }

            let key = part_id + "_id_" + node.key;
            let node_sub = Step4Component.myDiagram.findNodeForKey(key);
            if (!node_sub) {

                if (bom_item) {
                    bom_item.Qte = bom_item.Qte + 1;
                } else {
                    //self.count++;

                    bom_item = new BomCDModel();
                    //bom_item.Id = part_id;
                    bom_item.Type = '';
                    bom_item.PDMLINK = part.pdM_LINK_PN;
                    //bom_item.Rev = part.rev;
                    //bom_item.Type = orientation;
                    
                    //bom_item.UM = 'PC';
                    self.bom_b.push(bom_item);

                }

              
            }

            if (part.parts) {
                let comp_Parts = self.comp_Parts = [];

                for (let j = 0; j < part.parts.length; j++) {
                    const inPart = part.parts[j];
                    await self.getPart(inPart.fK_PartId).then((res: any) => {
                        comp_Parts.push(res);
                    });
                }



                await self.generatePartsIdentificationsCD(comp_Parts, node);
            }

        }

    }
    
    async generateBomCD()
    {
        const self = this;
        this.bom_b = [];
        //this.count = 0;

        this.isNotGood = false;

        await this.generateSideIdentificationsCD(HomeComponent.config.left, "LEFT");
        await this.generateSideIdentificationsCD(HomeComponent.config.right, "RIGHT");
        
        Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').forEach((l) => {


            let cable = HomeComponent.config.cables.find(item => item.name == l.cableType);
            let cableFound = self.bom_b.find(i => i.TE_PN == cable.tE_PN);
            if (!cableFound)
            {
                let newCable = new BomCDModel();

                newCable.PDMLINK = '  ';
                //newCable.Customer_PN = cable.customer_PN;
                newCable.TE_PN = cable.tE_PN;
                //newCable.Description = cable.description;
                newCable.Qte = 'Blank';
                //newCable.Id = cable.id;
                //newCable.Count = l.lead;
                //newCable.UM = 'MR';
                //newCable.Type = 'CD_And_PD';

                self.bom_b.push(newCable);
            }
            else
            {
                cableFound.Count += '/' + l.lead;
            }

        });

        HomeComponent.config.BOMCD = this.bom_b;

    }

    
    async generateSideIdentificationsCD(sideComponents: ComponentModel[], sideName: string)
    {
         const self = this;
         for (let i = 0; i < sideComponents.length; i++) {

             let component = sideComponents[i];
             let comp_Parts = self.comp_Parts = [];
             let orientation;

             const index = sideComponents.indexOf(component);

             for (let j = 0; j < component.parts.length; j++) {
                 const part = component.parts[j];
                 await self.getPart(part.fK_PartId).then((res: any) => {
                     comp_Parts.push(res);
                 });
             }




             
             let key = sideName + "_" + component.id + "_" + index;
             let node = Step4Component.myDiagram.findNodeForKey(key).data;
             let component_id = (component.customer_PN || component.tE_PN);
             let bom_item = self.bom_b.find(i => i.Id == component_id);

             let Linked_children = comp_Parts.filter(item => item.cables != null);
             let linked_child;
             if (comp_Parts.length > 0) {
                await this.generatePartsIdentificationsCD(comp_Parts, node);
            }
            switch (component.orientation) {
                case 1 :
                    orientation = 'Connector_1';
                    break;
                case 2 :
                    orientation = 'Connector_2';
                    break;
                    
                
            }

            if (bom_item)
            {
                bom_item.Qte = bom_item.Qte + 1;
            }
            else
            {
               // self.count++;

                bom_item = new BomCDModel();
                bom_item.Id = '   ';
                //bom_item.Id = component.length;
                //bom_item = component.length;
                bom_item.PDMLINK = component.pdM_LINK_PN;

               bom_item.Type = orientation;
                self.bom_b.push(bom_item);


                
            }
         
             if (Linked_children.length > 0) {
                 Step4Component.myDiagram.findNodeForKey(key).findLinksConnected().filter(item => item.category === 'linking').each(
                     function (link) {
                         link = link.data;


                         let cableFound = HomeComponent.config.cables.find(item => item.name == link.cableType);
                         linked_child = Linked_children.find(item => item.cables.find(cable => cable.fK_CableId == cableFound.id));

                         try {
                             let child_id = (linked_child.customer_PN || linked_child.tE_PN);
                             let bom_item = self.bom_b.find(i => i.Id == child_id);

                             switch (linked_child.orientation) {
                                 case 'Left' :
                                    orientation = 'connector3';
                                     break;
                                 case 'Right' :
                                    orientation = 'connector4';
                                     break;
                                 
                             }

                             if (bom_item) {
                                 bom_item.Qte = bom_item.Qte + 1;
                             }
                             else
                             {
                                 //self.count++;

                                 bom_item = new BomCDModel();
                                bom_item.Id = '  ';
                                 
                                bom_item.PDMLINK = linked_child.pdM_LINK_PN;
                                bom_item.Type = orientation;
                                 self.bom_b.push(bom_item);
                             }

                             


                         }catch{
                             setTimeout(() => {
                                 self._toasterService.warning(
                                     'Config Issue  ! <br/> please check your config and try again !',
                                     'Warning',
                                     {toastClass: 'toast ngx-toastr', closeButton: true, enableHtml: true}
                                 );
                             }, 1000);

                             self.isNotGood = true;
                             return;
                         }
                     });
             }

             

         }
     }

    //cd
    async generate_cd_bom()
    {

        Step4Component.myDiagram.model.startTransaction('remove PD lk');
        for (let link of Step4Component.myDiagram.model.linkDataArray.filter(item => item.cat === 'PD')) {
            Step4Component.myDiagram.model.removeLinkData(link);
        }
        Step4Component.myDiagram.model.commitTransaction('remove PD lk');

        Step4Component.myDiagram.model.startTransaction('remove prod sk');
        for (let node of Step4Component.myDiagram.model.nodeDataArray.filter(item => item.type === 'PD')) {
            let nodeToBeSelected = Step4Component.myDiagram.findNodeForKey(node.key);
            Step4Component.myDiagram.remove(nodeToBeSelected);
        }
        Step4Component.myDiagram.model.commitTransaction('remove PD sk');


        let items = "";

        let cd_bom = this.bom.filter(item => item.Type == 'CD_And_PD' || item.Type == 'CD');

        Step4Component.myDiagram.model.startTransaction('change items');
        cd_bom.forEach((item, index) => {
            let count = item.Count;
            if (count > 0) {
                count = index + 1;
            }
            item.Count = count;
            let nodes = Step4Component.myDiagram.model.nodeDataArray.filter(it => it.id == item.Id);
            nodes.forEach((node) => {
                Step4Component.myDiagram.model.setDataProperty(node, "text", item.Count);

            });
        });
        Step4Component.myDiagram.model.commitTransaction('change items');

        const db = Step4Component.myDiagram.documentBounds.copy();
        const boundswidth = db.width;
        const boundsheight = db.height;

        HomeComponent.config.cd_picture = Step4Component.myDiagram.makeImageData({
            scale: 1,
            size: new go.Size(boundswidth, boundsheight)
        });

        Step4Component.myDiagram.commandHandler.undo();
        Step4Component.myDiagram.commandHandler.undo();
        Step4Component.myDiagram.commandHandler.undo();

        cd_bom = cd_bom.reverse();

        cd_bom.forEach((item) => {
            items += ' <tr> <td>' + item.Qte + '</td>';
            items += ' <td>' + item.Customer_PN + '</td>';
            items += ' <td>' + item.Description + '</td>';
            items += ' <td>' + item.Count + '</td></tr>';
        });


        let bomTable =
            '             <table border="1"' +
            '                style="border-collapse: collapse;text-align: center;width: max-content;">' +
            '                <tbody>' + items +
            '                </tbody>' +
            '                <tfoot>' +
            '                    <tr>' +
            '                        <td style="font-weight: bold;width: 15px;padding: 5px;">QTY<br>-X</td>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">PART NO.</td>' +
            '                        <td style="font-weight: bold;width: 150px;padding: 5px;">DESCRIPTION</td>' +
            '                        <td style="font-weight: bold;width: 15px;padding: 5px;">ITEM<br>NO.</td>' +
            '                    </tr>' +
            '                </tfoot>' +
            '            </table>';



        HomeComponent.config.cd_bom = await this.convertToCanvas(bomTable);
    }
    
    async generate_cd_lengths()
    {

        this.Cable = [];
        
        let length_head_html = "";
        let length_body_html = "";
    
        for (let l of Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking')) {
            length_head_html += '<td style="font-weight: bold;width: 100px;padding: 5px;">LENGTH ' + l.lead + ' (mm)</td>';
        }

        for (let l of Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking' || item.category === 'Dimensioning' || item.category == 'Dimensioning_2')) {
            let data = new LeadsModel();

            if (l.type != 'jacketslit') {
                if (l.type === 'positionlink') {
                    length_body_html += ' <td>' + l.length + ' ±' + l.tlc + '</td>';
                    var cd_length= l.length + l.tlc ;
                    var length = l.length;
                } else {
                    if (l.length >= 1000) {
                        length_body_html += ' <td>' + l.length + ' +30' + '</td>';
                        var cd_length= l.length + 30;
                        var pd_length = l.length + 14
                        var length = l.length;
                        
                    } else {
                        length_body_html += ' <td>' + l.length + ' +20' + '</td>';
                        var cd_length= l.length + 20;
                        var pd_length = l.length + 9
                        var length = l.length;
                        
                        
                    }
                    console.log(cd_length)
                        data.c_length = cd_length;
                        console.log(length)
                        data.length = length;
                        console.log(l.lead)
                        data.p_length = pd_length;
                        data.lead = l.lead;
                        data.from = l.from;
                        data.to = l.to;
                        data.fromPort = l.fromPort;
                        data.toPort = l.toPort;
                        data.id_cable = HomeComponent.config.cables.find(cable => cable.name === l.cableType).id;
                        this.Cable.push(data);

                }

            }
        }
        HomeComponent.dataSaving.leads = this.Cable;

        let lengthTable =
            '<span style="font-weight: bold;">LENGTH SCHEDULE:</span>' +
            '             <table border="1"' +
            '                style="border-collapse: collapse;text-align: center;width: max-content;">' +
            '                <thead>'+
            '                    <tr>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">TE PN</td>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">Customer PN</td>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">REV</td>'
                                    + length_head_html +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>'+
            '                    <tr>'+
            '                        <td>' + HomeComponent.config.partNumber + '</td>'+
            '                        <td>' + HomeComponent.config.customerPN + '</td>'+
            '                        <td>A</td>'
                                    + length_body_html +
            '                    </tr>' +
            '                </tbody>' +
            '            </table>';


        HomeComponent.config.cd_lengths = await this.convertToCanvas(lengthTable);
    }
    async generate_pinning()
    {
        this.pinningData = [];
        this.pinning = []
        //PINNING
        Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking').forEach((value) => {
            let pin = new PinningModel();
            let newPin = new PinningSavingModel();
            pin.pinA = value.fromPort;
            pin.pinB = value.toPort;
            newPin.pinA = value.fromPort;
            newPin.pinB = value.toPort;
            this.pinningData.push(pin);
            this.pinning.push(newPin);
        });



        let pinningBody = "";

        this.pinningData.forEach((item) => {
            pinningBody += '<tr>' +
                '<td>' + item.pinA + '</td>' +
                '<td>' + item.pinB + '</td>' +
                '</tr>'
        });

        let pinningTable =
            '<span style="font-weight: bold;">PINNING TABLE:</span>' +
            '             <table border="1"' +
            '                style="border-collapse: collapse;text-align: center;width: max-content;">' +
            '                <thead>'+
            '                    <tr>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">CONNECTOR</td>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">CONNECTOR</td>' +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>'
                                + pinningBody +
            '                </tbody>' +
            '            </table>';

        HomeComponent.config.pinning = await this.convertToCanvas(pinningTable);
        HomeComponent.dataSaving.pinning = this.pinning

    }
    async generate_cd_notes()
    {

        const self = this;
        let notes = "";
        let count = 0;
        this.customerNotes.forEach((note, index) => {
            count += 1;
            notes += ' <tr>';
            notes += ' <td style="text-align: center;vertical-align: super;" >' + count + '</td>';
            notes += ' <td>' + note.description;
            notes += '</td></tr>';
        });
        count += 1;
        notes += ' <tr>';
        notes += ' <td style="text-align: center;vertical-align: super;" >' + count + '</td>';
        notes += ' <td>' + self.harnessMaker.manufacturing_code;
        notes += '</td></tr>';
        count += 1;
        notes += '<tr> <td style="text-align: center;vertical-align: super;" >' + count + '</td> <td></td></tr>';
        this.componentsNotes.forEach((note) => {
            notes += ' <tr><td style="float:right" ></td> <td>' + note.description +'</td></tr>';
        });

        let notesTable =
            '             <table style="width: max-content;white-space: pre-line;">' +
            '                <thead>'+
            '                    <tr>' +
            '<td style="font-weight: bold;">NOTES</td>' +
            '<td></td>' +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>'
            + notes +
            '                </tbody>' +
            '            </table>';

        HomeComponent.config.cd_notes = await this.convertToCanvas(notesTable);
    }

    //pd

    async generate_pd_bom()
    {
        Step4Component.myDiagram.model.startTransaction('remove CD lk');
            for (let link of Step4Component.myDiagram.model.linkDataArray.filter(item => item.cat === 'CD')) {
            Step4Component.myDiagram.model.removeLinkData(link);
        }
        Step4Component.myDiagram.model.commitTransaction('remove CD lk');

        Step4Component.myDiagram.model.startTransaction('remove CD sk');
            for (let node of Step4Component.myDiagram.model.nodeDataArray.filter(item => item.type === 'CD')) {
            let nodeToBeSelected = Step4Component.myDiagram.findNodeForKey(node.key);
            Step4Component.myDiagram.remove(nodeToBeSelected);
        }
        Step4Component.myDiagram.model.commitTransaction('remove CD sk');

        let items = "";

        let pd_bom = this.bom.filter(item => item.Type == 'CD_And_PD' || item.Type == 'PD');

        Step4Component.myDiagram.model.startTransaction('change items');
            pd_bom.forEach((item, index) => {
            let count = item.Count;
            if (count > 0) {
                count = index + 1;
            }
            item.Count = count;
            let nodes = Step4Component.myDiagram.model.nodeDataArray.filter(it => it.id == item.Id);
            nodes.forEach((node) => {
                Step4Component.myDiagram.model.setDataProperty(node, "text", item.Count);
            });
        });
        Step4Component.myDiagram.model.commitTransaction('change items');

        const db = Step4Component.myDiagram.documentBounds.copy();
        const boundswidth = db.width;
        const boundsheight = db.height;
        const svg_sk = Step4Component.myDiagram.makeImageData({
            scale: 1,
            size: new go.Size(boundswidth, boundsheight)
        });

        HomeComponent.config.pd_picture = svg_sk;

        Step4Component.myDiagram.commandHandler.undo();
        Step4Component.myDiagram.commandHandler.undo();
        Step4Component.myDiagram.commandHandler.undo();

        pd_bom = pd_bom.reverse();




        pd_bom.forEach((item) => {
            items += ' <tr><td>' + item.Qte + '</td>';
            items += ' <td>' + item.TE_PN + '</td>';
            items += ' <td>' + item.Rev + '</td>';
            items += ' <td>' + item.Description + '</td>';
            items += ' <td>' + item.Count + '</td></tr>';
        });


        let bomTable =
            '             <table border="1"' +
            '                style="border-collapse: collapse;text-align: center;width: max-content;">' +
            '                <tbody>' + items +
            '                </tbody>' +
            '                <tfoot>' +
            '                    <tr>' +
            '                        <td style="font-weight: bold;width: 15px;padding: 5px;">QTY<br>-X</td>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">PART NO.</td>' +
            '                        <td style="font-weight: bold;width: 15px;padding: 5px;">REV.</td>' +
            '                        <td style="font-weight: bold;width: 150px;padding: 5px;">DESCRIPTION</td>' +
            '                        <td style="font-weight: bold;width: 15px;padding: 5px;">ITEM<br>NO.</td>' +
            '                    </tr>' +
            '                </tfoot>' +
            '            </table>';


        HomeComponent.config.pd_bom = await this.convertToCanvas(bomTable);
    }
      



    async generate_pd_lengths()
    {

        let cdt;
        let res;
        let length_head_html = "";
        let length_body_html = "";

        for (let l of Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking')) {
            length_head_html += '<td style="font-weight: bold;width: 100px;padding: 5px;">LENGTH ' + l.lead + ' (mm)</td>';
        }


        for (let l of Step4Component.myDiagram.model.linkDataArray.filter(item => item.category === 'linking' || item.category === 'Dimensioning' || item.category == 'Dimensioning_2')) {
            let data = new LeadsModel()
            if (l.type != 'jacketslit') {
                if (l.type === 'positionlink') {
                    length_body_html += ' <td>' + l.length + ' ±' + l.tlc + '</td>';
                    var pd_length = l.length + l.tlc
                } else {


                    let from = Step4Component.myDiagram.findNodeForKey(l.from);
                    let to = Step4Component.myDiagram.findNodeForKey(l.to);

                    if (from.data.DATA.config) {
                        from = from.data.DATA.config;
                    } else {
                        from = from.data;
                    }

                    if (to.data.DATA.config) {
                        to = to.data.DATA.config;
                    } else {
                        to = to.data;
                    }

                    if (l.length >= 1000) {
                        cdt = 30;
                        res = parseFloat(l.length) + (parseFloat(from.length) + parseFloat(to.length)) + cdt / 2;
                        length_body_html += ' <td>' + res + ' ±14' + '</td>';
                    } else {
                        cdt = 20;
                        res = parseFloat(l.length) + (parseFloat(from.length) + parseFloat(to.length)) + cdt / 2;
                        length_body_html += ' <td>' + res + ' ±9' + '</td>';
                    }
                }
                
            }
        }



        let lengthTable =
            '<span style="font-weight: bold;">LENGTH SCHEDULE:</span>' +
            '             <table border="1"' +
            '                style="border-collapse: collapse;text-align: center;width: max-content;">' +
            '                <thead>'+
            '                    <tr>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">TE PN</td>' +
            '                        <td style="font-weight: bold;width: 100px;padding: 5px;">REV</td>'
            + length_head_html +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>'+
            '                    <tr>'+
            '                        <td>' + HomeComponent.config.partNumber + '</td>'+
            '                        <td>A</td>'
            + length_body_html +
            '                    </tr>' +
            '                </tbody>' +
            '            </table>';

        HomeComponent.config.pd_lengths = await this.convertToCanvas(lengthTable);
    }
    
    async generate_pd_notes()
    {

        const self = this;
        let notes = "";
        let count = 0;
        this.productionNotes.forEach((note, index) => {
            count += 1;
            notes += ' <tr>';
            notes += ' <td style="text-align: center;vertical-align: super;" >' + count + '</td>';
            notes += ' <td>' + note.description;
            notes += '</td></tr>';
        });
        count += 1;
        notes += ' <tr>';
        notes += ' <td style="text-align: center;vertical-align: super;" >' + count + '</td>';
        notes += ' <td>' + self.harnessMaker.manufacturing_code;
        notes += '</td></tr>';
        count += 1;
        notes += '<tr> <td style="text-align: center;vertical-align: super;" >' + count + '</td> <td></td></tr>';
        this.componentsNotes.forEach((note) => {
            notes += ' <tr><td style="float:right" ></td> <td>' + note.description +'</td></tr>';
        });

        let notesTable =
            '             <table style="width: max-content;white-space: pre-line;">' +
            '                <thead>'+
            '                    <tr>' +
            '<td style="font-weight: bold;">NOTES</td>' +
            '<td></td>' +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>'
            + notes +
            '                </tbody>' +
            '            </table>';


        HomeComponent.config.pd_notes = await this.convertToCanvas(notesTable);
    }
    async generate_pd_packaging_old()
    {

        const self = this;
        let packaging = "";
        this.packaging.forEach((note) => {
            packaging += '<tr><td></td></tr>';
        });

        let packagingTable =
            '             <table style="width: max-content;white-space: pre-line;">' +
            '                <thead>'+
            '                    <tr>' +
            '<td style="font-weight: bold;">NOTES</td>' +
            '<td></td>' +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>'
            + packaging +
            '                </tbody>' +
            '            </table>';

        HomeComponent.config.pd_notes = await this.convertToCanvas(packagingTable);
    }

    async generate_pd_packaging()
    {

        let packagingBody = "";

        this.packaging.filter(a => a.layer != "Remark")
            .forEach((item) =>
        {

            let pn = item.pn;
            let qte = item.qte;
            if(pn == "DRAWING PN")
            {
                pn = HomeComponent.config.partNumber;
                qte = "-";
            }
            packagingBody +=
                '<tr>' +
                '<td style="text-align: left;">' + item.layer + ':</td>' +
                '<td>' + pn + '</td>' +
                '<td>' + qte + '</td>' +
                '</tr>'
        });

        this.packaging.filter(a => a.layer == "Remark")
            .forEach((item) =>
            {

                let pn = item.pn;
                packagingBody +=
                    '<tr>' +
                    '<td style="text-align: left;">' + item.layer + ':</td>' +
                    '<td  colspan="2">' + pn + '</td>' +
                    '</tr>'
            });

        let packagingTable =
            '<span style="font-weight: bold;">PACKAGING:</span>' +
            '             <table border="1"' +
            '                style="border-collapse: collapse;text-align: center;width: max-content; white-space: pre-line;">' +
            '                <thead>'+
            '                    <tr>' +
            '                        <td style="text-align: left;font-weight: bold;width: max-content;;padding: 5px;">Layer  Structure</td>' +
            '                        <td style="text-align: center;font-weight: bold;width: max-content;;padding: 5px;">PN</td>' +
            '                        <td style="text-align: center;font-weight: bold;width: max-content;;padding: 5px;">Quantity ' +
            '-X</td>' +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>'
            + packagingBody +
            '                </tbody>' +
            '            </table>';

        HomeComponent.config.packaging = await this.convertToCanvas(packagingTable);
    }

    sheet_data_1 = [

          {
      
      },
    
    ];
      sheet_data_2 = [
       
        {
            "QTY": '',
            "PART No ": '',
            "REV ":'',
            "DESCRIPTION" :'',
            "ITEM No ": '',
          
          },
           
      ];
    
        
      sheet_data3 = [
        
     
             {
                             
              },
      
       
      ];
    
      sheet_data4 = [
        {
            "QTY": '',
            "PART No ": '',
            "DESCRIPTION" :'',
            "ITEM No ": '',
          
          }, 
        // {
        //   "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
        //   "U/M ": HomeComponent,
        //   "PART NO ":  HomeComponent.config.BOM.length,
        //   "REMARKS ": HomeComponent.config.customerPN,
        //   "DESCRIPTION" : HomeComponent.config.BOM.length,
        //   "ITEM ": 1,
        //   "Level ": " ",
        
        // },            
      ];
      
        sheet_data5 = [
        {
          " ": "",
        
        },
       
      ];
      sheet_data6 = [
       
        {
          },
      ];
      sheet_data7 = [
        {
         
        },  //HomeComponent.config.cd_bom != null,
      ];
     
      sheet_data8 = [
        {
         
        },  
      ];
     
  
      exportToExcel() {
        //Create a workbook with a worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Cable Harness Configuration');
        let worksheet_2 = workbook.addWorksheet('P-DRAWING BOM');
        let worksheet3 = workbook.addWorksheet('MODEL BOM');
        let worksheet4 = workbook.addWorksheet('C-DRAWING BOM');
        let worksheet5 = workbook.addWorksheet('Length Schedule');
        let worksheet6 = workbook.addWorksheet('Co-ordinates_Points');
        let worksheet7 = workbook.addWorksheet('Pin Out Chart General');
        let worksheet8 = workbook.addWorksheet('General Lists');
       
        // this.http.get({responseType: 'blob' as 'json'}).subscribe((response:any)=>{
        //     const reader: FileReader = new FileReader();
        //     reader.onload = (e: any) => {
        //         const bstr: string = e.target.result;
        //         const wb: XLSX.WorkBook = XLSX.read(bstr, {
        //             type: 'binary',
        //             bookVBA :true,
        //             cellStyles:true,
        //             cellHTML:true });
        //         XLSX.writeFile(wb, this.fileName,{
        //             type: 'binary',
        //             bookVBA:true,
        //             bookType: 'xlsm',
        //             cellStyles:true,
        //             bookSST:true,
        //         });
        //     };
        //     reader.readAsBinaryString(response);
        // });
    
        //Add Row and formatting
        worksheet.mergeCells('C3', 'F3');
        worksheet.getCell('C3').value = 'Cable Harness Configuration';
        worksheet.mergeCells('C5', 'D5');
        worksheet.getCell('C5', 'D5').value = 'General Information ';       
        //worksheet.mergeCells('C6');
        worksheet.getCell('C6').value = 'Assembly Name/PN:';
        worksheet.getCell('D6').value = HomeComponent.config.partNumber,
       // worksheet.mergeCells('C7');
        worksheet.getCell('C7').value = 'Customer P/N:';
        
        worksheet.getCell('D7').value = HomeComponent.config.customerPN,
        //worksheet.mergeCells('C8');
        worksheet.getCell('C8').value = 'Customer Code:';
        worksheet.getCell('D8').value = HomeComponent.config.oemname,
        worksheet.mergeCells('C10', 'D10');
        worksheet.getCell('C10', 'D10').value = 'Drawing Information';
        worksheet.getCell('C11').value = 'Drawing Size:';
        worksheet.getCell('D11').value = 'A1',
        worksheet.getCell('C12').value = 'Coil Diameter (mm):';
        worksheet.getCell('D12').value = 'Not Applicable';
        worksheet.getCell('C13').value = 'Packing Note:';
        worksheet.getCell('D13').value = 'Included';
        worksheet.getCell('C13').value = 'Packing Note:';
        worksheet.mergeCells('C14', 'D14');
        worksheet.getCell('C14').value = 'Drawing : Title Block Information';
     
        worksheet.getCell('C15').value = 'Drawing Title: ';
        //worksheet.getCell('D15').value = HomeComponent.config.partNumber;
       
        // worksheet.getCell('C17').value = 'Drawing : Title Block Information';
        // worksheet.getCell('C18').value = 'Drawing Title: ';
       // worksheet.getCell('D18').value = HomeComponent.config.partNumber,
        worksheet.getCell('C16').value = 'Drawn By: ';
       // worksheet.getCell('D19').value = HomeComponent.config.partNumber,
        worksheet.getCell('C17').value = 'Checked By:  ';
        //worksheet.getCell('D20').value = HomeComponent.config.partNumber,
        worksheet.getCell('C18').value = 'Approved By: ';
        //worksheet.getCell('D21').value = HomeComponent.config.partNumber,
        worksheet.getCell('C19').value = 'Drawn Date (dd/mm/yy) :';
       // worksheet.getCell('D22').value = HomeComponent.length,
        worksheet.getCell('C20').value = 'Checked Date (dd/mm/yy) :  ';
        //worksheet.getCell('D23').value = HomeComponent.config.cablename,
        worksheet.getCell('C21').value = 'Approved Date (dd/mm/yy) :  ';
        //worksheet.getCell('D24').value = HomeComponent.config.cd_lengths, 
        worksheet.mergeCells('C23','D23');       
        worksheet.getCell('C23').value = 'Cable Harness Configuration';
        worksheet.getCell('C24').value = 'Cable Harness Type:';
        worksheet.getCell('D24').value = 'Single to Single';
        worksheet.getCell('C25').value = 'Multiple Pos. Connector Side:';
        worksheet.getCell('C26').value = 'Number of Position:';
        worksheet.getCell('C27').value = 'Harness Length D1(mm):';        
        //worksheet.getCell('D29').value = HomeComponent.config.projectNumber, 
        worksheet.getCell('C28').value = 'Harness Length D2(mm):';
        worksheet.getCell('C29').value = 'Harness Length D3(mm):';
        worksheet.getCell('C30').value = 'Harness Length D4(mm):';  
        worksheet.mergeCells('C32','D32');            
        worksheet.getCell('C32').value = 'Wire Specification';        
        worksheet.getCell('C33').value = 'Wire Twist Type:';
        worksheet.getCell('C34').value = 'Wire Twist Pitch(mm):';
        worksheet.getCell('C35').value = 'Wire Twist Length(mm):'; 
        worksheet.getCell('C36').value = 'Wire Diameter W1(mm):';
        worksheet.getCell('D36').value = '3,3';
        worksheet.getCell('C37').value = 'Wire Diameter W2(mm):';
        worksheet.getCell('D37').value = '3,3';
        worksheet.getCell('C38').value = 'Wire Diameter W3(mm):'; 
        worksheet.getCell('D38').value = '3,3';  
        worksheet.getCell('C39').value = 'Wire Diameter W4(mm):'; 
        //worksheet.getCell('D39').value = '80,00';     
        worksheet.mergeCells('C41','D41');     
        worksheet.getCell('C41').value = 'Connector Rotation (degrees)';   
        worksheet.getCell('C42').value = 'Connector-1 Rotation:'; 
       // worksheet.getCell('D42').value = '180';
        worksheet.getCell('C43').value = 'Connector-2 Rotation:';
        //worksheet.getCell('D43').value = '0'; 
        worksheet.getCell('C44').value = 'Connector-3 Rotation:';
        //worksheet.getCell('D44').value = '0';
        worksheet.getCell('C45').value = 'Connector-4 Rotation:';   
       // worksheet.getCell('D45').value = '0';
        worksheet.getCell('C46').value = 'Connector-5 Rotation:'; 
        //worksheet.getCell('D46').value = '0'; 
        worksheet.mergeCells('F5','G5');   
        worksheet.getCell('F5').value = 'Tape Option';   
        worksheet.getCell('F6').value = 'Add Tape:';
        worksheet.getCell('G6').value = 'No';
        worksheet.getCell('F7').value = 'Tape Starting Distance (mm):';
        worksheet.getCell('F8').value = 'Tape Pitch (mm):';
        worksheet.mergeCells('F10','G10');   
        worksheet.getCell('F10').value = 'Multiple connector cavity pitch';
        worksheet.getCell('F11').value = 'Connector-1 cavity pitch (mm)';
        //worksheet.getCell('G11').value = '50';
        //worksheet.getCell('G12').value = '60';
        worksheet.getCell('F12').value = 'Connector-2 cavity pitch (mm)';
        worksheet.mergeCells('I5','J5');           
        worksheet.getCell('I5').value = 'Pin Out Chart';
        worksheet.getCell('I6').value = 'Left';
        worksheet.getCell('J6').value = 'Right';
        worksheet.getCell('N5').value = 'Drawing size';
        worksheet.mergeCells('O5','R5');   
        worksheet.getCell('O5').value = 'Data Input Prompt (Example : Drawing Size)';
        worksheet.getCell('N6').value = 'A1';
        worksheet.mergeCells('O6','R6');
        worksheet.getCell('O6').value = 'Pull Down List (Example : Single to Single)';
        worksheet.getCell('N7').value = '300';
        worksheet.mergeCells('O7','R7');
        worksheet.getCell('O7').value = 'Entered Data (Example : Harness Length)';
        worksheet.getCell('N8').value = 'abc';
        worksheet.mergeCells('O8','R8');
        worksheet.getCell('O8').value = 'Not applicable Data';
        worksheet.mergeCells('O9','R9');
        worksheet.getCell('O9', 'R9').value = 'Non Default Data';
        //worksheet.mergeCells('O11','R11');
        worksheet.mergeCells('N11','R11');
        worksheet.getCell('N11', 'R11').value = 'Color Code';
        worksheet.getCell('F26').value = 'Number Of Positions';
        worksheet.mergeCells('F28','G28');
        
        worksheet.getCell('F28').value = 'Connector Layout/Lengths';
        worksheet.getCell('F29').value = 'Connector';
        worksheet.getCell('G29').value = 'Config';
        worksheet.getCell('I26').value = 'Label Option';
        worksheet.getCell('J26').value = 'No';
        worksheet.mergeCells('I28','J28');
        worksheet.getCell('I28','J28').value = 'Pinning Table';
        
        worksheet.getCell('I29').value = 'Connector';
        worksheet.getCell('J29').value = 'Connector';

        worksheet.getCell('F37').value = 'Number Of Connectors';
        //worksheet.getCell('G37').value = '1';
        worksheet.mergeCells('F39','G39');
        worksheet.getCell('F39','G39').value = 'Configuration Note';
        worksheet.getCell('F40').value = 'Connector';
        worksheet.getCell('F41').value = 'Connector-1';
        worksheet.getCell('F42').value = 'Connector-2';
        worksheet.getCell('G40').value = 'Config';
        worksheet.getCell('I30').value = 'Connector-1';
        worksheet.getCell('J30').value = 'Connector-2';
        worksheet.getCell('D27').value = '1500';
        //worksheet_2.getCell('J2').value= worksheet_2.getCell('J2').value;
        worksheet5.getCell('F3').value = '1500';
        worksheet5.getCell('L3').value = '1520';
        // worksheet.getCell('I7').value = 'Position 1';
        // worksheet.getCell('I8').value = 'Position 2';
        // worksheet.getCell('I9').value = 'Position 3';
        // worksheet.getCell('I10').value = 'Position 4';
        // worksheet.getCell('J7').value = 'Position 1';
        // worksheet.getCell('J8').value = 'Position 2';
        // worksheet.getCell('J9').value = 'Position 3';
        // worksheet.getCell('J10').value = 'Position 4';
        worksheet.getCell('G37').value = HomeComponent.config.countSides;
        worksheet3.getCell('A1').value = 'Remarks';
        worksheet3.getCell('B1').value = 'PART NO';
        worksheet3.getCell('C1').value = 'Position';  
        
       // worksheet5.getCell('F3').value = length; 
        //worksheet3.getCell('D2').value = HomeComponent.config.right;
      
        // if (worksheet.getCell('G37').value = HomeComponent.config.countSides = 2) {
        //     worksheet3.getCell('C2').dataValidation = {
        //         type: 'list',
        //         allowBlank: true,
        //         formulae: ['"Connector_1,Connector_2,Blank"']
        //         }; 
        // } else (worksheet.getCell('G37').value = HomeComponent.config.countSides != 2);{
        //     worksheet3.getCell('C2').value = 'ABC'; 
        // }

       


       
        // if (condition1)
        // {
        //     print1
        // }
        // else if (condition2)
        // {
        //     print2
        // }
        // else
        // {
        //     print3
        // }

        // if (worksheet.getCell('G37').value = HomeComponent.config.countSides = 2) {
        //     if ((worksheet.getCell('G37').value = HomeComponent.config.countSides = 2)) {
        //         worksheet3.getCell('C2').dataValidation = {
        //                     type: 'list',
        //                     allowBlank: true,
        //                     formulae: ['"Connector_1,Connector_2,Blank"']
        //                     }; 
        //     }} 
        //     else (worksheet.getCell('G37').value = HomeComponent.config.countSides = 4); {
               
        //             worksheet3.getCell('C2').dataValidation = {
        //                         type: 'list',
        //                         allowBlank: true,
        //                         formulae: ['"Connector_1,Connector_2,Blank"']
                                
        //         };} 
                // else {(worksheet.getCell('G37').value = HomeComponent.config.countSides = 4) {
                //     (worksheet.getCell('G37').value = HomeComponent.config.countSides = 4); {
                //         worksheet3.getCell('C2').dataValidation = {
                //                     type: 'list',
                //                     allowBlank: true,
                //                     formulae: ['"Connector_4,Blank"']
                //                     };  }
                                    
        

        // worksheet3.getCell('C2').dataValidation = {
        //     type: 'list',
        //     allowBlank: true,
        //     formulae: ['"One,Two,Three,Four"']
        //     };
     
        
        
        worksheet.getCell('D8').dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"DRX,SEBN,LEON,KROS,FUJI,Aptiv,Ford,Lear,FICO,COFA"']
                };
                worksheet.getCell('D12').dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: ['"Applicable,Not Applicable"']
                    };
        worksheet.getCell('D11').dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: ['"A0,A1,A2,A3"']
                    };

        worksheet.getCell('D13').dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: ['"Not Included,Included"']
                        };

        worksheet.getCell('D24').dataValidation = {
                            type: 'list',
                            allowBlank: true,
                            formulae: ['"Single to Single,Multiple to Single,Multiple to Multiple,General"']
                            };
        worksheet.getCell('D25').dataValidation = {
                                type: 'list',
                                allowBlank: true,
                                formulae: ['"Left,Right"']
                                }; 
        worksheet.getCell('D26').dataValidation = {
                                    type: 'list',
                                    allowBlank: true,
                                    formulae: ['"1,2,3,4"']
                                    }; 
        worksheet.getCell('D33').dataValidation = {
                                        type: 'list',
                                        allowBlank: true,
                                        formulae: ['"Non-Twisted,Twisted"']
                                        }; 
        worksheet.getCell('N6').dataValidation = {
                                            type: 'list',
                                            allowBlank: true,
                                            formulae: ['"A0,A1,A2,A3,A4"']
                                            }; 
        worksheet.getCell('I6').dataValidation = {
                                                type: 'list',
                                                allowBlank: true,
                                                formulae: ['"Left,Right"']
                                                }; 
        worksheet.getCell('J6').dataValidation = {
                                                    type: 'list',
                                                    allowBlank: true,
                                                    formulae: ['"Left,Right"']
                                                    }; 
        //  worksheet.getCell('G6').dataValidation = {
        //                                                 type: 'list',
        //                                                 allowBlank: true,
        //                                                 formulae: ['"Yes,No"']
        //                                                 }; 
        // worksheet.getCell('D8').dataValidation = {
        //                                                     type: 'list',
        //                                                     allowBlank: true,
        //                                                     formulae: ['"Applicable,Not Applicable"']
        //                                                     }; 
         worksheet.getCell('G6').dataValidation = {
                                                                type: 'list',
                                                                allowBlank: true,
                                                                formulae: ['"Yes,No"']
                                                                };  
        worksheet.getCell('G26').dataValidation = {
                                                                type: 'list',
                                                                allowBlank: true,
                                                                formulae: ['"1,2,3,4,5"']
                                                                }; 
        worksheet.getCell('J26').dataValidation = {
                                                                    type: 'list',
                                                                    allowBlank: true,
                                                                    formulae: ['"Yes,No"']
                                                                    }; 
        worksheet.getCell('I7').dataValidation = {
                                                                        type: 'list',
                                                                        allowBlank: true,
                                                                        formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                        }; 
        worksheet.getCell('I8').dataValidation = {
                                                                            type: 'list',
                                                                            allowBlank: true,
                                                                            formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                            };  
        worksheet.getCell('I9').dataValidation = {
                                                                                type: 'list',
                                                                                allowBlank: true,
                                                                                formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                                }; 
         worksheet.getCell('I10').dataValidation = {
                                                                                    type: 'list',
                                                                                    allowBlank: true,
                                                                                    formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                                    }; 
        worksheet.getCell('J7').dataValidation = {
                                                                                        type: 'list',
                                                                                        allowBlank: true,
                                                                                        formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                                        }; 
        worksheet.getCell('J8').dataValidation = {
                                                                                            type: 'list',
                                                                                            allowBlank: true,
                                                                                            formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                                            };  
        worksheet.getCell('J9').dataValidation = {
                                                                                                type: 'list',
                                                                                                allowBlank: true,
                                                                                                formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                                                }; 
        worksheet.getCell('J10').dataValidation = {
                                                                                                    type: 'list',
                                                                                                    allowBlank: true,
                                                                                                    formulae: ['"Position-1,Position-2,Position-3,Position-4"']
                                                                                                    }; 


       // worksheet3.getCell('B2').value = worksheet.getCell('D30').value;
        // worksheet3.getCell('C2').value = worksheet.getCell('D30').value;
       
        // worksheet3.getCell('C1').value = 'Position 1';
        // worksheet3.getCell('C2').value = worksheet_2.getCell('C2').value;
   
        // worksheet_2.mergeCells('C1', 'F1');
        // worksheet_2.getCell('C1').value = 'P-DRAWING BOM';
        // worksheet3.mergeCells('C1', 'F1');
        // worksheet3.getCell('C1').value = 'MODEL BOM';
        // worksheet4.mergeCells('C1', 'F1');
        // worksheet4.getCell('C1').value = 'C-DRAWING BOM';
        //worksheet5.mergeCells('C1', 'F1');
        //worksheet5.getCell('C1').value = 'Co-ordinates_Points';
        // worksheet.getCell('A1').dataValidation = {
        //     type: 'list',
        //     allowBlank: true,
        //     formulae: ['"One,Two,Three,Four"']
        //     };

        worksheet6.getCell('B1').value = 'Position';
        worksheet6.getCell('A2').value = '1';
        worksheet6.getCell('A3').dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"One,Two,Three,Four"']
            };
            worksheet6.getCell('C1').value = 'X';
            worksheet6.getCell('D1').value = 'Y';
            worksheet6.getCell('E1').value = 'Z';
            worksheet7.getCell('A1').value = 'Sr.No.';
            worksheet7.getCell('A2').value = '1';
            worksheet7.getCell('B1').value = 'From';
            worksheet7.getCell('C1').value = 'To';

            worksheet5.getCell('B2').value = 'Number Of Length';
            worksheet5.getCell('B3').dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"1,2,3,4,5"']
                };
                worksheet5.getCell('B3').value = '1';
            worksheet5.mergeCells('D1','H1');   
            worksheet5.getCell('D1').value = 'Customer Drawing Length Schedule Table';
            worksheet5.getCell('D2').value = 'TE Part No';
            worksheet5.getCell('D3').value = HomeComponent.config.partNumber;
            worksheet5.getCell('G3').value = HomeComponent.config.customerPN;
            worksheet5.getCell('E2').value = 'Rev';
            worksheet5.getCell('E3').value = 'A';
            worksheet5.getCell('F2').value = ' Length L1';
            worksheet5.getCell('F3').value = ' 1500';
            //worksheet5.getCell('G2').value = ' Length L2';
            worksheet5.getCell('G2').value = ' Customer Part No';
            worksheet5.mergeCells('J1','N1'); 
            worksheet5.getCell('J1').value = 'Production Drawing Length Schedule Table';
            worksheet5.getCell('J2').value = 'TE Part No';            
            worksheet5.getCell('J3').value = HomeComponent.config.partNumber;
            worksheet5.getCell('M3').value = HomeComponent.config.customerPN;
            worksheet5.getCell('K2').value = 'Rev';
            worksheet5.getCell('K3').value = 'A';
            worksheet5.getCell('L2').value = ' Length L1';
            worksheet5.getCell('L3').value = ' 1520';
           // worksheet5.getCell('M2').value = ' Length L2';  
            worksheet5.getCell('M2').value = ' Customer Part No';
            worksheet8.getCell('A1').value = ' Type of Harness';
            worksheet8.getCell('A2').value = ' Single to Single';  
            worksheet8.getCell('A3').value = ' Multiple to Single';
            worksheet8.getCell('A4').value = ' Multiple to Multiple';
            worksheet8.getCell('A5').value = ' General';
            worksheet8.getCell('A2').value = ' Single to Single';
            worksheet8.getCell('C1').value = ' Harness Side';
            worksheet8.getCell('C2').value = ' Left';
            worksheet8.getCell('C3').value = ' Right';
            worksheet8.getCell('E1').value = ' Number of Position';
            worksheet8.getCell('E2').value = ' 1';
            worksheet8.getCell('E3').value = ' 2';
            worksheet8.getCell('E4').value = ' 3';
            worksheet8.getCell('E5').value = ' 4';
            worksheet8.getCell('G1').value = ' Yes and No';
            worksheet8.getCell('G2').value = ' Yes';
            worksheet8.getCell('G3').value = ' No';
            worksheet8.getCell('I1').value = ' Drawing Option';
            worksheet8.getCell('I2').value = ' Fully Populated';
            worksheet8.getCell('I3').value = ' Blank';
            worksheet8.getCell('K1').value = ' Customer Code';
            worksheet8.getCell('K2').value = ' ATL';
            worksheet8.getCell('K3').value = ' BOSC';
            worksheet8.getCell('K4').value = ' CTA';
            worksheet8.getCell('K5').value = ' DAN';
            worksheet8.getCell('K6').value = ' FCA';
            worksheet8.getCell('K7').value = ' FJKR';
            worksheet8.getCell('K8').value = ' FMC';
            worksheet8.getCell('K9').value = ' GHSP';
            worksheet8.getCell('K10').value = ' GMC';
            worksheet8.getCell('K11').value = ' HML';
            worksheet8.getCell('K12').value = ' HOND';
            worksheet8.getCell('K13').value = ' KSS';
            worksheet8.getCell('K14').value = ' LEAR';
            worksheet8.getCell('K15').value = ' TAK';
            worksheet8.getCell('K16').value = ' YNA';
            worksheet8.getCell('K17').value = ' LEON';
            worksheet8.getCell('M1').value = ' Drawing Size';
            worksheet8.getCell('M2').value = ' A0';
            worksheet8.getCell('M3').value = ' A1';
            worksheet8.getCell('M4').value = ' A2';
            worksheet8.getCell('O1').value = ' Drawing Notes';
            worksheet8.getCell('O2').value = ' Infotainment cable notes';
            worksheet8.getCell('O3').value = ' Squib Pigtail notes';
            worksheet8.getCell('Q1').value = ' Packing Note';
            worksheet8.getCell('Q2').value = 'Included';
            worksheet8.getCell('Q3').value = ' Not Included';
            worksheet8.getCell('S1').value = ' Wire Twist Type';
            worksheet8.getCell('S2').value = 'Non-Twisted';
            worksheet8.getCell('S3').value = ' Twisted';
            worksheet8.getCell('U1').value = ' Wire Route';
            worksheet8.getCell('U2').value = 'Position-1';
            worksheet8.getCell('U3').value = ' Position-2';
            worksheet8.getCell('U4').value = 'Position-3';
            worksheet8.getCell('U5').value = ' Position-4';
            worksheet8.getCell('W1').value = ' Table_Single_to_Single';
            worksheet8.getCell('W2').value = 'Connector_1';
            worksheet8.getCell('W3').value = ' Connector_2';
            worksheet8.getCell('W4').value = 'Blank';
            worksheet8.getCell('X1').value = ' Table_Multiple_to_Single_POS_2_Left';
            worksheet8.getCell('X2').value = 'Con_1_Pos_1';
            worksheet8.getCell('X3').value = 'Con_1_Pos_2';
            worksheet8.getCell('X4').value = 'Con_2_Pos_1';
            worksheet8.getCell('X5').value = 'Con_3_Pos_2';
            worksheet8.getCell('X6').value = 'Blank';
            worksheet8.getCell('Y1').value = 'Table_Multiple_to_Single_POS_2_Right';
            worksheet8.getCell('Y2').value = 'Con_1_Pos_1';
            worksheet8.getCell('Y3').value = 'Con_2_Pos_2';
            worksheet8.getCell('Y4').value = 'Con_3_Pos_1';
            worksheet8.getCell('Y5').value = 'Con_3_Pos_2';
            worksheet8.getCell('Y6').value = 'Blank';
            worksheet8.getCell('Z1').value = 'Table_Multiple_to_Single_POS_3_Left';
            worksheet8.getCell('Z2').value = 'Con_1_Pos_1';
            worksheet8.getCell('Z3').value = 'Con_1_Pos_2';
            worksheet8.getCell('Z4').value = 'Con_1_Pos_3';
            worksheet8.getCell('Z5').value = 'Con_2_Pos_1';
            worksheet8.getCell('Z6').value = 'Con_3_Pos_2';
            worksheet8.getCell('Z7').value = 'Con_4_Pos_3';
            worksheet8.getCell('Z8').value = 'Blank';
            worksheet8.getCell('AA1').value = 'Table_Multiple_to_Single_POS_3_Right';
            worksheet8.getCell('AA2').value = 'Con_1_Pos_1';
            worksheet8.getCell('AA3').value = 'Con_2_Pos_2';
            worksheet8.getCell('AA4').value = 'Con_3_Pos_3';
            worksheet8.getCell('AA5').value = 'Con_4_Pos_1';
            worksheet8.getCell('AA6').value = 'Con_4_Pos_2';
            worksheet8.getCell('AA7').value = 'Con_4_Pos_3';
            worksheet8.getCell('AA8').value = 'Blank';
            worksheet8.getCell('AB1').value = 'Table_Multiple_to_Single_POS_4_Left';
            worksheet8.getCell('AB2').value = 'Con_1_Pos_1';
            worksheet8.getCell('AB3').value = 'Con_1_Pos_2';
            worksheet8.getCell('AB4').value = 'Con_1_Pos_3';
            worksheet8.getCell('AB5').value = 'Con_1_Pos_4';
            worksheet8.getCell('AB6').value = 'Con_2_Pos_1';
            worksheet8.getCell('AB7').value = 'Con_3_Pos_2';
            worksheet8.getCell('AB8').value = 'Con_4_Pos_3';
            worksheet8.getCell('AB9').value = 'Con_5_Pos_4';
            worksheet8.getCell('AB10').value = 'Blank';
            worksheet8.getCell('AC1').value = 'Table_Multiple_to_Single_POS_4_Right';
            worksheet8.getCell('AC2').value = 'Con_1_Pos_1';
            worksheet8.getCell('AC3').value = 'Con_2_Pos_2';
            worksheet8.getCell('AC4').value = 'Con_3_Pos_3';
            worksheet8.getCell('AC5').value = 'Con_4_Pos_4';
            worksheet8.getCell('AC6').value = 'Con_5_Pos_1';
            worksheet8.getCell('AC7').value = 'Con_5_Pos_2';
            worksheet8.getCell('AC8').value = 'Con_5_Pos_3';
            worksheet8.getCell('AC9').value = 'Con_5_Pos_4';
            worksheet8.getCell('AC10').value = 'Blank';
            worksheet8.getCell('AD1').value = 'Table_Multiple_to_Multiple_POS_2';
            worksheet8.getCell('AD2').value = 'Con_1_Pos_1';
            worksheet8.getCell('AD3').value = 'Con_1_Pos_2';
            worksheet8.getCell('AD4').value = 'Con_2_Pos_1';
            worksheet8.getCell('AD5').value = 'Con_2_Pos_2';
            worksheet8.getCell('AD6').value = 'Blank';
            worksheet8.getCell('AE1').value = 'Table_Multiple_to_Multiple_POS_3';
            worksheet8.getCell('AE2').value = 'Con_1_Pos_1';
            worksheet8.getCell('AE3').value = 'Con_1_Pos_2';
            worksheet8.getCell('AE4').value = 'Con_1_Pos_3';
            worksheet8.getCell('AE5').value = 'Con_2_Pos_1';
            worksheet8.getCell('AE6').value = 'Con_2_Pos_2';
            worksheet8.getCell('AE7').value = 'Con_2_Pos_2';
            worksheet8.getCell('AE8').value = 'Blank';
            worksheet8.getCell('AF1').value = 'Table_Multiple_to_Multiple_POS_4';
            worksheet8.getCell('AF2').value = 'Con_1_Pos_1';
            worksheet8.getCell('AF3').value = 'Con_1_Pos_2';
            worksheet8.getCell('AF4').value = 'Con_1_Pos_3';
            worksheet8.getCell('AF5').value = 'Con_1_Pos_4';
            worksheet8.getCell('AF6').value = 'Con_2_Pos_1';
            worksheet8.getCell('AF7').value = 'Con_2_Pos_2';
            worksheet8.getCell('AF8').value = 'Con_2_Pos_3';
            worksheet8.getCell('AF9').value = 'Con_2_Pos_4';
            worksheet8.getCell('AF10').value = 'Blank';
            worksheet8.getCell('AH1').value = 'Table_General';
            worksheet8.getCell('AH2').value = 'Blank';
            
        // worksheet6.mergeCells('C1', 'F1');
        // worksheet6.getCell('C1').value = 'Pin Out Chart General';
        // worksheet7.mergeCells('C1', 'F1');
        // worksheet7.getCell('C1').value = 'General Lists';
      
       
     
        // Add Header Rows
        let Heading = [['ID', 'Name', 'Status', 'actions']];
    
        worksheet.addRow(Object.keys(this.sheet_data_1[0]));
        worksheet_2.addRow(Object.keys(this.sheet_data_2[0]));    
        worksheet4.addRow(Object.keys(this.sheet_data4[0]));   
        worksheet5.addRow(Object.keys(this.sheet_data5[0])); 
        worksheet6.addRow(Object.keys(this.sheet_data6[0])); 
        worksheet7.addRow(Object.keys(this.sheet_data7[0])); 
        worksheet8.addRow(Object.keys(this.sheet_data8[0])); 
       
      
    
        //Had to create a new workbook and then add the header
        // const wb = XLSX.utils.book_new();
        // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
        // XLSX.utils.sheet_add_aoa(ws, Heading);
     
        // from editpyxl import Workbook

        // const wb = Workbook()
        // wb.open('C:/Test/original.xlsm')
        // ws = wb['TestSheet1']
        // print(wb.sheetnames)
        // ws.cell('A1').value = 'abc123'
        // wb.save('C:/Test/newfile.xlsm')
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
  
     

        this.sheet_data_1.forEach((d: any) => {
            worksheet.addRow(Object.values(d));
          });
      
          this.bom_cd.forEach((d: any) => {
            worksheet_2.addRow(Object.values(d));
          });
          
        // this.ringTongCables.forEach((d: any) => {
        //     worksheet_2.addRow(Object.values(d));
        //   });
      
          worksheet_2.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2bdfdf' },
          };
          worksheet.getRow(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2bdfdf' },
          };

          this.bom_p.forEach((d: any) => {
            worksheet4.addRow(Object.values(d));
          });
    
        console.log(worksheet4);
          worksheet4.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2bdfdf' },
          };

        
      
          this.bom_b.forEach((d: any) => {
            worksheet3.addRow(Object.values(d));
          });          
          console.log(worksheet3);
         
      
        worksheet5.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFA533' },
        };
        this.sheet_data6.forEach((d: any) => {
          worksheet6.addRow(Object.values(d));
        });
        this.sheet_data8.forEach((d: any) => {
            worksheet8.addRow(Object.values(d));
          });
        worksheet6.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFA533' },
        };
        worksheet7.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFA533' },
          };
        this.sheet_data7.forEach((d: any) => {
          worksheet7.addRow(Object.values(d));
        });
        // type: 'binary',
        //              bookVBA:true,
        //              bookType: 'xlsm',
        //             cellStyles:true,
        //             bookSST:true,
        
        //Generate & Save Excel File
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          
          fs.saveAs(blob, 'assets/sheet/TEDOUAA.xlsm');
        });
        

        // using Aspose.Cells;     
        // var workbook = new Workbook("input.xlsx");
        // workbook.Save("Output.xlsm");
      }
    //   workbook.xlsx.writeBuffer().then((data) => {
    //     let blob = new Blob([data], {
    //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //     });
    //     fs.saveAs(blob, 'assets/sheet/TEDOUAA.xlsm','Sheet1');
    //   });
    // }
//     workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//     let link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = "10052022 MATE AX.xlsx";
//     link.click();
//     URL.revokeObjectURL(link.href);
//     });
//   }
    // tools
    async convertToCanvas(source: any)
    {

        const self = this;
        const iframe = document.createElement('iframe');
        let res;

        iframe.style.display = "block";
        iframe.scrolling = "no";
        document.body.appendChild(iframe);
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        const html_string =
            "<!DOCTYPE html>" +
            "<html lang=\"en\">" +
            "<head>" +
            "    <meta charset=\"UTF-8\">" +
            "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
            "</head>" +
            "<style>" +
            "    body {margin: 0px; width: fit-content;}" +
            "    html {margin: 0px; width: fit-content;}" +
            "</style>"
            + source +
            "</body>" +
            "</html>";


        iframeDoc.body.innerHTML= html_string;
        self.resizeIframe(iframe);

        await html2canvas(iframeDoc.body,{scale: 1.1,logging: false, backgroundColor:"transparent"})
            .then(canvasHTML => {
                res = canvasHTML.toDataURL('image/png');
                document.body.removeChild(iframe);
            })
            .catch((error: string) => {
                console.log(error);
            });

        return res;
    }

    resizeIframe(obj)
    {
        let content = obj.contentDocument || obj.contentWindow.document;

        obj.style.height = 0;
        obj.style.height = content.body.scrollHeight + 'px';

        obj.style.width = 0;
        obj.style.width = content.body.scrollWidth + 'px';
    }
/*
    fillingLeads(){
        this.Cables.id_cable = HomeComponent.config.cableId ;
        this.Cables.lead = HomeComponent.config.cablename ;
        console.log("ID" + this.Cables.id_cable );
        console.log("l" + this.Cables.lead)
        console.log("p" + this.Cables.p_length)
        console.log("c" + this.Cables.c_length)
        console.log("l" + this.Cables.length)
    }
    
*/
    
    modernHorizontalPrevious()
    {
        HomeComponent.modernHorizontalPrevious("step3");
    }

    async modernHorizontalNext()
    {

        await this.generate_cd_bom();
        await this.generate_cd_lengths();
        await this.generate_cd_notes();

        await this.generate_pinning();

        await this.generate_pd_bom();
        await this.generate_pd_lengths();
        await this.generate_pd_notes();
        await this.generate_pd_packaging();
        //await this.fillingLeads();
        HomeComponent.dataSaving.te_pn = HomeComponent.config.partNumber
        HomeComponent.dataSaving.cpn = HomeComponent.config.customerPN
        HomeComponent.dataSaving.id_oem = HomeComponent.config.oemId
        HomeComponent.dataSaving.id_harnesmaker = HomeComponent.config.harnessMakerId
        HomeComponent.dataSaving.bom = HomeComponent.config.BOM
        HomeComponent.dataSaving.isObsolete = false

        HomeComponent.modernHorizontalNext();
    }
}
