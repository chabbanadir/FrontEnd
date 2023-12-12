import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {


  public category: CategoryModel;


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Constructor
   *
   * @param _categoryService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _categoryService: CategoryService, private _coreSidebarService: CoreSidebarService) {
    this.category = new CategoryModel();
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
    this._categoryService.onItemChange.subscribe(res => {
      this.category = res;
    });
  }


  /**
   * onSubmit
   */
  async onSubmit(form) {
    if (form.valid) {
      await this._categoryService.UpdateAsync(this.category, this.category.id);
      this.category = new CategoryModel();
      this.toggleSidebar('edit-category-sidebar');
    }
  }


  status(): typeof Status{
    return Status;
  }

  onCheck(value:boolean){

  }

}
