import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg==='') return value
    const retultPost=[]
    for(const post of value){
      if(post.titular.toLowerCase().indexOf(arg.toString().toLowerCase())> -1 ||
         post.numeroTarjeta.indexOf(arg)> -1 ||
         post.fechaExpiracion.indexOf(arg)> -1){
        retultPost.push(post)
      }
    }
    return retultPost

  }

}
