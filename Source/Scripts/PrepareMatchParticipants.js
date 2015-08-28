//
// Generate a document store with only the participant data flattened out.
// This is done to make future work on the participant data quicker.
//
db.Matches.aggregate(
  { 
    $unwind: "$participants"
  },
  {
    $project: {
      _id: false,
      "matchId": true,
      "region": true,
      "platformId": true,
      matchCreation: {
        $add: [ new Date(0), "$matchCreation" ]
      },
      "matchDuration": true,
      "matchVersion": true,
      "teamId": "$participants.teamId",
      "participantId": "$participants.participantId",
      "spell1Id": "$participants.spell1Id",
      "spell2Id": "$participants.spell2Id",
      "championId": "$participants.championId",
      "highestAchievedSeasonTier": "$participants.highestAchievedSeasonTier",
      "masteries": "$participants.masteries",
      "runes": "$participants.runes",
      "stats": "$participants.stats"
    }
  },
  {
    $out: "MatchParticipants"
  }
);

// Generate indices to assist performing queries.
db.MatchParticipants.createIndex({ matchId: 1 });
db.MatchParticipants.createIndex({ region: 1 });
db.MatchParticipants.createIndex({ matchCreation: 1 });
db.MatchParticipants.createIndex({ championId: 1 });