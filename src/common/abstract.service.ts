import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {

    protected constructor(
        protected readonly repository: Repository<any>
    ) {

    }
     
    async all(): Promise<any[]> {
        return this.repository.find();
   }

   async paginate(page: number =1 ): Promise<PaginatedResult> {
       const take = 15;
       const [users, total] = await this.repository.findAndCount({
           take,
           skip: (page-1) * take
       });
       return {
           data: users.map(user=>{
               const {password, ...data} = user;
               return data;
           }),
           meta: {
               total,
               page,
               last_page: Math.ceil(total/take)
           }
       }
   }

   async create(data): Promise<any> {
       return this.repository.save(data);
   }   


   async findOne(condition): Promise<any> {
       return this.repository.findOne({ where: condition });
   }
    
   async update(id: number, data): Promise<any> {
       return this.repository.update(id, data);
   }

   async delete(id: number): Promise<any> {
       return this.repository.delete(id);
   }
}
