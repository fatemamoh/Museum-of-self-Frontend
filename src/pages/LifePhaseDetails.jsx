import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as lifePhaseService from '../services/lifePhaseService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';

const LifePhaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [phase, setPhase] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchPhase = async () => {
            try {
                const data = await lifePhaseService.index();
                const current = data.find(p => p._id === id);
                setPhase(current);
            } catch (error) {
                console.error(error);
            }
        }; 
        fetchPhase();
    }, [id]);

    const handleDelete = async () => {
        try {
            await lifePhaseService.deleteLifePhase(id);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = (updatedPhase) => {
        setPhase(updatedPhase);
        setIsEditing(false);
    };

    if (!phase) return <main>Retrieving Archive...</main>;

    return (
        <main>
            <div>
                <div>
                    <button onClick={() => navigate('/')}>← Back to Floor Plan</button>
                    <div>
                        <button onClick={() => setIsEditing(true)}>Modify Wing</button>
                        <button onClick={() => setShowDeleteModal(true)}>Delete Wing</button>
                    </div>
                </div>

                <article>
                    <div>
                        <div>
                            <span>Exhibition Record</span>
                            <h1>{phase.title}</h1>
                        </div>
                        <div>
                            <p>Phase Range</p>
                            <p>
                                {new Date(phase.startDate).getFullYear()}
                                {phase.endDate ? ` — ${new Date(phase.endDate).getFullYear()}` : ' — Present'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3>Gallery Overview</h3>
                            <p>"{phase.summary}"</p>
                        </div>
                    </div>
                </article>
            </div>

            {isEditing && (
                <div>
                    <div>
                        <div>
                            <div>
                                <h2>Renovate Wing</h2>
                                <button onClick={() => setIsEditing(false)}>✕</button>
                            </div>
                            <LifePhaseForm initialData={phase} onUpdate={handleUpdate} onCancel={() => setIsEditing(false)} />
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div>
                    <div>
                        <h2>Critical Action</h2>
                        <p>Are you sure you want to permanently erase the <span>"{phase.title}"</span> wing?</p>
                        <div>
                            <button onClick={handleDelete}>Confirm Destruction</button>
                            <button onClick={() => setShowDeleteModal(false)}>Abort & Return</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default LifePhaseDetails;