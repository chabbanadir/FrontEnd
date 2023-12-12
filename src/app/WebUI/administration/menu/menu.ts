import {CoreMenu} from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'DashBoard',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'dashboard',
    classes: 'mt-2'
  },
  {
    id: 'PE_section',
    type: 'section',
    title: 'PE Department',
    translate: 'MENU.PE_Department.SECTION',
    children: [
      {
        id: 'drawing',
        title: 'Drawing Generator',
        translate: 'MENU.PE_Department.DRAWING',
        type: 'item',
        icon: 'pen-tool',
        url: 'PE/drawingGenerator/newPN',
      },
      {
        id: 'drawin',
        title: 'Drawing Archive',
        type: 'item',
        icon: 'pen-tool',
        classes: 'ml-1',
        url: 'PE/drawingArchive',
      },
      {
        id: 'data',
        title: 'DATA',
        translate: 'MENU.PE_Department.DATA.NAME',
        type: 'collapsible',
        icon: 'database',
        children: [
          {
            id: 'oem',
            title: 'Oems',
            translate: 'MENU.PE_Department.DATA.CHILD.OEM',
            type: 'item',
            icon: 'corner-down-right',
            classes: 'ml-1',
            url: 'PE/data/oems',
          },
          {
            id: 'category',
            title: "Categories",
            translate: 'MENU.PE_Department.DATA.CHILD.CATEGORIES',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            classes: 'ml-1',
            url: 'PE/data/categories',
          },
          {
            id: 'configurations',
            title: "Configurations",
            translate: 'MENU.PE_Department.DATA.CHILD.CONFIGURATION',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            classes: 'ml-1',
            url: 'PE/data/configurations',
          },
          {
            id: 'cable',
            title: 'Cables',
            translate: 'MENU.PE_Department.DATA.CHILD.CABLES',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            classes: 'ml-1',
            url: 'PE/data/cables',
          },
          // {
          //   id: 'infos',
          //   title: 'Part Numbers',
          // //  translate: 'MENU.PE_Department.DATA.CHILD.INFOS',
          //   type: 'item',
          //   role: ['Admin'], // To set multiple role: ['Admin', 'Client']
          //   icon: 'corner-down-right',
          //   classes: 'ml-1',
          //   url: 'PE/data/infos',
          // },
          {
            id: 'component',
            title: "Components",
            translate: 'MENU.PE_Department.DATA.CHILD.COMPONENTS',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            classes: 'ml-1',
            url: 'PE/data/components',
          },
          {
            id: 'harness',
            title: 'Customers Notes',
            translate: 'MENU.PE_Department.DATA.CHILD.HARNESS',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            classes: 'ml-1',
            url: 'PE/data/harnessmakers'
          }
          ]
      },
      {
        id: 'Notes',
        title: 'Notes',
        translate: 'MENU.PE_Department.NOTES.NAME',
        type: 'collapsible',
        icon: 'book',
        children: [
          {
            id: 'configuration',
            title: 'Configs Notes',
            translate: 'MENU.PE_Department.NOTES.CHILD.CONFIGURATIONS',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            url: 'PE/notes/configurations'
          },
          {
            id: 'CustomerDrawing',
            title: 'CD Notes',
            translate: 'MENU.PE_Department.NOTES.CHILD.CUSTOMERDRAWING',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            url: 'PE/notes/customer'
          },
          {
            id: 'ProductionDrawing',
            title: 'PD Notes',
            translate: 'MENU.PE_Department.NOTES.CHILD.PRODUCTIONDRAWING',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            url: 'PE/notes/production'
          },

          {
            id: 'packaging',
            title: 'Packaging ',
            translate: 'MENU.PE_Department.NOTES.CHILD.PACKAGING',
            type: 'item',
            role: ['Admin'], // To set multiple role: ['Admin', 'Client']
            icon: 'corner-down-right',
            url: 'PE/notes/Packaging'
          }
        ]
      }
    ]
  },
]
