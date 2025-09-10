import {
    Table,
    Column,
    DataType,
    Model,
    PrimaryKey,
    AllowNull,
    HasOne,
    HasMany,
    Default
} from "sequelize-typescript";
import user_permission from "./user.permission.model.js";
import emergency_contact from "./emergency.contact.model.js";

@Table
export default class user_data extends Model {

    @PrimaryKey @Column declare id: string; // firebase uid of user

    @Column declare dob: Date;

    @Default("Not disclosed") @Column({type: DataType.ENUM("Male", "Female", "Other", "Not disclosed")})  declare sex: string;

    @AllowNull(true) @Column({type: DataType.STRING, validate: {is: /^\d{1,3}\d{10,14}$/}}) declare phone_number: string;

    @AllowNull(true) @Column declare fcm_id: string;

    @HasOne(() => user_permission)
    declare permissions: user_permission;

    @HasMany(() => emergency_contact)
    declare emergency_contacts: emergency_contact[];


    public getAge(): number {
        if (!this.dob) return 18;
        const today = new Date();
        const birthDate = this.dob
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age == 0) {
            console.log("Age is 0, returning 18 instead")
            return 18;
        }
        
        return age;
    }


}

