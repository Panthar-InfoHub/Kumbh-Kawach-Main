import { PrimaryKey, Model, Column, Table, DataType, BelongsTo, ForeignKey, AllowNull, Default } from "sequelize-typescript";
import userdata from "./user.data.model.js";

@Table
export default class emergency_contact extends Model {

    @PrimaryKey @Column declare contact_id: string; // This is not the firebase uid of the contact, but a unique id for the contact

    @Column
    @ForeignKey(() => userdata)
    declare user_id: string; // ID of the user the emergency contact belongs to

    @Default(null)
    @AllowNull(true)
    @Column({type: DataType.STRING})
    @ForeignKey(() => userdata)
    declare contact_firebase_uid: string; // Firebase UID of the emergency contact (if exists)

    @Column({type: DataType.STRING}) declare name: string; // Name of contact

    // 15-Digit numbers without + sign
    @Column({type: DataType.STRING, validate: {is: /^\d{1,3}\d{10,14}$/}}) declare phone_number: string;

    @Column({type: DataType.ENUM("Parent", "Spouse", "Child", "Friend", "Other")}) declare relationship: string;

    @Column({type: DataType.STRING, validate: {isEmail: true}}) declare email: string;

    @BelongsTo(() => userdata)
    declare user: userdata;

}
