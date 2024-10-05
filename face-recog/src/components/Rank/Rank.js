const Rank = ({name, entries}) => {
    return (
        <div>
            <div className="white f3">
                {`${name}, your entry count is...`}
                <div className="f1">{entries.entries}</div>
            </div>
        </div>
    );
}

export default Rank;