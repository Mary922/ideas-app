
import { DataTypes, Model, Optional, Sequelize } from "sequelize";


interface IIdeaAttributes {
    id?: number,
    idea_name: string,
    deletedAt: Date | null
}
interface IIdeaCreationAttributes extends Optional<IIdeaAttributes, 'id' | 'deletedAt'> { }

class Idea extends Model<IIdeaAttributes> implements IIdeaAttributes {
    declare id: number;
    declare idea_name: string;
    declare deletedAt: Date;
}

export function initIdeasModel(sequelize: Sequelize): void {
    Idea.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        idea_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    }, {
        sequelize, tableName: 'ideas', modelName: 'Idea', timestamps: false
    })
}


export { Idea }