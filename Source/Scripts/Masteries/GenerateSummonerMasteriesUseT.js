//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchParticipants.aggregate(
  [
    {
      $unwind: "$masteries"
    },
    {
      $group: {
        _id: {
          teamId: "$teamId",
          masteryId: "$masteries.masteryId",
          masteryRank: "$masteries.rank"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: [ "$stats.winner", false ] } }
      }
    },
    {
      $sort: {
        "_id.masteryId": 1,
        "_id.masteryRank": 1,
      }
    },
    {
      $group: {
        _id: {
          teamId: "$_id.teamId"
        },
        masteryId: { $push: "$_id.masteryId" },
        masteryRank: { $push: "$_id.masteryRank" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "SummonerMasteriesUseT"
    }
  ],
  {
    allowDiskUse: true
  }
);
