import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {Subject} from 'rxjs';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {OemService} from '../services/oem.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OemModel} from "../../../../../../Domain/Entities/MasterData/Oem.model";
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";

@Component({
    selector: 'app-oem-list',
    templateUrl: './oem-list.component.html',
    styleUrls: ['./oem-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OemListComponent implements OnInit {

    // Private
    private _unsubscribeAll: Subject<any>;
    private tempData = [];

    // public
    public ems: OemModel[];
    public contentHeader: ContentHeader;
    public selected = [];    
    public basicSelectedOption: number = 8;
    public ColumnMode = ColumnMode;
    public expanded = {};
    public editingName = {};
    public SelectionType = SelectionType;
    public exportCSVData;
    public isReload = false;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * Constructor
     *
     * @param _oemService
     * @param _coreSidebarService
     * @param modalService
     */
    constructor(private _oemService: OemService,
                private _coreSidebarService: CoreSidebarService,
                private modalService: NgbModal ) {
        this._unsubscribeAll = new Subject();
    }

    /**
     * ngOnInit
     *
     */
    ngOnInit() {
       
        this._oemService.onItemsChange.subscribe(res => {
            this.ems = this.exportCSVData = this.tempData = res;
            
        });



        // content header
        this.contentHeader = {
            headerTitle: 'OEMS',
            actionButton: false, // TODO update actions for fast redirecting
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Dashboard',
                        isLink: true,
                        link: '/dashboard'
                    },
                    {
                        name: 'OEM List',
                        isLink: false
                    }
                ]
            }
        };
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Search (filter)
     *
     * @param event
     */
     filterUpdate(event) {
        const val = event.target.value.toLowerCase();
        this.ems = this.tempData.filter(function (d:OemModel) {
          let  searchByName = d.name ? d.name.toLowerCase().indexOf(val) !== -1: false;
          //let  searchByTEPN = d.tE_PN ? d.tE_PN.toLowerCase().indexOf(val) !== -1: false;
          //let  searchByCPN = d.customer_PN ? d.customer_PN.toLowerCase().indexOf(val) !== -1: false;
          return searchByName || !val;
        });
    
        this.table.offset = 0;
      }

    /**
     * For ref only, log selected values
     *
     * @param selected
     */
     onSelect({selected}) {

        this.selected.splice(0, this.selected.length);
        //this.selected.push(...selected);
        this.selected.push(selected);
    
        this.exportCSVData = selected;
        if (selected.length <= 0) {
          this.exportCSVData = this.ems;
        }
    
      }


    /**
     * Toggle Sidebar
     *
     * @param name
     */
    toggleSidebar(name) {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }




    /**
     * modalOpen
     *
     * @param modalDanger
     */
    modalOpen(modalDanger): void {
        this.modalService.open(modalDanger,
            {
                centered: true,
                windowClass: 'modal modal-danger'
            });
    }


    /**
     * Open Edit Oem
     *
     * @param id
     */
    async SelectItem(id) {
        await this._oemService.GetByIdAsync(id);
    }

    /**
     * delete item
     * @param id
     */
    async delete(id) {
        await this._oemService.DeleteAsync(id);
    }
}
