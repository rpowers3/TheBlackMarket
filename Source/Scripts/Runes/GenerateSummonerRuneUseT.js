//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchParticipants.aggregate(
  [
    {
      $unwind: "$runes"
    },
    {
      $group: {
        _id: {
          teamId: "$teamId",
          runeId: "$runes.runeId",
          runeRank: "$runes.rank"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: [ "$stats.winner", false ] } }
      }
    },
    {
      $sort: {
        "_id.runeId": 1,
        "_id.runeRank": 1,
      }
    },
    {
      $group: {
        _id: {
          teamId: "$_id.teamId"
        },
        runeId: { $push: "$_id.runeId" },
        runeRank: { $push: "$_id.runeRank" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "SummonerRuneUseT"
    }
  ],
  {
    allowDiskUse: true
  }
);
