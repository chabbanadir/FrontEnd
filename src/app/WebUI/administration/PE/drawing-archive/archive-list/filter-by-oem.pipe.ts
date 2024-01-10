import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByOEM'
})
export class FilterByOEMPipe implements PipeTransform {
    transform(items: any[], filterOEM: string): any[] {
        if (!filterOEM || filterOEM === '') {
            return items;
        }
        filterOEM = filterOEM.toLowerCase();

        const filteredItems = items.filter(item => item.id_oem.toLowerCase() === filterOEM);
        console.log("filtre" + JSON.stringify(filteredItems));
        return filteredItems;
    }
}
