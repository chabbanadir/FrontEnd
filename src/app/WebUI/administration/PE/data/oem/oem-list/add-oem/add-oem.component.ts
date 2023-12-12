import {Component, OnInit} from '@angular/core';
import {CoreSidebarService} from '../../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {OemService} from '../../services/oem.service';
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";
import {Status} from "../../../../../../../Domain/Enums/Status";

@Component({
    selector: 'app-add-oem',
    templateUrl: './add-oem.component.html',
    styleUrls: ['./add-oem.component.scss']
})
export class AddOemComponent implements OnInit {

    oem: OemModel;

    /**
     * constructor
     * @param _coreSidebarService
     * @param _oemService
     */
    constructor(private _coreSidebarService: CoreSidebarService,
                private _oemService: OemService) {}

    /**
     * toggleSidebar
     * @param name
     */
    toggleSidebar(name): void {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    /**
     * submit
     * @param form
     */
    async submit(form) {
        if (form.valid)
        {
            await this._oemService.CreateAsync(this.oem);
            this.oem = new OemModel();
            this.toggleSidebar('add-oem-sidebar');
        }
    }

    /**
     * ngOnInit
     *
     */
    ngOnInit(): void {
        this.oem = new OemModel();
    }

    /**
     * status
     *
     */
    status(): typeof Status {
        return Status;
    }
}
