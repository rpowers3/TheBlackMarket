//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchParticipants.aggregate(
  [
    {
      $group: {
        _id: {
          _id: "$_id",
          region: "$region",
          teamId: "$teamId",
          winner: "$stats.winner",
        },
        spell1: { $addToSet: "$spell1Id" },
        spell2: { $addToSet: "$spell2Id" }
      }
    },
    {
      $project: {
        spells: { $setUnion: ["$spell1", "$spell2"] }
      }
    },
    {
      $unwind: "$spells"
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          teamId: "$_id.teamId",
          spell: "$spells"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: ["$_id.winner", false] } }
      }
    },
    {
      $sort: {
        "_id.spell": 1
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          teamId: "$_id.teamId"
        },
        spell: { $push: "$_id.spell" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "SummonerSpellUseRT"
    }
  ],
  {
    allowDiskUse: true
  }
);
