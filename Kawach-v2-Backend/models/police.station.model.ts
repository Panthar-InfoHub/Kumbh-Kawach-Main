import { PrimaryKey, Model, Column, Table, HasMany, DataType } from "sequelize-typescript";
import ticket_data from "./ticket.data.model.js";


@Table
export default class police_station extends Model {

    @PrimaryKey @Column declare station_id: string;

    @Column declare station_name: string;

    @Column declare station_address: string;

    @Column({type: DataType.STRING, validate: {is: /^\d{1,3}\d{10,14}$/}}) declare station_phone: string;

    @Column declare station_email: string;

    @Column declare station_password: string; // Stored directly (No Hashing)

    @Column({type: DataType.DOUBLE}) declare station_latitude: number;

    @Column({type: DataType.DOUBLE}) declare station_longitude: number;

    @Column declare station_image: string;

    @HasMany(() => ticket_data)
    declare tickets: ticket_data[];
}
