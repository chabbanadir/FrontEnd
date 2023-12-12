import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ComponentModel} from "../../../../../../../Domain/Entities/MasterData/Component.model";
import {ComponentService} from "../../services/component.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ConfigurationService} from "../../../configuration/services/configuration.service";
import {ConfigurationModel} from "../../../../../../../Domain/Entities/MasterData/Configuration.model";
import {CableService} from "../../../cable/services/cable.service";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {Orientation} from "../../../../../../../Domain/Enums/Orientation";
import {PictureModel} from "../../../../../../../Domain/Entities/MasterData/Picture.model";
import {environment} from "../../../../../../../../environments/environment";
import {PartModel} from "../../../../../../../Domain/Entities/MasterData/Part.model";
import {CablePartModel} from "../../../../../../../Domain/Entities/MasterData/CablePart.model";

@Component({
    selector: 'app-component-detail',
    templateUrl: './component-detail.component.html',
    styleUrls: ['./component-detail.component.scss']
})
export class ComponentDetailComponent implements OnInit, OnDestroy {

    formData: FormData = new FormData();

    preview: any;
    component: ComponentModel = new ComponentModel();

    configurations: ConfigurationModel[] = [];

    components: ComponentModel[] = [];
    parts: PartModel[] = [];

    cablesByOem: CableModel[] = [];
    cables: CableModel[] = [];


    private _unsubscribeAll: Subject<void>;

    constructor(public activeModal: NgbActiveModal,
                private _componentService: ComponentService,
                private sanitizer: DomSanitizer,
                private _configurationService: ConfigurationService,
                private _cableService: CableService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    // TODO solve component console error
    ngOnInit(): void {
        this._componentService.onItemChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            async (res: ComponentModel) => {
                this.component = res;
                if (this.component.oem) {
                    this.preview = 'assets/images/connectors/default-image.jpg';

                    if (this.component.config) {
                        this.preview = this.getCDN(this.component.config.picture);
                    }

                    if (this.component.picture) {
                        this.preview = this.getCDN(this.component.picture);
                    }
                    // this.preview = this.component.picture

                    this._configurationService.GetByOemIdAsync(this.component.oem.id).subscribe((response: ConfigurationModel[]) => {
                        this.configurations = response;
                    });
                    this._cableService.GetByOemIdAsync(this.component.oem.id).subscribe((response: CableModel[]) => {
                        this.cablesByOem = response;
                    });
                    this._componentService.GetByOemIdAsync(this.component.oem.id).subscribe((response: ComponentModel[]) => {
                        this.components = response.filter(item => item.id != this.component.id);
                    });
                    await this._componentService.GetPartsByIdAsync(this.component.id);
                    await this._componentService.GetCablesByIdAsync(this.component.id);

                }
            },
            (err) => console.error(err),
        );

        this._componentService.onPartsChange.subscribe(response => {
            this.parts = response;
        });

        this._componentService.onCablesChange.subscribe(response => {
            this.cables = response;
        });

    }


    /**
     * uploadImage
     *
     */
    uploadImage(event: any) {
        if (event.target.files && event.target.files[0]) {
            if (event.target.files[0].length === 0) {
                return;
            }
            const file = event.target.files[0];

            this.formData.append('file', file);

            this.preview = this.sanitizer.bypassSecurityTrustUrl(
                window.URL.createObjectURL(file)
            );

        }
    }


    /**
     * orientation
     *
     */
    orientation(): typeof Orientation {
        return Orientation;
    }

    /**
     * Submit
     *
     */
    async OnSubmit(form) {
        if (form.valid) {
            this.formData.append("id", this.component.id);
            this.formData.append("rev", this.component.rev);
            this.formData.append("description", this.component.description);
            this.formData.append("length", this.component.length.toString());
            this.formData.append("position", this.component.position.toString());
            this.formData.append("orientation", this.component.orientation.toString());
            if (this.component.category.hasConfig) {
                this.formData.append("fk_configId", this.component.fK_ConfigId);
            }
            await this._componentService.UpdateDetailsAsync(this.formData, this.component.id);
            this.component = new ComponentModel();
            this.formData = new FormData();
            this.preview = null;
            this.activeModal.close()
        }
    }

    /**
     * CDN environment
     *
     */
    getCDN(pic: PictureModel) {
        if (!pic) return 'assets/images/connectors/default-image.jpg';
        return environment.cdnUrl + pic.picPath;
    }

    /**
     * comparePartFn
     *
     */
    comparePartFn(component: any, part: any) {
        let exists = component && part ? component.id === part.fK_PartId : component.id === part.fK_PartId;
        if (exists) {
            component.fK_PartId = part.id;
            component.fK_ComponentId = part.fK_ComponentId;
        }
   //     console.log(component,part,exists);
        return exists;
    }

    /**
     * compareCableFn
     *
     */
    compareCableFn(cableByOem: any, cable: any) {
        let exists = cableByOem && cable ? cableByOem.id === cable.fK_CableId : cableByOem.id === cable.fK_CableId;
        if (exists) {
            cableByOem.fK_CableId = cable.id;
            cableByOem.fK_ComponentId = cable.fK_ComponentId;
        }
        return exists;
    }


    /**
     * SearchForPart
     *
     */
    SearchForPart(term: string, item: ComponentModel) {
        term = term.toLocaleLowerCase();

        let  searchByTEPN = item.tE_PN ? item.tE_PN.toLowerCase().indexOf(term) !== -1: false;
        let  searchByCPN = item.customer_PN ? item.customer_PN.toLowerCase().indexOf(term) !== -1: false;


        return searchByTEPN || searchByCPN || !term;


       // return searchByTEPN  || searchByCPN  ||  (item.tE_PN + " - " + item.customer_PN).toLocaleLowerCase().indexOf(term) > -1;
    }

    /**
     * AddPart
     *
     */
    async AddPart(part) {

        let item = new PartModel();

        item.fK_ComponentId = this.component.id;
        item.fK_PartId = part.id;

        await this._componentService.CreatePartAsync(item);
    }

    /**
     * DeletePart
     *
     */
    async DeletePart(part) {
        await this._componentService.DeletePartAsync(part);
    }

    /**
     * AddCable
     *
     */
    async AddCable(event) {

        let cable = new CablePartModel();

        cable.fK_ComponentId = this.component.id;
        cable.fK_CableId = event.id;

        await this._componentService.CreateCableAsync(cable);
    }

    /**
     * DeleteCable
     *
     */
    async DeleteCable(cable) {
        await this._componentService.DeleteCableAsync(cable);
    }
}
