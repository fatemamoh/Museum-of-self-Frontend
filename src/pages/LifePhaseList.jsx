import { Link } from 'react-router';

const LifePhaseList = (props) => {
  if (!props.lifePhases.length) {
    return (
      <div>
        <p>Archive Empty</p>
        <p>Awaiting first exhibition wing initialization...</p>
      </div>
    );
  }

  return (
   <section>
            {props.lifePhases.map((phase) => (
                <Link to={`/lifePhases/${phase._id}`} key={phase._id}>
                    <article>
                        <div>
                            <div>
                                <span>{new Date(phase.startDate).getFullYear()} {phase.endDate ? `— ${new Date(phase.endDate).getFullYear()}` : '— Present'}</span>
                            </div>
                            <h3>{phase.title}</h3>
                            <p>"{phase.summary}"</p>
                        </div>
                        <div>
                            <span>Enter Gallery</span>
                            <span>→</span>
                        </div>
                    </article>
                </Link>
            ))}
        </section>
  );
};

export default LifePhaseList;