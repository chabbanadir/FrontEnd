import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  category: CategoryModel;

  /**
   * constructor
   * @param _coreSidebarService
   * @param _categoryService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _categoryService: CategoryService) {}

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
      await this._categoryService.CreateAsync(this.category);
      this.category = new CategoryModel();
      this.toggleSidebar('add-category-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.category = new CategoryModel();
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }
}
