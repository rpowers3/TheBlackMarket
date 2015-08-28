//
// Utility script that will pull the list of champion ids out of the
// champion stats table and return it as a single record with an array
// of ids.
//
// Dependencies:
//   GenerateChampionStats
//
db.ChampionStats.aggregate(
  {
    $project: {
      championIds: { $literal: '' },
      championId: "$_id.championId",
    }
  },
  {
    $group: {
      _id: { championIds: "$championIds" },
      championIds: { $push: "$championId" }
    }
  },
  { $sort: { championId: 1 } }
);