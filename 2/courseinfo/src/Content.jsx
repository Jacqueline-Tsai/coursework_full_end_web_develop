import Part from './Part.jsx';

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part, index) => 
        <div key={part.id}>
          <Part part={part} />
        </div>
      )}
    </div>
  )
}

export default Content