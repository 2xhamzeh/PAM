import {developerStudent} from "./ueberDataBase.ts";
import './aboutBody.scss'



const AboutBody = () => {
    return (
        <div className='about-body'>
            {developerStudent.map((project, index) => (
                <div className='about-container' key={index}>
                    <h1 className='about-title'>{project.heading}</h1>
                    <p className='about-description'>{project.description}</p>
                    <div className='about-team'>
                        {project.team.map((member, idx) => (
                            <span className='team-member' key={idx}>{member}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AboutBody