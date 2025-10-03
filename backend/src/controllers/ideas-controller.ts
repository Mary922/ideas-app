import { Request, Response } from "express";
import { Idea } from "../database/models/ideas.model";


export const getIdeas = async (req: Request, res: Response) => {

    try {
        const ideas = await Idea.findAll({
            where: {
                deletedAt: null
            },
            order: [['id', 'ASC']]
        })

        res.json({
            success: true,
            data: ideas
        });

    } catch (error) {
        console.error('Error fetching ideas:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}




