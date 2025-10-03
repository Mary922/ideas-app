import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

interface Idea {
    id?: number;
    idea_name: string;
    deletedAt: Date | null;
    user_has_voted?: boolean
}

interface ApiResponse {
    data: Idea[];
    voted_idea_ids?: number[]
}

interface VoteResponse {
    success: boolean;
    message: string;
    vote: {
        id: number;
        idea_id: number;
        created_at: string;
    };
    idea: {
        id: number;
        idea_name: string;
        votes_count: number;
    };
}
interface AxiosError {
    name?: string;
    message?: string;
    response?: {
        status: number,
        data: {
            error: string
        }
    }
}

const Ideas = () => {
    const [ideasList, setIdeasList] = useState<Idea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [votingIdeas, setVotingIdeas] = useState<{ [key: number]: boolean }>({});
    const [votedIdeas, setVotedIdeas] = useState<{ [key: number]: boolean }>({});


    useEffect(() => {
        const abortController = new AbortController();
        (async () => {
            try {

                const response = await axios.get<ApiResponse>(`/api/ideas-votes/get`, {
                    signal: abortController.signal
                });
                // console.log('response', response);

                if (response?.data?.data) {
                    setIdeasList(response.data.data);

                    const initialVotedIdeas: { [key: number]: boolean } = {};
                    response.data.data.forEach((idea: Idea) => {
                        if (idea.id !== undefined && idea.user_has_voted) {
                            initialVotedIdeas[idea.id] = true;
                        }
                    });
                    setVotedIdeas(initialVotedIdeas);
                }
            } catch (error: unknown) {
                const axiosError = error as AxiosError;
                if (axiosError.name === 'CanceledError' || axiosError.name === 'AbortError') {
                    return;
                }
                console.error('Error fetching ideas:', error);
                toast.error("Не удалось загрузить список идей");
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            abortController.abort();
        };

    }, [])

    const handleVote = async (ideaId: number) => {
        try {
            setVotingIdeas(prev => ({ ...prev, [ideaId]: true }));

            const response = await axios.post<VoteResponse>(`/api/vote/create`, { ideaId });
            console.log('response data', response);

            if (response.data.success) {
                toast.success(response.data.message);
                setVotedIdeas(prev => ({ ...prev, [ideaId]: true }));
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error('Error voting:', error);

            if (axiosError.response?.status === 409) {
                const errorMessage = axiosError.response.data.error;
                toast.error(errorMessage);

                if (errorMessage === 'Вы уже голосовали за эту идею') {
                    setVotedIdeas(prev => ({ ...prev, [ideaId]: true }));
                }
            }
            else if (axiosError.response?.status === 400) {
                toast.error(axiosError.response.data.error || "Ошибка в запросе");
            }
            else if (axiosError.response?.status === 404) {
                toast.error(axiosError.response.data.error || "Идея не найдена");
            }
            else {
                toast.error("Не удалось отправить голос. Пожалуйста, попробуйте позже.");
            }
        } finally {
            setVotingIdeas(prev => ({ ...prev, [ideaId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="flex flex-col items-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-lg">Загрузка идей...</p>
                </div>
            </div>
        );
    }

    const ideas = ideasList.map((idea: Idea, index: number) => {
        const ideaId = idea.id !== undefined ? idea.id : index;
        const isVoting = votingIdeas[ideaId] || false;
        const isVoted = votedIdeas[ideaId] || false;

        return (
            <div key={idea.id || index} className="flex items-center gap-3 p-4 border rounded-lg mb-3 hover:bg-base-200 transition-colors">
                <div className="w-8 text-center font-semibold">{idea.id}</div>
                <div className="flex-1">
                    <div className="font-medium text-lg">{idea.idea_name}</div>
                </div>
                <button
                    className={`btn btn-sm min-w-32 ${isVoted
                        ? 'btn-success text-black border-0'
                        : 'btn-primary'
                        }`}
                    onClick={() => handleVote(ideaId)}
                    disabled={isVoting || isVoted}
                >
                    {isVoting ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Голосую...
                        </>
                    ) : isVoted ? (
                        <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Голос принят
                        </>
                    ) : (
                        "Проголосовать"
                    )}
                </button>
            </div>
        );
    });

    return (
        <>
            <div className="container mx-auto p-6 max-w-4xl">
                {ideasList.length > 0 && (
                    <div className="text-3xl text-center mb-8">Предлагаем список идей для развития нашего приложения</div>
                )}

                <div className="space-y-3 mb-8">
                    {ideasList.length > 0 ? ideas : (
                        <div className="text-center p-8 text-gray-500">
                            Нет доступных идей для голосования
                        </div>
                    )}
                </div>
            </div>

            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </>
    )
}

export default Ideas;