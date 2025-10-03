import { Request, Response } from "express";
import { Idea, Vote } from "../database/initialize";
import { ipIsLocalhost } from "../middlewares/ipMiddleware";


export const createVote = async (req: Request, res: Response) => {
    try {
        const { ideaId } = req.body;
        const ipAddress = req.clientIp;


        const isLocalhost = ipIsLocalhost(ipAddress);

        if (isLocalhost && process.env.NODE_ENV === 'production') {
            return res.status(400).json({
                error: 'Не удалось определить IP адрес'
            });
        }

        if (!ideaId) {
            return res.status(400).json({
                error: 'ID идеи обязателен'
            });
        }
        const idea = await Idea.findByPk(ideaId);
        if (!idea) {
            return res.status(404).json({
                error: 'Идея не найдена'
            });
        }


        const existingVote = await Vote.findOne({
            where: {
                idea_id: ideaId,
                ip_address: ipAddress
            }
        });

        if (existingVote) {
            return res.status(409).json({
                error: 'Вы уже голосовали за эту идею'
            });
        }

        const voteCount = await Vote.count({
            where: { ip_address: ipAddress }
        });

        if (voteCount >= 10) {
            return res.status(409).json({
                error: 'Превышен лимит голосов'
            });
        }


        const newVote = await Vote.create({
            idea_id: ideaId,
            ip_address: ipAddress
        });



        res.status(201).json({
            success: true,
            message: 'Голос принят',
            vote: {
                id: newVote.id,
                idea_id: newVote.idea_id,
                ip_address: newVote.ip_address,
                createdAt: newVote.createdAt
            },
            idea: {
                id: idea.id,
                idea_name: idea.idea_name,
                votes_count: voteCount
            }
        }
        );


    } catch (error) {
        console.error('Error creating vote:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}


export const getIdeasWithVotes = async (req: Request, res: Response) => {
    try {
        const ipAddress = req.clientIp;


        const isLocalhost = ipIsLocalhost(ipAddress);

        if (isLocalhost && process.env.NODE_ENV === 'production') {
            return res.status(400).json({
                success: false,
                error: 'Не удалось определить IP адрес'
            });
        }

        const ideas = await Idea.findAll({
            where: { deletedAt: null }
        });

        const userVotes = await Vote.findAll({
            where: { ip_address: ipAddress },
            attributes: ['idea_id']
        });

        const votedIdeaIds = new Set(userVotes.map(vote => vote.idea_id));

        const ideasWithVoteInfo = ideas.map(idea => ({
            id: idea.id,
            idea_name: idea.idea_name,
            deletedAt: idea.deletedAt,
            user_has_voted: votedIdeaIds.has(idea.id!)
        }));

        res.status(200).json({
            success: true,
            data: ideasWithVoteInfo,
            voted_idea_ids: Array.from(votedIdeaIds)
        });

    } catch (error) {
        console.error('Error getting ideas with votes:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}



