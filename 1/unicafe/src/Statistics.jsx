import StatisticLine from './StatisticLine'

const Statistics = (props) => {
    const all = props.good + props.neutral + props.bad
    const average = props.good - props.bad
    const positive = (props.good / all * 100).toFixed(1) + '%';
    if (all === 0) {
        return(
            <div>
                no feedback given
            </div>
        )
    }
    return(
      <table>
        <tbody>
            <StatisticLine text="good" value={props.good} />
            <StatisticLine text="neutral" value={props.neutral} />
            <StatisticLine text="bad" value={props.bad} />
            <StatisticLine text="all" value={all} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    )
}

export default Statistics