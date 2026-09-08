function Image({ stage }) {
    return (
        <div>
            <img src={stage.imageUrl} alt={"error"} />
            <a href={stage.imageUrl} >Download</a>
        </div>
    )
}

export default Image