import { BelongsTo, Model, Table } from "sequelize-typescript";
import { Column, PrimaryKey, ForeignKey } from "sequelize-typescript";
import userdata from "./user.data.model.js";

@Table
export default class user_permission extends Model {

    @PrimaryKey @ForeignKey(() => userdata) @Column declare id: string; // firebase uid of user

    @Column declare allow_sms_notifications: boolean;

    @Column declare allow_email_notifications: boolean;

    @Column declare allow_push_notifications: boolean;

    @Column declare generate_sos_alerts: boolean;

    @BelongsTo(() => userdata) 
    declare user: userdata;

}
