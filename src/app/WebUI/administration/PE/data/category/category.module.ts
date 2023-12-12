import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DATAModule} from "../data.module";

import { CategoryListComponent } from './category-list/category-list.component';
import { AddCategoryComponent } from './category-list/add-category/add-category.component';
import { EditCategoryComponent } from './category-list/edit-category/edit-category.component';

import {CategoryService} from "./services/category.service";

const routes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
    resolve: {
      uls: CategoryService
    },
    data: {animation: 'categories'}
  }
];

@NgModule({
  declarations: [
    CategoryListComponent,
    AddCategoryComponent,
    EditCategoryComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    DATAModule
  ],
  providers: [CategoryService]
})
export class CategoryModule { }
