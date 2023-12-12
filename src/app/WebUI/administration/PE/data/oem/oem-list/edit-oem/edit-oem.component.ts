import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {OemService} from '../../services/oem.service';
import {CoreSidebarService} from '../../../../../../../../@core/components/core-sidebar/core-sidebar.service';

import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";
import {Status} from "../../../../../../../Domain/Enums/Status";

@Component({
    selector: 'app-edit-oem',
    templateUrl: './edit-oem.component.html',
    styleUrls: ['./edit-oem.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditOemComponent implements OnInit {

    public oem: OemModel;


    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * Constructor
     *
     * @param {OemService} _oemService
     * @param {CoreSidebarService} _coreSidebarService
     */
    constructor(private _oemService: OemService, private _coreSidebarService: CoreSidebarService) {
        this.oem = new OemModel();
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------



    /**
     * Toggle Sidebar
     *
     * @param name
     */
    toggleSidebar(name) {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }


    /**
     * On init
     */
    ngOnInit(): void {
        this._oemService.onItemChange.subscribe(res => {
            this.oem = res;
        });
    }


    /**
     * onSubmit
     */
    async onSubmit(form) {
        if (form.valid) {
            await this._oemService.UpdateAsync(this.oem,this.oem.id);
            this.oem = new OemModel();
            this.toggleSidebar('edit-oem-sidebar');
        }
    }


    status(): typeof Status{
        return Status;
    }

}
