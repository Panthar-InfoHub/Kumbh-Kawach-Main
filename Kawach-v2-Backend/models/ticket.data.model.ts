import { Column, PrimaryKey, Table, ForeignKey, BelongsTo, Model, DataType, AllowNull, Default } from "sequelize-typescript";
import userdata from "./user.data.model";
import police_station from "./police.station.model";

type CriticalInformationType = {
    is_fake: boolean;
    immediateThreats: string[];
    location: string;
    weapons: {
        present: boolean;
        details: string[];
    };
};

type PriorityType = {
    score: number;
    justification: {
        hindi: string;
        english: string;
    };
};

type SummaryType = {
    english: {
        text: string;
    };
    hindi: {
        text: string;
    };
    confidence_score: string
};

export type InitialMediaAnalysisType = {
    criticalInformation: CriticalInformationType;
    priority: PriorityType;
    summary: SummaryType;
};


@Table
export default class ticket_data extends Model {

    @PrimaryKey @Column declare ticket_id: string;

    @Column @ForeignKey(() => userdata) declare user_id: string;

    @AllowNull(true)
    @ForeignKey(() => police_station) 
    @Column 
    declare station_id: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    }) declare ticket_priority: number;

    @Default("Active") @Column({type: DataType.ENUM("Active", "Closed")}) declare status: string;

    @Column({
        type: DataType.JSON,
        defaultValue: []
    }) declare images: {
        image_id: string;
        image_url: string;
        bucket_url: string;
        transcript: {
            english: string,
            hindi: string,
            confidence_score: string,
            identified_location: string,
        };
        created_at: Date;
    }[];

    @Column({
        type: DataType.JSON,
        defaultValue: []
    }) declare audio: {
        audio_id: string;
        audio_url: string;
        bucket_url: string;
        transcript: {
            english: string,
            hindi: string,
            confidence_score: string,
        };
        created_at: Date;
    }[];

    @Column({
        type: DataType.JSON,
        defaultValue: []
    }) declare video: {
        video_id: string;
        video_url: string;
        bucket_url: string;
        description: {
            english: string,
            hindi: string,
            confidence_score: string
        };
        created_at: Date;
    }[];

    @Column({
        type: DataType.JSON,
        defaultValue: []
    }) declare location_data: {
        latitude: number;
        longitude: number;
        created_at: Date;
    }[];

    @Column({
        type: DataType.JSON
    }) declare initial_analysis: InitialMediaAnalysisType;


    @AllowNull(true)
    @Default(null)
    @Column({
        type: DataType.TEXT
    }) declare transfer_reason: string;

    @BelongsTo(() => userdata)
    declare user: userdata;

    @BelongsTo(() => police_station, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    declare station: police_station;

}


