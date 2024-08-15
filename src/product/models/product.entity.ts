import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('products')
export class Product {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ttile: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    price: number;


}