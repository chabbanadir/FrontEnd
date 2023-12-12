import { environment } from 'environments/environment';
import {OemModel} from "../Domain/Entities/MasterData/Oem.model";

export class ApplicationDbContext {

    // api url
    public readonly api_url: string;

    // entities
    public Oems: OemModel[] = [];

    constructor() {
        this.api_url = `${environment.apiUrl}`;
    }



    public Set(entity: any): void
    {
        console.log(typeof  entity);
        let vars = Object.getOwnPropertyDescriptors(new ApplicationDbContext);
        console.log( this.constructor );

        // return (Array<TEntity>)((this.Oems)).Get
      //  console.log(x.name);
        /*if(this.Oems == TEntity&Function.name){

        }

        if(typeof this.Oems){

        }
        return a;*/
      //    return (DbSet<TEntity>)((IDbSetCache)this).GetOrAddSet(DbContextDependencies.SetSource, typeof(TEntity));
    }


}