import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import * as lifePhaseService from '../services/lifePhaseService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';
import LifePhaseList from './LifePhaseList';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [lifePhases, setLifePhases] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchPhases = async () => {
            try {
                const data = await lifePhaseService.index();
                setLifePhases(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (user) fetchPhases();
    }, [user]);

    const handleAddPhase = (newPhase) => {
        setLifePhases([newPhase, ...lifePhases]);
        setIsAdding(false);
    };

    return (
        <main>
            <div>
                <header>
                    <div>
                        <h1>Museum Floor Plan</h1>
                        <div>
                            <span>Curator: {user?.username}</span>
                            <span> | </span>
                            <span> {lifePhases.length} Rooms</span>
                        </div>
                    </div>
                    <button onClick={() => setIsAdding(true)}>
                        Open New Wing
                    </button>
                </header>

                <div>
                    <LifePhaseList lifePhases={lifePhases} />
                </div>
            </div>

            {isAdding && (
                <div>
                    <div>
                        <div>
                            <h2>New Exhibit</h2>
                            <button onClick={() => setIsAdding(false)}>✕</button>
                        </div>
                        <div>
                            <LifePhaseForm onAdd={handleAddPhase} onCancel={() => setIsAdding(false)} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;