import { DataTypes, Model, Optional, Sequelize } from "sequelize";


interface IVoteAttributes {
    id?: number,
    idea_id: number,
    ip_address?: string,
    createdAt?: Date
}


class Vote extends Model<IVoteAttributes> implements IVoteAttributes {
    declare id: number;
    declare idea_id: number;
    declare ip_address: string;
    declare createdAt: Date;
}

export function initVotesModel(sequelize: Sequelize): void {
    Vote.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        idea_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                isIP: true
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize, tableName: 'votes', modelName: 'Vote', timestamps: false
    })
}


export { Vote }