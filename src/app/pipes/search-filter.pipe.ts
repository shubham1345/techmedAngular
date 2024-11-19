import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  // transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
  //   if (Object.keys(filter).length == 0) return items;
  

  //   let filterKeys = Object.keys(filter);

  //   return items.filter(item => {
  //     return filterKeys.every(keyName => {

  //       return (
  //         new RegExp(filter[keyName], 'gi').test(item[keyName]) ||
  //         filter[keyName] === ''
  //       );
  //     });
  //   });


  // }
  transform(list: any[], filters: Object) {
    const keys       = Object.keys(filters).filter(key => filters[key]);
    const filterUser = user => keys.every(key => user[key] === filters[key]);

    console.log(list,'iiiiiiiiiiii',filters);
    
    console.log(keys,'filter',filterUser);
    

    return keys.length ? list.filter(filterUser) : list;
  }
}
