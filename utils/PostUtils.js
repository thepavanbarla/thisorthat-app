export const getLikesString = (voters) => {
    var voteCount = voters.length;
    
    if(voteCount == 0)
        return (
            <Text style={{position: 'relative', left: -18, fontSize: 14, color: '#232323'}}>
                No votes yet
            </Text>
        )

    var firstVoterName = voters[0].userDetails.fullName
    if(voteCount == 1)
        return (
            <Text style={{position: 'relative', left: -18, fontSize: 14, color: '#232323'}}>
                <Text style={{fontWeight: '600'}}>{firstVoterName}</Text> voted
            </Text>
        )
    else
        return (
            <Text style={{position: 'relative', left: -18, fontSize: 14, color: '#232323'}}>
                <Text style={{fontWeight: '600'}}>{firstVoterName}</Text> and <Text style={{fontWeight: '600'}}>{(voteCount-1)} others</Text> voted
            </Text>
        )
}