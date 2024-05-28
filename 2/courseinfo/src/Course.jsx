import Header from './Header.jsx';
import Content from './Content.jsx';
import Total from './Total.jsx';

const Course = (props) => {
    return (
        <div>
            <Header text={props.course.name} />
            <Content parts={props.course.parts} />
            <Total total={props.course.parts.reduce((acc, part) => acc + part.exercises, 0)} />
        </div>
    )
}

export default Course